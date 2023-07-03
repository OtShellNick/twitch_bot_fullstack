'use strict'
const { TwitchSocket, connWatcher } = require('./connection');

let socketCollection = {};

async function addConnection(id, channel, refresh_token) {
  if(socketCollection[id]) return;

  socketCollection[id] = new TwitchSocket(id, channel);
  await socketCollection[id].connect(refresh_token);
}

connWatcher.on('close', (id) => {
  console.log(`Socket for id=${id} was deleted`);
  delete socketCollection[id];
})

connWatcher.on('error', (id) => {
  console.log(`Socket for id=${id} was deleted`);
  delete socketCollection[id];
})

module.exports = { socketCollection, addConnection };