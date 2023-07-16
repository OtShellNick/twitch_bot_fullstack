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

  async getAllRows(colName, filter = {}, sort = { '_id': 1 }) {
    const collection = db.get().collection(colName);
    return await collection.find(filter).sort(sort).toArray();
  },

  async deleteRow(colName, filter) {
    const collection = db.get().collection(colName);

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: false };
    const updateDoc = {
      $set: {
        deleted: new Date()
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
  }
}