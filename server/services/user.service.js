'use strict'
const { Errors: { MoleculerError } } = require('moleculer');
const db = require("../methods/db.methods");

const transformUserData = (user, newData = {}) => {

  const fullNewUser = { ...user, ...newData };

  return {
    id: fullNewUser.id,
    login: fullNewUser.login,
    display_name: fullNewUser.display_name,
    email: fullNewUser.email,
    profile_image_url: fullNewUser.profile_image_url,
    bot_status: fullNewUser.bot_status
  }
}

module.exports = {
  name: "user",
  version: 1,
  actions: {
    self: {
      rest: "GET /self",
      handler: async ({ meta }) => {

        try {
          let { id } = meta.session;

          let user = await db.getRow('users', { id });

          if (!user) throw new MoleculerError('User not found', 404, 'NOT_FOUND', { error: 'User not found' });

          return { data: transformUserData(user), status: 200 };

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

    update: {
      rest: 'POST /update',
      params: {
        login: { type: 'string', optional: true },
        display_name: { type: 'string', optional: true },
        type: { type: 'string', optional: true },
        broadcaster_type: { type: 'string', optional: true },
        description: { type: 'string', optional: true },
        profile_image_url: { type: 'string', optional: true },
        offline_image_url: { type: 'string', optional: true },
        view_count: { type: 'number', optional: true },
        email: { type: 'string', optional: true },
        created_at: { type: 'string', optional: true }, //TODO: change type date
        bot_status: { type: 'number', optional: true }
      },
      handler: async ({ meta, params }) => {
        const { id } = meta.session;
        console.log(params);

        try {
          let user = await db.getRow('users', { id });

          if (!user) throw new MoleculerError('User not found', 404, 'NOT_FOUND', { error: 'User not found' });

          await db.editRow('users', { id: user.id }, params);

          return { user: transformUserData(user, params), status: 200 };

        } catch (err) {
          console.log('user update error', err);
          throw new MoleculerError(
            err.message || 'Internal server error',
            err.code || 500,
            err.type || 'INTERNAL_SERVER_ERROR',
            err.data || { error: 'Internal server' }
          );
        }
      }
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
