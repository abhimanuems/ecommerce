module.exports = {
  arrangeItems: (orders, products) => {
    const productIds = orders.map((order) => order.productId);

    console.log(productIds);
    console.log(products[0]._id);
  },
};
