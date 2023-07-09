'use strict'
const { Errors: { MoleculerError } } = require('moleculer');
const db = require("../methods/db.methods");

module.exports = {
  name: "user",
  version: 1,
  actions: {
    self: {
      rest: "GET /self",
      handler: async ({ meta, req, response }) => {

        try {
          let { id } = meta.session;

          let user = await db.getRow('users', { id });

          if (!user) {
            throw new MoleculerError('User not found', 404, 'NOT_FOUND', { error: 'User not found' });
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
          throw new MoleculerError(
            err.message || 'Internal server error',
            err.code || 500,
            err.type || 'INTERNAL_SERVER_ERROR',
            err.data || { error: 'Internal server' }
          );
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
