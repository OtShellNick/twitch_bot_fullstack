const axios = require("axios");

/**
 * Функция для выполнения запросов к серверу.
 * @param {string} method - HTTP метод запроса.
 * @param {string} type - Тип сервера (например, "api" или "www").
 * @param {string} url - Ресурс, к которому нужно выполнить запрос.
 * @param {Object} data - Данные, отправляемые в запросе (опционально).
 * @param {Object} headers - Заголовки запроса (опционально).
 * @returns {Promise} Промис, который разрешается с данными ответа или отклоняется с ошибкой.
 */
const server = (method, type, url, data, headers) => {
  const URI = `https://${type}.twitch.tv/` + url;

  return axios({ method, url: URI, data, headers })
    .then(({ data }) => Promise.resolve(data))
    .catch(({ response }) => Promise.reject(response));
};

module.exports = server;
