import { Hono } from "hono";
import {
  AppServer,
  Context,
  HttpClient,
  type ShopInterface,
} from "@shopware-ag/app-server-sdk";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";
import { BetterSqlite3Repository } from "@shopware-ag/app-server-sdk/integration/better-sqlite3";
import * as dotenv from "dotenv";

//*****SHOPWARE APP  */
dotenv.config();
const APP_NAME = process.env.APP_NAME;
const APP_SECRET = process.env.APP_SECRET;

if (!APP_NAME || !APP_SECRET) {
  throw new Error("APP_NAME and APP_SECRET must be set in .env file");
}
const SHOPWARE_ROUTE = new Hono();
declare module "hono" {
  interface ContextVariableMap {
    app: AppServer;
    shop: ShopInterface;
    context: Context;
  }
}
configureAppServer(SHOPWARE_ROUTE, {
  appName: APP_NAME,
  appSecret: APP_SECRET,
  shopRepository: new BetterSqlite3Repository("shopware.db"),
  appIframeEnable: true,
});
///*****END OF SHOPWARE APP */

import ORDER_ROUTE from "./order.routes";
import PING_ROUTE from "./shopware.ping.routes";

SHOPWARE_ROUTE.route("/app/ewt-foundation/ping", PING_ROUTE);
SHOPWARE_ROUTE.route("/ewt-foundation/order", ORDER_ROUTE);
import CeTravellerRepository from "../../repositories/ce_traveller.repository";
import CeFlightInfoRepository from "../../repositories/ce_flight_info.repository";

SHOPWARE_ROUTE.get("/ce-health", async (c) => {
  const app = c.get("app") as AppServer;
  const shopID = c.req.header("shopware-app-shop-id");
  if (!shopID) {
    return c.json({ message: "shopware-app-shop-id is missing", status: 500 });
  }
  const shop = await app.repository.getShopById(shopID);
  if (!shop) {
    return c.json({ message: "shop not found", status: 404 });
  }
  const client = new HttpClient(shop);
 
  const CeFlightRepository = new CeFlightInfoRepository(client);
  const ceFlight = CeFlightRepository.healthCheck();

   const ceTravellerRepository = new CeTravellerRepository(client);
   const ceTraveller = ceTravellerRepository.healthCheck();
  return c.json({ message: "pong", ceFlight, ceTraveller });
});
export default SHOPWARE_ROUTE;
