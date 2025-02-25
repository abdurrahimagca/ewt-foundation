import { AppServer, HttpClient, SimpleShop } from "@shopware-ag/app-server-sdk";
import { createNotificationResponse } from "@shopware-ag/app-server-sdk/helper/app-actions";
import { Hono } from "hono";
import CeTravellerRepository from "../../repositories/ce_traveller.repository";
import { ActionButtonRequest } from "@shopware-ag/app-server-sdk/types";
import { Context } from "@shopware-ag/app-server-sdk";

const PING_ROUTE = new Hono();
PING_ROUTE.post("/notification", () => {
  return createNotificationResponse("success", "Pong");
});
PING_ROUTE.get("/api", (c) => {
  return c.json({ message: "pong" });
});
PING_ROUTE.post("/ce_traveller", async (c) => {
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
  const ceTravellerRepository = new CeTravellerRepository(client);
  const ceTraveller = ceTravellerRepository.healthCheck();
  return c.json({ message: "pong", ceTraveller });
});
export default PING_ROUTE;
