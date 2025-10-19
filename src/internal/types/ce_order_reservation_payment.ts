import { z } from "zod";
import { Order } from "./order.type.js";

const shopwareId = z
  .string()
  .regex(/^[0-9a-f]{32}$/,"Invalid Shopware ID format");

export const ceOrderReservationPaymentSchema = z.object({
  id: shopwareId,
  orderId: shopwareId,
  order: z.custom<Order>().optional(),
  depositAmount: z.number().positive("Deposit amount must be positive"),
  depositPaid: z.boolean().optional(),
  depositPaidAt: z.string().datetime().optional(),
  depositExpiresAt: z.string().datetime().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type CeOrderReservationPaymentType = z.infer<
  typeof ceOrderReservationPaymentSchema
>;
