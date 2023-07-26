'use strict';

require("dotenv").config({ path: "../.env" });

const jwt = require('jsonwebtoken');

/**
 * Модуль для работы с JWT токенами.
 * @module jwtUtils
 */

/**
 * Создает JWT токен.
 * @async
 * @param {object} data - Данные, которые будут включены в токен.
 * @param {string | number} expiresIn - Строка, определяющая срок действия токена (например, '1h' для 1 часа).
 * @returns {Promise<string>} - Созданный JWT токен.
 */
const createJwtToken = async (data, expiresIn) => {
  const { TOKEN_SECRET } = process.env;
  return await jwt.sign(data, TOKEN_SECRET, {
    expiresIn
  });
};

/**
 * Декодирует JWT токен и возвращает его содержимое.
 * @async
 * @param {string} token - JWT токен для декодирования.
 * @returns {Promise<object|null>} - Содержимое декодированного токена или null, если токен недействителен.
 */
const decodeJwtToken = async (token) => {
  const { TOKEN_SECRET } = process.env;
  return await jwt.decode(token, TOKEN_SECRET);
};

/**
 * Проверяет, является ли JWT токен действительным и возвращает его содержимое.
 * @async
 * @param {string} token - JWT токен для проверки.
 * @returns {Promise<object>} - Содержимое действительного токена.
 * @throws {Error} - Если токен недействителен или истек срок его действия.
 */
const checkJwtToken = async (token) => {
  const { TOKEN_SECRET } = process.env;
  return await jwt.verify(token, TOKEN_SECRET);
};

module.exports = {
  createJwtToken,
  decodeJwtToken,
  checkJwtToken
};
