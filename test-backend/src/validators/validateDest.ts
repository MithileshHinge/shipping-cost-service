import { CountryCode } from '../common/CountryCode';
import ValidationError from '../common/errors/ValidationError';

export default function validateDest(dest: any): Destination {
  if (!isTypeDest(dest)) throw new ValidationError('Invalid destination country');
  return dest;
}

function isTypeDest(dest: any): dest is Destination {
  return (typeof dest === 'string' && [CountryCode.INDIA, CountryCode.PAKISTAN, CountryCode.UK, CountryCode.USA, CountryCode.FRANCE, CountryCode.GERMANY].includes(dest as CountryCode));
}

export type Destination = CountryCode.INDIA |
  CountryCode.PAKISTAN |
  CountryCode.UK |
  CountryCode.USA |
  CountryCode.FRANCE |
  CountryCode.GERMANY |
  CountryCode.JAPAN |
  CountryCode.AUSTRALIA;
  
