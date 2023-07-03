'use strict'
const db = require("../methods/db.methods");

module.exports = {
  name: "user",
  version: 1,
  actions: {
    ['user.get']: {
      rest: "GET /",
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

    ['user.list']: {
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
