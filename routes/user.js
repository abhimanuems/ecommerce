const express = require("express");
const router = express.Router();
// const productHelper = require("../helpers/productHelpers");
// const userHelpers = require("../helpers/userHelpers");
const userLoginController = require("../controllers/userController/userLogin");
const productController = require("../controllers/userController/productView");
const orderController = require("../controllers/userController/order");
// const userHelpers = require("../helpers/userHelpers");
const order = require("../controllers/userController/order");
// const orderHelpers = require("../helpers/orderHelpers");
// const { route } = require("express/lib/application");

router.post("/signup", userLoginController.userSignUp);

router.post("/signupverify", userLoginController.userSignupPost);

router.post("/otp", userLoginController.getOtp);

router.post("/verify", userLoginController.otpVerify);

router.get("/",productController.home);

router.get("/mobiles", productController.mobile);

router.get("/electronics", productController.electronics);

router.get("/books", productController.books);

router.get("/Health", productController.healthAndWellness);

router.get("/grocery", productController.grocery);

router.get("/viewallproducts/:id?", productController.products);

router.get("/product/latest",productController.latestProducts);

router.get('/product/low-high',productController.lowToHigh)

router.get('/product/high-low',productController.highToLow);

router.post("/filter-products",productController.getFilterdProduct);

router.get("/products/:id", productController.getProductDetails);

router.post("/search",productController.searchItems)

router.get("/cart", orderController.getCart);

router.get('/wishlist',orderController.getWishlist);

router.post("/coupon", orderController.applyCoupoun);

router.get("/addwishlist/:id",userLoginController.addWishlist);

router.get("/removewishlist/:id",userLoginController.removeWishlist);

router.get("/addtocart/:id", orderController.addToCart);

router.post("/quantityupdate", orderController.cartQuantity);

router.get("/removecart/:id", orderController.removeCart);

router.get("/checkoutForOrder", orderController.checkOut);

router.post("/paymentGate", orderController.placeOrder);

router.get('/succeess',orderController.getSuccessPage);

router.post("/addaddress/:id", orderController.addAddress);

router.post("/addaddress", orderController.addAddressmyAccount);

router.post("/editaddress/:id", orderController.editAddress);

router.post("/paymentMode", orderController.paymentMode);

router.post("/verifypayment",orderController.verifyPayment);

router.get("/myaccount", userLoginController.myAccount); 

router.get("/orders", orderController.myOrders);

router.get('/wallet',orderController.wallets)

router.post("/userorderstatus", orderController.updateOrderStatus);

router.post("/userorderstatusReturn", orderController.updateOrderStatusReturn);

router.get("/myaccount/address", order.myAddress);

router.post("/deleteaddress/:id", order.deleteAddress);

router.post("/update-user-details", userLoginController.updateUser);

router.get("/logout", userLoginController.logOut);

module.exports = router;
