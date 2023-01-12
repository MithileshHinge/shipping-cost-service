export const SERVER_CONFIG = {
	PORT: 3000,
};

export const CACHE_CONFIG = {
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
	REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
}
