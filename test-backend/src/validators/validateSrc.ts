import { CountryCode } from '../common/CountryCode';
import ValidationError from '../common/errors/ValidationError';

export default function validateSrc(src: any): Source {
  if (!isTypeSrc(src)) throw new ValidationError('Invalid source country');
  return src;
}

function isTypeSrc(src: any): src is Source {
  return (typeof src === 'string' && [CountryCode.INDIA, CountryCode.PAKISTAN, CountryCode.UK, CountryCode.USA, CountryCode.FRANCE, CountryCode.GERMANY].includes(src as CountryCode));
}

export type Source = CountryCode.INDIA |
  CountryCode.PAKISTAN |
  CountryCode.UK |
  CountryCode.USA |
  CountryCode.FRANCE |
  CountryCode.GERMANY;
