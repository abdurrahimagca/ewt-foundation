import { AppServer } from "@shopware-ag/app-server-sdk";
import { Hono } from "hono";
import { ceFlightInfoSchema } from "../../types/ce_types";
import { z } from "zod";
import { shopwareId } from "../../types/ce_types";
import CeFlightInfoService from "../../services/ce_flight_info.service";

const CE_FLIGHT_INFO_ROUTE = new Hono();

CE_FLIGHT_INFO_ROUTE.post("/insert-flight-info/:orderId", async (c) => {
  try {
    const shopId = c.req.header("shopware-app-shop-id");
    const shopwareAppToken = c.req.header("shopware-app-token");
    const body = await c.req.json();
    const orderId = c.req.param("orderId");

    if (!shopId || !shopwareAppToken || !orderId) {
      return c.json(
        {
          error:
            "Missing required fields: shopware-app-shop-id,  shopware-app-token or order_id",
        },
        400,
      );
    }

    const id = shopwareId.safeParse(orderId);
    if (!id.success) {
      return c.json({ error: "Invalid shop ID format" }, 400);
    }

    const app = c.get("app") as AppServer;
    const shop = await app.repository.getShopById(shopId);
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    const expectedBody = z.array(ceFlightInfoSchema);
    const result = expectedBody.safeParse(body);
    if (!result.success) {
      return c.json(
        { error: "Invalid flight info format" + result.error },
        400,
      );
    }

    await new CeFlightInfoService(shop).createFlightInfoByOrderId(
      orderId,
      result.data,
    );

    return c.json(
      {
        message: "Flight Info created successfully",
      },
      200,
    );
  } catch (error) {
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      error.status ?? 500,
    );
  }
});

CE_FLIGHT_INFO_ROUTE.get("/get-flight-info/:orderId", async (c) => {
  try {
    const shopId = c.req.header("shopware-app-shop-id");
    const shopwareAppToken = c.req.header("shopware-app-token");
    const orderId = c.req.param("orderId");
    if (!shopId || !shopwareAppToken || !orderId) {
      return c.json(
        {
          error:
            "Missing required fields: shopware-app-shop-id,  shopware-app-token or order_id",
        },
        400,
      );
    }
    const isValidOrderId = /^[0-9a-f]{32}$/.test(orderId);
    if (!isValidOrderId) {
      return c.json({ error: "Invalid order ID format" }, 400);
    }
    const app = c.get("app") as AppServer;
    const shop = await app.repository.getShopById(shopId);
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    const flightInfo = await new CeFlightInfoService(
      shop,
    ).getFlightInfoByOrderId(orderId);
    return c.json(
      { message: "Flight Info fetched successfully", data: flightInfo },
      200,
    );
  } catch (error) {
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error : "Unknown error",
      },
      error.status ?? 500,
    );
  }
});
CE_FLIGHT_INFO_ROUTE.get("/get-with-order/:orderId", async (c) => {
  try {
    const shopId = c.req.header("shopware-app-shop-id");
    const shopwareAppToken = c.req.header("shopware-app-token");
    const orderId = c.req.param("orderId");
    if (!shopId || !shopwareAppToken || !orderId) {
      return c.json(
        {
          error:
            "Missing required fields: shopware-app-shop-id,  shopware-app-token or order_id",
        },
        400,
      );
    }
    const isValidOrderId = /^[0-9a-f]{32}$/.test(orderId);
    if (!isValidOrderId) {
      return c.json({ error: "Invalid order ID format" }, 400);
    }
    const app = c.get("app") as AppServer;
    const shop = await app.repository.getShopById(shopId);
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    const flightInfo = await new CeFlightInfoService(
      shop,
    ).getFlightInfoWithOrder(orderId);
    return c.json(
      { message: "Flight Info fetched successfully", data: flightInfo },
      200,
    );
  }
  catch (error) {
    return c.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error : "Unknown error",
      },
      error.status ?? 500,
    );
  }
});

export default CE_FLIGHT_INFO_ROUTE;
