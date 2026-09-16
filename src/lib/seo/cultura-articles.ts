import type { PhotoCredit } from "@/src/lib/seo/cultura-towns";
import { CULTURA_PEOPLE_ARTICLES } from "@/src/lib/seo/cultura-articles-people";

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
  /** Guide paese / hub collegati (link cliccabili in pagina). */
  relatedLinks?: Array<{ href: string; label: string }>;
  publishedAt: string;
};

export const CULTURA_ARTICLES_HUB = {
  path: CULTURA_ARTICLES_HUB_PATH,
  title: "Cultura Sarda: storie, personaggi e territorio",
  h1: "Cultura Sarda",
  description:
    "Approfondimenti sulla Sardegna: personaggi noti nel mondo, zona blu, matriarcato, Ichnusa e legami con guide paese ed eventi EVERAS.",
  paragraphs: [
    "Qui non trovi le guide paese per paese: quelle stanno in Scopri la Sardegna. Cultura Sarda è lo spazio per leggere l’isola a tema - personaggi, longevità, società, nomi antichi - e poi aprire le schede dei comuni collegati.",
    "Da Grazia Deledda a Francesco Cossiga, da Gramsci a Maria Carta e Emilio Lussu: storie che partono da un paese e arrivano al mondo, con link alle guide Everas.",
  ],
} as const;

