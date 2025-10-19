import { z } from "zod";
import { shopwareId } from "./ce_travel_product_bundle.js";
export interface PaymentPayload {
  orderId: string;
  amount: number;
}
