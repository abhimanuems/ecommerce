const db = require("../config/connection");
const collection = require("../config/collections");
const { response } = require("express");
const { mobile } = require("../controllers/userController/productView");
const { parse } = require("handlebars");
const ObjectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
const async = require("hbs/lib/async");
const instance = new Razorpay({
  key_id: "rzp_test_bLt7yzzH20t8v9",
  key_secret: "9f8327fvCnjWCAj0mpp8uNJB",
});
module.exports = {
  getCartLength: (mobileNumber) => {
    return new Promise(async (resolve, reject) => {
      const cartLength = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find({ phone: mobileNumber }, { cartItems: 1, _id: 0 })
        .toArray();
      if (cartLength != null) {
      } else {
        resolve(0);
      }
    });
  },
  getCartIds: (mobileNumber) => {
    return new Promise(async (resolve, reject) => {
      const ids = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .aggregate([
          { $match: { phone: mobileNumber } },
          { $project: { _id: 0, cartItems: 1 } },
        ])
        .toArray();

      if (!ids[0]?.cartItems?.productId) {
        resolve([], []);
        return;
      }

      const ItemCounts = ids[0].cartItems.productId.map((item) => item.count);

      const objectIds = ids[0].cartItems.productId.map(
        (item) => new ObjectId(item.id)
      );

      resolve([objectIds, ItemCounts]);
    });
  },

  removeFromCart: (mobileNumber, Id) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne(
          { phone: mobileNumber },
          { $pull: { "cartItems.productId": { id: Id } } }
        )
        .then((response) => {
          console.log(response);
        });
    });
  },
  getTotalAmount: (data) => {
    return new Promise(async (resolve, reject) => {
      const amount = await db
        .get()
        .collection(collection.PRODUCTCOLLECTION)
        .aggregate([
          { $match: { _id: { $in: data } } },
          {
            $group: {
              _id: null,
              totalSellingPrice: { $sum: { $toDouble: "$sellingPrice" } },
              totalofferedPrice: { $sum: { $toDouble: "$offeredprice" } },
            },
          },
        ])
        .toArray();
      console.log(amount);
      resolve(amount);
    });
  },
  updateCartQuantity: (id, quantity, mobileNumber) => {
    console.log(new ObjectId(id));
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne(
          { phone: mobileNumber, "cartItems.productId.id": id },
          { $set: { "cartItems.productId.$.count": quantity } }
        )
        .then((response) => {
          resolve("response", response);
        })
        .catch((error) => {
          reject("error", error);
        });
    });
  },
  getTotalAmounts: (mobileNumber) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .findOne({ phone: mobileNumber })
        .then((user) => {
          const cartItems = user.cartItems.productId;

          let totalAmountSellingPrice = 0;
          let totalAmountOfferedPrice = 0;

          const promises = [];

          cartItems.forEach((item) => {
            const productId = item.id;
            const count = item.count;

            const promise = db
              .get()
              .collection(collection.PRODUCTCOLLECTION)
              .findOne({ _id: new ObjectId(productId) })
              .then((product) => {
                const sellingPrice = parseInt(product.sellingPrice);
                const offeredPrice = parseInt(product.offeredprice);
                const quantity = parseInt(product.quantity);

                if (quantity > 0) {
                  const itemTotal = sellingPrice * count;
                  const itemTotals = offeredPrice * count;
                  console.log(
                    "itemTotal selling and offered are",
                    itemTotal,
                    itemTotals
                  );

                  totalAmountSellingPrice += itemTotal;
                  totalAmountOfferedPrice += itemTotals;
                }
              });

            promises.push(promise);
          });

          Promise.all(promises)
            .then(() => {
              console.log("Total Amount:", totalAmountSellingPrice);
              resolve({ totalAmountSellingPrice, totalAmountOfferedPrice });
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  findAddress: (mobileNumber) => {
    return new Promise(async (resolve, reject) => {
      let address = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find({ phone: mobileNumber })
        .toArray();
      console.log(address);
      resolve(address);
    });
  },
  findAdressByindex: (mobile, id) => {
    const arrayId = parseInt(id);
    return new Promise(async (resolve, reject) => {
      let address = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .aggregate([
          { $match: { phone: mobile } },
          {
            $project: { arrayElement: { $arrayElemAt: ["$address", arrayId] } },
          },
          { $project: { _id: 0, arrayElement: 1 } },
        ])
        .toArray();
      resolve(address);
    });
  },
  orderDetails: (
    phoneNumber,
    proId,
    totalprice,
    addressOrder,
    deliveryfee,
    paymentMode
  ) => {
    const orderDetails = {
      phone: phoneNumber,
      productId: proId,
      totalPrice: totalprice,
      address: addressOrder,
      deliveryFee: deliveryfee,
      paymentMode,
      coupon: " ",
      status: "orderplaced",
      Date: Date.now(),
    };

    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .insertOne(orderDetails)
        .then((response) => {
          console.log("response is ", response.insertedId);
          const orderId = response.insertedId.toString();
          resolve(orderId);
        });
    });
  },

  viewOrderDetails: () => {
    return new Promise(async (resolve, reject) => {
      const orderDetails = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .find()
        .toArray();
      resolve(orderDetails);
    });
  },
  deleteCart: (mobileNumber) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ phone: mobileNumber }, { $unset: { cartItems: "" } })
        .then((response) => {});
    });
  },
  updateOrderStatus: (data) => {
    return new Promise((resolve, reject) => {
      const { orderId, status } = data;
      db.get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne({ _id: new ObjectId(orderId) }, { $set: { status: status } })
        .then((response) => {
          resolve(response);
        });
    });
  },
  viewOrderDetailsUser: (mobile) => {
    return new Promise(async (resolve, reject) => {
      const orderDetails = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .find({ phone: mobile })
        .toArray();
      resolve(orderDetails);
    });
  },
  getOrderIds: (mobileNumber) => {
    return new Promise(async (resolve, reject) => {
      const details = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .aggregate([
          { $match: { phone: mobileNumber } },
          {
            $project: {
              _id: 0,
              productId: { $arrayElemAt: ["$productId", 0] },
            },
          },
        ])
        .toArray();
      resolve(details[0].productId);
    });
  },

  deleteAddress: async (index, mobile) => {
    console.log("index at delete", index);
    return new Promise(async (resolve, reject) => {
      const parsedIndex = parseInt(index);
      const collections = db.get().collection(collection.CREDENTIALCOLLECTION);

      const document = await collections.findOne({ phone: mobile });
      if (!document) {
        reject("Document not found.");
        return;
      }

      const addressArray = document.address;
      if (parsedIndex < 0 || parsedIndex >= addressArray.length) {
        reject("Invalid index.");
        return;
      }

      addressArray.splice(parsedIndex, 1);
      await collections.updateOne(
        { phone: mobile },
        { $set: { address: addressArray } }
      );

      resolve();
    });
  },

  aggreateProducts: (mobile) => {
    return new Promise(async (resolve, reject) => {
      const orders = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .aggregate([
          { $match: { phone: mobile } },
          { $unwind: "$productId" },
          {
            $group: {
              _id: {
                _id: "$_id",
                phone: "$phone",
                totalPrice: "$totalPrice",
                address: "$address",
                deliveryFee: "$deliveryFee",
                paymentMode: "$paymentMode",
                coupon: "$coupon",
                status: "$status",
                Date: "$Date",
              },
              productId: { $push: "$productId" },
            },
          },
          {
            $project: {
              _id: "$_id._id",
              phone: "$_id.phone",
              totalPrice: "$_id.totalPrice",
              address: "$_id.address",
              deliveryFee: "$_id.deliveryFee",
              paymentMode: "$_id.paymentMode",
              coupon: "$_id.coupon",
              status: "$_id.status",
              Date: "$_id.Date",
              productId: 1,
            },
          },
        ])
        .toArray();

      resolve(orders);
    });
  },
  updateStatus: (value) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: new ObjectId(value) },
          { $set: { status: "cancelled" } }
        );
    });
  },
  updateAddress: async (index, mobile, updatedAddress) => {
    console.log("index at update", index);
    return new Promise(async (resolve, reject) => {
      const parsedIndex = parseInt(index);
      const collections = db.get().collection(collection.CREDENTIALCOLLECTION);

      const document = await collections.findOne({ phone: mobile });
      if (!document) {
        reject("Document not found.");
        return;
      }

      const addressArray = document.address;
      if (parsedIndex < 0 || parsedIndex >= addressArray.length) {
        reject("Invalid index.");
        return;
      }

      addressArray[parsedIndex] = updatedAddress;
      await collections.updateOne(
        { phone: mobile },
        { $set: { address: addressArray } }
      );

      resolve();
    });
  },

  razorPay: (id, total) => {
    console.log("razpor pay is ", id, total);
    return new Promise((resolve, reject) => {
      var options = {
        amount: total,
        currency: "INR",
        receipt: id,
      };
      instance.orders.create(options, function (err, order) {
        console.log(order, "is the order");
        resolve(order);
      });
    });
  },
  verifyPayment: (data) => {
    return new Promise((resolve, reject) => {
      const crypto = require("crypto");
      let hmac = crypto.createHmac("sha256", "9f8327fvCnjWCAj0mpp8uNJB");
      hmac.update(
        data["payment[razorpay_order_id]"] +
          "|" +
          data["payment[razorpay_payment_id]"]
      );
      hmac = hmac.digest("hex");
      if (hmac == data["payment[razorpay_signature]"]) {
        resolve();
      } else {
        reject();
      }
    });
  },
  changePaymentStatus:(id)=>{
    return new Promise((resolve,reject)=>{
      db.get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne({ _id: new ObjectId(id) }, { $set: { paymentMode :"razorpay"} });
    })
  }
};
