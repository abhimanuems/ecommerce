const db = require("../config/connection");
const collection = require("../config/collections");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  addProduct: (product) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCTCOLLECTION)
        .insertOne(product)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      let product = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find()
        .toArray();
      resolve(product);
    });
  },
  getTrendingFeaturedForUserHome: () => {
    return new Promise(async (resolve, reject) => {
      let trendingProduct = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ trendingProduct: "on" })
        .toArray();

      resolve(trendingProduct.slice(0, 4));
    });
  },
  getFeaturedProduct: () => {
    return new Promise(async (resolve, reject) => {
      let featuredProduct = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ featuredProduct: "on" })
        .toArray();

      resolve(featuredProduct.slice(0, 4));
    });
  },
  getMobiles: () => {
    return new Promise(async (resolve, reject) => {
      let mobiles = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ category: "Mobiles" })
        .toArray();

      resolve(mobiles);
    });
  },
  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCTCOLLECTION)
        .deleteOne({ _id: new ObjectId(id) });
      resolve(true);
    }).catch((err) => {
      reject(err);
    });
  },
};
