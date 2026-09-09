/**
 * Importa in bozza eventi nuovi da SardegnaTurismo (descrizione completa + immagine).
 *
 *   npx tsx --env-file=.env.local scripts/import-sardegnaturismo-drafts.ts
 *   npx tsx --env-file=.env.local scripts/import-sardegnaturismo-drafts.ts --dry-run
 */
import { cities } from "../src/data/cities";
import { draftToEditable } from "../src/lib/admin/event-import";
import { extractEventFromUrl } from "../src/lib/admin/event-page-extractor";
import { normalizeEventCategories } from "../src/lib/event-categories";
import { optimizeImageToWebp } from "../src/lib/images/optimizeToWebp";
import { normalizeEventDescription } from "../src/lib/sanitizeHtml";
import { createSlug } from "../src/lib/slug";
import { createAdminClient } from "../src/lib/supabase/admin";

type Override = {
  url: string;
  category: string;
  municipality: string;
  locationName?: string;
  startDate: string;
  startTime?: string;
  endDate?: string;
  endTime?: string;
  organizerName?: string;
  isFree?: boolean;
};

/** Eventi della lista ST ancora assenti in Everas (verificati vs DB). */
const NEW_EVENTS: Override[] = [
  {
    url: "https://www.sardegnaturismo.it/it/eventi/festa-manna-di-gaddura",
    category: "sagre-tradizioni",
    municipality: "Luogosanto",
    locationName: "Basilica di Nostra Signora di Luogosanto",
    startDate: "2026-08-30",
    startTime: "18:00",
    endDate: "2026-09-15",
    endTime: "23:59",
    organizerName: "Fidali '82 Luogosanto",
    isFree: true,
  },
  {
    url: "https://www.sardegnaturismo.it/it/eventi/futurama",
    category: "arte-cultura",
    municipality: "Nuoro",
    locationName: "MAN - Museo d'Arte di Nuoro",
    startDate: "2026-07-04",
    startTime: "10:00",
    endDate: "2026-11-15",
    endTime: "19:00",
    organizerName: "MAN Museo d'Arte della Provincia di Nuoro",
    isFree: false,
  },
  {
    url: "https://www.sardegnaturismo.it/it/eventi/tutankhamon-la-tomba-il-tesoro-la-scoperta",
    category: "arte-cultura",
    municipality: "Cagliari",
    locationName: "Bastione di Saint Remy",
    startDate: "2026-02-28",
    startTime: "10:00",
    endDate: "2026-10-04",
    endTime: "20:00",
    organizerName: "Comune di Cagliari",
    isFree: false,
  },
  {
    url: "https://www.sardegnaturismo.it/it/eventi/maxi-yacht-rolex-cup",
    category: "sport-competizioni",
    municipality: "Arzachena",
    locationName: "Porto Cervo - Yacht Club Costa Smeralda",
    startDate: "2026-09-06",
    startTime: "09:00",
    endDate: "2026-09-12",
    endTime: "18:00",
    organizerName: "Yacht Club Costa Smeralda",
    isFree: true,
  },
];

function hasFlag(name: string) {
  return process.argv.includes(`--${name}`);
}

