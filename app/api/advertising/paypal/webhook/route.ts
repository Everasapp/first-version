import { NextResponse } from "next/server";

import {
  getOrderById,
  getOrderByPayPalOrderId,
  markOrderPaidFromPayPal,
} from "@/src/lib/ads/orders";
import {
  getPayPalOrder,
  extractCaptureId,
  isPayPalOrderCompleted,
  verifyPayPalWebhook,
} from "@/src/lib/ads/paypal";

export const runtime = "nodejs";

/**
 * Webhook PayPal — conferma pagamento lato server (non affidarsi al return browser).
 */
export async function POST(request: Request) {
  const rawBody = await request.text();

  const verified = await verifyPayPalWebhook({
    headers: request.headers,
    body: rawBody,
  });

  if (!verified) {
    return NextResponse.json({ error: "Firma webhook non valida." }, { status: 401 });
  }

  let event: {
    event_type?: string;
    resource?: {
      id?: string;
      status?: string;
      supplementary_data?: {
        related_ids?: { order_id?: string };
      };
      custom_id?: string;
    };
  };

  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Body non valido." }, { status: 400 });
  }

  const eventType = event.event_type;
  if (
    eventType !== "PAYMENT.CAPTURE.COMPLETED" &&
    eventType !== "CHECKOUT.ORDER.APPROVED"
  ) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    let paypalOrderId =
      event.resource?.supplementary_data?.related_ids?.order_id || null;

    // CHECKOUT.ORDER.APPROVED: resource.id is the order id
    if (eventType === "CHECKOUT.ORDER.APPROVED" && event.resource?.id) {
      paypalOrderId = event.resource.id;
    }

    if (!paypalOrderId && event.resource?.id && eventType === "PAYMENT.CAPTURE.COMPLETED") {
      // Fallback: try to find by capture via get — we need order id
      // Without order id we cannot safely match; acknowledge and exit.
      console.warn("[paypal webhook] missing order id for capture", event.resource.id);
      return NextResponse.json({ ok: true, unmatched: true });
    }

    if (!paypalOrderId) {
      return NextResponse.json({ ok: true, unmatched: true });
    }

    const paypalOrder = await getPayPalOrder(paypalOrderId);
    if (!isPayPalOrderCompleted(paypalOrder)) {
      // For APPROVED, capture may not be done yet — skip; capture route / next event handles it
      if (eventType === "CHECKOUT.ORDER.APPROVED") {
        return NextResponse.json({ ok: true, pendingCapture: true });
      }
      return NextResponse.json({ ok: true, notCompleted: true });
    }

    const captureId = extractCaptureId(paypalOrder);
    if (!captureId) {
      return NextResponse.json({ ok: true, noCapture: true });
    }

    let order = await getOrderByPayPalOrderId(paypalOrderId);
    const customId = paypalOrder.purchase_units?.[0]?.custom_id;
    if (!order && customId) {
      order = await getOrderById(customId);
    }

    if (!order) {
      console.warn("[paypal webhook] order not found for", paypalOrderId);
      return NextResponse.json({ ok: true, unmatched: true });
    }

    await markOrderPaidFromPayPal({
      order,
      paypalOrderId,
      paypalCaptureId: captureId,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[paypal webhook] processing error:", error);
    return NextResponse.json({ error: "Elaborazione fallita." }, { status: 500 });
  }
}
