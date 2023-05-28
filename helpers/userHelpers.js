const db = require("../config/connection");
const collection = require("../config/collections");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  addUser: (credntials) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .insertOne(credntials)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getUser: () => {
    return new Promise(async(resolve,reject)=>{
        let credentials = await db.get().collection(collection.CATEGORYCOLLECTION).find().toArray();
    })
  },
};
