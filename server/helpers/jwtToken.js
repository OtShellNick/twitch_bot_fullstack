'use strict';
require("dotenv").config({ path: "../.env" });
const { TOKEN_SECRET } = process.env;

const jwt = require('jsonwebtoken');

module.exports = {
  createJwtToken: async (data, expiresIn) => {
    return await jwt.sign(data, TOKEN_SECRET, {
      expiresIn
    });
  },

  decodeJwtToken: async (token) => {
    return await jwt.decode(token, TOKEN_SECRET);
  },

  checkJwtToken: async (token) => {
    return await jwt.verify(token, TOKEN_SECRET);
  }
}