const db = require("../config/connection");
const collection = require("../config/collections");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const Razorpay = require("razorpay");
const instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});


module.exports = {
  //for finding the cart length
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
  //finding the cart ids
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
  // remove from the cart
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
  //finding the tootal amounts
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
      resolve(amount);
    });
  },
  //update the cart quantity
  updateCartQuantity: (id, quantity, mobileNumber) => {
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
  // for finding the total amounts
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

                  totalAmountSellingPrice += itemTotal;
                  totalAmountOfferedPrice += itemTotals;
                }
              });

            promises.push(promise);
          });

          Promise.all(promises)
            .then(() => {
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
  //finding the address
  findAddress: (mobileNumber) => {
    return new Promise(async (resolve, reject) => {
      const address = await db
        .get()
        .collection(collection.CREDENTIALCOLLECTION)
        .find({ phone: mobileNumber })
        .toArray();
      resolve(address);
    });
  },
  //find the address by index
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
    paymentMode,
    voucher,
    offer,
    walletUsed
  ) => {
    // totalprice+=walletUsed;
    const orderDetails = {
      phone: phoneNumber,
      productId: proId,
      totalPrice: totalprice,
      address: addressOrder,
      deliveryFee: deliveryfee,
      paymentMode,
      coupon: voucher,
      offer: offer,
      status: "orderplaced",
      Date: new Date(),
      receipt: null,
      razorPayStatus: null,
      walletUsed: walletUsed,
    };
    return new Promise(async (resolve, reject) => {
      await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .insertOne(orderDetails)
        .then((response) => {
          const orderId = response.insertedId.toString();
          resolve(orderId);
        });
    });
  },
  viewOrderDetails: () => {
    return new Promise(async (resolve, reject) => {
      const order = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .aggregate([
          {
            $lookup: {
              from: "product",
              let: { productId: { $arrayElemAt: ["$productId", 0] } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$_id",
                        { $toObjectId: { $arrayElemAt: ["$$productId", 0] } },
                      ],
                    },
                  },
                },
              ],
              as: "productDetails",
            },
          },
          {
            $unwind: "$productDetails",
          },
          {
            $sort: {
              Date: -1,
            },
          },
        ])
        .toArray();
      resolve(order);
    });
  },
  //for deleting the cart
  deleteCart: (mobileNumber) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.CREDENTIALCOLLECTION)
        .updateOne({ phone: mobileNumber }, { $unset: { cartItems: "" } })
        .then((response) => { resolve(response)});
    });
  },
  //for updating the order status
  updateOrderStatus: (data) => {
    return new Promise((resolve, reject) => {
      const { orderId, status } = data;
      db.get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: new ObjectId(orderId) },
          { $set: { status: status, DOFS: new Date() } }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          console.log("error in the update order status ", err);
          reject(err);
        });
    });
  },
  //for viewing the order detials user 
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
  //finding the  order detials
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
  //delete address
  deleteAddress: async (index, mobile) => {
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

  //finding orders and products for user side -orders
  aggreateProducts: (mobile) => {
    return new Promise(async (resolve, reject) => {
      const order = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .aggregate([
          {
            $match: {
              phone: mobile,
            },
          },
          {
            $lookup: {
              from: "product",
              let: { productId: { $arrayElemAt: ["$productId", 0] } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [
                        "$_id",
                        { $toObjectId: { $arrayElemAt: ["$$productId", 0] } },
                      ],
                    },
                  },
                },
              ],
              as: "productDetails",
            },
          },
          {
            $unwind: "$productDetails",
          },
          {
            $sort: {
              Date: -1,
            },
          },
        ])
        .toArray();
      console.log("order details are ", order)
      resolve(order);

    });
  },

  //updating the status order for cancellation
  updateStatus: (value, reason) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: new ObjectId(value) },
          { $set: { status: "cancelled", returnReason: reason } }
        );
    });
  },
  // udpating the status of the return status
  updateStatusReturn: (value) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: new ObjectId(value) },
          { $set: { status: "returned" } }
        );
    });
  },
  //updating the address
  updateAddress: async (index, mobile, updatedAddress) => {
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

  // razpor pay
  razorPay: (id, total) => {
    console.log("total and id is ",id,typeof(total))
    return new Promise((resolve, reject) => {
      var options = {
        amount: total * 100,
        currency: "INR",
        receipt: id,
      };
      instance.orders.create(options, function (err, order) {
        console.log("order is ",order)
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
  //changing the payment status
  changePaymentStatus: (id, receiptOrder) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.ORDERCOLLECTION)
        .updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              paymentMode: "razorpay",
              receipt: receiptOrder,
              razorPayStatus: true,
            },
          }
        )
        .then((response) => {
          resolve(response);
        });
    });
  },
  //finding the chart data
  chartData: () => {
    const currentDate = new Date();

    const endOfDay = currentDate.getTime();

    currentDate.setDate(currentDate.getDate() - 8);
    const startOfDay = currentDate.getTime();
    return new Promise(async (resolve, reject) => {
      const order = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .aggregate([
          {
            $match: {
              Date: {
                $gte: new Date(startOfDay),
                $lt: new Date(endOfDay),
              },
            },
          },
          {
            $unwind: {
              path: "$productId",
              includeArrayIndex: "index",
            },
          },
          {
            $match: {
              index: 0,
            },
          },

          {
            $unwind: "$productId",
          },
          {
            $lookup: {
              from: collection.PRODUCTCOLLECTION,
              let: { productId: { $toObjectId: "$productId" } },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: ["$_id", "$$productId"],
                    },
                  },
                },
              ],
              as: "productDetails",
            },
          },
          {
            $unwind: "$productDetails",
          },
          {
            $group: {
              _id: "$_id",
              orderId: { $first: "$_id" },
              phone: { $first: "$phone" },
              quantity: { $first: "$productId" },
              totalPrice: { $first: "$totalPrice" },
              address: { $first: "$address" },
              deliveryFee: { $first: "$deliveryFee" },
              paymentMode: { $first: "$paymentMode" },
              coupon: { $first: "$coupon" },
              status: { $first: "$status" },
              Date: { $first: "$Date" },
              products: {
                $push: {
                  _id: "$productDetails._id",
                  productName: "$productDetails.productName",
                  productBrand: "$productDetails.productBrand",
                  category: "$productDetails.category",
                  quantity: "$productDetails.quantity",
                  buyPrice: "$productDetails.buyPrice",
                  sellingPrice: "$productDetails.sellingPrice",
                  offeredPrice: "$productDetails.offeredprice",
                  description: "$productDetails.description",
                  trendingProduct: "$productDetails.trendingProduct",
                  featuredProduct: "$productDetails.featuredProduct",
                  images: "$productDetails.images",
                },
              },
            },
          },

          {
            $limit: 5,
          },
          {
            $sort: {
              Date: -1,
            },
          },
        ])
        .toArray();
      resolve(order);
    });
  },
  //finding the total sales for admin dashboard
  getTotalSales: () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfDay = currentDate.getTime();
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
    return new Promise(async (resolve, reject) => {
      const data = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .aggregate([
          {
            $match: {
              Date: {
                $gte: startOfDay,
                $lt: endOfDay,
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSum: { $sum: "$totalPrice" },
              averageSale: { $avg: "$totalPrice" },
              totalCount: { $sum: 1 },
            },
          },
        ])
        .toArray();
      resolve(data);
    });
  },
  // data for admin dashboard
  findDataDashBoard: (id) => {
    if (id == "daily") {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const startOfDay = currentDate.getTime();
      const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
      return new Promise(async (resolve, reject) => {
        const data = await db
          .get()
          .collection(collection.ORDERCOLLECTION)
          .aggregate([
            {
              $match: {
                Date: {
                  $gte: new Date(startOfDay),
                  $lt: new Date(endOfDay),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalSum: { $sum: "$totalPrice" },
                averageSale: { $avg: "$totalPrice" },
                totalCount: { $sum: 1 },
              },
            },
          ])
          .toArray();
        resolve(data);
      });
    } else if (id == "weekly") {

      const currentDate = new Date();
      const endOfDay = currentDate.getTime();
      currentDate.setDate(currentDate.getDate() - 8);
      const startOfDay = currentDate.getTime();

      return new Promise(async (resolve, reject) => {
        const data = await db
          .get()
          .collection(collection.ORDERCOLLECTION)
          .aggregate([
            {
              $match: {
                Date: {
                  $gte: new Date(startOfDay),
                  $lte: new Date(endOfDay),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalSum: { $sum: "$totalPrice" },
                averageSale: { $avg: "$totalPrice" },
                totalCount: { $sum: 1 },
              },
            },
          ])
          .toArray();
        resolve(data);
      });
    } else if (id == "monthly") {
      const currentDate = new Date();
      const endOfMonth = currentDate.getTime();
      currentDate.setDate(currentDate.getDate() - 8);
      const startOfMonth = currentDate.getTime();
      return new Promise(async (resolve, reject) => {
        const data = await db
          .get()
          .collection(collection.ORDERCOLLECTION)
          .aggregate([
            {
              $match: {
                Date: {
                  $gte: new Date(startOfMonth),
                  $lt: new Date(endOfMonth),
                },
              },
            },
            {
              $group: {
                _id: null,
                totalSum: { $sum: "$totalPrice" },
                averageSale: { $avg: "$totalPrice" },
                totalCount: { $sum: 1 },
              },
            },
          ])
          .toArray();
        resolve(data);
      });
    }
  },
  // finnding the date for table in the admin dashbaord
  findDataForTable: (start, end) => {
    return new Promise(async (resolve, reject) => {
      const order = await db
        .get()
        .collection(collection.ORDERCOLLECTION)
        .aggregate([
          {
            $match: {
              Date: {
                $gte: new Date(start),
                $lt: new Date(end),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalSum: { $sum: "$totalPrice" },
              averageSale: { $avg: "$totalPrice" },
              totalCount: { $sum: 1 },
            },
          },
        ])
        .toArray();
      resolve(order);
    });
  },

};
