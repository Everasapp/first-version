import { NORD_CULTURE_TOWNS } from "@/src/lib/seo/cultura-nord-towns";
import { NORD_REMAINING_CULTURE_TOWNS } from "@/src/lib/seo/cultura-nord-remaining";
import { CENTRO_CULTURE_TOWNS } from "@/src/lib/seo/cultura-centro-towns";
import { SUD_CULTURE_TOWNS } from "@/src/lib/seo/cultura-sud-towns";
import { CULTURE_HUB_PATH } from "@/src/lib/seo/cultura-areas";

export { CULTURE_HUB_PATH };

export type PhotoCredit = {
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
  /** Defaults to "Wikimedia Commons". */
  sourceLabel?: string;
  /** Defaults to "Foto di". */
  creditPrefix?: string;
};

export type CulturePhoto = {
  src: string;
  alt: string;
  credit: PhotoCredit;
};

/** Foto da Wikimedia Commons, con pagina File e licenza esplicite. */
export function wikiCommonsPhoto(input: {
  src: string;
  alt: string;
  author: string;
  commonsFile: string;
  license: string;
  licenseUrl: string;
}): CulturePhoto {
  return {
    src: input.src,
    alt: input.alt,
    credit: {
      author: input.author,
      license: input.license,
      licenseUrl: input.licenseUrl,
      sourceUrl: `https://commons.wikimedia.org/wiki/File:${input.commonsFile.replace(/ /g, "_")}`,
    },
  };
}

export type CultureTownArticle = {
  slug: string;
  path: string;
  town: string;
  province: string;
  area: string;
  title: string;
  h1: string;
  description: string;
  hero: CulturePhoto;
  traditionPhoto?: CulturePhoto;
  visitPhoto?: CulturePhoto;
  intro: string;
  history: string[];
  /** Override dell’H2 Storia; se assente resta «Storia». */
  historyHeading?: string;
  /** Lingua o varietà locale, quando è documentata. */
  language?: string[];
  languageHeading?: string;
  traditions: Array<{ title: string; body: string }>;
  /** Override dell’H2 Tradizioni; se assente resta «Tradizioni». */
  traditionsHeading?: string;
  /** Mestieri ancora visibili nel comune, senza catalogo di vendita. */
  crafts?: Array<{ title: string; body: string }>;
  visit: Array<{ name: string; body: string }>;
  /** Override dell’H2 Cosa visitare; se assente resta «Cosa visitare». */
  visitHeading?: string;
  faqs: Array<{ question: string; answer: string }>;
  sources?: Array<{ label: string; href: string }>;
  relatedLinks?: Array<{ href: string; label: string }>;
  relatedLinksHeading?: string;
  relatedLinksIntro?: string;
  publishedAt: string;
};

const GIANNI_CAREEDDU = {
  author: "Gianni Careddu",
} as const;

export const CULTURE_HUB = {
  path: CULTURE_HUB_PATH,
  title: "Scopri la Sardegna: guide ai paesi, musei e tradizioni",
  h1: "Scopri la Sardegna",
  description:
    "Guide ai paesi partendo da musei e botteghe: storia, tradizioni e cosa visitare, un comune alla volta.",
  paragraphs: [
    "La Sardegna non si capisce solo dalle sagre del weekend. Sta nei musei di paese, nelle botteghe ancora accese, nelle chiese, nei laghi e nei nuraghi che i visitatori cercano quando vogliono capire un posto, non solo passarci.",
    "Le guide sono organizzate come i filtri eventi: Nord, Centro e Sud Sardegna. Entri nell’area, trovi l’elenco dei comuni, poi apri la pagina del paese.",
    "Ogni area ha l’elenco dei comuni e una pagina per paese. Nord (93), Centro (46) e Sud (84) hanno le guide lunghe su tutti i comuni: storia, tradizioni, visite e eventi collegati.",
  ],
  faqs: [
    {
      question: "Cos’è Scopri la Sardegna?",
      answer:
        "Una directory dei comuni dell’isola, divisa in Nord, Centro e Sud come i filtri eventi. Non sostituisce il calendario: lo affianca, per chi arriva su EVERAS anche fuori stagione.",
    },
    {
      question: "Da dove si inizia?",
      answer:
        "Scegli Nord, Centro o Sud, poi apri il comune. Ogni paese ha una scheda con storia, tradizioni, visite e gli eventi collegati.",
    },
  ],
} as const;

