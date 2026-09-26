import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  getOrderById,
  rejectAdvertisingOrder,
} from "@/src/lib/ads/orders";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  let body: { reason?: string };
  try {
    body = (await request.json()) as { reason?: string };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const reason = body.reason?.trim();
  if (!reason) {
    return NextResponse.json(
      { error: "Inserisci una motivazione del rifiuto." },
      { status: 400 },
    );
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
  }

  try {
    const updated = await rejectAdvertisingOrder(order, reason);
    return NextResponse.json({ ok: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Rifiuto non riuscito.",
      },
      { status: 400 },
    );
  }
}
