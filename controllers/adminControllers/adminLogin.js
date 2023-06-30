const productHelper = require("../../helpers/productHelpers");
module.exports = {
  //admin login
  login: (req, res) => {
    if (req.session.isAdmin) {
      res.redirect("/admin/");
    }
    res.render("admin/adminlogin", { login: true });
  },
  //admin - loggin verifying
  loginPost: (req, res) => {
    if (req.body.username == "admin" && req.body.password == "admin") {
      req.session.isAdmin = true;
      productHelper.getAllProducts().then((product) => {
        res.redirect('/admin')
      });
    } else {
      res.render("admin/adminlogin", {
        data: "invalid credentials",
        login: true,
      });
    }
  },
  //admin - logout
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
