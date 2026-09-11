import type { SupabaseClient } from "@supabase/supabase-js";

import { createSlug } from "@/src/lib/slug";

type RecurringSundaySeries = {
  key: string;
  title: string;
  description: string;
  category: string;
  categories: string[];
  province: string;
  municipality: string;
  locationName: string;
  address: string;
  imageUrl: string;
  isFree: boolean;
  ticketUrl: string | null;
  organizerDisplayName: string;
  organizerDirectoryId: string | null;
  /** Profile that owns the event (organizer account). */
  organizerId: string;
  /** Hour and minute in Europe/Rome. */
  timeRome: { hour: number; minute: number };
  /** How many upcoming Sundays to keep published. */
  weeksAhead: number;
};

/**
 * Series that should always have upcoming Sunday instances on Everas.
 * Seeded from the archived Solu a Deus sa Gloria celebration.
 */
export const RECURRING_SUNDAY_SERIES: RecurringSundaySeries[] = [
  {
    key: "solu-a-deus-sa-gloria-domenicale",
    title:
      "Chiesa Cristiana Solu a Deus sa Gloria - Celebrazione Domenicale",
    description: `In un tempo in cui le sfide della vita sembrano sopraffarci, Dio ci invita a ritrovare forza in Lui. Non siamo soli nel nostro cammino: c’è una speranza che rinnova, una Parola che solleva, una Presenza che consola.

È quando ci fermiamo alla Sua presenza che scopriamo che c’è molto di più: c’è pace, guarigione, direzione.

💬 Ti invitiamo a connetterti con noi per la diretta sulla nostra pagina!
Sarà un tempo di adorazione, riflessione e ascolto della Parola di Dio.
Preparati ad essere incoraggiato, sfidato e riempito dal Suo amore.
---
𝗦𝗼𝗹𝘂 𝗮 𝗗𝗲𝘂𝘀 𝘀𝗮 𝗚𝗹𝗼𝗿𝗶𝗮 è una chiesa che crede in Gesù, una chiesa che ama Dio e le persone. 💒👏🏻
🟢 𝗛𝗮𝗶 𝗯𝗶𝘀𝗼𝗴𝗻𝗼 𝗱𝗶 𝗽𝗿𝗲𝗴𝗵𝗶𝗲𝗿𝗮?
Contattaci, siamo a tua disposizione!
►𝗧𝗲𝗹/𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽: 3347426783

►Tutti i nostri recapiti: https://linktr.ee/soluadeussagloria
🙏 𝗩𝘂𝗼𝗶 𝗮𝗽𝗽𝗿𝗼𝗳𝗼𝗻𝗱𝗶𝗿𝗲 𝗶𝗹 𝗺𝗲𝘀𝘀𝗮𝗴𝗴𝗶𝗼 𝗱'𝗮𝗺𝗼𝗿𝗲 𝗱𝗶 𝗚𝗲𝘀𝘂̀?
►𝗲𝗺𝗮𝗶𝗹: CorsoConGesu@gmail.com

📌 𝗩𝘂𝗼𝗶 𝗽𝗮𝗿𝘁𝗲𝗰𝗶𝗽𝗮𝗿𝗲 𝗮𝗹𝗹𝗮 𝗽𝗿𝗼𝘀𝘀𝗶𝗺𝗮 𝗰𝗲𝗹𝗲𝗯𝗿𝗮𝘇𝗶𝗼𝗻𝗲 𝗶𝗻 𝗰𝗵𝗶𝗲𝘀𝗮?
► Sassari - Via Caniga 29/b, ogni domenica alle 10:30.
Puoi portare con te chi vuoi, l'ingresso è libero.`,
    category: "celebrazioni",
    categories: ["celebrazioni", "famiglie-bambini"],
    province: "SS",
    municipality: "Sassari",
    locationName: "Via Caniga 29",
    address: "Via Caniga 29/b, Sassari",
    imageUrl:
      "https://pxybrwkbbcghegcezxbn.supabase.co/storage/v1/object/public/event-images/53d3a2cf-e803-40b9-b5c1-59d80e42f316/solu-a-deus-sa-gloria-celebrazione-domenicale-mt0eye2p-mt0eyguj-02099a6d.webp",
    isFree: true,
    ticketUrl: "https://linktr.ee/soluadeussagloria",
    organizerDisplayName: "Chiesa Cristiana Solu a Deus sa Gloria",
    organizerDirectoryId: "11c977f7-f177-4897-b23b-271457f7be82",
    organizerId: "53d3a2cf-e803-40b9-b5c1-59d80e42f316",
    timeRome: { hour: 10, minute: 30 },
    weeksAhead: 16,
  },
];

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

