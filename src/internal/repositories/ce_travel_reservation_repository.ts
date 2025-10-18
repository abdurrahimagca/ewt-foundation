import { EntityRepository } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { HttpClient } from "@shopware-ag/app-server-sdk";

import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";
import {
  CeOrderReservationPaymentType,
} from "../types/ce_order_reservation_payment.js";

export class CeTravelReservationRepository extends EntityRepository<CeOrderReservationPaymentType> {
  private readonly repository: EntityRepository<CeOrderReservationPaymentType>;
  private readonly criteria: Criteria;
  constructor(client: HttpClient, criteria: Criteria) {
    super(client, "ce_order_reservation_payment");
    this.repository = new EntityRepository<CeOrderReservationPaymentType>(
      client,
      "ce_order_reservation_payment",
    );
    this.criteria = criteria;
  }
    async createReservation(data: CeOrderReservationPaymentType): Promise<void> { 
        await this.repository.upsert([data]);
  }
  async getReservationByOrderId(orderId: string): Promise<CeOrderReservationPaymentType | null> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "orderId",
      type: "equals",
      value: orderId,
    });
    const result = await this.repository.search(criteria);
    return result.first();
  }
}
