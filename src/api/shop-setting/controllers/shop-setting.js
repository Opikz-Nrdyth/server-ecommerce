"use strict";

/**
 * shop-setting controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::shop-setting.shop-setting",
  ({ strapi }) => ({
    async update(ctx) {
      const { data } = ctx.request.body;

      // Jika ada data binderbyte, enkripsi dengan base64
      if (data && data.binderbyte) {
        const firstEnscriptBinderbyte = Buffer.from(data.binderbyte).toString(
          "base64"
        );
        const seccondEnscriptBinderbyte = Buffer.from(
          firstEnscriptBinderbyte
        ).toString("hex");
        data.binderbyte = seccondEnscriptBinderbyte;
      }

      if (data && data.midtrans_client) {
        const firstEnscriptMidtransClient = Buffer.from(
          data.midtrans_client
        ).toString("base64");
        const seccondEnscriptMidtransClient = Buffer.from(
          firstEnscriptMidtransClient
        ).toString("hex");
        data.midtrans_client = seccondEnscriptMidtransClient;
      }

      if (data && data.midtrans_server) {
        const firstEnscriptMidtransServer = Buffer.from(
          data.midtrans_server
        ).toString("base64");
        const seccondEnscriptMidtransServer = Buffer.from(
          firstEnscriptMidtransServer
        ).toString("hex");
        data.midtrans_server = seccondEnscriptMidtransServer;
      }

      if (data && data.google_client_id) {
        const firstEnscriptGoogleClient = Buffer.from(
          data.google_client_id
        ).toString("base64");
        const seccondEnscriptGoogleClient = Buffer.from(
          firstEnscriptGoogleClient
        ).toString("hex");
        data.google_client_id = seccondEnscriptGoogleClient;
      }

      if (data && data.google_secret_id) {
        const firstEnscriptGoogleSecret = Buffer.from(
          data.google_secret_id
        ).toString("base64");
        const seccondEnscriptGoogleSecret = Buffer.from(
          firstEnscriptGoogleSecret
        ).toString("hex");
        data.google_secret_id = seccondEnscriptGoogleSecret;
      }

      // Panggil method update asli dengan data yang sudah dimodifikasi
      const response = await super.update(ctx);

      return response;
    },
  })
);
