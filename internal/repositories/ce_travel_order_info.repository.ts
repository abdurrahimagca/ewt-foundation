import {
  EntityRepository,
  EntitySearchResult,
} from "@shopware-ag/app-server-sdk/helper/admin-api";
import { CeTravelOrderInfo } from "../types/ce_travel_order_info";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

class CeTravelOrderInfoRepository extends EntityRepository<CeTravelOrderInfo> {
  private readonly repository: EntityRepository<CeTravelOrderInfo>;
  private readonly criteria: Criteria;
  constructor(client: HttpClient, criteria) {
    super(client, "ce_travel_order_info");
    this.repository = new EntityRepository<CeTravelOrderInfo>(
      client,
      "ce_travel_order_info",
    );
    this.criteria = criteria;
  }
  async searchOrderTravelInfo(): Promise<
    EntitySearchResult<CeTravelOrderInfo>
  > {
    return await this.repository.search(this.criteria);
  }
  async createOrderTravelInfo(data: CeTravelOrderInfo[]): Promise<void> {
    return await this.repository.upsert(data);
  }
  async updateOrderTravelInfo(data: CeTravelOrderInfo): Promise<void> {
    return await this.repository.upsert([data]);
  }
}
export default CeTravelOrderInfoRepository;
