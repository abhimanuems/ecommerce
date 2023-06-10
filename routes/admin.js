const express = require("express");
const router = express.Router();
const productHelper = require("../helpers/productHelpers");
const categoryHelper = require("../helpers/categoryHelpers");

const adminProductController = require("../controllers/adminControllers/adminProduct");
const adminUserController = require("../controllers/adminControllers/adminUser");
const adminLoginController = require("../controllers/adminControllers/adminLogin");
const adminOrderController = require("../controllers/adminControllers/adminOrders");
const adminOfferController = require("../controllers/adminControllers/adminOffer");
const { route } = require("express/lib/application");

router.get("/login", adminLoginController.login);

router.post("/login", adminLoginController.loginPost);

router.get("/viewproducts", adminProductController.viewProducts);

router.get("/addproduct", adminProductController.addProductGet);

router.post("/addproduct", adminProductController.addProductPost);

router.get("/editproducts/:id", adminProductController.editProductsGet);

router.post("/editproducts/:id", adminProductController.editProductsPost);

router.post("/deleteproduct/:id", adminProductController.deleteProduct);

router.get("/viewcategory", adminProductController.viewCategory);

router.get("/addcategory", adminProductController.addCategory);

router.post("/addcategory", adminProductController.addCategoryPost);

router.post("/editcategory/:id", adminProductController.editcategory);

router.post("/delete-category/:id", adminProductController.deleteCategory);

router.get("/subcategory", adminProductController.subcategory);

router.get("/addsubcategory", adminProductController.addsubcategory);

router.post("/addsubcategory", adminProductController.addSubCategoryPost);

router.post("/deletesubcategory", adminProductController.deleteSubCategory);

router.get("/viewusers", adminUserController.viewUser);

router.post("/viewusers/:id", adminUserController.userBlock);

router.get("/vieworders", adminOrderController.viewOrders);

router.post("/updateorderstatus", adminOrderController.updateStatus);

router.get("/offers/coupon",adminOfferController.couponPage);

router.post('/offers/coupon',adminOfferController.addVouchers);

router.post('/deletevoucher/:id',adminOfferController.deleteVouchers);

router.post("/offers/editcoupon/:id", adminOfferController.editVoucher);
  

router.get("/logout", adminLoginController.logOut);
module.exports = router;
