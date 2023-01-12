
import Redis from 'ioredis';
import CacheError from '../common/errors/CacheError';
import ICache from '../ICache';
import CacheConnection from './CacheConnection';

export default class Cache implements ICache {
  private redis: Redis;

  constructor(cacheConnection?: CacheConnection) {
    this.redis = cacheConnection ? cacheConnection.redis : (new CacheConnection()).redis;
  }

  async getValue(key: string): Promise<number | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      return parseFloat(value);
    } catch (err) {
      throw new CacheError('Could not get value from cache');
    }
  }
  
  async setValue(key: string, value: number): Promise<void> {
    try {
      await this.redis.set(key, value);
    } catch (err) {
      throw new CacheError('Could not set value into cache');
    }
  }
}
