import { createClient } from "@/src/lib/supabase/server";
import {
  isSocialIntent,
  type CommunityPreviewPerson,
  type CommunitySummary,
  type EventRsvp,
} from "@/src/lib/community";

function parseJson(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function parseSummary(value: unknown): CommunitySummary {
  const parsed = parseJson(value);
  const row =
    parsed && typeof parsed === "object"
      ? (parsed as { going_count?: unknown; meet_count?: unknown })
      : null;
  return {
    goingCount: Number(row?.going_count ?? 0) || 0,
    meetCount: Number(row?.meet_count ?? 0) || 0,
  };
}

function parsePreview(value: unknown): CommunityPreviewPerson[] {
  const parsed = parseJson(value);
  if (!Array.isArray(parsed)) return [];

  const people: CommunityPreviewPerson[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const userId = typeof row.user_id === "string" ? row.user_id : "";
    if (!userId) continue;
    const interests = Array.isArray(row.interests)
      ? row.interests.filter((entry): entry is string => typeof entry === "string")
      : [];
    people.push({
      userId,
      displayName:
        typeof row.display_name === "string" && row.display_name.trim()
          ? row.display_name.trim()
          : "Persona su Everas",
      avatarUrl:
        typeof row.avatar_url === "string" && row.avatar_url
          ? row.avatar_url
          : null,
      interests,
      socialIntent: isSocialIntent(String(row.social_intent ?? ""))
        ? (row.social_intent as EventRsvp["socialIntent"])
        : null,
      openToMeeting: Boolean(row.open_to_meeting),
    });
  }
  return people;
}

export async function getEventCommunitySummary(eventId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("event_community_summary", {
    p_event_id: eventId,
  });

  if (error) {
    console.error("[community] summary failed:", error.message);
    return { goingCount: 0, meetCount: 0 };
  }

  return parseSummary(data);
}

export async function getEventCommunityPreview(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase.rpc("event_community_preview", {
    p_event_id: eventId,
  });

  if (error) {
    console.error("[community] preview failed:", error.message);
    return [];
  }

  return parsePreview(data);
}

export async function getCurrentUserRsvp(eventId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("event_rsvps")
    .select("event_id, user_id, status, social_intent")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("[community] own RSVP failed:", error.message);
    return null;
  }

  if (!data) return null;

  return {
    eventId: data.event_id as string,
    userId: data.user_id as string,
    status: "going" as const,
    socialIntent: isSocialIntent(String(data.social_intent ?? ""))
      ? data.social_intent
      : null,
  } satisfies EventRsvp;
}
