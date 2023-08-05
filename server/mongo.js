'use strict';

const { MongoClient } = require('mongodb');
const events = require('events');

/**
 * EventEmitter для уведомления о соединении с базой данных.
 * @type {events.EventEmitter}
 */
const emitter = new events.EventEmitter();

/**
 * Состояние базы данных.
 * @type {Object}
 * @property {MongoClient} db - Соединение с базой данных.
 */
let state = {
  db: null,
};

/**
 * Получение EventEmitter для уведомления о соединении с базой данных.
 * @returns {events.EventEmitter} EventEmitter для уведомления о соединении с базой данных.
 */
exports.emitter = emitter;

/**
 * Устанавливает соединение с базой данных.
 * @param {string} uri - URI подключения к базе данных.
 * @param {function} done - Callback-функция, вызываемая после установки соединения.
 * @returns {Promise} Промис, который разрешается после установки соединения.
 */
exports.connect = async function (uri, done) {
  if (state.db) return done();

  try {
    const client = new MongoClient(uri);
    await client.connect();

    const db = client.db('witch-database');
    state.db = db;

    emitter.emit('connect');
    done();
  } catch (err) {
    return done(err);
  }
};

/**
 * Возвращает соединение с базой данных.
 * @returns {MongoClient} Соединение с базой данных.
 */
exports.get = function () {
  return state.db;
};

/**
 * Закрывает соединение с базой данных.
 * @param {function} done - Callback-функция, вызываемая после закрытия соединения.
 */
exports.close = function (done) {
  if (state.db) {
    state.db.close(function (err, result) {
      state.db = null;
      done(err);
    });
  }
};
