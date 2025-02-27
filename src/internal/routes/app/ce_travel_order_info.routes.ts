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
  const shop = c.get("shop");
  const body = await c.req.json();
  const result = ceTravelOrderInfoSchema.safeParse(body);
  if (!result.success) {
    return c.json(
      {
        error: "Invalid request body",
        "error occurred cause of": result.error,
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
});
export default TRAVEL_ORDER_INFO;
