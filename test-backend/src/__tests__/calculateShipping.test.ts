import CalculateShipping from '../CalculateShipping';
import { CountryCode } from '../common/CountryCode';
import NotFoundError from '../common/errors/NotFoundError';
import ValidationError from '../common/errors/ValidationError';

describe('Calculate Shipping use case unit tests', () => {
  const mockDataAccess = {
    lookupShippingCost: jest.fn(),
  };

  const mockEasyShip = {
    getShippingCost: jest.fn(),
  };

  const mockCache = {
    getValue: jest.fn(),
    setValue: jest.fn(),
  };

  const calculateShipping = new CalculateShipping(mockDataAccess, mockEasyShip, mockCache);

  beforeEach(() => {
    [...Object.values(mockDataAccess), ...Object.values(mockEasyShip), ...Object.values(mockCache)].forEach((mockMethod) => {
      mockMethod.mockClear();
    });
  });

  describe('Get shipping cost when source is India or Pakistan, and add to cache', () => {
    [CountryCode.INDIA, CountryCode.PAKISTAN].forEach((src) => {
      it(`Should return correct cost for src =${src}`, async () => {
        mockCache.getValue.mockResolvedValueOnce(null);
        mockDataAccess.lookupShippingCost.mockResolvedValueOnce(23);
        await expect(calculateShipping.calculate(src, CountryCode.UK, { length: 20, width: 20, height: 20, weight: 20 })).resolves.toEqual(23);
        expect(mockCache.getValue).toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
        expect(mockCache.setValue).toHaveBeenCalled();
      });
    });
  });

  it('Throw NotFoundError if shipping cost is not available in db', async () => {
    mockCache.getValue.mockResolvedValueOnce(null);
    mockDataAccess.lookupShippingCost.mockResolvedValueOnce(null);
    await expect(calculateShipping.calculate(CountryCode.INDIA, CountryCode.UK, { length: 20, width: 20, height: 20, weight: 20 })).rejects.toThrow(NotFoundError);
    expect(mockDataAccess.lookupShippingCost).toHaveBeenCalled();
  });

  it('Throw NotFoundError if shipping cost is not available from api', async () => {
    mockCache.getValue.mockResolvedValueOnce(null);
    mockEasyShip.getShippingCost.mockResolvedValueOnce(null);
    await expect(calculateShipping.calculate(CountryCode.USA, CountryCode.UK, { length: 20, width: 20, height: 20, weight: 20 })).rejects.toThrow(NotFoundError);
    expect(mockEasyShip.getShippingCost).toHaveBeenCalled();
  });

  describe('Get shipping cost when source is USA or Europe, and add to cache', () => {
    [CountryCode.USA, CountryCode.UK, CountryCode.FRANCE, CountryCode.GERMANY].forEach((src) => {
      it(`Should return correct cost for src=${src}`, async () => {
        mockCache.getValue.mockResolvedValueOnce(null);
        mockEasyShip.getShippingCost.mockResolvedValueOnce(23);
        await expect(calculateShipping.calculate(src, CountryCode.UK, { length: 20, width: 20, height: 20, weight: 20 })).resolves.toEqual(23);
        expect(mockCache.getValue).toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).toHaveBeenCalled();
        expect(mockCache.setValue).toHaveBeenCalled();
      });
    });
  });

  describe('Get shipping cost from cache if exists, without hitting DB or API', () => {
    [CountryCode.USA, CountryCode.INDIA].forEach((src) => {
      it(`Should return correct cost for src=${src}`, async () => {
        mockCache.getValue.mockResolvedValueOnce(23);
        await expect(calculateShipping.calculate(src, CountryCode.UK, { length: 20, width: 20, height: 20, weight: 20 })).resolves.toEqual(23);
        expect(mockCache.getValue).toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
        expect(mockCache.setValue).not.toHaveBeenCalled();
      });
    });
  });

  describe('Throw Validation error if source country is not India, Pakistan, USA, or in Europe', () => {
    [CountryCode.JAPAN, CountryCode.AUSTRALIA].forEach((src) => {
      it(`Should throw error for src=${src}`, async () => {
        await expect(calculateShipping.calculate(src, CountryCode.UK, { length: 20, width: 20, height: 20, weight: 20 })).rejects.toThrow(ValidationError);
        expect(mockCache.getValue).not.toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
      });
    });
  });

  describe('Throw Validation error if source country is not a valid country code', () => {
    ['BLAH', null, undefined, 123, true].forEach((src: any) => {
      it(`Should throw error for ${src}`, async () => {
        await expect(calculateShipping.calculate(src, CountryCode.UK, { length: 20, width: 20, height: 20, weight: 20 })).rejects.toThrow(ValidationError);
        expect(mockCache.getValue).not.toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
      });
    });
  });

  describe('Throw Validation error if destination is not a valid country code', () => {
    ['BLAH', null, undefined, 1245, true].forEach((dest: any) => {
      it(`Should throw error for ${dest}`, async () => {
        await expect(calculateShipping.calculate(CountryCode.UK, dest, { length: 20, width: 20, height: 20, weight: 20 })).rejects.toThrow(ValidationError);
        expect(mockCache.getValue).not.toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
      });
    });
  });

  describe('Throw Validation error if length is not a valid length', () => {
    ['20', true, undefined, null, -10, 0, 9].forEach((len: any) => {
      it(`Should throw error for ${len}`, async () => {
        await expect(calculateShipping.calculate(CountryCode.USA, CountryCode.UK, { length: len, width: 20, height: 20, weight: 20 })).rejects.toThrow(ValidationError);
        expect(mockCache.getValue).not.toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
      });
    });
  });

  describe('Throw Validation error if width is not a valid width', () => {
    ['20', true, undefined, null, -10, 0, 9].forEach((width: any) => {
      it(`Should throw error for ${width}`, async () => {
        await expect(calculateShipping.calculate(CountryCode.USA, CountryCode.UK, { length: 20, width, height: 20, weight: 20 })).rejects.toThrow(ValidationError);
        expect(mockCache.getValue).not.toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
      });
    });
  });

  describe('Throw Validation error if height is not a valid height', () => {
    ['20', true, undefined, null, -10, 0, 9].forEach((height: any) => {
      it(`Should throw error for ${height}`, async () => {
        await expect(calculateShipping.calculate(CountryCode.USA, CountryCode.UK, { length: 20, width: 20, height, weight: 20 })).rejects.toThrow(ValidationError);
        expect(mockCache.getValue).not.toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
      });
    });
  });

  describe('Throw Validation error if weight is not a valid weight', () => {
    ['20', true, undefined, null, -10, 0].forEach((weight: any) => {
      it(`Should throw error for ${weight}`, async () => {
        await expect(calculateShipping.calculate(CountryCode.USA, CountryCode.UK, { length: 20, width: 20, height: 20, weight })).rejects.toThrow(ValidationError);
        expect(mockCache.getValue).not.toHaveBeenCalled();
        expect(mockDataAccess.lookupShippingCost).not.toHaveBeenCalled();
        expect(mockEasyShip.getShippingCost).not.toHaveBeenCalled();
      });
    });
  });
});
