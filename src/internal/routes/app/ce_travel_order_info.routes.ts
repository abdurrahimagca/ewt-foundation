import { Hono } from "hono";
import { apiShopTransformMw } from "../../middlewares/storefront-api.js";

import {
  ceTravelOrderInfoInsertInformationSchema,
  ceTravelOrderInfoUpdateInformationSchema,
} from "../../types/new_ce_travel_order_info.js";
import CeTravelOrderInfoService from "../../services/ce_travel_order_info.service.js";

import { orderGuard } from "../../middlewares/order-guard.js";

const TRAVEL_ORDER_INFO = new Hono();

TRAVEL_ORDER_INFO.use("/*", apiShopTransformMw);
TRAVEL_ORDER_INFO.use("/*", orderGuard);
TRAVEL_ORDER_INFO.get("/travel-order-info", async (c) => {
  try {
    const shop = c.get("shop");
    const customerId = c.get("customerId");
    const orderId = c.req.query("orderId");
    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 422);
    }
    const service = new CeTravelOrderInfoService(shop);
    const data = await service.getOrderTravelInfoService(customerId, orderId);
    return c.json(data, 200);
  } catch (error) {
    console.error("Error in GET /travel-order-info:", error);

    return c.json(
      {
        error: "Internal server error",
        details: {
          server: [error instanceof Error ? error.message : "Unknown error"],
        },
      },
      500,
    );
  }
});

TRAVEL_ORDER_INFO.post("/travel-order-info", async (c) => {
  try {
    const shop = c.get("shop");
    const body = await c.req.json();
    const orderId = c.req.query("orderId");
    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 422);
    }
    const customerId = c.get("customerId");
    if (!customerId) {
      return c.json(
        { error: "Customer does not have access to this order" },
        403,
      );
    }
    const result = ceTravelOrderInfoInsertInformationSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { error: "Invalid request body", details: result.error.flatten() },
        422,
      );
    }
    const service = new CeTravelOrderInfoService(shop);
    await service.createOrderTravelInfoService(result.data, customerId);
    return c.json({ message: "Travel order info created successfully" }, 201);
  } catch (error) {
    console.error("Error in POST /travel-order-info:", error);
    return c.json(
      {
        error: "Internal server error",
        details: {
          server: [error instanceof Error ? error.message : "Unknown error"],
        },
      },
      500,
    );
  }
});

TRAVEL_ORDER_INFO.patch("/travel-order-info", async (c) => {
  try {
    const shop = c.get("shop");
    const body = await c.req.json();
    const orderId = c.req.query("orderId");
    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 422);
    }
    const customerId = c.get("customerId");
    if (!customerId) {
      return c.json(
        { error: "Customer does not have access to this order" },
        403,
      );
    }
    const result = ceTravelOrderInfoUpdateInformationSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        { error: "Invalid request body", details: result.error.flatten() },
        422,
      );
    }
    const service = new CeTravelOrderInfoService(shop);
    await service.updateOrderTravelInfoService(result.data, customerId);
    return c.json({ message: "Travel order info updated successfully" }, 200);
  } catch (error) {
    console.error("Error in PATCH /travel-order-info:", error);
    return c.json(
      {
        error: "Internal server error",
        details: {
          server: [error instanceof Error ? error.message : "Unknown error"],
        },
      },
      500,
    );
  }
});

export default TRAVEL_ORDER_INFO;
