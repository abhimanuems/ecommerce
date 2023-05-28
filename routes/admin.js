var express = require("express");
var router = express.Router();
const productHelper = require("../helpers/productHelpers");
const categoryHelper = require("../helpers/categoryHelpers");

router.get("/", function (req, res, next) {
  req.session.user = "ADMIN";
  productHelper.getAllProducts().then((product) => {
    res.render("admin/view-products", { admin: true, product });
  });
});

router.get("/addproduct", (req, res) => {
 

  categoryHelper.viewCategory().then((category) => {
    res.render("admin/add-product", { admin: true, category });
  });
});

router.post("/addproduct", async (req, res) => {
  try {
     console.log(req.body);
     console.log(req.files.image);
    await productHelper.addProduct(req.body);
    res.redirect("/admin");
  } catch (err){
    console.log("error at adding product", error);
    res.redirect("/admin");
  }
});

router.post("/deleteproduct/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await productHelper.deleteProduct(id);
    res.redirect("/admin");
  } catch (err) {
    console.log("error at deleteing a product" + err);
    res.redirect("/admin");
  }
});
router.get("/viewcategory", (req, res) => {
  categoryHelper.viewCategory().then((category) => {
    res.render("admin/view-category", { admin: true, category });
  });
});
router.get("/addcategory", (req, res) => {
  categoryHelper.viewCategory().then((category) => {
    res.render("admin/addcategory", { admin: true });
  });
});

router.post("/addcategory", async (req, res) => {
  try {
    await categoryHelper.addCategory(req.body);
    res.redirect("/admin/viewcategory");
  } catch {
    console.log("Error ocuured at adding category");
  }
});

router.post("/delete-category/:id", (req, res) => {
  try {
    const id = req.params.id;
    categoryHelper.deleteCategory(id);
    res.redirect("/admin/viewcategory");
  } catch (err) {
    res.redirect("/addcategory");
    console.log("Error occured at deleteing the category ");
  }
});

router.get("/subcategory", (req, res) => {
  categoryHelper
    .viewSubCategory()
    .then((data) => {
      res.render("admin/view-subcategory", { admin: true, data });
    })
    .catch((err) => {
      console.log("error" + err);
      res.redirect("/admin");
    });
});

router.get("/addsubcategory", (req, res) => {
  categoryHelper.viewCategory().then((category) => {
    res.render("admin/add-subcategory1", { admin: true, category });
  });
});

router.post("/addsubcategory", async (req, res) => {
  try {
    await categoryHelper.addSubCategory(req.body);
    res.redirect("/admin/subcategory");
  } catch (err) {
    console.log("error occured at adding sub category" + err);
    res.redirect("/admin/subcategory");
  }
});

router.post("/deletesubcategory", (req, res) => {

const { documentId, arrayKey } = req.body;
 
  try {
    categoryHelper.deleteSubcategory(documentId, arrayKey);
    res.redirect("/admin/subcategory");
  } catch (error) {
    console.log("error at deleting subcategory", error);
      res.redirect("/admin/subcategory");
  }
});

module.exports = router;
