import { HttpClient } from "@shopware-ag/app-server-sdk";
import {
  EntityRepository,
  EntitySearchResult,
} from "@shopware-ag/app-server-sdk/helper/admin-api";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";
import { Order } from "../types/ce_types";

class OrderRepository extends EntityRepository<Order> {
  private readonly repository: EntityRepository<Order>;
  constructor(client: HttpClient) {
    super(client, "order");
    this.repository = new EntityRepository<Order>(client, "order");
  }

  async getOrderByOrderNumber(
    orderNumber: string,
  ): Promise<EntitySearchResult<Order>> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "orderNumber",
      type: "equals",
      value: orderNumber,
    });
    criteria.fields = ["id", "name", "price"];
    return await this.repository.search(criteria);
  }

  async getOrderByOrderId(orderId: string): Promise<EntitySearchResult<Order>> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "id",
      type: "equals",
      value: orderId,
    });

    return await this.repository.search(criteria);
  }
  
}
export default OrderRepository;
