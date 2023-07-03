const server = require("../helpers/server");
const { CLIENT_ID, SECRET_KEY, REDIRECT_URI, LOGIN } = process.env;

module.exports = {
  getUserInfoByAuthCode(authData){
    return server(
      "get",
      "api",
      "helix/users",
      {},
      {
        Authorization: "Bearer " + authData.access_token,
        "Client-Id": CLIENT_ID,
      },
    );
  },

  getAuthData(code){
    return server(
      "post",
      "id",
      `oauth2/token?client_id=${CLIENT_ID}&client_secret=${SECRET_KEY}&code=${code}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}`,
    );
  },

  getAccessToken(refreshToken) {
    return server(
      "post",
      "id",
      `oauth2/token?client_id=${CLIENT_ID}&client_secret=${SECRET_KEY}&refresh_token=${refreshToken}&grant_type=refresh_token`,
    );
  },

  getChatSettings(broadcaster_id, access_token) {
    return server(
      "get",
      "api",
      `helix/chat/settings?broadcaster_id=${broadcaster_id}`,
      {},
      {
        Authorization: "Bearer " + access_token,
        "Client-Id": CLIENT_ID,
      },
    );
  },

  updateChatSettings(id, access_token, data) {
    return server(
      "patch",
      "api",
      `helix/chat/settings?broadcaster_id=${id}&moderator_id=${id}`,
      data,
      {
        Authorization: "Bearer " + access_token,
        "Client-Id": CLIENT_ID,
      },
    );
  },

  deleteChatMessage(id, message_id, access_token) {
    return server(
      "delete",
      "api",
      `helix/moderation/chat?broadcaster_id=${id}&moderator_id=${id}&message_id=${message_id}`,
      {},
      {
        Authorization: "Bearer " + access_token,
        "Client-Id": CLIENT_ID,
      },
    );
  },

  addBlockedTerms(id, bad_word, access_token) {
    return server(
      "post",
      "api",
      `helix/moderation/blocked_terms?broadcaster_id=${id}&moderator_id=${id}`,
      {
        text: bad_word
      },
      {
        Authorization: "Bearer " + access_token,
        "Client-Id": CLIENT_ID,
      },
    );
  },

  getBlockedTerms(id, access_token) {
    return server(
      "get",
      "api",
      `helix/moderation/blocked_terms?broadcaster_id=${id}&moderator_id=${id}`,
      {},
      {
        Authorization: "Bearer " + access_token,
        "Client-Id": CLIENT_ID,
      },
    );
  },

  removeBlockedTerms(id, term_id, access_token) {
    return server(
      "delete",
      "api",
      `helix/moderation/blocked_terms?broadcaster_id=${id}&moderator_id=${id}&id=${term_id}`,
      {},
      {
        Authorization: "Bearer " + access_token,
        "Client-Id": CLIENT_ID,
      },
    );
  },

  becomeChannelModerator(broadcaster_id, access_token){
    return server(
      "post",
      "api",
      `helix/moderation/moderators?broadcaster_id=${broadcaster_id}&user_id=${LOGIN}`,
      {},
      {
        Authorization: "Bearer " + access_token,
        "Client-Id": CLIENT_ID,
      },
    );
  }
};
