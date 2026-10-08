/** Best-effort cache invalidation after an authenticated client-side mutation. */
export async function requestPublishedEventsRevalidation(eventId: string) {
  try {
    const response = await fetch("/api/events/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });

    if (!response.ok) {
      console.error(
        `Cache eventi non invalidata (${response.status}): ${await response.text()}`,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Cache eventi non invalidata:", error);
    return false;
  }
}
