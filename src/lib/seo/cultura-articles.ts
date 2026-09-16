import type { PhotoCredit } from "@/src/lib/seo/cultura-towns";

export const CULTURA_ARTICLES_HUB_PATH = "/cultura";

export type CulturaArticleSection = {
  title: string;
  paragraphs: string[];
};

export type CulturaArticle = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  intro: string;
  excerpt: string;
  hero: {
    src: string;
    alt: string;
    credit: PhotoCredit;
  };
  sections: CulturaArticleSection[];
  faqs: Array<{ question: string; answer: string }>;
  publishedAt: string;
};

export const CULTURA_ARTICLES_HUB = {
  path: CULTURA_ARTICLES_HUB_PATH,
  title: "Cultura Sarda: storie, longevità e territorio",
  h1: "Cultura Sarda",
  description:
    "Approfondimenti sulla Sardegna: zona blu e longevità, tradizioni vive, territori e legami con il calendario eventi di EVERAS.",
  paragraphs: [
    "Qui non trovi le guide paese per paese: quelle stanno in Scopri la Sardegna. Cultura Sarda è lo spazio per leggere l’isola a tema — longevità, feste, paesaggi interni — e poi tornare al calendario.",
    "Partiamo da ciò che il mondo cerca sulla Sardegna oltre le spiagge: perché tanti sardi vivono a lungo, come si muovono i paesi dell’interno, e dove il territorio si incontra con sagre e rassegne.",
  ],
} as const;

export const CULTURA_ARTICLES: CulturaArticle[] = [
  {
    slug: "sardegna-zona-blu",
    path: "/cultura/sardegna-zona-blu",
    title: "La Sardegna zona blu: longevità dei sardi e paesi dell’interno",
    h1: "La Sardegna zona blu",
    description:
      "Perché la Sardegna è una Blue Zone: longevità dei sardi, Ogliastra e Barbagia, stile di vita, cibo e comunità — e come viverla tra eventi e paesi su EVERAS.",
    intro:
      "Da anni la Sardegna compare nelle mappe delle Blue Zone: aree del mondo dove le persone vivono più a lungo e in salute. Non è un mito da cartolina: è un intreccio di territorio, comunità, movimento quotidiano e cibo semplice. Questa guida spiega cos’è la zona blu sarda e dove andare per capirla davvero.",
    excerpt:
      "Ogliastra, Barbagia e lo stile di vita che rende la Sardegna una delle Blue Zone del mondo.",
    hero: {
      src: "/images/cultura/baunei-panorama.webp",
      alt: "Paesaggio dell’Ogliastra vicino a Baunei, cuore della zona blu sarda",
      credit: {
        author: "fotografia di Rosanna C.",
        license: "CC BY 2.5",
        licenseUrl: "https://creativecommons.org/licenses/by/2.5",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Sardegna-Baunei-costa_sarda.jpg",
      },
    },
    sections: [
      {
        title: "Cos’è una Blue Zone",
        paragraphs: [
          "Le Blue Zone sono regioni studiate per la concentrazione insolita di centenari e di persone che restano attive fino a tarda età. Accanto a Okinawa, Nicoya, Ikaria e Loma Linda, la Sardegna — in particolare l’entroterra orientale e centrale — è entrata in queste mappe per dati demografici e stile di vita osservati sul campo.",
          "Non significa che ogni paese dell’isola sia uguale. La ricerca punta soprattutto su comuni dell’Ogliastra e della Barbagia, dove pastorizia, cammino quotidiano, rete familiare e alimentazione mediterranea “di casa” si sono mantenuti più a lungo che nelle coste turistiche.",
        ],
      },
      {
        title: "Dove si concentra la longevità in Sardegna",
        paragraphs: [
          "Il cuore della narrazione zona blu tocca l’Ogliastra (Villagrande Strisaili, Baunei e dintorni) e i paesi della Barbagia e del Mandrolisai. Sono luoghi di alture, strade strette, piazze piccole e ritmi legati alle stagioni più che agli orari da ufficio.",
          "Se vuoi avvicinarti a questo territorio, non bastano le spiagge: servono i paesi interni. Su EVERAS li trovi nelle guide di Scopri la Sardegna (Centro) e nel calendario quando aprono corti, sagre e feste — da Autunno in Barbagia alle sagre di paese.",
        ],
      },
      {
        title: "Cosa conta davvero: movimento, cibo, comunità",
        paragraphs: [
          "Nella lettura più sobria della zona blu sarda, i fattori ricorrenti sono tre. Primo: movimento naturale — salite, lavoro all’aperto, non “palestra” ma vita. Secondo: tavola semplice — pane, legumi, formaggi, verdure dell’orto, vino con moderazione, poca carne ma di qualità. Terzo: appartenenza — famiglia allargata, vicinato, feste di paese che tengono insieme le generazioni.",
          "Le sagre e le Cortes Apertas non sono solo turismo: sono il modo in cui i paesi ancora si incontrano. Per questo un calendario eventi aggiornato aiuta chi vuole capire la Sardegna viva, non solo fotografarla.",
        ],
      },
      {
        title: "Come viverla con EVERAS",
        paragraphs: [
          "Apri Scopri la Sardegna e scegli i comuni del Centro: da lì entri nelle schede paese. Poi guarda il calendario — weekend, sagre, Autunno in Barbagia — per essere lì quando le corti e le piazze si aprono.",
          "Cultura Sarda continuerà con altri approfondimenti; questo pezzo è il punto di partenza per chi cerca “Sardegna zona blu” e vuole uscire dallo slogan e arrivare ai luoghi.",
        ],
      },
    ],
    faqs: [
      {
        question: "La Sardegna è davvero una Blue Zone?",
        answer:
          "Sì: è una delle aree riconosciute negli studi sulle Blue Zone, soprattutto per i tassi di longevità in alcuni comuni dell’interno (Ogliastra e Barbagia), non per l’intera costa turistica.",
      },
      {
        question: "Quali paesi visitare per capire la zona blu?",
        answer:
          "Parti dall’Ogliastra e dalla Barbagia: Villagrande Strisaili, Baunei e i borghi collegati alle Cortes Apertas. Usa le guide paese su Scopri la Sardegna e il calendario eventi per date aggiornate.",
      },
      {
        question: "C’entra solo il cibo?",
        answer:
          "No. Cibo, movimento quotidiano e comunità contano insieme. Le feste di paese e le sagre sono parte di quella rete sociale, non un dettaglio folkloristico.",
      },
    ],
    publishedAt: "2026-09-16",
  },
];

export function findCulturaArticle(slug: string) {
  return CULTURA_ARTICLES.find((article) => article.slug === slug);
}

export function culturaArticleLinks() {
  return CULTURA_ARTICLES.map((article) => ({
    href: article.path,
    label: article.h1,
  }));
}
