import _ from 'lodash';
import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    /**
     * Add additional properties on request object for logger purposes
     */
    interface Response {}
  }
}
interface ICacheOptions {
  type: 'public' | 'private';
  /**
   * The maximum amount of time in seconds that fetched responses are allowed
   * to be used again
   */
  maxAge?: number;
}

/**
 * Creates middleware for setting up cache headers
 * @param cacheOptions
 */
export function cacheControl(cacheOptions: ICacheOptions) {
  const maxAge = cacheOptions.maxAge ?? '7 days';
  // Caching profiles for public and private
  const cacheProfileMap = {
    public: `public, max-age=${maxAge}`,
    private: 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0'
  };

  const cachingProfile = cacheProfileMap[cacheOptions.type];

  return function cacheControlHeaders(req: Request, res: Response, next: NextFunction) {
    // apply caching profile
    if (cachingProfile) {
      res.set({ 'Cache-Control': cachingProfile });
    }

    next();
  };
}
