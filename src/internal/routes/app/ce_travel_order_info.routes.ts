import { Hono } from "hono";
import { apiShopTransformMw } from "../../middlewares/storefront-api.js";
import {
  ceTravelOrderInfoSchema,
  shopwareId,
} from "../../types/ce_travel_order_info.js";
import CeTravelOrderInfoService from "../../services/ce_travel_order_info.service.js";
const TRAVEL_ORDER_INFO = new Hono();

TRAVEL_ORDER_INFO.use("/*", apiShopTransformMw);

TRAVEL_ORDER_INFO.get("/travel-order-info/:orderId", async (c) => {
  const shop = c.get("shop");
  const orderId = c.req.param("orderId");
  const id = shopwareId.safeParse(orderId);
  if (!id.success) {
    return c.json({ error: "Invalid order ID format" }, 400);
  }
  const data = await new CeTravelOrderInfoService(
    shop,
  ).getOrderTravelInfoService({
    field: "orderId",
    value: id.data,
  });
  return c.json(data, 200);
});

TRAVEL_ORDER_INFO.post("/travel-order-info", async (c) => {
  try {
    const shop = c.get("shop");
    const body = await c.req.json();

    const result = ceTravelOrderInfoSchema.safeParse(body);
    if (!result.success) {
      return c.json(
        {
          error: "Invalid request body",
          details: result.error.flatten(),
        },
        400,
      );
    }

    await new CeTravelOrderInfoService(shop).createOrderTravelInfoService([
      result.data,
    ]);

    return c.json(
      {
        message: "Travel order info created successfully",
        status: 201,
      },
      201,
    );
  } catch (error) {
    console.error("Error in /travel-order-info:", error);
    return c.json(
      {
        error: "Internal server error",
        cause: error instanceof Error ? error.cause : "Ce_Travel_Order_Info",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : "No stack trace",
      },
      500,
    );
  }
});

TRAVEL_ORDER_INFO.delete("/travel-order-info/:orderId", async (c) => {
  try {
    const shop = c.get("shop");
    const orderId = c.req.param("orderId");
    const id = shopwareId.safeParse(orderId);
    if (!id.success) {
      return c.json({ error: "Invalid order ID format" }, 400);
    }
    await new CeTravelOrderInfoService(shop).deleteOrderTravelInfoService(
      id.data,
    );
    return c.json(
      {
        message: "Travel order info deleted successfully",
        status: 200,
      },
      200,
    );
  } catch (error) {
    console.error("Error deleting travel order info:", error);
    return c.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : "No stack trace",
      },
      500,
    );
  }
});

TRAVEL_ORDER_INFO.patch("/travel-order-info/:orderId", async (c) => {
  try {
    const shop = c.get("shop");
    const orderId = c.req.param("orderId");
    const body = await c.req.json();

    const id = shopwareId.safeParse(orderId);
    if (!id.success) {
      return c.json({ error: "Invalid order ID format" }, 400);
    }
    const result = ceTravelOrderInfoSchema.partial().safeParse(body);
    if (!result.success) {
      return c.json(
        {
          error: "Invalid request body",
          details: result.error.format(),
        },
        400,
      );
    }
    await new CeTravelOrderInfoService(shop).updateOrderTravelInfoService(
      result.data,
    );

    return c.json(
      {
        message: "Travel order info updated successfully",
        status: 200,
      },
      200,
    );
  } catch (error) {
    console.error("Error updating travel order info:", error);
    return c.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : "No stack trace",
      },
      500,
    );
  }
});

export default TRAVEL_ORDER_INFO;
