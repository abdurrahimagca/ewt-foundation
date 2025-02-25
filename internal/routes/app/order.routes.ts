import { AppServer, HttpClient } from "@shopware-ag/app-server-sdk";
import { Hono } from "hono";
import OrderService from "../../services/order.service";
import { z } from "zod";

const ORDER_ROUTE = new Hono();
ORDER_ROUTE.post("/ping", async (c) => {
  try {
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
      error.status ?? 500,
    );
  }
});

ORDER_ROUTE.post("/get-with-travellers", async (c) => {
  try {
    const shopId = c.req.header("shopware-app-shop-id");
    const shopwareAppToken = c.req.header("shopware-app-token");
    const body = await c.req.json();

    const bodySchema = z.object({
      orderId: z.string(),
    });
    const result = bodySchema.safeParse(body);
    if (!result.success) {
      return c.json(
        {
          message: "Body type did not match as expected",
          error: result.error.message,
        },
        400,
      );
    }
    const { orderId } = result.data;

    if (!shopId || !shopwareAppToken || !orderId) {
      return c.json(
        {
          error: "Missing required headers or order ID",
        },
        400,
      );
    }

    const app = c.get("app") as AppServer;
    const shop = await app.repository.getShopById(shopId);

    if (!shop) {
      return c.json(
        {
          error:
            "Shop not found Either auth failed or somehow shop didnt match the expected",
        },
        500,
      );
    }

    const client = new HttpClient(shop);
    const orderService = new OrderService(client);
    const order = await orderService.getOrderByOrderIdWithTravellers(orderId);

    return c.json({ status: 200, order });
  } catch (error) {
    console.error("[ERROR]: Failed to process request:", error);
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      error.status ?? 500,
    );
  }
});

export default ORDER_ROUTE;
