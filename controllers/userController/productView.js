const productHelpers = require("../../helpers/productHelpers");
const productHelper = require("../../helpers/productHelpers");
const userHelpers = require("../../helpers/userHelpers");
module.exports = {
  home: function (req, res) {
    productHelper.getFeaturedProduct().then((fProduct) => {
      var featuredProduct = fProduct;
      productHelper.getTrendingFeaturedForUserHome().then((product) => {
        if (req.session.user) {
          res.render("users/user-viewproducts", {
            product,
            featuredProduct,
            admin: false,
            user: req.session.user,
          });
        } else {
          res.render("users/user-viewproducts", {
            product,
            featuredProduct,
            admin: false,
          });
        }
      });
    });
  },
  mobile: (req, res) => {
    productHelper.getMobiles().then((mobiles) => {
      console.log(mobiles);
      if (req.session.user) {
        res.render("users/user-category-mobile", {
          admin: false,
          mobiles,
          user: req.session.user,
        });
      } else {
        res.render("users/user-category-mobile", { admin: false, mobiles });
      }
    });
  },
  electronics: (req, res) => {
    productHelper.getElectronics().then((electronics) => {
      if (req.session.user) {
        res.render("users/user-category-electronics", {
          admin: false,
          electronics,
          user: req.session.user,
        });
      } else {
        res.render("users/user-category-electronics", {
          admin: false,
          electronics,
        });
      }
    });
  },
  books: (req, res) => {
    productHelper.getBooks().then((books) => {
      if (req.session.user) {
        res.render("users/user-category-books", {
          admin: false,
          books,
          user: req.session.user,
        });
      } else {
        res.render("users/user-category-books", { admin: false, books });
      }
    });
  },
  healthAndWellness: (req, res) => {
    productHelper.getHealthAndWellness().then((products) => {
      if (req.session.user) {
        res.render("users/user-category-health&wellness", {
          admin: false,
          products,
          user: req.session.user,
        });
      } else {
        res.render("users/user-category-health&wellness", {
          admin: false,
          products,
        });
      }
    });
  },
  grocery: (req, res) => {
    productHelper.getGrocery().then((products) => {
      if (req.session.user) {
        res.render("users/user-category-grocerys", {
          admin: false,
          products,
          user: req.session.user,
        });
      } else {
        res.render("users/user-category-grocerys", {
          admin: false,
          products,
        });
      }
    });
  },
  getProductDetails: (req, res) => {
    productHelper.getproducts(req.params.id).then((products) => {
      if (req.session.user) {
        res.render("users/view-productdetails", {
          admin: false,
          products,
          user: req.session.user,
        });
      } else {
        res.render("users/view-productdetails", {
          admin: false,
          products,
        });
      }
    });
  },
  searchItems:(req,res)=>{

    console.log(req.body.searchTerm)

    productHelpers.searchItems(req.body.searchTerm).then((result)=>{
      res.json({products:result});
    })


  }

  }