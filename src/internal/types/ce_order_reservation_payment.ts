import { z } from "zod";
import { Order } from "./order.type.js";

const shopwareId = z
  .string()
  .regex(/^[0-9a-f]{32}$/,"Invalid Shopware ID format");

export const ceOrderReservationPaymentSchema = z.object({
  id: shopwareId,
  orderId: shopwareId,
  order: z.custom<Order>().optional(),
  reservationAmount: z.number().positive("Reservation amount must be positive"),
  remainingBalance: z.number().min(0, "Remaining balance must be zero or positive").optional(),
  depositPaid: z.boolean().optional(),
  depositPaidAt: z.string().datetime().optional(),
  reservationExpiresAt: z.string().datetime().optional(),
  status: z.string().min(1).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CeOrderReservationPaymentType = z.infer<
  typeof ceOrderReservationPaymentSchema
>;
