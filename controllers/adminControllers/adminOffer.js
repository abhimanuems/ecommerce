const res = require("express/lib/response");
const categoryHelpers = require("../../helpers/categoryHelpers");
const productHelpers = require("../../helpers/productHelpers");

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
      categoryHelpers.getOffers().then((offers) => {
        categoryHelpers.viewCategory().then((category)=>{
          res.render("admin/offers", { admin: true, offers,category });
        })
        
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  addOffer:(req,res)=>{
   
    categoryHelpers.addOffer(req.body).then((response)=>{
      
    })

  }
};