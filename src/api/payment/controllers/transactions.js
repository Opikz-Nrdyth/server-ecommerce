const fetch = require("node-fetch");

module.exports = {
  async create(ctx) {
    try {
      const {
        orderId,
        grossAmount,
        customerDetails,
        item_detail,
        payment_selected,
      } = ctx.request.body;

      if (!orderId || !grossAmount || !customerDetails || !item_detail) {
        return ctx.badRequest("Missing required fields");
      }

      const shopSettings = await strapi
        .query("api::shop-setting.shop-setting")
        .findOne({
          select: ["midtrans_server"],
        });

      // Dekripsi `midtrans_server`
      const encryptedMidtransServer = shopSettings.midtrans_server;
      const base64MidtransServer = Buffer.from(
        Buffer.from(encryptedMidtransServer, "hex").toString("base64"),
        "base64"
      ).toString("utf-8");

      const payload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: grossAmount,
        },
        customer_details: customerDetails,
        item_details: item_detail,
        enabled_payments: payment_selected,
        callbacks: {
          finish: `${process.env.CLIENT_BASE_URL}/profile/myorder`,
          error: `${process.env.CLIENT_BASE_URL}`,
          pending: `${process.env.CLIENT_BASE_URL}/profile/myorder`,
          success: `${process.env.CLIENT_BASE_URL}/invoice/${orderId.replace("order-", "")}`,
        },
      };

      const response = await fetch(
        `${process.env.MIDTRANS_BASE_URL}/snap/v1/transactions`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${base64MidtransServer}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json(); // Pastikan menggunakan await

      return data;
    } catch (error) {
      console.error("Error:", error);
      return ctx.internalServerError("Something went wrong");
    }
  },

  async get(ctx) {
    try {
      const order_id = ctx.params.order_id;

      const shopSettings = await strapi
        .query("api::shop-setting.shop-setting")
        .findOne({
          select: ["midtrans_server"],
        });

      // Dekripsi `midtrans_server`
      const encryptedMidtransServer = shopSettings.midtrans_server;
      const base64MidtransServer = Buffer.from(
        Buffer.from(encryptedMidtransServer, "hex").toString("base64"),
        "base64"
      ).toString("utf-8");

      const response = await fetch(
        `${process.env.MIDTRANS_API_URL}/v2/${order_id}/status`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Basic ${base64MidtransServer}`,
          },
        }
      );

      // Pastikan menunggu hasil JSON dengan await
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error:", error);
      return ctx.internalServerError("Something went wrong");
    }
  },
};
