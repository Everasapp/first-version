import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  getOrderById,
  requestAdvertisingChanges,
} from "@/src/lib/ads/orders";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  let body: { note?: string };
  try {
    body = (await request.json()) as { note?: string };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const note = body.note?.trim();
  if (!note) {
    return NextResponse.json(
      { error: "Inserisci una nota per le modifiche richieste." },
      { status: 400 },
    );
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
  }

  try {
    const updated = await requestAdvertisingChanges(order, note);
    return NextResponse.json({ ok: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Richiesta modifiche non riuscita.",
      },
      { status: 400 },
    );
  }
}
