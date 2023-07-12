'use strict';
const { MongoClient } = require('mongodb');
const events = require('events');
const emitter = new events.EventEmitter();

let state = {
  db: null,
};

exports.emitter = emitter;

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

exports.get = function () {
  return state.db;
};

exports.close = function (done) {
  if (state.db) state.db.close(function (err) {
    state.db = null;
    done(err);
  });
};
