const productHelpers = require("../../helpers/productHelpers");
const productHelper = require("../../helpers/productHelpers");
const categoryHelpers = require("../../helpers/categoryHelpers");
const bannerHelper = require("../../helpers/bannerHelper");
const auth = require("../../Middleware/auth");
const pageNation = require("../../Middleware/pagenation");

module.exports = {
  // users home
  home: function (req, res) {
    productHelper.getFeaturedProduct().then((fProduct) => {
      const featuredProduct = fProduct.slice(0, 4);
      productHelper.getTrendingFeaturedForUserHome().then((product) => {
        categoryHelpers.viewCategory().then((category) => {
          const limitedCategory = category.slice(0, 6);
          bannerHelper.getBannerDetailsHome("home").then((banner) => {
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
  // mobile catgeory 
  mobile: (req, res) => {
    productHelper.getMobiles().then((mobiles) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper
          .getBannerDetailsCategory("Mobile")
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
  // electronics category
  electronics: (req, res) => {
    productHelper.getElectronics().then((electronics) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper.getBannerDetailsCategory("Electronics").then((banner) => {
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
  //books category
  books: (req, res) => {
    productHelper.getBooks().then((books) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper.getBannerDetailsCategory("Books").then((banner) => {
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
  // health and wellness category
  healthAndWellness: (req, res) => {
    productHelper.getHealthAndWellness().then((products) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper
          .getBannerDetailsCategory("Health")
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
  // grocery category
  grocery: (req, res) => {
    productHelper.getGrocery().then((products) => {
      categoryHelpers.viewCategory().then((category) => {
        const limitedCategory = category.slice(0, 6);
        bannerHelper.getBannerDetailsCategory("Grocery").then((banner) => {
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
  //product detail page
  getProductDetails: (req, res) => {
   try{
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
   } catch(err){
    console.log("error at viewing products",err)
   }
  },
 // view all product page
  products: (req, res) => {
    const pageNo = req.params.id || 1;
    const aggrigateStages = [{ $match: { status: true } }];
    const countPages = { $match: { status: true } };

    productHelper
      .getProductsPagination(pageNo, 6, aggrigateStages)
      .then((products) => {
        productHelper.getCount(pageNo, 6, countPages).then((counts) => {
          const pages = Math.floor(counts / 6);

          categoryHelpers.viewCategory().then((category) => {
            res.render("users/allproucts", {
              admin: false,
              user: req.session.user,
              products,
              pages: pages,
              pageNo: pageNo,
              category,
            });
          });
        });
      });
  },
  // latest products
  latestProducts: (req, res) => {
    const pageNo = req.params.id || 1;
    const aggrigateStages = [
      { $match: { status: true } },
      {
        $addFields: {
          hasTimestamp: {
            $cond: {
              if: { $gt: ["$timestamp", null] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $sort: {
          hasTimestamp: 1,
          timestamp: 1,
        },
      },
      {
        $project: {
          hasTimestamp: 0,
        },
      },
    ];
    productHelper
      .getProductsPagination(pageNo, 6, aggrigateStages)
      .then((products) => {
        productHelper.getCount(pageNo, 6, aggrigateStages).then((counts) => {
          const pages = Math.floor(counts / 6);
          console.log("pages are ",pages,pageNo)

          categoryHelpers.viewCategory().then((category) => {
            res.render("users/allproucts", {
              admin: false,
              user: req.session.user,
              products,
              pages: pages,
              pageNo: pageNo,
              category,
            });
          });
        });
      });
  },
  // sorting - low to high
  lowToHigh: (req, res) => {
    const pageNo = req.params.id || 1;
    const aggrigateStages = [
      { $match: { status: true } },
      { $sort: { offeredprice: 1 } },
    ];
    productHelper
      .getProductsPagination(pageNo, 6, aggrigateStages)
      .then((products) => {
        productHelper.getCount(pageNo, 6, aggrigateStages).then((counts) => {
          const pages = Math.floor(counts / 6);

          categoryHelpers.viewCategory().then((category) => {
            res.render("users/allproucts", {
              admin: false,
              user: req.session.user,
              products,
              pages: pages,
              pageNo: pageNo,
              category,
            });
          });
        });
      });
  },
  // sorting - high to low
  highToLow: (req, res) => {
    const pageNo = req.params.id || 1;
    const aggrigateStages = [
      { $match: { status: true } },
      { $sort: { offeredprice: -1 } },
    ];
    productHelper
      .getProductsPagination(pageNo, 6, aggrigateStages)
      .then((products) => {
        productHelper.getCount(pageNo, 6, aggrigateStages).then((counts) => {
          const pages = Math.floor(counts / 6);

          categoryHelpers.viewCategory().then((category) => {
            res.render("users/allproucts", {
              admin: false,
              user: req.session.user,
              products,
              pages: pages,
              pageNo: pageNo,
              category,
            });
          });
        });
      });
  },

  // search items 
  searchItems: (req, res) => {
    productHelpers.searchItems(req.body.searchTerm).then((result) => {
      res.json({ products: result });
    });
  },
  // filter- categorys
  getFilterdProduct: (req, res) => {
    const pageNo = req.params.id || 1;
    const aggrigateStages = [
      { $match: { status: true } },
      { $match: { category: req.body.categoryName } },
    ];
    productHelper
      .getProductsPagination(pageNo, 6, aggrigateStages)
      .then((products) => {
        productHelper.getCount(pageNo, 6, aggrigateStages).then((counts) => {
          const pages = Math.floor(counts / 6);

          categoryHelpers.viewCategory().then((category) => {
            res.render("users/allproucts", {
              admin: false,
              user: req.session.user,
              products,
              pages: pages,
              pageNo: pageNo,
              category,
            });
          });
        });
      });
  },
};
