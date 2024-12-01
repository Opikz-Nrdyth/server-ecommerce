module.exports = {
  routes: [
    {
      method: "POST",
      path: "/auth/login",
      handler: "custom-login.login",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
