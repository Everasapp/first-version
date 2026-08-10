import { createClient } from "@/src/lib/supabase/server";

export type FollowedOrganizer = {
  followId: string;
  followedAt: string;
  id: string;
  full_name: string | null;
  business_name: string | null;
  municipality: string | null;
  province: string | null;
  avatar_url: string | null;
  publishedEventsCount: number;
};

export async function getFollowedOrganizerIds(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizer_follows")
    .select("organizer_id")
    .eq("follower_id", userId);

  if (error) {
    throw new Error(`Impossibile caricare i follow: ${error.message}`);
  }

  return new Set((data ?? []).map((row) => row.organizer_id as string));
}

export async function getCurrentUserFollowedOrganizerIds() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Set<string>();
  }

  return getFollowedOrganizerIds(user.id);
}

export async function isFollowingOrganizer(
  userId: string,
  organizerId: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizer_follows")
    .select("id")
    .eq("follower_id", userId)
    .eq("organizer_id", organizerId)
    .maybeSingle();

  if (error) {
    throw new Error(`Impossibile verificare il follow: ${error.message}`);
  }

  return Boolean(data);
}

export function getOrganizerDisplayName(organizer: {
  business_name: string | null;
  full_name: string | null;
}) {
  return (
    organizer.business_name?.trim() ||
    organizer.full_name?.trim() ||
    "Organizzatore"
  );
}

export async function getFollowedOrganizers(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("organizer_follows")
    .select(
      `
      id,
      created_at,
      profiles:organizer_id (
        id,
        full_name,
        business_name,
        municipality,
        province,
        avatar_url,
        role
      )
    `,
    )
    .eq("follower_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Impossibile caricare gli organizzatori: ${error.message}`);
  }

  const rows = data ?? [];
  const organizerIds = rows
    .map((row) => {
      const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
      return profile?.id as string | undefined;
    })
    .filter((id): id is string => Boolean(id));

  const counts = new Map<string, number>();

  if (organizerIds.length > 0) {
    const { data: eventRows } = await supabase
      .from("events")
      .select("organizer_id")
      .eq("status", "published")
      .in("organizer_id", organizerIds);

    for (const row of eventRows ?? []) {
      const id = row.organizer_id as string;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  const organizers: FollowedOrganizer[] = [];

  for (const row of rows) {
    const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
    if (!profile) {
      continue;
    }

    organizers.push({
      followId: row.id as string,
      followedAt: row.created_at as string,
      id: profile.id as string,
      full_name: profile.full_name as string | null,
      business_name: profile.business_name as string | null,
      municipality: profile.municipality as string | null,
      province: profile.province as string | null,
      avatar_url: profile.avatar_url as string | null,
      publishedEventsCount: counts.get(profile.id as string) ?? 0,
    });
  }

  return organizers;
}
