'use strict';
const { ObjectID } = require('mongodb');
const db = require("../methods/db.methods");

module.exports = {
  name: "timer",
  version: 1,
  actions: {
    ['add']: {
      rest: "POST /",
      params: {
        name: { type: 'string', max: 50, optional: false },
        message: { type: 'string', min: 10, max: 500, optional: false },
        interval: { type: 'number', min: 1, max: 60000, optional: false },
        timer_status: { type: 'number', default: 1, optional: true },
        chat_lines: {type: 'number', min: 0, max: 100, default: 0, optional: true },
        announce: {type: 'number', default: 0, optional: true},
      },

      handler: async (ctx) => {
        try {
          let id = ctx?.meta?.session?.id;
          if (!id) {
            return { error: "INVALID_TOKEN", status: 403 };
          }

          let timer = {
            user_id: id,
            name: ctx.params.name,
            message: ctx.params.message,
            interval: ctx.params.interval,
            timer_status: ctx.params.timer_status,
            chat_lines: ctx.params.chat_lines,
            announce: ctx.params.announce
          };

          await db.addRow('timers', timer);

          return { data: timer, status: 200 };

        } catch (err) {
          console.log(err);
          return { error: "INTERNAL_ERROR", status: 500 };
        }
      },
    },

    ['delete']: {
      rest: "DELETE /",
      params: {
        timer_id: { type: 'string', optional: false }
      },

      handler: async (ctx) => {
        try {
          let user_id = ctx?.meta?.session?.id;
          if (!user_id) {
            return { error: "INVALID_TOKEN", status: 403 };
          }

          let _id = ctx.params.timer_id;

          let result = await db.deleteRow('timers', { _id: new ObjectID(_id), user_id });
          if(result.matchedCount == 0){
            return { error: "NOT_FOUND", status: 400 };
          }

          return { status: 200 };

        } catch (err) {
          console.log(err);
          return { error: "INTERNAL_ERROR", status: 500 };
        }
      },
    },

    ['edit']: {
      rest: "PUT /",
      params: {
        timer_id: { type: 'string', optional: false },
        name: { type: 'string', max: 50, optional: true },
        message: { type: 'string', min: 10, max: 500, optional: true },
        interval: { type: 'number', min: 1, max: 60000, optional: true },
        timer_status: { type: 'number', optional: true },
        chat_lines: {type: 'number', min: 0, max: 100, optional: true },
        announce: {type: 'number', optional: true}
      },

      handler: async (ctx) => {
        let { timer_id, name, message, interval, timer_status, chat_lines, announce } = ctx.params;

        let user_id = ctx?.meta?.session?.id;
        if (!user_id) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        let result = await db.editRow('timers',
          { _id: new ObjectID(timer_id), user_id },
          { name, message, interval, timer_status, chat_lines, announce }
        );

        if(result.matchedCount == 0){
          return { error: "NOT_FOUND", status: 400 };
        }

        return { status: 200 };
      },
    },

    ['list']: {
      rest: "GET /list",
      handler: async (ctx) => {
        let user_id = ctx?.meta?.session?.id;
        if (!user_id) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        return {
          data: await db.getAllRows('timers', { user_id, deleted: { $exists: false } }), 
          status: 200 
        };
      },
    }
  },
};