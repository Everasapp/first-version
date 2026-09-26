import { NextResponse } from "next/server";

import { getAdvertisingPackage } from "@/src/lib/ads/advertising-packages";
import { getOrderByAccessToken } from "@/src/lib/ads/orders";
import { getOrderChargeAmount } from "@/src/lib/ads/types";
import {
  createPayPalOrder,
  isPayPalConfigured,
} from "@/src/lib/ads/paypal";
import { getSiteUrl } from "@/src/lib/notifications/config";
import { createAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json(
      {
        error:
          "Pagamento PayPal non ancora configurato. Contatta EVERAS per completare l'ordine.",
      },
      { status: 503 },
    );
  }

  let body: { accessToken?: string };
  try {
    body = (await request.json()) as { accessToken?: string };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const accessToken = body.accessToken?.trim();
  if (!accessToken) {
    return NextResponse.json({ error: "Token ordine mancante." }, { status: 400 });
  }

  const order = await getOrderByAccessToken(accessToken);
  if (!order) {
    return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
  }

  if (order.status !== "awaiting_payment") {
    return NextResponse.json(
      { error: "Questo ordine non è in attesa di pagamento." },
      { status: 400 },
    );
  }

  const pkg = getAdvertisingPackage(order.package_id);
  if (!pkg?.active) {
    return NextResponse.json(
      { error: "Pacchetto non più disponibile." },
      { status: 400 },
    );
  }

  // Importo ESATTAMENTE dal final_price bloccato sull'ordine (non dalla config corrente).
  const amount = getOrderChargeAmount(order);
  if (!(amount > 0)) {
    return NextResponse.json(
      { error: "Importo ordine non valido." },
      { status: 400 },
    );
  }

  const siteUrl = getSiteUrl();
  const returnUrl = `${siteUrl}/pubblicita/ordine/${order.access_token}/completa`;
  const cancelUrl = `${siteUrl}/pubblicita/ordine/${order.access_token}?cancelled=1`;

  try {
    const paypal = await createPayPalOrder({
      amount,
      currency: order.currency || pkg.currency,
      description: order.package_name || pkg.name,
      customId: order.id,
      returnUrl,
      cancelUrl,
    });

    const supabase = createAdminClient();
    await supabase
      .from("advertising_orders")
      .update({ paypal_order_id: paypal.orderId })
      .eq("id", order.id);

    return NextResponse.json({
      ok: true,
      paypalOrderId: paypal.orderId,
      approveUrl: paypal.approveUrl,
    });
  } catch (error) {
    console.error("[advertising] create paypal order:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Creazione pagamento PayPal non riuscita.",
      },
      { status: 500 },
    );
  }
}
