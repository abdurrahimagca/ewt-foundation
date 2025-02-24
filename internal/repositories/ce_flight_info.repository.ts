import { EntityRepository } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { CeFlightInfo } from "../types/ce_traveller";
import { HttpClient } from "@shopware-ag/app-server-sdk";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";


class CeFlightInfoRepository extends EntityRepository<CeFlightInfo> {
    private readonly repository: EntityRepository<CeFlightInfo>;
    constructor(client: HttpClient) {
        super(client, 'ce_flight_info');
    }

    async getFlightInfoByOrderId(orderId: string): Promise<CeFlightInfo> {
        const criteria = new Criteria();
        criteria.addFilter({
            field: 'order_id',
            type: 'equals',
            value: orderId
        });
        return (await this.repository.search(criteria)).data[0];
    }

    async createFlightInfoByOrderId(orderId: string, flightInfo: CeFlightInfo): Promise<void> {
        flightInfo.order_id = orderId;
        return await this.repository.upsert([flightInfo]);
    }

    async updateFlightInfoByOrderId(orderId: string, flightInfo: CeFlightInfo): Promise<void> {
        flightInfo.order_id = orderId;
        return await this.repository.upsert([flightInfo]);
    }


    async deleteFlightInfoByOrderId(orderId: string): Promise<void> {
        return await this.repository.deleteByFilters([{
            field: 'order_id',
            type: 'equals',
            value: orderId
        }]);
    }

}

export default CeFlightInfoRepository;