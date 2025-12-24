export type RateLimitPolicy = { rpmPerKey: number; burst: number };
export const DefaultRateLimitPolicy: RateLimitPolicy = { rpmPerKey: 600, burst: 50 };
