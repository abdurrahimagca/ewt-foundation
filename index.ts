import { Hono } from "hono";
import { logger } from "hono/logger";
import GLOBAL_ROUTE from "./src/internal/routes/public/routes.js";
import { serve } from "@hono/node-server";
import SHOPWARE_ROUTE from "./src/internal/routes/app/shopware.routes.js";
import { cors } from "hono/cors";
import { AddressInfo } from "node:net";

const app = new Hono();
if (process.env.NODE_ENV === "development") {
  app.use(logger());
}
app.use("*", cors());
app.use(
  "*",
  cors({
    origin: process.env.NODE_ENV === "development" ? "*" : "https://ewt-foundation.homelab-kaleici.space",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "shopware-app-shop-id",
      "shopware-app-token",
      "X-Forwarded-For",
      "X-Forwarded-Proto",
      "X-Forwarded-Port",
    ],
  }),
);
app.route("/", SHOPWARE_ROUTE);
app.route("/public/", GLOBAL_ROUTE);
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const INFO = {
  address: HOST,
  port: PORT,
};

serve(
  app,
  (INFO) => {
    console.log(`Listening on ${INFO.address}:${INFO.port}`);
  },
);