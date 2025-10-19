import { ShopInterface } from "@shopware-ag/app-server-sdk";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import {
  PaymentPayload,
} from "src/internal/types/mock-payment-provider.js";
import { MockProvider } from "./mock-provider.js";
import OrderRepository from "src/internal/repositories/order.repository.js";
import { OrderTransactionCaptureRepository } from "src/internal/repositories/order_transaction_capture.js";
export class PaymentManager {
  private readonly client: HttpClient;
  private readonly orderRepository: OrderRepository;
  private readonly orderTransactionCaptureRepository: OrderTransactionCaptureRepository;
  private readonly mockProvider: MockProvider;
  constructor(shop: ShopInterface) {
    this.client = new HttpClient(shop);
    this.orderRepository = new OrderRepository(this.client);
    this.orderTransactionCaptureRepository =
      new OrderTransactionCaptureRepository(this.client);
    this.mockProvider = new MockProvider();
  }
  async pay(payload: PaymentPayload): Promise<void> {
    const result = await this.mockProvider.getResponse({
      orderId: payload.orderId,
      amount: payload.amount,
    });
    if (!result) {
      throw new Error("Failed to get response");
    }

    await this.orderTransactionCaptureRepository.saveNewCapture({
      id: result.id,
      orderId: payload.orderId,
      amount: {
        unitPrice: payload.amount,
        totalPrice: payload.amount,
        quantity: 1,
      },
    });
    return;
  }
}
