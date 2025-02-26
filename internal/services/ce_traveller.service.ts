import CeTravellerRepository from "../repositories/ce_traveller.repository";
import { CeTraveller } from "../types/ce_types";
import { HttpClient, ShopInterface } from "@shopware-ag/app-server-sdk";

class CeTravellerService {
  private readonly travellerRepository: CeTravellerRepository;
  private readonly client: HttpClient;
  private readonly shop: ShopInterface;

  constructor(shop: ShopInterface) {
    this.shop = shop;
    this.client = new HttpClient(this.shop);
    this.travellerRepository = new CeTravellerRepository(this.client);
  }
  async getTravelersByOrderId(orderId: string): Promise<CeTraveller[]> {
    const data = this.travellerRepository.getTravelersByOrderId(orderId);

    return (await data).data;
  }

  async createTravelerByOrderId(
    orderId: string,
    traveler: CeTraveller[],
  ): Promise<void> {
    traveler.map((info) => {
      info.orderId = orderId;
    });
    return await this.travellerRepository.createTravelersByOrderId(
      orderId,
      traveler,
    );
  }
  async getTravellersWithOrder(orderId: string): Promise<CeTraveller[]> {
    const data = this.travellerRepository.getTravelerWithOrder(orderId);

    return (await data).data;
  }

  async updateTravelerByOrderId(
    orderId: string,
    traveler: CeTraveller,
  ): Promise<void> {
    return await this.travellerRepository.updateTravelerByOrderId(
      orderId,
      traveler,
    );
  }

  async deleteTravelerByOrderId(orderId: string): Promise<void> {
    return await this.travellerRepository.deleteTravelerByOrderId(orderId);
  }
}

export default CeTravellerService;
