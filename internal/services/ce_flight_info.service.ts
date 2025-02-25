import { EntitySearchResult } from "@shopware-ag/app-server-sdk/helper/admin-api";
import CeFlightInfoRepository from "../repositories/ce_flight_info.repository";
import { CeFlightInfo } from "../types/ce_traveller";
import { HttpClient } from "@shopware-ag/app-server-sdk";

class CeFlightInfoService {
    private readonly flightInfoRepository: CeFlightInfoRepository;
    constructor(client: HttpClient) {
        this.flightInfoRepository = new CeFlightInfoRepository(client);
    }

    async getFlightInfoByOrderId(orderId: string): Promise<EntitySearchResult<CeFlightInfo>> {
         return await this.flightInfoRepository.getFlightInfoByOrderId(orderId);
    }

    async createFlightInfoByOrderId(orderId: string, flightInfo: CeFlightInfo): Promise<void> {
        return await this.flightInfoRepository.createFlightInfoByOrderId(orderId, flightInfo);
    }

    async updateFlightInfoByOrderId(orderId: string, flightInfo: CeFlightInfo): Promise<void> {
        return await this.flightInfoRepository.updateFlightInfoByOrderId(orderId, flightInfo);
    }

    async deleteFlightInfoByOrderId(orderId: string): Promise<void> {
        return await this.flightInfoRepository.deleteFlightInfoByOrderId(orderId);
    }
    
    
}

export default CeFlightInfoService;