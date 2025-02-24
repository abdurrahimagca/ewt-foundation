import { HttpClient } from "@shopware-ag/app-server-sdk";
import OrderRepository from "../repositories/order.repository";

class OrderService {
  private readonly orderRepository: OrderRepository;
  constructor(client: HttpClient) {
    this.orderRepository = new OrderRepository(client);
  }
  async getOrderByOrderNumber(orderNumber: string) {
    return await this.orderRepository.getOrderByOrderNumber(orderNumber);
  }
}
export default OrderService;
