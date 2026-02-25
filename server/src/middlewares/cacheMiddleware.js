 import NodeCache from 'node-cache';

// Cache 5 minutes ke liye valid rahega
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const cacheMiddleware = (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`⚡ Cache HIT: ${key}`);
    return res.status(200).json({
      ...cachedResponse,
      cached: true 
    });
  }

  console.log(`🐢 Cache MISS: ${key}`);
  
  res.originalJson = res.json;
  res.json = (body) => {
    // 🔥 FIX: Sirf successful responses cache karo (200-299 range)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, body);
    }
    res.originalJson(body);
  };

  next();
};

export const clearCache = () => {
  cache.flushAll();
  console.log("🧹 Cache Cleared!");
};