import { EntityRepository } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { HttpClient } from "@shopware-ag/app-server-sdk";

import {
  CeOrderReservationPaymentType,
} from "../types/ce_order_reservation_payment.js";

export class CeTravelReservationRepository extends EntityRepository<CeOrderReservationPaymentType> {
  private readonly repository: EntityRepository<CeOrderReservationPaymentType>;
  constructor(client: HttpClient) {
    super(client, "ce_order_reservation_payment");
    this.repository = new EntityRepository<CeOrderReservationPaymentType>(
      client,
      "ce_order_reservation_payment",
    );
  }
    async createReservation(data: CeOrderReservationPaymentType): Promise<void> { 
        await this.repository.upsert([data]);
  }
 

}