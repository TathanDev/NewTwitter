// Rate limiting configuration
// Limits API requests per IP address with different limits per endpoint

// Configuration des limites par type de route
const RATE_LIMITS = {
  // Recherche - plus strict car peut être appelé à chaque keystroke
  '/api/search': { windowMs: 60 * 1000, maxRequests: 30 },
  '/api/search/autocomplete': { windowMs: 60 * 1000, maxRequests: 30 },

  // Posts et feed - usage fréquent
  '/api/getPosts': { windowMs: 60 * 1000, maxRequests: 60 },
  '/api/posts': { windowMs: 60 * 1000, maxRequests: 60 },

  // Messages - usage modéré
  '/api/messages': { windowMs: 60 * 1000, maxRequests: 60 },
  '/api/messages/send': { windowMs: 60 * 1000, maxRequests: 20 },

  // Auth et user - moins frequent
  '/api/auth': { windowMs: 60 * 1000, maxRequests: 30 },
  '/api/user': { windowMs: 60 * 1000, maxRequests: 60 },

  // Autres API - limite par défaut
  'default': { windowMs: 60 * 1000, maxRequests: 100 }
};

// In-memory store for rate limiting
const rateLimitStore = new Map();

/**
 * Get rate limit config for a path
 */
function getRateLimitConfig(pathname) {
  // Check for exact match or prefix match
  for (const [key, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(key)) {
      return config;
    }
  }
  return RATE_LIMITS.default;
}

/**
 * Check if request should be rate limited
 * @param {string} identifier - IP address
 * @param {string} pathname - API path
 * @returns {object} - { allowed: boolean, remaining: number, resetTime: number, limit: number }
 */
export function checkRateLimit(identifier, pathname) {
  const config = getRateLimitConfig(pathname);
  const key = `${identifier}:${pathname}`;
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs
    });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
      limit: config.maxRequests
    };
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
      limit: config.maxRequests
    };
  }

  record.count++;
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
    limit: config.maxRequests
  };
}

/**
 * Get rate limit config for a path (useful for middleware)
 */
export function getConfigForPath(pathname) {
  return getRateLimitConfig(pathname);
}

/**
 * Clean up expired entries
 */
function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupRateLimitStore, 5 * 60 * 1000);

export { RATE_LIMITS };
