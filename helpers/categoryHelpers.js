const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");
const async = require("hbs/lib/async");
module.exports = {
  addCategory: (category,file) => {
    category.images=file.filename;
   category.status=true;
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
    return new Promise(async(resolve, reject) => {
      let product = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find({ categoryName: { $exists: true } ,status:true}, { _id: 1, categoryName: 1 })
        .toArray();
      resolve(product);
      console.log("category from the admin side is ",product)
    }).catch((err)=>{
      reject(err);
    })
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
  updateCategory: (id, update,images) => {
    update.images=images;
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
        .updateOne({ _id: new ObjectId(id) },{$set :{status:false}})
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
  getExistingVoucherCodes:()=>{
    return new Promise(async(resolve,reject)=>{
      const voucherCode = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find(
          { voucher: { $exists: true } },
          
        ).project({ "_id": 0, "voucher.voucherCode": 1 })
        .toArray();
      resolve(voucherCode);
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
        .find({ offer: { $exists: true } }, { _id: 1, offer: 1 })
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
              "voucher.voucherCode": 1,
              "voucher.percentage": 1,
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
  addOffer: (data) => {
    data["status"] = true;
    const id = data.category;

    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: { offer: data } })
        .then((response) => {
          resolve(response);
        });
    });
  },
  editOffers: (data, id) => {
    data["status"] = true;
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          { $set: { offer: data } }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  changeStatus: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne(
          {
            _id: new ObjectId(id),
          },
          { $set: { "offer.status": false } }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  findOffersAndApply: (products, counts) => {
    const date = new Date().toISOString().split("T")[0];
    console.log("datae is ", date);
    const amount = products[0].offeredprice * counts[0];
    console.log(products, counts, "at find products and counts");
    return new Promise(async (resolve, reject) => {
      console.log("category Name is ", products[0].category);
      const productOffer = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .aggregate([
          {
            $match: {
              categoryName: products[0].category,
              "offer.endTime": { $gte: date },
              "offer.startTime": { $lte: date },
              "offer.minSpent": { $lte: "amount" },
              "offer.status": true,
            },
          },
          {
            $project: {
              _id: 0,
              "offer.priceType": 1,
              "offer.maxPercentage": 1,
              "offer.maxDiscount": 1,
              "offer.title": 1,
              "offer.minSpent": 1,
            },
          },
        ])
        .toArray();
      resolve(productOffer);
    });
  },
  checkCouponValidity:(couponCode,mobile)=>{
   return new Promise(async (resolve, reject) => {
  const result = await db
    .get()
    .collection(collection.ORDERCOLLECTION)
    .find({ phone: mobile, coupon: couponCode })
    .project({ _id: 0, coupon: 1 })
    .toArray();

  resolve(result);
  console.log("Result from the checkcoupon validity:", result);
});
  }
};
