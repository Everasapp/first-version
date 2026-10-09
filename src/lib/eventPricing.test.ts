import { describe, expect, it } from "vitest";
import { resolveEventPricing } from "./eventPricing";
import { formatEventAdmission } from "./event-practical";

describe("event admission certainty", () => {
  it.each([null, undefined, "", "unknown"])("does not invent paid admission for %s", (flag) => {
    const pricing = resolveEventPricing(flag, null);
    expect(pricing.isFree).toBeNull();
    expect(pricing.label).toBe("Prezzo da confermare");
    expect(resolveEventPricing(pricing.isFree, pricing.priceFrom).label).toBe(pricing.label);
    expect(formatEventAdmission(flag, null, "https://example.com/info")).toMatchObject({
      label: pricing.label, ctaLabel: "Informazioni e prenotazioni",
    });
  });

  it.each([false, "false", 0, "0"])("keeps explicit paid admission for %s", (flag) => {
    expect(resolveEventPricing(flag, null).label).toBe("A pagamento");
  });

  it("keeps verified free entry and prioritizes a positive price", () => {
    expect(resolveEventPricing(true, null).label).toBe("Gratuito");
    expect(resolveEventPricing(true, "8")).toMatchObject({ isFree: false, priceFrom: 8 });
    expect(resolveEventPricing(null, "8").label).toBe("Da €8,00");
  });
});
