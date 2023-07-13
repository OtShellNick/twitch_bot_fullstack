'use strict';

const WebSocketClient = require('websocket').w3cwebsocket;
const { getAccessToken } = require("../methods/twitch.methods");
const { getRow } = require('../methods/db.methods');
const { BOT_ACCOUNT, REFRESH_TOKEN } = process.env;

let master;

function connect() {
  master = new WebSocketClient('ws://irc-ws.chat.twitch.tv:80');

  master.onopen = login;
  master.onerror = errorHandler;
  master.onclose = errorHandler;
  master.onmessage = messageHandler;
}

setTimeout(() => connect(), 10000);

async function login() {
  let refreshData;
  try {
    const { refresh_token, login } = await getRow('users', { id: '929422572' });

    console.log('login', login, refresh_token);

    refreshData = await getAccessToken(refresh_token);

    console.log('refersh data', refreshData);

    master.send(`PASS oauth:${refreshData.access_token}`);
    master.send(`NICK ${login}`);
    master.send(`JOIN #${login}`);
  }
  catch (err) {
    console.log('error master connect', err);
    return;
  }
}

function errorHandler(error) {
  console.log("Master connection Error. Try to reconnect after 10 sec.");
  console.log(error);

  setTimeout(() => {
    console.log("Master connect");
    connect();

  }, 10 * 1000);
}

function messageHandler(message) {
  console.log('Master message', message.data);
  let tokens = message.data.split(' ');

  if (tokens[0] == 'PING') {
    console.log("Send pong");
    sendFromBot('PONG :tmi.twitch.tv\r\n');
  }
}

function sendFromBot(message) {
  try {
    master.send(message);
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = { sendFromBot };