export const CULTURA_THEME_ARTICLES: CulturaArticle[] = [
  {
    slug: "sardegna-zona-blu",
    path: "/cultura/sardegna-zona-blu",
    title: "La Sardegna zona blu: longevità dei sardi e paesi dell’interno",
    h1: "La Sardegna zona blu",
    description:
      "Perché la Sardegna è una Blue Zone: longevità dei sardi, Ogliastra e Barbagia, stile di vita, cibo e comunità, e come viverla tra eventi e paesi su EVERAS.",
    intro:
      "Da anni la Sardegna compare nelle mappe delle Blue Zone: aree del mondo dove le persone vivono più a lungo e in salute. Non è un mito da cartolina: è un intreccio di territorio, comunità, movimento quotidiano e cibo semplice. Questa guida spiega cos’è la zona blu sarda e dove andare per capirla davvero.",
    excerpt:
      "Ogliastra, Barbagia e lo stile di vita che rende la Sardegna una delle Blue Zone del mondo.",
    hero: {
      src: "/images/cultura/zona-blu-hero.webp",
      alt: "Anziani in un paese dell’interno sardo, simbolo della zona blu e della longevità",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl: "https://www.everas.it/cultura/sardegna-zona-blu",
        sourceUrl: "https://www.everas.it/cultura",
        sourceLabel: "Cultura Sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Cos’è una Blue Zone",
        paragraphs: [
          "Le Blue Zone sono regioni studiate per la concentrazione insolita di centenari e di persone che restano attive fino a tarda età. Accanto a Okinawa, Nicoya, Ikaria e Loma Linda, la Sardegna, in particolare l’entroterra orientale e centrale, è entrata in queste mappe per dati demografici e stile di vita osservati sul campo.",
          "Non significa che ogni paese dell’isola sia uguale. La ricerca punta soprattutto su comuni dell’Ogliastra e della Barbagia, dove pastorizia, cammino quotidiano, rete familiare e alimentazione mediterranea “di casa” si sono mantenuti più a lungo che nelle coste turistiche.",
        ],
      },
      {
        title: "Dove si concentra la longevità in Sardegna",
        paragraphs: [
          "Il cuore della narrazione zona blu tocca l’Ogliastra (Villagrande Strisaili, Baunei e dintorni) e i paesi della Barbagia e del Mandrolisai. Sono luoghi di alture, strade strette, piazze piccole e ritmi legati alle stagioni più che agli orari da ufficio.",
          "Se vuoi avvicinarti a questo territorio, non bastano le spiagge: servono i paesi interni. Su EVERAS li trovi nelle guide di Scopri la Sardegna (Centro) e nel calendario quando aprono corti, sagre e feste, da Autunno in Barbagia alle sagre di paese.",
        ],
      },
      {
        title: "Cosa conta davvero: movimento, cibo, comunità",
        paragraphs: [
          "Nella lettura più sobria della zona blu sarda, i fattori ricorrenti sono tre. Primo: movimento naturale - salite, lavoro all’aperto, non “palestra” ma vita. Secondo: tavola semplice - pane, legumi, formaggi, verdure dell’orto, vino con moderazione, poca carne ma di qualità. Terzo: appartenenza - famiglia allargata, vicinato, feste di paese che tengono insieme le generazioni.",
          "Le sagre e le Cortes Apertas non sono solo turismo: sono il modo in cui i paesi ancora si incontrano. Per questo un calendario eventi aggiornato aiuta chi vuole capire la Sardegna viva, non solo fotografarla.",
        ],
      },
      {
        title: "Come viverla con EVERAS",
        paragraphs: [
          "Apri Scopri la Sardegna e scegli i comuni del Centro: da lì entri nelle schede paese. Poi guarda il calendario - weekend, sagre, Autunno in Barbagia - per essere lì quando le corti e le piazze si aprono.",
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
  {
    slug: "sardegna-matriarcale",
    path: "/cultura/sardegna-matriarcale",
    title:
      "La Sardegna matriarcale: origini, donna sarda e ruolo nella società",
    h1: "La Sardegna matriarcale",
    description:
      "Cosa significa Sardegna matriarcale: origini del mito e della realtà, ruolo della donna nei paesi, famiglia, eredità e feste, e dove leggerla oggi tra guide e eventi EVERAS.",
    intro:
      "Si dice spesso che la Sardegna sia un’isola matriarcale. Non è uno slogan da brochure: è un modo per raccontare il peso storico della donna nella casa, nella terra, nella trasmissione della lingua e nelle decisioni di famiglia, soprattutto nell’interno. Questa guida distingue mito, memoria e ciò che ancora si vede nei paesi.",
    excerpt:
      "Origini del matriarcato sardo, ruolo della donna nei paesi e perché ancora conta oggi.",
    hero: {
      src: "/images/cultura/matriarcale-hero.webp",
      alt: "Tre generazioni di donne sarde a tavola, simbolo della Sardegna matriarcale",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl: "https://www.everas.it/cultura/sardegna-matriarcale",
        sourceUrl: "https://www.everas.it/cultura",
        sourceLabel: "Cultura Sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Cosa si intende per Sardegna matriarcale",
        paragraphs: [
          "In antropologia e nel discorso pubblico “matriarcale” non significa che le donne governassero lo Stato. In Sardegna indica piuttosto una società in cui la donna è centro della casa, gestisce beni e relazioni, educa, tiene i conti della vita quotidiana e spesso decide mentre gli uomini sono al pascolo, in miniera o emigrati.",
          "Il contrasto tipico è con una lettura “maschile” della pastorizia: fuori il mondo degli uomini e delle mandrie; dentro, autorità femminile su famiglia e patrimonio. Non è uguale in ogni villaggio né in ogni epoca, ma è un filo ricorrente nelle storie dell’interno.",
        ],
      },
      {
        title: "Origini: casa, terra e assenza maschile",
        paragraphs: [
          "Le radici si intrecciano. Nella Sardegna agro-pastorale l’uomo poteva passare mesi lontano: ovini, lavoro stagionale, poi emigrazione. Chi restava - mogli, madri, nonne - teneva viva la casa, i campi vicini, i rapporti con il paese. In molte famiglie la donna era chi “sapeva”, chi negoziava, chi custodiva la memoria.",
          "Si parla anche di pratiche ereditarie e di centralità del lignaggio materno nella vita quotidiana, senza trasformarlo in un matriarcato giuridico formale. Il punto utile per chi visita o legge oggi: capire perché in tanti paesi la figura della matriarca - la massaia, la nonna, la zia - resta il nodo della comunità.",
        ],
      },
      {
        title: "Lingua, costume e feste: dove si vede ancora",
        paragraphs: [
          "La trasmissione del sardo, del pane, dei riti di passaggio e del vestito tradizionale passa spesso dalle donne. Il costume femminile in Cavalcata, feste patronali e sagre non è solo bellezza: è dichiarazione pubblica di appartenenza e di ruolo.",
          "Nelle Cortes Apertas e nelle case aperte d’autunno trovi laboratori, cucine e cortili dove le donne raccontano mestieri e ricette. È lo stesso mondo che su EVERAS colleghi al calendario: non folklore da museo, ma paese che si apre quando c’è festa.",
        ],
      },
      {
        title: "Come approfondire su EVERAS",
        paragraphs: [
          "Apri Scopri la Sardegna e leggi le schede dei paesi dell’interno - Logudoro, Barbagia, Ogliastra - dove storia e tradizioni locali danno contesto a questa lettura. Poi usa il calendario: Cavalcata, sagre, Autunno in Barbagia sono i momenti in cui il ruolo pubblico della donna e della famiglia diventa visibile.",
          "Cultura Sarda affianca pezzi come la zona blu e questo sul matriarcato: due chiavi diverse per lo stesso territorio. Dalla pagina articolo torni alle guide paese e agli eventi senza perdere il filo.",
        ],
      },
    ],
    faqs: [
      {
        question: "La Sardegna è davvero matriarcale?",
        answer:
          "È una definizione usata per sottolineare il ruolo centrale della donna in casa, famiglia e comunità, soprattutto nell’interno agro-pastorale. Non significa un governo politico femminile formale, ma una memoria sociale ancora riconoscibile.",
      },
      {
        question: "Dove si percepisce di più?",
        answer:
          "Nei paesi dell’interno e nelle feste - costumi, sagre, case aperte - più che nelle sole località balneari. Le guide di Scopri la Sardegna e il calendario eventi aiutano a scegliere luoghi e date.",
      },
      {
        question: "Cosa c’entra con gli eventi?",
        answer:
          "Feste patronali, Cavalcata e Cortes Apertas sono spazi pubblici dove famiglie e donne portano costume, cibo e mestieri. Il calendario EVERAS ti dice quando quei momenti sono in programma.",
      },
    ],
    publishedAt: "2026-09-16",
  },
  {
    slug: "ichnusa-nome-antico-sardegna",
    path: "/cultura/ichnusa-nome-antico-sardegna",
    title: "Ichnusa: il nome antico della Sardegna e le sue origini",
    h1: "Ichnusa, il nome antico della Sardegna",
    description:
      "Cosa significa Ichnusa (Icnusa): quando nasce il nome greco della Sardegna, perché richiama l’impronta del piede, Sandaliotis e altre denominazioni antiche.",
    intro:
      "Prima di “Sardegna” i greci chiamavano l’isola Ichnusa (Ἰχνοῦσα), spesso resa in italiano come Icnusa. Il nome non è un marchio moderno: arriva dai geografi e mitografi antichi, e allude alla forma dell’isola vista dall’alto, simile a un’impronta. Questa guida ricostruisce quando compare, cosa significa e come si collega agli altri nomi della storia.",
    excerpt:
      "Dal greco Ichnousa all’isola a forma di piede: origini e storia del nome antico.",
    hero: {
      src: "/images/cultura/ichnusa-cartina.webp",
      alt: "Cartina antica dell’isola etichettata Ichnusa, forma a impronta della Sardegna",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl: "https://www.everas.it/cultura/ichnusa-nome-antico-sardegna",
        sourceUrl: "https://www.everas.it/cultura",
        sourceLabel: "Cultura Sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Cosa significa Ichnusa",
        paragraphs: [
          "Ichnusa deriva dal greco Ichnousa (Ἰχνοῦσα), legato a íchnos, “impronta” o “traccia del piede”. Secondo la tradizione riportata da Pausania e ripresa da autori latini, i greci avrebbero scelto quel nome perché il profilo dell’isola ricordava la pianta di un piede umano.",
          "In latino si trova anche Ichnusa. Accanto compare Sandaliotis (da sándalo, sandalo), sempre per la forma. Non erano i nomi usati ogni giorno dagli abitanti: erano etichette del mondo greco-romano per descrivere l’isola sulle rotte del Mediterraneo.",
        ],
      },
      {
        title: "A quando risale",
        paragraphs: [
          "Il nome greco circola nella letteratura e nella geografia antiche almeno dall’età classica ed ellenistica, e arriva fino agli autori romani. Pausania, nel X libro della Periegesi, racconta le tradizioni sull’isola e ricorda Ichnusa come denominazione precedente rispetto a quella legata a Sardus. Plinio e Silio Italico citano Ichnusa tra i nomi antichi della Sardegna.",
          "Non esiste una “data di battesimo” precisa come per una città fondata in un anno: Ichnusa è un esonimo, un nome dato da fuori. Arriva quando i greci scrivono e navigano il Tirreno, secoli prima dell’era cristiana, e resta nella memoria erudita mentre sul posto si consolidano altre storie e altri nomi.",
        ],
      },
      {
        title: "Da Ichnusa a Sardegna",
        paragraphs: [
          "Accanto a Ichnusa e Sandaliotis, le fonti collegano il nome Sardegna / Sardo a tradizioni mitiche su Sardus, figlio di un Eracle libico secondo Pausania, e a popoli e contatti con il Nord Africa e il Mediterraneo occidentale. Con Roma l’isola entra come provincia; il nome latino Sardinia diventa quello dominante nelle mappe e nei documenti.",
          "Ichnusa non sparisce del tutto: resta nelle citazioni antiche e, molto più tardi, torna come eco culturale (anche nel nome di una birra nota), ma sul piano storico ufficiale l’isola è Sardegna. Capire Ichnusa serve a ricordare che l’identità dell’isola è stata raccontata anche da chi la vedeva dalla nave, non solo da chi ci viveva.",
        ],
      },
      {
        title: "Come continuare su EVERAS",
        paragraphs: [
          "Dalla cartina al territorio: apri Scopri la Sardegna e leggi le guide dei paesi, dai nuraghi dell’interno alle coste. Poi usa il calendario eventi per feste, sagre e rassegne che tengono viva la cultura dell’isola oggi.",
          "In Cultura Sarda trovi anche la zona blu e la lettura sulla Sardegna matriarcale: tre chiavi diverse - nome antico, longevità, ruolo delle donne - sullo stesso territorio.",
        ],
      },
    ],
    faqs: [
      {
        question: "Ichnusa e Icnusa sono la stessa cosa?",
        answer:
          "Sì. Ichnusa è la forma più vicina al greco e al latino; Icnusa è una resa italiana frequente. Entrambe indicano il nome antico dell’isola legato all’impronta.",
      },
      {
        question: "Quando si è smesso di chiamarla Ichnusa?",
        answer:
          "Non c’è un anno preciso. Ichnusa resta un nome erudito greco-latino; con Roma e poi nel Medioevo prevale Sardegna / Sardinia. Ichnusa sopravvive soprattutto nei testi antichi e nella memoria culturale.",
      },
      {
        question: "Perché la forma a piede?",
        answer:
          "I greci associavano il profilo dell’isola, allungato e “plantare”, a un’impronta (íchnos). Da lì Ichnousa e, in parallelo, Sandaliotis, “isola a forma di sandalo”.",
      },
    ],
    publishedAt: "2026-09-16",
  },
  {
    slug: "grazia-deledda-premio-nobel",
    path: "/cultura/grazia-deledda-premio-nobel",
    title:
      "Grazia Deledda premio Nobel: la scrittrice di Nuoro e la Sardegna",
    h1: "Grazia Deledda e il premio Nobel",
    description:
      "Grazia Deledda, premio Nobel per la Letteratura 1926: chi era, perché vinse, Nuoro e la Barbagia nei suoi romanzi, e dove seguirne le tracce su EVERAS.",
    intro:
      "Nel 1926 Grazia Deledda diventa la prima italiana a ricevere il premio Nobel per la Letteratura. Nata a Nuoro, racconta la Sardegna interiore - passioni, onore, fede, destino - senza folklore da cartolina. Questa guida ripercorre chi era, perché il Nobel, e come leggere oggi il suo legame con l’isola.",
    excerpt:
      "La scrittrice di Nuoro, il Nobel 1926 e la Sardegna nei suoi romanzi.",
    hero: {
      src: "/images/cultura/deledda-ritratto.webp",
      alt: "Ritratto di Grazia Deledda alla scrivania con Nuoro sullo sfondo",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl: "https://www.everas.it/cultura/grazia-deledda-premio-nobel",
        sourceUrl: "https://www.everas.it/cultura",
        sourceLabel: "Cultura Sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Chi era Grazia Deledda",
        paragraphs: [
          "Grazia Deledda nasce a Nuoro nel 1871, in una famiglia della piccola borghesia di paese. Studia poco a scuola rispetto ai canoni dell’epoca, ma legge molto e scrive presto: racconti e romanzi che portano la Barbagia e il nuorese sulla scena italiana ed europea.",
          "Vive poi a Roma con il marito, restando legata all’isola nei temi e nei paesaggi. Muore a Roma nel 1936. Opere come Elias Portolu, Cenere, Canne al vento e Cosima fissano un’immagine letteraria della Sardegna fatta di interiorità e conflitto, non di sole spiagge.",
        ],
      },
      {
        title: "Il premio Nobel 1926",
        paragraphs: [
          "L’Accademia di Svezia le assegna il Nobel per la Letteratura nel 1926, riconoscendo la forza dei suoi ritratti della vita sarda e la chiarezza stilistica. È la prima donna italiana a ottenere il premio in quella disciplina, e una delle poche voci del Mediterraneo a entrare così presto nel canone mondiale.",
          "Il Nobel non “inventa” Deledda: consolida una fama già costruita su romanzi tradotti e letti fuori dall’Italia. Per la Sardegna resta un punto di orgoglio culturale: Nuoro e la Barbagia entrano nella mappa letteraria internazionale attraverso una scrittrice dell’interno.",
        ],
      },
      {
        title: "La Sardegna nei suoi libri",
        paragraphs: [
          "Nei romanzi deleddiani tornano paesi di montagna, pastori, famiglie strette dal giudizio sociale, amore e colpa, religione e superstizione. Non è un inventario etnografico: è narrativa. Il paesaggio - vento, canne, colline, case di granito - fa da eco agli stati d’animo.",
          "Chi visita Nuoro oggi può avvicinare quel mondo al Museo Deledda, alle vie del centro storico e alle guide dei paesi della Barbagia. La lettura e il viaggio si intrecciano: stesso territorio, due modi di entrarci.",
        ],
      },
      {
        title: "Come continuare su EVERAS",
        paragraphs: [
          "Apri la guida di Nuoro in Scopri la Sardegna e scorri i comuni del Centro: Barbagia, Mandrolisai, Ogliastra. Poi guarda il calendario - sagre, rassegne, Autunno in Barbagia - per essere nei paesi quando le piazze si animano.",
          "In Cultura Sarda Deledda si affianca a zona blu, matriarcato e Ichnusa: letteratura, longevità, società e nomi antichi come chiavi diverse sulla stessa isola.",
        ],
      },
    ],
    faqs: [
      {
        question: "In che anno Grazia Deledda ha vinto il Nobel?",
        answer:
          "Nel 1926, per la Letteratura. È la prima italiana a ricevere il Nobel in quella categoria.",
      },
      {
        question: "Dove è nata?",
        answer:
          "A Nuoro, in Sardegna. La città e la Barbagia sono al centro di molti suoi romanzi; a Nuoro si visita anche il museo a lei dedicato.",
      },
      {
        question: "Quali libri leggere per iniziare?",
        answer:
          "Tra i più noti: Canne al vento, Elias Portolu, Cenere e Cosima. Da lì puoi collegare i luoghi alle guide paese su Scopri la Sardegna.",
      },
    ],
    relatedLinks: [
      { href: "/cultura-sarda/centro-sardegna/nuoro", label: "Guida Nuoro" },
      {
        href: "/cultura-sarda/centro-sardegna",
        label: "Guide Centro Sardegna",
      },
      {
        href: "/eventi-sardegna/autunno-in-barbagia",
        label: "Autunno in Barbagia",
      },
    ],
    publishedAt: "2026-09-16",
  },
];

export const CULTURA_ARTICLES: CulturaArticle[] = [
  ...CULTURA_THEME_ARTICLES,
  ...CULTURA_PEOPLE_ARTICLES,
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