function buildStartAt(date: string, time: string) {
  const t = time && /^\d{2}:\d{2}$/.test(time) ? time : "00:00";
  const month = Number(date.slice(5, 7));
  const offset = month >= 4 && month <= 10 ? "+02:00" : "+01:00";
  return `${date}T${t}:00${offset}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadAndOptimizeImage(imageUrl: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20_000);
  try {
    const response = await fetch(imageUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: `${new URL(imageUrl).origin}/`,
      },
    });
    if (!response.ok) {
      throw new Error(`Download immagine fallito (${response.status})`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    return optimizeImageToWebp(buffer);
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const dryRun = hasFlag("dry-run");
  const supabase = createAdminClient();

  const { data: adminProfile, error: adminError } = await supabase
    .from("profiles")
    .select("id")
    .eq("role", "admin")
    .limit(1)
    .maybeSingle();

  if (adminError || !adminProfile?.id) {
    throw new Error("Nessun profilo admin trovato");
  }
  const adminUserId = adminProfile.id as string;

  const imported: Array<{ title: string; slug: string; municipality: string }> =
    [];
  const skipped: Array<{ title: string; url: string; reason: string }> = [];
  const errors: Array<{ title: string; url: string; error: string }> = [];

  for (const item of NEW_EVENTS) {
    process.stderr.write(`Analisi ${item.url}\n`);
    const extracted = await extractEventFromUrl(item.url);
    if (!extracted.ok || !extracted.draft) {
      skipped.push({
        title: item.url,
        url: item.url,
        reason: extracted.error || "analisi fallita",
      });
      continue;
    }

    const editable = draftToEditable(extracted.draft);
    editable.sourceUrl = item.url;
    editable.sourceName = "SardegnaTurismo";
    editable.municipality = item.municipality;
    editable.category = item.category;
    editable.categories = [item.category];
    if (item.locationName) editable.locationName = item.locationName;
    editable.startDate = item.startDate;
    if (item.startTime) editable.startTime = item.startTime;
    if (item.endDate) editable.endDate = item.endDate;
    if (item.endTime) editable.endTime = item.endTime;
    if (item.organizerName) editable.organizerName = item.organizerName;
    if (typeof item.isFree === "boolean") editable.isFree = item.isFree;
    editable.downloadImage = true;

    const cityRecord =
      cities.find(
        (c) => c.city.toLowerCase() === editable.municipality.toLowerCase(),
      ) || null;
    const province = editable.province.trim() || cityRecord?.province || "";
    if (!province) {
      skipped.push({
        title: editable.title,
        url: item.url,
        reason: `provincia mancante per ${editable.municipality}`,
      });
      continue;
    }
    editable.province = province;

    if (!editable.description.trim()) {
      skipped.push({
        title: editable.title,
        url: item.url,
        reason: "descrizione mancante",
      });
      continue;
    }
    if (!editable.imageUrl.trim()) {
      skipped.push({
        title: editable.title,
        url: item.url,
        reason: "immagine mancante",
      });
      continue;
    }

    const { data: existingBySource } = await supabase
      .from("events")
      .select("id, title, status")
      .eq("source_url", item.url)
      .maybeSingle();
    if (existingBySource) {
      skipped.push({
        title: editable.title,
        url: item.url,
        reason: `già presente: ${existingBySource.title}`,
      });
      continue;
    }

    if (dryRun) {
      imported.push({
        title: editable.title,
        slug: "(dry-run)",
        municipality: editable.municipality,
      });
      await sleep(250);
      continue;
    }

    let imageUrl = editable.imageUrl.trim();
    try {
      const webp = await downloadAndOptimizeImage(imageUrl);
      const slugBase = createSlug(editable.title) || "evento";
      const path = `imports/${adminUserId}/${slugBase}-${Date.now()}.webp`;
      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(path, webp, {
          contentType: "image/webp",
          upsert: false,
        });
      if (uploadError) throw new Error(uploadError.message);
      const { data: publicUrlData } = supabase.storage
        .from("event-images")
        .getPublicUrl(path);
      imageUrl = publicUrlData.publicUrl;
    } catch (error) {
      errors.push({
        title: editable.title,
        url: item.url,
        error:
          error instanceof Error
            ? `immagine: ${error.message}`
            : "immagine non scaricata",
      });
      continue;
    }

    const startAt = buildStartAt(editable.startDate, editable.startTime.trim());
    let endAt: string | null = null;
    if (editable.endDate.trim()) {
      endAt = buildStartAt(
        editable.endDate.trim(),
        editable.endTime.trim() || "23:59",
      );
    }

    const categorySlugs = normalizeEventCategories(
      editable.categories.length ? editable.categories : [editable.category],
    );
    const uniqueSlug = `${createSlug(editable.title) || "evento"}-${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();

    const { data, error } = await supabase
      .from("events")
      .insert({
        organizer_id: adminUserId,
        created_by: adminUserId,
        title: editable.title.trim(),
        slug: uniqueSlug,
        description: normalizeEventDescription(editable.description) || null,
        category: categorySlugs[0] || editable.category,
        categories: categorySlugs,
        subcategory: editable.subcategory.trim() || null,
        province,
        municipality: editable.municipality,
        location_name: editable.locationName.trim() || null,
        address: editable.address.trim() || editable.locationName.trim() || null,
        start_at: startAt,
        end_at: endAt,
        image_url: imageUrl,
        is_free: editable.isFree,
        price_from: null,
        price: 0,
        ticket_url: editable.ticketUrl.trim() || null,
        organizer_display_name: editable.organizerName.trim() || null,
        source_url: item.url,
        source_name: "SardegnaTurismo",
        imported_at: nowIso,
        imported_by: adminUserId,
        import_method: "url",
        verification_status: "pending_verification",
        last_verified_at: null,
        status: "pending",
        is_featured: false,
      })
      .select("id, slug, title, municipality")
      .single();

    if (error) {
      errors.push({
        title: editable.title,
        url: item.url,
        error: error.message,
      });
      continue;
    }

    await supabase.from("event_import_logs").insert({
      admin_id: adminUserId,
      event_id: data.id,
      source_url: item.url,
      source_name: "SardegnaTurismo",
      import_method: "url",
      status: "success",
      payload: { title: data.title, municipality: data.municipality, publish: false },
    });

    imported.push({
      title: data.title as string,
      slug: data.slug as string,
      municipality: data.municipality as string,
    });
    await sleep(300);
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        importedCount: imported.length,
        skippedCount: skipped.length,
        errorCount: errors.length,
        imported,
        skipped,
        errors,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
