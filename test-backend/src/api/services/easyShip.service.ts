import IProductInfo from '../../common/IProductInfo';
import IEasyShip from '../../IEasyShip';
import { Destination } from '../../validators/validateDest';
import { Source } from '../../validators/validateSrc';

export default class EasyShip implements IEasyShip {
  getShippingCost(src: Source, dest: Destination, productInfo: IProductInfo): Promise<number> {
    return Promise.resolve(25);
  }
}
