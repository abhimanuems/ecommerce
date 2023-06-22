const res = require("express/lib/response");
const categoryHelpers = require("../../helpers/categoryHelpers");
const productHelpers = require("../../helpers/productHelpers");
const bannerHelper = require("../../helpers/bannerHelper");
const userHelpers = require("../../helpers/userHelpers");

module.exports = {
  couponPage: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.getExistingVouchers().then((vouchers) => {
        res.render("admin/coupon", { admin: true, vouchers });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  addVouchers: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.addVouchers(req.body);
      res.redirect("/admin/offers/coupon");
    } else {
      res.redirect("/admin/login");
    }
  },
  deleteVouchers: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.deleteVoucher(req.params.id);
      res.redirect("/admin/offers/coupon");
    } else {
      res.redirect("/admin/login");
    }
  },
  editVoucher: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.editVouchers(req.params.id, req.body);
      res.redirect("/admin/offers/coupon");
    } else {
      res.redirect("/admin/login");
    }
  },
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
  addOffer: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.addOffer(req.body).then((response) => {
        res.redirect("/admin/offers/offer");
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  editOffer: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.editOffers(req.body, req.params.id).then((response) => {
        res.redirect("/admin/offers/offer");
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  changeStatus: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelpers.changeStatus(req.params.id).then((response) => {
        res.redirect("/admin/offers/offer");
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  viewBanner: (req, res) => {
    bannerHelper.getBannerDetails().then((banner) => {
      categoryHelpers.viewCategory().then((category) => {
        console.log(banner, "from the banner details are");
        res.render("admin/banner", { admin: true, banner, category });
      });
    });
  },
  addBanner: (req, res) => {
    const filenames = req.files.map((file) => file.filename);
    bannerHelper.addBannerDetails(req.body, filenames).then((response) => {
      res.redirect("/admin/banner");
    });
  },
  editBanner: (req, res) => {
    const filenames = req.files.map((file) => file.filename);
    bannerHelper
      .editBannerDetails(req.body, filenames, req.params.id)
      .then((response) => {
        res.redirect("/admin/banner");
      });
  },
  addProductOffer: (req, res) => {
    if (req.session.isAdmin) {
      productHelpers.addOffer(req.params.id, req.body).then((response) => {
        res.redirect("/admin/viewproducts");
      });
    }
  },
  referalOffer: (req, res) => {
    userHelpers.getReferals().then((referals) => {
      res.render("admin/referaloffer", { admin: true, referals });
    });
  },
  approveReferals: (req, res) => {
    userHelpers.approveReferal().then(() => {
      res.redirect("/admin/offers/referaloffer");
    });
  },
  getProductOffers: (req, res) => {
    productHelpers.getAllProductsWithOffer().then((products) => {
      res.render("admin/productOffer", { admin: true, products });
    });
  },
  editProductOffer: (req,res) => {
    if (req.session.isAdmin) {
      productHelpers.addOffer(req.params.id, req.body).then((response) => {
        res.redirect("/admin/offers/productoffer/");
      });
    }
  },
  deleteProductOffer:(req,res)=>{
    console.log("enetrf ate the dleetee offer",req.params.id)
    if(req.session.isAdmin){
      productHelpers.deleteProductOffer(req.params.id).then((response)=>{
        res.redirect("/admin/offers/productoffer/");
      })
    }
  }
};
