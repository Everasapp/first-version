import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";

/**
 * 18 guide “in evidenza” sul Sud (stesso ruolo delle schede editoriali del Nord).
 * Ordine curato: Cagliari, costa, Sulcis, UNESCO e centri più cercati.
 */
export const SUD_FEATURED_CULTURE_SLUGS = [
  "cagliari",
  "quartu-sant-elena",
  "pula",
  "villasimius",
  "domus-de-maria",
  "carbonia",
  "iglesias",
  "carloforte",
  "sant-antioco",
  "barumini",
  "muravera",
  "decimomannu",
  "guspini",
  "selargius",
  "assemini",
  "capoterra",
  "sinnai",
  "san-sperate",
] as const;

export const SUD_FEATURED_SLUG_SET = new Set<string>(
  SUD_FEATURED_CULTURE_SLUGS,
);

/** Guide Cultura generate per i 84 comuni del Sud Sardegna. */
export const SUD_CULTURE_TOWNS: CultureTownArticle[] = [
  {
    slug: "armungia",
    path: "/cultura-sarda/sud-sardegna/armungia",
    town: "Armungia",
    province: "Cagliari",
    area: "Gerrei",
    title: "Armungia: storia, tradizioni e cosa visitare",
    h1: "Armungia",
    description: "Armungia in Sardegna: guida al comune del Gerrei, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/armungia-panorama.webp",
      alt: "Veduta di Armungia in Sardegna",
      credit: {
        author: "Pjt56 --- If you use the picture outside Wikipedia I would appreciate a short e-mail to pjt56@gmx.net or a message…",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:ArmungiaNuraghe-pjt.jpg",
      },
    },
    intro: `Armungia è comune del Gerrei in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Armungia su EVERAS.`,
    history: [
      `Armungia è un comune italiano di 391 abitanti della città metropolitana di Cagliari in Sardegna. Sorge su un colle di 366 metri sul livello del mare nella subregione del Gerrei. Dista circa 65 km da Cagliari.`,
      `Oggi Armungia resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Armungia, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Gerrei. Le date precise cambiano ogni anno: controlla il calendario eventi ad Armungia su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Gerrei intorno",
        body: `Armungia si legge meglio insieme ai comuni vicini del Gerrei: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Armungia",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Armungia e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Armungia?",
        answer: "il centro di Armungia e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Armungia?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Armungia su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "assemini",
    path: "/cultura-sarda/sud-sardegna/assemini",
    town: "Assemini",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Assemini: ceramica e Campidano",
    h1: "Assemini",
    description: "Assemini in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/assemini-panorama.webp",
      alt: "Veduta di Assemini in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Assemini_-_Costume_tradizionale_(11).JPG",
      },
    },
    intro: `Assemini è paese della ceramica nel Campidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Assemini su EVERAS.`,
    history: [
      `Assemini è un comune italiano di 25 563 abitanti della città metropolitana di Cagliari in Sardegna. È classificato secondo gli standard turistici come \"Paese di antica tradizione della ceramica\".`,
      `Oggi Assemini resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Assemini, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Ceramica, festa e Campidano. Le date precise cambiano ogni anno: controlla il calendario eventi ad Assemini su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Assemini si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Assemini",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e laboratori di ceramica. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Assemini?",
        answer: "Centro e laboratori di ceramica. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Assemini?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Assemini su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "ballao",
    path: "/cultura-sarda/sud-sardegna/ballao",
    town: "Ballao",
    province: "Cagliari",
    area: "Gerrei",
    title: "Ballao: storia, tradizioni e cosa visitare",
    h1: "Ballao",
    description: "Ballao in Sardegna: guida al comune del Gerrei, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/ballao-panorama.webp",
      alt: "Veduta di Ballao in Sardegna",
      credit: {
        author: "acrissantu",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Maria_Maddalena_Ballao.jpg",
      },
    },
    intro: `Ballao è comune del Gerrei in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Ballao su EVERAS.`,
    history: [
      `Ballao è un comune italiano di 702 abitanti della Città metropolitana di Cagliari.`,
      `Oggi Ballao resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Ballao, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Gerrei. Le date precise cambiano ogni anno: controlla il calendario eventi a Ballao su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Gerrei intorno",
        body: `Ballao si legge meglio insieme ai comuni vicini del Gerrei: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Ballao",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Ballao e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Ballao?",
        answer: "il centro di Ballao e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Ballao?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Ballao su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "barrali",
    path: "/cultura-sarda/sud-sardegna/barrali",
    town: "Barrali",
    province: "Cagliari",
    area: "Trexenta",
    title: "Barrali: storia, tradizioni e cosa visitare",
    h1: "Barrali",
    description: "Barrali in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/barrali-panorama.webp",
      alt: "Veduta di Barrali in Sardegna",
      credit: {
        author: "MOSSOT",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Lucéram_-_Place_Adrien_Barralis_-4.JPG",
      },
    },
    intro: `Barrali è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Barrali su EVERAS.`,
    history: [
      `Barrali è un comune italiano di 1 072 abitanti della Città metropolitana di Cagliari.`,
      `Oggi Barrali resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Barrali, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Barrali su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Barrali si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Barrali",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Barrali e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Barrali?",
        answer: "il centro di Barrali e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Barrali?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Barrali su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "burcei",
    path: "/cultura-sarda/sud-sardegna/burcei",
    town: "Burcei",
    province: "Cagliari",
    area: "Sarrabus",
    title: "Burcei: storia, tradizioni e cosa visitare",
    h1: "Burcei",
    description: "Burcei in Sardegna: guida al comune del Sarrabus, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/burcei-panorama.webp",
      alt: "Veduta di Burcei in Sardegna",
      credit: {
        author: "piantisergio",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Nostra_Signora_Monserrato_Burcei.jpg",
      },
    },
    intro: `Burcei è comune del Sarrabus in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Burcei su EVERAS.`,
    history: [
      `Burcei è un comune italiano di 2 553 abitanti della città metropolitana di Cagliari.`,
      `Oggi Burcei resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Burcei, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarrabus. Le date precise cambiano ogni anno: controlla il calendario eventi a Burcei su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarrabus intorno",
        body: `Burcei si legge meglio insieme ai comuni vicini del Sarrabus: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Burcei",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Burcei e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Burcei?",
        answer: "il centro di Burcei e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Burcei?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Burcei su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "cagliari",
    path: "/cultura-sarda/sud-sardegna/cagliari",
    town: "Cagliari",
    province: "Cagliari",
    area: "Cagliari",
    title: "Cagliari: Castello, Sant’Efisio e Cittadella dei Musei",
    h1: "Cagliari",
    description:
      "Cagliari: quartieri storici, Sant’Efisio, Museo archeologico nazionale in Cittadella. Nora è a Pula.",
    hero: {
      src: "/images/cultura/cagliari-panorama.webp",
      alt: "Cagliari vista dalla darsena, con il colle di Castello sul golfo",
      credit: {
        author: "Autore ignoto",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Panorama_di_Cagliari_dalla_Darsena_(xilografia).jpg",
      },
    },
    intro:
      "Cagliari è il capoluogo: Castello sul colle, quattro quartieri, Sant’Efisio il 1° maggio. Chi la cerca per il mare trova anche la Cittadella dei Musei. Questa scheda tiene città, voto e visite, senza ridurla a tramonto sul Poetto.",
    history: [
      "Prima dei giudicati il golfo è già abitato. Karaly è colonia punica, poi città romana. Nel Medioevo il giudicato di Cagliari ha il suo centro a Santa Igia, distrutta nel 1258. Sul colle restano le torri pisane — San Pancrazio e l’Elefante — e il Castello che gli aragonesi tengono come piazzaforte.",
      "Stampace, Marina, Villanova e Castello sono quattro quartieri, non un centro unico. Piazza Yenne, il Bastione di Saint Remy, i corsi: il tessuto visibile è Ottocento e Novecento sopra quel colle. La Cittadella dei Musei, nell’ex arsenale, è il polo statale di archeologia dell’isola. Nora sta in comune di Pula: non è un quartiere di Cagliari.",
    ],
    language: [
      "Si parla sardo campidanese, nella varietà cagliaritana, accanto all’italiano. Non è il sardo di Nuoro né il sassarese: fonetica e lessico cambiano. La guida alle lingue tiene campidanese e logudorese distinti. Non pubblichiamo percentuali di parlanti.",
    ],
    traditions: [
      {
        title: "Sant’Efisio",
        body: "Il 1° maggio la statua esce da Stampace e il corteo va verso Nora, a Pula: voto della città, carri, abiti dei paesi che partecipano. Non la chiamiamo «la festa più importante della Sardegna»: è la processione più visibile del capoluogo. Percorso, orari e viabilità li pubblica il Comune con l’Arciconfraternita; ogni edizione può spostare servizi. Storia e calendario stanno nell’hub Sant’Efisio e nella guida alle grandi feste.",
      },
    ],
    crafts: [
      {
        title: "Confraternite e carri",
        body: "Intorno a Sant’Efisio restano confraternite, carri votivi e sarte degli abiti. Non c’è un «artigianato cagliaritano» unico da vetrina, come la resolza a Pattada o il corallo ad Alghero. Il posto per oggetti e provenienze è la Cittadella e i musei civici, con orari sui gestori. La guida all’artigianato tiene i mestieri di territorio, senza catalogo.",
      },
    ],
    visit: [
      {
        name: "Cittadella dei Musei",
        body: "Museo archeologico nazionale: preistoria, nuragico, fenicio-punico, romano, tra le collezioni statali più ampie dell’isola. Nella stessa cittadella pinacoteca e altre raccolte, ognuna con orario proprio. Conferma su musei.sardegna.beniculturali.it: chiusure e biglietti cambiano. Non è una visita da mezz’ora se ti interessa l’archeologia.",
      },
      {
        name: "Castello, torri, quartieri",
        body: "Torre dell’Elefante, Torre di San Pancrazio, cattedrale, Bastione di Saint Remy. Poi scendi: Marina verso il porto, Stampace verso Sant’Efisio, Villanova. Cammina al mattino. Il Poetto è la costa urbana: un altro giro, non la storia del colle.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere a Cagliari in un giorno?",
        answer:
          "Mattina in Cittadella. Poi Castello e un quartiere a piedi (Stampace se ti interessa Sant’Efisio). Nora è a Pula: serve un altro mezzo giorno.",
      },
      {
        question: "Quando è Sant’Efisio?",
        answer:
          "Il 1° maggio è la data tradizionale di partenza da Stampace. Rientro e tappe li pubblica il Comune ogni anno. Hub EVERAS: calendario Sant’Efisio.",
      },
      {
        question: "Si parla sardo a Cagliari?",
        answer:
          "Sì, il campidanese cagliaritano, insieme all’italiano. Non è la stessa varietà del centro dell’isola. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Cagliari",
        href: "https://www.comune.cagliari.it/",
      },
      {
        label: "Rete musei archeologici della Sardegna",
        href: "https://www.musei.sardegna.beniculturali.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/grandi-feste-sarde", label: "Grandi feste" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura/storia-sardegna", label: "Storia della Sardegna" },
      { href: "/eventi-sardegna/sant-efisio", label: "Sant’Efisio, calendario" },
      { href: "/cultura-sarda/sud-sardegna/pula", label: "Guida Pula (Nora)" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "capoterra",
    path: "/cultura-sarda/sud-sardegna/capoterra",
    town: "Capoterra",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Capoterra: laguna e costa ovest",
    h1: "Capoterra",
    description: "Capoterra in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/capoterra-panorama.webp",
      alt: "Veduta di Capoterra in Sardegna",
      credit: {
        author: "Sistow",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Capoterra_parco_urbano.JPG",
      },
    },
    intro: `Capoterra è comune tra laguna e costa a ovest di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Capoterra su EVERAS.`,
    history: [
      `Capoterra è un comune italiano di 22 946 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Capoterra resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Capoterra, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Mare, festa e Campidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Capoterra su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Capoterra si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Capoterra",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro, spiaggia e laguna. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Capoterra?",
        answer: "Centro, spiaggia e laguna. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Capoterra?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Capoterra su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "castiadas",
    path: "/cultura-sarda/sud-sardegna/castiadas",
    town: "Castiadas",
    province: "Cagliari",
    area: "Sarrabus",
    title: "Castiadas: storia, tradizioni e cosa visitare",
    h1: "Castiadas",
    description: "Castiadas in Sardegna: guida al comune del Sarrabus, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/castiadas-panorama.webp",
      alt: "Veduta di Castiadas in Sardegna",
      credit: {
        author: "Alex10",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Castiadas.jpg",
      },
    },
    intro: `Castiadas è comune del Sarrabus in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Castiadas su EVERAS.`,
    history: [
      `Castiadas è un comune italiano sparso di 1 741 abitanti della città metropolitana di Cagliari.`,
      `Oggi Castiadas resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Castiadas, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarrabus. Le date precise cambiano ogni anno: controlla il calendario eventi a Castiadas su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarrabus intorno",
        body: `Castiadas si legge meglio insieme ai comuni vicini del Sarrabus: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Castiadas",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Castiadas e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Castiadas?",
        answer: "il centro di Castiadas e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Castiadas?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Castiadas su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "decimomannu",
    path: "/cultura-sarda/sud-sardegna/decimomannu",
    town: "Decimomannu",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Decimomannu: storia, tradizioni e cosa visitare",
    h1: "Decimomannu",
    description: "Decimomannu in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/decimomannu-panorama.webp",
      alt: "Veduta di Decimomannu in Sardegna",
      credit: {
        author: "Nicola Secci",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Foto_Aerea_Decimomannu_Ott_2019.jpg",
      },
    },
    intro: `Decimomannu è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Decimomannu su EVERAS.`,
    history: [
      `Decimomannu è un comune italiano di 8 349 abitanti della città metropolitana di Cagliari. Situata a circa 15 chilometri ad ovest di Cagliari confina a nord con il comune di Villasor, a nord-est con San Sperate, a ovest con Villaspeciosa e Decimoputzu e a sud con Assemini e Uta. Gli abitanti prendono il nome di decimesi, più raramente decimomannesi.`,
      `Oggi Decimomannu resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Decimomannu, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Decimomannu su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Decimomannu si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Decimomannu",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Decimomannu e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Decimomannu?",
        answer: "il centro di Decimomannu e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Decimomannu?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Decimomannu su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "decimoputzu",
    path: "/cultura-sarda/sud-sardegna/decimoputzu",
    town: "Decimoputzu",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Decimoputzu: storia, tradizioni e cosa visitare",
    h1: "Decimoputzu",
    description: "Decimoputzu in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/decimoputzu-panorama.webp",
      alt: "Veduta di Decimoputzu in Sardegna",
      credit: {
        author: "Pampuco",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Wv_Decimoputzu_banner.png",
      },
    },
    intro: `Decimoputzu è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Decimoputzu su EVERAS.`,
    history: [
      `Decimoputzu è un comune italiano di 4 165 abitanti della città metropolitana di Cagliari.`,
      `Oggi Decimoputzu resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Decimoputzu, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Decimoputzu su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Decimoputzu si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Decimoputzu",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Decimoputzu e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Decimoputzu?",
        answer: "il centro di Decimoputzu e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Decimoputzu?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Decimoputzu su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "dolianova",
    path: "/cultura-sarda/sud-sardegna/dolianova",
    town: "Dolianova",
    province: "Cagliari",
    area: "Parteolla",
    title: "Dolianova: storia, tradizioni e cosa visitare",
    h1: "Dolianova",
    description: "Dolianova in Sardegna: guida al comune del Parteolla, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/dolianova-panorama.webp",
      alt: "Veduta di Dolianova in Sardegna",
      credit: {
        author: "cristianocani",
        license: "CC BY 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by/2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:San_Pantaleo_(Dolianova)_Fianco.jpg",
      },
    },
    intro: `Dolianova è comune del Parteolla in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Dolianova su EVERAS.`,
    history: [
      `Dolianova è un comune italiano di 9 358 abitanti della città metropolitana di Cagliari, paese importante come punto di riferimento per gli altri piccoli comuni limitrofi con una zona industriale collegata alla trasformazione dei prodotti delle coltivazioni e dell'allevamento del bestiame, ben organizzata.`,
      `Oggi Dolianova resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Dolianova, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Parteolla. Le date precise cambiano ogni anno: controlla il calendario eventi a Dolianova su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Parteolla intorno",
        body: `Dolianova si legge meglio insieme ai comuni vicini del Parteolla: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Dolianova",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Dolianova e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Dolianova?",
        answer: "il centro di Dolianova e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Dolianova?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Dolianova su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "domus-de-maria",
    path: "/cultura-sarda/sud-sardegna/domus-de-maria",
    town: "Domus de Maria",
    province: "Cagliari",
    area: "Sulcis",
    title: "Domus de Maria: Chia e dune",
    h1: "Domus de Maria",
    description: "Domus de Maria in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/domus-de-maria-panorama.webp",
      alt: "Veduta di Domus de Maria in Sardegna",
      credit: {
        author: "gian luca bucci",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Spiaggia_di_Torre_di_Chia_-_Domus_de_Maria_(CA)_-_panoramio.jpg",
      },
    },
    intro: `Domus de Maria è comune delle spiagge di Chia in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Domus de Maria su EVERAS.`,
    history: [
      `Domus de Maria è un comune italiano di 1 626 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Domus de Maria resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Domus de Maria, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Mare d’estate e paese dell’interno. Le date precise cambiano ogni anno: controlla il calendario eventi a Domus de Maria su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Domus de Maria si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Domus de Maria",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Chia, torre e costa. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Domus de Maria?",
        answer: "Chia, torre e costa. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Domus de Maria?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Domus de Maria su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "donori",
    path: "/cultura-sarda/sud-sardegna/donori",
    town: "Donori",
    province: "Cagliari",
    area: "Parteolla",
    title: "Donori: storia, tradizioni e cosa visitare",
    h1: "Donori",
    description: "Donori in Sardegna: guida al comune del Parteolla, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/donori-panorama.webp",
      alt: "Veduta di Donori in Sardegna",
      credit: {
        author: "piantisergio",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Donori_chiesa_San_Giorgio.jpg",
      },
    },
    intro: `Donori è comune del Parteolla in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Donori su EVERAS.`,
    history: [
      `Donori è un comune italiano di 1 904 abitanti della città metropolitana di Cagliari, nell'antica subregione del Parteòlla, situato a circa 30 chilometri da Cagliari.`,
      `Oggi Donori resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Donori, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Parteolla. Le date precise cambiano ogni anno: controlla il calendario eventi a Donori su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Parteolla intorno",
        body: `Donori si legge meglio insieme ai comuni vicini del Parteolla: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Donori",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Donori e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Donori?",
        answer: "il centro di Donori e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Donori?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Donori su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "elmas",
    path: "/cultura-sarda/sud-sardegna/elmas",
    town: "Elmas",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Elmas: storia, tradizioni e cosa visitare",
    h1: "Elmas",
    description: "Elmas in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/elmas-panorama.webp",
      alt: "Veduta di Elmas in Sardegna",
      credit: {
        author: "Ekrem07",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Elmas_göl.jpg",
      },
    },
    intro: `Elmas è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Elmas su EVERAS.`,
    history: [
      `Elmas è un comune italiano di 9 457 abitanti della città metropolitana di Cagliari in Sardegna. Il comune fu soppresso nel 1937, ritornando una frazione di Cagliari. Nel 1989 acquisì nuovamente la propria autonomia. Nel suo territorio si trova l'aeroporto di Cagliari-Elmas.`,
      `Oggi Elmas resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Elmas, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi ad Elmas su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Elmas si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Elmas",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Elmas e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Elmas?",
        answer: "il centro di Elmas e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Elmas?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Elmas su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "escalaplano",
    path: "/cultura-sarda/sud-sardegna/escalaplano",
    town: "Escalaplano",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Escalaplano: storia, tradizioni e cosa visitare",
    h1: "Escalaplano",
    description: "Escalaplano in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/escalaplano-panorama.webp",
      alt: "Veduta di Escalaplano in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Escalaplano_-_Costume_tradizionale_(07).jpg",
      },
    },
    intro: `Escalaplano è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Escalaplano su EVERAS.`,
    history: [
      `Escalaplano è un comune italiano di 2 015 abitanti della città metropolitana di Cagliari, che si trova a 338 metri di altitudine sul livello del mare.`,
      `Oggi Escalaplano resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Escalaplano, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi ad Escalaplano su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Escalaplano si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Escalaplano",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Escalaplano e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Escalaplano?",
        answer: "il centro di Escalaplano e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Escalaplano?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Escalaplano su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "escolca",
    path: "/cultura-sarda/sud-sardegna/escolca",
    town: "Escolca",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Escolca: storia, tradizioni e cosa visitare",
    h1: "Escolca",
    description: "Escolca in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/escolca-panorama.webp",
      alt: "Veduta di Escolca in Sardegna",
      credit: {
        author: "Manfred Kopka",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:FCS_400_bei_Bivio_Escolca_Richtung_Isili.jpg",
      },
    },
    intro: `Escolca è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Escolca su EVERAS.`,
    history: [
      `Escolca è un comune italiano di 529 abitanti della città metropolitana di Cagliari, situato ai piedi della Giara di Serri.`,
      `Oggi Escolca resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Escolca, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi ad Escolca su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Escolca si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Escolca",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Escolca e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Escolca?",
        answer: "il centro di Escolca e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Escolca?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Escolca su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "esterzili",
    path: "/cultura-sarda/sud-sardegna/esterzili",
    town: "Esterzili",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Esterzili: storia, tradizioni e cosa visitare",
    h1: "Esterzili",
    description: "Esterzili in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/esterzili-panorama.webp",
      alt: "Veduta di Esterzili in Sardegna",
      credit: {
        author: "Paolo Boi",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_dal_Monte_S._Vittoria.jpg",
      },
    },
    intro: `Esterzili è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Esterzili su EVERAS.`,
    history: [
      `Esterzili è un comune italiano di 527 abitanti, nella subregione storica della Barbagia di Seùlo. Il comune fa parte della XIII Comunità Montana Sarcidano-Barbagia di Seulo.`,
      `Oggi Esterzili resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Esterzili, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi ad Esterzili su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Esterzili si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Esterzili",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Esterzili e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Esterzili?",
        answer: "il centro di Esterzili e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Esterzili?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Esterzili su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "genoni",
    path: "/cultura-sarda/sud-sardegna/genoni",
    town: "Genoni",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Genoni: storia, tradizioni e cosa visitare",
    h1: "Genoni",
    description: "Genoni in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/genoni-panorama.webp",
      alt: "Veduta di Genoni in Sardegna",
      credit: {
        author: "Roberto soddu",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Genoni.JPG",
      },
    },
    intro: `Genoni è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Genoni su EVERAS.`,
    history: [
      `Genoni è un comune italiano di 706 abitanti della città metropolitana di Cagliari, nella subregione del Sarcidano. Il paese è dominato dal piccolo pianoro del colle di Santu Antine che si eleva sino all'altitudine di 590 metri. Sul territorio comunale sono presenti numerosi elementi d'interesse dal punto di vista naturalistico, paesaggistico e archeologico.`,
      `Oggi Genoni resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Genoni, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Genoni su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Genoni si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Genoni",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Genoni e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Genoni?",
        answer: "il centro di Genoni e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Genoni?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Genoni su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "gergei",
    path: "/cultura-sarda/sud-sardegna/gergei",
    town: "Gergei",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Gergei: storia, tradizioni e cosa visitare",
    h1: "Gergei",
    description: "Gergei in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/gergei-panorama.webp",
      alt: "Veduta di Gergei in Sardegna",
      credit: {
        author: "DucadiFraconalto3942",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Flag_of_Gergei.png",
      },
    },
    intro: `Gergei è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Gergei su EVERAS.`,
    history: [
      `Gergei è un comune italiano di 1 101 abitanti della città metropolitana di Cagliari.`,
      `Oggi Gergei resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Gergei, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Gergei su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Gergei si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Gergei",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Gergei e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Gergei?",
        answer: "il centro di Gergei e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Gergei?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Gergei su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "gesico",
    path: "/cultura-sarda/sud-sardegna/gesico",
    town: "Gesico",
    province: "Cagliari",
    area: "Trexenta",
    title: "Gesico: storia, tradizioni e cosa visitare",
    h1: "Gesico",
    description: "Gesico in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/gesico-panorama.webp",
      alt: "Veduta di Gesico in Sardegna",
      credit: {
        author: "Alerugolo",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Santa_Giusta_-_Sant'Amatore.jpg",
      },
    },
    intro: `Gesico è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Gesico su EVERAS.`,
    history: [
      `Gesico è un comune italiano di 693 abitanti della città metropolitana di Cagliari, nella subregione della Trexenta.`,
      `Oggi Gesico resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Gesico, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Gesico su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Gesico si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Gesico",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Gesico e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Gesico?",
        answer: "il centro di Gesico e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Gesico?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Gesico su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "goni",
    path: "/cultura-sarda/sud-sardegna/goni",
    town: "Goni",
    province: "Cagliari",
    area: "Gerrei",
    title: "Goni: storia, tradizioni e cosa visitare",
    h1: "Goni",
    description: "Goni in Sardegna: guida al comune del Gerrei, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/goni-panorama.webp",
      alt: "Veduta di Goni in Sardegna",
      credit: {
        author: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Sardinien_Goni_Pranu_Muttedu_menhir-reihe.jpg",
      },
    },
    intro: `Goni è comune del Gerrei in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Goni su EVERAS.`,
    history: [
      `Goni è un comune italiano di 431 abitanti della città metropolitana di Cagliari.`,
      `Oggi Goni resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Goni, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Gerrei. Le date precise cambiano ogni anno: controlla il calendario eventi a Goni su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Gerrei intorno",
        body: `Goni si legge meglio insieme ai comuni vicini del Gerrei: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Goni",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Goni e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Goni?",
        answer: "il centro di Goni e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Goni?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Goni su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "guamaggiore",
    path: "/cultura-sarda/sud-sardegna/guamaggiore",
    town: "Guamaggiore",
    province: "Cagliari",
    area: "Trexenta",
    title: "Guamaggiore: storia, tradizioni e cosa visitare",
    h1: "Guamaggiore",
    description: "Guamaggiore in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/guamaggiore-panorama.webp",
      alt: "Veduta di Guamaggiore in Sardegna",
      credit: {
        author: "Marcan44",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Guamaggiore_(Sardegna)_-_Parrocchiale_di_San_Sebastiano_martire.jpg",
      },
    },
    intro: `Guamaggiore è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Guamaggiore su EVERAS.`,
    history: [
      `Guamaggiore è un comune italiano di 866 abitanti della città metropolitana di Cagliari, nella subregione della Trexenta.`,
      `Oggi Guamaggiore resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Guamaggiore, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Guamaggiore su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Guamaggiore si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Guamaggiore",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Guamaggiore e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Guamaggiore?",
        answer: "il centro di Guamaggiore e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Guamaggiore?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Guamaggiore su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "guasila",
    path: "/cultura-sarda/sud-sardegna/guasila",
    town: "Guasila",
    province: "Cagliari",
    area: "Trexenta",
    title: "Guasila: storia, tradizioni e cosa visitare",
    h1: "Guasila",
    description: "Guasila in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/guasila-panorama.webp",
      alt: "Veduta di Guasila in Sardegna",
      credit: {
        author: "piantisergio",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Santuario_Guasila.jpg",
      },
    },
    intro: `Guasila è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Guasila su EVERAS.`,
    history: [
      `Guasila è un comune italiano di 2 407 abitanti della città metropolitana di Cagliari, nella Trexenta, antica regione cerealicola della Sardegna dove Guasila è ancora oggi una piccola capitale del grano duro sardo.`,
      `Oggi Guasila resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Guasila, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Guasila su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Guasila si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Guasila",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Guasila e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Guasila?",
        answer: "il centro di Guasila e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Guasila?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Guasila su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "guspini",
    path: "/cultura-sarda/sud-sardegna/guspini",
    town: "Guspini",
    province: "Sud Sardegna",
    area: "Medio Campidano",
    title: "Guspini: Medio Campidano e Montevecchio",
    h1: "Guspini",
    description: "Guspini in Sardegna: guida al comune del Medio Campidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/guspini-panorama.webp",
      alt: "Veduta di Guspini in Sardegna",
      credit: {
        author: "Chefinho",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Guspini.jpg",
      },
    },
    intro: `Guspini è paese verso le miniere di Montevecchio in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Guspini su EVERAS.`,
    history: [
      `Guspini è un comune italiano di 10 513 abitanti della provincia del Medio Campidano. Si trova nell'antica subregione storica del Monreale.`,
      `Oggi Guspini resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Guspini, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Memoria mineraria e Campidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Guspini su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Medio Campidano intorno",
        body: `Guspini si legge meglio insieme ai comuni vicini del Medio Campidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Guspini",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e territorio minerario. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Guspini?",
        answer: "Centro e territorio minerario. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Guspini?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Guspini su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "isili",
    path: "/cultura-sarda/sud-sardegna/isili",
    town: "Isili",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Isili: storia, tradizioni e cosa visitare",
    h1: "Isili",
    description: "Isili in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/isili-panorama.webp",
      alt: "Veduta di Isili in Sardegna",
      credit: {
        author: "Alex10",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Isili-Villacidro.png",
      },
    },
    intro: `Isili è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Isili su EVERAS.`,
    history: [
      `Isili è un comune italiano di 2 414 abitanti della città metropolitana di Cagliari. Situato nella regione storica del Sarcidano, che dista circa 71 chilometri a nord di percorso stradale dal capoluogo regionale, 105 da Nuoro, 66 da Oristano e 162 da Sassari. La casa comunale è ubicata a 523 metri sul livello del mare.`,
      `Oggi Isili resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Isili, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi ad Isili su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Isili si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Isili",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Isili e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Isili?",
        answer: "il centro di Isili e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Isili?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Isili su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "mandas",
    path: "/cultura-sarda/sud-sardegna/mandas",
    town: "Mandas",
    province: "Cagliari",
    area: "Trexenta",
    title: "Mandas: storia, tradizioni e cosa visitare",
    h1: "Mandas",
    description: "Mandas in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/mandas-panorama.webp",
      alt: "Veduta di Mandas in Sardegna",
      credit: {
        author: "Panorama Universal, El",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Almanaque_de_El_Mundo_Militar,_Panorama_Universal_-_año_de_1864_(IA_A11411414).pdf",
      },
    },
    intro: `Mandas è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Mandas su EVERAS.`,
    history: [
      `Mandas è un comune italiano di 1 915 abitanti della città metropolitana di Cagliari.`,
      `Oggi Mandas resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Mandas, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Mandas su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Mandas si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Mandas",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Mandas e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Mandas?",
        answer: "il centro di Mandas e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Mandas?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Mandas su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "maracalagonis",
    path: "/cultura-sarda/sud-sardegna/maracalagonis",
    town: "Maracalagonis",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Maracalagonis: storia, tradizioni e cosa visitare",
    h1: "Maracalagonis",
    description: "Maracalagonis in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/maracalagonis-panorama.webp",
      alt: "Veduta di Maracalagonis in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Maracalagonis_-_Costume_tradizionale_(08).jpg",
      },
    },
    intro: `Maracalagonis è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Maracalagonis su EVERAS.`,
    history: [
      `Maracalagonis è un comune italiano di 7 860 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Maracalagonis resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Maracalagonis, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Maracalagonis su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Maracalagonis si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Maracalagonis",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Maracalagonis e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Maracalagonis?",
        answer: "il centro di Maracalagonis e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Maracalagonis?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Maracalagonis su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "monastir",
    path: "/cultura-sarda/sud-sardegna/monastir",
    town: "Monastir",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Monastir: storia, tradizioni e cosa visitare",
    h1: "Monastir",
    description: "Monastir in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/monastir-panorama.webp",
      alt: "Veduta di Monastir in Sardegna",
      credit: {
        author: "De Vegni, Leonardo (Incisore)",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Veduta_del_villaggio_di_Monastir_nell'isola_di_Sardegna.jpg",
      },
    },
    intro: `Monastir è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Monastir su EVERAS.`,
    history: [
      `Monastir è un comune italiano di 4 931 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Monastir resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Monastir, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Monastir su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Monastir si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Monastir",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Monastir e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Monastir?",
        answer: "il centro di Monastir e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Monastir?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Monastir su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "monserrato",
    path: "/cultura-sarda/sud-sardegna/monserrato",
    town: "Monserrato",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Monserrato: storia, tradizioni e cosa visitare",
    h1: "Monserrato",
    description: "Monserrato in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/monserrato-panorama.webp",
      alt: "Veduta di Monserrato in Sardegna",
      credit: {
        author: "Einaz80",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_dal_Santuario_di_Monserrato.jpg",
      },
    },
    intro: `Monserrato è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Monserrato su EVERAS.`,
    history: [
      `Monserrato è un comune italiano di 18 496 abitanti della città metropolitana di Cagliari in Sardegna, conurbato col capoluogo.`,
      `Oggi Monserrato resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Monserrato, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Monserrato su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Monserrato si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Monserrato",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Monserrato e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Monserrato?",
        answer: "il centro di Monserrato e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Monserrato?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Monserrato su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "mogoro",
    path: "/cultura-sarda/sud-sardegna/mogoro",
    town: "Mogoro",
    province: "Sud Sardegna",
    area: "Marmilla",
    title: "Mogoro: storia, tradizioni e cosa visitare",
    h1: "Mogoro",
    description: "Mogoro in Sardegna: guida al comune della Marmilla, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/mogoro-panorama.webp",
      alt: "Veduta di Mogoro in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Mogoro,_panorama_(01).jpg",
      },
    },
    intro: `Mogoro è comune della Marmilla in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Mogoro su EVERAS.`,
    history: [
      `Mogoro è un comune italiano di 3 759 abitanti della provincia di Oristano in Sardegna, nella subregione dell'Alta Marmilla.`,
      `Oggi Mogoro resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Mogoro, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Marmilla. Le date precise cambiano ogni anno: controlla il calendario eventi a Mogoro su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Marmilla intorno",
        body: `Mogoro si legge meglio insieme ai comuni vicini della Marmilla: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Mogoro",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Mogoro e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Mogoro?",
        answer: "il centro di Mogoro e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Mogoro?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Mogoro su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "muravera",
    path: "/cultura-sarda/sud-sardegna/muravera",
    town: "Muravera",
    province: "Cagliari",
    area: "Sarrabus",
    title: "Muravera: Sarrabus e agrumi",
    h1: "Muravera",
    description: "Muravera in Sardegna: guida al comune del Sarrabus, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/muravera-panorama.webp",
      alt: "Veduta di Muravera in Sardegna",
      credit: {
        author: "MatteoNL97",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Un_panorama_di_Muravera_e_del_villaggio_di_Villaputzu_in_distanza_di_sera_2019.jpg",
      },
    },
    intro: `Muravera è paese del Sarrabus e degli agrumi in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Muravera su EVERAS.`,
    history: [
      `Muravera è un comune italiano di 4 956 abitanti della città metropolitana di Cagliari, facente parte della sub-regione sarda del Sarrabus.`,
      `Oggi Muravera resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Muravera, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Sagra degli agrumi e Sarrabus. Le date precise cambiano ogni anno: controlla il calendario eventi a Muravera su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarrabus intorno",
        body: `Muravera si legge meglio insieme ai comuni vicini del Sarrabus: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Muravera",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e costa verso Costa Rei. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Muravera?",
        answer: "Centro e costa verso Costa Rei. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Muravera?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Muravera su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "nuragus",
    path: "/cultura-sarda/sud-sardegna/nuragus",
    town: "Nuragus",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Nuragus: storia, tradizioni e cosa visitare",
    h1: "Nuragus",
    description: "Nuragus in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/nuragus-panorama.webp",
      alt: "Veduta di Nuragus in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Nuragus_-_Costume_tradizionale_(07).JPG",
      },
    },
    intro: `Nuragus è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Nuragus su EVERAS.`,
    history: [
      `Nuragus è un comune italiano di 793 abitanti della città metropolitana di Cagliari, situato a circa 74 chilometri a nord di Cagliari.`,
      `Oggi Nuragus resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Nuragus, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Nuragus su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Nuragus si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Nuragus",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Nuragus e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Nuragus?",
        answer: "il centro di Nuragus e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Nuragus?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Nuragus su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "nurallao",
    path: "/cultura-sarda/sud-sardegna/nurallao",
    town: "Nurallao",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Nurallao: storia, tradizioni e cosa visitare",
    h1: "Nurallao",
    description: "Nurallao in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/nurallao-panorama.webp",
      alt: "Veduta di Nurallao in Sardegna",
      credit: {
        author: "Manfred Kopka",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Nurallao_(Stazione).jpg",
      },
    },
    intro: `Nurallao è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Nurallao su EVERAS.`,
    history: [
      `Nurallao è un comune italiano di 1 081 abitanti della città metropolitana di Cagliari.`,
      `Oggi Nurallao resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Nurallao, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Nurallao su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Nurallao si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Nurallao",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Nurallao e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Nurallao?",
        answer: "il centro di Nurallao e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Nurallao?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Nurallao su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "nuraminis",
    path: "/cultura-sarda/sud-sardegna/nuraminis",
    town: "Nuraminis",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Nuraminis: storia, tradizioni e cosa visitare",
    h1: "Nuraminis",
    description: "Nuraminis in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/nuraminis-panorama.webp",
      alt: "Veduta di Nuraminis in Sardegna",
      credit: {
        author: "piantisergio",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Nuraminis_San_Pietro.jpg",
      },
    },
    intro: `Nuraminis è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Nuraminis su EVERAS.`,
    history: [
      `Nuraminis è un comune italiano di 2 340 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Nuraminis resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Nuraminis, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Nuraminis su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Nuraminis si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Nuraminis",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Nuraminis e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Nuraminis?",
        answer: "il centro di Nuraminis e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Nuraminis?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Nuraminis su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "nurri",
    path: "/cultura-sarda/sud-sardegna/nurri",
    town: "Nurri",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Nurri: storia, tradizioni e cosa visitare",
    h1: "Nurri",
    description: "Nurri in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/nurri-panorama.webp",
      alt: "Veduta di Nurri in Sardegna",
      credit: {
        author: "SofiRussia",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Nurri_Kassikohvik.jpg",
      },
    },
    intro: `Nurri è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Nurri su EVERAS.`,
    history: [
      `Nurri è un comune italiano di 1 970 abitanti della città metropolitana di Cagliari, situato nella subregione del Sarcidano.`,
      `Oggi Nurri resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Nurri, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Nurri su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Nurri si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Nurri",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Nurri e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Nurri?",
        answer: "il centro di Nurri e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Nurri?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Nurri su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "orroli",
    path: "/cultura-sarda/sud-sardegna/orroli",
    town: "Orroli",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Orroli: storia, tradizioni e cosa visitare",
    h1: "Orroli",
    description: "Orroli in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/orroli-panorama.webp",
      alt: "Veduta di Orroli in Sardegna",
      credit: {
        author: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Sardinien_Orroli_Nuraghe_Arrubiu.jpg",
      },
    },
    intro: `Orroli è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Orroli su EVERAS.`,
    history: [
      `Orroli è un comune italiano di 1 907 abitanti della città metropolitana di Cagliari, situato nella subregione storica del Sarcidano.`,
      `Oggi Orroli resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Orroli, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi ad Orroli su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Orroli si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Orroli",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Orroli e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Orroli?",
        answer: "il centro di Orroli e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Orroli?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Orroli su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "ortacesus",
    path: "/cultura-sarda/sud-sardegna/ortacesus",
    town: "Ortacesus",
    province: "Cagliari",
    area: "Trexenta",
    title: "Ortacesus: storia, tradizioni e cosa visitare",
    h1: "Ortacesus",
    description: "Ortacesus in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/ortacesus-panorama.webp",
      alt: "Veduta di Ortacesus in Sardegna",
      credit: {
        author: "Corrado",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Sa_Mitza'e_s'Orru'.jpg",
      },
    },
    intro: `Ortacesus è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Ortacesus su EVERAS.`,
    history: [
      `Ortacesus è un comune italiano di 865 abitanti della città metropolitana di Cagliari, nel territorio storico della Trexenta.`,
      `Oggi Ortacesus resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Ortacesus, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi ad Ortacesus su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Ortacesus si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Ortacesus",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Ortacesus e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Ortacesus?",
        answer: "il centro di Ortacesus e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Ortacesus?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Ortacesus su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "pimentel",
    path: "/cultura-sarda/sud-sardegna/pimentel",
    town: "Pimentel",
    province: "Cagliari",
    area: "Trexenta",
    title: "Pimentel: storia, tradizioni e cosa visitare",
    h1: "Pimentel",
    description: "Pimentel in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/pimentel-panorama.webp",
      alt: "Veduta di Pimentel in Sardegna",
      credit: {
        author: "Rodolfo pimentel",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Saqsaywaman_panorama.jpg",
      },
    },
    intro: `Pimentel è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Pimentel su EVERAS.`,
    history: [
      `Pimentel è un comune italiano di 1 075 abitanti della città metropolitana di Cagliari, nella subregione della Trexenta.`,
      `Oggi Pimentel resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Pimentel, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Pimentel su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Pimentel si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Pimentel",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Pimentel e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Pimentel?",
        answer: "il centro di Pimentel e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Pimentel?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Pimentel su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "pula",
    path: "/cultura-sarda/sud-sardegna/pula",
    town: "Pula",
    province: "Cagliari",
    area: "Sulcis",
    title: "Pula: Nora e costa sud",
    h1: "Pula",
    description: "Pula in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/pula-panorama.webp",
      alt: "Veduta di Pula in Sardegna",
      credit: {
        author: "Dirgela",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Pula_panorama.jpg",
      },
    },
    intro: `Pula è porta su Nora e le spiagge del sud in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Pula su EVERAS.`,
    history: [
      `Pula è un comune italiano di 7 017 abitanti della città metropolitana di Cagliari in Sardegna, situato a sud-ovest del capoluogo. Fondata nel periodo medievale e sviluppatasi nel XVIII secolo, è famosa per il sito archeologico di Nora, risalente al periodo fenicio e romano. Grazie alle sue spiagge, nel XX secolo è diventata un'importante meta turistica.`,
      `Oggi Pula resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Pula, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Archeologia, mare e festa di paese. Le date precise cambiano ogni anno: controlla il calendario eventi a Pula su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Pula si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Pula",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Area archeologica di Nora e costa. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Pula?",
        answer: "Area archeologica di Nora e costa. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Pula?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Pula su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "quartu-sant-elena",
    path: "/cultura-sarda/sud-sardegna/quartu-sant-elena",
    town: "Quartu Sant'Elena",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Quartu Sant'Elena: Poetto e città metropolitana",
    h1: "Quartu Sant'Elena",
    description: "Quartu Sant'Elena in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/quartu-sant-elena-panorama.webp",
      alt: "Veduta di Quartu Sant'Elena in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Quartu_Sant'Elena_-_Costume_tradizionale_(09).JPG",
      },
    },
    intro: `Quartu Sant'Elena è città sul Poetto a nord di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Quartu Sant'Elena su EVERAS.`,
    history: [
      `Quartu Sant'Elena è un comune italiano di 67 805 abitanti della città metropolitana di Cagliari in Sardegna, conurbato col capoluogo. È il terzo comune della regione per popolazione, dopo Cagliari e Sassari.`,
      `Oggi Quartu Sant'Elena resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Quartu Sant'Elena, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Festa di Sant’Elena e estate sul golfo. Le date precise cambiano ogni anno: controlla il calendario eventi a Quartu Sant'Elena su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Quartu Sant'Elena si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Quartu Sant'Elena",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Poetto, centro e spiaggia. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Quartu Sant'Elena?",
        answer: "Poetto, centro e spiaggia. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Quartu Sant'Elena?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Quartu Sant'Elena su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "quartucciu",
    path: "/cultura-sarda/sud-sardegna/quartucciu",
    town: "Quartucciu",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Quartucciu: storia, tradizioni e cosa visitare",
    h1: "Quartucciu",
    description: "Quartucciu in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/quartucciu-panorama.webp",
      alt: "Veduta di Quartucciu in Sardegna",
      credit: {
        author: "Wikimedia Commons",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tomba.quartucciu(Albe).jpg",
      },
    },
    intro: `Quartucciu è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Quartucciu su EVERAS.`,
    history: [
      `Quartucciu è un comune italiano di 12 699 abitanti della città metropolitana di Cagliari in Sardegna, conurbato col capoluogo. È stato frazione di Cagliari dal 1928 al 1983.`,
      `Oggi Quartucciu resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Quartucciu, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Quartucciu su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Quartucciu si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Quartucciu",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Quartucciu e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Quartucciu?",
        answer: "il centro di Quartucciu e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Quartucciu?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Quartucciu su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "sadali",
    path: "/cultura-sarda/sud-sardegna/sadali",
    town: "Sadali",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Sadali: storia, tradizioni e cosa visitare",
    h1: "Sadali",
    description: "Sadali in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/sadali-panorama.webp",
      alt: "Veduta di Sadali in Sardegna",
      credit: {
        author: "Keith Ruffles",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Wv_Sadali_banner.jpg",
      },
    },
    intro: `Sadali è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Sadali su EVERAS.`,
    history: [
      `Sadali è un comune italiano di 769 abitanti della città metropolitana di Cagliari, nella subregione storica della Barbagia di Seùlo.`,
      `Oggi Sadali resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Sadali, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Sadali su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Sadali si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Sadali",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Sadali e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Sadali?",
        answer: "il centro di Sadali e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Sadali?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Sadali su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "samatzai",
    path: "/cultura-sarda/sud-sardegna/samatzai",
    town: "Samatzai",
    province: "Cagliari",
    area: "Trexenta",
    title: "Samatzai: storia, tradizioni e cosa visitare",
    h1: "Samatzai",
    description: "Samatzai in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/samatzai-panorama.webp",
      alt: "Paesaggio del Sud Sardegna (scheda Samatzai)",
      credit: {
        author: "EVERAS",
        license: "All rights reserved",
        licenseUrl: "https://www.everas.it",
        sourceUrl: "https://www.everas.it/cultura-sarda/sud-sardegna",
      },
    },
    intro: `Samatzai è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Samatzai su EVERAS.`,
    history: [
      `Samatzai è un comune italiano di 1 492 abitanti della città metropolitana di Cagliari. Noto in antichità come Santu Maccari, è situato a circa 30 chilometri a nord da Cagliari.`,
      `Oggi Samatzai resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Samatzai, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Samatzai su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Samatzai si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Samatzai",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Samatzai e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Samatzai?",
        answer: "il centro di Samatzai e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Samatzai?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Samatzai su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "samugheo",
    path: "/cultura-sarda/sud-sardegna/samugheo",
    town: "Samugheo",
    province: "Sud Sardegna",
    area: "Barigadu",
    title: "Samugheo: storia, tradizioni e cosa visitare",
    h1: "Samugheo",
    description: "Samugheo in Sardegna: guida al comune del Barigadu, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/samugheo-panorama.webp",
      alt: "Veduta di Samugheo in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Samugheo_-_Tzichi.jpg",
      },
    },
    intro: `Samugheo è comune del Barigadu in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Samugheo su EVERAS.`,
    history: [
      `Samugheo è un comune italiano di 2 617 abitanti della provincia di Oristano in Sardegna.`,
      `Oggi Samugheo resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Samugheo, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barigadu. Le date precise cambiano ogni anno: controlla il calendario eventi a Samugheo su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Barigadu intorno",
        body: `Samugheo si legge meglio insieme ai comuni vicini del Barigadu: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Samugheo",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Samugheo e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Samugheo?",
        answer: "il centro di Samugheo e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Samugheo?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Samugheo su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "san-basilio",
    path: "/cultura-sarda/sud-sardegna/san-basilio",
    town: "San Basilio",
    province: "Cagliari",
    area: "Trexenta",
    title: "San Basilio: storia, tradizioni e cosa visitare",
    h1: "San Basilio",
    description: "San Basilio in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/san-basilio-panorama.webp",
      alt: "Veduta di San Basilio in Sardegna",
      credit: {
        author: "Threecharlie",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_verso_sud,_con_argine_del_Po_di_Goro_dal'area_archeologica_di_San_Basilio,_tenuta_Forzello_(San_Basilio,_Ariano_nel_Polesine).jpg",
      },
    },
    intro: `San Basilio è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a San Basilio su EVERAS.`,
    history: [
      `San Basilio, anche noto come Basilio di Cesarea, o Basilio il Grande o Basilio Magno, è stato un vescovo e teologo greco antico, venerato da tutte le Chiese cristiane; porta anche i titoli di confessore e Dottore della Chiesa. È considerato il primo dei Padri cappadoci. È uno dei quattro Padri della Chiesa d'Oriente che portano il titolo di \"Grande\" insieme ad Antonio Abate, Atanasio e a Fozio di Costantinopoli.`,
      `Oggi San Basilio resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a San Basilio, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a San Basilio su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `San Basilio si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di San Basilio",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di San Basilio e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a San Basilio?",
        answer: "il centro di San Basilio e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a San Basilio?",
        answer: "In fondo a questa guida e sulla pagina Eventi a San Basilio su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "san-nicolo-gerrei",
    path: "/cultura-sarda/sud-sardegna/san-nicolo-gerrei",
    town: "San Nicolò Gerrei",
    province: "Cagliari",
    area: "Gerrei",
    title: "San Nicolò Gerrei: storia, tradizioni e cosa visitare",
    h1: "San Nicolò Gerrei",
    description: "San Nicolò Gerrei in Sardegna: guida al comune del Gerrei, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/san-nicolo-gerrei-panorama.webp",
      alt: "Veduta di San Nicolò Gerrei in Sardegna",
      credit: {
        author: "Società adriatica di scienze naturali",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Bollettino_della_Società_adriatica_di_scienze_naturali_in_Trieste_(IA_bollettinodellas161895soci).pdf",
      },
    },
    intro: `San Nicolò Gerrei è comune del Gerrei in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a San Nicolò Gerrei su EVERAS.`,
    history: [
      `San Nicolò Gerrei è un comune italiano di 706 abitanti della città metropolitana di Cagliari.`,
      `Oggi San Nicolò Gerrei resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a San Nicolò Gerrei, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Gerrei. Le date precise cambiano ogni anno: controlla il calendario eventi a San Nicolò Gerrei su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Gerrei intorno",
        body: `San Nicolò Gerrei si legge meglio insieme ai comuni vicini del Gerrei: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di San Nicolò Gerrei",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di San Nicolò Gerrei e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a San Nicolò Gerrei?",
        answer: "il centro di San Nicolò Gerrei e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a San Nicolò Gerrei?",
        answer: "In fondo a questa guida e sulla pagina Eventi a San Nicolò Gerrei su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "san-sperate",
    path: "/cultura-sarda/sud-sardegna/san-sperate",
    town: "San Sperate",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "San Sperate: paese museo",
    h1: "San Sperate",
    description: "San Sperate in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/san-sperate-panorama.webp",
      alt: "Veduta di San Sperate in Sardegna",
      credit: {
        author: "Montalembert, Charles Forbes, comte de, 1810-1870 Cavour, Camillo Benso, conte di, 1810-1861",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Seconda_lettera_del_sig._conte_di_Montalembert_al_sig._conte_di_Cavour_(IA_secondaletterade00montrich).pdf",
      },
    },
    intro: `San Sperate è paese museo dei murales in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a San Sperate su EVERAS.`,
    history: [
      `San Sperate è un comune italiano di 8 646 abitanti della città metropolitana di Cagliari, nella sub-regione del Campidano di Cagliari.`,
      `Oggi San Sperate resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a San Sperate, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Arte di strada e festa. Le date precise cambiano ogni anno: controlla il calendario eventi a San Sperate su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `San Sperate si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di San Sperate",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Murales e centro di San Sperate. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a San Sperate?",
        answer: "Murales e centro di San Sperate. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a San Sperate?",
        answer: "In fondo a questa guida e sulla pagina Eventi a San Sperate su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "san-vito",
    path: "/cultura-sarda/sud-sardegna/san-vito",
    town: "San Vito",
    province: "Cagliari",
    area: "Sarrabus",
    title: "San Vito: storia, tradizioni e cosa visitare",
    h1: "San Vito",
    description: "San Vito in Sardegna: guida al comune del Sarrabus, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/san-vito-panorama.webp",
      alt: "Veduta di San Vito in Sardegna",
      credit: {
        author: "MatteoNL97",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Un_panorama_di_Villaputzu_e_del_villaggio_di_San_Vito_in_distanza_2019.jpg",
      },
    },
    intro: `San Vito è comune del Sarrabus in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a San Vito su EVERAS.`,
    history: [
      `San Vito, venerato anche come san Vito di Sicilia o san Vito martire, fu un giovane cristiano che subì il martirio nel 303 durante la grande persecuzione voluta dall’imperatore Diocleziano. È venerato come santo da tutte le chiese che ammettono il culto dei santi, annoverato tra i santi ausiliatori e il suo culto si estende in tutta l'Europa sin dai primi secoli dopo il suo martirio. La sua memoria liturgica.`,
      `Oggi San Vito resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a San Vito, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarrabus. Le date precise cambiano ogni anno: controlla il calendario eventi a San Vito su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarrabus intorno",
        body: `San Vito si legge meglio insieme ai comuni vicini del Sarrabus: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di San Vito",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di San Vito e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a San Vito?",
        answer: "il centro di San Vito e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a San Vito?",
        answer: "In fondo a questa guida e sulla pagina Eventi a San Vito su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "sant-andrea-frius",
    path: "/cultura-sarda/sud-sardegna/sant-andrea-frius",
    town: "Sant'Andrea Frius",
    province: "Cagliari",
    area: "Trexenta",
    title: "Sant'Andrea Frius: storia, tradizioni e cosa visitare",
    h1: "Sant'Andrea Frius",
    description: "Sant'Andrea Frius in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/sant-andrea-frius-panorama.webp",
      alt: "Paesaggio del Sud Sardegna (scheda Sant'Andrea Frius)",
      credit: {
        author: "EVERAS",
        license: "All rights reserved",
        licenseUrl: "https://www.everas.it",
        sourceUrl: "https://www.everas.it/cultura-sarda/sud-sardegna",
      },
    },
    intro: `Sant'Andrea Frius è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Sant'Andrea Frius su EVERAS.`,
    history: [
      `Sant'Andrea Frius è un comune italiano di 1 653 abitanti della città metropolitana di Cagliari, nella subregione della Trexenta. È posto circa 35 chilometri a nord di Cagliari.`,
      `Oggi Sant'Andrea Frius resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Sant'Andrea Frius, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Sant'Andrea Frius su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Sant'Andrea Frius si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Sant'Andrea Frius",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Sant'Andrea Frius e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Sant'Andrea Frius?",
        answer: "il centro di Sant'Andrea Frius e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Sant'Andrea Frius?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Sant'Andrea Frius su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "sarroch",
    path: "/cultura-sarda/sud-sardegna/sarroch",
    town: "Sarroch",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Sarroch: storia, tradizioni e cosa visitare",
    h1: "Sarroch",
    description: "Sarroch in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/sarroch-panorama.webp",
      alt: "Veduta di Sarroch in Sardegna",
      credit: {
        author: "Rsroberto",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Sarroch_Torre_del_Diavolo.jpg",
      },
    },
    intro: `Sarroch è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Sarroch su EVERAS.`,
    history: [
      `Sarroch è un comune italiano di 4 971 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Sarroch resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Sarroch, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Sarroch su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Sarroch si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Sarroch",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Sarroch e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Sarroch?",
        answer: "il centro di Sarroch e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Sarroch?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Sarroch su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "selargius",
    path: "/cultura-sarda/sud-sardegna/selargius",
    town: "Selargius",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Selargius: matrimonio selargino",
    h1: "Selargius",
    description: "Selargius in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/selargius-panorama.webp",
      alt: "Veduta di Selargius in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Selargius_-_Costume_tradizionale_(36).JPG",
      },
    },
    intro: `Selargius è paese del matrimonio selargino in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Selargius su EVERAS.`,
    history: [
      `Selargius è un comune italiano di 28 283 abitanti della città metropolitana di Cagliari, situato nella parte meridionale della Sardegna e conurbato col capoluogo.`,
      `Oggi Selargius resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Selargius, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Matrimonio tradizionale e festa. Le date precise cambiano ogni anno: controlla il calendario eventi a Selargius su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Selargius si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Selargius",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro storico e chiesa. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Selargius?",
        answer: "Centro storico e chiesa. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Selargius?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Selargius su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "selegas",
    path: "/cultura-sarda/sud-sardegna/selegas",
    town: "Selegas",
    province: "Cagliari",
    area: "Trexenta",
    title: "Selegas: storia, tradizioni e cosa visitare",
    h1: "Selegas",
    description: "Selegas in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/selegas-panorama.webp",
      alt: "Veduta di Selegas in Sardegna",
      credit: {
        author: "Pietro Rolla",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Toponimia_sarda.djvu",
      },
    },
    intro: `Selegas è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Selegas su EVERAS.`,
    history: [
      `Selegas è un comune italiano di 1 256 abitanti della città metropolitana di Cagliari, nella subregione della Trexenta.`,
      `Oggi Selegas resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Selegas, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Selegas su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Selegas si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Selegas",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Selegas e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Selegas?",
        answer: "il centro di Selegas e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Selegas?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Selegas su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "senorbi",
    path: "/cultura-sarda/sud-sardegna/senorbi",
    town: "Senorbì",
    province: "Cagliari",
    area: "Trexenta",
    title: "Senorbì: storia, tradizioni e cosa visitare",
    h1: "Senorbì",
    description: "Senorbì in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/senorbi-panorama.webp",
      alt: "Veduta di Senorbì in Sardegna",
      credit: {
        author: "Italian Parliament",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Parlamento_Italiano_-_Atti_parlamentari,_1860,_Documenti.pdf",
      },
    },
    intro: `Senorbì è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Senorbì su EVERAS.`,
    history: [
      `Senorbì è un comune italiano di 4 774 abitanti della città metropolitana di Cagliari.`,
      `Oggi Senorbì resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Senorbì, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Senorbì su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Senorbì si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Senorbì",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Senorbì e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Senorbì?",
        answer: "il centro di Senorbì e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Senorbì?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Senorbì su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "serdiana",
    path: "/cultura-sarda/sud-sardegna/serdiana",
    town: "Serdiana",
    province: "Cagliari",
    area: "Parteolla",
    title: "Serdiana: storia, tradizioni e cosa visitare",
    h1: "Serdiana",
    description: "Serdiana in Sardegna: guida al comune del Parteolla, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/serdiana-panorama.webp",
      alt: "Paesaggio del Sud Sardegna (scheda Serdiana)",
      credit: {
        author: "EVERAS",
        license: "All rights reserved",
        licenseUrl: "https://www.everas.it",
        sourceUrl: "https://www.everas.it/cultura-sarda/sud-sardegna",
      },
    },
    intro: `Serdiana è comune del Parteolla in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Serdiana su EVERAS.`,
    history: [
      `Serdiana è un comune italiano di 2 639 abitanti della città metropolitana di Cagliari sito nel Parteolla, subregione meridionale della Sardegna di particolare interesse.`,
      `Oggi Serdiana resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Serdiana, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Parteolla. Le date precise cambiano ogni anno: controlla il calendario eventi a Serdiana su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Parteolla intorno",
        body: `Serdiana si legge meglio insieme ai comuni vicini del Parteolla: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Serdiana",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Serdiana e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Serdiana?",
        answer: "il centro di Serdiana e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Serdiana?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Serdiana su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "serri",
    path: "/cultura-sarda/sud-sardegna/serri",
    town: "Serri",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Serri: storia, tradizioni e cosa visitare",
    h1: "Serri",
    description: "Serri in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/serri-panorama.webp",
      alt: "Veduta di Serri in Sardegna",
      credit: {
        author: "Aga Khan (IT)",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Santa_Vittoria_di_Serri_Panorama_dalla_giara_DSC_7900.jpg",
      },
    },
    intro: `Serri è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Serri su EVERAS.`,
    history: [
      `Serri è un comune italiano di 588 abitanti della città metropolitana di Cagliari.`,
      `Oggi Serri resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Serri, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Serri su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Serri si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Serri",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Serri e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Serri?",
        answer: "il centro di Serri e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Serri?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Serri su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "sestu",
    path: "/cultura-sarda/sud-sardegna/sestu",
    town: "Sestu",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Sestu: storia, tradizioni e cosa visitare",
    h1: "Sestu",
    description: "Sestu in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/sestu-panorama.webp",
      alt: "Veduta di Sestu in Sardegna",
      credit: {
        author: "cristianocani",
        license: "CC BY 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by/2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Sestu_cagliari_air_o.jpg",
      },
    },
    intro: `Sestu è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Sestu su EVERAS.`,
    history: [
      `Sestu è un comune italiano di 20 566 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Sestu resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Sestu, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Sestu su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Sestu si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Sestu",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Sestu e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Sestu?",
        answer: "il centro di Sestu e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Sestu?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Sestu su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "seulo",
    path: "/cultura-sarda/sud-sardegna/seulo",
    town: "Seulo",
    province: "Cagliari",
    area: "Barbagia di Seulo",
    title: "Seulo: storia, tradizioni e cosa visitare",
    h1: "Seulo",
    description: "Seulo in Sardegna: guida al comune della Barbagia di Seulo, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/seulo-panorama.webp",
      alt: "Veduta di Seulo in Sardegna",
      credit: {
        author: "cristianocani",
        license: "CC BY 2.0",
        licenseUrl: "https://creativecommons.org/licenses/by/2.0",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Nuraghe_Pauli_Seulo.jpg",
      },
    },
    intro: `Seulo è comune della Barbagia di Seulo in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Seulo su EVERAS.`,
    history: [
      `Seulo è un comune italiano di 747 abitanti della provincia di Nuoro, che dà il nome alla regione della Barbagia di Seùlo, in Sardegna.`,
      `Oggi Seulo resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Seulo, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Barbagia di Seulo. Le date precise cambiano ogni anno: controlla il calendario eventi a Seulo su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Barbagia di Seulo intorno",
        body: `Seulo si legge meglio insieme ai comuni vicini della Barbagia di Seulo: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Seulo",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Seulo e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Seulo?",
        answer: "il centro di Seulo e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Seulo?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Seulo su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "settimo-san-pietro",
    path: "/cultura-sarda/sud-sardegna/settimo-san-pietro",
    town: "Settimo San Pietro",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Settimo San Pietro: storia, tradizioni e cosa visitare",
    h1: "Settimo San Pietro",
    description: "Settimo San Pietro in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/settimo-san-pietro-panorama.webp",
      alt: "Veduta di Settimo San Pietro in Sardegna",
      credit: {
        author: "Burford, Robert, 1791-1861",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Description_of_a_view_of_Rome,_ancient_and_modern,_with_the_surrounding_country,_taken_from_the_tower_of_the_Capitol_,_now_exhibiting_at_the_Panorama,_Leicester_Square_(IA_descriptionofvie02burf).pdf",
      },
    },
    intro: `Settimo San Pietro è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Settimo San Pietro su EVERAS.`,
    history: [
      `Settimo San Pietro è un comune italiano di 6 945 abitanti, della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Settimo San Pietro resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Settimo San Pietro, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Settimo San Pietro su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Settimo San Pietro si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Settimo San Pietro",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Settimo San Pietro e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Settimo San Pietro?",
        answer: "il centro di Settimo San Pietro e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Settimo San Pietro?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Settimo San Pietro su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "siliqua",
    path: "/cultura-sarda/sud-sardegna/siliqua",
    town: "Siliqua",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Siliqua: storia, tradizioni e cosa visitare",
    h1: "Siliqua",
    description: "Siliqua in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/siliqua-panorama.webp",
      alt: "Veduta di Siliqua in Sardegna",
      credit: {
        author: "Alex10",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Stazioni_Siliqua_3.jpg",
      },
    },
    intro: `Siliqua è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Siliqua su EVERAS.`,
    history: [
      `Siliqua è un comune italiano di 3 446 abitanti della città metropolitana di Cagliari, situato nella valle del Cixerri.`,
      `Oggi Siliqua resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Siliqua, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Siliqua su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Siliqua si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Siliqua",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Siliqua e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Siliqua?",
        answer: "il centro di Siliqua e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Siliqua?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Siliqua su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "silius",
    path: "/cultura-sarda/sud-sardegna/silius",
    town: "Silius",
    province: "Cagliari",
    area: "Gerrei",
    title: "Silius: storia, tradizioni e cosa visitare",
    h1: "Silius",
    description: "Silius in Sardegna: guida al comune del Gerrei, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/silius-panorama.webp",
      alt: "Veduta di Silius in Sardegna",
      credit: {
        author: "E. Sassai",
        license: "CC0",
        licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Silius_-_panorama.jpg",
      },
    },
    intro: `Silius è comune del Gerrei in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Silius su EVERAS.`,
    history: [
      `Silius è un comune italiano di 985 abitanti situato a 570 metri sul livello del mare nella zona orientale della città metropolitana di Cagliari. Fa parte della subregione storica del Gerrei e confina con San Nicolò Gerrei, Ballao, Goni e San Basilio. Questo piccolo paese deve la sua importanza alla presenza del castello di Sassai o Orguglioso, alla sorgente di Is Alinos che sgorga ad un'altezza di quasi 800 m.`,
      `Oggi Silius resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Silius, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Gerrei. Le date precise cambiano ogni anno: controlla il calendario eventi a Silius su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Gerrei intorno",
        body: `Silius si legge meglio insieme ai comuni vicini del Gerrei: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Silius",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Silius e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Silius?",
        answer: "il centro di Silius e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Silius?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Silius su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "sinnai",
    path: "/cultura-sarda/sud-sardegna/sinnai",
    town: "Sinnai",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Sinnai: colline a est di Cagliari",
    h1: "Sinnai",
    description: "Sinnai in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/sinnai-panorama.webp",
      alt: "Veduta di Sinnai in Sardegna",
      credit: {
        author: "antonio.cristini",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Villaggio_delle_Mimose_-_panoramio.jpg",
      },
    },
    intro: `Sinnai è paese sulle colline a est della città in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Sinnai su EVERAS.`,
    history: [
      `Sìnnai è un comune italiano di 17 410 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Sinnai resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Sinnai, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Festa e Campidano orientale. Le date precise cambiano ogni anno: controlla il calendario eventi a Sinnai su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Sinnai si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Sinnai",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e territorio verso i monti. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Sinnai?",
        answer: "Centro e territorio verso i monti. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Sinnai?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Sinnai su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "siurgus-donigala",
    path: "/cultura-sarda/sud-sardegna/siurgus-donigala",
    town: "Siurgus Donigala",
    province: "Cagliari",
    area: "Trexenta",
    title: "Siurgus Donigala: storia, tradizioni e cosa visitare",
    h1: "Siurgus Donigala",
    description: "Siurgus Donigala in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/siurgus-donigala-panorama.webp",
      alt: "Veduta di Siurgus Donigala in Sardegna",
      credit: {
        author: "Publications Office of the European Union",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:OJ_L_202302396_of_2023_-_SV_Swedish.pdf",
      },
    },
    intro: `Siurgus Donigala è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Siurgus Donigala su EVERAS.`,
    history: [
      `Siurgus Donigala è un comune italiano di 1 815 abitanti della città metropolitana di Cagliari, nella subregione della Trexenta.`,
      `Oggi Siurgus Donigala resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Siurgus Donigala, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Siurgus Donigala su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Siurgus Donigala si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Siurgus Donigala",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Siurgus Donigala e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Siurgus Donigala?",
        answer: "il centro di Siurgus Donigala e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Siurgus Donigala?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Siurgus Donigala su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "soleminis",
    path: "/cultura-sarda/sud-sardegna/soleminis",
    town: "Soleminis",
    province: "Cagliari",
    area: "Parteolla",
    title: "Soleminis: storia, tradizioni e cosa visitare",
    h1: "Soleminis",
    description: "Soleminis in Sardegna: guida al comune del Parteolla, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/soleminis-panorama.webp",
      alt: "Veduta di Soleminis in Sardegna",
      credit: {
        author: "piantisergio",
        license: "CC BY 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Wv_Soleminis_banner.jpg",
      },
    },
    intro: `Soleminis è comune del Parteolla in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Soleminis su EVERAS.`,
    history: [
      `Soleminis è un comune italiano di 1 908 abitanti della città metropolitana di Cagliari, situato a circa 18 km da Cagliari, lungo la strada statale SS387.`,
      `Oggi Soleminis resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Soleminis, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Parteolla. Le date precise cambiano ogni anno: controlla il calendario eventi a Soleminis su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Parteolla intorno",
        body: `Soleminis si legge meglio insieme ai comuni vicini del Parteolla: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Soleminis",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Soleminis e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Soleminis?",
        answer: "il centro di Soleminis e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Soleminis?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Soleminis su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "suelli",
    path: "/cultura-sarda/sud-sardegna/suelli",
    town: "Suelli",
    province: "Cagliari",
    area: "Trexenta",
    title: "Suelli: storia, tradizioni e cosa visitare",
    h1: "Suelli",
    description: "Suelli in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/suelli-panorama.webp",
      alt: "Veduta di Suelli in Sardegna",
      credit: {
        author: "Publications Office of the European Union",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:OJ_L_202302396_of_2023_-_SV_Swedish.pdf",
      },
    },
    intro: `Suelli è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Suelli su EVERAS.`,
    history: [
      `Suelli è un comune italiano di 1 050 abitanti della città metropolitana di Cagliari, nella subregione della Trexenta.`,
      `Oggi Suelli resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Suelli, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi a Suelli su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Suelli si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Suelli",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Suelli e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Suelli?",
        answer: "il centro di Suelli e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Suelli?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Suelli su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "ussana",
    path: "/cultura-sarda/sud-sardegna/ussana",
    town: "Ussana",
    province: "Cagliari",
    area: "Trexenta",
    title: "Ussana: storia, tradizioni e cosa visitare",
    h1: "Ussana",
    description: "Ussana in Sardegna: guida al comune del Trexenta, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/ussana-panorama.webp",
      alt: "Veduta di Ussana in Sardegna",
      credit: {
        author: "Caruel, Teodoro, Parlatore, Filippo,",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Flora_italiana_-ossia,_Descrizione_delle_piante_che_crescono_spontanee_o_vegetano_come_tali_in_Italia_e_nelle_isole_ad_essa_aggiacenti;_disposta_secondo_il_metodo_naturale._(IA_mobot31753000130077).pdf",
      },
    },
    intro: `Ussana è comune del Trexenta in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Ussana su EVERAS.`,
    history: [
      `Ussana è un comune italiano di 3 988 abitanti della città metropolitana di Cagliari situato nel Campidano di Cagliari.`,
      `Oggi Ussana resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Ussana, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Trexenta. Le date precise cambiano ogni anno: controlla il calendario eventi ad Ussana su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Trexenta intorno",
        body: `Ussana si legge meglio insieme ai comuni vicini del Trexenta: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Ussana",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Ussana e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Ussana?",
        answer: "il centro di Ussana e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Ussana?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Ussana su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "uta",
    path: "/cultura-sarda/sud-sardegna/uta",
    town: "Uta",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Uta: storia, tradizioni e cosa visitare",
    h1: "Uta",
    description: "Uta in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/uta-panorama.webp",
      alt: "Veduta di Uta in Sardegna",
      credit: {
        author: "Stockholm100",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Violenrondell_-_Uta_Jacobs.jpg",
      },
    },
    intro: `Uta è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Uta su EVERAS.`,
    history: [
      `Uta è un comune italiano di 8 881 abitanti della città metropolitana di Cagliari, appartenente alla regione del Campidano di Cagliari, in Sardegna.`,
      `Oggi Uta resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Uta, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi ad Uta su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Uta si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Uta",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Uta e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Uta?",
        answer: "il centro di Uta e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Uta?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Uta su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "vallermosa",
    path: "/cultura-sarda/sud-sardegna/vallermosa",
    town: "Vallermosa",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Vallermosa: storia, tradizioni e cosa visitare",
    h1: "Vallermosa",
    description: "Vallermosa in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/vallermosa-panorama.webp",
      alt: "Paesaggio del Sud Sardegna (scheda Vallermosa)",
      credit: {
        author: "EVERAS",
        license: "All rights reserved",
        licenseUrl: "https://www.everas.it",
        sourceUrl: "https://www.everas.it/cultura-sarda/sud-sardegna",
      },
    },
    intro: `Vallermosa è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Vallermosa su EVERAS.`,
    history: [
      `Vallermosa è un comune italiano di 1 769 abitanti della città metropolitana di Cagliari, nella subregione dell'Iglesiente.`,
      `Oggi Vallermosa resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Vallermosa, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Vallermosa su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Vallermosa si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Vallermosa",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Vallermosa e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Vallermosa?",
        answer: "il centro di Vallermosa e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Vallermosa?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Vallermosa su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villa-san-pietro",
    path: "/cultura-sarda/sud-sardegna/villa-san-pietro",
    town: "Villa San Pietro",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Villa San Pietro: storia, tradizioni e cosa visitare",
    h1: "Villa San Pietro",
    description: "Villa San Pietro in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villa-san-pietro-panorama.webp",
      alt: "Veduta di Villa San Pietro in Sardegna",
      credit: {
        author: "Benjamin Gavaudo",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_de_Rome_vu_depuis_la_terrasse_de_San_Pietro_in_Montorio_(bgw20_0508).jpg",
      },
    },
    intro: `Villa San Pietro è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villa San Pietro su EVERAS.`,
    history: [
      `Villa San Pietro è un comune italiano di 2 093 abitanti della città metropolitana di Cagliari in Sardegna.`,
      `Oggi Villa San Pietro resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villa San Pietro, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Villa San Pietro su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Villa San Pietro si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villa San Pietro",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Villa San Pietro e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villa San Pietro?",
        answer: "il centro di Villa San Pietro e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villa San Pietro?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villa San Pietro su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villanova-tulo",
    path: "/cultura-sarda/sud-sardegna/villanova-tulo",
    town: "Villanova Tulo",
    province: "Cagliari",
    area: "Sarcidano",
    title: "Villanova Tulo: storia, tradizioni e cosa visitare",
    h1: "Villanova Tulo",
    description: "Villanova Tulo in Sardegna: guida al comune del Sarcidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villanova-tulo-panorama.webp",
      alt: "Veduta di Villanova Tulo in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Villanovatulo_-_Costume_tradizionale_(06).JPG",
      },
    },
    intro: `Villanova Tulo è comune del Sarcidano in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villanova Tulo su EVERAS.`,
    history: [
      `Villanova Tulo è un comune italiano di 971 abitanti della città metropolitana di Cagliari, nella subregione del Sarcidano.`,
      `Oggi Villanova Tulo resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villanova Tulo, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarcidano. Le date precise cambiano ogni anno: controlla il calendario eventi a Villanova Tulo su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarcidano intorno",
        body: `Villanova Tulo si legge meglio insieme ai comuni vicini del Sarcidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villanova Tulo",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Villanova Tulo e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villanova Tulo?",
        answer: "il centro di Villanova Tulo e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villanova Tulo?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villanova Tulo su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "barumini",
    path: "/cultura-sarda/sud-sardegna/barumini",
    town: "Barumini",
    province: "Sud Sardegna",
    area: "Marmilla",
    title: "Barumini: Su Nuraxi Unesco e Casa Zapata",
    h1: "Barumini",
    description:
      "Barumini, Marmilla: Su Nuraxi Patrimonio mondiale Unesco, Casa Zapata e Centro Giovanni Lilliu.",
    hero: {
      src: "/images/cultura/barumini-panorama.webp",
      alt: "Il complesso nuragico Su Nuraxi a Barumini, con torre centrale e villaggio",
      credit: {
        author: "Norbert Nagel",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Nuraghe_Su_Nuraxi_-_Barumini_-_Sardinia_-_Italy_-_29.jpg",
      },
    },
    intro:
      "Barumini è il paese di Su Nuraxi, iscritto Unesco nel 1997. Non è un parco a tema: è un comune della Marmilla con un nuraghe complesso scavato da Giovanni Lilliu e gestito dalla Fondazione Barumini. Questa scheda tiene sito, Casa Zapata e paese, senza inventare orari.",
    history: [
      "Su Nuraxi è un nuraghe complesso con villaggio: torre centrale, torri laterali, corti, capanne. Gli scavi di Giovanni Lilliu, dagli anni Cinquanta, ne hanno fatto il caso più noto della civiltà nuragica. L’iscrizione Unesco è del 1997: Patrimonio mondiale, un elenco diverso da quello immateriale dei Candelieri o del canto a tenore.",
      "Il paese sta in Marmilla, tra colline di basalto. Casa Zapata, palazzo cinquecentesco della famiglia aragonese, sorge sopra un altro nuraghe — Nuraxi ’e Cresia — visibile da passerelle. Il Centro Giovanni Lilliu tiene mostre sullo scavo. La Fondazione Barumini gestisce i tre luoghi; biglietti e fasce di visita stanno sul loro sito, non qui.",
    ],
    language: [
      "Si parla sardo campidanese della Marmilla, accanto all’italiano. È la stessa grande area linguistica di Cagliari, non il logudorese del centro dell’isola. La guida alle lingue tiene le varietà distinte. Non pubblichiamo conteggi di parlanti.",
    ],
    traditions: [
      {
        title: "Sito, mostre, calendario di paese",
        body: "La vita pubblica visibile è quella del patrimonio: visite guidate a Su Nuraxi, mostre al Centro Lilliu. Sagre e patronali, quando Comune e Pro Loco le pubblicano, stanno nel calendario EVERAS. Non costruiamo una «festa-simbolo» che le fonti non danno come tale. Un nuraghe non è una sagra.",
      },
    ],
    visit: [
      {
        name: "Su Nuraxi",
        body: "Area archeologica a ridosso del paese. La Fondazione indica visita guidata, di solito a gruppi e a orari fissi. Non è un sentiero libero: si entra con biglietto. In caso di maltempo il gestore può chiudere per sicurezza. Conferma su fondazionebarumini.it prima di partire. La guida ai nuraghi colloca Su Nuraxi tra i complessi, distinto da tombe dei giganti e domus de janas.",
      },
      {
        name: "Casa Zapata e Centro Giovanni Lilliu",
        body: "In paese. Casa Zapata unisce palazzo, nuraghe sotto il pavimento e sezioni di reperti. Il Centro Lilliu racconta lo scavo e tiene mostre temporanee. Spesso un unico biglietto copre i tre siti: si verifica sulla Fondazione. Il centro del comune è piccolo: chiese e piazza, non un secondo itinerario turistico.",
      },
    ],
    faqs: [
      {
        question: "Su Nuraxi è l’unico nuraghe Unesco?",
        answer:
          "È il sito nuragico iscritto nella Lista del patrimonio mondiale (1997). Altri nuraghi hanno tutele diverse. Candelieri e canto a tenore stanno su elenchi Unesco immateriali, un altro piano.",
      },
      {
        question: "Casa Zapata è lo stesso sito di Su Nuraxi?",
        answer:
          "No. Su Nuraxi è l’area a cielo aperto. Casa Zapata è il palazzo in paese, sopra Nuraxi ’e Cresia. Si visitano insieme se il biglietto della Fondazione lo prevede.",
      },
      {
        question: "Dove confermo orari e prezzi?",
        answer:
          "Sul sito della Fondazione Barumini. Questa guida non copia listini: cambiano per stagione e sicurezza.",
      },
    ],
    sources: [
      {
        label: "UNESCO — Su Nuraxi di Barumini",
        href: "https://whc.unesco.org/en/list/833/",
      },
      {
        label: "Fondazione Barumini Sistema Cultura",
        href: "https://www.fondazionebarumini.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/nuraghi-archeologia-sardegna", label: "Nuraghi e archeologia" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura/storia-sardegna", label: "Storia della Sardegna" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villacidro",
    path: "/cultura-sarda/sud-sardegna/villacidro",
    town: "Villacidro",
    province: "Sud Sardegna",
    area: "Medio Campidano",
    title: "Villacidro: Medio Campidano",
    h1: "Villacidro",
    description: "Villacidro in Sardegna: guida al comune del Medio Campidano, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villacidro-panorama.webp",
      alt: "Veduta di Villacidro in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Villacidro_-_Costume_tradizionale_(07).JPG",
      },
    },
    intro: `Villacidro è centro del Medio Campidano in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villacidro su EVERAS.`,
    history: [
      `Villacidro è un comune italiano di 12 821 abitanti, capoluogo della provincia del Medio Campidano.`,
      `Oggi Villacidro resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villacidro, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Festa e paese di collina. Le date precise cambiano ogni anno: controlla il calendario eventi a Villacidro su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Medio Campidano intorno",
        body: `Villacidro si legge meglio insieme ai comuni vicini del Medio Campidano: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villacidro",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro e territorio verso i monti. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villacidro?",
        answer: "Centro e territorio verso i monti. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villacidro?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villacidro su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villanovaforru",
    path: "/cultura-sarda/sud-sardegna/villanovaforru",
    town: "Villanovaforru",
    province: "Sud Sardegna",
    area: "Marmilla",
    title: "Villanovaforru: storia, tradizioni e cosa visitare",
    h1: "Villanovaforru",
    description: "Villanovaforru in Sardegna: guida al comune della Marmilla, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villanovaforru-panorama.webp",
      alt: "Veduta di Villanovaforru in Sardegna",
      credit: {
        author: "Gianni Careddu",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Villanovaforru_-_Panorama_(03).jpg",
      },
    },
    intro: `Villanovaforru è comune della Marmilla in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villanovaforru su EVERAS.`,
    history: [
      `Villanovaforru è un comune italiano di 801 abitanti della provincia del Medio Campidano.`,
      `Oggi Villanovaforru resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villanovaforru, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Marmilla. Le date precise cambiano ogni anno: controlla il calendario eventi a Villanovaforru su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "La Marmilla intorno",
        body: `Villanovaforru si legge meglio insieme ai comuni vicini della Marmilla: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villanovaforru",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Villanovaforru e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villanovaforru?",
        answer: "il centro di Villanovaforru e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villanovaforru?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villanovaforru su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villaputzu",
    path: "/cultura-sarda/sud-sardegna/villaputzu",
    town: "Villaputzu",
    province: "Cagliari",
    area: "Sarrabus",
    title: "Villaputzu: storia, tradizioni e cosa visitare",
    h1: "Villaputzu",
    description: "Villaputzu in Sardegna: guida al comune del Sarrabus, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villaputzu-panorama.webp",
      alt: "Veduta di Villaputzu in Sardegna",
      credit: {
        author: "MatteoNL97",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Un_panorama_di_Villaputzu_e_del_villaggio_di_San_Vito_in_distanza_2019.jpg",
      },
    },
    intro: `Villaputzu è comune del Sarrabus in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villaputzu su EVERAS.`,
    history: [
      `Villaputzu, è un comune italiano di 4 353 abitanti della Città metropolitana di Cagliari, situato nella subregione del Sarrabus; è parte della diocesi di Lanusei.`,
      `Oggi Villaputzu resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villaputzu, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sarrabus. Le date precise cambiano ogni anno: controlla il calendario eventi a Villaputzu su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarrabus intorno",
        body: `Villaputzu si legge meglio insieme ai comuni vicini del Sarrabus: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villaputzu",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Villaputzu e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villaputzu?",
        answer: "il centro di Villaputzu e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villaputzu?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villaputzu su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villasalto",
    path: "/cultura-sarda/sud-sardegna/villasalto",
    town: "Villasalto",
    province: "Cagliari",
    area: "Gerrei",
    title: "Villasalto: storia, tradizioni e cosa visitare",
    h1: "Villasalto",
    description: "Villasalto in Sardegna: guida al comune del Gerrei, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villasalto-panorama.webp",
      alt: "Veduta di Villasalto in Sardegna",
      credit: {
        author: "Pietro Rolla",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Toponimia_sarda.djvu",
      },
    },
    intro: `Villasalto è comune del Gerrei in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villasalto su EVERAS.`,
    history: [
      `Villasalto è un comune italiano di 863 abitanti della città metropolitana di Cagliari.`,
      `Oggi Villasalto resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villasalto, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Gerrei. Le date precise cambiano ogni anno: controlla il calendario eventi a Villasalto su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Gerrei intorno",
        body: `Villasalto si legge meglio insieme ai comuni vicini del Gerrei: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villasalto",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Villasalto e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villasalto?",
        answer: "il centro di Villasalto e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villasalto?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villasalto su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villasimius",
    path: "/cultura-sarda/sud-sardegna/villasimius",
    town: "Villasimius",
    province: "Cagliari",
    area: "Sarrabus",
    title: "Villasimius: Capo Carbonara e mare",
    h1: "Villasimius",
    description: "Villasimius in Sardegna: guida al comune del Sarrabus, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villasimius-panorama.webp",
      alt: "Veduta di Villasimius in Sardegna",
      credit: {
        author: "Giamas",
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Villasimius3.jpg",
      },
    },
    intro: `Villasimius è porta sull’area marina di Capo Carbonara in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villasimius su EVERAS.`,
    history: [
      `Villasimius è un comune italiano di 3 766 abitanti della città metropolitana di Cagliari, noto come località turistica.`,
      `Oggi Villasimius resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villasimius, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Estate, diving e costa del Sarrabus. Le date precise cambiano ogni anno: controlla il calendario eventi a Villasimius su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sarrabus intorno",
        body: `Villasimius si legge meglio insieme ai comuni vicini del Sarrabus: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villasimius",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Spiagge, porto e centro di Villasimius. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villasimius?",
        answer: "Spiagge, porto e centro di Villasimius. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villasimius?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villasimius su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villasor",
    path: "/cultura-sarda/sud-sardegna/villasor",
    town: "Villasor",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Villasor: storia, tradizioni e cosa visitare",
    h1: "Villasor",
    description: "Villasor in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villasor-panorama.webp",
      alt: "Veduta di Villasor in Sardegna",
      credit: {
        author: "Nicola Secci",
        license: "CC BY 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Villasor.jpg",
      },
    },
    intro: `Villasor è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villasor su EVERAS.`,
    history: [
      `Villasor è un comune italiano di 6 472 abitanti della città metropolitana di Cagliari in Sardegna. Si trova al centro del Campidano di Cagliari, dista dal capoluogo 25 km e vi è collegato tramite la linea ferroviaria Cagliari-Golfo Aranci e la strada statale 196.`,
      `Oggi Villasor resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villasor, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Villasor su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Villasor si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villasor",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Villasor e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villasor?",
        answer: "il centro di Villasor e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villasor?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villasor su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "villaspeciosa",
    path: "/cultura-sarda/sud-sardegna/villaspeciosa",
    town: "Villaspeciosa",
    province: "Cagliari",
    area: "Campidano di Cagliari",
    title: "Villaspeciosa: storia, tradizioni e cosa visitare",
    h1: "Villaspeciosa",
    description: "Villaspeciosa in Sardegna: guida al comune del Campidano di Cagliari, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/villaspeciosa-panorama.webp",
      alt: "Veduta di Villaspeciosa in Sardegna",
      credit: {
        author: "Pampuco",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Villaspeciosa_aerial_view.png",
      },
    },
    intro: `Villaspeciosa è comune del Campidano di Cagliari in provincia di Cagliari. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Villaspeciosa su EVERAS.`,
    history: [
      `Villaspeciosa è un comune italiano di 2 697 abitanti che si trova nella città metropolitana di Cagliari.`,
      `Oggi Villaspeciosa resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Villaspeciosa, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Campidano di Cagliari. Le date precise cambiano ogni anno: controlla il calendario eventi a Villaspeciosa su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Campidano di Cagliari intorno",
        body: `Villaspeciosa si legge meglio insieme ai comuni vicini del Campidano di Cagliari: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Villaspeciosa",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Villaspeciosa e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Villaspeciosa?",
        answer: "il centro di Villaspeciosa e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Villaspeciosa?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Villaspeciosa su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "carbonia",
    path: "/cultura-sarda/sud-sardegna/carbonia",
    town: "Carbonia",
    province: "Sud Sardegna",
    area: "Sulcis",
    title: "Carbonia: Sulcis e città mineraria",
    h1: "Carbonia",
    description: "Carbonia in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/carbonia-panorama.webp",
      alt: "Veduta di Carbonia in Sardegna",
      credit: {
        author: "Alex10",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_carbonia.jpg",
      },
    },
    intro: `Carbonia è città del Sulcis nata dalle miniere in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Carbonia su EVERAS.`,
    history: [
      `Carbonia è un comune italiano di 25 219 abitanti, capoluogo della provincia del Sulcis Iglesiente assieme a Iglesias.`,
      `Oggi Carbonia resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Carbonia, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Memoria mineraria e Sulcis. Le date precise cambiano ogni anno: controlla il calendario eventi a Carbonia su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Carbonia si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Carbonia",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro razionalista e museo del carbone. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Carbonia?",
        answer: "Centro razionalista e museo del carbone. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Carbonia?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Carbonia su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "carloforte",
    path: "/cultura-sarda/sud-sardegna/carloforte",
    town: "Carloforte",
    province: "Sud Sardegna",
    area: "Sulcis",
    title: "Carloforte: Isola di San Pietro",
    h1: "Carloforte",
    description: "Carloforte in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/carloforte-panorama.webp",
      alt: "Veduta di Carloforte in Sardegna",
      credit: {
        author: "Unknown authorUnknown author",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_di_Carloforte_(xilografia).jpg",
      },
    },
    intro: `Carloforte è paese tabarchino sull’isola di San Pietro in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Carloforte su EVERAS.`,
    history: [
      `Carloforte è un comune italiano di 5 790 abitanti della provincia del Sulcis Iglesiente.Il territorio comunale comprende l'isola di San Pietro nella sua interezza e alcune isole minori che la circondano, al largo della sub-regione del Sulcis-Iglesiente, in Sardegna; l'isola è situata a circa 10 km dalla costa sudoccidentale sarda e costituisce, insieme alla vicina isola di Sant'Antioco e ad altri isolotti e.`,
      `Oggi Carloforte resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Carloforte, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Tonno, dialetto tabarchino e festa. Le date precise cambiano ogni anno: controlla il calendario eventi a Carloforte su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Carloforte si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Carloforte",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro, porto e costa di San Pietro. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Carloforte?",
        answer: "Centro, porto e costa di San Pietro. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Carloforte?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Carloforte su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "gonnesa",
    path: "/cultura-sarda/sud-sardegna/gonnesa",
    town: "Gonnesa",
    province: "Sud Sardegna",
    area: "Sulcis",
    title: "Gonnesa: storia, tradizioni e cosa visitare",
    h1: "Gonnesa",
    description: "Gonnesa in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/gonnesa-panorama.webp",
      alt: "Veduta di Gonnesa in Sardegna",
      credit: {
        author: "Villaggionormann",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Via_Stefani_Gonnesa_Sardegna_Italia_Miniera_San_Giovanni_febbraio_2023.jpg",
      },
    },
    intro: `Gonnesa è comune del Sulcis in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Gonnesa su EVERAS.`,
    history: [
      `Gonnesa è un comune italiano di 4 539 abitanti della provincia del Sulcis Iglesiente. Si trova nella Sardegna sud-occidentale nella regione dell'Iglesiente.`,
      `Oggi Gonnesa resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Gonnesa, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sulcis. Le date precise cambiano ogni anno: controlla il calendario eventi a Gonnesa su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Gonnesa si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Gonnesa",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Gonnesa e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Gonnesa?",
        answer: "il centro di Gonnesa e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Gonnesa?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Gonnesa su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "iglesias",
    path: "/cultura-sarda/sud-sardegna/iglesias",
    town: "Iglesias",
    province: "Sud Sardegna",
    area: "Sulcis",
    title: "Iglesias: miniere e centro storico",
    h1: "Iglesias",
    description: "Iglesias in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/iglesias-panorama.webp",
      alt: "Veduta di Iglesias in Sardegna",
      credit: {
        author: "Unknown authorUnknown author",
        license: "Public domain",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Saint_Demetrius_Panorama_Kalapot_Fresco_10.jpg",
      },
    },
    intro: `Iglesias è città mineraria del Sulcis-Iglesiente in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma ad Iglesias su EVERAS.`,
    history: [
      `Iglesias è un comune italiano di 24 303 abitanti e co-capoluogo della provincia del Sulcis Iglesiente. Si trova nella Sardegna sud-occidentale, nella regione dell'Iglesiente, di cui è il principale centro abitato e a cui dà il nome. Nei secoli della dominazione aragonese e spagnola fu una delle città regie della Sardegna. È sede vescovile, erede storica dell'antica diocesi di Sulcis.`,
      `Oggi Iglesias resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento ad Iglesias, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Miniere, festa e Iglesiente. Le date precise cambiano ogni anno: controlla il calendario eventi ad Iglesias su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Iglesias si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Iglesias",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro storico e territorio minerario. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare ad Iglesias?",
        answer: "Centro storico e territorio minerario. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi ad Iglesias?",
        answer: "In fondo a questa guida e sulla pagina Eventi ad Iglesias su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "narcao",
    path: "/cultura-sarda/sud-sardegna/narcao",
    town: "Narcao",
    province: "Sud Sardegna",
    area: "Sulcis",
    title: "Narcao: storia, tradizioni e cosa visitare",
    h1: "Narcao",
    description: "Narcao in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/narcao-panorama.webp",
      alt: "Veduta di Narcao in Sardegna",
      credit: {
        author: "Alex10",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Stazione_Narcao_4.jpg",
      },
    },
    intro: `Narcao è comune del Sulcis in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Narcao su EVERAS.`,
    history: [
      `Narcao è un comune italiano di 2 927 abitanti della provincia del Sulcis Iglesiente, nella regione del Sulcis.`,
      `Oggi Narcao resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Narcao, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sulcis. Le date precise cambiano ogni anno: controlla il calendario eventi a Narcao su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Narcao si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Narcao",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Narcao e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Narcao?",
        answer: "il centro di Narcao e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Narcao?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Narcao su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "portoscuso",
    path: "/cultura-sarda/sud-sardegna/portoscuso",
    town: "Portoscuso",
    province: "Sud Sardegna",
    area: "Sulcis",
    title: "Portoscuso: storia, tradizioni e cosa visitare",
    h1: "Portoscuso",
    description: "Portoscuso in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/portoscuso-panorama.webp",
      alt: "Veduta di Portoscuso in Sardegna",
      credit: {
        author: "Marco C.",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Tonnara_Portoscuso.jpg",
      },
    },
    intro: `Portoscuso è comune del Sulcis in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Portoscuso su EVERAS.`,
    history: [
      `Portoscuso è un comune italiano di 4 639 abitanti della provincia del Sulcis Iglesiente. Si trova nella Sardegna sud-occidentale, nella sub-regione del Sulcis-Iglesiente.`,
      `Oggi Portoscuso resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Portoscuso, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `feste patronali e vita di paese nel Sulcis. Le date precise cambiano ogni anno: controlla il calendario eventi a Portoscuso su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Portoscuso si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Portoscuso",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: il centro di Portoscuso e il territorio comunale. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Portoscuso?",
        answer: "il centro di Portoscuso e il territorio comunale. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Portoscuso?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Portoscuso su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
  {
    slug: "sant-antioco",
    path: "/cultura-sarda/sud-sardegna/sant-antioco",
    town: "Sant'Antioco",
    province: "Sud Sardegna",
    area: "Sulcis",
    title: "Sant'Antioco: isola e storia",
    h1: "Sant'Antioco",
    description: "Sant'Antioco in Sardegna: guida al comune del Sulcis, cosa visitare e eventi in programma su EVERAS.",
    hero: {
      src: "/images/cultura/sant-antioco-panorama.webp",
      alt: "Veduta di Sant'Antioco in Sardegna",
      credit: {
        author: "Alex10",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl: "https://commons.wikimedia.org/wiki/File:Panorama_Sant'Antioco.jpg",
      },
    },
    intro: `Sant'Antioco è isola collegata alla terraferma del Sulcis in provincia di Sud Sardegna. Questa scheda raccoglie storia, tradizioni e cosa visitare, e sotto trovi gli eventi in programma a Sant'Antioco su EVERAS.`,
    history: [
      `Sant'Antìoco è un comune italiano di 10 344 abitanti della provincia del Sulcis Iglesiente, nel Sulcis. Il comune sorge sui resti di Sulki, una delle città più antiche del Mediterraneo occidentale.`,
      `Oggi Sant'Antioco resta un punto della directory Cultura sarda del Sud: da qui colleghi musei, sagre e il calendario eventi del comune. Se organizzi o cerchi un appuntamento a Sant'Antioco, la scheda evento su EVERAS rimanda a questa guida.`,
    ],
    traditions: [
      {
        title: "Feste e identità locale",
        body: `Festa di Sant’Antioco e mare del Sulcis. Le date precise cambiano ogni anno: controlla il calendario eventi a Sant'Antioco su EVERAS per sagre, concerti e appuntamenti pubblicati da Comuni, Pro Loco e organizzatori.`,
      },
      {
        title: "Il Sulcis intorno",
        body: `Sant'Antioco si legge meglio insieme ai comuni vicini del Sulcis: stesse strade, spesso stesse famiglie di feste e stessi paesaggi. Usa la guida dell’area Sud Sardegna per spostarti paese per paese.`,
      },
    ],
    visit: [
      {
        name: "Centro di Sant'Antioco",
        body: `Parti dal centro: chiese, piazza e servizi. In paesi piccoli gli orari di musei e uffici turistici cambiano: conferma sul sito del Comune prima di partire.`,
      },
      {
        name: "Cosa vedere nel territorio",
        body: `Nel territorio comunale conta soprattutto: Centro storico, tophet e costa. Se cerchi spiagge, nuraghi o siti archeologici, verifica accessi e stagione. Gli eventi aperti al pubblico compaiono sotto in questa stessa pagina.`,
      },
    ],
    faqs: [
      {
        question: "Cosa visitare a Sant'Antioco?",
        answer: "Centro storico, tophet e costa. Poi apri il calendario eventi per sapere cosa c’è in programma.",
      },
      {
        question: "Dove trovo gli eventi a Sant'Antioco?",
        answer: "In fondo a questa guida e sulla pagina Eventi a Sant'Antioco su EVERAS, con data, luogo e locandina quando disponibili.",
      },
    ],
    publishedAt: "2026-09-14",
  },
];
