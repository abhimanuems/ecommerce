const express = require("express");
const router = express.Router();
// const productHelper = require("../helpers/productHelpers");
// const categoryHelper = require("../helpers/categoryHelpers");

const adminProductController = require("../controllers/adminControllers/adminProduct");
const adminUserController = require("../controllers/adminControllers/adminUser");
const adminLoginController = require("../controllers/adminControllers/adminLogin");
const adminOrderController = require("../controllers/adminControllers/adminOrders");
const adminOfferController = require("../controllers/adminControllers/adminOffer");
// const { route } = require("express/lib/application");
const multer = require("multer");
const { route } = require("./user");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/productImages/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});
const storageCategory = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/CategoryIcons/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

const storageBanner = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/banner/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
}).array("image", 15);
const uploadSingle = multer({
  storage: storageCategory,
}).single("icon");
const uploadBanner = multer({
  storage: storageBanner,
}).array("image", 5);



router.get("/login", adminLoginController.login);

router.post("/login", adminLoginController.loginPost);

router.get("/", adminProductController.adminDashboard);

router.get("/viewproducts", adminProductController.viewProducts);

// router.get("/addproduct", adminProductController.addProductGet);

router.post("/addproduct",upload, adminProductController.addProductPost);

router.get("/editproducts/:id", adminProductController.editProductsGet);

router.post("/editproducts/:id",upload, adminProductController.editProductsPost);

router.post("/deleteproduct/:id", adminProductController.deleteProduct);

router.get("/viewcategory", adminProductController.viewCategory);

router.get("/addcategory", adminProductController.addCategory);

router.post("/addcategory",uploadSingle, adminProductController.addCategoryPost);

router.post("/editcategory/:id",uploadSingle, adminProductController.editcategory);

router.post("/delete-category/:id", adminProductController.deleteCategory);

router.get("/subcategory", adminProductController.subcategory);

router.get("/addsubcategory", adminProductController.addsubcategory);

router.post("/addsubcategory", adminProductController.addSubCategoryPost);

router.post("/deletesubcategory", adminProductController.deleteSubCategory);

router.get("/viewusers", adminUserController.viewUser);

router.post("/viewusers/:id", adminUserController.userBlock);

router.get("/vieworders", adminOrderController.viewOrders);

router.post("/updateorderstatus", adminOrderController.updateStatus);

router.post("/productoffer/:id",adminOfferController.addProductOffer);

router.post("/editproductoffer/:id", adminOfferController.editProductOffer);

router.post("/productofferdelete/:id", adminOfferController.deleteProductOffer);

router.get("/offers/coupon",adminOfferController.couponPage);

router.post('/offers/coupon',adminOfferController.addVouchers);

router.get('/offers/referaloffer',adminOfferController.referalOffer);

router.get("/verifyReferals",adminOfferController.approveReferals);

router.post('/deletevoucher/:id',adminOfferController.deleteVouchers);

router.post("/offers/editcoupon/:id", adminOfferController.editVoucher);

router.get("/offers/offer", adminOfferController.offerPage);

router.get("/offers/productoffer",adminOfferController.getProductOffers);

router.post('/addoffer',adminOfferController.addOffer);

router.post("/offers/editoffer/:id", adminOfferController.editOffer);

router.post("/deleteOffer/:id",adminOfferController.changeStatus);

router.get("/banner", adminOfferController.viewBanner);

router.post("/banner", uploadBanner, adminOfferController.addBanner);

router.post('/editbanner/:id',uploadBanner,adminOfferController.editBanner)

  

router.get("/logout", adminLoginController.logOut);
module.exports = router;
