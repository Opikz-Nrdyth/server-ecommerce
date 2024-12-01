module.exports = {
  async login(ctx) {
    const { identifier, password } = ctx.request.body;

    try {
      // Validasi identifier (wajib)
      if (!identifier) {
        return ctx.badRequest("Identifier is required");
      }

      // Query dasar untuk mencari user berdasarkan email ATAU username
      const query = {
        where: {
          $or: [{ email: identifier }, { username: identifier }],
        },
      };

      // Cari user
      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne(query);

      if (!user) {
        return ctx.badRequest("User not found");
      }

      // Jika password disediakan, validasi password
      if (password) {
        const validPassword = await strapi.plugins[
          "users-permissions"
        ].services.user.validatePassword(password, user.password);

        if (!validPassword) {
          return ctx.badRequest("Invalid password");
        }
      }

      // Generate JWT
      const jwt = strapi.plugins["users-permissions"].services.jwt.issue({
        id: user.id,
      });

      // Return user data dan token
      return {
        jwt,
        user,
      };
    } catch (error) {
      return ctx.badRequest("Login failed", { error: error.message });
    }
  },
};
