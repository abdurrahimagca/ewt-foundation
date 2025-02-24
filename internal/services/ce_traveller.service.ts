import CeTravellerRepository from "../repositories/ce_traveller.repository";
import { CeTraveler } from "../types/ce_traveller";
import { HttpClient } from "@shopware-ag/app-server-sdk";

class CeTravellerService {
    private readonly travellerRepository: CeTravellerRepository;

    constructor(client: HttpClient) {
        this.travellerRepository = new CeTravellerRepository(client);

    }

    async getTravelersAndFlightInfoByOrderId(orderId: string): Promise<CeTraveler[]> {
        return await this.travellerRepository.getTravelersAndFlightInfoByOrderId(orderId);
    }

    async createTravelerByOrderId(orderId: string, traveler: CeTraveler): Promise<void> {
        return await this.travellerRepository.createTravelerByOrderId(orderId, traveler);
    }

    async updateTravelerByOrderId(orderId: string, traveler: CeTraveler): Promise<void> {
        return await this.travellerRepository.updateTravelerByOrderId(orderId, traveler);
    }

    async deleteTravelerByOrderId(orderId: string): Promise<void> {
        return await this.travellerRepository.deleteTravelerByOrderId(orderId);
    }
    async healthCheck(): Promise<CeTraveler[]> {
        return await this.travellerRepository.healthCheck();
    }
}

export default CeTravellerService;