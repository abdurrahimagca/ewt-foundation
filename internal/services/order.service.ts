import { HttpClient } from "@shopware-ag/app-server-sdk";
import OrderRepository from "../repositories/order.repository";
import CeFlightInfoRepository from "../repositories/ce_flight_info.repository";
import CeTravellerRepository from "../repositories/ce_traveller.repository";

class OrderService {
  private readonly orderRepository: OrderRepository;
  private readonly ceFlightInfoRepository: CeFlightInfoRepository;
  private readonly ceTravellerRepository: CeTravellerRepository;
  constructor(client: HttpClient) {
    this.orderRepository = new OrderRepository(client);
    this.ceFlightInfoRepository = new CeFlightInfoRepository(client);
    this.ceTravellerRepository = new CeTravellerRepository(client);
  }
  async getOrderByOrderNumber(orderNumber: string) {
    return await this.orderRepository.getOrderByOrderNumber(orderNumber);
  }
  async getOrderByOrderIdWithTravellers(orderId: string) {
  const [flight_info, travellers, order] = await Promise.all([
    this.ceFlightInfoRepository.getFlightInfoByOrderId(orderId),
    this.ceTravellerRepository.getTravelersAndFlightInfoByOrderId(orderId),
    this.orderRepository.getOrderByOrderId(orderId),
  ]);
    return { flight_info, travellers, order };
  }
}
export default OrderService;
