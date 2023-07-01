const productHelper = require("../../helpers/productHelpers");
const categoryHelper = require("../../helpers/categoryHelpers");
const orderHelpers = require("../../helpers/orderHelpers");
const cloudinary = require("../../Middleware/cloudinary");


module.exports = {
  //admin dashboard
  adminDashboard: (req, res) => {
    orderHelpers.chartData().then((data) => {
      orderHelpers.getTotalSales().then((totalsales) => {
        if (data.length == 0 || totalsales.length == 0) {
          res.render("admin/dashboard", {
            admin: true,
            data,
          });
        } else {
          res.render("admin/dashboard", {
            admin: true,
            data,
            totalSum: totalsales[0].totalSum,
            avg: totalsales[0].averageSale,
            count: totalsales[0].totalCount,
          });
        }
      });
    });
  },
  //admin view products
  viewProducts: function (req, res) {
    if (req.session.isAdmin) {
      productHelper.getAllProducts().then((product) => {
        categoryHelper.viewCategory().then((category) => {
          res.render("admin/view-products", { admin: true, product, category });
        });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //  adding products by admin
  addProductPost: async (req, res) => {
    if (req.session.isAdmin) {
      try {
        const uploadedUrls = [];
        for (const imagePath of req.files) {
          try {
            const result = await cloudinary.uploader.upload(imagePath.path, {
              folder: "Products",
            });
            uploadedUrls.push(result.secure_url);
          } catch (error) {
            console.log("Error uploading image:", error);
          }
        }
        console.log("uploadedUrls ",uploadedUrls)
        productHelper.addProduct(req.body, uploadedUrls).then((response) => {
          res.redirect("/admin/viewproducts");
        });
      } catch (err) {
        console.log("error at adding product", err);
        res.redirect("/admin");
      }
    } else {
      res.redirect("/admin/login");
    }
  },
  // admin edit products
  editProductsGet: async (req, res) => {
    console.log(
      "id at edit product is ",
      req.params.id,
      req.params.id[0],
      req.params.id[1]
    );
    if (req.session.isAdmin) {
      const id = req.params.id;
      await productHelper.getSelectedProduct(id).then((product) => {
        res.render("admin/edit-products", { admin: true, product });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin edit product updating
  editProductsPost: async (req, res) => {
    console.log("req boys at edit product us ",req.body)
    if (req.session.isAdmin) {
       const uploadedUrls = [];
        for (const imagePath of req.files) {
          try {
            const result = await cloudinary.uploader.upload(imagePath.path, {
              folder: "Products",
            });
            uploadedUrls.push(result.secure_url);
          } catch (error) {
            console.log("Error uploading image:", error);
          }
        }
      
      productHelper
        .updateProducts(req.params.id, req.body, uploadedUrls)
        .then((result) => {
          res.redirect("/admin/viewproducts");
        })
        .catch((err) => {
          console.log("error at editing product", err);
        });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin delete product
  deleteProduct: async (req, res) => {
    if (req.session.isAdmin) {
      try {
        const id = req.params.id;
        await productHelper.deleteProduct(id);
        res.redirect("/admin/viewproducts");
      } catch (err) {
        console.log("error at deleteing a product" + err);
        res.redirect("/admin/viewproducts");
      }
    } else {
      res.redirect("/admin/login");
    }
  },
  // admin view category
  viewCategory: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelper.viewCategory().then((category) => {
        res.render("admin/view-category", { admin: true, category });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  // admin add category -- render
  addCategory: (req, res) => {
    if (req.session.isAdmin) {

      categoryHelper.viewCategory().then((category) => {
        res.render("admin/addcategory", { admin: true });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin add category details
  addCategoryPost: async (req, res) => {
    if (req.session.isAdmin) {
      try {
         const image = await cloudinary.uploader.upload(req.file.path, {
           folder: "category",
         });
        await categoryHelper
          .addCategory(req.body, image.secure_url)
          .then((result) => {
            res.redirect("/admin/viewcategory");
          });
      } catch (err) {
        console.log("Error ocuured at adding category", err);
      }
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin edit category
  editcategory: async (req, res) => {
    if (req.session.isAdmin) {
      const id = req.params.id;
      const update = { categoryName: req.body.categoryName };
       const image = await cloudinary.uploader.upload(req.file.path, {
           folder: "category",
         });

      categoryHelper
        .updateCategory(id, update, image.secure_url)
        .then((result) => {
          res.redirect("/admin/viewcategory");
        })
        .catch((err) => {
          console.log("error at editing category", err);
        });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin delete category
  deleteCategory: (req, res) => {
    if (req.session.isAdmin) {
      try {
        const id = req.params.id;
        categoryHelper.deleteCategory(id);

        res.redirect("/admin/viewcategory");
      } catch (err) {
        res.redirect("/addcategory");
        console.log("Error occured at deleteing the category ");
      }
    } else {
      res.redirect("/admin/login");
    }
  },
};
