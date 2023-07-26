'use strict';

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
      handler: async (ctx) => {
        try {
          let id = ctx?.meta?.session?.id;
          if (!id) {
            return { error: "INVALID_TOKEN", status: 403 };
          }

          let user = await db.getRow('users', {id});
          if(!user){
            return {error: 'USER_NOT_FOUND', status: 400};
          }

          user = {
            id: user.id,
            login: user.login,
            display_name: user.display_name,
            profile_image_url: user.profile_image_url,
            bot_status: user.bot_status
          };

          return { data: user, status: 200 };

        } catch (err) {
          console.log(err);
          return { error: "INTERNAL_ERROR", status: 500 };
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
      handler: async (req) => {
        return { 
          data: await db.getAllRows('users'), 
          status: 200 
        };
      },
    },

  },
};
