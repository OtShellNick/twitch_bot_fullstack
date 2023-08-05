'use strict';
const db = require('../mongo');

module.exports = {
  async getRow(colName, filter) {
    const collection = db.get().collection(colName);
    return await collection.findOne(filter);
  },

  async addRow(colName, row) {
    const collection = db.get().collection(colName);
    return await collection.insertOne(row);
  },

  async getAllRows(colName, filter = {}) {
    const collection = db.get().collection(colName);
    return await collection.find(filter).toArray();
  },

  async deleteRow(colName, filter) {
    const collection = db.get().collection(colName);

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: false };
    const updateDoc = {
      $set: {
        deleted: new Date(),
      },
    };

    return await collection.updateOne(filter, updateDoc, options);
  },

  async editRow(colName, filter, toUpdate, upsert = false) {
    const collection = db.get().collection(colName);

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert };

    Object.keys(toUpdate).forEach(key => {
      if (toUpdate[key] === undefined) {
        delete toUpdate[key];
      }
    });

    const updateDoc = {
      $set: toUpdate,
    };

    return await collection.updateOne(filter, updateDoc, options);
  },

  async incRow(colName, filter, toInc) {
    const collection = db.get().collection(colName);
    return await collection.updateOne(filter, { $inc: toInc }, { upsert: true });
  },

  async getUsersWithActiveTimers() {
    const users = await db.get().collection('users').find({ bot_status: 1 }).toArray();
    const result = {};
  
    for (const user of users) {
      const timers = await db.get().collection('timers').find({ user_id: user.id, timer_status: 1 }).toArray();
  
      result[user.login] = timers;
    }
  
    return result;
  }
  
};
