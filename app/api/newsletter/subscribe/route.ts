import { NextResponse } from "next/server";

import { cities } from "@/src/data/cities";
import { createClient } from "@/src/lib/supabase/server";

export const runtime = "nodejs";

type SubscribeBody = {
  email?: unknown;
  city?: unknown;
};

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: SubscribeBody;

  try {
    body = (await request.json()) as SubscribeBody;
  } catch {
    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 },
    );
  }

  const email = asTrimmedString(body.email).toLowerCase();
  const city = asTrimmedString(body.city);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Inserisci un’email valida." },
      { status: 400 },
    );
  }

  const cityExists = cities.some((item) => item.city === city);
  if (!cityExists) {
    return NextResponse.json(
      { error: "Seleziona una città dalla lista." },
      { status: 400 },
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("subscribe_newsletter", {
    p_email: email,
    p_city: city,
    p_category: "",
  });

  if (error) {
    return NextResponse.json(
      { error: error.message || "Iscrizione non riuscita. Riprova." },
      { status: 400 },
    );
  }

  const status = typeof data === "string" ? data : "subscribed";

  return NextResponse.json({
    ok: true,
    status,
    message:
      status === "already"
        ? "Sei già iscritto con queste preferenze."
        : status === "updated"
          ? "Preferenze aggiornate. Riceverai la newsletter ogni settimana."
          : "Iscrizione completata. Riceverai la newsletter ogni settimana.",
  });
}
