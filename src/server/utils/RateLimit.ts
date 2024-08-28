import RateLimit from 'express-rate-limit';

export const RateLimiter = {
  /**
   * Creates a rate limiter for sign-in routes
   */
  limitSignInRates() {
    // delayMs: 0 disable delaying - full speed until the max limit is reached
    return new RateLimit({
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 100 // limit each IP to 10 createAccount/login requests per windowMs
    });
  },

  /**
   * Rate limiter for public routes
   */
  publicRates() {
    return new RateLimit({
      windowMs: 5 * 60 * 1000, // 15 minutes
      max: 300 // limit each IP to 300 requests per windowMs
    });
  }
};
