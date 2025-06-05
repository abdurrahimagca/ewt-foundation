import { HttpClient, ShopInterface } from "@shopware-ag/app-server-sdk";
import OrderRepository from "../repositories/order.repository.js";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";
class OrderService {
  private readonly client: HttpClient;
  constructor(shop: ShopInterface) {
    this.client = new HttpClient(shop);
  }

  async validateOrderBelongToCustomerByCustomerId(
    orderIds: Array<string>,
    customerId: string,
  ): Promise<void> {
    const repository = new OrderRepository(this.client);
    const criteria = new Criteria();
    criteria.addFilter({
      field: "id",
      type: "equalsAny",
      value: orderIds,
    });
    criteria.addAssociation("orderCustomer");
    const result = await repository.searchOrder(criteria);
    if (result.data.length === 0) {
      throw new Error("Order not found");
    }
    const customerIds = result.data.map((item) => item.orderCustomer.customerId);
    if(!customerIds.includes(customerId)) {
      throw new Error("Order does not belong to customer");
    }
    return;
  }
}

export default OrderService;
