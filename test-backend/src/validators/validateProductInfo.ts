import ValidationError from '../common/errors/ValidationError';
import IProductInfo from '../common/IProductInfo';

export default function validateProductInfo(productInfo: any) {
  if (!isTypeProductInfo(productInfo)) throw new ValidationError('Invalid product info');
  Object.entries<any>(productInfo).forEach(([key, val]) => {
    if ((['length', 'width', 'height'].includes(key) && val < 10) || (key === 'weight' && val <= 0)) {
      throw new ValidationError('Invalid product info');
    }
  });
  return productInfo;
}

function isTypeProductInfo(productInfo: any): productInfo is IProductInfo {
  return typeof productInfo === 'object' && Object.entries<any>(productInfo).every(([key, val]) => {
    return ['length', 'width', 'height', 'weight'].includes(key) && typeof val === 'number';
  });
}
