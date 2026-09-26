import { NextResponse } from "next/server";

import { getAdminApiContext } from "@/src/lib/admin/api-auth";
import {
  deleteAdvertisingOrder,
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
    await deleteAdvertisingOrder(order);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Eliminazione non riuscita.",
      },
      { status: 400 },
    );
  }
}
