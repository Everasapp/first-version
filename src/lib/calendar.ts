import { createClient } from "@/src/lib/supabase/server";

export async function getCalendarEventIds(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("calendar_events")
    .select("event_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Impossibile caricare il calendario: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.event_id as string));
}

export async function getCurrentUserCalendarEventIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Set<string>();
  }

  return getCalendarEventIds(user.id);
}

export type CalendarEventListItem = {
  calendarId: string;
  addedAt: string;
  id: string;
  slug: string;
  title: string;
  category: string;
  categories?: string[] | null;
  municipality: string;
  location_name: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  is_free: boolean;
  price_from: number | string | null;
};

export async function getCalendarEvents(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("calendar_events")
    .select(
      `
      id,
      created_at,
      events (
        id,
        slug,
        title,
        category,
        categories,
        municipality,
        location_name,
        start_at,
        end_at,
        image_url,
        is_free,
        price_from,
        status
      )
    `,
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Impossibile caricare il calendario: ${error.message}`);
  }

  const items: CalendarEventListItem[] = [];

  for (const row of data ?? []) {
    const event = Array.isArray(row.events) ? row.events[0] : row.events;
    if (!event || event.status !== "published") {
      continue;
    }

    items.push({
      calendarId: row.id as string,
      addedAt: row.created_at as string,
      id: event.id as string,
      slug: event.slug as string,
      title: event.title as string,
      category: event.category as string,
      categories: (event.categories as string[] | null) ?? null,
      municipality: event.municipality as string,
      location_name: event.location_name as string | null,
      start_at: event.start_at as string,
      end_at: event.end_at as string | null,
      image_url: event.image_url as string | null,
      is_free: Boolean(event.is_free),
      price_from: event.price_from as number | string | null,
    });
  }

  // Sort by event start date ascending for calendar view
  return items.sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
  );
}
