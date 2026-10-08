export const PUBLISHED_EVENTS_CACHE_TAG = "published-events";

/**
 * Public event inventories change far less often than they are read.
 * Mutations explicitly invalidate this cache, so the TTL is mainly a safety net.
 */
export const PUBLISHED_EVENTS_CACHE_SECONDS = 15 * 60;
