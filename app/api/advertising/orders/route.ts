import { NextResponse } from "next/server";

import {
  getAdvertisingPackage,
  resolvePackagePricing,
  sanitizeWebsiteUrl,
} from "@/src/lib/ads/advertising-packages";
import {
  collectBannerFiles,
  uploadAdvertisingBanners,
} from "@/src/lib/ads/banner-upload";
import {
  getLaunchPromoState,
  sendAdvertisingRequestReceivedEmail,
} from "@/src/lib/ads/orders";
import type { AdvertisingOrderRow } from "@/src/lib/ads/types";
import { createAdminClient } from "@/src/lib/supabase/admin";

export const runtime = "nodejs";
export const maxDuration = 60;

function requiredString(value: FormDataEntryValue | null, label: string) {
  if (typeof value !== "string" || !value.trim()) {
    return { error: `${label} obbligatorio.` };
  }
  return { value: value.trim() };
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Richiesta non valida." }, { status: 400 });
  }

  const packageIdRaw = requiredString(formData.get("package_id"), "Pacchetto");
  if ("error" in packageIdRaw) {
    return NextResponse.json({ error: packageIdRaw.error }, { status: 400 });
  }

  const pkg = getAdvertisingPackage(packageIdRaw.value);
  if (!pkg || !pkg.active) {
    return NextResponse.json(
      { error: "Pacchetto non disponibile all'acquisto." },
      { status: 400 },
    );
  }

  const companyName = requiredString(formData.get("company_name"), "Nome azienda");
  const contactName = requiredString(formData.get("contact_name"), "Nome referente");
  const email = requiredString(formData.get("email"), "Email");
  const phone = requiredString(formData.get("phone"), "Telefono");
  const address = requiredString(formData.get("address"), "Indirizzo");
  const postalCode = requiredString(formData.get("postal_code"), "CAP");
  const city = requiredString(formData.get("city"), "Comune");
  const province = requiredString(formData.get("province"), "Provincia");
  const websiteRaw = requiredString(formData.get("website_url"), "URL");

  for (const field of [
    companyName,
    contactName,
    email,
    phone,
    address,
    postalCode,
    city,
    province,
    websiteRaw,
  ]) {
    if ("error" in field) {
      return NextResponse.json({ error: field.error }, { status: 400 });
    }
  }

  const privacy = formData.get("privacy");
  if (privacy !== "on" && privacy !== "true" && privacy !== "1") {
    return NextResponse.json(
      { error: "Devi accettare l'informativa sulla privacy." },
      { status: 400 },
    );
  }

  const emailValue = (email as { value: string }).value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) {
    return NextResponse.json({ error: "Email non valida." }, { status: 400 });
  }

  const websiteUrl = sanitizeWebsiteUrl((websiteRaw as { value: string }).value);
  if (!websiteUrl) {
    return NextResponse.json({ error: "URL non valido." }, { status: 400 });
  }

  const files = collectBannerFiles(formData);
  if (files.length < 1) {
    return NextResponse.json(
      { error: "Carica da 1 a 3 banner (JPG, PNG, WEBP o GIF)." },
      { status: 400 },
    );
  }

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Prezzo determinato solo lato server (promo + listino), non dal client.
    const promoState = await getLaunchPromoState();
    const pricing = resolvePackagePricing(pkg, promoState.active);

    const { data: created, error: insertError } = await supabase
      .from("advertising_orders")
      .insert({
        package_id: pkg.id,
        package_name: pkg.name,
        placement: pkg.placement,
        duration_months: pkg.durationMonths,
        price: pricing.finalPrice,
        list_price: pricing.listPrice,
        promo_price: pricing.promoPrice,
        final_price: pricing.finalPrice,
        promo_applied: pricing.promoApplied,
        currency: pkg.currency,
        status: "awaiting_payment",
        company_name: (companyName as { value: string }).value,
        contact_name: (contactName as { value: string }).value,
        email: emailValue.toLowerCase(),
        phone: (phone as { value: string }).value,
        address: (address as { value: string }).value,
        postal_code: (postalCode as { value: string }).value,
        city: (city as { value: string }).value,
        province: (province as { value: string }).value,
        website_url: websiteUrl,
        submitted_at: now,
      })
      .select("*")
      .single();

    if (insertError || !created) {
      throw new Error(insertError?.message || "Creazione ordine fallita.");
    }

    const order = created as AdvertisingOrderRow;

    const uploaded = await uploadAdvertisingBanners({
      supabase,
      files,
      orderId: order.id,
    });

    const { data: updated, error: updateError } = await supabase
      .from("advertising_orders")
      .update({
        banner_url: uploaded.publicUrls[0] ?? null,
        banner_storage_path: uploaded.paths[0] ?? null,
        banner_urls: uploaded.publicUrls,
        banner_storage_paths: uploaded.paths,
      })
      .eq("id", order.id)
      .select("*")
      .single();

    if (updateError || !updated) {
      throw new Error(updateError?.message || "Salvataggio banner fallito.");
    }

    const finalOrder = updated as AdvertisingOrderRow;
    await sendAdvertisingRequestReceivedEmail(finalOrder);

    return NextResponse.json({
      ok: true,
      orderId: finalOrder.id,
      accessToken: finalOrder.access_token,
      redirectTo: `/pubblicita/ordine/${finalOrder.access_token}`,
    });
  } catch (error) {
    console.error("[advertising] submit order:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invio richiesta non riuscito.",
      },
      { status: 500 },
    );
  }
}
