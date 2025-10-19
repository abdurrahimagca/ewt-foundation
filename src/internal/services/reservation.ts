import { HttpClient, ShopInterface } from "@shopware-ag/app-server-sdk";
import { CeTravelReservationRepository } from "../repositories/ce_travel_reservation_repository.js";
import { CeOrderReservationPaymentType } from "../types/ce_order_reservation_payment.js";
export class ReservationPaymentService {
  private readonly client: HttpClient;
  private readonly repository: CeTravelReservationRepository;
  constructor(shop: ShopInterface) {
    this.client = new HttpClient(shop);
    this.repository = new CeTravelReservationRepository(this.client);
  }
  async createReservation(data: CeOrderReservationPaymentType): Promise<void> {
    await this.repository.createReservation(data);
  }
}
