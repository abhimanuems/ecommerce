const categoryHelpers = require("../../helpers/categoryHelpers");
const productHelpers = require("../../helpers/productHelpers");
const bannerHelper = require("../../helpers/bannerHelper");
const userHelpers = require("../../helpers/userHelpers");
const cloudinary = require("../../Middleware/cloudinary");

module.exports = {

  //admin - viewing coupoun page
  couponPage: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.getExistingVouchers().then((vouchers) => {
        res.render("admin/coupon", { admin: true, vouchers });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin - adding add vouchers 
  addVouchers: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.addVouchers(req.body);
      res.redirect("/admin/offers/coupon");
    } else {
      res.redirect("/admin/login");
    }
  },
  // admin -deleting vouchers
  deleteVouchers: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.deleteVoucher(req.params.id);
      res.redirect("/admin/offers/coupon");
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin - editing vouchers
  editVoucher: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.editVouchers(req.params.id, req.body);
      res.redirect("/admin/offers/coupon");
    } else {
      res.redirect("/admin/login");
    }
  },
  // admin - offer page viewing
  offerPage: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.getOffers().then((offer) => {
        console.log(offer);
        categoryHelpers.viewCategory().then((category) => {
          res.render("admin/offers", { admin: true, offer, category });
        });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin - add offer
  addOffer: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.addOffer(req.body).then((response) => {
        res.redirect("/admin/offers/offer");
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin -edit offer
  editOffer: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.editOffers(req.body, req.params.id).then((response) => {
        res.redirect("/admin/offers/offer");
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin change offer status / deleting 
  changeStatus: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.changeStatus(req.params.id).then((response) => {
        res.redirect("/admin/offers/offer");
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  // admin view banner 
  viewBanner: (req, res) => {
    bannerHelper.getBannerDetails().then((banner) => {
      categoryHelpers.viewCategory().then((category) => {
        res.render("admin/banner", { admin: true, banner, category });
      });
    });
  },
  //admin add banner 
  addBanner: async (req, res) => {
     const uploadedUrls = [];
        for (const imagePath of req.files) {
          try {
            const result = await cloudinary.uploader.upload(imagePath.path, {
              folder: "banner",
            });
            uploadedUrls.push(result.secure_url);
          } catch (error) {
            console.log("Error uploading image:", error);
          }
        }
    bannerHelper.addBannerDetails(req.body, uploadedUrls).then((response) => {
      res.redirect("/admin/banner");
    });
  },
  // admin edit banner 
  editBanner: async(req, res) => {
   const uploadedUrls = [];
        for (const imagePath of req.files) {
          try {
            const result = await cloudinary.uploader.upload(imagePath.path, {
              folder: "banner",
            });
            uploadedUrls.push(result.secure_url);
          } catch (error) {
            console.log("Error uploading image:", error);
          }
        }
    bannerHelper
      .editBannerDetails(req.body, uploadedUrls, req.params.id)
      .then((response) => {
        res.redirect("/admin/banner");
      });
  },
  //admin addProduct offer
  addProductOffer: (req, res) => {
    if (req.session.isAdmin) {
      productHelpers.addOffer(req.params.id, req.body).then((response) => {
        res.redirect("/admin/viewproducts");
      });
    }
  },
  //admin referal offer view page
  referalOffer: (req, res) => {
    userHelpers.getReferals().then((referals) => {
      res.render("admin/referaloffer", { admin: true, referals });
    });
  },
  //admin approve referals
  approveReferals: (req, res) => {
    userHelpers.approveReferal().then(() => {});
    res.redirect("/admin/offers/referaloffer");
  },
  //admin viewing product offer page
  getProductOffers: (req, res) => {
    productHelpers.getAllProductsWithOffer().then((products) => {
      res.render("admin/productOffer", { admin: true, products });
    });
  },
  //admin edit product offer page
  editProductOffer: (req, res) => {
    if (req.session.isAdmin) {
      productHelpers.addOffer(req.params.id, req.body).then((response) => {
        res.redirect("/admin/offers/productoffer/");
      });
    }
  },
  //admin delete offer
  deleteProductOffer: (req, res) => {
    if (req.session.isAdmin) {
      productHelpers.deleteProductOffer(req.params.id).then((response) => {
        res.redirect("/admin/offers/productoffer/");
      });
    }
  },
};
