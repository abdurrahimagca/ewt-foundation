import { HttpClient, ShopInterface } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";
import CeTravelOrderInfoRepository from "../repositories/ce_travel_order_info.repository.js";
import { CeTravelOrderInfo } from "../types/ce_travel_order_info.js";

class CeTravelOrderInfoService {
  private readonly client: HttpClient;
  constructor(shop: ShopInterface) {
    this.client = new HttpClient(shop);
  }
  async getOrderTravelInfoService(filter: {
    field: string;
    value: string;
  }): Promise<CeTravelOrderInfo[]> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: filter.field,
      type: "equals",
      value: filter.value,
    });
    criteria.addAssociation("travellers");
    criteria.addAssociation("flightInfo");
    const repository = new CeTravelOrderInfoRepository(this.client, criteria);
    const result = await repository.searchOrderTravelInfo();
    return result.data;
  }
  async createOrderTravelInfoService(data: CeTravelOrderInfo[]): Promise<void> {
    data.forEach((item) => {
      item.identifierCode = `EWT${item.orderId.slice(0, 8)}`;
    });
    const repository = new CeTravelOrderInfoRepository(
      this.client,
      new Criteria(),
    );
    await repository.createOrderTravelInfo(data);
  }
}
export default CeTravelOrderInfoService;
