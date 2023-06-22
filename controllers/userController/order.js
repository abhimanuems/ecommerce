const userHelpers = require("../../helpers/userHelpers");
const orderHelpers = require("../../helpers/orderHelpers");
const productHelpers = require("../../helpers/productHelpers");
// const userorderHelpers = require("../../helpers/userShowOrderHelper");
const offerHelpers = require("../../helpers/categoryHelpers");
const categoryHelpers = require("../../helpers/categoryHelpers");

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
              orderHelpers.getTotalAmount(resultId[0]).then((result) => {
                orderHelpers
                  .getTotalAmounts(req.session.mobileNumber)
                  .then((amounts) => {
                    req.session.amounts = amounts;

                    const count = resultId[1];
                    const ids = resultId[0];
                    req.session.array = resultId;
                    req.session.counts = count;
                    req.session.id = ids;
                    req.session.OrderPlaced = false;
                    offerHelpers
                      .getExistingVoucherCodes()
                      .then((VoucherCodes) => {
                        res.render("users/user-cart", {
                          admin: false,
                          user: req.session.user,
                          mobile: req.session.mobileNumber,
                          product,
                          ids,
                          count,
                          amounts,
                          VoucherCodes,
                        });
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
      orderHelpers.removeFromCart(req.session.mobileNumber, id);
      res.redirect("/cart");
    } else {
      res.redirect("/");
    }
  },
  checkOut: (req, res) => {
    
    if (req.session.user) {
    
       const ids = req.session.productIds[0];
      
    
      orderHelpers.findAddress(req.session.mobileNumber).then((result) => {
        if (result[0].hasOwnProperty("address")) {
          const address = result[0].address;
          const amounts = req.session.amounts;
            console.log("amounts are ", amounts);
          const product = req.session.product;
          productHelpers.changeQuantity(
            req.session.id,
            req.session.counts,
            req.session.array
          );

           productHelpers.getProductOffer(ids).then((offer) => {
             req.session.productOffer = offer;
             let offerProductAmount = 0;
             offer.forEach(element => {
              offerProductAmount += parseInt(element.offer.offer_price);
             });

             
             amounts.totalAmountOfferedPrice-=parseInt(offerProductAmount);
           });
         

          categoryHelpers
            .findOffersAndApply(req.session.product, req.session.counts)
            .then((result) => {
            
              if (result.length != 0) {
                req.session.offerTitle = result[0].offer.title;
                req.session.offer = result[0];
                // console.log(result[0].offer.priceType);
                // console.log("offers are ", result);

                if (result[0].offer.priceType == "flat") {
                  req.session.amounts.totalAmountOfferedPrice -=
                    result[0].offer.maxDiscount;
                  req.session.discountApplied = result[0].offer.maxDiscount;
                } else {
                  const percentage =
                    (req.session.amounts.totalAmountOfferedPricee *
                      parseInt(result[0].offer.maxPercentage)) /
                    100;
                  if (percentage < result[0].offer.maxPercentage) {
                    req.session.amounts.totalAmountOfferedPrice -= percentage;
                    // console.log(
                    //   req.session.amounts.totalAmountOfferedPrice,
                    //   "is the total amount offered"
                    // );
                  } else {
                    req.session.amounts.totalAmountOfferedPrice -= parseInt(
                      result[0].offer.maxPercentage
                    );
                    // console.log(
                    //   req.session.amounts.totalAmountOfferedPrice,
                    //   "is the total amount offered"
                    // );
                  }
                }
                if (req.session.OrderPlaced == false) {
                  res.render("users/user-placeorder", {
                    admin: false,
                    user: req.session.user,
                    mobileNumber: req.session.mobileNumber,
                    address,
                    amounts,
                    product,
                    offers: req.session.offer,
                     productOffer:req.session.productOffer
                  });
                } else {
                  res.redirect("/");
                }
              } else {
                res.render("users/user-placeorder", {
                  admin: false,
                  user: req.session.user,
                  mobileNumber: req.session.mobileNumber,
                  address,
                  amounts,
                  product,
                  offers: null,
                  productOffer: req.session.productOffer,
                });
              }
            });
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
      console.log("product quantity is ", req.session.productIds);
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

      orderHelpers
        .orderDetails(
          req.session.mobileNumber,
          req.session.productIds,
          totalPrice,
          req.session.address,
          deliveryFee,
          paymentMode,
          req.session.voucher,
          req.session.offerTitle
        )
        .then((id) => {
          req.session.OrderPlaced = true;
          if (paymentMode == "COD") {
            orderHelpers.deleteCart(req.session.mobileNumber);
            productHelpers.updateProductQuantity(req.session.productIds);
            res.json({ COD: true });
          } else {
            orderHelpers.razorPay(id, totalPrice).then((response) => {
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
      console.log(req.body ,'is from the add addrss')
      productHelpers.addAddress(req.params.id, req.body);
      res.redirect("/checkoutForOrder");
    } else {
      res.redirect("/");
    }
  },
  addAddressmyAccount: (req, res) => {
    if (req.session.user) {
      console.log(req.body,'is from the addess')
      productHelpers.addAddress(req.session.mobileNumber, req.body);
      res.redirect("/myaccount/address");
    } else {
      res.redirect("/");
    }
  },
  paymentMode: (req, res) => {},
  myOrders: (req, res) => {
    if (req.session.user) {
      orderHelpers.aggreateProducts(req.session.mobileNumber).then((orders) => {
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
      orderHelpers.findAddress(req.session.mobileNumber).then((result) => {
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
      console.log("req.body",req.body)
      orderHelpers.updateStatus(req.body.order_id,req.body.reason);
      res.json("success");
    }
  },
  updateOrderStatusReturn: (req, res) => {
    if (req.session.user) {
      orderHelpers.updateStatusReturn(req.body.order_id);
      res.json("success");
    }
  },
  editAddress: (req, res) => {
    if (req.session.user) {
      orderHelpers.updateAddress(
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
    // if (req.session.user) {
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
    // }
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
      console.log(
        "recipeter from the verify payment form razpor pay",
        req.body
      );
      orderHelpers
        .verifyPayment(req.body)
        .then(() => {
           productHelpers.updateProductQuantity(req.session.productIds);
          orderHelpers
            .changePaymentStatus(req.body["receipt"], req.body)
            .then(() => {
               orderHelpers.deleteCart(req.session.mobileNumber);
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
  applyCoupoun: (req, res) => {
    if (req.session.user) {
      console.log("eneterf at the coupoun")
      const coupon = req.body.coupon;
      offerHelpers
        .checkCouponValidity(coupon, req.session.mobileNumber)
        .then((result) => {
          if (result.length != 0) {
            res.json({ status: false, message: "coupon alreday used" });
          } else {
            let totalPrice = req.body.total;
            totalPrice = totalPrice.replace("₹", "");
            totalPrice = parseInt(totalPrice);

            offerHelpers.checkCoupon(coupon).then((result) => {
              if (result.length > 0) {
                if (result[0].voucher.priceType === "flat") {
                  const voucherPrice = result[0].voucher.price;
                  totalPrice = totalPrice - parseInt(result[0].voucher.price);
                  req.session.voucher = result[0].voucher.voucherCode;
                  console.log("voucher ata voucher is ", req.session.voucher);
                  console.log(req.session.amounts, "at the aplly coupoun");
                  // req.session.amounts.totalAmountOfferedPricee = {
                  //   totalAmountSellingPrice: 10000,
                  //   totalAmountOfferedPrice: totalPrice,
                  // };
                  console.log("total price is ", totalPrice);
                  req.session.amounts.totalAmountOfferedPrice = totalPrice;
                  console.log(req.session.amounts, "at the aplly coupoun");
                  res.json({
                    status: true,
                    price: totalPrice,
                    voucher: voucherPrice,
                  });
                } else {
                  const percentageOff =
                    (totalPrice / result[0].voucher.percentage) * 100;
                  if (percentageOff > result[0].voucher.price) {
                    totalPrice = totalPrice - parseInt(result[0].voucher.price);
                    console.log("total price at percentage is ", totalPrice);
                    req.session.amounts.totalAmountOfferedPrice = totalPrice;
                    res.json({
                      status: true,
                      price: totalPrice,
                      voucher: result[0].voucher.price,
                    });
                  } else {
                    totalPrice = totalPrice - parseInt(percentageOff);
                    req.session.amounts.totalAmountOfferedPrice = totalPrice;
                    console.log(
                      "total price at percentage is ",
                      totalPrice,
                      "percentage ",
                      percentageOff
                    );
                    res.json({
                      status: true,
                      price: totalPrice,
                      voucher: parseInt(percentageOff),
                    });
                  }
                }
              } else {
                res.json({ status: false, message: "invalid coupoun" });
                return;
              }
            });
          }
        });
    }
  },
  wallets:(req,res)=>{
    if(req.session.user){
      res.render("users/wallet", {
        admin: false,
        user: req.session.user,
        mobile: req.session.mobileNumber,
      });
    }
    else{
      res.redirect('/');
    }
  }
};
