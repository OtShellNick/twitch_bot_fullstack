'use strict';
const { Errors: { MoleculerError } } = require('moleculer');
const db = require("../methods/db.methods");
const {
  getUserInfoByAuthCode,
  becomeChannelModerator
} = require("../methods/twitch.methods");

const { createJwtToken } = require('../helpers/jwtToken');

module.exports = {
  name: "auth",
  version: 1,
  actions: {
    login: {
      rest: "POST /login",
      params: {
        provider: { type: "string" },
        type: { type: "string" },
        providerAccountId: { type: "string" },
        access_token: { type: "string" },
        expires_at: { type: 'number' },
        id_token: { type: 'string' },
        refresh_token: { type: 'string' },
        scope: { type: 'string' },
        token_type: { type: 'string' }
      },
      handler: async ({ params }) => {

        try {
          const authData = params;

          let { data: [user] } = await getUserInfoByAuthCode(authData);

          user.refresh_token = authData.refresh_token;
          user.bot_status = 0;

          let currentUser = await db.getRow('users', { id: user.id });

          if (!currentUser) {
            await db.addRow('users', user);
            await becomeChannelModerator(user.id, authData.access_token)
              .catch((err) => {
                console.log("become moderator error");
                console.log(err);
              });

          } else {
            console.log(`User ${user.id} already exist. Update refresh_token and etc.`);
            await db.editRow('users', { id: user.id }, user);
          }


          const token = createJwtToken({
            id: user.id,
            access_token: authData.access_token
          }, authData.expires_at - Math.floor(Date.now() / 1000));

          return { token, status: 200 };
        }
        catch (err) {
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
