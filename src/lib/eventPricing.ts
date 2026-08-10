/** Normalize DB/UI price values for cards and detail pages. */
export function toPriceAmount(
  priceFrom: number | string | null | undefined,
): number | undefined {
  if (priceFrom === null || priceFrom === undefined || priceFrom === "") {
    return undefined;
  }

  const amount = Number(priceFrom);
  if (!Number.isFinite(amount) || amount <= 0) {
    return undefined;
  }

  return amount;
}

export function formatPriceLabel(amount: number) {
  return `Da €${amount.toFixed(2).replace(".", ",")}`;
}

function isTruthyFreeFlag(isFree: boolean | string | number | null | undefined) {
  return isFree === true || isFree === "true" || isFree === 1 || isFree === "1";
}

/**
 * Prefer an explicit price over the is_free flag.
 * Avoids showing "Gratuito" when price_from is present but is_free is wrong.
 */
export function resolveEventPricing(
  isFree: boolean | string | number | null | undefined,
  priceFrom: number | string | null | undefined,
) {
  const amount = toPriceAmount(priceFrom);

  if (amount !== undefined) {
    return {
      isFree: false,
      priceFrom: amount,
      label: formatPriceLabel(amount),
    };
  }

  if (isTruthyFreeFlag(isFree)) {
    return {
      isFree: true,
      priceFrom: undefined,
      label: "Gratuito",
    };
  }

  return {
    isFree: false,
    priceFrom: undefined,
    label: "A pagamento",
  };
}
