'use strict';
require("dotenv").config({ path: "../.env" });
const { TOKEN_SECRET } = process.env;

const jwt = require('jsonwebtoken');

module.exports = {
  createJwtToken(data) {
    return jwt.sign(data, TOKEN_SECRET);
  },

  decodeJwtToken(token) {
    return jwt.decode(token, TOKEN_SECRET);
  },

  checkJwtToken(token) {
    return jwt.verify(token, TOKEN_SECRET);
  }
}