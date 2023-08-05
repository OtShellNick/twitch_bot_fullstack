'use strict';
const db = require('../mongo');
const collection = require("../methods/db.methods");
const TwitchBot = require('./../bot/mainBot');
const { getAccessToken } = require("../methods/twitch.methods");
const { eventEmitter } = require('./emiter');
const {LOGIN} = process.env;

/**
 * Функция для отслеживания изменений в коллекции "timers" и запуска таймеров.
 */
 function timerWatcher() {
  const timerCollection = db.get().collection('timers');
  timerCollection.createIndex({ deleted: 1 }, { expireAfterSeconds: 0 });

  const timerStream = timerCollection.watch({ fullDocument: "updateLookup" });

  timerStream.on('change', async (next) => {
    console.log('received a change to the collection: \t', next);

    const { operationType, fullDocument, documentKey, updateDescription } = next;

    let user;

    switch (operationType) {
      case 'insert':
        user = await collection.getRow('users', { id: fullDocument.user_id });
        if (user?.bot_status === 1 && fullDocument.timer_status) eventEmitter.emit('add_timer', {channel: user.login, timer: fullDocument});
        break;
      case 'update':
        console.log('Update operation in the timer collection.');

        const { timer_status: newTimerStatus, deleted } = updateDescription?.updatedFields || {};
        user = await collection.getRow('users', { id: fullDocument.user_id });

        if(!deleted) {
          if(newTimerStatus === 1) eventEmitter.emit('add_timer', {channel: user.login, timer: fullDocument});
          else if(newTimerStatus === 0) eventEmitter.emit('delete_timer', {channel: user.login, timer: fullDocument});
          else eventEmitter.emit('update_timer', {channel: user.login, timer: fullDocument});
        }

        if(deleted) eventEmitter.emit('delete_timer', {channel: user.login, timer: fullDocument});

        // if (deleted && socketCollection[user_id]) {
        //   socketCollection[user_id].stopTimer(_id);
        // } else if (user?.bot_status === 1) {
        //   await addConnection(user_id, user.login, user.refresh_token);
        //   if (socketCollection[user_id]) {
        //     switch (newTimerStatus) {
        //       case 0:
        //         socketCollection[user_id].stopTimer(_id);
        //         break;
        //       case 1:
        //         socketCollection[user_id].startTimer(_id, message, interval, chat_lines, announce);
        //         break;
        //       case undefined:
        //         if (timer_status) {
        //           socketCollection[user_id].restartTimer(_id, message, interval, chat_lines, announce);
        //         }
        //         break;
        //     }
        //   }
        // }
        break;
      case 'delete':
        console.log('Delete operation in the timer collection.');
        break;
    }
  });

  timerStream.on('error', (err) => {
    console.log("Error in timerStream", err);
  });
}




/**
 * Функция для отслеживания изменений в коллекции пользователей.
 */
 function userWatcher() {
  const userCollection = db.get().collection('users');
  const userStream = userCollection.watch({ fullDocument: 'updateLookup' });

  /**
   * Обработчик изменений в коллекции пользователей.
   * @param {object} change - Изменение в коллекции пользователей.
   */
  userStream.on('change', async (change) => {
    const { fullDocument, operationType, updateDescription } = change;

    switch (operationType) {
      case 'insert':
        const { id, login, refresh_token } = fullDocument;

        // if (LOGIN === id) {
        //   const refreshData = await getAccessToken(refresh_token);

        //   new TwitchBot(login, refreshData.access_token).connect();
        // }
        break;
      case 'update':
        console.log('Received an update in the user collection:', change);
        break;
    }
  });

  /**
   * Обработчик ошибок в потоке изменений пользователей.
   * @param {object} error - Ошибка в потоке изменений пользователей.
   */
  userStream.on('error', (error) => {
    console.log('Error in userStream:', error);
  });
}

db.emitter.on('connect', () => {
  console.log('watcher connected');
  userWatcher();
  timerWatcher();
});
