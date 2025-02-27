import { AppServer } from "@shopware-ag/app-server-sdk";
import { Context, Next } from "hono";

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
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    c.set("shop", shop);
    await next();
  } catch (error) {
    return c.json(
      {
        error: "Internal server error",
      },
      500,
    );
  }
};
