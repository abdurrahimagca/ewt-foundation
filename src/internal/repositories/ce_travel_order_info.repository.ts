import {
  EntityRepository,
  EntitySearchResult,
} from "@shopware-ag/app-server-sdk/helper/admin-api";
import { CeTravelOrderInfo } from "../types/ce_travel_order_info.js";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

class CeTravelOrderInfoRepository extends EntityRepository<CeTravelOrderInfo> {
  private readonly repository: EntityRepository<CeTravelOrderInfo>;
  private readonly criteria: Criteria;
  constructor(client: HttpClient, criteria: Criteria) {
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
    const criteria = new Criteria();
    criteria.addFilter({
      field: "orderId",
      type: "equals",
      value: data[0].orderId,
    });
    const result = await this.repository.search(criteria);
    if (result.total > 0) {
      throw new Error("Order Info already exists for this order");
    }

    await this.repository.upsert(data);
  }
  async updateOrderTravelInfo(data: Partial<CeTravelOrderInfo>): Promise<void> {
    if (!data) {
      throw new Error("Data cannot be empty");
    }
    const cleanedData = JSON.parse(JSON.stringify(data));
    await this.repository.upsert([cleanedData]);
  }

  async deleteOrderTravelInfo(orderId: string): Promise<void> {
    await this.repository.deleteByFilters([
      { field: "orderId", type: "equals", value: orderId },
    ]);
  }
}
export default CeTravelOrderInfoRepository;
