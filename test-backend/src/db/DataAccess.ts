import { CountryCode } from '../common/CountryCode';
import IProductInfo from '../common/IProductInfo';
import { IDataAccess } from '../IDataAccess';
import { Destination } from '../validators/validateDest';

export default class DataAccess implements IDataAccess {
  lookupShippingCost(src: CountryCode.INDIA | CountryCode.PAKISTAN, dest: Destination, productInfo: IProductInfo): Promise<number | null> {
    return Promise.resolve(23);
  }
}
