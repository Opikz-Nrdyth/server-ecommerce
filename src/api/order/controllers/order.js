"use strict";
const { createCoreController } = require("@strapi/strapi").factories;
module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async findAll(ctx) {
    const { populate = {} } = ctx.query;
    const populateOption = {
      ...populate,
      order_items: {
        populate: {
          product_variant: true,
        },
      },
    };
    ctx.query.populate = populateOption;
    return await super.find(ctx);
  },
}));
