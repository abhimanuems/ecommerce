const userHelpers = require("../../helpers/userHelpers");
const orderHelpers = require("../../helpers/orderHelpers");
const productHelpers = require("../../helpers/productHelpers");
const offerHelpers = require("../../helpers/categoryHelpers");
const categoryHelpers = require("../../helpers/categoryHelpers");

module.exports = {
  // cart details
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
                      .then(async (VoucherCodes) => {
                        await res.render("users/user-cart", {
                          admin: false,
                          user: req.session.user,
                          mobile: req.session.mobileNumber,
                          product,
                          ids,
                          count,
                          amounts,
                          VoucherCodes,
                          messages: req.flash(),
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
  // add to cart
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
          req.flash("success", "Item added to cart successfully.");

          res.redirect("/cart");
        });
    } else {
      res.redirect("/cart");
    }
  },
  // remove cart
  removeCart: (req, res) => {
    const id = req.params.id;
    if (req.session.user) {
      orderHelpers.removeFromCart(req.session.mobileNumber, id);
      res.redirect("/cart");
    } else {
      res.redirect("/");
    }
  },

  //wallet balance

  walletBalance: (req, res) => {
    if (req.session.user && req.body.wallet == "update") {
      if (!req.session.walletBalanceUpdate) {
        req.session.walletBalanceUpdate = true;
        userHelpers
          .getWalletBalance(req.session.mobileNumber)
          .then((wallet) => {
            wallet = wallet[0].wallet;
            if (req.session.walletBalanceUpdate) {
              if (req.session.amounts.totalAmountOfferedPrice > wallet) {
                req.session.walletBalanceApplied = wallet;
                req.session.amounts.totalAmountOfferedPrice -= wallet;
                wallet = 0;
                req.session.wallet = wallet;
                res.json({
                  status: true,
                  wallet: true,
                  totalAmount: req.session.amounts.totalAmountOfferedPrice,
                });
              } else {
                req.session.walletBalanceApplied =
                  req.session.amounts.totalAmountOfferedPrice;
                wallet -= req.session.amounts.totalAmountOfferedPrice;
                req.session.amounts.totalAmountOfferedPrice = 0;
                req.session.wallet = wallet;
                res.json({
                  status: true,
                  wallet: true,
                  walletUsedFull: true,
                  totalAmount: req.session.amounts.totalAmountOfferedPrice,
                });
              }
            }
          });
      } else {
        res.json({
          status: true,
          wallet: true,
          totalAmount: req.session.amounts.totalAmountOfferedPrice,
        });
      }
    } else {
      res.json({ status: false });
    }
  },
  //checkout details
  checkOut: (req, res) => {
    if (req.session.user) {
      const ids = req.session.productIds[0];
      orderHelpers.findAddress(req.session.mobileNumber).then((result) => {
        req.session.wal = result[0].wallet;
        if (result[0].hasOwnProperty("address")) {
          const address = result[0].address;
          const amounts = req.session.amounts;
          const product = req.session.product;
          console.log('product is from checkout',product)
          productHelpers.changeQuantity(
            req.session.id,
            req.session.counts,
            req.session.array
          );
          if (!req.session.offersApplied) {
            productHelpers.getProductOffer(ids).then((offer) => {
              req.session.productOffer = offer;
              let offerProductAmount = 0;
              offer.forEach((element) => {
                offerProductAmount += parseInt(element.offer.offer_price);
              });
              amounts.totalAmountOfferedPrice -= parseInt(offerProductAmount);
              categoryHelpers
                .findOffersAndApply(req.session.product, req.session.counts)
                .then((result) => {
                  if (result.length != 0) {
                    for (let i = 0; i < result.length; i++) {
                      if (result[i].offer.priceType == "flat") {
                        req.session.amounts.totalAmountOfferedPrice -=
                          result[i].offer.maxDiscount;
                        req.session.discountApplied =
                          result[i].offer.maxDiscount;
                      } else {
                        const percentage =
                          (req.session.amounts.totalAmountOfferedPrice *
                            parseInt(result[i].offer.maxPercentage)) /
                          100;
                        if (percentage < result[i].offer.maxPercentage) {
                          req.session.amounts.totalAmountOfferedPrice -=
                            percentage;
                        } else {
                          req.session.amounts.totalAmountOfferedPrice -=
                            parseInt(result[i].offer.maxPercentage);
                        }
                      }
                    }
                    req.session.result = result;
                    req.session.offersApplied = true;
                    if (req.session.OrderPlaced == false) {
                      res.render("users/user-placeorder", {
                        admin: false,
                        user: req.session.user,
                        mobileNumber: req.session.mobileNumber,
                        address,
                        amounts,
                        product,
                        result,
                        productOffer: req.session.productOffer,
                        wallet: req.session.wal,
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
            });
          } else {
            res.render("users/user-placeorder", {
              admin: false,
              user: req.session.user,
              mobileNumber: req.session.mobileNumber,
              address,
              amounts,
              product,
              result: req.session.result,
              productOffer: req.session.productOffer,
              wallet: req.session.wal,
            });
          }
        } else {
          res.render("users/user-placeorder", {
            admin: false,
            user: req.session.user,
            mobileNumber: req.session.mobileNumber,
            amounts: req.session.amounts,
            product,
            result,
            productOffer: req.session.productOffer,
            wallet: req.session.wal,
          });
        }
      });
    } else {
      res.redirect("/");
    }
  },

  //cart quantity updation
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

  //place order details

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
      console.log(
        "total price is ",
        totalPrice,
        "mobil",
        req.session.mobileNumber
      );
      orderHelpers
        .orderDetails(
          req.session.mobileNumber,
          req.session.productIds,
          totalPrice,
          req.session.address,
          deliveryFee,
          paymentMode,
          req.session.voucher,
          req.session.offerTitle,
          req.session.walletBalanceApplied
        )
        .then((id) => {
          req.session.OrderPlaced = true;
          if (paymentMode == "COD") {
            userHelpers.updateWalletBalance(
              req.session.mobileNumber,
              req.session.wallet
            );
            offerHelpers.UpdateRefferal(req.session.mobileNumber);
            orderHelpers.deleteCart(req.session.mobileNumber);
            productHelpers.updateProductQuantity(req.session.productIds);
            res.json({ COD: true });
            
          } else {
            userHelpers.updateWalletBalance(
              req.session.mobileNumber,
              req.session.wallet
            );
            orderHelpers.razorPay(id, totalPrice).then((response) => {
              res.json({ response });
            });
          }
        });
    } else {
      res.redirect("/");
    }
  },
  //adding user address
  addAddress: (req, res) => {
    if (req.session.user) {
      productHelpers.addAddress(req.params.id, req.body);
      res.redirect("/checkoutForOrder");
    } else {
      res.redirect("/");
    }
  },
  // add address from accounts
  addAddressmyAccount: (req, res) => {
    if (req.session.user) {
      productHelpers.addAddress(req.session.mobileNumber, req.body);
      res.redirect("/myaccount/address");
    } else {
      res.redirect("/");
    }
  },
  // for my orders
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
  // view address of the users
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

  // for deleting address

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

  // for order cancellation
  updateOrderStatus: (req, res) => {
    if (req.session.user) {
      orderHelpers.updateStatus(req.body.order_id, req.body.reason);
      res.json("success");
    }
  },
  // return ststus updation

  updateOrderStatusReturn: (req, res) => {
    if (req.session.user) {
      orderHelpers.updateStatusReturn(req.body.order_id);
      res.json("success");
    }
  },
  // editing address

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

  // for viewing wishlist
  getWishlist: async (req, res) => {
    if (req.session.user) {
      await userHelpers
        .getWishlist(req.session.mobileNumber)
        .then((wishlist) => {
          if (wishlist.length != 0) {
            const productIdArray = wishlist[0].wishlist;
            productHelpers.getWishProduct(productIdArray).then((products) => {
              res.render("users/wishlist", {
                admin: false,
                user: req.session.user,
                mobile: req.session.mobileNumber,
                products,
                messages: req.flash(),
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
  // for order success page
  getSuccessPage: (req, res) => {
    if (req.session.user) {
      res.render("users/paymentPaage", {
        admin: false,
        user: req.session.user,
        mobileNumber: req.session.mobileNumber,
      });
    }
  },
  //verify payment for razor pay
  verifyPayment: (req, res) => {
    if (req.session.user) {
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
          res.json({ status: false, err });
        });
    } else {
      res.redirect("/");
    }
  },

  // for apply coupoun from cart

  applyCoupoun: (req, res) => {
    if (req.session.user) {
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
                  req.session.amounts.totalAmountOfferedPrice = totalPrice;
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
                    req.session.amounts.totalAmountOfferedPrice = totalPrice;
                    res.json({
                      status: true,
                      price: totalPrice,
                      voucher: result[0].voucher.price,
                    });
                  } else {
                    totalPrice = totalPrice - parseInt(percentageOff);
                    req.session.amounts.totalAmountOfferedPrice = totalPrice;
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
  // for finding wallet balance from user end
  wallets: (req, res) => {
    if (req.session.user) {
      userHelpers
        .findWalletBalance(req.session.mobileNumber)
        .then((walletBalance) => {
          userHelpers
            .getreferralDetails(req.session.mobileNumber)
            .then((details) => {
              res.render("users/wallet", {
                admin: false,
                user: req.session.user,
                mobile: req.session.mobileNumber,
                walletBalance,
                details,
              });
            });
        });
    } else {
      res.redirect("/");
    }
  },
};
