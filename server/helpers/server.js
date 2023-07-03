const axios = require("axios");

const server = (method, type, url, data, headers) => {
  const URI = `https://${type}.twitch.tv/` + url;

  return axios({ method, url: URI, data, headers })
    .then(({ data }) => Promise.resolve(data))
    .catch(({ response }) => Promise.reject(response));
};

module.exports = server;
