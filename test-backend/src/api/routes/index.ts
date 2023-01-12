import getShippingCostController from '../controllers/GetShippingCost.controller';

const routes: {
	path: string,
	get?: any[],
	post?: any[],
	patch?: any[],
}[] = [{
	path: '/shipping-cost',
	get: [getShippingCostController],
}];

export default routes;
