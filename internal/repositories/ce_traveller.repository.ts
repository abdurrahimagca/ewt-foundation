import { EntityRepository } from '@shopware-ag/app-server-sdk/helper/admin-api';
import { CeTraveler } from '../types/ce_traveller';
import { HttpClient } from '@shopware-ag/app-server-sdk';
import { Criteria } from '@shopware-ag/app-server-sdk/helper/criteria';


class CeTravellerRepository extends EntityRepository<CeTraveler> {
    private readonly repository: EntityRepository<CeTraveler>;
    constructor(client: HttpClient) {
        super(client, 'ce_traveler');
        this.repository = new EntityRepository<CeTraveler>(client, 'ce_traveler');
    }

    async getTravelersAndFlightInfoByOrderId(orderId: string): Promise<CeTraveler[]> {
        const criteria = new Criteria();
        criteria.addAssociation('flight_info');
        criteria.addFilter({
            field: 'flight_info.order_id',
            type: 'equals',
            value: orderId
        });

        return (await this.repository.search(criteria)).data;
    }
    
    async healthCheck(): Promise<CeTraveler[]> {
        const criteria = new Criteria([]);
        const searchResult = await this.repository.search(criteria);
        return searchResult.data
    }

    async createTravelerByOrderId(orderId: string, traveler: CeTraveler): Promise<void> {
        const criteria = new Criteria();
        criteria.addAssociation('flight_info');
        criteria.addFilter({
            field: 'flight_info.order_id',
            type: 'equals',
            value: orderId
        });
        traveler.flight_info_id = (await this.repository.search(criteria)).data[0].id;
        return await this.repository.upsert([traveler]);
    }

    async updateTravelerByOrderId(orderId: string, traveler: CeTraveler): Promise<void> {
        const criteria = new Criteria();
        criteria.addAssociation('flight_info');
        criteria.addFilter({
            field: 'flight_info.order_id',
            type: 'equals',
            value: orderId
        });
        traveler.flight_info_id = (await this.repository.search(criteria)).data[0].id;
        return await this.repository.upsert([traveler]);
    }

    async deleteTravelerByOrderId(orderId: string): Promise<void> {
        return await this.repository.deleteByFilters([{
            field: 'flight_info.order_id',
            type: 'equals',
            value: orderId
        }]);
    }
}

export default CeTravellerRepository;