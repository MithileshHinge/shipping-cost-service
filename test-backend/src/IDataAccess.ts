import { CountryCode } from './common/CountryCode';
import IProductInfo from './common/IProductInfo';
import { Destination } from './validators/validateDest';
import { Source } from './validators/validateSrc';

export interface IDataAccess {
  /**
   * Lookup shipping cost for India and Pakistan source countries
   * @param src Source country code
   * @param dest Destination country code
   * @param productInfo Product information { length, width, height, weight }
   * @throws DatabaseError if lookup operation fails
   * @return Promise to return the shipping cost in USD, null if no entry found in the table
  */
  lookupShippingCost(src: CountryCode.INDIA | CountryCode.PAKISTAN, dest: Destination, productInfo: IProductInfo): Promise<number | null>;
}
