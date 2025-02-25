import { Hono } from "hono";
import { createNotificationResponse } from "@shopware-ag/app-server-sdk/helper/app-actions";
import { AppServer, Context, type ShopInterface } from "@shopware-ag/app-server-sdk";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";
import { BetterSqlite3Repository } from "@shopware-ag/app-server-sdk/integration/better-sqlite3";
import * as dotenv from "dotenv";
import { cors } from "hono/cors";
import ORDER_ROUTE from "./order.routes";

dotenv.config();
const APP_NAME = process.env.APP_NAME;
const APP_SECRET = process.env.APP_SECRET;
if (!APP_NAME || !APP_SECRET) {
  throw new Error("APP_NAME and APP_SECRET must be set in .env file");
}
import { logger } from "hono/logger";

const SHOPWARE_ROUTE = new Hono();

declare module "hono" {
  interface ContextVariableMap {
    app: AppServer;
    shop: ShopInterface;
    context: Context;
  }
}
SHOPWARE_ROUTE .use(logger());

configureAppServer(SHOPWARE_ROUTE, {
  appName: APP_NAME,
  appSecret: APP_SECRET,
  shopRepository: new BetterSqlite3Repository("shopware.db"),
  registerConfirmationUrl: "/app/register/confirm",
  appIframeEnable: true,
  appIframePath: "/app/ewt-foundation/module/index",
});
SHOPWARE_ROUTE.use("/*", cors());
SHOPWARE_ROUTE.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["shopware-app-shop-id", "shopware-app-token"],
  }),
);

SHOPWARE_ROUTE.post("/ping", () => {
  return createNotificationResponse("success", "Pong");
});
SHOPWARE_ROUTE.get("/ping/api", (c) => {
  return c.json({ message: "pong" });
});
SHOPWARE_ROUTE.route("/order", ORDER_ROUTE);

export default SHOPWARE_ROUTE;
