import { NextResponse } from "next/server";

import {
  getOrderByAccessToken,
  getOrderByPayPalOrderId,
  markOrderPaidFromPayPal,
} from "@/src/lib/ads/orders";
import {
  capturePayPalOrder,
  extractCaptureId,
  isPayPalOrderCompleted,
} from "@/src/lib/ads/paypal";

export const runtime = "nodejs";

/**
 * Conferma pagamento solo dopo capture/verifica PayPal.
 * Non considerare pagato un ordine solo perché il browser è tornato sul sito.
 */
export async function POST(request: Request) {
  let body: { accessToken?: string; paypalOrderId?: string };
  try {
    body = (await request.json()) as {
      accessToken?: string;
      paypalOrderId?: string;
    };
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const accessToken = body.accessToken?.trim();
  const paypalOrderId = body.paypalOrderId?.trim();

  if (!accessToken || !paypalOrderId) {
    return NextResponse.json(
      { error: "Parametri pagamento mancanti." },
      { status: 400 },
    );
  }

  try {
    const order = await getOrderByAccessToken(accessToken);
    if (!order) {
      return NextResponse.json({ error: "Ordine non trovato." }, { status: 404 });
    }

    if (order.paypal_order_id && order.paypal_order_id !== paypalOrderId) {
      return NextResponse.json(
        { error: "Ordine PayPal non corrispondente." },
        { status: 400 },
      );
    }

    // Idempotenza
    if (
      ["paid", "awaiting_approval", "needs_changes", "approved", "active"].includes(
        order.status,
      )
    ) {
      return NextResponse.json({ ok: true, status: order.status, alreadyPaid: true });
    }

    const captured = await capturePayPalOrder(paypalOrderId);

    if (!isPayPalOrderCompleted(captured)) {
      return NextResponse.json(
        { error: "Pagamento PayPal non completato." },
        { status: 402 },
      );
    }

    const captureId = extractCaptureId(captured);
    if (!captureId) {
      return NextResponse.json(
        { error: "Capture PayPal non trovato." },
        { status: 402 },
      );
    }

    const customId = captured.purchase_units?.[0]?.custom_id;
    if (customId && customId !== order.id) {
      return NextResponse.json(
        { error: "Ordine PayPal non associato a questa richiesta." },
        { status: 400 },
      );
    }

    // Verifica che nessun altro ordine usi questo paypal id
    const byPaypal = await getOrderByPayPalOrderId(paypalOrderId);
    if (byPaypal && byPaypal.id !== order.id) {
      return NextResponse.json(
        { error: "Conflitto ordine PayPal." },
        { status: 409 },
      );
    }

    const updated = await markOrderPaidFromPayPal({
      order,
      paypalOrderId,
      paypalCaptureId: captureId,
    });

    return NextResponse.json({
      ok: true,
      status: updated.status,
      alreadyPaid: false,
    });
  } catch (error) {
    console.error("[advertising] capture paypal:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Conferma pagamento non riuscita.",
      },
      { status: 500 },
    );
  }
}
