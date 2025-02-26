//*****SHOPWARE APP  */
import { Hono } from "hono";
import {
  AppServer,
  Context,
  type ShopInterface,
} from "@shopware-ag/app-server-sdk";
import { configureAppServer } from "@shopware-ag/app-server-sdk/integration/hono";
import { BetterSqlite3Repository } from "@shopware-ag/app-server-sdk/integration/better-sqlite3";
import * as dotenv from "dotenv";

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

//*******SHOPWARE /app routes
// this for in app actions */
import { createNotificationResponse } from "@shopware-ag/app-server-sdk/helper/app-actions";
SHOPWARE_ROUTE.post("/app/ping", async () => {
  return createNotificationResponse("success", "pong");
});
///*** END OF  /app routes */


//**CE ROUTES */
import CE_TRAVELLER_ROUTE from "./ce_traveller.routes";
import CE_FLIGHT_INFO_ROUTE from "./ce_flight_info.routes";
SHOPWARE_ROUTE.route("/ewt-foundation/ce-traveller", CE_TRAVELLER_ROUTE);
SHOPWARE_ROUTE.route("/ewt-foundation/ce-flight-info", CE_FLIGHT_INFO_ROUTE);
//**END OF CE ROUTES */

export default SHOPWARE_ROUTE;
///*****END OF SHOPWARE APP */
