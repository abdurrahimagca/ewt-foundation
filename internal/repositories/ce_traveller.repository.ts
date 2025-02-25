import { EntityRepository } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { CeTraveller } from "../types/ce_traveller";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

class CeTravellerRepository extends EntityRepository<CeTraveller> {
  private readonly repository: EntityRepository<CeTraveller>;
  constructor(client: HttpClient) {
    super(client, "ce_traveller");
    this.repository = new EntityRepository<CeTraveller>(client, "ce_traveller");
  }

  async getTravelersAndFlightInfoByOrderId(
    orderId: string,
  ): Promise<CeTraveller[]> {
    const criteria = new Criteria();

    criteria.addFilter({
      field: "order_id",
      type: "equals",
      value: orderId,
    });

    return (await this.repository.search(criteria)).data;
  }

  async healthCheck(): Promise<CeTraveller[]> {
    const criteria = new Criteria([]);
    const searchResult = await this.repository.search(criteria);
    return searchResult.data;
  }

  async createTravelerByOrderId(
    orderId: string,
    traveler: CeTraveller,
  ): Promise<void> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "order_id",
      type: "equals",
      value: orderId,
    });
    return await this.repository.upsert([traveler]);
  }

  async updateTravelerByOrderId(
    orderId: string,
    traveler: CeTraveller,
  ): Promise<void> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "order_id",
      type: "equals",
      value: orderId,
    });
    return await this.repository.upsert([traveler]);
  }

  async deleteTravelerByOrderId(orderId: string): Promise<void> {
    return await this.repository.deleteByFilters([
      {
        field: "order_id",
        type: "equals",
        value: orderId,
      },
    ]);
  }
}

export default CeTravellerRepository;
