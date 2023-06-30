const orderHelpers = require("../../helpers/orderHelpers");

module.exports = {
  //admin view orders
  viewOrders: (req, res) => {
    if (req.session.isAdmin) {
      orderHelpers.viewOrderDetails().then((order) => {
        res.render("admin/view-orders", { admin: true, order });
      });
    } else {
      res.redirect("/admin/login");
    }
  },
  //admin updating order status
  updateStatus: (req, res) => {
    try {
      if (req.session.isAdmin) {
        orderHelpers.updateOrderStatus(req.body).then((response) => {
          res.json(response);
        });
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log(err);
    }
  },
  //admin dashboard details
  report: (req, res) => {
    const id = req.params.id;
    orderHelpers.findDataDashBoard(id).then((data) => {
      orderHelpers.findDataForTable(id).then((tableData) => {
        res.json({ data: data, tableData: tableData });
      });
    });
  },
  //admin dashboard chart details
  chartData: async (req, res) => {
    const id = req.body.selectedValue;
    if (id == "daily") {
      let data = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let startOfDay = currentDate.getTime() - i * 24 * 60 * 60 * 1000;
        let endOfDay = startOfDay + 24 * 60 * 60 * 1000;
        try {
          const datas = await orderHelpers.findDataForTable(
            startOfDay,
            endOfDay
          );
          data.push(datas);
        } catch (error) {
          console.error(error);
        }
      }
      const totalAmounts = data.map((item) => {
        if (item.length > 0) {
          return item[0].totalSum;
        } else {
          return 0;
        }
      });
      res.json({ salesAmount: totalAmounts });
    } else if (id == "weekly") {
      let data = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let startOfDay = currentDate.getTime() - i * 7 * 24 * 60 * 60 * 1000;
        let endOfDay = startOfDay + 24 * 60 * 60 * 1000;

        try {
          const datas = await orderHelpers.findDataForTable(
            startOfDay,
            endOfDay
          );
          data.push(datas);
        } catch (error) {
          console.error(error);
        }
      }
      const totalAmounts = data.map((item) => {
        if (item.length > 0) {
          return item[0].totalSum;
        } else {
          return 0;
        }
      });
      res.json({ salesAmount: totalAmounts });
    } else if (id == "monthly") {
      let data = [];
      for (let i = 0; i < 7; i++) {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        let startOfDay = currentDate.getTime() - i * 30 * 24 * 60 * 60 * 1000;
        let endOfDay = startOfDay + 24 * 60 * 60 * 1000;

        try {
          const datas = await orderHelpers.findDataForTable(
            startOfDay,
            endOfDay
          );
          data.push(datas);
        } catch (error) {
          console.error(error);
        }
      }
      const totalAmounts = data.map((item) => {
        if (item.length > 0) {
          return item[0].totalSum;
        } else {
          return 0;
        }
      });
      res.json({ salesAmount: totalAmounts });
    }
  },
};
