import Redis from 'ioredis';
import { CACHE_CONFIG } from '../config';

export default class CacheConnection {
  public redis: Redis;

  constructor() {
    this.redis = new Redis({
			port: CACHE_CONFIG.REDIS_PORT,
			host: CACHE_CONFIG.REDIS_HOST,
			password: CACHE_CONFIG.REDIS_PASSWORD,
		});
  }

  async close() {
    await this.redis.quit();
  }
}
