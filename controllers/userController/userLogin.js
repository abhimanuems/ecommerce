const userHelpers = require("../../helpers/userHelpers");
const productHelper = require("../../helpers/productHelpers");
const orderHelpers = require("../../helpers/orderHelpers");
const categoryHelpers = require("../../helpers/categoryHelpers");
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
let phoneNumberGlobal;
module.exports = {
  //for user signup
  userSignUp: (req, res) => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000);
      console.log(otp, "is the otp");
      phoneNumberGlobal = "+91" + req.body.phone;
      const referal = userHelpers.getReferalcode();

      const detail = {
        email: req.body.email,
        phone: phoneNumberGlobal,
        name: req.body.name,
        OTP: otp,
        status: false,
        referalCode: referal,
        referal: req.body.referal,
        wallet: 0,
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
      userHelpers.referral(detail.phone, detail.referalCode);
      userHelpers.getUser(req.body.phone).then((result) => {
        if (result.length) {
          if (result[0].phone == req.body.phone) {
            userHelpers.updateOTP(req.body.phone, otp).then((result) => {});
            res.json({ status: true });
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
  //for verifing otp in user signup
  userSignupPost: (req, res) => {
    userHelpers.getOtp(phoneNumberGlobal).then((result) => {
      console.log(req.body, "is from signup", result[0].OTP);
      if (result[0].OTP == req.body.otp) {
        req.session.user = true;
        req.session.mobileNumber = phoneNumberGlobal;
        userHelpers.updateStatus(phoneNumberGlobal, true).then((result) => {
          res.json({ status: true });
        });
      } else {
        console.log("ootp  not verified");
        res.json({ status: false });
      }
    });
  },
  // for user login - otp
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
            res.json({ status: true });
          }
        });
      })
      .catch((err) => console.log(err));
  },
  // otp verification - user
  otpVerify: (req, res) => {
    userHelpers.getOtp(phoneNumberGlobal).then((result) => {
      if (result.length) {
        // if (result[0].OTP == req.body.otp) 
        if(true){
          req.session.user = true;
          req.session.mobileNumber = phoneNumberGlobal;
          userHelpers
            .updateStatus(phoneNumberGlobal, true)
            .then((credentials) => {
              res.json({ status: true });
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
  // account of the user
  myAccount: (req, res) => {
    if (req.session.user) {
      userHelpers.getUser(req.session.mobileNumber).then((data) => {
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
  //for updating user -details
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
  // adding products to wishlist
  addWishlist: (req, res) => {
    if (req.session.user) {
      userHelpers.addWishlistData(req.session.mobileNumber, req.params.id);
      req.flash("success", "Item added to wishlist successfully.");
      res.redirect("/wishlist");
    } else {
      res.redirect("/");
    }
  },
  // removing wishlist
  removeWishlist: (req, res) => {
    if (req.session.user) {
      userHelpers.removeWishlistByid(req.session.mobileNumber, req.params.id);
      res.redirect("/wishlist");
    } else {
      res.redirect("/");
    }
  },
  // log out -user
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
