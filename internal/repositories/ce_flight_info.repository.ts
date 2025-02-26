import {
  EntityRepository,
  EntitySearchResult,
} from "@shopware-ag/app-server-sdk/helper/admin-api";
import { CeFlightInfo } from "../types/ce_types";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

class CeFlightInfoRepository extends EntityRepository<CeFlightInfo> {
  private readonly repository: EntityRepository<CeFlightInfo>;
  constructor(client: HttpClient) {
    super(client, "ce_flight_info");
    this.repository = new EntityRepository(client, "ce_flight_info");
  }

  async getFlightsInfoByOrderId(
    orderId: string,
  ): Promise<EntitySearchResult<CeFlightInfo>> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "orderId",
      type: "equals",
      value: orderId,
    });

    return await this.repository.search(criteria);
  }

  async createFlightsInfoByOrderId(
    orderId: string,
    flightInfo: CeFlightInfo[],
  ): Promise<void> {
    flightInfo.map((info) => {
      info.orderId = orderId;
    });
    return await this.repository.upsert(flightInfo);
  }

  async updateFlightInfoByOrderId(
    orderId: string,
    flightInfo: CeFlightInfo,
  ): Promise<void> {
    flightInfo.orderId = orderId;
    return await this.repository.upsert([flightInfo]);
  }

  async deleteFlightInfoByOrderId(orderId: string): Promise<void> {
    return await this.repository.deleteByFilters([
      {
        field: "order_id",
        type: "equals",
        value: orderId,
      },
    ]);
  }
  async getFlightInfoWithOrder(
    orderId: string,
  ): Promise<EntitySearchResult<CeFlightInfo>> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "orderId",
      type: "equals",
      value: orderId,
    });
    criteria.addAssociation("order");

    return await this.repository.search(criteria);
  }
}

export default CeFlightInfoRepository;
