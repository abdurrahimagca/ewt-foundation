import { HttpClient, ShopInterface } from "@shopware-ag/app-server-sdk";
import OrderRepository from "../repositories/order.repository.js";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";
import { EntitySearchResult } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { Order } from "../types/order.type.js";
import { EntityRepository } from "@shopware-ag/app-server-sdk/helper/admin-api";
class OrderService {
  private readonly client: HttpClient;
  private readonly repository: EntityRepository<Order>;
  constructor(shop: ShopInterface) {
    this.client = new HttpClient(shop);
    this.repository = new EntityRepository<Order>(this.client, "order");
  }
  async getOrderById(orderId: string): Promise<Order | null> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "id",
      type: "equals",
      value: orderId,
    });
    const result = await this.repository.search(criteria);
    return result.first();
  }
}

export default OrderService;
