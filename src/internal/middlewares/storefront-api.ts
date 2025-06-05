import { AppServer } from "@shopware-ag/app-server-sdk";
import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export const apiShopTransformMw = async (c: Context, next: Next) => {
  try {
    const shopId = c.req.header("shopware-app-shop-id");
    const shopwareAppToken = c.req.header("shopware-app-token");
    if (!shopId || !shopwareAppToken) {
      return c.json(
        {
          error:
            "Missing required fields: shopware-app-shop-id or shopware-app-token",
        },
        400,
      );
    }
    const app = c.get("app") as AppServer;

    const shop = await app.repository.getShopById(shopId);
    const secret = shop?.getShopSecret();
    if (!secret) {
      return c.json({ error: "Shop secret is not set" }, 401, {});
    }
    const tkn = await verify(shopwareAppToken, secret, "HS256");
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    c.set("shop", shop);
    if (!tkn.customerId) {
      return c.json({ error: "Customer ID is required" }, 401);
    }
    c.set("customerId", tkn.customerId as string);
    await next();
  } catch (error) {
    return c.json(
      {
        error: "Internal server error, shop transform middleware",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : "No stack trace",
      },
      500,
    );
  }
};
