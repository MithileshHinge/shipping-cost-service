import IProductInfo from './common/IProductInfo';
import { Destination } from './validators/validateDest';
import { Source } from './validators/validateSrc';

export default interface IEasyShip {
  /**
   * Get shipping cost from EasyShip API
   * @throws ValidationError if API responds with 400 (Bad Request)
   * @throws AuthorizationError if API responds with 401 (Unauthorized)
   * @throws InternalServerError if API responds with any other error
   * @return Promise to return the shipping cost in USD
   */
  getShippingCost(src: Source, dest: Destination, productInfo: IProductInfo): Promise<number>;
}
