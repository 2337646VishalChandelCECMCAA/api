const { createClient } = require('redis');

const redisUrl = process.env.REDIS_URL;
const isProd = process.env.NODE_ENV === 'production';
const isLocalRedis = redisUrl && /127\.0\.0\.1|localhost/.test(redisUrl);
const redisEnabled = redisUrl && !(isProd && isLocalRedis);

if (isProd && isLocalRedis) {
  console.warn('⚠️ REDIS_URL points to localhost in production, cache disabled');
}

const client = createClient({
  url: redisUrl || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Stop retrying quickly so local dev can continue without Redis.
      if (retries > 3) {
        return false;
      }

      return Math.min(retries * 100, 500);
    }
  }
});

let redisReady = false;
let hasLoggedError = false;

client.on('ready', () => {
  redisReady = true;
  hasLoggedError = false;
  console.log('Redis connected');
});

client.on('end', () => {
  redisReady = false;
});

client.on('error', (err) => {
  redisReady = false;

  if (!hasLoggedError) {
    console.warn('⚠️ Redis unavailable, continuing without cache');
    hasLoggedError = true;
  }
});

const connectRedis = async () => {
  if (!redisEnabled) {
    return;
  }

  try {
    if (!client.isOpen) {
      await client.connect();
    }
  } catch (error) {
    redisReady = false;

    if (!hasLoggedError) {
      console.warn('⚠️ Redis unavailable, continuing without cache');
      hasLoggedError = true;
    }
  }
};

const isRedisReady = () => redisEnabled && client.isReady && redisReady;

module.exports = {
  client,
  connectRedis,
  isRedisReady
};