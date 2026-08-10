import { createClient } from "@/src/lib/supabase/server";

export async function getFavoriteEventIds(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("event_favorites")
    .select("event_id")
    .eq("user_id", userId);

  if (error) {
    throw new Error(`Impossibile caricare i preferiti: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.event_id as string));
}

export async function getCurrentUserFavoriteIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Set<string>();
  }

  return getFavoriteEventIds(user.id);
}

export type FavoriteEventListItem = {
  favoriteId: string;
  favoritedAt: string;
  id: string;
  slug: string;
  title: string;
  category: string;
  municipality: string;
  location_name: string | null;
  start_at: string;
  end_at: string | null;
  image_url: string | null;
  is_free: boolean;
  price_from: number | string | null;
};

export async function getFavoriteEvents(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("event_favorites")
    .select(
      `
      id,
      created_at,
      events (
        id,
        slug,
        title,
        category,
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
    throw new Error(`Impossibile caricare i preferiti: ${error.message}`);
  }

  const items: FavoriteEventListItem[] = [];

  for (const row of data ?? []) {
    const event = Array.isArray(row.events) ? row.events[0] : row.events;
    if (!event || event.status !== "published") {
      continue;
    }

    items.push({
      favoriteId: row.id as string,
      favoritedAt: row.created_at as string,
      id: event.id as string,
      slug: event.slug as string,
      title: event.title as string,
      category: event.category as string,
      municipality: event.municipality as string,
      location_name: event.location_name as string | null,
      start_at: event.start_at as string,
      end_at: event.end_at as string | null,
      image_url: event.image_url as string | null,
      is_free: Boolean(event.is_free),
      price_from: event.price_from as number | string | null,
    });
  }

  return items;
}
