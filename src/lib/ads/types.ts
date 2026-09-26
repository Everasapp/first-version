import type { AdvertisingOrderStatus } from "@/src/lib/ads/advertising-packages";

export type AdvertisingOrderRow = {
  id: string;
  access_token: string;
  package_id: string;
  package_name: string;
  placement: "home" | "internal";
  duration_months: number;
  /** Legacy / alias del prezzo addebitato (sincronizzato con final_price). */
  price: number;
  list_price: number | null;
  promo_price: number | null;
  final_price: number | null;
  promo_applied: boolean;
  currency: string;
  status: AdvertisingOrderStatus;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  city: string;
  province: string;
  website_url: string;
  banner_url: string | null;
  banner_storage_path: string | null;
  paypal_order_id: string | null;
  paypal_capture_id: string | null;
  admin_notes: string | null;
  rejection_reason: string | null;
  created_at: string;
  submitted_at: string | null;
  paid_at: string | null;
  start_date: string | null;
  expiration_date: string | null;
  approved_at: string | null;
  rejected_at: string | null;
  expired_at: string | null;
};

/** Importo effettivamente addebitato (bloccato alla creazione ordine). */
export function getOrderChargeAmount(order: {
  final_price?: number | null;
  price: number;
}): number {
  if (order.final_price != null && !Number.isNaN(Number(order.final_price))) {
    return Number(order.final_price);
  }
  return Number(order.price);
}
