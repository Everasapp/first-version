import "server-only";

import { revalidateTag } from "next/cache";

import { PUBLISHED_EVENTS_CACHE_TAG } from "@/src/lib/seo/published-events-cache";

export function revalidatePublishedEvents() {
  revalidateTag(PUBLISHED_EVENTS_CACHE_TAG, { expire: 0 });
}
