const productHelper = require("../../helpers/productHelpers");
module.exports = {
  login: (req, res) => {
    if (req.session.isAdmin) {
      res.redirect("/admin/viewproducts");
    }
    res.render("admin/adminlogin", { login: true });
  },
  loginPost: (req, res) => {
    if (req.body.username == "admin" && req.body.password == "admin") {
      req.session.isAdmin = true;
      productHelper.getAllProducts().then((product) => {
        res.render("admin/dashboard", { admin: true });
      });
    } else {
      res.render("admin/adminlogin", {
        data: "invalid credentials",
        login: true,
      });
    }
  },
  logOut: (req, res) => {
    req.session.isAdmin = false;
    req.session.destroy(function (error) {
      if (error) {
        console.log(err);
      } else {
        res.render("admin/adminlogin", {
          data: "logout succesfully",
          login: true,
        });
      }
    });
  },
};
