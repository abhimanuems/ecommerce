const db = require("../config/connection");
const collection = require("../config/collections");
const async = require("hbs/lib/async");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  //add product
  addProduct: (product, files) => {
    const quantity = parseInt(product.quantity);
    product.quantity = quantity;
    product.images = files;
    product.status = true;
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
  //finding all products
  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      const product = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ status: true })
        .toArray();
      resolve(product);
    });
  },
  // finding a specific product
  getSelectedProduct: (id) => {
    return new Promise(async(resolve, reject) => {
      const product = await db
      .get()
      .collection(collection.PRODUCTCOLLECTION)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            status: true
          }
        }
      ])
      .toArray();

      resolve(product);
    });
  },
  //finding the trending product
  getTrendingFeaturedForUserHome: () => {
    return new Promise(async (resolve, reject) => {
      const trendingProduct = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .aggregate([
          {
            $match: {
              trendingProduct: "on",
              status: true,
            },
          },
        ])
        .toArray();
      resolve(trendingProduct.slice(0, 4));
    });
  },
  //finding the featured product
  getFeaturedProduct: () => {
  return new Promise(async (resolve, reject) => {
    try {
      const featuredProduct = await db
      .get()
      .collection(collection.PRODUCTCOLLECTION)
      .aggregate([
        {
          $match: {
            featuredProduct: "on",
            status: true
          }
        }
      ])
      .toArray();
      resolve(featuredProduct);
    } catch (err) {
      console.log("Error at getFeaturedProduct:", err);
      reject(err);
    }
  });
},

  // finding the mobile category
  getMobiles: () => {
    return new Promise(async (resolve, reject) => {
      const mobiles = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .aggregate([
          {
            $match: {
              category: "Mobiles",
              status: true,
            },
          },
        ])
        .toArray();

      resolve(mobiles);
    });
  },
  //finding the electronics category
  getElectronics: () => {
    return new Promise((resolve, reject) => {
      const electronics = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .aggregate([
          {
            $match: {
              category: "Electronics",
              status: true,
            },
          },
        ])
        .toArray();
      resolve(electronics);
    });
  },
  //finding the books category
  getBooks: () => {
    return new Promise((resolve, reject) => {
      const books = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
          .aggregate([
          {
            $match: {
              category: "Books",
              status: true,
            },
          },
        ])
        .toArray();
      resolve(books);
    });
  },
  //finding the health and wellness category
  getHealthAndWellness: () => {
    return new Promise((resolve, reject) => {
      const products = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
         .aggregate([
          {
            $match: {
              category: "Health",
              status: true,
            },
          },
        ])
        .toArray();
      resolve(products);
    });
  },
  // finding the grocery category
  getGrocery: () => {
    return new Promise((resolve, reject) => {
      let products = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
         .aggregate([
          {
            $match: {
              category: "Grocery",
              status: true,
            },
          },
        ])
        .toArray();
      resolve(products);
    });
  },
  //finding the product by ID
  getproducts: (id) => {
    return new Promise((resolve, reject) => {
      const products = db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .aggregate([
          {
            $match: {
              _id: new ObjectId(id),
              status: true,
            },
          },
        ])
        .toArray();
        console.log("products are ",products)
      resolve(products).catch((err) => {
        reject(err);
        console.log("error is ", err);
      });
    })
  },
  // updating the product details
  updateProducts: (id, products, image) => {
    console.log("from edit products is ",products);
    products.images = image;
    const quantity = parseInt(products.quantity);
    products.quantity = quantity;
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
  // deleting the product details
  deleteProduct: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCTCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: { status: false } });
      resolve(true);
    }).catch((err) => {
      reject(err);
    });
  },
  //finding the products in the cart
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
  //finnding  the address
  addAddress: (mobile, orderAddress) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ phone: mobile }, { $push: { address: orderAddress } })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //finding the product offer
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
  //change quantity in the cart
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
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  },
  //finding  the wishlist
  getWishProduct: (productIds) => {
    const productIdObjects = productIds.map((index) => new ObjectId(index));
    console.log(productIdObjects);
    return new Promise(async (resolve, reject) => {
      const products = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ _id: { $in: productIdObjects } })
        .toArray();
      resolve(products);
    });
  },
  //searching the items
  searchItems: (text) => {
    return new Promise(async (resolve, reject) => {
      try {
        const products = await db
          .get()
          .collection(collection.PRODUCTCOLLECTION)
          .find({status:true},{ productName: { $regex: text, $options: "i" } })
          .toArray();

        resolve(products.slice(0, 6));
      } catch (err) {
        reject(err);
      }
    });
  },
  //add offer
  addOffer: (id, data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.PRODUCTCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: { offer: data } })
        .then((resposne) => {
          resolve(0);
        })
        .catch((err) => {
          reject(err);
          console.log("Error adding at the add product offer", err);
        });
    });
  },
  //finding the lastest products
  latestProduct: () => {
    return new Promise(async (resolve, reject) => {
      const product = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({status:true})
        .toArray();
      resolve(product);
      console.log(product);
    });
  },
  // finding the product offers
  getProductOffer: (ids) => {
    return new Promise(async (resolve, reject) => {
      const date = new Date().toISOString().split("T")[0];
      const objectIdIds = ids.map((id) => new ObjectId(id));
      const offers = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({
          _id: { $in: objectIdIds },
          offer: { $exists: true },
          "offer.startDate": { $lte: date },
          "offer.endDate": { $gte: date },
        })
        .project({ offer: 1, _id: 0, productName: 1 })
        .toArray();
      resolve(offers);
    }).catch((err) => {
      reject(err);
      console.log("error is ", err);
    });
  },
  // find the offers with products
  getAllProductsWithOffer: () => {
    return new Promise(async (resolve, reject) => {
      const product = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .find({ offer: { $exists: true } })
        .toArray();
      console.log(product);
      resolve(product);
    }).catch((err) => {
      reject(err);
    });
  },
  //delete the product offer
  deleteProductOffer: (id) => {
    return new Promise((resolve, reject) => {
      console.log("eneter at the delete offer");
      db.get()
        .collection(collection.PRODUCTCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $unset: { offer: "" } })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //updating the product quantiity
  updateProductQuantity: (products) => {
    try {
      for (let i = 0; i < products.length; i++) {
        let updatedQuantity = parseInt(products[1][i]);

        return new Promise(async (resolve, reject) => {
          await db
            .get()
            .collection(collection.PRODUCTCOLLECTION)
            .updateOne(
              { _id: new ObjectId(products[0][i]) },
              { $inc: { quantity: -updatedQuantity } }
            );
        }).then((response) => {
          resolve(response);
        });
      }
    } catch (er) {
      console.log(er);
    }
  },
  // for pagination
  getProductsPagination: (pageNo, capacity = 3, aggregation) => {
    return new Promise(async (resolve, reject) => {
      const products = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .aggregate(aggregation)
        .skip((pageNo - 1) * capacity)
        .limit(capacity)
        .toArray();
      resolve(products);
    });
  },
  getCount: (products) => {
    return new Promise(async (resolve, reject) => {
      try {
        const count = await db
          .get()
          .collection(collection.PRODUCTCOLLECTION)
          .aggregate([{ $match: { status: true } }, { $count: "myCount" }])
          .toArray();
        console.log(count, "is count");
        resolve(count[0].myCount);
      } catch (error) {
        reject(error);
      }
    });
  },
};
