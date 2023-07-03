'use strict';
require("dotenv").config({ path: "../.env" });
const { TOKEN_SECRET } = process.env;

const jwt = require('jwt-simple');

module.exports = {
  createJwtToken(data) {
    return jwt.encode(data, TOKEN_SECRET, 'HS256');
  },

  decodeJwtToken(token) {
    return jwt.decode(token, TOKEN_SECRET);
  }
}