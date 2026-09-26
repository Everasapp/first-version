import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  approveAdvertisingOrder,
  getOrderById,
} from "@/src/lib/ads/orders";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const auth = await getAdminApiContext();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
  }

  try {
    const updated = await approveAdvertisingOrder(order);
    return NextResponse.json({ ok: true, order: updated });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Approvazione non riuscita.",
      },
      { status: 400 },
    );
  }
}
