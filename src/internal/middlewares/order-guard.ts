import { Context, Next } from "hono";
import OrderService from "../services/order.js";

export const orderGuard = async (c: Context, next: Next) => {
  const shop = c.get("shop");
  const customerId = c.get("customerId");
  const orderId = c.req.query("orderId");
  if (!orderId || !customerId || !shop) {
    return c.json(
      { error: "Missing required fields: orderId, customerId, shop" },
      400,
    );
  }
  const orderService = new OrderService(shop);
  const order = await orderService.getOrderById(orderId);
  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }
  if (order.orderCustomer.customerId !== customerId) {
    return c.json(
      { error: "Customer does not have access to this order" },
      403,
    );
  }
  await next();
};
