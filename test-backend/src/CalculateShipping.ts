import { CountryCode } from './common/CountryCode';
import NotFoundError from './common/errors/NotFoundError';
import IProductInfo from './common/IProductInfo';
import ICache from './ICache';
import { IDataAccess } from './IDataAccess';
import IEasyShip from './IEasyShip';
import validateDest from './validators/validateDest';
import validateProductInfo from './validators/validateProductInfo';
import validateSrc from './validators/validateSrc';

export default class CalculateShipping {
  private dataAccess: IDataAccess;
  private easyShip: IEasyShip;
  private cache: ICache;

  constructor(dataAccess, easyShip, cache) {
    this.dataAccess = dataAccess;
    this.easyShip = easyShip;
    this.cache = cache;
  }

  /**
   * Calculate shipping cost use case
   * @param src Source country code
   * @param dest Destination country code
   * @param productInfo Product information { length, width, height, weight }
   * @throws ValidationError if input validation failed
   * @throws NotFoundError if shipping with given parameters is not available
   * @throws ValidationError if EasyShip API responds with 400 (Bad Request)
   * @throws AuthorizationError if EasyShip API responds with 401 (Unauthorized)
   * @throws InternalServerError if EasyShip API responds with any other error
   */
  async calculate(src: string, dest: string, productInfo: IProductInfo) {
    const srcValidated = validateSrc(src);
    const destValidated = validateDest(dest);
    const productInfoValidated = validateProductInfo(productInfo);

    // Return shipping cost from cache if it exists
    // bucket dimensions (length, width, height, weight) into 20cm/20kg intervals
    const lenBucket = Math.floor(productInfoValidated.length / 20);
    const widthBucket = Math.floor(productInfoValidated.width / 20);
    const heightBucket = Math.floor(productInfoValidated.height / 20);
    const weightBucket = Math.floor(productInfoValidated.weight / 20);

    const key = `${srcValidated}:${destValidated}:${lenBucket}:${widthBucket}:${heightBucket}:${weightBucket}`;
    let cost = await this.cache.getValue(key);
    if (cost) return cost;
    
    // Key doesn't exist in cache, fetch shipping cost from database/API and store it in cache
    if (srcValidated === CountryCode.INDIA || srcValidated === CountryCode.PAKISTAN) {
      cost = await this.dataAccess.lookupShippingCost(srcValidated, destValidated, productInfoValidated);
    } else if ([CountryCode.USA, CountryCode.UK, CountryCode.FRANCE, CountryCode.GERMANY].includes(srcValidated)) {
      cost = await this.easyShip.getShippingCost(srcValidated, destValidated, productInfoValidated);
    }
    if (!cost) {
      throw new NotFoundError('Shipping not available');
    }
    await this.cache.setValue(key, cost);
    return cost;
  }
}