/** Civil YYYY-MM-DD in Europe/Rome for an instant. */
function romeDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day + days, 12, 0, 0));
  return utc.toISOString().slice(0, 10);
}

/** 0 = Sunday … 6 = Saturday for a civil date key. */
function weekdayOfDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 12, 0, 0)).getUTCDay();
}

/**
 * Build timestamptz ISO for a Rome local civil date + time.
 * Uses EU DST: last Sunday of March → last Sunday of October (exclusive of end Sunday).
 */
function isRomeDaylightSaving(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  if (month < 3 || month > 10) return false;
  if (month > 3 && month < 10) return true;

  const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
  let lastSunday = lastDay;
  while (new Date(Date.UTC(year, month - 1, lastSunday)).getUTCDay() !== 0) {
    lastSunday -= 1;
  }

  if (month === 3) return day >= lastSunday;
  return day < lastSunday;
}

function buildRomeStartAt(dateKey: string, hour: number, minute: number) {
  const offset = isRomeDaylightSaving(dateKey) ? "+02:00" : "+01:00";
  return `${dateKey}T${pad2(hour)}:${pad2(minute)}:00${offset}`;
}

function recurrenceSourceUrl(seriesKey: string, dateKey: string) {
  return `everas://recurring/${seriesKey}/${dateKey}`;
}

/** Next `count` Sundays on/after today (Europe/Rome), including today if Sunday. */
export function upcomingSundayDateKeys(count: number, now = new Date()) {
  const keys: string[] = [];
  let cursor = romeDateKey(now);

  for (let guard = 0; keys.length < count && guard < 400; guard += 1) {
    if (weekdayOfDateKey(cursor) === 0) {
      keys.push(cursor);
    }
    cursor = addDaysToDateKey(cursor, 1);
  }

  return keys;
}

export async function ensureRecurringSundayEvents({
  supabase,
  adminUserId,
  now = new Date(),
}: {
  supabase: SupabaseClient;
  adminUserId: string;
  now?: Date;
}) {
  const created: Array<{ title: string; start_at: string; source_url: string }> =
    [];
  const skipped: Array<{ source_url: string; reason: string }> = [];

  for (const series of RECURRING_SUNDAY_SERIES) {
    const dateKeys = upcomingSundayDateKeys(series.weeksAhead, now);

    for (const dateKey of dateKeys) {
      const sourceUrl = recurrenceSourceUrl(series.key, dateKey);
      const { data: existing, error: lookupError } = await supabase
        .from("events")
        .select("id")
        .eq("source_url", sourceUrl)
        .maybeSingle();

      if (lookupError) {
        throw new Error(lookupError.message);
      }
      if (existing?.id) {
        skipped.push({ source_url: sourceUrl, reason: "già presente" });
        continue;
      }

      const startAt = buildRomeStartAt(
        dateKey,
        series.timeRome.hour,
        series.timeRome.minute,
      );
      const slug = `${createSlug(series.title)}-${dateKey}`;
      const nowIso = new Date().toISOString();

      const { data, error } = await supabase
        .from("events")
        .insert({
          organizer_id: series.organizerId,
          created_by: adminUserId,
          title: series.title,
          slug,
          description: series.description,
          category: series.category,
          categories: series.categories,
          province: series.province,
          municipality: series.municipality,
          location_name: series.locationName,
          address: series.address,
          start_at: startAt,
          end_at: null,
          image_url: series.imageUrl,
          is_free: series.isFree,
          price_from: null,
          price: 0,
          ticket_url: series.ticketUrl,
          organizer_display_name: series.organizerDisplayName,
          organizer_directory_id: series.organizerDirectoryId,
          source_url: sourceUrl,
          source_name: "Ricorrenza Everas",
          imported_at: nowIso,
          imported_by: adminUserId,
          import_method: "manual",
          verification_status: "verified",
          last_verified_at: nowIso,
          status: "published",
          is_featured: false,
        })
        .select("title, start_at, source_url")
        .single();

      if (error) {
        throw new Error(error.message);
      }

      created.push({
        title: data.title as string,
        start_at: data.start_at as string,
        source_url: data.source_url as string,
      });
    }
  }

  return {
    createdCount: created.length,
    skippedCount: skipped.length,
    created,
    skipped,
  };
}
