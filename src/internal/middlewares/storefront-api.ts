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
    //console.log("shopId", shopId);
    //console.log("shopwareAppToken", shopwareAppToken);

    const app = c.get("app") as AppServer;
    // console.log("app", app);

    const shop = await app.repository.getShopById(shopId);
    //console.log("shop", shop);
    if (!shop) {
      return c.json({ error: "Shop not found" }, 404);
    }
    c.set("shop", shop);
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
