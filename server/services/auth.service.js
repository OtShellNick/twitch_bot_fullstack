'use strict';

const { createJwtToken, decodeJwtToken } = require("../helpers/jwtToken");
const { Errors: { MoleculerError } } = require('moleculer');
const db = require("../methods/db.methods");
const { 
  getAuthData, 
  getUserInfoByAuthCode, 
  becomeChannelModerator, 
  getAccessToken
} = require("../methods/twitch.methods");

/**
 * Модуль для аутентификации и авторизации пользователя.
 * @module auth
 */

module.exports = {
  name: "auth",
  version: 1,
  actions: {
    /**
     * Авторизация пользователя.
     * @action login
     * @rest POST /login
     * @param {Object} params - Параметры запроса.
     * @param {string} params.code - Код авторизации.
     * @returns {Object} - Объект с данными JWT токена и статусом ответа.
     */
    login: {
      rest: "POST /login",
      params: {
        code: { type: "string", optional: false },
      },
      /**
       * Обрабатывает заданные параметры и выполняет различные операции.
       *
       * @param {object} params - Параметры для функции.
       * @param {string} params.code - Параметр code.
       * @return {object} - Результат выполнения функции.
       * @throws {MoleculerError} - Если произошла ошибка во время выполнения функции.
       */
      handler: async ({ params }) => {
        try {
          const { code } = params;

          const authData = await getAuthData(code);
          const { data: [user] } = await getUserInfoByAuthCode(authData);

          user.refresh_token = authData.refresh_token;

          const currentUser = await db.getRow('users', { id: user.id });

          if (!currentUser) {
            user.bot_status = 0;

            await db.addRow('users', user);
            await becomeChannelModerator(user.id, authData.access_token);
          } else {
            console.log(`User ${user.id} already exists. Update refresh_token and etc.`);
            await db.editRow('users', { id: user.id }, user);
          }

          const jwtData = await createJwtToken({
            id: user.id,
            access_token: authData.access_token,
            end_time: parseInt(Date.now() / 1000) + authData.expires_in,
            expires_in: authData.expires_in,
          }, Math.floor(Date.now() / 1000) + authData.expires_in);

          return { data: jwtData, status: 200 };
        } catch (err) {
          console.log('Login Error', err);

          if(!(err instanceof MoleculerError)) {
            const { status, data } = err;
            switch (status) {
              case 400:
                throw new MoleculerError(data.message, 400, 'BAD_REQUEST', { message: data.message });
              default:
                throw new MoleculerError('Internal server error', 500, 'INTERNAL_SERVER_ERROR', { message: 'Internal server error' });   
            }
          }

          throw new MoleculerError(
            err.message || 'Internal server error',
            err.code || 500,
            err.type || 'INTERNAL_SERVER_ERROR',
            err.data || { error: 'Internal server' }
          );
        }
      },
    },

    /**
     * Обновление JWT токена пользователя.
     * @action refresh
     * @rest POST /refresh
     * @param {Object} params - Параметры запроса.
     * @param {string} params.token - Токен для обновления.
     * @returns {Object} - Объект с данными нового JWT токена и статусом ответа.
     */
    refresh: {
      rest: "POST /refresh",
      params: {
        token: { type: "string", optional: false },
      },
      /**
       * Асинхронно обрабатывает запрос.
       *
       * @param {object} params - Объект параметров.
       * @param {string} params.token - Параметр токена.
       * @return {object} - Результат функции.
       * @property {string} data - Новый JWT.
       * @property {number} status - Код состояния HTTP.
       * @throws {MoleculerError} - Если возникла ошибка.
       */
      handler: async ({params}) => {
        const { token } = params;

        try {
          const { id } = await decodeJwtToken(token);

          const user = await db.getRow('users', {id});

          if (!user) throw new MoleculerError('User not found', 404, 'NOT_FOUND', { error: 'User not found' });

          const authData = await getAccessToken(user.refresh_token);

          const newJwt = await createJwtToken({
            id: user.id,
            access_token: authData.access_token,
            end_time: parseInt(Date.now() / 1000) + authData.expires_in,
            expires_in: authData.expires_in,
          }, Math.floor(Date.now() / 1000) + authData.expires_in);

          return { data: newJwt, status: 200 };
        } catch (err) {
          console.log('Refresh Error', err);
          throw new MoleculerError(
            err.message || 'Internal server error',
            err.code || 500,
            err.type || 'INTERNAL_SERVER_ERROR',
            err.data || { error: 'Internal server' }
          );
        }
      }
    }
  },
};

