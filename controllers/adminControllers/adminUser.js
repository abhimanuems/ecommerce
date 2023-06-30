const productHelper = require("../../helpers/productHelpers");
const userHelpers = require("../../helpers/userHelpers");
module.exports = {
  //admin view users list
  viewUser: (req, res) => {
    if (req.session.isAdmin) {
      userHelpers.getusers().then((user) => {
        res.render("admin/view-user", { admin: true, user });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin block users 
  userBlock: (req, res) => {
    if (req.session.isAdmin) {
      if (req.body.status) {
        userHelpers.updateStatusAdmin(req.params.id, false);
      } else {
        userHelpers.updateStatusAdmin(req.params.id, true);
      }
      userHelpers.getusers().then((user) => {
        res.render("admin/view-user", { admin: true, user });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
};
