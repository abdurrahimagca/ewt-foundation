import { EntityRepository } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import { OrderTransactionCapture } from "../types/order.type.js";

export class OrderTransactionCaptureRepository {
  private readonly repository: EntityRepository<OrderTransactionCapture>;
  constructor(client: HttpClient) {
    this.repository = new EntityRepository<OrderTransactionCapture>(client, "order_transaction_capture");
  }
  async saveNewCapture(capture: OrderTransactionCapture): Promise<void> {
    await this.repository.upsert([capture]);
  }
}   