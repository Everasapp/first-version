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
    "Approfondimenti sulla Sardegna: personaggi noti nel mondo, zona blu, matriarcato, Ichnusa, collezioni mineralogiche e legami con guide paese ed eventi EVERAS.",
  paragraphs: [
    "Qui non trovi le guide paese per paese: quelle stanno in Scopri la Sardegna. Cultura Sarda è lo spazio per leggere l’isola a tema - personaggi, longevità, società, nomi antichi, musei, feste, mestieri - e poi aprire le schede dei comuni collegati.",
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
    publishedAt: "2026-08-14",
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
    publishedAt: "2026-08-17",
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
    publishedAt: "2026-08-19",
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
    publishedAt: "2026-08-22",
  },
  {
    slug: "collezione-mineralogica-sassari",
    path: "/cultura/collezione-mineralogica-sassari",
    title:
      "Collezione Mineralogica Sassari: minerali Uniss e Geomuseo Monte Arci",
    h1: "La Collezione Mineralogica di Sassari",
    description:
      "Collezione Mineralogica dell’Università di Sassari: minerali, rocce e fossili sardi, visita su prenotazione, e il Geomuseo Monte Arci a Masullas.",
    intro:
      "All’Università di Sassari, nel Dipartimento di Agraria, è conservata una collezione di minerali, rocce, fossili e suoli che racconta la geologia dell’isola. Non è un museo da passaggio casuale: si visita su prenotazione. Questa guida spiega cosa contiene, da dove nasce e come collegarla al Geomuseo Monte Arci di Masullas, nell’Oristanese.",
    excerpt:
      "Minerali Uniss a Sassari e Geomuseo Monte Arci a Masullas: due chiavi sulla geologia sarda.",
    hero: {
      src: "/images/cultura/collezione-mineralogica-hero.webp",
      alt: "Vetrine di una collezione mineralogica con cristalli, ossidiana e una carta geologica della Sardegna",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl:
          "https://www.everas.it/cultura/collezione-mineralogica-sassari",
        sourceUrl: "https://www.everas.it/cultura",
        sourceLabel: "Cultura Sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Cos’è e dove si trova",
        paragraphs: [
          "La Collezione Mineralogica appartiene all’Università degli Studi di Sassari e ha sede nel Dipartimento di Agraria, in via Enrico De Nicola 1. È anche ricordata come museo geo-mineralogico dedicato ai professori Aurelio Serra e Antonio Pietracaprina, che ne hanno curato lo sviluppo nel Novecento.",
          "Raccoglie circa 1.000 pezzi mineralogici, 300 geologici e 200 paleontologici, più profili pedologici dei suoli sardi. Accanto ai campioni ci sono strumenti scientifici, una raccolta libraria e carte geologiche. La pagina ufficiale è sul sito Uniss, nella sezione Museo.",
        ],
      },
      {
        title: "Da Medicina ad Agraria",
        paragraphs: [
          "Il primo nucleo nasce negli anni Settanta dell’Ottocento, dentro l’antica Facoltà di Medicina, tra le discipline di Storia naturale. Tra il 1879 e il 1884 lavora a Sassari Domenico Lovisato, scienziato e garibaldino, fondatore della sezione sassarese del Club Alpino Italiano.",
          "Un contributo importante alla mineralogia sarda arriva da Federico Millosevic, professore dal 1905 al 1908 e poi senatore del Regno. Le collezioni si arricchiscono ancora con Aurelio Serra, direttore dal 1935 al 1950, e con Antonio Pietracaprina, dal 1963 al 1991. Oggi il patrimonio sta in Agraria, non in un padiglione turistico del centro.",
        ],
      },
      {
        title: "Cosa si vede",
        paragraphs: [
          "Il percorso è articolato in sezioni mineralogica, geologica, pedologica e paleontologica. Ci sono rocce effusive e intrusive, fossili, monoliti di suoli, marmi e campioni di spiagge sarde, oltre a materiali di siti esteri.",
          "Alcuni minerali contano perché rari, come la covellite; altri perché arrivano da miniere chiuse da tempo, come argenti e fluorite del Sulcis e del Sarrabus; altri ancora per la forma dei cristalli. È un archivio della Sardegna mineraria e della ricerca universitaria, non una vetrina di souvenir.",
        ],
      },
      {
        title: "Come visitarla",
        paragraphs: [
          "Non è un museo cittadino con biglietteria tutti i giorni. La visita si organizza con l’Università di Sassari: orari, accesso e eventuali chiusure sono quelli comunicati sulla pagina ufficiale della Collezione Mineralogica. Prima di partire conviene prenotare.",
          "Se sei già in città, abbina la collezione alla guida di Sassari e al calendario eventi: Cavalcata, Candelieri, rassegne in centro. L’università e le piazze stanno nello stesso tessuto urbano, ma i due ritmi - studio e festa - sono diversi.",
        ],
      },
      {
        title: "Il Geomuseo Monte Arci a Masullas",
        paragraphs: [
          "A Masullas, in Marmilla (provincia di Oristano), il Geomuseo Monte Arci “Stefano Incani” racconta il massiccio vulcanico del Monte Arci: minerali, rocce, fossili, diaspri e ricostruzioni paleoambientali. È allestito nell’ex convento dei Cappuccini, in via Cappuccini / piazza Convento.",
          "Il Monte Arci è uno dei grandi giacimenti di ossidiana del Mediterraneo occidentale: la pietra vetrosa nera ha viaggiato in preistoria ben oltre l’isola. In museo si segue la storia geologica del vulcano, con sale su minerali fluorescenti e diorami dell’attività magmatica.",
          "A differenza della collezione Uniss, il Geomuseo è pensato per il pubblico: di solito apre dal mercoledì alla domenica, con biglietto. Orari e tariffe cambiano, quindi verifica sul Comune di Masullas o sulla Fondazione Parte Montis prima di metterti in viaggio. Da lì puoi scendere verso Oristano e il Centro Sardegna.",
        ],
      },
      {
        title: "Come continuare su EVERAS",
        paragraphs: [
          "Apri la guida di Sassari per il Nord, quella di Oristano per l’Oristanese, e il calendario per sagre e rassegne. Due musei geologici, due province, la stessa isola: Sassari per l’archivio universitario, Masullas per il racconto del Monte Arci.",
          "In Cultura Sarda questo approfondimento sta accanto a Ichnusa, zona blu e personaggi: un’altra chiave sul territorio, fatta di rocce e miniere invece che di nomi e letteratura.",
        ],
      },
    ],
    faqs: [
      {
        question: "Dove si trova la Collezione Mineralogica?",
        answer:
          "A Sassari, nel Dipartimento di Agraria dell’Università, in via Enrico De Nicola 1. Dettagli e aggiornamenti sono sulla pagina Uniss della collezione.",
      },
      {
        question: "Si visita senza prenotazione?",
        answer:
          "In genere no: non è un museo a ingresso libero quotidiano. La visita si concorda con l’ateneo; controlla il sito ufficiale prima di andare.",
      },
      {
        question: "Cos’è il Geomuseo Monte Arci?",
        answer:
          "È il museo mineralogico e paleontologico di Masullas, dedicato al Monte Arci e intitolato a Stefano Incani. Ha sede nell’ex convento dei Cappuccini.",
      },
      {
        question: "Che differenza c’è tra i due musei?",
        answer:
          "La collezione Uniss è un patrimonio universitario a Sassari, visitabile su prenotazione. Il Geomuseo è un museo territoriale a Masullas, pensato per il pubblico, sul vulcano e sull’ossidiana del Monte Arci.",
      },
    ],
    relatedLinks: [
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/eventi/sassari", label: "Eventi a Sassari" },
      {
        href: "/cultura-sarda/centro-sardegna/oristano",
        label: "Guida Oristano",
      },
      {
        href: "/cultura-sarda/centro-sardegna",
        label: "Guide Centro Sardegna",
      },
    ],
    publishedAt: "2026-09-17",
  },
  {
    slug: "cavalcata-sarda-sassari",
    path: "/cultura/cavalcata-sarda-sassari",
    title: "Cavalcata Sarda a Sassari: storia, costumi e pariglie",
    h1: "La Cavalcata Sarda a Sassari",
    description:
      "Cavalcata Sarda a Sassari: origini, festa della bellezza, sfilata dei costumi, pariglie all’ippodromo Pinna e differenza con i Candelieri.",
    intro:
      "Ogni primavera Sassari diventa il palcoscenico laico dei costumi sardi: gruppi da tutta l’isola sfilano a piedi e a cavallo, poi i cavalieri si esibiscono nelle pariglie. Non è un voto né una processione: è la “festa della bellezza”. Questa guida racconta da dove nasce, cosa si vede e come collegarla al calendario EVERAS.",
    excerpt:
      "Storia, abiti e pariglie della grande sfilata laica di Sassari.",
    hero: {
      src: "/images/cultura/cavalcata-sarda-hero.webp",
      alt: "Sfilata della Cavalcata Sarda a Sassari: costumi tradizionali, cavalli e piazza d’Italia",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl: "https://www.everas.it/cultura/cavalcata-sarda-sassari",
        sourceUrl: "https://www.everas.it/cultura",
        sourceLabel: "Cultura Sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Cos’è la Cavalcata Sarda",
        paragraphs: [
          "La Cavalcata Sarda è la grande rassegna identitaria di Sassari: abiti, gioielli, musiche e danze dei paesi dell’isola in un corteo cittadino. Si distingue da Sant’Efisio a Cagliari e dal Redentore a Nuoro perché non ha carattere religioso o votivo. È una festa civile, spesso chiamata festa della bellezza.",
          "Il cuore è una domenica di maggio, di solito la penultima. Intorno ci sono mostre, concerti e rassegne di canti e balli, ma il momento che cerca chi arriva da fuori resta la sfilata del mattino e, nel pomeriggio, le pariglie all’ippodromo Pinna.",
        ],
      },
      {
        title: "Da dove nasce",
        paragraphs: [
          "Le cronache cittadine, e lo scrittore Enrico Costa, ricordano cavalcate del Settecento in onore dei regnanti, tra cui un corteo del 1711. Non è ancora la festa annuale di oggi: è un antecedente, la nobiltà sassarese che mostra abiti e ranghi per le vie.",
          "La forma moderna nasce il 20 aprile 1899, per l’inaugurazione del monumento a Vittorio Emanuele II in piazza d’Italia, alla presenza di Umberto I e della regina Margherita. Si ripete in altre visite reali, tra cui il 1929 e il 1939. Dopo la guerra, nei primi anni Cinquanta, il sindaco Oreste Pieroni la riporta come appuntamento fisso: da allora è il grande maggio di Sassari.",
          "Nel 2026 si è tenuta la 75ª edizione, domenica 17 maggio. La data dell’anno successivo la pubblica il Comune: non è scolpita nel calendario liturgico, va controllata ogni primavera.",
        ],
      },
      {
        title: "La sfilata: costumi, gruppi, cavalli",
        paragraphs: [
          "La domenica mattina il corteo attraversa il centro per un paio di chilometri. Sfilano migliaia di figuranti in abito del proprio paese, a piedi, a cavallo e sulle traccas, i carri addobbati. I numeri cambiano di edizione in edizione: restano i gruppi da ogni provincia, i ricami, la filigrana, i veli.",
          "L’abito di Sassari, documentato già nell’Ottocento, è urbano e rosso: gonne ampie, corsetti, tulle, oro, corallo e argento. L’abito maschile unisce velluto, orbace, il ceccio rosso e il cugliettu, la sopravveste di pelle che si vede anche tra alcuni gremi dei Candelieri. Non è un costume da noleggio: famiglie e sarte lo custodiscono.",
          "Il percorso preciso lo decide il Comune ogni anno. Nel 2026 la partenza era da San Giuseppe verso via Roma e piazza d’Italia, con arrivo in via Manno. Per l’edizione in corso guarda la scheda eventi: viabilità e orari si aggiornano.",
        ],
      },
      {
        title: "Le pariglie all’ippodromo Pinna",
        paragraphs: [
          "Nel pomeriggio la festa si sposta all’ippodromo Pinna. Le pariglie sono prove di equilibrio su cavalli in corsa: coppie o terne di cavalieri, acrobazie, la tradizione equestre dell’interno portata in città. Non è un palio votivo come l’Ardia di Sedilo: è spettacolo di abilità, con biglietto o tribune quando il Comune le prevede.",
          "I gruppi cambiano di anno in anno. Restano un pezzo della giornata, non un optional: chi vede solo il corteo del mattino perde metà della Cavalcata.",
        ],
      },
      {
        title: "Cavalcata e Candelieri",
        paragraphs: [
          "Sassari ha due volti pubblici. A maggio la Cavalcata è laica, colorata, fatta di paesi ospiti. Il 14 agosto i Candelieri sono il rito dei gremi, voto all’Assunta, Unesco. Stessa città, due calendari, due modi di occupare il corso.",
          "Se arrivi per i vestiti, è maggio. Se arrivi per i ceri e i tamburi, è agosto. La guida di Sassari e le pagine eventi tengono entrambi.",
        ],
      },
      {
        title: "Come continuare su EVERAS",
        paragraphs: [
          "Apri la pagina Cavalcata Sarda nel calendario per data, sfilata e schede dell’anno in corso. Poi la guida di Sassari e gli eventi in città. I Candelieri hanno una pagina dedicata a parte.",
          "In Cultura Sarda la Cavalcata sta accanto ai Candelieri della guida paese, alla Collezione Mineralogica e ai personaggi sassaresi: stessa piazza, chiavi diverse.",
        ],
      },
    ],
    faqs: [
      {
        question: "Quando si svolge la Cavalcata Sarda?",
        answer:
          "Di solito la penultima domenica di maggio, a Sassari. Nel 2026 è stata il 17 maggio. La data esatta la pubblica il Comune ogni anno: controlla la scheda su EVERAS.",
      },
      {
        question: "È una festa religiosa?",
        answer:
          "No. È la grande festa laica dei costumi sardi. Non ha voto né santo titolare, a differenza di Sant’Efisio, del Redentore e dei Candelieri.",
      },
      {
        question: "Dove si vedono le pariglie?",
        answer:
          "All’ippodromo Pinna, nel pomeriggio della stessa domenica della sfilata. Orari e accesso sono sul programma comunale e sulla scheda eventi.",
      },
      {
        question: "Che differenza c’è con i Candelieri?",
        answer:
          "La Cavalcata è a maggio, laica, con gruppi da tutta l’isola. I Candelieri sono il 14 agosto, rito dei gremi sassaresi. Due feste, due calendari.",
      },
    ],
    relatedLinks: [
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/eventi/sassari", label: "Eventi a Sassari" },
      {
        href: "/eventi-sardegna/cavalcata-sarda",
        label: "Cavalcata Sarda, calendario",
      },
      {
        href: "/eventi-sardegna/candelieri-sassari",
        label: "Candelieri di Sassari",
      },
      {
        href: "/cultura/candelieri-sassari",
        label: "I Candelieri, approfondimento",
      },
    ],
    publishedAt: "2026-09-17",
  },
  {
    slug: "candelieri-sassari",
    path: "/cultura/candelieri-sassari",
    title: "Candelieri di Sassari: Faradda, gremi e Unesco",
    h1: "I Candelieri di Sassari",
    description:
      "Faradda di li Candareri a Sassari: 14 agosto, voto all’Assunta, gremi, discesa dei candelieri lignei e patrimonio Unesco 2013.",
    intro:
      "Ogni 14 agosto Sassari scende i candelieri: colonne di legno a spalla, tamburi, gremi. In sassarese è la Faradda di li Candareri, voto all’Assunta, non una sfilata da tribuna. Questa guida racconta origini, corporazioni, percorso e il riconoscimento Unesco, e dove continuare su EVERAS.",
    excerpt:
      "La Faradda del 14 agosto: gremi, ceri lignei e patrimonio Unesco.",
    hero: {
      src: "/images/cultura/candelieri-sassari-hero.webp",
      alt: "Discesa dei Candelieri a Sassari: un cero ligneo portato a spalla dai gremianti lungo il corso",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl: "https://www.everas.it/cultura/candelieri-sassari",
        sourceUrl: "https://www.everas.it/cultura",
        sourceLabel: "Cultura Sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Cos’è la Faradda",
        paragraphs: [
          "La Discesa dei Candelieri è la festa più identitaria di Sassari. Si tiene il 14 agosto, vigilia dell’Assunta. I gremi - le antiche corporazioni di mestiere - portano a spalla grandi ceri di legno da piazza Castello fino a Santa Maria di Betlem, dove si scioglie il voto.",
          "Non è la Cavalcata: quella è laica, a maggio, con gruppi da tutta l’isola. I Candelieri sono rito cittadino, religioso e civico insieme. Dal 2013 la Faradda è patrimonio culturale immateriale Unesco, nella rete delle grandi macchine a spalla italiane, con i Gigli di Nola, la Varia di Palmi e la Macchina di Santa Rosa a Viterbo.",
        ],
      },
      {
        title: "Da dove nasce",
        paragraphs: [
          "Le fonti collegano l’offerta dei “candeli” alla Vergine di mezz’agosto già al Duecento, quando Sassari era alleata di Pisa. Un documento del 1531 attesta l’ordine di ingresso in chiesa con i candelieri, portati da otto maestranze. Gli archivi cittadini sono lacunosi: il saccheggio francese del 1527 e i moti del 1780 hanno bruciato molta carta.",
          "In età moderna il rito si lega al voto per la peste. Lo storico Enrico Costa data l’istituzione in quel senso al 1528; altre memorie cittadine insistono sull’epidemia del 1652. Resta il punto: la Faradda non è folklore da agosto, è un patto con l’Assunta che la città rinnova ogni anno.",
          "Dalle macchine che portavano cera votiva si è passati alle colonne lignee di oggi: capitello con nastri (li betti), fusto col santo del gremio, base a quattro stanghe per otto portatori. Pesano fino a quattro quintali, alte circa tre metri. Il candeliere dei Sarti è l’unico sormontato da un braciere.",
        ],
      },
      {
        title: "I gremi e la discesa",
        paragraphs: [
          "Oggi scendono tredici gremi. Aprono i più recenti, chiudono i più antichi; in chiesa l’ordine si inverte. Nell’elenco: Braccianti, Autoferrotranvieri, Macellai, Fabbri, Piccapietre, Viandanti, Contadini, Falegnami, Ortolani, Calzolai, Sarti, Muratori, Massai. Sarti e Muratori si alternano: negli anni dispari precedono i Sarti, in quelli pari i Muratori.",
          "La mattina del 14 si vestono i ceri nelle sedi e in casa dell’obriere. Nel pomeriggio il raduno è in piazza Castello; dopo la messa al Rosario la discesa prende Corso Vittorio Emanuele, piazza Sant’Antonio, corso Vico, fino a Santa Maria di Betlem. La banda apre, i tamburi e i pifferi tengono il passo. Il candeliere “baddarinu” - che balla - è di buon auspicio.",
          "A metà percorso, a Palazzo di Città, i Massai fanno l’Intregu: scambio di bandiera e gonfalone col sindaco. Rappresentano gli altri gremi e la città agraria. Poi, a voto sciolto, di notte, si risale verso Palazzo Ducale per l’investitura del nuovo obriere. Dal 1979 coordina tutto l’Intergremio Città di Sassari, che ha anche seguito la pratica Unesco.",
        ],
      },
      {
        title: "Prima del 14 e dopo",
        paragraphs: [
          "La festa non sta in una sola sera. Il 5 agosto scendono i Piccoli Candelieri, i ragazzi sotto i tredici anni. Nei giorni intorno ci sono prove, concerti, il Candeliere d’oro e d’argento. Dal 14 al 22 i ceri restano in Santa Maria di Betlem: è l’Ottava. Poi ogni gremio li riporta in cappella.",
          "Ogni corporazione ha anche la festa del proprio santo, sparsa nell’anno. Se non sei in città il 14, il Museo dei Candelieri accanto a Santa Maria tiene ceri e storia dei gremi. La guida di Sassari ti porta lì a piedi dal corso.",
        ],
      },
      {
        title: "Come continuare su EVERAS",
        paragraphs: [
          "Apri la pagina Candelieri di Sassari nel calendario per la Faradda e gli eventi intorno. Poi la guida della città e, a maggio, l’articolo sulla Cavalcata: due volti della stessa piazza.",
          "In Cultura Sarda i Candelieri stanno accanto alla Cavalcata, alla Collezione Mineralogica e ai personaggi sassaresi. Stessa città, chiavi diverse.",
        ],
      },
    ],
    faqs: [
      {
        question: "Quando sono i Candelieri a Sassari?",
        answer:
          "La Faradda è il 14 agosto, ogni anno. Concerti, piccoli candelieri e feste dei gremi occupano i giorni e i mesi intorno: guarda il calendario EVERAS.",
      },
      {
        question: "Perché si fa la Faradda?",
        answer:
          "È il voto all’Assunta, legato alla liberazione dalla peste e a un’offerta di ceri che le fonti fanno risalire almeno al Cinquecento, con radici più antiche pisane.",
      },
      {
        question: "I Candelieri sono Unesco?",
        answer:
          "Sì, dal 2013, nella rete delle feste delle grandi macchine a spalla, insieme a Nola, Palmi e Viterbo.",
      },
      {
        question: "Che differenza c’è con la Cavalcata Sarda?",
        answer:
          "La Cavalcata è a maggio, laica, con gruppi da tutta l’isola. I Candelieri sono il 14 agosto, rito dei gremi sassaresi. Due calendari, due significati.",
      },
    ],
    relatedLinks: [
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/eventi/sassari", label: "Eventi a Sassari" },
      {
        href: "/eventi-sardegna/candelieri-sassari",
        label: "Candelieri, calendario",
      },
      {
        href: "/cultura/cavalcata-sarda-sassari",
        label: "La Cavalcata Sarda",
      },
    ],
    publishedAt: "2026-09-17",
  },
  {
    slug: "cultura-sarda-feste-e-tradizioni",
    path: "/cultura/cultura-sarda-feste-e-tradizioni",
    title: "Cultura sarda: nuraghi, carnevale, costumi e mestieri",
    h1: "Cultura sarda: feste, mestieri e identità",
    description:
      "Cultura sarda in sintesi: civiltà nuragica, carnevale di Mamoiada e Ottana, Sartiglia, costumi, sughero e filigrana, con guide ed eventi EVERAS.",
    intro:
      "La Sardegna non è solo costa. È un’isola che ha tenuto lingua, mestieri e riti mentre il Mediterraneo le passava sopra. Questa guida tiene insieme quattro chiavi - nuraghi, feste, abiti, botteghe - e ti manda alle schede EVERAS dei paesi e del calendario, senza brochure da tour operator.",
    excerpt:
      "Nuraghi, maschere, costumi e artigianato: una mappa della cultura sarda su EVERAS.",
    hero: {
      src: "/images/cultura/cultura-sarda-tradizioni-hero.webp",
      alt: "Nuraghe, abito tradizionale e maschere del carnevale sardo in un paesaggio mediterraneo",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl:
          "https://www.everas.it/cultura/cultura-sarda-feste-e-tradizioni",
        sourceUrl: "https://www.everas.it/cultura",
        sourceLabel: "Cultura Sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Un’isola antica, non un set",
        paragraphs: [
          "I primi villaggi risalgono al Neolitico. Poi arrivano rotte commerciali, conquistatori, lingue. I sardi restano riconoscibili: non perché l’isola sia rimasta chiusa, ma perché ha metabolizzato i passaggi senza cancellare il resto. Nei paesi trovi reperti, dialetti, toponimi che tengono memoria di chi è sbarcato - e di chi c’era già.",
          "Il pezzo più visibile di quella antichità sono i nuraghi: torri e complessi della civiltà nuragica, sparsi dall’interno alla piana. Non sono “fortezze da cartolina”: sono il segno di una società isolana che costruiva in pietra secoli prima di Roma. Per vederne uno intero, non un dettaglio da parcheggio, parti da Barumini e dalle guide del Centro e del Sud.",
        ],
      },
      {
        title: "Feste, maschere, calendario",
        paragraphs: [
          "Tutto l’anno i paesi tengono sagre e riti. Non è un folklore unico: ogni comune ha il proprio santo, la propria maschera, il proprio modo di occupare la piazza. Quello che attira di più da fuori, d’inverno, è il Carnevale dell’interno.",
          "A Mamoiada escono i Mamuthones e gli Issohadores; a Ottana i Boes e i Merdules. Sono maschere di legno, pelle, campanacci: vita, morte, gregge, giudizio. Non sono un carnevale da carro allegorico. A Oristano, a Carnevale, Sa Sartiglia è un’altra cosa ancora: giostra equestre, gremi, stella da infilzare. Tre territori, tre grammatiche. Il calendario Carnevale su EVERAS le tiene insieme; le guide paese spiegano il rito senza ridurlo a foto.",
          "In altri mesi arrivano Cavalcata e Candelieri a Sassari, Autunno in Barbagia, patronali. La cultura sarda non sta in un weekend: sta in un anno. Apri il calendario e scegli un paese, non un “tour delle tradizioni”.",
        ],
      },
      {
        title: "Abiti, botteghe, filigrana",
        paragraphs: [
          "L’abito tradizionale non è un costume da noleggio. Racconta il paese: taglio, colore, gioiello. Lo vedi in Cavalcata, alle feste patronali, in famiglia. La filigrana sarda - oro, argento, corallo - è mestiere, non souvenir da vetrina. Sughero, ceramica, telaio: restano filiere vive in Gallura, Marmilla, Barbagia, a seconda del materiale.",
          "A Calangianus il Museo del Sughero e le fabbriche tengono una filiera intera. Altri paesi tengono sarte, coltellinai, tessitrici. Non inventiamo corsi e orari: se vuoi entrare in bottega, parti dalla scheda del comune e chiama. Ogni zona ha regole e feste sue: è questo che rende il calendario sempre diverso, non un format replicato.",
        ],
      },
      {
        title: "Come continuare su EVERAS",
        paragraphs: [
          "Da qui apri Mamoiada, Ottana, Oristano, Barumini. Poi Carnevale, Sartiglia, Cavalcata e Candelieri. Scopri la Sardegna è la directory dei paesi; Cultura Sarda è dove stai ora, per i temi.",
          "Se cerchi la costa, le guide di Stintino, Palau, Santa Teresa e Villasimius tengono mare e paese insieme. Qui il punto è l’altro lato dell’isola: pietra, maschera, telaio.",
        ],
      },
    ],
    faqs: [
      {
        question: "Cos’è la cultura sarda, in due parole?",
        answer:
          "Una identità di paese: nuraghi, lingue, mestieri e feste locali che restano diverse da un comune all’altro, non un unico folklore da brochure.",
      },
      {
        question: "Quali feste vedere per prima?",
        answer:
          "Dipende dal mese. D’inverno Carnevale a Mamoiada e Ottana, Sartiglia a Oristano. A maggio la Cavalcata a Sassari, il 14 agosto i Candelieri. Il calendario EVERAS dà le date dell’anno in corso.",
      },
      {
        question: "Dove vedere un nuraghe?",
        answer:
          "Il complesso più noto è Barumini, nel Sud. Molti paesi del Centro e del Nord hanno nuraghi visitabili: apri la guida del comune.",
      },
      {
        question: "L’artigianato si visita ancora?",
        answer:
          "Sì, in musei e botteghe di paese - sughero, tessuti, coltelli, filigrana. Orari e accessi cambiano: controlla la scheda del comune prima di partire.",
      },
    ],
    relatedLinks: [
      {
        href: "/cultura-sarda/centro-sardegna/mamoiada",
        label: "Guida Mamoiada",
      },
      { href: "/cultura-sarda/centro-sardegna/ottana", label: "Guida Ottana" },
      {
        href: "/eventi-sardegna/carnevale-sardegna",
        label: "Carnevale in Sardegna",
      },
      {
        href: "/cultura-sarda/sud-sardegna/barumini",
        label: "Guida Barumini",
      },
    ],
    publishedAt: "2026-09-17",
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
