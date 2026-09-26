import { NextResponse } from "next/server";

import { uploadAdvertisingBanner } from "@/src/lib/ads/banner-upload";
import {
  getOrderByAccessToken,
  sendAdvertisingAdminReviewEmail,
} from "@/src/lib/ads/orders";
import type { AdvertisingOrderRow } from "@/src/lib/ads/types";
import { createAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

type Params = { params: Promise<{ token: string }> };

export async function POST(request: Request, { params }: Params) {
  const { token } = await params;
  if (!token) {
    return NextResponse.json({ error: "Token mancante." }, { status: 400 });
  }

  const order = await getOrderByAccessToken(token);
  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
  }

  if (order.status !== "needs_changes") {
    return NextResponse.json(
      { error: "Puoi aggiornare il banner solo se sono richieste modifiche." },
      { status: 400 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const file = formData.get("banner");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File banner mancante." }, { status: 400 });
  }

  try {
    const supabase = createAdminClient();
    const uploaded = await uploadAdvertisingBanner({
      supabase,
      file,
      orderId: order.id,
    });

    const { data, error } = await supabase
      .from("advertising_orders")
      .update({
        banner_url: uploaded.publicUrl,
        banner_storage_path: uploaded.path,
        status: "awaiting_approval",
      })
      .eq("id", order.id)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Aggiornamento fallito.");
    }

    const updated = data as AdvertisingOrderRow;
    await sendAdvertisingAdminReviewEmail(updated);

    return NextResponse.json({
      ok: true,
      order: updated,
    });
  } catch (error) {
    console.error("[advertising] replace banner:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Aggiornamento banner non riuscito.",
      },
      { status: 500 },
    );
  }
}
