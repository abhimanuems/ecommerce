const db = require("../config/connection");
const collection = require("../config/collections");
const ObjectId = require("mongodb").ObjectId;
module.exports = {
  //adding users
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
  //updating otp
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
  //get otp from the server
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
  //find the user
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
  // add details of user to database
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
  //updating the status after the verification
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

  //finding all users
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

  //admin updating the status of the user
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
  // updating the cart
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

  // checking the cart items already exits or not
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

  //get the cart of the user
  getCartItemsInUser: (mobileNumber) => {
    return new Promise((resolve, reject) => {
      const CartItemsIds = db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find({ _id: { $in: objectIDArray } })
        .toArray();
    });
  },
  // updating the cart
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
  //add cart quantitiy
  addCartQuantity: (mobileNumber, id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .findOneAndUpdate(
          { phone: mobileNumber, "cartItems.productId.id": id },
          { $inc: { "cartItems.productId.$.count": 1 } }
        )
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  // edit the user details
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
  // finding the wishlist
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
      resolve(wishlist);
    });
  },
  //add to wishlist
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
  //remove the wishlist
  removeWishlistByid: (mobileNumber, id) => {
    const ids = id.toString();
    const array = [ids];
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
  //for get the wallet balance
  getWalletBalance: (mobile) => {
    return new Promise(async (resolve, reject) => {
      const walletBalance = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find({ phone: mobile })
        .project({ wallet: 1, _id: 0 })
        .toArray();
      resolve(walletBalance);
    }).catch((err) => {
      reject(err);
    });
  },
  //update the wallet balance
  updateWalletBalance: (mobile, wallet) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ phone: mobile }, { $set: { wallet: -wallet } })
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  //generating the referal code
  getReferalcode: () => {
    function generateReferralCode(length) {
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let referralCode = "";

      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        referralCode += characters.charAt(randomIndex);
      }

      return referralCode;
    }

    return (referralCode = generateReferralCode(8));
  },
  //finding the refferals
  getReferals: () => {
    return new Promise(async (resolve, reject) => {
      const referal = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .aggregate([
          {
            $match: {
              referalCode: { $exists: true },
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
  //admin approve referals
  approveReferal: () => {
    return new Promise(async (resolve, reject) => {
      const approve = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .aggregate([
          {
            $match: {
              walletUpadte: { $exists: true },
            },
          },
          {
            $unwind: "$walletUpadte",
          },
          {
            $match: {
              "walletUpadte.phone": {
                $exists: true,
              },
            },
          },
          {
            $match: {
              "walletUpadte.status": "pending",
            },
          },
          {
            $lookup: {
              from: collection.ORDERCOLLECTION,
              let: { walletPhone: "$walletUpadte.phone" },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$phone", "$$walletPhone"],
                    },
                  },
                },
                {
                  $match: {
                    Date: {
                      $exists: true,
                      $gte: Date - 30 * 24 * 60 * 60 * 1000,
                    },
                    status: "delivered",
                  },
                },
              ],
              as: "orders",
            },
          },
          {
            $project: {
              phone: 1,
              walletUpadte: 1,
            },
          },
          {
            $unwind: "$walletUpadte",
          },
        ])
        .toArray();
      const ids = approve.map((doc) => doc.phone);
      const walletPhones = approve.map((doc) => doc.walletUpadte.phone);
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateMany(
          { phone: { $in: ids } },
          { $inc: { wallet: 200 } },
          {
            walletUpadte: {
              $elemMatch: {
                $elemMatch: {
                  phone: { $in: walletPhones },
                  status: "pending",
                },
              },
            },
          },
          {
            $set: {
              "walletUpadte.$[outer].$[inner].status": "approved",
            },
          },
          {
            arrayFilters: [
              { "outer.phone": { $in: walletPhones } },
              { "inner.phone": { $in: walletPhones } },
            ],
          }
        );
    })
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        reject(err);
      });
  },
  //find the wallet balance
  findWalletBalance: (mobile) => {
    return new Promise(async (resolve, reject) => {
      const wallet = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .aggregate([
          { $match: { phone: mobile } },
          { $project: { wallet: 1, _id: 0 } },
        ])
        .toArray();
      resolve(wallet[0].wallet);
    });
  },
  // get refereal details from admin side
  getreferralDetails: (mobile) => {
    return new Promise(async (resolve, reject) => {
      const details = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .aggregate([
          { $match: { phone: mobile } },
          { $project: { referalCode: 1 } },
          { $addFields: { referalCode: "$referalCode" } },
          {
            $lookup: {
              from: collection.CREDENTIALCOLLECTION,
              localField: "referalCode",
              foreignField: "referal",
              as: "matchingDocuments",
            },
          },
          {
            $match: {
              "matchingDocuments.phone": { $ne: mobile },
            },
          },
          { $unwind: "$matchingDocuments" },
        ])
        .toArray();
      resolve(details);
    });
  },
  //adding referal code while signup
  referral: (phone, referalCode) => {
    return new Promise((resolve, reject) => {
      const referral = {
        phone: phone,
        referalCode: referalCode,
        referralDate: new Date(),
      };
      db.get()
        .collection(collection.REFERALCOLLECTION)
        .findOneAndUpdate(
          {
            phone: phone,
          },
          {
            $setOnInsert: referral,
          },
          {
            upsert: true,
            returnOriginal: false,
          }
        )
        .then(() => {});
    });
  },
};
