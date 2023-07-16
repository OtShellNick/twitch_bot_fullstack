'use strict';
const { Errors: { MoleculerError } } = require('moleculer');
const { ObjectId } = require('mongodb');
const db = require("../methods/db.methods");

module.exports = {
  name: "timers",
  version: 1,
  actions: {
    add: {
      rest: "POST /add",
      params: {
        name: { type: 'string', max: 50, optional: false },
        message: { type: 'string', min: 10, max: 500, optional: false },
        interval: { type: 'number', min: 1, max: 60000, optional: false },
        timer_status: { type: 'number', default: 1, optional: true },
        chat_lines: { type: 'number', min: 0, max: 100, default: 0, optional: true },
        announce: { type: 'number', default: 0, optional: true },
      },
      handler: async ({ meta, params }) => {
        try {
          const { id } = meta.session;
          const { name, message, interval, timer_status, chat_lines, announce } = params;

          let timer = {
            user_id: id,
            name,
            message,
            interval,
            timer_status,
            chat_lines,
            announce
          };

          await db.addRow('timers', timer);

          return { data: timer, status: 200 };

        } catch (err) {

          console.log('Add Timer error', err);

          throw new MoleculerError(
            err.message || 'Internal server error',
            err.code || 500,
            err.type || 'INTERNAL_SERVER_ERROR',
            err.data || { error: 'Internal server' }
          );
        }
      },
    },

    delete: {
      rest: "DELETE /delete",
      params: {
        timer_id: { type: 'string', optional: false }
      },

      handler: async ({ params }) => {
        try {

          const { timer_id } = params;
          console.log('timer id', timer_id);

          const { matchedCount } = await db.deleteRow('timers', { _id: ObjectId(timer_id) });

          if (matchedCount === 0) throw new MoleculerError('Timer not found', 404, 'NOT_FOUND', { message: 'Timer not found' });

          return { status: 200 };

        } catch (err) {
          console.log('Delete timer error', err);

          throw new MoleculerError(
            err.message || 'Internal server error',
            err.code || 500,
            err.type || 'INTERNAL_SERVER_ERROR',
            err.data || { error: 'Internal server' }
          );
        }
      },
    },

    update: {
      rest: "PUT /update",
      params: {
        _id: { type: 'string', optional: false },
        name: { type: 'string', max: 50, optional: true },
        message: { type: 'string', min: 10, max: 500, optional: true },
        interval: { type: 'number', min: 1, max: 60000, optional: true },
        timer_status: { type: 'number', optional: true },
        chat_lines: { type: 'number', min: 0, max: 100, optional: true },
        announce: { type: 'number', optional: true }
      },

      handler: async ({ params }) => {
        let { _id, name, message, interval, timer_status, chat_lines, announce } = params;

        let { matchedCount } = await db.editRow('timers',
          { _id: ObjectId(_id) },
          { name, message, interval, timer_status, chat_lines, announce }
        );

        if (matchedCount === 0) throw new MoleculerError('Timer not found', 404, 'NOT_FOUND', { message: 'Timer not found' });

        return { status: 200 };
      },
    },

    list: {
      rest: "GET /list",
      handler: async ({ meta }) => {
        const { id } = meta.session;

        return {
          data: await db.getAllRows('timers', { user_id: id, deleted: { $exists: false } }, { timer_status: -1 }),
          status: 200
        };
      },
    }
  },
};