const { response } = require("express");
const orderHelpers = require("../../helpers/orderHelpers");

module.exports = {
  viewOrders: (req, res) => {
    if (req.session.isAdmin) {
      orderHelpers.viewOrderDetails().then((order) => {
        res.render("admin/view-orders", { admin: true, order });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  updateStatus: (req, res) => {
    try{
      if (req.session.isAdmin) {
      console.log(req.body,'is from the admin status')
      orderHelpers.updateOrderStatus(req.body).then((response) => {
        res.json(response);
      });
    } else {
      res.redirect("/admin/login");
    }
    }catch(err){
      console.log(err)
    }
  },
};
