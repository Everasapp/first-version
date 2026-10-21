
export type PrimaryNavLink = {
  href: string;
  label: string;
};

/** Voci in evidenza nell’header desktop e in cima al menu. */
export const featuredNavLinks: PrimaryNavLink[] = [
  { href: "/imparare-e-fare-in-sardegna#formazione", label: "Formazione" },
  { href: "/imparare-e-fare-in-sardegna#corsi-workshop", label: "Corsi e workshop" },
];

export function getPrimaryNavLinks(): PrimaryNavLink[] {
  return [
    ...featuredNavLinks,
    { href: "/idee-e-percorsi", label: "Idee e percorsi" },
    { href: "/per-gli-organizzatori", label: "Per gli organizzatori" },
    { href: "/contatti", label: "Contattaci" },
  ];
}
