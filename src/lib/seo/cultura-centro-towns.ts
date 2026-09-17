import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";

/**
 * 18 guide “in evidenza” sul Centro (stesso ruolo delle schede editoriali del Nord).
 * Ordine curato: capoluoghi, Barbagia, costa e centri di ricerca più frequenti.
 */
export const CENTRO_FEATURED_CULTURE_SLUGS = [
  "nuoro",
  "oristano",
  "bosa",
  "cabras",
  "orgosolo",
  "mamoiada",
  "oliena",
  "dorgali",
  "orosei",
  "baunei",
  "fonni",
  "tortoli",
  "lanusei",
  "siniscola",
  "macomer",
  "gavoi",
  "tonara",
  "aritzo",
] as const;

export const CENTRO_FEATURED_SLUG_SET = new Set<string>(
  CENTRO_FEATURED_CULTURE_SLUGS,
);

/** Guide Cultura generate per i 46 comuni del Centro Sardegna. */
export const CENTRO_CULTURE_TOWNS: CultureTownArticle[] = [
  {
    slug: "aritzo",
    path: "/cultura-sarda/centro-sardegna/aritzo",
    town: "Aritzo",
    province: "Nuoro",
    area: "Mandrolisai",
    title: "Aritzo: castagne e Mandrolisai",
    h1: "Aritzo",
    description: "Aritzo in Sardegna: guida al comune del Mandrolisai, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/aritzo-panorama.webp",
      alt: "Veduta di Aritzo in Sardegna",
      credit: {
        author: "Autore sconosciuto",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_di_Aritzo_(xilografia).jpg",
      },
    },
    intro: `Aritzo è paese delle castagne in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Aritzo su EVERAS.`,
    history: [
      `Aritzo è un comune italiano di 1 271 abitanti in provincia di Nuoro situato nell'antica regione della Barbagia di Belvì.`,
      `Oggi Aritzo resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Aritzo, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Sagra delle castagne e Autunno in Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Aritzo su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Mandrolisai intorno",
        body: `Aritzo si legge meglio insieme ai comuni vicini del Mandrolisai: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Aritzo",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e sentieri del Mandrolisai. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Aritzo?",
        answer: "Centro e sentieri del Mandrolisai. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Aritzo?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Aritzo su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "atzara",
    path: "/cultura-sarda/centro-sardegna/atzara",
    town: "Atzara",
    province: "Nuoro",
    area: "Mandrolisai",
    title: "Atzara: storia, tradizioni e cosa visitare",
    h1: "Atzara",
    description: "Atzara in Sardegna: guida al comune del Mandrolisai, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/atzara-panorama.webp",
      alt: "Veduta di Atzara in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Atzara_-_Costume_tradizionale_(11).JPG",
      },
    },
    intro: `Atzara è comune del Mandrolisai in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Atzara su EVERAS.`,
    history: [
      `Atzara è un comune italiano di 974 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Atzara resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Atzara, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Mandrolisai. Le date precise cambiano ogni anno: controlla il calendario eventi ad Atzara su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Mandrolisai intorno",
        body: `Atzara si legge meglio insieme ai comuni vicini del Mandrolisai: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Atzara",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Atzara e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Atzara?",
        answer: "il centro di Atzara e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Atzara?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Atzara su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "austis",
    path: "/cultura-sarda/centro-sardegna/austis",
    town: "Austis",
    province: "Nuoro",
    area: "Barbagia di Belvì",
    title: "Austis: storia, tradizioni e cosa visitare",
    h1: "Austis",
    description: "Austis in Sardegna: guida al comune della Barbagia di Belvì, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/austis-panorama.webp",
      alt: "Veduta di Austis in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Austis_-_Costume_tradizionale_(12).JPG",
      },
    },
    intro: `Austis è comune della Barbagia di Belvì in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Austis su EVERAS.`,
    history: [
      `Austis è un comune di 709 abitanti della provincia di Nuoro, in Sardegna. Si trova quasi nel centro esatto dell'isola.`,
      `Oggi Austis resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Austis, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia di Belvì. Le date precise cambiano ogni anno: controlla il calendario eventi ad Austis su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia di Belvì intorno",
        body: `Austis si legge meglio insieme ai comuni vicini della Barbagia di Belvì: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Austis",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Austis e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Austis?",
        answer: "il centro di Austis e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Austis?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Austis su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "baunei",
    path: "/cultura-sarda/centro-sardegna/baunei",
    town: "Baunei",
    province: "Nuoro",
    area: "Ogliastra",
    title: "Baunei: Golgo e Cala Goloritzé",
    h1: "Baunei",
    description: "Baunei in Sardegna: guida al comune dell'Ogliastra, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/baunei-panorama.webp",
      alt: "Veduta di Baunei in Sardegna",
      credit: {
        author: "fotografia di Rosanna C.",
        license: "CC BY 2.5",
        licenseUrl: "https://creativecommons.org/licenses/by/2.5",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Sardegna-Baunei-costa_sarda.jpg",
      },
    },
    intro: `Baunei è altopiano del Golgo e calette del golfo in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Baunei su EVERAS.`,
    history: [
      `Baunei è un comune italiano di 3 360 abitanti della provincia dell'Ogliastra nella subregione dell'Ogliastra nella Sardegna centro orientale.`,
      `Oggi Baunei resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Baunei, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Pastorizia d’altura e Ogliastra. Le date precise cambiano ogni anno: controlla il calendario eventi a Baunei su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "L'Ogliastra intorno",
        body: `Baunei si legge meglio insieme ai comuni vicini dell'Ogliastra: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Baunei",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Golgo, San Pietro e le calette accessibili via mare. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Baunei?",
        answer: "Golgo, San Pietro e le calette accessibili via mare. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Baunei?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Baunei su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "baressa",
    path: "/cultura-sarda/centro-sardegna/baressa",
    town: "Baressa",
    province: "Oristano",
    area: "Alta Marmilla",
    title: "Baressa: Alta Marmilla e sagra della mandorla",
    h1: "Baressa",
    description: "Baressa in Sardegna: guida al comune dell'Alta Marmilla, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/baressa-panorama.webp",
      alt: "Veduta di Baressa in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Baressa_-_Panorama_(03).jpg",
      },
    },
    intro: `Baressa è paese dell’Alta Marmilla in provincia di Oristano. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Baressa su EVERAS.`,
    history: [
      `Baressa è un comune italiano di 525 abitanti della provincia di Oristano in Sardegna, nella regione storica della Marmilla, vi ha sede il consorzio di agenzia di sviluppo locale "due giare" il quale abbraccia un territorio storico-geografica dell'Alta Marmilla, dei monti Arci e Grighine, il paese è noto per le numerose piante di mandorle esistenti nel suo territorio e per i "portali".`,
      `Oggi Baressa resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Baressa, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Sagra della mandorla e festa di paese. Le date precise cambiano ogni anno: controlla il calendario eventi a Baressa su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "L'Alta Marmilla intorno",
        body: `Baressa si legge meglio insieme ai comuni vicini dell'Alta Marmilla: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Baressa",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e territorio della Marmilla. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Baressa?",
        answer: "Centro e territorio della Marmilla. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Baressa?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Baressa su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "belvi",
    path: "/cultura-sarda/centro-sardegna/belvi",
    town: "Belvì",
    province: "Nuoro",
    area: "Barbagia di Belvì",
    title: "Belvì: storia, tradizioni e cosa visitare",
    h1: "Belvì",
    description: "Belvì in Sardegna: guida al comune della Barbagia di Belvì, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/belvi-panorama.webp",
      alt: "Veduta di Belvì in Sardegna",
      credit: {
        author: "mitra-houchmand",
        license: "CC BY 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by/2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tacco_ogliastra.jpg",
      },
    },
    intro: `Belvì è comune della Barbagia di Belvì in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Belvì su EVERAS.`,
    history: [
      `Belvì è un comune italiano di 520 abitanti della provincia di Nuoro, che dà il nome alla regione della Barbagia di Belvì.`,
      `Oggi Belvì resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Belvì, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia di Belvì. Le date precise cambiano ogni anno: controlla il calendario eventi a Belvì su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia di Belvì intorno",
        body: `Belvì si legge meglio insieme ai comuni vicini della Barbagia di Belvì: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Belvì",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Belvì e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Belvì?",
        answer: "il centro di Belvì e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Belvì?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Belvì su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "bitti",
    path: "/cultura-sarda/centro-sardegna/bitti",
    town: "Bitti",
    province: "Nuoro",
    area: "Barbagia",
    title: "Bitti: storia, tradizioni e cosa visitare",
    h1: "Bitti",
    description: "Bitti in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/bitti-panorama.webp",
      alt: "Veduta di Bitti in Sardegna",
      credit: {
        author: "The original uploader was Azzuffu at Italian Wikipedia.",
        license: "CC BY-SA 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Bitti_panorama_da_gurumuru.JPG",
      },
    },
    intro: `Bitti è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Bitti su EVERAS.`,
    history: [
      `Bitti è un comune italiano di 2 451 abitanti tra i più conosciuti della provincia di Nuoro nella subregione storica della Barbagia.`,
      `Oggi Bitti resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Bitti, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Bitti su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Bitti si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Bitti",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Bitti e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Bitti?",
        answer: "il centro di Bitti e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Bitti?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Bitti su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "bosa",
    path: "/cultura-sarda/centro-sardegna/bosa",
    town: "Bosa",
    province: "Oristano",
    area: "Planargia",
    title: "Bosa: castello, Temo e Planargia",
    h1: "Bosa",
    description: "Bosa in Sardegna: guida al comune della Planargia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/bosa-panorama.webp",
      alt: "Veduta di Bosa in Sardegna",
      credit: {
        author: "Calc",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_di_Bosa_(xilografia).jpg",
      },
    },
    intro: `Bosa è borgo sul Temo con castello Malaspina in provincia di Oristano. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Bosa su EVERAS.`,
    history: [
      `Bosa è un comune italiano di 7 257 abitanti della provincia di Oristano, nella costa occidentale del centro-nord della Sardegna. Fa parte dell'Unione di comuni della Planargia. È il principale centro abitato della subregione della Planargia e si inserisce, storicamente, nel più vasto territorio del Logudoro, condividendo con quest'ultimo l'utilizzo della variante linguistica del sardo logudorese. Durante il.`,
      `Oggi Bosa resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Bosa, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Malvasia, Carnevale e Planargia. Le date precise cambiano ogni anno: controlla il calendario eventi a Bosa su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Planargia intorno",
        body: `Bosa si legge meglio insieme ai comuni vicini della Planargia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Bosa",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Castello, Sa Costa e lungofiume. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Bosa?",
        answer: "Castello, Sa Costa e lungofiume. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Bosa?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Bosa su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "cabras",
    path: "/cultura-sarda/centro-sardegna/cabras",
    town: "Cabras",
    province: "Oristano",
    area: "Sinis",
    title: "Cabras: Sinis, Tharros e bottarga",
    h1: "Cabras",
    description: "Cabras in Sardegna: guida al comune del Sinis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/cabras-panorama.webp",
      alt: "Veduta di Cabras in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Cabras_-_Panorama_(02).JPG",
      },
    },
    intro: `Cabras è capitale del Sinis e della bottarga in provincia di Oristano. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Cabras su EVERAS.`,
    history: [
      `Cabras è un comune italiano di 8 721 abitanti della provincia di Oristano in Sardegna. Si trova nella regione del Campidano di Oristano sulla riva sinistra dello stagno chiamato stagno di Cabras o Mari Pontis, uno degli stagni più grandi d'Europa.`,
      `Oggi Cabras resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Cabras, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Corsa degli Scalzi e festa della bottarga. Le date precise cambiano ogni anno: controlla il calendario eventi a Cabras su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sinis intorno",
        body: `Cabras si legge meglio insieme ai comuni vicini del Sinis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Cabras",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Tharros, stagni e Museo Civico. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Cabras?",
        answer: "Tharros, stagni e Museo Civico. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Cabras?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Cabras su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "desulo",
    path: "/cultura-sarda/centro-sardegna/desulo",
    town: "Desulo",
    province: "Nuoro",
    area: "Barbagia di Belvì",
    title: "Desulo: costumi e Gennargentu",
    h1: "Desulo",
    description: "Desulo in Sardegna: guida al comune della Barbagia di Belvì, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/desulo-panorama.webp",
      alt: "Veduta di Desulo in Sardegna",
      credit: {
        author: "Autore sconosciuto",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_di_Desulo_(xilografia).jpg",
      },
    },
    intro: `Desulo è paese di montagna sul Gennargentu in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Desulo su EVERAS.`,
    history: [
      `Desulo è un comune italiano di 1 976 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Desulo resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Desulo, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Costumi tradizionali e Autunno in Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Desulo su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia di Belvì intorno",
        body: `Desulo si legge meglio insieme ai comuni vicini della Barbagia di Belvì: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Desulo",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e sentieri verso Bruncu Spina. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Desulo?",
        answer: "Centro e sentieri verso Bruncu Spina. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Desulo?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Desulo su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "dorgali",
    path: "/cultura-sarda/centro-sardegna/dorgali",
    town: "Dorgali",
    province: "Nuoro",
    area: "Baronia",
    title: "Dorgali: Grotta del Bue Marino e Golfo di Orosei",
    h1: "Dorgali",
    description: "Dorgali in Sardegna: guida al comune della Baronia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/dorgali-panorama.webp",
      alt: "Veduta di Dorgali in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Dorgali_-_Cala_Gonone_-_Panorama_(08).JPG",
      },
    },
    intro: `Dorgali è paese tra montagna e Golfo di Orosei in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Dorgali su EVERAS.`,
    history: [
      `Dorgali è un comune italiano di 8 217 abitanti della provincia di Nuoro. Con la sua superficie di 226,54 km² è l'ottavo comune della Sardegna, in ordine di estensione.`,
      `Oggi Dorgali resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Dorgali, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Filigrana, Cannonau e mare della Baronia. Le date precise cambiano ogni anno: controlla il calendario eventi a Dorgali su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Baronia intorno",
        body: `Dorgali si legge meglio insieme ai comuni vicini della Baronia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Dorgali",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Cala Gonone, grotte e centro di Dorgali. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Dorgali?",
        answer: "Cala Gonone, grotte e centro di Dorgali. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Dorgali?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Dorgali su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "fonni",
    path: "/cultura-sarda/centro-sardegna/fonni",
    town: "Fonni",
    province: "Nuoro",
    area: "Barbagia",
    title: "Fonni: il paese più alto della Sardegna",
    h1: "Fonni",
    description: "Fonni in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/fonni-panorama.webp",
      alt: "Veduta di Fonni in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Fonni_-_Urthos_e_Buttudos_(05).JPG",
      },
    },
    intro: `Fonni è il comune più alto dell’isola in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Fonni su EVERAS.`,
    history: [
      `Fonni è un comune italiano di 3 534 abitanti della provincia di Nuoro in Sardegna. Si trova nell'antica subregione storica della Barbagia di Ollolai.`,
      `Oggi Fonni resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Fonni, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Neve, pastorizia e feste di Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Fonni su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Fonni si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Fonni",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e porte verso Gennargentu e Bruncu Spina. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Fonni?",
        answer: "Centro e porte verso Gennargentu e Bruncu Spina. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Fonni?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Fonni su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "gadoni",
    path: "/cultura-sarda/centro-sardegna/gadoni",
    town: "Gadoni",
    province: "Nuoro",
    area: "Barbagia di Belvì",
    title: "Gadoni: storia, tradizioni e cosa visitare",
    h1: "Gadoni",
    description: "Gadoni in Sardegna: guida al comune della Barbagia di Belvì, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/gadoni-panorama.webp",
      alt: "Veduta di Gadoni in Sardegna",
      credit: {
        author: "Ferrero della Marmora, Alberto, conte, 1789-1863 Meneghini, Giuseppe, 1811-1889 Studiati, Cesare",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Voyage_en_Sardaigne,_de_1819_à_1825;_ou,_Description_statistique,_physique_et_politique_de_cette_île,_avec_des_recherches_sur_ses_productions_naturelles_et_ses_antiquités;_(IA_voyageensardaign31ferr).pdf",
      },
    },
    intro: `Gadoni è comune della Barbagia di Belvì in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Gadoni su EVERAS.`,
    history: [
      `Gadoni è un comune italiano di 628 abitanti della provincia di Nuoro, nella antica regione della Barbagia di Belvì.`,
      `Oggi Gadoni resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Gadoni, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia di Belvì. Le date precise cambiano ogni anno: controlla il calendario eventi a Gadoni su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia di Belvì intorno",
        body: `Gadoni si legge meglio insieme ai comuni vicini della Barbagia di Belvì: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Gadoni",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Gadoni e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Gadoni?",
        answer: "il centro di Gadoni e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Gadoni?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Gadoni su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "gavoi",
    path: "/cultura-sarda/centro-sardegna/gavoi",
    town: "Gavoi",
    province: "Nuoro",
    area: "Barbagia",
    title: "Gavoi: Isola delle Storie e lago",
    h1: "Gavoi",
    description: "Gavoi in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/gavoi-panorama.webp",
      alt: "Veduta di Gavoi in Sardegna",
      credit: {
        author: "Leontetudan",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Lucian_Dan_Teodorovici_at_Gavoi_(Sardegna).JPG",
      },
    },
    intro: `Gavoi è paese del festival Isola delle Storie in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Gavoi su EVERAS.`,
    history: [
      `Gavoi è un comune italiano di 2 392 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Gavoi resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Gavoi, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Letteratura, formaggio e Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Gavoi su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Gavoi si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Gavoi",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e lago di Gusana. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Gavoi?",
        answer: "Centro e lago di Gusana. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Gavoi?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Gavoi su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "girasole",
    path: "/cultura-sarda/centro-sardegna/girasole",
    town: "Girasole",
    province: "Nuoro",
    area: "Ogliastra",
    title: "Girasole: storia, tradizioni e cosa visitare",
    h1: "Girasole",
    description: "Girasole in Sardegna: guida al comune dell'Ogliastra, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/girasole-panorama.webp",
      alt: "Veduta di Girasole in Sardegna",
      credit: {
        author: "MZ14",
        license: "CC0",
        licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Villa_Girasole.jpg",
      },
    },
    intro: `Girasole è comune dell'Ogliastra in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Girasole su EVERAS.`,
    history: [
      `Il girasole comune è una pianta annuale con una grande infiorescenza a capolino appartenente alla famiglia delle Composite.`,
      `Oggi Girasole resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Girasole, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Ogliastra. Le date precise cambiano ogni anno: controlla il calendario eventi a Girasole su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "L'Ogliastra intorno",
        body: `Girasole si legge meglio insieme ai comuni vicini dell'Ogliastra: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Girasole",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Girasole e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Girasole?",
        answer: "il centro di Girasole e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Girasole?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Girasole su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "lanusei",
    path: "/cultura-sarda/centro-sardegna/lanusei",
    town: "Lanusei",
    province: "Nuoro",
    area: "Ogliastra",
    title: "Lanusei: Ogliastra interna",
    h1: "Lanusei",
    description: "Lanusei in Sardegna: guida al comune dell'Ogliastra, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/lanusei-panorama.webp",
      alt: "Veduta di Lanusei in Sardegna",
      credit: {
        author: "Autore sconosciuto",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_di_Lanusei_(xilografia).jpg",
      },
    },
    intro: `Lanusei è città vescovile dell’Ogliastra in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Lanusei su EVERAS.`,
    history: [
      `Lanusei è un comune italiano di 4 880 abitanti, capoluogo della provincia dell'Ogliastra in Sardegna. Risulta essere il capoluogo di provincia meno popoloso d'Italia.`,
      `Oggi Lanusei resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Lanusei, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Diocesi, festa e montagna ogliastrina. Le date precise cambiano ogni anno: controlla il calendario eventi a Lanusei su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "L'Ogliastra intorno",
        body: `Lanusei si legge meglio insieme ai comuni vicini dell'Ogliastra: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Lanusei",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro storico e belvedere sull’Ogliastra. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Lanusei?",
        answer: "Centro storico e belvedere sull’Ogliastra. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Lanusei?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Lanusei su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "lodine",
    path: "/cultura-sarda/centro-sardegna/lodine",
    town: "Lodine",
    province: "Nuoro",
    area: "Barbagia",
    title: "Lodine: storia, tradizioni e cosa visitare",
    h1: "Lodine",
    description: "Lodine in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/lodine-panorama.webp",
      alt: "Veduta di Lodine in Sardegna",
      credit: {
        author: "Granville, A. B. (Augustus Bozzi), 1783-1872",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:The_spas_of_England,_and_principal_sea-bathing_places._Northern_(Midland,_Southern)_spas_(IA_b33289529_0002).pdf",
      },
    },
    intro: `Lodine è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Lodine su EVERAS.`,
    history: [
      `Lodine è un comune italiano di 294 abitanti della provincia di Nuoro nella Barbagia di Ollolai.`,
      `Oggi Lodine resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Lodine, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Lodine su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Lodine si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Lodine",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Lodine e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Lodine?",
        answer: "il centro di Lodine e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Lodine?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Lodine su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "lollove",
    path: "/cultura-sarda/centro-sardegna/lollove",
    town: "Lollove",
    province: "Nuoro",
    area: "Nuorese",
    title: "Lollove: borgo vicino a Nuoro",
    h1: "Lollove",
    description: "Lollove in Sardegna: guida al comune del Nuorese, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/lollove-panorama.webp",
      alt: "Veduta di Lollove in Sardegna",
      credit: {
        author: "Air fans",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Scorcio_Lollove_12.jpg",
      },
    },
    intro: `Lollove è piccolo borgo del nuorese in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Lollove su EVERAS.`,
    history: [
      `Lollove è una frazione di Nuoro che dista circa 15 chilometri dal capoluogo. Nei documenti la si trova menzionata come Loloe, Lolove o Loloy. In lingua sarda è chiamata Lollobe.`,
      `Oggi Lollove resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Lollove, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Borgo e Autunno in Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Lollove su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Nuorese intorno",
        body: `Lollove si legge meglio insieme ai comuni vicini del Nuorese: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Lollove",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro storico di Lollove. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Lollove?",
        answer: "Centro storico di Lollove. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Lollove?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Lollove su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "lula",
    path: "/cultura-sarda/centro-sardegna/lula",
    town: "Lula",
    province: "Nuoro",
    area: "Barbagia",
    title: "Lula: storia, tradizioni e cosa visitare",
    h1: "Lula",
    description: "Lula in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/lula-panorama.webp",
      alt: "Veduta di Lula in Sardegna",
      credit: {
        author: "Lula Oficial",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:25.05.2026_-_Sessão_de_abertura_do_1º_Fórum_de_Reitores_Brasil_-_África_-_panorama.jpg",
      },
    },
    intro: `Lula è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Lula su EVERAS.`,
    history: [
      `Luiz Inácio Lula da Silva, nato Luiz Inácio da Silva e noto semplicemente come Lula, è un politico e sindacalista brasiliano, presidente del Brasile dal 1º gennaio 2023 al suo terzo mandato avendo ricoperto precedentemente la carica dal 2003 al 2011.`,
      `Oggi Lula resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Lula, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Lula su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Lula si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Lula",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Lula e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Lula?",
        answer: "il centro di Lula e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Lula?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Lula su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "macomer",
    path: "/cultura-sarda/centro-sardegna/macomer",
    town: "Macomer",
    province: "Nuoro",
    area: "Marghine",
    title: "Macomer: Marghine e crocevia",
    h1: "Macomer",
    description: "Macomer in Sardegna: guida al comune del Marghine, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/macomer-panorama.webp",
      alt: "Veduta di Macomer in Sardegna",
      credit: {
        author: "Japs 88",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_from_macomer.jpg",
      },
    },
    intro: `Macomer è crocevia del Marghine in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Macomer su EVERAS.`,
    history: [
      `Macomer, in sardo Macumère, è un comune italiano di 8 886 abitanti della provincia di Nuoro, situato a 563 metri sul livello del mare, alle pendici della catena del Marghine, di cui è il centro principale, arroccata sulle rive del rio S'Adde. Insignito del titolo di città, è inoltre il capoluogo dell'unione dei comuni del Marghine.`,
      `Oggi Macomer resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Macomer, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Fiera e paese di passaggio tra Nuoro e Oristano. Le date precise cambiano ogni anno: controlla il calendario eventi a Macomer su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Marghine intorno",
        body: `Macomer si legge meglio insieme ai comuni vicini del Marghine: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Macomer",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e territorio verso i nuraghi del Marghine. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Macomer?",
        answer: "Centro e territorio verso i nuraghi del Marghine. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Macomer?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Macomer su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "mamoiada",
    path: "/cultura-sarda/centro-sardegna/mamoiada",
    town: "Mamoiada",
    province: "Nuoro",
    area: "Barbagia",
    title: "Mamoiada: mamuthones e issohadores",
    h1: "Mamoiada",
    description: "Mamoiada in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/mamoiada-panorama.webp",
      alt: "Veduta di Mamoiada in Sardegna",
      credit: {
        author: "Raffaele Graziano Ballore",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Mamoiada_Panorama.jpg",
      },
    },
    intro: `Mamoiada è casa dei mamuthones in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Mamoiada su EVERAS.`,
    history: [
      `Mamoiada è un comune italiano di 2 343 abitanti della provincia di Nuoro, situato a 644 m s.l.m. nella Barbagia di Ollolai. Fa parte della IX Comunità montana Nuorese. Dista 15 km da Nuoro.`,
      `Oggi Mamoiada resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Mamoiada, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Carnevale e Autunno in Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Mamoiada su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Mamoiada si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Mamoiada",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Museo delle Maschere e centro. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Mamoiada?",
        answer: "Museo delle Maschere e centro. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Mamoiada?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Mamoiada su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "meana-sardo",
    path: "/cultura-sarda/centro-sardegna/meana-sardo",
    town: "Meana Sardo",
    province: "Nuoro",
    area: "Mandrolisai",
    title: "Meana Sardo: storia, tradizioni e cosa visitare",
    h1: "Meana Sardo",
    description: "Meana Sardo in Sardegna: guida al comune del Mandrolisai, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/meana-sardo-panorama.webp",
      alt: "Veduta di Meana Sardo in Sardegna",
      credit: {
        author: "Perdameana",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Il_Nuraghe_Nolza_e_Meana_Sardo_all'_orizzonte.jpg",
      },
    },
    intro: `Meana Sardo è comune del Mandrolisai in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Meana Sardo su EVERAS.`,
    history: [
      `Meana Sardo è un comune italiano di 1 501 abitanti della provincia di Nuoro nella regione della Barbagia di Belvì.`,
      `Oggi Meana Sardo resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Meana Sardo, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Mandrolisai. Le date precise cambiano ogni anno: controlla il calendario eventi a Meana Sardo su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Mandrolisai intorno",
        body: `Meana Sardo si legge meglio insieme ai comuni vicini del Mandrolisai: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Meana Sardo",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Meana Sardo e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Meana Sardo?",
        answer: "il centro di Meana Sardo e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Meana Sardo?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Meana Sardo su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "nuoro",
    path: "/cultura-sarda/centro-sardegna/nuoro",
    town: "Nuoro",
    province: "Nuoro",
    area: "Nuorese",
    title: "Nuoro: museo MAN, Deledda e Barbagia",
    h1: "Nuoro",
    description: "Nuoro in Sardegna: guida al comune del Nuorese, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/nuoro-panorama.webp",
      alt: "Veduta di Nuoro in Sardegna",
      credit: {
        author: "Herbert wie",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Parco_di_Colle_Sant'Onofrio_Nuoro_Sardinien.JPG",
      },
    },
    intro: `Nuoro è capitale culturale della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Nuoro su EVERAS.`,
    history: [
      `Nuoro è un comune italiano di 32 593 abitanti, capoluogo dell'omonima provincia della Sardegna centro-orientale dal 1927.`,
      `Oggi Nuoro resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Nuoro, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Autunno in Barbagia, letteratura e festa di San Francesco. Le date precise cambiano ogni anno: controlla il calendario eventi a Nuoro su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Nuorese intorno",
        body: `Nuoro si legge meglio insieme ai comuni vicini del Nuorese: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Nuoro",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Museo MAN, museo Deledda e centro storico. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Nuoro?",
        answer: "Museo MAN, museo Deledda e centro storico. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Nuoro?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Nuoro su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "oliena",
    path: "/cultura-sarda/centro-sardegna/oliena",
    town: "Oliena",
    province: "Nuoro",
    area: "Barbagia",
    title: "Oliena: Cannonau e Supramonte",
    h1: "Oliena",
    description: "Oliena in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/oliena-panorama.webp",
      alt: "Veduta di Oliena in Sardegna",
      credit: {
        author: "Olianese",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_di_Oliena_dal_Monte_Ortobene.jpg",
      },
    },
    intro: `Oliena è paese del Cannonau ai piedi del Corrasi in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Oliena su EVERAS.`,
    history: [
      `Oliena è un comune italiano di 6 364 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Oliena resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Oliena, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Vino, festa e Barbagia di Ollolai. Le date precise cambiano ogni anno: controlla il calendario eventi ad Oliena su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Oliena si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Oliena",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro, cantine e porte sul Supramonte. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Oliena?",
        answer: "Centro, cantine e porte sul Supramonte. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Oliena?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Oliena su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "ollolai",
    path: "/cultura-sarda/centro-sardegna/ollolai",
    town: "Ollolai",
    province: "Nuoro",
    area: "Barbagia",
    title: "Ollolai: storia, tradizioni e cosa visitare",
    h1: "Ollolai",
    description: "Ollolai in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/ollolai-panorama.webp",
      alt: "Veduta di Ollolai in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Ollolai_-_Costume_tradizionale_(13).JPG",
      },
    },
    intro: `Ollolai è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Ollolai su EVERAS.`,
    history: [
      `Ollolai è un comune italiano di 1 127 abitanti della provincia di Nuoro in Sardegna. Antica sede di curatoria e centro principale dell'omonima Barbagia, il suo territorio si estende su una superficie di 2 734 ettari. Posto a 920 metri di quota, è il secondo comune più elevato della Sardegna.`,
      `Oggi Ollolai resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Ollolai, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Ollolai su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Ollolai si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Ollolai",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Ollolai e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Ollolai?",
        answer: "il centro di Ollolai e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Ollolai?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Ollolai su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "olzai",
    path: "/cultura-sarda/centro-sardegna/olzai",
    town: "Olzai",
    province: "Nuoro",
    area: "Barbagia",
    title: "Olzai: storia, tradizioni e cosa visitare",
    h1: "Olzai",
    description: "Olzai in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/olzai-panorama.webp",
      alt: "Veduta di Olzai in Sardegna",
      credit: {
        author: "Sardu soe",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Olzai_-_panorama.jpg",
      },
    },
    intro: `Olzai è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Olzai su EVERAS.`,
    history: [
      `Olzai è un comune italiano di 753 abitanti della provincia di Nuoro, nella regione della Barbagia di Ollolai`,
      `Oggi Olzai resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Olzai, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Olzai su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Olzai si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Olzai",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Olzai e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Olzai?",
        answer: "il centro di Olzai e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Olzai?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Olzai su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "onani",
    path: "/cultura-sarda/centro-sardegna/onani",
    town: "Onanì",
    province: "Nuoro",
    area: "Barbagia",
    title: "Onanì: storia, tradizioni e cosa visitare",
    h1: "Onanì",
    description: "Onanì in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/onani-panorama.webp",
      alt: "Veduta di Onanì in Sardegna",
      credit: {
        author: "Aggrucar",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Onanì_15.jpg",
      },
    },
    intro: `Onanì è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Onanì su EVERAS.`,
    history: [
      `Onanì è un comune italiano di 339 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Onanì resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Onanì, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Onanì su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Onanì si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Onanì",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Onanì e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Onanì?",
        answer: "il centro di Onanì e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Onanì?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Onanì su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "oniferi",
    path: "/cultura-sarda/centro-sardegna/oniferi",
    town: "Oniferi",
    province: "Nuoro",
    area: "Barbagia",
    title: "Oniferi: storia, tradizioni e cosa visitare",
    h1: "Oniferi",
    description: "Oniferi in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/oniferi-panorama.webp",
      alt: "Veduta di Oniferi in Sardegna",
      credit: {
        author: "Aggrucar",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_di_Oniferi.jpg",
      },
    },
    intro: `Oniferi è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Oniferi su EVERAS.`,
    history: [
      `Oniferi è un comune italiano di 829 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Oniferi resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Oniferi, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Oniferi su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Oniferi si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Oniferi",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Oniferi e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Oniferi?",
        answer: "il centro di Oniferi e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Oniferi?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Oniferi su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "orani",
    path: "/cultura-sarda/centro-sardegna/orani",
    town: "Orani",
    province: "Nuoro",
    area: "Barbagia",
    title: "Orani: Nivola e Barbagia",
    h1: "Orani",
    description: "Orani in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/orani-panorama.webp",
      alt: "Veduta di Orani in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Orani,_panorama_(08).jpg",
      },
    },
    intro: `Orani è paese di Costantino Nivola in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Orani su EVERAS.`,
    history: [
      `Orani è un comune del Centro Sardegna, nella zona storica della Barbagia. Come molti paesi dell’interno, tiene insieme memoria agro-pastorale, chiese e un centro che si vive soprattutto nelle feste.`,
      `Oggi Orani resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Orani, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Arte contemporanea e Autunno in Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Orani su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Orani si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Orani",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Museo Nivola e centro. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Orani?",
        answer: "Museo Nivola e centro. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Orani?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Orani su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "orgosolo",
    path: "/cultura-sarda/centro-sardegna/orgosolo",
    town: "Orgosolo",
    province: "Nuoro",
    area: "Barbagia",
    title: "Orgosolo: murales e Supramonte",
    h1: "Orgosolo",
    description: "Orgosolo in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/orgosolo-panorama.webp",
      alt: "Veduta di Orgosolo in Sardegna",
      credit: {
        author: "Lamberto Zannotti",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Orgosolo_Panorama_-_panoramio.jpg",
      },
    },
    intro: `Orgosolo è paese dei murales sul Supramonte in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Orgosolo su EVERAS.`,
    history: [
      `Orgosolo è un comune italiano di 3 784 abitanti, che si trova a 620 metri sul livello del mare in provincia di Nuoro, nella regione della Barbagia di Nuoro.`,
      `Oggi Orgosolo resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Orgosolo, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Canto a tenore e memoria pastorale. Le date precise cambiano ogni anno: controlla il calendario eventi ad Orgosolo su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Orgosolo si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Orgosolo",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Murales del centro e porte sul Supramonte. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Orgosolo?",
        answer: "Murales del centro e porte sul Supramonte. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Orgosolo?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Orgosolo su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "oristano",
    path: "/cultura-sarda/centro-sardegna/oristano",
    town: "Oristano",
    province: "Oristano",
    area: "Oristanese",
    title: "Oristano: Sartiglia e Sinis",
    h1: "Oristano",
    description: "Oristano in Sardegna: guida al comune del Oristanese, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/oristano-panorama.webp",
      alt: "Veduta di Oristano in Sardegna",
      credit: {
        author: "Leop81 at Italian Wikipedia",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama-Scano_di_Montiferro.jpg",
      },
    },
    intro: `Oristano è città della Sartiglia e porta sul Sinis in provincia di Oristano. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Oristano su EVERAS.`,
    history: [
      `Oristano è un comune italiano di 29 787 abitanti capoluogo dell'omonima provincia, situato nella Sardegna centro-occidentale.`,
      `Oggi Oristano resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Oristano, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Sartiglia, san Giovanni e mare di Torre Grande. Le date precise cambiano ogni anno: controlla il calendario eventi ad Oristano su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori. Storia e rito della giostra stanno nell’articolo Cultura Sarda.`,
      },
      {
        title: "Sardegna Cavalli e la SOE",
        body: `A Sa Rodia la Società Oristanese di Equitazione ospita Sardegna Cavalli: rassegna sportiva e culturale sul mondo equestre, non la giostra di Carnevale. L’edizione resta in scheda su EVERAS anche dopo la chiusura. Storia, sede e differenza con la Sartiglia stanno nell’articolo Cultura Sarda.`,
      },
      {
        title: "Il Oristanese intorno",
        body: `Oristano si legge meglio insieme ai comuni vicini del Oristanese: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Oristano",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro storico, Torre di Mariano e museo antiquarium. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Oristano?",
        answer: "Centro storico, Torre di Mariano e museo antiquarium. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Oristano?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Oristano su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "orosei",
    path: "/cultura-sarda/centro-sardegna/orosei",
    town: "Orosei",
    province: "Nuoro",
    area: "Baronia",
    title: "Orosei: Baronia e spiagge",
    h1: "Orosei",
    description: "Orosei in Sardegna: guida al comune della Baronia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/orosei-panorama.webp",
      alt: "Veduta di Orosei in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Orosei_-_Panorama_(04).JPG",
      },
    },
    intro: `Orosei è paese della Baronia sul Cedrino in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Orosei su EVERAS.`,
    history: [
      `Orosei è un comune italiano di 6 821 abitanti della provincia di Nuoro in Sardegna. Si trova nell'antica subregione storica delle Baronie, un tempo inclusa in quel che era la Gallura inferiore e presta il nome al golfo di cui è al centro.`,
      `Oggi Orosei resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Orosei, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Festa di Nostra Signora del Rimedio. Le date precise cambiano ogni anno: controlla il calendario eventi ad Orosei su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Baronia intorno",
        body: `Orosei si legge meglio insieme ai comuni vicini della Baronia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Orosei",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro storico e spiagge verso Osalla e Bidderosa. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Orosei?",
        answer: "Centro storico e spiagge verso Osalla e Bidderosa. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Orosei?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Orosei su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "orotelli",
    path: "/cultura-sarda/centro-sardegna/orotelli",
    town: "Orotelli",
    province: "Nuoro",
    area: "Barbagia",
    title: "Orotelli: storia, tradizioni e cosa visitare",
    h1: "Orotelli",
    description: "Orotelli in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/orotelli-panorama.webp",
      alt: "Veduta di Orotelli in Sardegna",
      credit: {
        author: "Saikindi",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Orotelli-panorama.jpg",
      },
    },
    intro: `Orotelli è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Orotelli su EVERAS.`,
    history: [
      `Orotelli è un comune italiano di 1 823 abitanti della provincia di Nuoro, a circa 18 km dal capoluogo di provincia, nella storica subregione della Barbagia. Confina con i comuni di Bono, Benetutti, Bottidda, Illorai, nella città metropolitana di Sassari, e Oniferi e Orani, nella stessa provincia di Nuoro. Dal 2012 Orotelli è entrato a far parte dell'associazione Borghi Autentici d'Italia.`,
      `Oggi Orotelli resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Orotelli, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Orotelli su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Orotelli si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Orotelli",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Orotelli e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Orotelli?",
        answer: "il centro di Orotelli e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Orotelli?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Orotelli su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "ortueri",
    path: "/cultura-sarda/centro-sardegna/ortueri",
    town: "Ortueri",
    province: "Nuoro",
    area: "Mandrolisai",
    title: "Ortueri: storia, tradizioni e cosa visitare",
    h1: "Ortueri",
    description: "Ortueri in Sardegna: guida al comune del Mandrolisai, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/ortueri-panorama.webp",
      alt: "Veduta di Ortueri in Sardegna",
      credit: {
        author: "Publications Office of the European Union",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:OJ_L_202302396_of_2023_-_SV_Swedish.pdf",
      },
    },
    intro: `Ortueri è comune del Mandrolisai in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Ortueri su EVERAS.`,
    history: [
      `Ortueri è un comune italiano situato nella Barbagia del Mandrolisai di 950 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Ortueri resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Ortueri, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Mandrolisai. Le date precise cambiano ogni anno: controlla il calendario eventi ad Ortueri su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Mandrolisai intorno",
        body: `Ortueri si legge meglio insieme ai comuni vicini del Mandrolisai: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Ortueri",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Ortueri e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Ortueri?",
        answer: "il centro di Ortueri e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Ortueri?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Ortueri su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "orune",
    path: "/cultura-sarda/centro-sardegna/orune",
    town: "Orune",
    province: "Nuoro",
    area: "Barbagia",
    title: "Orune: storia, tradizioni e cosa visitare",
    h1: "Orune",
    description: "Orune in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/orune-panorama.webp",
      alt: "Veduta di Orune in Sardegna",
      credit: {
        author: "Sardoos",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Vista_su_Orune.jpg",
      },
    },
    intro: `Orune è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Orune su EVERAS.`,
    history: [
      `Orune è un comune italiano di 1 998 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Orune resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Orune, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Orune su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Orune si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Orune",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Orune e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Orune?",
        answer: "il centro di Orune e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Orune?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Orune su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "ottana",
    path: "/cultura-sarda/centro-sardegna/ottana",
    town: "Ottana",
    province: "Nuoro",
    area: "Barbagia",
    title: "Ottana: boes e merdules",
    h1: "Ottana",
    description: "Ottana in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/ottana-panorama.webp",
      alt: "Veduta di Ottana in Sardegna",
      credit: {
        author: "Manuel M",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Ottana.JPG",
      },
    },
    intro: `Ottana è paese delle maschere boes e merdules in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Ottana su EVERAS.`,
    history: [
      `Ottana è un comune italiano di 2 138 abitanti della provincia di Nuoro.`,
      `Oggi Ottana resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Ottana, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Carnevale e festa in Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Ottana su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Ottana si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Ottana",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e territorio della piana. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Ottana?",
        answer: "Centro e territorio della piana. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Ottana?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Ottana su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "ovodda",
    path: "/cultura-sarda/centro-sardegna/ovodda",
    town: "Ovodda",
    province: "Nuoro",
    area: "Barbagia",
    title: "Ovodda: storia, tradizioni e cosa visitare",
    h1: "Ovodda",
    description: "Ovodda in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/ovodda-panorama.webp",
      alt: "Veduta di Ovodda in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Ovodda_-_Costume_tradizionale_(19).jpg",
      },
    },
    intro: `Ovodda è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Ovodda su EVERAS.`,
    history: [
      `Ovodda è un comune italiano di 1 425 abitanti situato nella provincia di Nuoro in Sardegna.`,
      `Oggi Ovodda resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Ovodda, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi ad Ovodda su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Ovodda si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Ovodda",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Ovodda e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Ovodda?",
        answer: "il centro di Ovodda e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Ovodda?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Ovodda su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "santa-maria-navarrese",
    path: "/cultura-sarda/centro-sardegna/santa-maria-navarrese",
    town: "Santa Maria Navarrese",
    province: "Nuoro",
    area: "Ogliastra",
    title: "Santa Maria Navarrese: Ogliastra sul mare",
    h1: "Santa Maria Navarrese",
    description: "Santa Maria Navarrese in Sardegna: guida al comune dell'Ogliastra, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/santa-maria-navarrese-panorama.webp",
      alt: "Veduta di Santa Maria Navarrese in Sardegna",
      credit: {
        author: "fotografia di Rosanna C.",
        license: "CC BY 2.5",
        licenseUrl: "https://creativecommons.org/licenses/by/2.5",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Santa_Maria_Navarrese-4.jpg",
      },
    },
    intro: `Santa Maria Navarrese è frazione marina di Baunei in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Santa Maria Navarrese su EVERAS.`,
    history: [
      `Santa Maria Navarrese è l'unica frazione di Baunei, nella provincia dell'Ogliastra: conta circa 1 450 abitanti. È situata sulla costa centro-orientale della Sardegna, a circa 150 km a nord di Cagliari, e 160 km a sud di Olbia.`,
      `Oggi Santa Maria Navarrese resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Santa Maria Navarrese, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Estate in costa ogliastrina. Le date precise cambiano ogni anno: controlla il calendario eventi a Santa Maria Navarrese su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "L'Ogliastra intorno",
        body: `Santa Maria Navarrese si legge meglio insieme ai comuni vicini dell'Ogliastra: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Santa Maria Navarrese",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Spiaggia, olivastri e porto. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Santa Maria Navarrese?",
        answer: "Spiaggia, olivastri e porto. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Santa Maria Navarrese?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Santa Maria Navarrese su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "sarule",
    path: "/cultura-sarda/centro-sardegna/sarule",
    town: "Sarule",
    province: "Nuoro",
    area: "Barbagia",
    title: "Sarule: storia, tradizioni e cosa visitare",
    h1: "Sarule",
    description: "Sarule in Sardegna: guida al comune della Barbagia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/sarule-panorama.webp",
      alt: "Veduta di Sarule in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Sarule,_panorama_(02).jpg",
      },
    },
    intro: `Sarule è comune della Barbagia in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Sarule su EVERAS.`,
    history: [
      `Sarule è un comune italiano di 1 436 abitanti della provincia di Nuoro che si trova a 630 metri sul livello del mare nella Barbagia di Ollolai.`,
      `Oggi Sarule resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Sarule, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Sarule su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia intorno",
        body: `Sarule si legge meglio insieme ai comuni vicini della Barbagia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Sarule",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Sarule e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Sarule?",
        answer: "il centro di Sarule e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Sarule?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Sarule su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "scano-di-montiferro",
    path: "/cultura-sarda/centro-sardegna/scano-di-montiferro",
    town: "Scano di Montiferro",
    province: "Oristano",
    area: "Montiferru",
    title: "Scano di Montiferro: Montiferru",
    h1: "Scano di Montiferro",
    description: "Scano di Montiferro in Sardegna: guida al comune del Montiferru, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/scano-di-montiferro-panorama.webp",
      alt: "Veduta di Scano di Montiferro in Sardegna",
      credit: {
        author: "Air fans",
        license: "CC0",
        licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Scano_di_Montiferro_9.jpg",
      },
    },
    intro: `Scano di Montiferro è paese del Montiferru in provincia di Oristano. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Scano di Montiferro su EVERAS.`,
    history: [
      `Scano di Montiferro è un comune italiano di 1 337 abitanti della provincia di Oristano in Sardegna.`,
      `Oggi Scano di Montiferro resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Scano di Montiferro, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Olio, bue rosso e festa. Le date precise cambiano ogni anno: controlla il calendario eventi a Scano di Montiferro su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Montiferru intorno",
        body: `Scano di Montiferro si legge meglio insieme ai comuni vicini del Montiferru: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Scano di Montiferro",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e colline del Montiferru. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Scano di Montiferro?",
        answer: "Centro e colline del Montiferru. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Scano di Montiferro?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Scano di Montiferro su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "seneghe",
    path: "/cultura-sarda/centro-sardegna/seneghe",
    town: "Seneghe",
    province: "Oristano",
    area: "Montiferru",
    title: "Seneghe: olio e Montiferru",
    h1: "Seneghe",
    description: "Seneghe in Sardegna: guida al comune del Montiferru, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/seneghe-panorama.webp",
      alt: "Veduta di Seneghe in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Seneghe_-_Panorama_(03).JPG",
      },
    },
    intro: `Seneghe è paese dell’olio nel Montiferru in provincia di Oristano. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Seneghe su EVERAS.`,
    history: [
      `Seneghe è un comune italiano di 1 576 abitanti della provincia di Oristano in Sardegna. Il comune è situato a 305 metri s.l.m. sul versante orientale del Montiferru.`,
      `Oggi Seneghe resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Seneghe, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Olio extravergine e festa. Le date precise cambiano ogni anno: controlla il calendario eventi a Seneghe su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Montiferru intorno",
        body: `Seneghe si legge meglio insieme ai comuni vicini del Montiferru: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Seneghe",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e frantoi. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Seneghe?",
        answer: "Centro e frantoi. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Seneghe?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Seneghe su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "siniscola",
    path: "/cultura-sarda/centro-sardegna/siniscola",
    town: "Siniscola",
    province: "Nuoro",
    area: "Baronia",
    title: "Siniscola: Baronia e Capo Comino",
    h1: "Siniscola",
    description: "Siniscola in Sardegna: guida al comune della Baronia, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/siniscola-panorama.webp",
      alt: "Veduta di Siniscola in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Siniscola_-_Chiesa_di_Sant'Efisio_(03).jpg",
      },
    },
    intro: `Siniscola è comune della Baronia verso Capo Comino in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Siniscola su EVERAS.`,
    history: [
      `Siniscola è un comune italiano di 11 148 abitanti della costa orientale della Sardegna, in provincia di Nuoro, nella subregione storica delle Baronie, della quale rappresenta il centro più importante.`,
      `Oggi Siniscola resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Siniscola, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Mare d’estate e paese dell’interno. Le date precise cambiano ogni anno: controlla il calendario eventi a Siniscola su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Baronia intorno",
        body: `Siniscola si legge meglio insieme ai comuni vicini della Baronia: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Siniscola",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: La Caletta, Capo Comino e centro. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Siniscola?",
        answer: "La Caletta, Capo Comino e centro. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Siniscola?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Siniscola su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "sorgono",
    path: "/cultura-sarda/centro-sardegna/sorgono",
    town: "Sorgono",
    province: "Nuoro",
    area: "Mandrolisai",
    title: "Sorgono: Mandrolisai e Mandrolisai DOC",
    h1: "Sorgono",
    description: "Sorgono in Sardegna: guida al comune del Mandrolisai, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/sorgono-panorama.webp",
      alt: "Veduta di Sorgono in Sardegna",
      credit: {
        author: "User:Ro.Sa",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Sorgono.jpg",
      },
    },
    intro: `Sorgono è cuore del Mandrolisai in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Sorgono su EVERAS.`,
    history: [
      `Sorgono è un comune italiano di 1 435 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Sorgono resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Sorgono, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Vino, Autunno in Barbagia e Mandrolisai. Le date precise cambiano ogni anno: controlla il calendario eventi a Sorgono su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Mandrolisai intorno",
        body: `Sorgono si legge meglio insieme ai comuni vicini del Mandrolisai: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Sorgono",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e cantine del Mandrolisai. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Sorgono?",
        answer: "Centro e cantine del Mandrolisai. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Sorgono?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Sorgono su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "tiana",
    path: "/cultura-sarda/centro-sardegna/tiana",
    town: "Tiana",
    province: "Nuoro",
    area: "Barbagia di Belvì",
    title: "Tiana: storia, tradizioni e cosa visitare",
    h1: "Tiana",
    description: "Tiana in Sardegna: guida al comune della Barbagia di Belvì, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/tiana-panorama.webp",
      alt: "Veduta di Tiana in Sardegna",
      credit: {
        author: "Istudente",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tiana_vista_dalla_strada_per_Teti.JPG",
      },
    },
    intro: `Tiana è comune della Barbagia di Belvì in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Tiana su EVERAS.`,
    history: [
      `Tiana è un comune italiano di 410 abitanti della provincia di Nuoro in Sardegna. Si trova nella subregione storica della Barbagia di Ollolai ed è distante pochissimi chilometri dall'esatto centro geografico della Sardegna che si trova nel territorio del confinante comune di Sorgono.`,
      `Oggi Tiana resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Tiana, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia di Belvì. Le date precise cambiano ogni anno: controlla il calendario eventi a Tiana su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia di Belvì intorno",
        body: `Tiana si legge meglio insieme ai comuni vicini della Barbagia di Belvì: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Tiana",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Tiana e il territorio comunale. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Tiana?",
        answer: "il centro di Tiana e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Tiana?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Tiana su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "tonara",
    path: "/cultura-sarda/centro-sardegna/tonara",
    town: "Tonara",
    province: "Nuoro",
    area: "Barbagia di Belvì",
    title: "Tonara: torrone e Barbagia di Belvì",
    h1: "Tonara",
    description: "Tonara in Sardegna: guida al comune della Barbagia di Belvì, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/tonara-panorama.webp",
      alt: "Veduta di Tonara in Sardegna",
      credit: {
        author: "Ferrero della Marmora, Alberto, conte, 1789-1863 Meneghini, Giuseppe, 1811-1889 Studiati, Cesare",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Voyage_en_Sardaigne,_de_1819_à_1825;_ou,_Description_statistique,_physique_et_politique_de_cette_île,_avec_des_recherches_sur_ses_productions_naturelles_et_ses_antiquités;_(IA_voyageensardaign31ferr).pdf",
      },
    },
    intro: `Tonara è paese del torrone in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Tonara su EVERAS.`,
    history: [
      `Tonara è un comune italiano di 1 839 abitanti della provincia di Nuoro in Sardegna.`,
      `Oggi Tonara resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Tonara, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Torrone, festa e Mandrolisai-Barbagia. Le date precise cambiano ogni anno: controlla il calendario eventi a Tonara su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia di Belvì intorno",
        body: `Tonara si legge meglio insieme ai comuni vicini della Barbagia di Belvì: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Tonara",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Laboratori del torrone e centro. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Tonara?",
        answer: "Laboratori del torrone e centro. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Tonara?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Tonara su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
  {
    slug: "tortoli",
    path: "/cultura-sarda/centro-sardegna/tortoli",
    town: "Tortolì",
    province: "Nuoro",
    area: "Ogliastra",
    title: "Tortolì: Ogliastra e Arbatax",
    h1: "Tortolì",
    description: "Tortolì in Sardegna: guida al comune dell'Ogliastra, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/tortoli-panorama.webp",
      alt: "Veduta di Tortolì in Sardegna",
      credit: {
        author: "Autore sconosciuto",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_di_Tortolì_(xilografia).jpg",
      },
    },
    intro: `Tortolì è capoluogo dell’Ogliastra verso Arbatax in provincia di Nuoro. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Tortolì su EVERAS.`,
    history: [
      `Tortolì è un comune italiano di 10 988 abitanti capoluogo, insieme a Lanusei, della provincia dell'Ogliastra in Sardegna. La città è il centro più popoloso e importante della provincia.`,
      `Oggi Tortolì resta un punto della directory Cultura sarda del Centro: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Tortolì, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Porto, festa e costa ogliastrina. Le date precise cambiano ogni anno: controlla il calendario eventi a Tortolì su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "L'Ogliastra intorno",
        body: `Tortolì si legge meglio insieme ai comuni vicini dell'Ogliastra: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Centro Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Tortolì",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Arbatax, rocce rosse e centro di Tortolì. Se cerchi spiagge, nuraghi o santuari, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Tortolì?",
        answer: "Arbatax, rocce rosse e centro di Tortolì. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Tortolì?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Tortolì su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-13",
  },
];
