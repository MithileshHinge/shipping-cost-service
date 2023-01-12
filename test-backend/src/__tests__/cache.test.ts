import { randomUUID } from 'crypto';
import Cache from '../cache/Cache';
import CacheConnection from '../cache/CacheConnection';

describe('Cache unit tests', () => {
  const cacheConnection = new CacheConnection();
  const cache = new Cache(cacheConnection);

  afterAll(async () => {
    await cacheConnection.close();
  });
  it('Can get value from cache if exists', async () => {
    const key = randomUUID();
    await cacheConnection.redis.set(key, 23);
    await expect(cache.getValue(key)).resolves.toBeCloseTo(23);
  });

  it('Return null if key does not exist', async () => {
    const key = randomUUID();
    await expect(cache.getValue(key)).resolves.toBeNull();
  });

  it('Can set value into cache', async () => {
    const key = randomUUID();
    await expect(cache.setValue(key, 23)).resolves.not.toThrowError();
    const value = await cacheConnection.redis.get(key);
    expect(value).not.toBeNull();
    expect(parseFloat(value!)).toBeCloseTo(23);
  });
});