export const CULTURE_TOWNS: CultureTownArticle[] = [
  {
    slug: "pattada",
    path: "/cultura-sarda/nord-sardegna/pattada",
    town: "Pattada",
    province: "Sassari",
    area: "Monteacuto",
    title: "Pattada: storia, resolza e cosa visitare",
    h1: "Pattada",
    description:
      "Pattada, Monteacuto: sa resolza, museo del coltello, feste di paese e lago Lerno.",
    hero: {
      src: "/images/cultura/pattada-panorama.webp",
      alt: "Panorama di Pattada sul colle del Monteacuto, tra sugherete e pascoli",
      credit: {
        ...GIANNI_CAREEDDU,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Pattada_-_Panorama_(01).JPG",
      },
    },
    traditionPhoto: {
      src: "/images/cultura/pattada-coltellinaio.webp",
      alt: "Il coltellinaio Gianmario Fogarizzu al lavoro nella bottega di Pattada",
      credit: {
        author: "Mbarrieau",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Fogarizzu_knifemaker.jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/pattada-lago-lerno.webp",
      alt: "Il lago Lerno e il monte Lerno nel territorio di Pattada",
      credit: {
        ...GIANNI_CAREEDDU,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Pattada_-_Lago_Lerno_e_monte_Lerno_(01).JPG",
      },
    },
    intro:
      "Pattada (Patada in sardo) è il paese alto del Monteacuto, a metà strada tra Sassari e Nuoro. Chi la cerca su Google di solito vuole tre cose: il coltello, il museo, e cosa altro vale il viaggio. Questa scheda tiene insieme storia, tradizioni e visite, senza trattarla come una cartolina.",
    history: [
      "Il nome, secondo i linguisti, parla di un altopiano: un posto messo in piano, scelto quando i villaggi a valle si unirono per stare più al sicuro. Bantine, ancora oggi frazione, restò fuori da quell’accordo. Prima dei giudicati il territorio era già abitato: cultura di Ozieri, tombe dei giganti, decine di nuraghi. Non è un’invenzione turistica, è il suolo.",
      "Nel Medioevo Pattada stava nella curatoria di Monte Acuto, nel giudicato di Torres. Caduto il giudicato passò per un periodo ad Arborea, poi divenne feudo sotto i catalano-aragonesi. I resti del castello di Olomene, a nord del paese, ricordano quel ruolo di controllo sul territorio. Il feudo si sciolse nell’Ottocento, come nel resto dell’isola.",
      "Il centro che vedi oggi è erede di quella trama: vicoli acciottolati, case in granito, palazzi neoclassici. Tra fine Ottocento e inizio Novecento, con i tecnici della ferrovia Tirso-Chilivani, arrivarono fontane, scalinate e il mercato pubblico in pietra locale. La ferrovia chiuse nel 1969; restano ponti e ruderi.",
    ],
    language: [
      "Si parla sardo logudorese. Pattada è anche «culla della poesia» in quella varietà: versi, concorsi, canto a tenore (formazioni come Su Tenore Sa Niera). L’italiano è la lingua pubblica. La guida alle lingue e quella a musica e poesia tengono parlato, poesia e Unesco su piani distinti.",
    ],
    traditions: [
      {
        title: "Feste, cavalieri e palio",
        body: "La patrona è Santa Sabina, il 29 agosto: messa, processione, sfilata a cavallo con sas banderas e abiti tradizionali, poi tenores in piazza Su Pebianu. A fine agosto i dieci rioni (sos ’ighinados) si sfidano nel palio degli asinelli, dal centro fino a piazza d’Italia. A luglio c’è il palio del Monte Acuto, corsa ippica tra i comuni vicini. I cavalieri pattadesi sono chiesti in tutta la Sardegna: Cavalcata sarda, Sant’Efisio, feste di Ozieri e Oschiri. A aprile la Madonna del Carmelo apre il corteo a cavallo; a giugno i falò di Santu Juanne.",
      },
      {
        title: "Tavola e cantine",
        body: "In tavola contano pecorino, ricotta, perette, origliettas al miele, pane e paste come su misturu. Ad aprile Abbuconizos e Binu apre cantine e botteghe nel centro, sullo spirito delle Cortes Apertas: si mangia e si cammina il paese, non solo si guarda. Date: Comune e Pro Loco, ogni edizione.",
      },
    ],
    crafts: [
      {
        title: "Sa resolza",
        body: "Sa resolza — detta anche pattadesa — è il coltello a serramanico che ha fatto il nome del paese. Lama in acciaio, spesso a foglia di mirto, manico in corno. Nasce come attrezzo del pastore e del contadino, non come souvenir: per questo le botteghe contano ancora. Ogni due anni, in estate, la Biennale del coltello porta a Pattada collezionisti e maestri da fuori isola. Lungo le vie trovi i laboratori aperti: è lì che capisci la differenza tra un oggetto fatto a mano e una copia da banco. La guida all’artigianato colloca la resolza tra i mestieri di territorio, senza farne un catalogo.",
      },
    ],
    visit: [
      {
        name: "Museo Culter",
        body: "CULTER, Museo del Coltello Internazionale, è in via Vittorio Emanuele, nella palazzina Giagu-Deroma. Aperto dal 2011, è la prima esposizione permanente in Italia sul coltello fatto a mano: sezione internazionale, storia della lama sarda e laboratorio ancora in attività. Orari e visite si chiedono al museo (coltelligiagu.it). In paese ci sono altre botteghe di coltellinai: vale entrarci, non solo fotografare la vetrina.",
      },
      {
        name: "Chiese e centro storico",
        body: "La parrocchiale di Santa Sabina (XVI secolo, gotico-catalano) è il cuore del paese: portone bronzeo, processione del 29 agosto. Vicino, la chiesa del Rosario (tardo gotico-aragonese). In alto, San Gavino. Cammina piazza Su Pebianu, le fontane in granito, palattu ’e Manuelle (municipio) e la piazza dei Poeti di Sardegna, con sculture di Pinuccio Sciola. Bantine, frazione, ha San Giacomo, San Pietro e un tratto di strada romana.",
      },
      {
        name: "Lago Lerno, monte e nuraghi",
        body: "Il lago Lerno è un bacino artificiale ai piedi del monte Lerno (1094 m). Si va per camminate, cavallo e il nuraghe Lerno, il più noto tra i molti del territorio. Nelle acque è stato individuato un villaggio prenuragico. In zona: tombe dei giganti, fonti sacre, resti del castello di Olomene. D’estate il monte ospita una prova del Rally Italia Sardegna: se cerchi silenzio, controlla il calendario della tappa.",
      },
    ],
    faqs: [
      {
        question: "Perché Pattada è famosa?",
        answer:
          "Per sa resolza, il coltello a serramanico fatto in paese. Musei e botteghe lo spiegano meglio di qualsiasi vetrina in costa.",
      },
      {
        question: "Cosa visitare a Pattada in un giorno?",
        answer:
          "Mattina in centro: Santa Sabina, Museo Culter e una bottega. Pomeriggio al lago Lerno e, se hai gambe, il nuraghe. A fine agosto coincidi con la festa patronale e il palio.",
      },
      {
        question: "Dove si trova il museo del coltello?",
        answer:
          "Il Museo Culter è in via Vittorio Emanuele a Pattada, con laboratorio annesso. Conferma orari sul sito del museo prima di partire: in paese piccolo i giorni di apertura cambiano.",
      },
    ],
    sources: [
      {
        label: "Comune di Pattada",
        href: "https://www.comune.pattada.ss.it/",
      },
      {
        label: "UNESCO — Canto a tenore",
        href: "https://ich.unesco.org/en/RL/canto-a-tenore-sardinian-pastoral-songs-00165",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato: resolza" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/territori-sardegna", label: "Territori: Monteacuto" },
      { href: "/cultura/musica-canto-poesia-sarda", label: "Musica e poesia" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-10",
  },
  ...NORD_CULTURE_TOWNS,
  ...NORD_REMAINING_CULTURE_TOWNS,
  ...CENTRO_CULTURE_TOWNS,
  ...SUD_CULTURE_TOWNS,
];

export function findCultureTown(slug: string) {
  return CULTURE_TOWNS.find((article) => article.slug === slug);
}

function normalizeTownName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** Resolve a cultura town guide path from a municipality / place label. */
export function findCulturaTownPathByName(name: string) {
  const needle = normalizeTownName(name);
  if (!needle) return null;

  const exact = CULTURE_TOWNS.find(
    (article) => normalizeTownName(article.town) === needle,
  );
  if (exact) return exact.path;

  const partial = CULTURE_TOWNS.find((article) => {
    const town = normalizeTownName(article.town);
    return town.includes(needle) || needle.includes(town);
  });
  return partial?.path ?? null;
}

export function cultureTownLinks() {
  return CULTURE_TOWNS.map((article) => ({
    href: article.path,
    label: article.town,
  }));
}
