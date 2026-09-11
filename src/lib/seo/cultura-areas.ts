import { citiesInArea, type City } from "@/src/data/cities";
import { cityToSlug } from "@/src/lib/seo/paths";

export const CULTURE_HUB_PATH = "/cultura-sarda";

export const CULTURE_AREA_SLUGS = [
  "nord-sardegna",
  "centro-sardegna",
  "sud-sardegna",
] as const;

export type CultureAreaSlug = (typeof CULTURE_AREA_SLUGS)[number];

export type CultureArea = {
  slug: CultureAreaSlug;
  name: City["area"];
  path: string;
  image: string;
  imageAlt: string;
  title: string;
  h1: string;
  description: string;
  paragraphs: string[];
  townPagesLive: boolean;
  faqs: Array<{ question: string; answer: string }>;
};

const PROVINCE_LABEL: Record<string, string> = {
  SS: "Sassari",
  NU: "Nuoro",
  OR: "Oristano",
  CA: "Cagliari",
  SU: "Sud Sardegna",
};

export const CULTURE_AREAS: CultureArea[] = [
  {
    slug: "nord-sardegna",
    name: "Nord Sardegna",
    path: `${CULTURE_HUB_PATH}/nord-sardegna`,
    image: "/images/nord-sardegna.webp",
    imageAlt: "Costa e paesi del Nord Sardegna",
    title: "Cultura sarda nel Nord: comuni, musei e tradizioni",
    h1: "Nord Sardegna",
    description:
      "Directory dei comuni del Nord Sardegna: guide culturali, musei, tradizioni e cosa visitare da Sassari alla Gallura.",
    paragraphs: [
      "Il Nord è organizzato come il filtro eventi: tutti i comuni della provincia di Sassari storica, Gallura compresa. In evidenza le schede già scritte; sotto, l’elenco completo in ordine alfabetico.",
      "Ogni paese ha una pagina. Dove la guida è pronta trovi storia, tradizioni e visite; negli altri comuni trovi il calendario eventi e il posto del paese in questa directory.",
    ],
    townPagesLive: true,
    faqs: [
      {
        question: "Quali comuni del Nord sono in questa guida?",
        answer:
          "Tutti i comuni del Nord Sardegna usati anche nei filtri eventi, dalla Nurra alla Gallura. Parti dalle schede in evidenza o cerca il nome nell’elenco A–Z.",
      },
      {
        question: "Ogni paese ha una guida completa?",
        answer:
          "Le schede più ampie — musei, mestieri, cosa visitare — ci sono già su dodici comuni, dalle città (Sassari, Alghero, Olbia, Porto Torres, La Maddalena, Arzachena) ai paesi pubblicati prima (Pattada, Castelsardo, Aggius, Tempio Pausania, Ozieri, Stintino). Gli altri comuni hanno una pagina con eventi e collegamenti all’area.",
      },
    ],
  },
  {
    slug: "centro-sardegna",
    name: "Centro Sardegna",
    path: `${CULTURE_HUB_PATH}/centro-sardegna`,
    image: "/images/centro-sardegna.webp",
    imageAlt: "Paesaggio del Centro Sardegna",
    title: "Cultura sarda nel Centro: comuni di Nuoro e Oristano",
    h1: "Centro Sardegna",
    description:
      "Directory dei comuni del Centro Sardegna: Nuoro, Oristano e i paesi dell’interno, con una pagina per ciascun comune.",
    paragraphs: [
      "Il Centro usa lo stesso perimetro dei filtri eventi: Nuoro, Oristano e i paesi dell’interno. Ogni comune ha una pagina.",
      "Dove la guida lunga non c’è ancora, trovi il calendario eventi e i collegamenti agli altri paesi dell’area.",
    ],
    townPagesLive: true,
    faqs: [
      {
        question: "Quali comuni del Centro sono in questa guida?",
        answer:
          "Tutti i comuni del Centro Sardegna usati anche nei filtri eventi, da Nuoro a Oristano. Cerca il nome nell’elenco A–Z.",
      },
      {
        question: "Ogni paese ha una guida completa?",
        answer:
          "Ogni comune ha una pagina con eventi e collegamenti. Le schede più ampie — musei, mestieri, cosa visitare — si aggiungono comune per comune, come già accade nel Nord.",
      },
    ],
  },
  {
    slug: "sud-sardegna",
    name: "Sud Sardegna",
    path: `${CULTURE_HUB_PATH}/sud-sardegna`,
    image: "/images/sud-sardegna.webp",
    imageAlt: "Paesaggio del Sud Sardegna",
    title: "Cultura sarda nel Sud: comuni di Cagliari e Sulcis",
    h1: "Sud Sardegna",
    description:
      "Directory dei comuni del Sud Sardegna: Cagliari, il Campidano e una selezione del Sulcis, con una pagina per ciascun comune.",
    paragraphs: [
      "Il Sud segue i filtri eventi: Città metropolitana di Cagliari e una selezione del Sulcis. Ogni comune ha una pagina.",
      "Dove la guida lunga non c’è ancora, trovi il calendario eventi e i collegamenti agli altri paesi dell’area.",
    ],
    townPagesLive: true,
    faqs: [
      {
        question: "Quali comuni del Sud sono in questa guida?",
        answer:
          "Tutti i comuni del Sud Sardegna usati anche nei filtri eventi, da Cagliari al Sulcis. Cerca il nome nell’elenco A–Z.",
      },
      {
        question: "Ogni paese ha una guida completa?",
        answer:
          "Ogni comune ha una pagina con eventi e collegamenti. Le schede più ampie — musei, mestieri, cosa visitare — si aggiungono comune per comune, come già accade nel Nord.",
      },
    ],
  },
];

