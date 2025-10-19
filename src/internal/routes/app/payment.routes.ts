import { Hono } from "hono";
import { PaymentManager } from "src/internal/services/payment/payment-manager.js";
export const paymentRoutes = new Hono();

paymentRoutes.post("/pay/next", async (c) => {



});


paymentRoutes.post("/pay/sw-pos", async (c) => {

//expect
});


paymentRoutes.post("/pay/sw-pay-partially", async (c) => {
//todo calculate and pay the 10% of the order total price


});