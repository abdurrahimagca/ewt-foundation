import { Hono } from "hono";
import { createNotificationResponse } from "@shopware-ag/app-server-sdk/helper/app-actions";
import { AppServer, Context } from "@shopware-ag/app-server-sdk";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";
import { type ShopInterface } from "@shopware-ag/app-server-sdk";
import { BetterSqlite3Repository } from "@shopware-ag/app-server-sdk/integration/better-sqlite3";
import * as dotenv from "dotenv";
dotenv.config();
const APP_NAME = process.env.APP_NAME;
const APP_SECRET = process.env.APP_SECRET;
if (!APP_NAME || !APP_SECRET) {
  throw new Error("APP_NAME and APP_SECRET must be set in .env file");
}

const shopware = new Hono();
declare module "hono" {
  interface ContextVariableMap {
    app: AppServer;
    shop: ShopInterface;
    context: Context;
  }
}
configureAppServer(shopware, {
  appName: APP_NAME,
  appSecret: APP_SECRET,
  shopRepository: new BetterSqlite3Repository("shopware.db"),
});
shopware.post("/app/ewt-foundation/ping", () => {
  return createNotificationResponse("success", "Pong");
});

export default shopware;
