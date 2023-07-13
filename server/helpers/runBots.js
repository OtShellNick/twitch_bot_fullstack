'use strict';
const db = require('../mongo');
const collection = require("../methods/db.methods");
const { socketCollection, addConnection } = require("../bot/socketCollection");

async function runUserBot(id, login, refresh_token) {
  let spam = await collection.getRow('spam', { id });
  let timers = await collection.getAllRows('timers', { user_id: id, timer_status: 1 });

  if (timers.length) {

    await addConnection(id, login, refresh_token)
      .then(() => {

        if (spam?.max_emotes !== undefined) {
          socketCollection[id].setMaxEmotes(spam?.max_emotes);
        }

        if (spam?.caps_ban !== undefined) {
          socketCollection[id].setCapsMode(spam?.caps_ban);
        }

        for (let timer of timers) {
          let { _id, message, interval, chat_lines, announce } = timer;
          socketCollection[id].startTimer(_id, message, interval, chat_lines, announce);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

db.emitter.on('connect', async () => {
  let users = await collection.getAllRows('users');

  for (let user of users) {
    if (user.bot_status == 1) {
      await runUserBot(user.id, user.login, user.refresh_token)
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

module.exports = { runUserBot };