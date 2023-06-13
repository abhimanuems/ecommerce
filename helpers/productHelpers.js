const db = require("../config/connection");
const collection = require("../config/collections");
const { mobile } = require("../controllers/userController/productView");
const { response } = require("express");
const async = require("hbs/lib/async");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  addProduct: (product) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCTCOLLECTION)
        .insertOne(product)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      let product = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find()
        .toArray();
      resolve(product);
    });
  },
  getSelectedProduct: (id) => {
    return new Promise((resolve, reject) => {
      let product = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ _id: new ObjectId(id) })
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
      resolve(featuredProduct);
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
  getElectronics: () => {
    return new Promise((resolve, reject) => {
      let electronics = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ category: "Electronics" })
        .toArray();
      resolve(electronics);
    });
  },
  getBooks: () => {
    return new Promise((resolve, reject) => {
      let books = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ category: "Books" })
        .toArray();
      resolve(books);
    });
  },
  getHealthAndWellness: () => {
    return new Promise((resolve, reject) => {
      let products = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ category: "Health & Wellness" })
        .toArray();
      resolve(products);
    });
  },
  getGrocery: () => {
    return new Promise((resolve, reject) => {
      let products = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ category: "Grocery" })
        .toArray();
      resolve(products);
    });
  },
  getproducts: (id) => {
    return new Promise((resolve, reject) => {
      let products = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ _id: new ObjectId(id) })
        .toArray();
      resolve(products);
    });
  },
  updateProducts: (id, products) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCTCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: products })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
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
  getProductCart: (ids) => {
    return new Promise(async (resolve, reject) => {
      const products = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ _id: { $in: ids } })
        .sort({ _id: 1 })
        .toArray();
      resolve(products);
    });
  },
  addAddress: (mobile, orderAddress) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ phone: mobile }, { $push: { address: orderAddress } })
        .then((response) => {
          console.log(response);
        });
    });
  },
  getProductOrder: (ids) => {
    const objectIds = ids.map((id) => new ObjectId(id));
    return new Promise((resolve, reject) => {
      const products = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({
          _id: { $in: objectIds },
        })
        .toArray();
      resolve(products);
    });
  },
  changeQuantity: (ids, counts, array) => {
    return new Promise(async (resolve, reject) => {
      const result = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .aggregate([
          {
            $match: {
              _id: { $in: array[0] },
            },
          },
          {
            $addFields: {
              subtractedField: {
                $subtract: [
                  "$quantity",
                  {
                    $arrayElemAt: [
                      array[1],
                      { $indexOfArray: [array[0], "$_id"] },
                    ],
                  },
                ],
              },
            },
          },
        ]);
    }).then((response) => {
      console.log(response);
    });
  },
  getWishProduct: (productIds) => {
    const productIdObjects = productIds.map((index) => new ObjectId(index));
    console.log(productIdObjects);
    return new Promise(async (resolve, reject) => {
      const products = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ _id: { $in: productIdObjects } })
        .toArray();
      console.log(products);
      resolve(products);
    });
  },
  searchItems:(text)=>{
    return new Promise(async(resolve,reject)=>{

      const products = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ productName: { $regex: text, $options: "i" } })
        .toArray();
      console.log(products,"are at the search items ");
      resolve(products)

    }).catch((err)=>{
      reject(err);

    })
  }
};
