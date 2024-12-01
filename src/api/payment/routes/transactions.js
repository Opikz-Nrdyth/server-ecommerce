module.exports = {
  routes: [
    {
      method: "POST",
      path: "/transactions",
      handler: "transactions.create",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/transactions/:order_id", // Menggunakan :order_id di URL
      handler: "transactions.get",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