export function findCultureArea(slug: string) {
  return CULTURE_AREAS.find((area) => area.slug === slug);
}

export function findCultureAreaByName(name: string) {
  return CULTURE_AREAS.find((area) => area.name === name);
}

export function cultureTownPath(areaSlug: string, townSlug: string) {
  return `${CULTURE_HUB_PATH}/${areaSlug}/${townSlug}`;
}

export function cultureTownPathForCity(city: City) {
  const area = findCultureAreaByName(city.area);
  if (!area) {
    return CULTURE_HUB_PATH;
  }

  return cultureTownPath(area.slug, cityToSlug(city.city));
}

export function provinceLabel(code: string) {
  return PROVINCE_LABEL[code] ?? code;
}

export function cityIndexLetter(cityName: string) {
  const first =
    cityName
      .normalize("NFD")
      .replace(/\p{M}/gu, "")
      .replace(/[^A-Za-z]/g, "")
      .charAt(0) || "#";
  return first.toLocaleUpperCase("it");
}

export function groupCitiesByLetter(list: City[]) {
  const grouped = new Map<string, City[]>();

  for (const city of list) {
    const letter = cityIndexLetter(city.city);
    const bucket = grouped.get(letter) ?? [];
    bucket.push(city);
    grouped.set(letter, bucket);
  }

  return [...grouped.entries()].sort(([left], [right]) =>
    left.localeCompare(right, "it"),
  );
}

export function citiesForCultureArea(area: CultureArea) {
  return citiesInArea(area.name);
}

export function allCultureTownParams() {
  return CULTURE_AREAS.filter((area) => area.townPagesLive).flatMap((area) =>
    citiesForCultureArea(area).map((city) => ({
      area: area.slug,
      slug: cityToSlug(city.city),
    })),
  );
}

export function nearbyCities(list: City[], current: City, count = 8) {
  const index = list.findIndex((item) => item.id === current.id);
  const windowStart = Math.max(0, index - Math.floor(count / 2));
  return list
    .slice(windowStart, windowStart + count + 1)
    .filter((item) => item.id !== current.id)
    .slice(0, count);
}
