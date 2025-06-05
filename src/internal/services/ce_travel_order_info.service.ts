import { HttpClient, ShopInterface } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";
import CeTravelOrderInfoRepository from "../repositories/ce_travel_order_info.repository.js";
import {
  CeTravelOrderInfoInsertInformation,
  CeTravelOrderInfoEntity,
  CeTravelOrderInfoUpdateInformation,
} from "../types/new_ce_travel_order_info.js";
import OrderService from "./order.js";

class CeTravelOrderInfoService {
  private readonly client: HttpClient;
  private readonly orderService: OrderService;
  constructor(shop: ShopInterface) {
    this.client = new HttpClient(shop);
    this.orderService = new OrderService(shop);
  }

  private async ensureNoDuplicateOrderTravelInfo(
    orderIds: Array<string>,
  ): Promise<void> {
    const criteria = new Criteria();
    criteria.addFilter({
      field: "orderId",
      type: "equalsAny",
      value: orderIds,
    });
    const repository = new CeTravelOrderInfoRepository(this.client, criteria);
    const result = await repository.search(criteria);
    if (result.data.length > 0) {
      throw new Error("Order travel info already exists");
    }
  }

  async getOrderTravelInfoService(
    customerId: string,
    orderId: string,
  ): Promise<Array<CeTravelOrderInfoEntity>> {
    try {
      const criteria = new Criteria();
      criteria.addFilter({
        field: "orderId",
        type: "equals",
        value: orderId,
      });
      criteria.addAssociation("order");
      criteria.addAssociation("order.orderCustomer");
      criteria.addAssociation("flightInfo");
      criteria.addAssociation("emergencyContactInfo");
      criteria.addAssociation("travellers");
      criteria.addAssociation("roomProductDetailedInfo");

      const repository = new CeTravelOrderInfoRepository(this.client, criteria);
      const result = await repository.searchOrderTravelInfo();
      const filteredResult = result.data.filter(
        (item) => item.order?.orderCustomer.customerId === customerId,
      );

      return filteredResult;
    } catch (error) {
      console.error("Error in getOrderTravelInfoService:", error);
      throw error;
    }
  }

  async createOrderTravelInfoService(
    data: CeTravelOrderInfoInsertInformation,
    customerId: string,
  ): Promise<void> {
    try {
      await this.orderService.validateOrderBelongToCustomerByCustomerId(
        data.map((item) => item.orderId),
        customerId,
      );
      await this.ensureNoDuplicateOrderTravelInfo(
        data.map((item) => item.orderId),
      );
      const repository = new CeTravelOrderInfoRepository(
        this.client,
        new Criteria(),
      );
      await repository.createOrderTravelInfo(data);
    } catch (error) {
      console.error("Error in createOrderTravelInfoService:", error);
      throw error;
    }
  }

  async deleteOrderTravelInfoService(
    orderId: string,
    infoId: string,
    customerId: string,
  ): Promise<void> {
    try {
      await this.orderService.validateOrderBelongToCustomerByCustomerId(
        [orderId],
        customerId,
      );

      const repository = new CeTravelOrderInfoRepository(
        this.client,
        new Criteria(),
      );
      await repository.deleteOrderTravelInfo(orderId, infoId);
    } catch (error) {
      console.error("Error in deleteOrderTravelInfoService:", error);
      throw error;
    }
  }

  async updateOrderTravelInfoService(
    payload: CeTravelOrderInfoUpdateInformation,
    customerId: string,
  ): Promise<void> {
    try {
      await this.orderService.validateOrderBelongToCustomerByCustomerId(
        payload.map((item) => item.orderId),
        customerId,
      );
      const repository = new CeTravelOrderInfoRepository(
        this.client,
        new Criteria(),
      );
      await repository.updateOrderTravelInfo(payload);
    } catch (error) {
      console.error("Error in updateOrderTravelInfoService:", error);
      throw error;
    }
  }
}

export default CeTravelOrderInfoService;
