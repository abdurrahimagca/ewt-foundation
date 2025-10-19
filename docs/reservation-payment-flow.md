# Reservation Payment Flow

This is the flow you can replicate from your Next.js frontend:

1. **Creating/Updating the reservation**

   - POST to your own API.
   - On the server call `ReservationPaymentService.createReservation` (if there is no entry yet) and then `markReservationAuthorized`.
   - Store whatever payload you need in `metadata`.

2. **Reading the reservation**

   - Implement a GET route in Next.js that calls `ReservationPaymentService.getReservationByOrderId`.
   - Return `reservationAmount`, `remainingBalance`, `status`, and any metadata you stored.
   - Use this data to render the reservation status in Storefront.

3. **Finalizing / collecting the remainder**

   - When the customer pays the remaining balance:
     - Call `markReservationCaptured` to close the custom entity.
     - Call Shopware’s `_action/order_transaction/{id}/state/paid` via the Admin API so the order is fully paid.

4. **Mock helpers (optional)**
   - For end-to-end tests from your Next backend you now have signed endpoints behind the `orderGuard`/`nextGuard` stack:
     - `POST /payment/mock/reservation?orderId=<uuid>`  
       Body (optional): `{ "orderTransactionId": "<uuid>", "percentage": 0.1 }` or `{ "amount": 12.34 }`  
       → creates/updates the reservation entry and marks it as `authorize`. Defaults to 10 % of the order total when no amount/percentage is provided.
     - `POST /payment/mock/sw-pos?orderId=<uuid>`  
       Body (optional): `{ "orderTransactionId": "<uuid>" }`  
       → transitions the (first) order transaction to `paid` and closes the reservation with `remainingBalance = 0`.
   - Both routes expect the same headers you already send to `/ce/reservation-payment`:
     - `shopware-app-shop-id`
     - `shopware-app-token` (Shopware signed token that includes `customerId`)
     - `X-Requester-Token` (your JWT that `nextGuard` validates)
   - The legacy `/app/payment/mock-pos/finalize` endpoint is still available for direct Shopware callbacks if you want to toggle `status=paid`, `status=fail`, or the mock reservation states.

## Admin Tab

The admin module (`ReservationPayment.vue`) reads the same data using the Meteor Admin SDK and is displayed under a “Reservation Payments” tab on the order detail page.

## Public Routes

Only `/public/ping` and static asset serving remain. All test helpers and mock pages were removed. You can provide your own Next.js pages for deposit capture and completion.
