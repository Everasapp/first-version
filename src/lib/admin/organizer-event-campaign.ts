import type { SupabaseClient } from "@supabase/supabase-js";

import { isValidCampaignEmail } from "@/src/lib/admin/email-campaigns";
import {
  isOutreachEmail,
  splitEmailField,
} from "@/src/lib/admin/export-emails";
import { getSiteUrl } from "@/src/lib/notifications/config";

const SKIP_COMUNE_DIRECTORY_NAMES = new Set([
  "Comune di Oristano",
  "Comune di Stintino",
]);

/** Comuni inseriti in rubrica senza prefisso "Comune di". */
const MISCLASSIFIED_COMUNE_NAMES = new Set(["Seneghe", "Villanovaforru"]);

const COMUNE_EVENT_OVERRIDES: Record<string, { slug: string; title: string }> =
  {
    "Comune di Sassari": {
      slug: "festival-city-city-sassari-2026-draft",
      title: "Festival City&City 2026",
    },
    "Comune di Nuoro": {
      slug: "notte-bianca-nuoro-2026-draft",
      title: "Notte Bianca Nuoro 2026",
    },
  };

export type OrganizerEventCampaignRecipient = {
  name: string;
  email: string;
  events: Array<{ title: string; slug: string; url: string }>;
};

export type OrganizerEventCampaignSkipped = {
  name: string;
  reason: string;
};

type DirectoryRow = {
  id: string;
  name: string;
  email: string | null;
};

type EventRow = {
  organizer_directory_id: string;
  title: string;
  slug: string;
  start_at: string | null;
};

function publicEventUrl(slug: string) {
  return `${getSiteUrl()}/eventi/${slug}`;
}

export function isComuneDirectoryName(name: string) {
  return name.startsWith("Comune di ");
}

export function isExternalOrganizerDirectoryName(name: string) {
  if (isComuneDirectoryName(name)) return false;
  if (MISCLASSIFIED_COMUNE_NAMES.has(name)) return false;
  if (/^pro\s*loco/i.test(name)) return false;
  if (name.startsWith("Unione ")) return false;
  return true;
}

function pickComuneEmail(raw: string | null | undefined) {
  const parts = splitEmailField(raw);
  if (parts.length === 0) return null;
  if (parts.length > 3) return null;

  const preferred = parts.find(
    (email) =>
      isValidCampaignEmail(email) &&
      isOutreachEmail(email) &&
      !email.includes("legalmail"),
  );
  if (preferred) return preferred;

  return (
    parts.find((email) => isValidCampaignEmail(email) && isOutreachEmail(email)) ||
    null
  );
}

function pickExternalOrganizerEmail(raw: string | null | undefined) {
  const parts = splitEmailField(raw);
  if (parts.length === 0) return null;

  const preferred = parts.find(
    (email) => isValidCampaignEmail(email) && isOutreachEmail(email),
  );
  return preferred || null;
}

function sortEventsForCampaign(events: EventRow[], nowMs: number) {
  const dated = events.filter((event) => event.start_at);
  const undated = events.filter((event) => !event.start_at);

  const upcoming = dated
    .filter((event) => new Date(event.start_at as string).getTime() >= nowMs)
    .sort(
      (a, b) =>
        new Date(a.start_at as string).getTime() -
        new Date(b.start_at as string).getTime(),
    );
  const past = dated
    .filter((event) => new Date(event.start_at as string).getTime() < nowMs)
    .sort(
      (a, b) =>
        new Date(b.start_at as string).getTime() -
        new Date(a.start_at as string).getTime(),
    );

  return [...upcoming, ...past, ...undated];
}

function pickEvents(
  name: string,
  events: EventRow[],
  nowMs: number,
  overrides: Record<string, { slug: string; title: string }>,
): EventRow[] {
  if (events.length === 0) return [];

  const override = overrides[name];
  if (override) {
    const found = events.find((event) => event.slug === override.slug);
    if (found) {
      const prioritized = {
        ...found,
        title: override.title,
        slug: override.slug,
      };
      const rest = events.filter((event) => event.slug !== override.slug);
      return [prioritized, ...sortEventsForCampaign(rest, nowMs)];
    }
  }

  return sortEventsForCampaign(events, nowMs);
}

function dedupeEvents(events: EventRow[]) {
  const seen = new Set<string>();
  const unique: EventRow[] = [];
  for (const event of events) {
    const slug = event.slug?.trim();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    unique.push(event);
  }
  return unique;
}

function mergeRecipientEvents(
  current: OrganizerEventCampaignRecipient["events"],
  incoming: OrganizerEventCampaignRecipient["events"],
) {
  const seen = new Set(current.map((event) => event.slug));
  const merged = [...current];
  for (const event of incoming) {
    if (seen.has(event.slug)) continue;
    seen.add(event.slug);
    merged.push(event);
  }
  return merged;
}

