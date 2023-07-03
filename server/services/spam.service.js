'use strict';
const db = require("../methods/db.methods");
const {
  addBlockedTerms,
  getBlockedTerms,
  removeBlockedTerms,
  updateChatSettings,
  getChatSettings
} = require("../methods/twitch.methods");

module.exports = {
  name: "spam",
  version: 1,
  actions: {
    ['add.blocked.terms']: {
      rest: "POST /blocked-terms",
      params: {
        bad_word: { type: 'string', min: 2, max: 500, optional: false },
        silence: { type: 'number', min: 5, max: 3600, default: 5, optional: true }
      },
      handler: async (ctx) => {
        let { id, access_token } = ctx?.meta?.session;
        if (!id || !access_token) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        let user = await db.getRow('users', { id });
        if (!user) {
          return { error: 'USER_NOT_FOUND', status: 400 };
        }

        return await addBlockedTerms(user.id, ctx.params.bad_word, access_token)
          .then((res) => {
            return { status: 200, data: res.data }
          })
          .catch((err) => {
            console.log(err);
            return { error: "INVALID_TOKEN", status: 403 };
          });
      }
    },

    ['get.blocked.terms']: {
      rest: "GET /blocked-terms",
      params: {},
      handler: async (ctx) => {
        let { id, access_token } = ctx?.meta?.session;
        if (!id || !access_token) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        let user = await db.getRow('users', { id });
        if (!user) {
          return { error: 'USER_NOT_FOUND', status: 400 };
        }

        return await getBlockedTerms(user.id, access_token)
          .then((res) => {
            return { status: 200, data: res.data }
          })
          .catch((err) => {
            console.log(err);
            return { error: "INVALID_TOKEN", status: 403 };
          });
      }
    },

    ['delete.blocked.terms']: {
      rest: "DELETE /blocked-terms",
      params: {
        term_id: { type: 'string', optional: false }
      },
      handler: async (ctx) => {
        let { id, access_token } = ctx?.meta?.session;
        if (!id || !access_token) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        let user = await db.getRow('users', { id });
        if (!user) {
          return { error: 'USER_NOT_FOUND', status: 400 };
        }

        return await removeBlockedTerms(user.id, ctx.params.term_id, access_token)
          .then((res) => {
            return { status: 200, data: res.data }
          })
          .catch((err) => {
            console.log(err);
            return { error: "INVALID_TOKEN", status: 403 };
          });
      }
    },

    ['edit.emotes']: {
      rest: "PUT /emotes",
      params: {
        max_emotes: { type: 'number', min: 0, max: 500, optional: true },
        emote_mode: { type: 'number', optional: true }
      },
      handler: async (ctx) => {
        let { id, access_token } = ctx?.meta?.session;
        if (!id || !access_token) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        if (ctx.params.emote_mode !== undefined) {
          try {
            await updateChatSettings(id, access_token, { emote_mode: ctx.params.emote_mode });
          } catch (err) {
            console.log(err);
            return { error: "INVALID_TOKEN", status: 403 };
          }
        }

        // ??? проверка, существует ли пользователь с таким id ???

        await db.editRow('spam', { id }, { max_emotes: ctx.params.max_emotes }, true);
        return { status: 200 };
      }
    },

    ['get.emotes']: {
      rest: "GET /emotes",
      params: {},
      handler: async (ctx) => {
        let { id, access_token } = ctx?.meta?.session;
        if (!id || !access_token) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        let spam = await db.getRow('spam', { id });

        return await getChatSettings(id, access_token)
          .then((res) => {
            return { 
              status: 200, 
              data: { 
                max_emotes: spam?.max_emotes,
                emote_mode: res.data[0].emote_mode
              }
            };
          })
          .catch((err) => {
            console.log(err);
            return { error: "INVALID_TOKEN", status: 403 };
          });
      }
    },

    ['edit.caps']: {
      rest: "PUT /caps",
      params: {
        caps_ban: { type: 'number', optional: true }
      },
      handler: async (ctx) => {
        let { id, access_token } = ctx?.meta?.session;
        if (!id || !access_token) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        await db.editRow('spam', { id }, { caps_ban: ctx.params.caps_ban }, true);
        return { status: 200 };
      }
    },

    ['get.caps']: {
      rest: "GET /caps",
      params: {
        caps_ban: { type: 'number', optional: true }
      },
      handler: async (ctx) => {
        let { id, access_token } = ctx?.meta?.session;
        if (!id || !access_token) {
          return { error: "INVALID_TOKEN", status: 403 };
        }

        return await db.getRow('spam', { id })
          .then((res) => {
            return { status: 200, data: { caps_ban: res?.caps_ban }};
          });
      }
    },
  },
};