const productHelpers = require("../../helpers/productHelpers");
const productHelper = require("../../helpers/productHelpers");
// const userHelpers = require("../../helpers/userHelpers");
const categoryHelpers = require("../../helpers/categoryHelpers");
const bannerHelper = require("../../helpers/bannerHelper");

module.exports = {
  home: function (req, res) {
    productHelper.getFeaturedProduct().then((fProduct) => {
      const featuredProduct = fProduct.slice(0, 4);
      productHelper.getTrendingFeaturedForUserHome().then((product) => {
        categoryHelpers.viewCategory().then((category) => {
          const limitedCategory = category.slice(0, 6);
          bannerHelper.getBannerDetailsHome("home").then((banner) => {
            console.log("banner at the home page is ", banner);
            if (req.session.user) {
              res.render("users/user-viewproducts", {
                product,
                featuredProduct,
                admin: false,
                user: req.session.user,
                limitedCategory,
                banner,
              });
            } else {
              res.render("users/user-viewproducts", {
                product,
                featuredProduct,
                admin: false,
                limitedCategory,
                banner,
              });
            }
          });
        });
      });
    });
  },
  mobile: (req, res) => {
    productHelper.getMobiles().then((mobiles) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper
          .getBannerDetailsCategory("648dc877fad082954e750ce3")
          .then((banner) => {
            if (req.session.user) {
              res.render("users/user-category-mobile", {
                admin: false,
                mobiles,
                user: req.session.user,
                limitedCategory,
                banner,
              });
            } else {
              res.render("users/user-category-mobile", {
                admin: false,
                mobiles,
                limitedCategory,
                banner,
              });
            }
          });
      });
    });
  },
  electronics: (req, res) => {
    productHelper.getElectronics().then((electronics) => {
      console.log(electronics, "are electronics ");
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper
          .getBannerDetailsCategory("6485718abb980dc78fda4265")
          .then((banner) => {
            if (req.session.user) {
              res.render("users/user-category-electronics", {
                admin: false,
                electronics,
                user: req.session.user,
                limitedCategory,
                banner,
              });
            } else {
              res.render("users/user-category-electronics", {
                admin: false,
                electronics,
                limitedCategory,
                banner,
              });
            }
          });
      });
    });
  },
  books: (req, res) => {
    productHelper.getBooks().then((books) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper
          .getBannerDetailsCategory("648dd316a4526d88396a94eb")
          .then((banner) => {
            if (req.session.user) {
              res.render("users/user-category-books", {
                admin: false,
                books,
                user: req.session.user,
                limitedCategory,
                banner,
              });
            } else {
              res.render("users/user-category-books", {
                admin: false,
                books,
                limitedCategory,
                banner,
              });
            }
          });
      });
    });
  },
  healthAndWellness: (req, res) => {
    productHelper.getHealthAndWellness().then((products) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper
          .getBannerDetailsCategory("648dd33fa4526d88396a94ed")
          .then((banner) => {
            if (req.session.user) {
              res.render("users/user-category-health&wellness", {
                admin: false,
                products,
                user: req.session.user,
                limitedCategory,
                banner,
              });
            } else {
              res.render("users/user-category-health&wellness", {
                admin: false,
                products,
                limitedCategory,
                banner,
              });
            }
          });
      });
    });
  },
  grocery: (req, res) => {
    productHelper.getGrocery().then((products) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper
          .getBannerDetailsCategory("648dd32ea4526d88396a94ec")
          .then((banner) => {
            if (req.session.user) {
              res.render("users/user-category-grocerys", {
                admin: false,
                products,
                user: req.session.user,
                limitedCategory,
                banner,
              });
            } else {
              res.render("users/user-category-grocerys", {
                admin: false,
                products,
                banner,
                limitedCategory,
              });
            }
          });
      });
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
  products: (req, res) => {
    const itemsPerPage = 6;
    const currentPage = parseInt(req.params.id) || 1;

    productHelper.getAllProducts().then((product) => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const itemsToDisplay = product.slice(startIndex, endIndex);
      const totalPages = Math.ceil(product.length / itemsPerPage);
      categoryHelpers.viewCategory().then((category) => {
        res.render("users/allproucts", {
          admin: false,
          user: req.session.user,
          currentPage: currentPage,
          products: itemsToDisplay,
          category,
        });
      });
    });
  },
  latestProducts: (req, res) => {
    productHelper.latestProduct().then((products) => {
      categoryHelpers.viewCategory().then((category) => {
        res.render("users/allproucts", { products, category });
      });
    });
  },
  lowToHigh: (req, res) => {
    productHelper.lowToHighProducts().then((products) => {
      categoryHelpers.viewCategory().then((category) => {
        res.render("users/allproucts", { products, category });
      });
    });
  },
  highToLow: (req, res) => {
    productHelper.highToLow().then((products) => {
      categoryHelpers.viewCategory().then((category) => {
        res.render("users/allproucts", { products, category });
      });
    });
  },

  searchItems: (req, res) => {
    console.log(req.body.searchTerm);

    productHelpers.searchItems(req.body.searchTerm).then((result) => {
      res.json({ products: result });
    });
  },
  getFilterdProduct:(req,res)=>{
    console.log(req.body)
    productHelpers
      .getFilteredProduct(req.body.categoryName)
      .then((products) => {
        categoryHelpers.viewCategory().then((category) => {
          res.render("users/allproucts", { products, category });
        });
      });
  }
};
