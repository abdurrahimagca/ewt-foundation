import { EntitySearchResult } from "@shopware-ag/app-server-sdk/helper/admin-api";
import CeFlightInfoRepository from "../repositories/ce_flight_info.repository";
import { CeFlightInfo } from "../types/ce_types";
import { HttpClient, ShopInterface } from "@shopware-ag/app-server-sdk";

class CeFlightInfoService {
  private readonly flightInfoRepository: CeFlightInfoRepository;
  shop: ShopInterface;
  constructor(shop: ShopInterface) {
    this.shop = shop;
    const client = new HttpClient(this.shop);
    this.flightInfoRepository = new CeFlightInfoRepository(client);
  }

  async getFlightInfoByOrderId(orderId: string): Promise<CeFlightInfo[]> {
    const result =
      await this.flightInfoRepository.getFlightsInfoByOrderId(orderId);
    return result.data;
  }

  async createFlightInfoByOrderId(
    orderId: string,
    flightInfo: CeFlightInfo[],
  ): Promise<void> {
    return await this.flightInfoRepository.createFlightsInfoByOrderId(
      orderId,
      flightInfo,
    );
  }

  async updateFlightInfoByOrderId(
    orderId: string,
    flightInfo: CeFlightInfo,
  ): Promise<void> {
    return await this.flightInfoRepository.updateFlightInfoByOrderId(
      orderId,
      flightInfo,
    );
  }

  async deleteFlightInfoByOrderId(orderId: string): Promise<void> {
    return await this.flightInfoRepository.deleteFlightInfoByOrderId(orderId);
  }
  async getFlightInfoWithOrder(orderId: string): Promise<CeFlightInfo[]> {
    const result =
      await this.flightInfoRepository.getFlightInfoWithOrder(orderId);
    return result.data;
  }
}

export default CeFlightInfoService;