async function loadAlreadyContactedEmails(supabase: SupabaseClient) {
  const { data: campaigns, error: campaignError } = await supabase
    .from("email_campaigns")
    .select("id")
    .ilike("subject", "%rivendicate%");

  if (campaignError) {
    throw new Error(campaignError.message);
  }

  const campaignIds = (campaigns || []).map((row) => row.id as string);
  if (campaignIds.length === 0) return new Set<string>();

  const { data: recipients, error: recipientError } = await supabase
    .from("email_campaign_recipients")
    .select("email")
    .in("campaign_id", campaignIds);

  if (recipientError) {
    throw new Error(recipientError.message);
  }

  return new Set(
    (recipients || [])
      .map((row) =>
        typeof row.email === "string" ? row.email.trim().toLowerCase() : "",
      )
      .filter(Boolean),
  );
}

async function listDirectoryEventCampaignRecipients(
  supabase: SupabaseClient,
  options: {
    includeName: (name: string) => boolean;
    pickEmail: (raw: string | null | undefined) => string | null;
    eventOverrides: Record<string, { slug: string; title: string }>;
    skipNames?: Set<string>;
  },
): Promise<{
  recipients: OrganizerEventCampaignRecipient[];
  skipped: OrganizerEventCampaignSkipped[];
}> {
  const alreadyContacted = await loadAlreadyContactedEmails(supabase);

  const { data: directoryRows, error: directoryError } = await supabase
    .from("organizer_directory")
    .select("id, name, email");

  if (directoryError) {
    throw new Error(directoryError.message);
  }

  const directory = ((directoryRows || []) as DirectoryRow[]).filter((row) =>
    options.includeName(row.name),
  );
  const directoryIds = directory.map((row) => row.id);

  if (directoryIds.length === 0) {
    return { recipients: [], skipped: [] };
  }

  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("organizer_directory_id, title, slug, start_at")
    .eq("status", "published")
    .in("organizer_directory_id", directoryIds);

  if (eventsError) {
    throw new Error(eventsError.message);
  }

  const eventsByDirectory = new Map<string, EventRow[]>();
  for (const event of (events || []) as EventRow[]) {
    if (!event.organizer_directory_id || !event.slug?.trim()) continue;
    const list = eventsByDirectory.get(event.organizer_directory_id) || [];
    list.push(event);
    eventsByDirectory.set(event.organizer_directory_id, list);
  }

  const nowMs = Date.now();
  const recipientsByEmail = new Map<
    string,
    OrganizerEventCampaignRecipient & { names: Set<string> }
  >();
  const skipped: OrganizerEventCampaignSkipped[] = [];

  for (const row of directory.sort((a, b) =>
    a.name.localeCompare(b.name, "it"),
  )) {
    const organizerEvents = eventsByDirectory.get(row.id) || [];
    if (organizerEvents.length === 0) continue;

    if (options.skipNames?.has(row.name)) {
      skipped.push({
        name: row.name,
        reason: "già contattato con la campagna di rivendicazione",
      });
      continue;
    }

    const events = dedupeEvents(
      pickEvents(row.name, organizerEvents, nowMs, options.eventOverrides),
    );
    if (events.length === 0) continue;

    const email = options.pickEmail(row.email);
    if (!email) {
      skipped.push({
        name: row.name,
        reason: "nessuna email utilizzabile",
      });
      continue;
    }

    if (alreadyContacted.has(email)) {
      skipped.push({
        name: row.name,
        reason: `già contattato (${email})`,
      });
      continue;
    }

    const mappedEvents = events.map((event) => ({
      title: event.title,
      slug: event.slug,
      url: publicEventUrl(event.slug),
    }));

    const existing = recipientsByEmail.get(email);
    if (existing) {
      existing.names.add(row.name);
      existing.events = mergeRecipientEvents(existing.events, mappedEvents);
      existing.name = Array.from(existing.names)
        .sort((a, b) => a.localeCompare(b, "it"))
        .join(" · ");
      continue;
    }

    recipientsByEmail.set(email, {
      name: row.name,
      email,
      events: mappedEvents,
      names: new Set([row.name]),
    });
  }

  const recipients = Array.from(recipientsByEmail.values()).map(
    ({ names: _names, ...recipient }) => recipient,
  );

  return { recipients, skipped };
}

export async function listComuneEventCampaignRecipients(
  supabase: SupabaseClient,
) {
  return listDirectoryEventCampaignRecipients(supabase, {
    includeName: isComuneDirectoryName,
    pickEmail: pickComuneEmail,
    eventOverrides: COMUNE_EVENT_OVERRIDES,
    skipNames: SKIP_COMUNE_DIRECTORY_NAMES,
  });
}

export async function listExternalOrganizerEventCampaignRecipients(
  supabase: SupabaseClient,
) {
  return listDirectoryEventCampaignRecipients(supabase, {
    includeName: isExternalOrganizerDirectoryName,
    pickEmail: pickExternalOrganizerEmail,
    eventOverrides: {},
  });
}
