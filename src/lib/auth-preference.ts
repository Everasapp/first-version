const STORAGE_KEY = "everas_has_account";

export function readHasEverasAccount() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Segna che su questo dispositivo esiste già un account (dopo login/registrazione). */
export function markEverasAccountKnown() {
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // ignore quota / private mode
  }
}
