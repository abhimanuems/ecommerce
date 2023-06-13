const userHelpers = require("../../helpers/userHelpers");
const orderHelper = require("../../helpers/orderHelpers");
const orderHelpers = require("../../helpers/orderHelpers");
const productHelpers = require("../../helpers/productHelpers");
const userorderHelpers = require("../../helpers/userShowOrderHelper");
const offerHelpers = require("../../helpers/categoryHelpers");
const { mobile } = require("./productView");
const { response } = require("express");
const async = require("hbs/lib/async");

module.exports = {
  getCart: async (req, res) => {
    if (req.session.user) {
      await orderHelpers
        .getCartIds(req.session.mobileNumber)
        .then((resultId) => {
          req.session.productIds = resultId;
          if (resultId[0]) {
            productHelpers.getProductCart(resultId[0]).then((product) => {
              req.session.product = product;

              orderHelper.getTotalAmount(resultId[0]).then((result) => {
                orderHelper
                  .getTotalAmounts(req.session.mobileNumber)
                  .then((amounts) => {
                    req.session.amounts = amounts;

                    const count = resultId[1];
                    const ids = resultId[0];
                    req.session.array = resultId;
                    req.session.counts = count;
                    req.session.id = ids;
                    req.session.OrderPlaced = false;
                    res.render("users/user-cart", {
                      admin: false,
                      user: req.session.user,
                      mobile: req.session.mobileNumber,
                      product,
                      ids,
                      count,
                      amounts,
                    });
                  });
              });
            });
          } else {
            res.render("users/user-cart", {
              admin: false,
              user: req.session.user,
            });
          }
        });
    } else {
      res.render("users/user-cart", {
        admin: false,
        user: null,
      });
    }
  },
  addToCart: (req, res) => {
    const id = req.params.id;
    if (req.session.user) {
      userHelpers
        .cartCheckItemExists(req.session.mobileNumber, req.params.id)
        .then((result) => {
          if (result) {
            userHelpers.addCartQuantity(req.session.mobileNumber, id);
          } else {
            userHelpers.updateCart(req.session.mobileNumber, id);
          }
          res.redirect("/cart");
        });
    } else {
      res.redirect("/cart");
    }
  },
  removeCart: (req, res) => {
    const id = req.params.id;
    if (req.session.user) {
      orderHelper.removeFromCart(req.session.mobileNumber, id);
      res.redirect("/cart");
    } else {
      res.redirect("/");
    }
  },
  checkOut: (req, res) => {
    if (req.session.user) {
      orderHelper.findAddress(req.session.mobileNumber).then((result) => {
        if (result[0].hasOwnProperty("address")) {
          const address = result[0].address;
          const amounts = req.session.amounts;
          const product = req.session.product;
          productHelpers.changeQuantity(
            req.session.id,
            req.session.counts,
            req.session.array
          );
          if (req.session.OrderPlaced == false) {
            res.render("users/user-placeorder", {
              admin: false,
              user: req.session.user,
              mobileNumber: req.session.mobileNumber,
              address,
              amounts,
              product,
            });
          } else {
            res.redirect("/");
          }
        } else {
          res.render("users/user-placeorder", {
            admin: false,
            user: req.session.user,
            mobileNumber: req.session.mobileNumber,
            result: [],
          });
        }
      });
    } else {
      res.redirect("/");
    }
  },
  cartQuantity: (req, res) => {
    if (req.session.user) {
      const { product, quantity, mobileNumber } = req.body;

      orderHelpers
        .updateCartQuantity(product, quantity, mobileNumber)
        .then((response) => {
          res.json({ status: 200 });
          res.end();
        });
    } else {
      res.redirect("/");
    }
  },

  placeOrder: async (req, res) => {
    if (req.session.user) {
      const addressIndex = req.body.selectedAddressIndex;
      const paymentMode = req.body.paymentMethod;
      await orderHelpers
        .findAdressByindex(req.session.mobileNumber, addressIndex)
        .then((address) => {
          req.session.address = address[0].arrayElement;
        });

      if (req.session.amounts.totalAmountOfferedPrice < 500) {
        var deliveryFee = 60;
      } else {
        var deliveryFee = 0;
      }
      const totalPrice = req.session.amounts.totalAmountOfferedPrice;
      orderHelper.deleteCart(req.session.mobileNumber);
      orderHelper
        .orderDetails(
          req.session.mobileNumber,
          req.session.productIds,
          totalPrice,
          req.session.address,
          deliveryFee,
          paymentMode
        )
        .then((id) => {
          console.log("order id is ", id);
          req.session.OrderPlaced = true;
          if (paymentMode == "COD") {
            res.json({ COD: true });
          } else {
            orderHelpers.razorPay(id, totalPrice).then((response) => {
              console.log("response from the raporpay ", response);
              res.json({ response });
            });
          }
        });

      // res.render("users/paymentPaage", {
      //   admin: false,
      //   user: req.session.user,
      //   mobileNumber: req.session.mobileNumber,
      // });
    } else {
      res.redirect("/");
    }
  },
  addAddress: (req, res) => {
    if (req.session.user) {
      productHelpers.addAddress(req.params.id, req.body);
      res.redirect("/checkoutForOrder");
    } else {
      res.redirect("/");
    }
  },
  addAddressmyAccount: (req, res) => {
    if (req.session.user) {
      productHelpers.addAddress(req.session.mobileNumber, req.body);
      res.redirect("/myaccount/address");
    } else {
      res.redirect("/");
    }
  },
  paymentMode: (req, res) => {},
  myOrders: (req, res) => {
    if (req.session.user) {
      orderHelper.aggreateProducts(req.session.mobileNumber).then((orders) => {
        res.render("users/vieworders", {
          admin: false,
          orders,
          user: req.session.mobileNumber,
        });
      });
    } else {
      res.redirect("/");
    }
  },
  myAddress: (req, res) => {
    if (req.session.user) {
      orderHelper.findAddress(req.session.mobileNumber).then((result) => {
        if (result[0].hasOwnProperty("address")) {
          const address = result[0].address;
          const amounts = req.session.amounts;

          const product = req.session.product;
          res.render("users/address", {
            admin: false,
            user: req.session.user,
            mobileNumber: req.session.mobileNumber,
            address,
            amounts,
            product,
          });
        } else {
          res.render("users/address", {
            admin: false,
            user: req.session.user,
            mobileNumber: req.session.mobileNumber,
            address: null,
          });
        }
      });
    } else {
      res.redirect("/");
    }
  },
  deleteAddress: (req, res) => {
    if (req.session.user) {
      const id = req.params.id;
      const mobile = req.session.mobileNumber;

      orderHelpers.deleteAddress(id, mobile);
      res.redirect("/myaccount/address");
    } else {
      res.redirect("/");
    }
  },
  updateOrderStatus: (req, res) => {
    if (req.session.user) {
      orderHelper.updateStatus(req.body.order_id);
      res.json("success");
    }
  },
  editAddress: (req, res) => {
    if (req.session.user) {
      orderHelper.updateAddress(
        req.params.id,
        req.session.mobileNumber,
        req.body
      );
      res.redirect("/myaccount");
    } else {
      res.redirect("/");
    }
  },

  getWishlist: (req, res) => {
    if (req.session.user) {
      userHelpers.getWishlist(req.session.mobileNumber).then((wishlist) => {
        if (wishlist.length != 0) {
          const productIdArray = wishlist[0].wishlist;
          productHelpers.getWishProduct(productIdArray).then((products) => {
            console.log("products at wishlist is", products);

            res.render("users/wishlist", {
              admin: false,
              user: req.session.user,
              mobile: req.session.mobileNumber,
              products,
            });
          });
        } else {
          res.render("users/wishlist", {
            admin: false,
            user: req.session.user,
            mobile: req.session.mobileNumber,
          });
        }
      });
    }
  },
  getSuccessPage: (req, res) => {
    if (req.session.user) {
      res.render("users/paymentPaage", {
        admin: false,
        user: req.session.user,
        mobileNumber: req.session.mobileNumber,
      });
    }
  },
  verifyPayment: (req, res) => {
    if (req.session.user) {
      orderHelpers
      console.log("enetedd at veerify payment ")
        .verifyPayment(req.body)
        .then(() => {
          orderHelpers.changePaymentStatus(req.body["receipt"]).then(() => {
            res.json({ status: true });
          });
        })
        .catch((err) => {
          console.log(err, "is at the payment gate razor pay");
          res.json({ status: false, err });
        });
    } else {
      res.redirect("/");
    }
  },
  applyCoupoun:async (req,res)=>{
  if(req.session.user)
  {
   const coupon = req.body.coupon;
   let totalPrice =(req.body.total);
   totalPrice = totalPrice.replace("₹", "");
   console.log(totalPrice)
   totalPrice=parseInt(totalPrice)
   await offerHelpers.checkCoupon(coupon).then((result)=>{
    console.log("result inside the applycouppoun is ",result)
    if(result.length>0){
      
      if(result[0].voucher.priceType ==='flat')
      {
        console.log("totalprice inside ",totalPrice)
        totalPrice = totalPrice - parseInt(result[0].voucher.price);
        console.log("after applying voucher is ",totalPrice)
        
        console.log("amounts are ", req.session.amounts);
        req.session.amounts= { totalAmountSellingPrice: 10000, totalAmountOfferedPrice: totalPrice }
         res.json({ status: true,price:totalPrice});

      }
      else
      {
        res.json({status:true})
      }
     
    }
    else{
      console.log("eneterd herre")
      res.json({status:false})
    }
   })
  }
  }
};
