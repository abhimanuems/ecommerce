const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");
const async = require("hbs/lib/async");
module.exports = {
  addCategory: (category) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .insertOne(category)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  viewCategory: () => {
    return new Promise((resolve, reject) => {
      let product = db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find({ categoryName: { $exists: true } }, { _id: 1, categoryName: 1 })
        .toArray();
      resolve(product);
    });
  },
  viewSubCategory: () => {
    return new Promise((resolve, reject) => {
      let subCategory = db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find()
        .toArray();
      resolve(subCategory);
    }).catch((err) => {
      reject(err);
    });
  },
  getCategoryId: (category) => {
    return new Promise((resolve, reject) => {
      let categoryId = db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find({ categoryName: category })
        .toArray();
      resolve(categoryId);
    }).catch((err) => {
      reject(err);
    });
  },
  updateCategory: (id, update) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: update })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  deleteCategory: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .deleteOne({ _id: new ObjectId(id) })
        .then(() => {
          resolve(true);
        });
    }).catch((err) => {
      console.log(err);
    });
  },
  addSubCategory: (insertSubcategory) => {
    return new Promise((resolve, reject) => {
      const filter = { categoryName: insertSubcategory.category };
      const update = { $push: { subcategory: insertSubcategory.subcategory } };

      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne(filter, update)
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  deleteSubcategory: (categoryId, subCategoryId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne(
          { _id: new ObjectId(categoryId) },
          { $pull: { subcategory: subCategoryId } }
        )
        .then(() => {
          resolve(true);
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  },
  addVouchers: (data) => {
    console.log(data, "droma dding the data");
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .insertOne({ voucher: data });
    }).then(() => {
      resolve(true);
    });
  },
  getExistingVouchers: () => {
    return new Promise(async (resolve, reject) => {
      const vouchers = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find({ voucher: { $exists: true } }, { _id: 1, voucher: 1 })
        .toArray();
      resolve(vouchers);
    });
  },
  deleteVoucher: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .deleteOne({ _id: new ObjectId(id) })
        .then(() => {
          resolve(true);
        });
    });
  },
  editVouchers: (id, data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          { $set: { voucher: data } }
        );
    });
  },
  getOffers: () => {
    return new Promise((resolve, reject) => {
      const offers = db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find({ offers: { $exists: true } }, { _id: 1, offers: 1 })
        .toArray();
      resolve(offers);
    });
  },
  checkCoupon: (data) => {
    return new Promise(async (resolve, reject) => {
      const coupon = data.toString();
      console.log("coupon at data base is ", coupon);
      const convertedDate = new Date().toISOString().split("T")[0];
      console.log(convertedDate, "is ate check copoun");
      const coupons = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .aggregate([
          {
            $match: {
              "voucher.voucherCode": coupon,
              "voucher.startTime": { $lte: convertedDate },
              "voucher.endTime": { $gte: convertedDate },
            },
          },
          {
            $project: {
              "voucher.price": 1,
              "voucher.priceType": 1,
              "voucher.minSpent": 1,
            },
          },
        ])
        .toArray();
      resolve(coupons);
    }).catch((err) => {
      reject(err);
      console.log(err, "is at check coupoun");
    });
  },
  addOffer:(data)=>{
    data['status'] =true;
    console.log(data)
    console.log(data.Category,"from the add offer")
    console.log(new ObjectId(data.Category),"is the category id")

    return new Promise((resolve,reject)=>{
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .insertOne({ _id: new ObjectId(data.Category) }, { $set: { offer: data } })
        .then((response) => {
          console.log(response, "at the add offer");
        });
    })

    
  }
};
