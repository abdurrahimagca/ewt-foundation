import { HttpClient, ShopInterface } from "@shopware-ag/app-server-sdk";
import OrderRepository from "../repositories/order.repository";


class OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly client: HttpClient;
  private readonly shop: ShopInterface;

  constructor(shop: ShopInterface) {
    this.shop = shop;
    this.client = new HttpClient(this.shop);
    this.orderRepository = new OrderRepository(this.client);
  }

}
export default OrderService;
