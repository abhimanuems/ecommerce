const productHelper = require("../../helpers/productHelpers");
const categoryHelper = require("../../helpers/categoryHelpers");

module.exports = {
  adminDashboard:(req,res)=>{
    console.log("enterd here")
    res.render('admin/dashboard',{admin:true})
  },
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
  addProductPost:(req, res)=> {
    console.log("req body is ",req.body)
    if (req.session.isAdmin) {
      try {
        const filenames = req.files.map((file) => file.filename);
        productHelper.addProduct(req.body,filenames).then((response) => {
          console.log(response)
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
     console.log(req.files);
      const filenames = req.files.map((file) => file.filename);
      console.log(filenames)

      productHelper
        .updateProducts(req.params.id, req.body, filenames)
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
        await categoryHelper.addCategory(req.body,req.file).then((result) => {
            res.redirect("/admin/viewcategory");
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
      const images = req.file.filename;
      console.log(images,'from the edit categiory')

      categoryHelper
        .updateCategory(id, update,images)
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
