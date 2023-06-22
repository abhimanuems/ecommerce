const userHelpers = require("../../helpers/userHelpers");
const productHelper = require("../../helpers/productHelpers");
const orderHelpers = require("../../helpers/orderHelpers");
const categoryHelpers = require("../../helpers/categoryHelpers");
require("dotenv").config();

// const accountSid ="AC4ef830ccb0c57b3561a7385f8bc15f3b";
// const authToken = "8e0b2d20444703ef11974a37852cdbdb";
const accountSid = process.env.accountSid;
const authToken = process.env.authToken;


const client = require("twilio")(accountSid, authToken);
let phoneNumberGlobal;
module.exports = {
  userSignUp: (req, res) => {
    try {
      console.log(req.body)
      const otp = Math.floor(Math.random() * 9999);
 
      phoneNumberGlobal = "+91" + req.body.phone;
      const referal=userHelpers.getReferalcode();
      console.log("referal code is ",referal)
      const detail = {
        email: req.body.email,
        phone: phoneNumberGlobal,
        name: req.body.name,
        OTP: otp,
        status: false,
        referalCode:referal,
        referal:req.body.referal,
        wallet:0
      };
      client.messages
        .create({
          body: `  ${otp} is the verification code for create  Melocia account`,
          to: "whatsapp:" + phoneNumberGlobal,
          from: "whatsapp:+14155238886",
        })
        .then((message) => {
          console.log("otp is ", otp);
        })
        .catch((err) => console.log(err));

      userHelpers.getUser(req.body.phone).then((result) => {
        if (result.length) {
          if (result[0].phone == req.body.phone) {
            userHelpers.updateOTP(req.body.phone, otp).then((result) => {});
            res.json({status:true})
          }
        } else {
          userHelpers.addUser(detail).then((result) => {});
          res.json({ status: true });
        }
      });
    } catch (err) {
      res.json({ status: false });
      console.log("error at adding user", err);
    }
  },
  userSignupPost: (req, res) => {
    
   
    
    userHelpers.getOtp(phoneNumberGlobal).then((result) => {
       console.log(req.body, "is from signup", result[0].OTP);
      if (result[0].OTP == req.body.otp) {
        req.session.user = true;
        req.session.mobileNumber = phoneNumberGlobal;
        userHelpers.updateStatus(phoneNumberGlobal, true).then((result) => {
          productHelper.getFeaturedProduct().then((fProduct) => {
            var featuredProduct = fProduct;
            productHelper.getTrendingFeaturedForUserHome().then((product) => {
              categoryHelpers.viewCategory().then((category) => {
                const limitedCategory = category.slice(0, 6);
                // res.render("users/user-viewproducts", {
                //   product,
                //   featuredProduct,
                //   admin: false,
                //   user: req.session.user,
                // });
                console.log("ebetered ar verified")
                res.json({status:true});
              });
            });
          });
        });
      } else {

        console.log("ootp  not verified");
        res.json({status:false});
      }
    });
  },
  getOtp: (req, res) => {
    const OTP = Math.floor(Math.random() * 9999)
      .toString()
      .padStart(4, "0");
    phoneNumberGlobal = "+91" + req.body.phone;
    userHelpers.updateOTP(phoneNumberGlobal, OTP);
    client.messages
      .create({
        body: `  ${OTP} is the verification code to login to your Melocia account`,
        to: "whatsapp:" + phoneNumberGlobal,
        from: "whatsapp:+14155238886",
      })
      .then((message) => {
        userHelpers.getUser(phoneNumberGlobal).then((result) => {
          if (result.length == 0) {
            const details = {
              phone: phoneNumberGlobal,
              OTP: OTP,
              status: false,
            };
            userHelpers.addUser(details);
            res.json({status:true});
          }
        });
      })
      .catch((err) => console.log(err));
  },
  otpVerify: (req, res) => {

    userHelpers.getOtp(phoneNumberGlobal).then((result) => {
      if (result.length) {
        if (result[0].OTP == req.body.otp) {
          req.session.user = true;
          req.session.mobileNumber = phoneNumberGlobal;
          userHelpers
            .updateStatus(phoneNumberGlobal, true)
            .then((credentials) => {
              productHelper.getFeaturedProduct().then((fProduct) => {
                const featuredProduct = fProduct.slice(0, 4);
                productHelper
                  .getTrendingFeaturedForUserHome()
                  .then((product) => {
                    orderHelpers;
                    // .getCartLength(req.session.mobileNumber)
                    // .then((cartLength) => {
                    categoryHelpers.viewCategory().then((category) => {
                      const limitedCategory = category.slice(0, 6);
                      // res.render("users/user-viewproducts", {
                      //   product,
                      //   featuredProduct,
                      //   admin: false,
                      //   user: req.session.user,
                      //   limitedCategory,
                      //   // });
                      // });
                      res.json({status:true})
                    });
                  });
              });
            });
        } else {
          res.redirect("/");
        }
      } else {
        console.log("ootp  not verified");
        res.redirect("/");
      }
    });
  },
  myAccount: (req, res) => {
    if (req.session.user) {
      userHelpers.getUser(req.session.mobileNumber).then((data) => {
        console.log("from my account data is ", data);
        res.render("users/myaccount", {
          admin: false,
          data,
          user: req.session.user,
        });
      });
    } else {
      res.redirect("/");
    }
  },
  updateUser: (req, res) => {
    if (req.session.user) {
      userHelpers
        .editUserdetails(req.session.mobileNumber, req.body)
        .then((result) => {
          res.redirect("/myaccount");
        })
        .catch((error) => {
          console.error(error);
          res.redirect("/");
        });
    } else {
      res.redirect("/");
    }
  },
  addWishlist: (req, res) => {
    if (req.session.user) {
      console.log("mobile number is ", req.session.mobileNumber);
      userHelpers.addWishlistData(req.session.mobileNumber, req.params.id);
      res.redirect("/wishlist");
    } else {
      res.redirect("/");
    }
  },
  removeWishlist: (req, res) => {
    if (req.session.user) {
      userHelpers.removeWishlistByid(req.session.mobileNumber, req.params.id);
      res.redirect("/wishlist");
    } else {
      res.redirect("/");
    }
  },

  logOut: (req, res) => {
    req.session.user = false;
    req.session.destroy(function (error) {
      if (error) {
        console.log(err);
      } else {
        res.redirect("/");
      }
    });
  },
};
