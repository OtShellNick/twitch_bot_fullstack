'use strict';
const { ObjectId } = require('mongodb');
const db = require("../methods/db.methods");

module.exports = {
  name: "timer",
  version: 1,
  actions: {
    /**
     * Добавление таймера.
     *
     * @action add
     * @rest POST /
     * @param {Object} meta - Метаинформация запроса.
     * @param {Object} params - Параметры запроса.
     * @param {string} params.name - Название таймера.
     * @param {string} params.message - Сообщение таймера.
     * @param {number} params.interval - Интервал таймера.
     * @param {number} [params.timer_status=1] - Статус таймера.
     * @param {number} [params.chat_lines=0] - Количество строк чата.
     * @param {number} [params.announce=0] - Флаг анонса.
     * @returns {Object} - Объект с данными добавленного таймера и статусом ответа.
     */
    add: {
      rest: "POST /",
      params: {
        name: { type: 'string', max: 50, optional: false },
        message: { type: 'string', min: 10, max: 500, optional: false },
        interval: { type: 'number', min: 1, max: 60000, optional: false },
        timer_status: { type: 'number', default: 1, optional: true },
        chat_lines: { type: 'number', min: 0, max: 100, default: 0, optional: true },
        announce: { type: 'number', default: 0, optional: true },
      },

      /**
       * Обработчик для добавления таймера.
       *
       * @param {Object} ctx - Контекст выполнения.
       * @param {Object} ctx.meta - Метаинформация запроса.
       * @param {Object} ctx.params - Параметры запроса.
       * @param {string} ctx.params.name - Название таймера.
       * @param {string} ctx.params.message - Сообщение таймера.
       * @param {number} ctx.params.interval - Интервал таймера.
       * @param {number} [ctx.params.timer_status=1] - Статус таймера.
       * @param {number} [ctx.params.chat_lines=0] - Количество строк чата.
       * @param {number} [ctx.params.announce=0] - Флаг анонса.
       * @returns {Object} - Объект с данными добавленного таймера и статусом ответа.
       */
      handler: async ({ meta, params }) => {
        try {
          const { id } = meta.session;

          const timer = {
            user_id: id,
            name: params.name,
            message: params.message,
            interval: params.interval,
            timer_status: params.timer_status,
            chat_lines: params.chat_lines,
            announce: params.announce
          };

          await db.addRow('timers', timer);

          return { data: timer, status: 200 };

        } catch (err) {
          console.log(err);
          return { error: "INTERNAL_ERROR", status: 500 };
        }
      },
    },


    /**
      * Удаление таймера по идентификатору.
      *
      * @action delete
      * @rest DELETE /
      * @param {Object} meta - Метаинформация запроса.
      * @param {Object} params - Параметры запроса.
      * @param {string} params.timer_id - Идентификатор таймера.
      * @returns {Object} - Объект с статусом ответа.
      */
    delete: {
      rest: "DELETE /",
      params: {
        timer_id: { type: 'string', optional: false }, // Идентификатор таймера (обязательный параметр)
      },

      /**
       * Обработчик для удаления таймера по идентификатору.
       *
       * @param {Object} ctx - Контекст выполнения.
       * @param {Object} ctx.meta - Метаинформация запроса.
       * @param {Object} ctx.params - Параметры запроса.
       * @param {string} ctx.params.timer_id - Идентификатор таймера.
       * @returns {Object} - Объект со статусом ответа.
       */
      handler: async ({ meta, params }) => {
        try {
          const { id: user_id } = meta.session;

          const _id = params.timer_id;

          const result = await db.deleteRow('timers', { _id: ObjectId(_id), user_id });
          if (result.matchedCount == 0) {
            throw new MoleculerError('Not found', 404, 'NOT_FOUND', { message: 'Not found' });
          }

          return { status: 200 };

        } catch (err) {
          console.log('delete timer error', err);

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
       * Редактирование таймера по идентификатору.
       *
       * @action edit
       * @rest PUT /
       * @param {Object} meta - Метаинформация запроса.
       * @param {Object} params - Параметры запроса.
       * @param {string} params.timer_id - Идентификатор таймера.
       * @param {string} [params.name] - Название таймера.
       * @param {string} [params.message] - Сообщение таймера.
       * @param {number} [params.interval] - Интервал таймера.
       * @param {number} [params.timer_status] - Статус таймера.
       * @param {number} [params.chat_lines] - Количество строк чата.
       * @param {number} [params.announce] - Флаг анонса.
       * @returns {Object} - Объект со статусом ответа.
       */
    edit: {
      rest: "PUT /",
      params: {
        timer_id: { type: 'string', optional: false }, // Идентификатор таймера (обязательный параметр)
        name: { type: 'string', max: 50, optional: true }, // Название таймера (необязательный параметр)
        message: { type: 'string', min: 10, max: 500, optional: true }, // Сообщение таймера (необязательный параметр)
        interval: { type: 'number', min: 1, max: 60000, optional: true }, // Интервал таймера (необязательный параметр)
        timer_status: { type: 'number', optional: true }, // Статус таймера (необязательный параметр)
        chat_lines: { type: 'number', min: 0, max: 100, optional: true }, // Количество строк чата (необязательный параметр)
        announce: { type: 'number', optional: true }, // Флаг анонса (необязательный параметр)
      },

      /**
       * Обработчик для редактирования таймера по идентификатору.
       *
       * @param {Object} ctx - Контекст выполнения.
       * @param {Object} ctx.meta - Метаинформация запроса.
       * @param {Object} ctx.params - Параметры запроса.
       * @param {string} ctx.params.timer_id - Идентификатор таймера.
       * @param {string} [ctx.params.name] - Название таймера.
       * @param {string} [ctx.params.message] - Сообщение таймера.
       * @param {number} [ctx.params.interval] - Интервал таймера.
       * @param {number} [ctx.params.timer_status] - Статус таймера.
       * @param {number} [ctx.params.chat_lines] - Количество строк чата.
       * @param {number} [ctx.params.announce] - Флаг анонса.
       * @returns {Object} - Объект со статусом ответа.
       */
      handler: async ({ meta, params }) => {
        // Извлечение параметров из объекта params
        let { timer_id, name, message, interval, timer_status, chat_lines, announce } = params;

        // Извлечение идентификатора пользователя из метаинформации
        let { id: user_id } = meta.session;

        try {
          // Редактирование строки в базе данных
          let result = await db.editRow(
            'timers',
            { _id: ObjectId(timer_id), user_id }, // Условие поиска
            { name, message, interval, timer_status, chat_lines, announce } // Обновляемые поля
          );

          // Проверка, была ли найдена строка для редактирования
          if (result.matchedCount === 0) {
            // Если не была найдена, выбрасываем ошибку
            throw new MoleculerError('Not found', 404, 'NOT_FOUND', { message: 'Not found' });
          }

          // Возвращаем объект с статусом ответа
          return { status: 200 };
        } catch (err) {
          console.log('edit timer error', err);

          // Генерируем объект с ошибкой
          throw new MoleculerError(
            err.message || 'Internal server error',
            err.code || 500,
            err.type || 'INTERNAL_SERVER_ERROR',
            err.data || { error: 'Internal server' }
          );
        }
      },
    },


    list: {
      rest: "GET /list",
      /**
       * Получение списка всех таймеров для текущего пользователя.
       * @action list
       * @rest GET /list
       * @param {Object} meta - Метаинформация запроса.
       * @returns {Object} - Объект с данными всех таймеров и статусом ответа.
       */
      handler: async ({ meta }) => {
        try {
          const { id: user_id } = meta.session;

          // Получение всех таймеров из базы данных для текущего пользователя
          const timers = await db.getAllRows('timers', { user_id, deleted: { $exists: false } });

          return {
            data: timers,
            status: 200
          };
        } catch (err) {
          console.log('get timers list error', err);

          // Генерация MoleculerError в случае ошибки
          throw new MoleculerError(
            err.message || 'Internal server error',
            err.code || 500,
            err.type || 'INTERNAL_SERVER_ERROR',
            err.data || { error: 'Internal server' }
          );
        }
      },
    }

  },
};