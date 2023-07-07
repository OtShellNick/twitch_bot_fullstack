'use strict';
const db = require("../methods/db.methods");
const {
  getAuthData,
  getUserInfoByAuthCode,
  becomeChannelModerator
} = require("../methods/twitch.methods");

module.exports = {
  name: "auth",
  actions: {
    login: {
      rest: "POST /login",
      params: {
        code: { type: "string", optional: false },
      },
      handler: async ({ params }) => {

        try {
          let { code } = params;

          let authData = await getAuthData(code);

          let { data: [user] } = await getUserInfoByAuthCode(authData);

          user.refresh_token = authData.refresh_token;
          user.bot_status = 1;

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

          ctx.meta.session = {
            id: user.id,
            access_token: authData.access_token,
            end_time: parseInt(Date.now() / 1000) + authData.expires_in,
            expires_in: authData.expires_in,
          };

          return { status: 200 };
        }
        catch (err) {
          console.log(err);
          return { error: "INTERNAL_ERROR", status: 500 };
        }
      },
    },
  },
};
