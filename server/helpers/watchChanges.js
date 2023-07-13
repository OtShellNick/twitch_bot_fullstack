'use strict';
const db = require('../mongo');
const collection = require("../methods/db.methods");
const { socketCollection, addConnection } = require("../bot/socketCollection");
const { runUserBot } = require("./runBots");

function timerWatcher() {
  const timerCollection = db.get().collection('timers');
  timerCollection.createIndex({ deleted: 1 }, { expireAfterSeconds: 0 });// сделать один раз для всех коллекций

  const timerStream = timerCollection.watch({ fullDocument: "updateLookup" });

  timerStream.on('change', async (next) => {
    console.log('received a change to the collection: \t', next);

    if (next.operationType == 'insert') {
      let { user_id, _id, message, interval, timer_status, chat_lines, announce } = next.fullDocument;

      let user = await collection.getRow('users', { id: user_id });

      if (user?.bot_status == 1 && timer_status) {
        await addConnection(user_id, user.login, user.refresh_token) // создаст новое подключение, если его нет
          .then(() => {
            if (socketCollection[user_id])
              socketCollection[user_id].startTimer(_id, message, interval, chat_lines, announce);
          });
      }

    } else if (next.operationType == 'update') {
      let { user_id, _id, message, interval, chat_lines, timer_status, announce } = next.fullDocument;
      let { timer_status: newTimerStatus, deleted } = next.updateDescription?.updatedFields;

      let user = await collection.getRow('users', { id: user_id });

      if (deleted && socketCollection[user_id]) {
        socketCollection[user_id].stopTimer(_id);
      }

      else if (user?.bot_status == 1) {
        await addConnection(user_id, user.login, user.refresh_token)
          .then(() => {
            if (socketCollection[user_id]) {

              if (newTimerStatus == 0) {
                socketCollection[user_id].stopTimer(_id);
              }

              else if (newTimerStatus == 1) {
                socketCollection[user_id].startTimer(_id, message, interval, chat_lines, announce);
              }

              else if (newTimerStatus === undefined && timer_status) {
                socketCollection[user_id].restartTimer(_id, message, interval, chat_lines, announce);
              }
            }

          });
      }
    }
  });

  timerStream.on('error', async (err) => {
    console.log("Error in timerStream", err);
  });
}

function userWatcher() {
  const userCollection = db.get().collection('users');
  const userStream = userCollection.watch({ fullDocument: "updateLookup" });

  // на ивент replace (когда изменяем в базе вручную) не приходит updateDescription

  userStream.on('change', async (next) => {
    console.log('received a change to the collection: \t', next);
    const {
      operationType,
      fullDocument: {
        id,
        login,
        refresh_token,
        bot_status
      }
    } = next;

    if (operationType === 'update') {

      let {
        bot_status: newBotStatus,
        refresh_token: newRefreshToken,
      } = next.updateDescription.updatedFields;

      if (newBotStatus === 0 && socketCollection[id]) socketCollection[id].disconnect();

      if (newBotStatus === 1 && !socketCollection[id]) await connectUserBot({ id, login, refresh_token });

      if (newRefreshToken && bot_status === 1 && socketCollection[id]) await reconnectUserBot({ id, login, refresh_token });

      if (newRefreshToken && bot_status === 1 && !socketCollection[id]) await connectUserBot({ id, login, refresh_token });

    } else if (operationType === 'insert') {

      if (bot_status === 1 && !socketCollection[id]) await connectUserBot({ id, login, refresh_token });

    }

  });

  userStream.on('error', async (err) => {
    console.log("Error in userStream", err);
  });
}

function spamWatcher() {
  const spamCollection = db.get().collection('spam');
  const spamStream = spamCollection.watch({ fullDocument: "updateLookup" });

  spamStream.on('change', async (next) => {
    console.log('received a change to the collection: \t', next);

    if (next.operationType == 'update' || next.operationType == 'insert') {
      let { id, caps_ban, max_emotes } = next.fullDocument;

      if (caps_ban !== undefined && socketCollection[id]) {
        socketCollection[id].setCapsMode(caps_ban);
      }

      if (max_emotes !== undefined && socketCollection[id]) {
        socketCollection[id].setMaxEmotes(max_emotes);
      }
    }
  });

  spamStream.on('error', async (err) => {
    console.log("Error in spamStream", err);
  });
}

db.emitter.on('connect', () => {
  timerWatcher();
  userWatcher();
  spamWatcher();
});

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

const connectUserBot = async ({ id, login, refresh_token }) => {

  try {
    await runUserBot(id, login, refresh_token)
  } catch (err) {
    console.log("Error in connectUserBot", err);
  }

};

const reconnectUserBot = async ({ id, login, refresh_token }) => {
  socketCollection[id].disconnect();

  try {
    await runUserBot(id, login, refresh_token)
  } catch (err) {
    console.log("Error in connectUserBot", err);
  }
}
