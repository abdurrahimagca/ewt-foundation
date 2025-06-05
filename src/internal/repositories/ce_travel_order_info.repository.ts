import {
  EntityRepository,
  EntitySearchResult,
} from "@shopware-ag/app-server-sdk/helper/admin-api";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";
import { CeTravelOrderInfoEntity } from "@/internal/types/new_ce_travel_order_info.js";
import {
  CeTravelOrderInfoInsertInformation,
  CeTravelOrderInfoUpdateInformation,
} from "../types/new_ce_travel_order_info.js";

class CeTravelOrderInfoRepository extends EntityRepository<CeTravelOrderInfoEntity> {
  private readonly repository: EntityRepository<CeTravelOrderInfoEntity>;
  private readonly criteria: Criteria;
  constructor(client: HttpClient, criteria: Criteria) {
    super(client, "ce_travel_order_info");
    this.repository = new EntityRepository<CeTravelOrderInfoEntity>(
      client,
      "ce_travel_order_info",
    );
    this.criteria = criteria;
  }
  async searchOrderTravelInfo(): Promise<
    EntitySearchResult<CeTravelOrderInfoEntity>
  > {
    return await this.repository.search(this.criteria);
  }
  async createOrderTravelInfo(
    data: CeTravelOrderInfoInsertInformation,
  ): Promise<void> {
    await this.repository.upsert(data);
  }
  async updateOrderTravelInfo(
    data: CeTravelOrderInfoUpdateInformation,
  ): Promise<void> {
    if (!data) {
      throw new Error("Data cannot be empty");
    }
    await this.repository.upsert(data);
  }

  async deleteOrderTravelInfo(orderId: string, infoId: string): Promise<void> {
    await this.repository.deleteByFilters([
      { field: "orderId", type: "equals", value: orderId },
      { field: "id", type: "equals", value: infoId },
    ]);
  }
}
export default CeTravelOrderInfoRepository;
