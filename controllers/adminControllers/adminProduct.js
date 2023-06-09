const productHelper = require("../../helpers/productHelpers");
const categoryHelper = require("../../helpers/categoryHelpers");
module.exports = {
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
  addProductGet: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelper.viewCategory().then((category) => {
        res.render("admin/add-product", { admin: true, category });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  addProductPost: (req, res) => {
    if (req.session.isAdmin) {
      try {
        productHelper.addProduct(req.body).then((result) => {
          const image = req.files.image;
          const id = result.insertedId.toString();
          image.mv("./public/productImages/" + id + ".jpeg", (err, done) => {
            if (!err) {
              res.redirect("/admin/viewproducts");
            } else {
              console.log(err);
            }
          });
        });
      } catch (err) {
        console.log("error at adding product", err);
        res.redirect("/admin");
      }
    } else {
      res.redirect("/admin/login");
    }
  },
  editProductsGet: async (req, res) => {
    if (req.session.isAdmin) {
      const id = req.params.id;
      await productHelper.getSelectedProduct(id).then((product) => {
        res.render("admin/edit-products", { admin: true, product });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  editProductsPost: (req, res) => {
    if (req.session.isAdmin) {
      const id = req.params.id;
      if (req.files) {
        const image = req.files.image;
        image.mv("./public/productImages/" + id + ".jpeg");
      }

      productHelper
        .updateProducts(req.params.id, req.body)
        .then((result) => {
          console.log(result);
          res.redirect("/admin/viewproducts");
        })
        .catch((err) => {
          console.log("error at editing product", err);
        });
    } else {
      res.redirect("/admin/login");
    }
  },
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
  viewCategory: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelper.viewCategory().then((category) => {
        res.render("admin/view-category", { admin: true, category });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  addCategory: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelper.viewCategory().then((category) => {
        res.render("admin/addcategory", { admin: true });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  addCategoryPost: async (req, res) => {
    if (req.session.isAdmin) {
      try {
        await categoryHelper.addCategory(req.body).then((result) => {
          let image = req.files.icon;
          let id = result.insertedId.toString();
          image.mv("./public/CategoryIcons/" + id + ".PNG", (err, done) => {
            if (!err) {
              res.redirect("/admin/viewcategory");
            } else {
              console.log(err);
            }
          });
        });
      } catch (err) {
        console.log("Error ocuured at adding category", err);
      }
    } else {
      res.redirect("/admin/login");
    }
  },
  editcategory: (req, res) => {
    if (req.session.isAdmin) {
      const id = req.params.id;
      const update = { categoryName: req.body.categoryName };

      if (req.files) {
        const image = req.files.image;
        image.mv("./public/CategoryIcons/" + id + ".PNG");
      }
      categoryHelper
        .updateCategory(id, update)
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
  subcategory: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelper
        .viewSubCategory()
        .then((data) => {
          res.render("admin/view-subcategory", { admin: true, data });
        })
        .catch((err) => {
          console.log("error" + err);
          res.redirect("/admin");
        });
    } else {
      res.redirect("/admin/login");
    }
  },
  addsubcategory: (req, res) => {
    if (req.session.isAdmin) {
      categoryHelper.viewCategory().then((category) => {
        res.render("admin/add-subcategory1", { admin: true, category });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  addSubCategoryPost: async (req, res) => {
    if (req.session.isAdmin) {
      try {
        await categoryHelper.addSubCategory(req.body);
        res.redirect("/admin/subcategory");
      } catch (err) {
        console.log("error occured at adding sub category" + err);
        res.redirect("/admin/subcategory");
      }
    } else {
      res.redirect("/admin/login");
    }
  },
  deleteSubCategory: (req, res) => {
    if (req.session.isAdmin) {
      const { documentId, arrayKey } = req.body;

      try {
        categoryHelper.deleteSubcategory(documentId, arrayKey);
        res.redirect("/admin/subcategory");
      } catch (error) {
        console.log("error at deleting subcategory", error);
        res.redirect("/admin/subcategory");
      }
    } else {
      res.redirect("/admin/login");
    }
  },
};
