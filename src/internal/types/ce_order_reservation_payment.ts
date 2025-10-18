import { z } from "zod";
import { Order } from "./order.type.js";

const shopwareId = z
  .string()
  .regex(/^[0-9a-f]{32}$/, "Invalid Shopware ID format");

export const ceOrderReservationPaymentSchema = z.object({
  id: shopwareId,
  orderId: shopwareId,
  order: z.custom<Order>().optional(),
  reservationAmount: z.number().positive("Reservation amount must be positive"),
});

export type CeOrderReservationPaymentType = z.infer<
  typeof ceOrderReservationPaymentSchema
>;
