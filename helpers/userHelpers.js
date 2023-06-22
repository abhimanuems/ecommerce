const db = require("../config/connection");
const collection = require("../config/collections");
const async = require("hbs/lib/async");
// const { mobile } = require("../controllers/userController/productView");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  addUser: (details) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .insertOne(details)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateOTP: (phoneNumber, otp) => {
    console.log("phone is", phoneNumber, "otp is ", otp);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ phone: phoneNumber }, { $set: { OTP: otp } })
        .then((result) => {
          resolve();
        })
        .catch((error) => {
          console.error("Error updating document:", error);
          reject(error);
        });
    });
  },
  getOtp: (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
      let result = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find({ phone: phoneNumber })
        .toArray();
      resolve(result);
    });
  },
  getUser: (phone) => {
    return new Promise(async (resolve, reject) => {
      let credentials = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find({ phone: phone })
        .toArray();
      resolve(credentials);
    });
  },
  addDetails: (details) => {
    return new Promise((resolve, reject) => {
      let result = db
        .get()
        .collection(collection.OTPSAVER)
        .insertOne(details)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateStatus: (phoneNumber, update) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ phone: phoneNumber }, { $set: { status: update } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getusers: () => {
    return new Promise((resolve, reject) => {
      let result = db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find()
        .toArray();
      resolve(result);
    });
  },

  updateStatusAdmin: (id, update) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: { status: update } })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  updateCart: (mobileNumber, productId) => {
    return new Promise((resolve, reject) => {
      const cartItems = {
        productId: [{ id: productId, count: 1 }],
      };

      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ phone: mobileNumber }, { $set: { cartItems: cartItems } })
        .then((response) => {
          resolve(response);
          console.log(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  cartCheckItemExists: (mobileNumber, productId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .findOne({ phone: mobileNumber, "cartItems.productId.id": productId })
        .then((cartItems) => {
          resolve(cartItems);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getCartItemsInUser: (mobileNumber) => {
    return new Promise((resolve, reject) => {
      const CartItemsIds = db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find({ _id: { $in: objectIDArray } })
        .toArray();
    });
  },
  updateCart: (mobileNumber, productId) => {
    return new Promise((resolve, reject) => {
      const cartItem = {
        id: productId,
        count: 1,
      };

      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .findOneAndUpdate(
          { phone: mobileNumber },
          { $push: { "cartItems.productId": cartItem } },
          { returnOriginal: false }
        )
        .then((response) => {
          resolve(response.value);
          console.log(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addCartQuantity: (mobileNumber, id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .findOneAndUpdate(
          { phone: mobileNumber, "cartItems.productId.id": id },
          { $inc: { "cartItems.productId.$.count": 1 } }
        );
    });
  },
  editUserdetails: (mobileNumber, data) => {
    return new Promise((resolve, reject) => {
      const { name, email } = data;
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne(
          { phone: mobileNumber },
          { $set: { name: name, email: email } }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  },
  getWishlist: (phoneNumber) => {
    return new Promise(async (resolve, reject) => {
      const wishlist = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .aggregate([
          { $match: { phone: phoneNumber } },
          { $project: { _id: 0, wishlist: 1 } },
        ])
        .toArray();
      console.log("wishlist is ", wishlist);
      resolve(wishlist);
    });
  },
  addWishlistData: (mobile, id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne(
          {
            phone: mobile,
          },
          { $addToSet: { wishlist: id } }
        );
    });
  },
  removeWishlistByid: (mobileNumber, id) => {
    const ids = id.toString();
    const array = [ids];
    console.log("id is ", id);
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne(
          { phone: mobileNumber },
          { $pull: { wishlist: { $in: array } } },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
    });
  },
  getReferalcode: () => {
    function generateReferralCode(length) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      var referralCode = "";

      for (var i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referralCode += characters.charAt(randomIndex);
      }

      return referralCode;
    }

    return (referralCode = generateReferralCode(8));
  },
  getReferals: () => {
    return new Promise(async (resolve, reject) => {
      const referal = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .aggregate([
          {
            $match: {
              referalCode: { $exists: true },
              referal: { $exists: true },
            },
          },
          {
            $lookup: {
              from: collection.CREDENTIALCOLLECTION,
              let: { referred: "$referal" },
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$referalCode", "$$referred"] },
                  },
                },
                {
                  $project: {
                    _id: 0,
                    referred: "$referalCode",
                    referrer: "$referal",
                    phone: "$phone",
                    wallet: "$wallet",
                    name: "$name",
                  },
                },
              ],
              as: "referralInfo",
            },
          },
        ])
        .toArray();
      resolve(referal);
    }).catch((err) => {
      reject(err);
    });
  },
  approveReferal:()=>{
    return new Promise(async(resolve,reject)=>{
     const order= await db.get()
        .collection(collection.CREDENTIALCOLLECTION).
        aggregate([
          {
            $match: {
              referalCode: { $exists: true },
              referal: { $exists: true },
            },
          },
          {
            $lookup: {
              from: "order",
              let: { phone: "$phone" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $and: [
                        { $eq: ["$phone", "$$phone"] },
                        {
                          $lte: [
                            "$Date",
                            {
                              $subtract: [
                                new Date(),
                                { $multiply: [30, 24, 60, 60, 1000] },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              ],
              as: "orders",
            },
          },
          {
            $match: {
              orders: { $ne: [] },
            },
          },
          {
            $limit: 1,
          },
          
        ]).toArray()
        console.log('from the approve offer',order)

    })
  }
};
