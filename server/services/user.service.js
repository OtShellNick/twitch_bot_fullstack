'use strict';

const { Errors: { MoleculerError } } = require('moleculer');
const db = require("../methods/db.methods");

/**
 * Модуль для работы с пользователями.
 * @module user
 */

module.exports = {
  name: "user",
  version: 1,
  actions: {
    /**
     * Получение информации о текущем пользователе.
     * @action self
     * @rest GET /self
     * @param {Object} ctx - Контекст запроса.
     * @returns {Object} - Объект с данными пользователя и статусом ответа.
     */
    self: {
      rest: "GET /self",
      handler: async ({meta}) => {
        try {
          const { id } = meta.session;

          // Получение информации о пользователе из базы данных
          const user = await db.getRow('users', { id });

          // Если пользователь не найден, генерируем ошибку
          if (!user) {
            throw new MoleculerError('User not found', 404, 'USER_NOT_FOUND', { message: 'User not found' });
          }

          // Формирование объекта с данными пользователя
          const userData = {
            id: user.id,
            login: user.login,
            display_name: user.display_name,
            profile_image_url: user.profile_image_url,
            bot_status: user.bot_status
          };

          return { data: userData, status: 200 };

        } catch (err) {
          console.log('get user self error', err);

          // Генерация MoleculerError в случае ошибки
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
     * Получение списка всех пользователей.
     * @action list
     * @rest GET /list
     * @returns {Object} - Объект с данными всех пользователей и статусом ответа.
     */
    list: {
      rest: "GET /list",
      /**
       * Получение всех записей из таблицы "users" в базе данных.
       *
       * @returns {Promise<Object>} - Объект с данными всех пользователей и статусом ответа.
       */
      handler: async () => {
        return { 
          data: await db.getAllRows('users'), 
          status: 200 
        };
      },
    },

  },
};
