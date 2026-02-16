import NodeCache from 'node-cache';

// Cache 5 minutes ke liye valid rahega
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

export const cacheMiddleware = (req, res, next) => {
  // Sirf GET requests ko cache karenge
  if (req.method !== 'GET') {
    return next();
  }

  // URL ko key ki tarah use karenge (e.g., /api/tools?category=ai)
  const key = req.originalUrl || req.url;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.log(`⚡ Cache HIT: ${key}`);
    return res.status(200).json({
      ...cachedResponse,
      cached: true // Client ko batane ke liye ki data cache se aaya hai
    });
  }

  console.log(`🐢 Cache MISS: ${key}`);
  
  // Response bhejne se pehle usse cache mein save karne ka logic
  res.originalJson = res.json;
  res.json = (body) => {
    cache.set(key, body);
    res.originalJson(body);
  };

  next();
};

// Agar kabhi cache clear karna ho (e.g., naya tool add hone par)
export const clearCache = () => {
  cache.flushAll();
  console.log("🧹 Cache Cleared!");
};