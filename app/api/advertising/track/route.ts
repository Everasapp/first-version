import { NextResponse } from "next/server";

import {
  isAdvertisingOrderId,
  trackAdvertisingBannerEvent,
  type AdvertisingTrackEvent,
} from "@/src/lib/ads/banner-stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TrackBody = {
  orderId?: unknown;
  event?: unknown;
};

export async function POST(request: Request) {
  let body: TrackBody;
  try {
    body = (await request.json()) as TrackBody;
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const orderId = typeof body.orderId === "string" ? body.orderId.trim() : "";
  const event = body.event as AdvertisingTrackEvent;

  if (!isAdvertisingOrderId(orderId)) {
    return NextResponse.json({ error: "Ordine non valido." }, { status: 400 });
  }
  if (event !== "impression" && event !== "click") {
    return NextResponse.json({ error: "Evento non valido." }, { status: 400 });
  }

  const result = await trackAdvertisingBannerEvent({ orderId, event });
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
