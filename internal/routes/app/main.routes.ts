import { Hono } from "hono";
import { createNotificationResponse } from "@shopware-ag/app-server-sdk/helper/app-actions";
import {
  AppServer,
  Context,
  HttpClient,
  SimpleShop,
} from "@shopware-ag/app-server-sdk";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";
import { type ShopInterface } from "@shopware-ag/app-server-sdk";
import { BetterSqlite3Repository } from "@shopware-ag/app-server-sdk/integration/better-sqlite3";
import * as dotenv from "dotenv";
import CeTravellerService from "../../services/ce_traveller.service";
import { cors } from "hono/cors";
import {
  ActionButtonRequest,
  BrowserAppModuleRequest,
} from "@shopware-ag/app-server-sdk/types";

dotenv.config();
const APP_NAME = process.env.APP_NAME;
const APP_SECRET = process.env.APP_SECRET;
if (!APP_NAME || !APP_SECRET) {
  throw new Error("APP_NAME and APP_SECRET must be set in .env file");
}
import { logger } from "hono/logger";
import OrderService from "../../services/order.service";
const shopware = new Hono();

declare module "hono" {
  interface ContextVariableMap {
    app: AppServer;
    shop: ShopInterface;
    context: Context;
  }
}
shopware.use(logger());

configureAppServer(shopware, {
  appName: APP_NAME,
  appSecret: APP_SECRET,
  shopRepository: new BetterSqlite3Repository("shopware.db"),
  registerConfirmationUrl: "/app/register/confirm",
  appIframeEnable: true,
  appIframePath: "/app/ewt-foundation/module/index",
});
shopware.use("/*", cors());
shopware.use(
  "/*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["shopware-app-shop-id", "shopware-app-token"],
  }),
);

shopware.post("/ewt-foundation/ping", () => {
  return createNotificationResponse("success", "Pong");
});
shopware.get("/ewt-foundation/ping", (c) => {
  return c.json({ message: "pong" });
});
shopware.post("/ewt-foundation/orders/ping", async (c) => {
  try {
    // Get the required headers
    const shopId = c.req.header("shopware-app-shop-id");
    const shopwareAppToken = c.req.header("shopware-app-token");

    if (!shopId || !shopwareAppToken) {
      return c.json(
        {
          error:
            "Missing required headers: shopware-app-shop-id and shopware-app-token",
        },
        400,
      );
    }

    const app = c.get("app") as AppServer;
    const shop = await app.repository.getShopById(shopId);

    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }

    const client = new HttpClient(shop);
    const orderService = new OrderService(client);
    const order = await orderService.getOrderByOrderNumber("10000");

    return c.json({ message: "pong", order });
  } catch (error) {
    console.error("[ERROR]: Failed to process request:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      error.status ??  500,
    );
  }
});

shopware.post("/ewt-foundation/ce-traveller/:orderId", async (c) => {
  const ctx = c.get("context") as Context<SimpleShop, ShopInterface>;
  const orderId = c.req.param("orderId");
  const ceTravellerService = new CeTravellerService(ctx.httpClient);
  const order =
    await ceTravellerService.getTravelersAndFlightInfoByOrderId(orderId);
  return c.json(order);
});

export default shopware;
