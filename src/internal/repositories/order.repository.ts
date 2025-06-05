import { HttpClient } from "@shopware-ag/app-server-sdk";
import { Order } from "../types/order.type.js";
import { EntityRepository, EntitySearchResult } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

class OrderRepository {
  private readonly repository: EntityRepository<Order>;

  constructor(client: HttpClient) {
    this.repository = new EntityRepository<Order>(client, "order");
  }

  async searchOrder(criteria: Criteria): Promise<EntitySearchResult<Order>> {
    return await this.repository.search(criteria);
  }
}

export default OrderRepository;
