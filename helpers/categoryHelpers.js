const db = require("../config/connection");
const collection = require("../config/collections");
const { ObjectId } = require("mongodb");
module.exports = {
  //add new category
  addCategory: (category, file) => {
    category.images = file;
    category.status = true;
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
  //view all category
  viewCategory: () => {
    return new Promise(async (resolve, reject) => {
      let product = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find(
          { categoryName: { $exists: true }, status: true },
          { _id: 1, categoryName: 1 }
        )
        .toArray();
      resolve(product);
    }).catch((err) => {
      reject(err);
    });
  },
  //finding the category
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
  //updating the category
  updateCategory: (id, update, images) => {
    update.images = images;
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
  //deleting the category
  deleteCategory: (id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: { status: false } })
        .then(() => {
          resolve(true);
        });
    }).catch((err) => {
      console.log(err);
    });
  },
  //add new vouchers
  addVouchers: (data) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CATEGORYCOLLECTION)
        .insertOne({ voucher: data });
    }).then(() => {
      resolve(true);
    });
  },
  //finding the existing vouchers
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
  //finding the voucher codes
  getExistingVoucherCodes: () => {
    return new Promise(async (resolve, reject) => {
      const voucherCode = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .find({ voucher: { $exists: true } })
        .project({ _id: 0, "voucher.voucherCode": 1 })
        .toArray();
      resolve(voucherCode);
    });
  },
  //deleting the voucher
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
  //edit vouchers
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
  // view all offers
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
  // check the voucher is valid or not
  checkCoupon: (data) => {
    return new Promise(async (resolve, reject) => {
      const coupon = data.toString();
      const convertedDate = new Date().toISOString().split("T")[0];
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
  // add new offes
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
  // edit offers
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
  //change the status of the offer
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
  // offer and apply -- cart
  findOffersAndApply: (products, counts) => {
    const date = new Date().toISOString().split("T")[0];

    const amount = products[0].offeredprice * counts[0];

    return new Promise(async (resolve, reject) => {
      const productOffer = await db
        .get()
        .collection(collection.CATEGORYCOLLECTION)
        .aggregate([
          {
            $match: {
              categoryName: {
                $in: products.map((product) => product.category),
              },
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
      console.log("categroy offers are", productOffer);
    });
  },
  // finding the validity of the coupoun
  checkCouponValidity: (couponCode, mobile) => {
    return new Promise(async (resolve, reject) => {
      const result = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .find({ phone: mobile, coupon: couponCode })
        .project({ _id: 0, coupon: 1 })
        .toArray();

      resolve(result);
    });
  },
  //updating the referral
  UpdateRefferal: (mobile) => {
    try {
      return new Promise(async (resolve, reject) => {
        const referal = await db
          .get()
          .collection(collection.CREDENTIALCOLLECTION)
          .aggregate([
            {
              $match: { phone: mobile },
            },
            {
              $project: { referal: 1 },
            },
            {
              $lookup: {
                from: collection.CREDENTIALCOLLECTION,
                localField: "referal",
                foreignField: "referalCode",
                as: "referalDocuments",
              },
            },
          ])
          .toArray();

        resolve(referal[0].referalDocuments);

        const details = referal[0].referalDocuments;

        if (details.length == 0) {
          return;
        }

        const walletUpadte = [{ phone: mobile, status: "pending" }];
        db.get()
          .collection(collection.CREDENTIALCOLLECTION)
          .updateOne(
            { phone: details[0].phone },
            { $push: { walletUpadte: walletUpadte } }
          )
          .then((res) => {
            resolve(0);
          });
      });
    } catch (err) {
      console.log(err);
    }
  },
};
