import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  getOrderById,
  markOrderPaidManually,
} from "@/src/lib/ads/orders";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  let body: { note?: string } = {};
  try {
    body = (await request.json()) as { note?: string };
  } catch {
    // note opzionale
  }

  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
  }

  try {
    const updated = await markOrderPaidManually(
      order,
      body.note?.trim() || "Pagamento confermato manualmente (PayPal NCP).",
    );
    return NextResponse.json({ ok: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Conferma pagamento non riuscita.",
      },
      { status: 400 },
    );
  }
}
