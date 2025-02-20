import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};
let cleanupInterval: NodeJS.Timeout | null = null;

export const startCleanupInterval = () => {
  if (cleanupInterval) return;
  
  cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const ip in store) {
      if (now > store[ip].resetTime) {
        delete store[ip];
      }
    }
  }, 60000); // Clean up every minute

  // Don't keep the process alive
  cleanupInterval.unref();
};

export const stopCleanupInterval = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
  }
};

export const rateLimit = (
  windowMs: number = parseInt(process.env.RATE_LIMIT_WINDOW || '15') * 60 * 1000,
  maxRequests: number = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100')
) => {
  // Start cleanup if not in test environment
  if (process.env.NODE_ENV !== 'test') {
    startCleanupInterval();
  }

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    if (!store[clientIp]) {
      store[clientIp] = {
        count: 1,
        resetTime: now + windowMs
      };
      next();
      return;
    }

    if (now > store[clientIp].resetTime) {
      store[clientIp] = {
        count: 1,
        resetTime: now + windowMs
      };
      next();
      return;
    }

    if (store[clientIp].count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests, please try again later',
        resetTime: new Date(store[clientIp].resetTime)
      });
    }

    store[clientIp].count++;
    next();
  };
}; 