"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdvertisingPaymentComplete({
  accessToken,
}: {
  accessToken: string;
}) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading");
  const [message, setMessage] = useState("Conferma del pagamento in corso...");

  useEffect(() => {
    const paypalOrderId =
      searchParams.get("token") || searchParams.get("orderID");

    if (!paypalOrderId) {
      setStatus("error");
      setMessage(
        "Parametro PayPal mancante. Se hai già pagato, attendi qualche minuto o contattaci.",
      );
      return;
    }

    let cancelled = false;

    async function run() {
      try {
        const response = await fetch("/api/advertising/paypal/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken,
            paypalOrderId,
          }),
        });
        const data = (await response.json()) as {
          error?: string;
          status?: string;
        };
        if (cancelled) return;
        if (!response.ok) {
          throw new Error(data.error || "Conferma pagamento fallita.");
        }
        setStatus("ok");
        setMessage(
          "Pagamento confermato. La tua richiesta è ora in fase di verifica.",
        );
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setMessage(
          err instanceof Error ? err.message : "Conferma pagamento fallita.",
        );
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [accessToken, searchParams]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-black text-slate-900">
        {status === "loading"
          ? "Verifica pagamento"
          : status === "ok"
            ? "Pagamento ricevuto"
            : "Attenzione"}
      </h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
      {status !== "loading" ? (
        <Link
          href={`/pubblicita/ordine/${accessToken}`}
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#075EAE] px-5 text-sm font-bold text-white"
        >
          Vai al riepilogo ordine
        </Link>
      ) : null}
    </div>
  );
}
