const express = require("express");
const router = express.Router();
const adminProductController = require("../controllers/adminControllers/adminProduct");
const adminUserController = require("../controllers/adminControllers/adminUser");
const adminLoginController = require("../controllers/adminControllers/adminLogin");
const adminOrderController = require("../controllers/adminControllers/adminOrders");
const adminOfferController = require("../controllers/adminControllers/adminOffer");
const auth = require("../Middleware/auth");

const multer = require("multer");
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

router.get(
  "/login", 
  adminLoginController.login
  );

router.post(
  "/login",
   adminLoginController.loginPost
   );

router.get("/",
 auth.adminLoggedIn, adminProductController.adminDashboard
 );

router.get(
  "/report/:id",
   auth.adminLoggedIn,
    adminOrderController.report
    );

router.post(
  "/chartData",
   auth.adminLoggedIn, adminOrderController.chartData
   );

router.get(
  "/viewproducts",
  auth.adminLoggedIn,
  adminProductController.viewProducts
);



router.post(
  "/addproduct",
  upload,
  auth.adminLoggedIn,
  adminProductController.addProductPost
);

router.get(
  "/editproducts/:id",
  auth.adminLoggedIn,
  adminProductController.editProductsGet
);

router.post(
  "/editproducts/:id",
  auth.adminLoggedIn,
  upload,
  adminProductController.editProductsPost
);

router.post(
  "/deleteproduct/:id",
  auth.adminLoggedIn,
  adminProductController.deleteProduct
);

router.get(
  "/viewcategory",
  auth.adminLoggedIn,
  adminProductController.viewCategory
);

router.get(
  "/addcategory",
  auth.adminLoggedIn,
  adminProductController.addCategory
);

router.post(
  "/addcategory",
  auth.adminLoggedIn,
  uploadSingle,
  adminProductController.addCategoryPost
);

router.post(
  "/editcategory/:id",
  auth.adminLoggedIn,
  uploadSingle,
  adminProductController.editcategory
);

router.post(
  "/delete-category/:id",
  auth.adminLoggedIn,
  adminProductController.deleteCategory
);

router.get(
  "/viewusers", 
  auth.adminLoggedIn, adminUserController.viewUser
  );

router.post(
  "/viewusers/:id",
  auth.adminLoggedIn,
  adminUserController.userBlock
);

router.get(
  "/vieworders",
   auth.adminLoggedIn, adminOrderController.viewOrders
   );

router.post(
  "/updateorderstatus",
  auth.adminLoggedIn,
  adminOrderController.updateStatus
);

router.post(
  "/productoffer/:id",
  auth.adminLoggedIn,
  adminOfferController.addProductOffer
);

router.post(
  "/editproductoffer/:id",
  auth.adminLoggedIn,
  adminOfferController.editProductOffer
);

router.post(
  "/productofferdelete/:id",
  auth.adminLoggedIn,
  adminOfferController.deleteProductOffer
);

router.get(
  "/offers/coupon",
  auth.adminLoggedIn,
  adminOfferController.couponPage
);

router.post(
  "/offers/coupon",
  auth.adminLoggedIn,
  adminOfferController.addVouchers
);

router.get(
  "/offers/referaloffer",

  adminOfferController.referalOffer
);

router.get(
  "/verifyReferals",

  adminOfferController.approveReferals
);

router.post(
  "/deletevoucher/:id",
  auth.adminLoggedIn,
  adminOfferController.deleteVouchers
);

router.post(
  "/offers/editcoupon/:id",
  auth.adminLoggedIn,
  adminOfferController.editVoucher
);

router.get(
  "/offers/offer",
   auth.adminLoggedIn, adminOfferController.offerPage
   );

router.get(
  "/offers/productoffer",
  auth.adminLoggedIn,
  adminOfferController.getProductOffers
);

router.post(
  "/addoffer", 
  auth.adminLoggedIn, adminOfferController.addOffer
  );

router.post(
  "/offers/editoffer/:id",
  auth.adminLoggedIn,
  adminOfferController.editOffer
);

router.post(
  "/deleteOffer/:id",
  auth.adminLoggedIn,
  adminOfferController.changeStatus
);

router.get(
  "/banner",
   auth.adminLoggedIn, adminOfferController.viewBanner
   );

router.post(
  "/banner",
  auth.adminLoggedIn,
  uploadBanner,
  adminOfferController.addBanner
);

router.post(
  "/editbanner/:id",
  auth.adminLoggedIn,
  uploadBanner,
  adminOfferController.editBanner
);

router.get(
  "/logout", 
  adminLoginController.logOut
  );
module.exports = router;
