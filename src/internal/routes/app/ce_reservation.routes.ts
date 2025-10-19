import { Hono } from "hono";
import { apiShopTransformMw } from "../../middlewares/storefront-api.js";
import { nextGuard } from "../../middlewares/next-guard.js";
import { orderGuard } from "../../middlewares/order-guard.js";
import { ReservationPaymentService } from "../../services/reservation.js";
import { ceOrderReservationPaymentSchema } from "../../types/ce_order_reservation_payment.js";

const CE_RESERVATION = new Hono();

CE_RESERVATION.use("/*", apiShopTransformMw);
CE_RESERVATION.use("/*", orderGuard);
CE_RESERVATION.use("/*", nextGuard);

CE_RESERVATION.post("/reservation-payment", async (c) => {
  try {
    const shop = c.get("shop");
    const orderId = c.req.query("orderId");
    if (!orderId) {
      return c.json({ error: "Order ID is required" }, 422);
    }
    const service = new ReservationPaymentService(shop);
    const body = await c.req.json();
    const parseResult = ceOrderReservationPaymentSchema.safeParse(body);
    if (!parseResult.success) {
      return c.json(
        { error: "Invalid request body", details: parseResult.error.flatten() },
        422,
      );
    }
    await service.createReservation(parseResult.data);
    return c.json({ message: "Reservation created successfully" }, 201);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default CE_RESERVATION;
