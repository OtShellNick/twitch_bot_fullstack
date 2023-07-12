'use strict';
const db = require("../methods/db.methods");

module.exports = {
  name: "bot",
  version: 1,
  actions: {
    switch: {
      rest: "POST /switch",
      params: {
        status: { type: 'boolean' }
      },
      handler: async ({ meta, params }) => {

        try {
          let { id } = meta.session;
          const { status } = params;

          let user = await db.getRow('users', { id });

          if (!user) {
            throw new MoleculerError('User not found', 404, 'NOT_FOUND', { error: 'User not found' });
          }

          await db.editRow('users',
            { id },
            { bot_status: status ? 1 : 0 }
          );

          return { status: 200 };
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
  },
};
