'use strict';
const db = require("../methods/db.methods");

module.exports = {
  name: "bot",
  version: 1,
  actions: {
    ['switch.on']: {
      rest: "POST /switch-on",
      params:{},
      handler: async (ctx) => {
        let { id } = ctx?.meta?.session;

        if(!id){
          return { error: "INVALID_TOKEN", status: 403 };
        }

        await db.editRow('users',
          { id },
          { bot_status: 1 }
        );

        return { status: 200 };
      },
    },

    ['switch.off']: {
      rest: "POST /switch-off",
      params:{},
      handler: async (ctx) => {
        let { id } = ctx?.meta?.session;

        if(!id){
            return { error: "INVALID_TOKEN", status: 403 };
        }

        await db.editRow('users',
          { id },
          { bot_status: 0 }
        );

        return { status: 200 };
      },
    }
  },
};
