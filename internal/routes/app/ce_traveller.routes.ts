import { AppServer } from "@shopware-ag/app-server-sdk";
import { Hono } from "hono";
import { ceTravellerSchema } from "../../types/ce_types";
import { z } from "zod";
import { shopwareId } from "../../types/ce_types";
import CeTravellerService from "../../services/ce_traveller.service";

const CE_TRAVELLER_ROUTE = new Hono();

CE_TRAVELLER_ROUTE.post("/insert-traveller/:orderId", async (c) => {
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
      return c.json({ error: "Invalid order ID format" }, 400);
    }

    const app = c.get("app") as AppServer;
    const shop = await app.repository.getShopById(shopId);
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    const expectedBody = z.array(ceTravellerSchema);
    const result = expectedBody.safeParse(body);
    if (!result.success) {
      return c.json({ error: result.error.format() }, 400);
    }

    const data = result.data;
    await new CeTravellerService(shop).createTravelerByOrderId(id.data, data);

    return c.json(
      {
        message: "Traveller created successfully",
        status: 201,
      },
      201,
    );
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

CE_TRAVELLER_ROUTE.get("/get-traveller/:orderId", async (c) => {
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

    const id = shopwareId.safeParse(orderId);
    if (!id.success) {
      return c.json({ error: "Invalid shop ID format" }, 400);
    }

    const app = c.get("app") as AppServer;
    const shop = await app.repository.getShopById(shopId);
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    const data = await new CeTravellerService(shop).getTravelersByOrderId(
      id.data,
    );
    return c.json({ data, status: 200 });
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

CE_TRAVELLER_ROUTE.get("/get-with-order/:orderId", async (c) => {
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

    const id = shopwareId.safeParse(orderId);
    if (!id.success) {
      return c.json({ error: "Invalid shop ID format" }, 400);
    }

    const app = c.get("app") as AppServer;
    const shop = await app.repository.getShopById(shopId);
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    const data = await new CeTravellerService(shop).getTravellersWithOrder(
      id.data,
    );
    return c.json({ data, status: 200 });
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

export default CE_TRAVELLER_ROUTE;
