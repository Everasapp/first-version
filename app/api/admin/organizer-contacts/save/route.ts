import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import type {
  ContactFieldKey,
  FoundContactItem,
  OrganizerDirectorySources,
} from "@/src/lib/admin/organizer-directory";

export const runtime = "nodejs";

type SaveBody = {
  name?: string;
  website?: string;
  items?: FoundContactItem[];
};

function firstSelected(
  items: FoundContactItem[],
  field: FoundContactItem["field"],
) {
  return items.find(
    (item) =>
      item.field === field &&
      item.selected &&
      item.value &&
      item.value !== "Non trovato",
  );
}

function collectValues(
  items: FoundContactItem[],
  field: FoundContactItem["field"],
) {
  return items.filter(
    (item) =>
      item.field === field &&
      item.selected &&
      item.value &&
      item.value !== "Non trovato",
  );
}

function joinValues(items: FoundContactItem[]) {
  if (items.length === 0) return null;
  return items.map((i) => i.value).join("; ");
}

function buildSources(items: FoundContactItem[]): OrganizerDirectorySources {
  const sources: OrganizerDirectorySources = {};

  for (const item of items) {
    if (!item.selected || !item.value || item.value === "Non trovato") continue;

    const key: ContactFieldKey =
      item.field === "email_generale" ? "email" : (item.field as ContactFieldKey);

    const entry = { value: item.value, sourceUrl: item.sourceUrl || "" };
    const existing = sources[key];
    if (!existing) {
      sources[key] = entry;
    } else if (Array.isArray(existing)) {
      existing.push(entry);
    } else {
      sources[key] = [existing, entry];
    }
  }

  return sources;
}

export async function POST(request: Request) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  let body: SaveBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body JSON non valido" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";
  const items = Array.isArray(body.items) ? body.items : [];

  if (!name) {
    return NextResponse.json(
      { error: "Nome organizzatore obbligatorio" },
      { status: 400 },
    );
  }

  const selected = items.filter(
    (item) => item.selected && item.value && item.value !== "Non trovato",
  );

  if (selected.length === 0) {
    return NextResponse.json(
      { error: "Seleziona almeno un contatto da salvare" },
      { status: 400 },
    );
  }

  const row = {
    name,
    website: website || null,
    email: joinValues(collectValues(items, "email_generale")),
    pec: joinValues(collectValues(items, "pec")),
    phone: joinValues(collectValues(items, "phone")),
    address: joinValues(collectValues(items, "address")),
    facebook: firstSelected(items, "facebook")?.value ?? null,
    instagram: firstSelected(items, "instagram")?.value ?? null,
    email_cultura: joinValues(collectValues(items, "email_cultura")),
    email_turismo: joinValues(collectValues(items, "email_turismo")),
    email_eventi: joinValues(collectValues(items, "email_eventi")),
    claim_status: "unclaimed" as const,
    claimed_by_profile_id: null,
    sources: buildSources(items),
    created_by: auth.user.id,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await auth.supabase
    .from("organizer_directory")
    .insert(row)
    .select("id, name, claim_status")
    .single();

  if (error) {
    return NextResponse.json(
      { error: `Salvataggio fallito: ${error.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    organizer: data,
    message: "Organizzatore salvato come profilo non rivendicato",
  });
}
