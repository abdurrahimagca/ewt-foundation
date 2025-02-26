import { EntityRepository, EntitySearchResult } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { CeTraveller } from "../types/ce_types";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

class CeTravellerRepository extends EntityRepository<CeTraveller> {
  private readonly repository: EntityRepository<CeTraveller>;
  constructor(client: HttpClient) {
    super(client, "ce_traveller");
    this.repository = new EntityRepository<CeTraveller>(client, "ce_traveller");
  }

  async getTravelersByOrderId(orderId: string): Promise<EntitySearchResult<CeTraveller>> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "orderId",
      type: "equals",
      value: orderId,
    });

    return (await this.repository.search(criteria));
  }

  async createTravelersByOrderId(
    orderId: string,
    traveler: CeTraveller[],
  ): Promise<void> {
    
    return await this.repository.upsert(traveler);
  }

  async updateTravelerByOrderId(
    orderId: string,
    traveler: CeTraveller,
  ): Promise<void> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "orderId",
      type: "equals",
      value: orderId,
    });
    return await this.repository.upsert([traveler]);
  }

  async deleteTravelerByOrderId(orderId: string): Promise<void> {
    return await this.repository.deleteByFilters([
      {
        field: "orderId",
        type: "equals",
        value: orderId,
      },
    ]);
  }
  async getTravelerWithOrder(orderId: string): Promise<EntitySearchResult<CeTraveller>> {
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

export default CeTravellerRepository;
