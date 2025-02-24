import { HttpClient } from "@shopware-ag/app-server-sdk";
import { EntityRepository } from "@shopware-ag/app-server-sdk/helper/admin-api";
import { Criteria } from "@shopware-ag/app-server-sdk/helper/criteria";

type Order = {
    id: string;
    name: string;
    price: number;
    order_number: string;
}

class OrderRepository extends EntityRepository<Order>{
    private readonly repository: EntityRepository<Order>;
    constructor(client: HttpClient) {
        super(client, 'order');
        this.repository = new EntityRepository<Order>(client, 'order');
    }

    async getOrderByOrderNumber(orderNumber: string): Promise<Order[]> {
        const criteria = new Criteria();
        criteria.addFilter({
            field: 'orderNumber',
            type: 'equals',
            value: orderNumber
        });
        return (await this.repository.search(criteria)).data;
    }

}
export default OrderRepository;