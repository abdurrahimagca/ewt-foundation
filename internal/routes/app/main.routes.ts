import { Hono } from "hono";
import {
  createModalResponse,
  createNotificationResponse,
} from "@shopware-ag/app-server-sdk/helper/app-actions";
import { AppServer, Context, SimpleShop } from "@shopware-ag/app-server-sdk";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";
import { type ShopInterface } from "@shopware-ag/app-server-sdk";
import { BetterSqlite3Repository } from "@shopware-ag/app-server-sdk/integration/better-sqlite3";
import * as dotenv from "dotenv";
import CeTravellerService from "../../services/ce_traveller.service";
import { HttpClientResponse } from "@shopware-ag/app-server-sdk";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import { promises as fs } from "fs";

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
  registerConfirmationUrl: "/register/confirm",
  appIframeEnable: true,
  appIframePath: "/app/ewt-foundation/module/index",
});
shopware.use("*", (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  return next();
});

shopware.post("/app/ewt-foundation/ping", () => {
  return createNotificationResponse("success", "Pong");
});
shopware.post("/ewt-foundation/ce-traveller/:orderId", async (c) => {
  const ctx = c.get("context") as Context<SimpleShop, ShopInterface>;
  const orderId = c.req.param("orderId");
  const ceTravellerService = new CeTravellerService(ctx.httpClient);
  const order =
    await ceTravellerService.getTravelersAndFlightInfoByOrderId(orderId);
  return c.json(order);
});
shopware.get("/app/ewt-foundation/module/index", async (c) => {
  console.log("[INFo] req received");
  console.log("context: ", c.get("context"));
  const ctx = c.get("context") as Context<SimpleShop, ShopInterface>;

  const shop = c.get("shop") as ShopInterface;
  const app = c.get("app") as AppServer;

    console.log("[INFO] context: ", ctx);
    console.log("[INFO] shop: ", shop);
    console.log("[INFO] app: ", app);

  // AppServer'dan Context Çözümlemesi
  app.contextResolver.fromBrowser(c.req.raw);

  // index.html Dosyasını Okuma
  const indexHtml = await fs.readFile(
    path.join(__dirname, "../../views/index.html"),
    "utf-8",
  );

  // Content-Type ve Security Policy Ayarları
  c.header("Content-Type", "text/html");
  c.header("Content-Security-Policy", "frame-ancestors 'self'");

  // Response'u İmzalama ve Döndürme
  const Response = c.html(indexHtml);
  const signedResponse = app.signer.signResponse(Response, shop.getShopSecret());
  return signedResponse;
});
export default shopware;
