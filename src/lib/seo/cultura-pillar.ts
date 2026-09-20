import type { CulturaSource } from "@/src/lib/seo/cultura-articles";

export type CulturaGuideIndexItem = {
  href: string;
  label: string;
  blurb: string;
  phase: 1 | 2 | 3;
};

/** Indice delle 15 guide pillar. Phase 1 = pagina online. */
export const CULTURA_GUIDE_INDEX: CulturaGuideIndexItem[] = [
  {
    href: "/cultura/storia-sardegna",
    label: "Storia della Sardegna",
    blurb: "Dalla preistoria all’autonomia regionale, con rinvio a musei e siti.",
    phase: 1,
  },
  {
    href: "/cultura/tradizioni-sarde",
    label: "Feste e tradizioni",
    blurb: "Riti, carnevali, patronali e come cambiano nel tempo.",
    phase: 1,
  },
  {
    href: "/cultura/grandi-feste-sarde",
    label: "Grandi feste tradizionali",
    blurb: "Sant’Efisio, Candelieri, Sartiglia, Cavalcata e altre feste documentate.",
    phase: 1,
  },
  {
    href: "/cultura/artigianato-sardo",
    label: "Artigianato e mestieri",
    blurb: "Tessitura, coltelli, sughero, corallo, intreccio: territori e botteghe.",
    phase: 1,
  },
  {
    href: "/cultura/lingue-sardegna",
    label: "Lingue della Sardegna",
    blurb: "Sardo, catalano di Alghero, gallurese, sassarese, tabarchino.",
    phase: 1,
  },
  {
    href: "/cultura/musica-canto-poesia-sarda",
    label: "Musica, canto e poesia",
    blurb: "Canto a tenore, chitarra, cantadores e il rapporto con le feste.",
    phase: 1,
  },
  {
    href: "/cultura/costumi-sardi",
    label: "Costumi tradizionali",
    blurb: "Perché l’abito cambia da paese a paese, e quando si indossa.",
    phase: 1,
  },
  {
    href: "/cultura/cucina-sarda",
    label: "Cucina tradizionale",
    blurb: "Pane, pasta, carni, mare, formaggi e il cibo nelle sagre.",
    phase: 1,
  },
  {
    href: "/cultura/nuraghi-archeologia-sardegna",
    label: "Nuraghi e archeologia",
    blurb: "Cosa è documentato sulla civiltà nuragica, e dove vederla.",
    phase: 1,
  },
  {
    href: "/cultura/musei-sardegna",
    label: "Musei per territorio",
    blurb: "Una guida ragionata, non un elenco automatico.",
    phase: 1,
  },
  {
    href: "/cultura/territori-sardegna",
    label: "Territori dell’isola",
    blurb: "Gallura, Barbagia, Campidano, Sulcis: come il territorio forma le culture.",
    phase: 1,
  },
  {
    href: "/cultura/calendario-tradizioni-sarde",
    label: "Tradizioni durante l’anno",
    blurb: "Inverno, primavera, estate, autunno: il calendario culturale.",
    phase: 1,
  },
  {
    href: "/cultura/tradizioni-sarde-oggi",
    label: "Tradizioni che cambiano",
    blurb: "Trasmissione, turismo, Pro Loco, giovani: la cultura come fatto vivo.",
    phase: 1,
  },
  {
    href: "/cultura/scopri-sardegna-eventi",
    label: "Scoprire l’isola dagli eventi",
    blurb: "Il ponte tra le guide e il calendario EVERAS.",
    phase: 1,
  },
];

export const CULTURA_PILLAR_SECTIONS: Array<{
  title: string;
  paragraphs: string[];
  href?: string;
  hrefLabel?: string;
}> = [
  {
    title: "Una cultura diversa da paese a paese",
    paragraphs: [
      "Chi attraversa l’isola nota presto che i calendari non coincidono. Un rito di Settimana Santa a Castelsardo non è quello di un paese del Campidano; il carnevale di Mamoiada non è la giostra di Oristano. Non è «folklore sardo» al singolare: sono pratiche locali, spesso tenute da gremi, confraternite, Pro Loco e famiglie, con regole e abiti propri.",
      "Per questo EVERAS tiene insieme due livelli. Le guide di questa sezione spiegano i temi. Le schede dei comuni, in Scopri la Sardegna, restano il posto in cui un territorio ha nome, piazza e calendario. Un evento pubblicato da un organizzatore non sostituisce la storia del paese: la rende visibile in una data precisa.",
    ],
  },
  {
    title: "La storia della Sardegna in breve",
    paragraphs: [
      "L’isola entra nelle carte del Mediterraneo molto prima di Roma: villaggi neolitici, la cultura di Ozieri, poi i nuraghi dell’età del Bronzo. Fenici e Punici aprono scali; Roma organizza la provincia; nel Medioevo i giudicati tengono corti e lingue scritte. Aragona, Spagna e Savoia cambiano istituzioni e élite; nel 1948 la Sardegna diventa regione autonoma.",
      "Questa sequenza va letta con i documenti, non con le leggende da brochure. La guida alla storia distingue fatti databili (trattati, scavi, leggi) da interpretazioni. Per vedere reperti e siti si parte dai musei archeologici e dalle schede dei comuni, non da un elenco di «must see».",
    ],
    href: "/cultura/storia-sardegna",
    hrefLabel: "Storia della Sardegna",
  },
  {
    title: "Le lingue e le varietà linguistiche della Sardegna",
    paragraphs: [
      "Sull’isola si parlano, in misura diversa a seconda dei comuni, il sardo (con varietà logudoresi e campidanesi), il catalano di Alghero, il gallurese, il sassarese e il tabarchino nelle isole sulcitane. Lo Stato italiano riconosce minoranze linguistiche con la legge 482/1999; la Regione ha una normativa propria sulla politica linguistica.",
      "Lingua e territorio non coincidono con i confini amministrativi di oggi. Alghero non è «la Sardegna catalana» in blocco: è una città con una storia linguistica specifica. La guida alle lingue tiene questi distinguo, con rinvio alle schede di Alghero, Sassari, Gallura e Carloforte.",
    ],
    href: "/cultura/lingue-sardegna",
    hrefLabel: "Lingue della Sardegna",
  },
  {
    title: "Feste, riti e tradizioni",
    paragraphs: [
      "Le feste organizzano l’anno: carnevali dell’interno, Settimana Santa, patronali, processioni, sagre legate a raccolti e santi. Non tutte hanno lo stesso statuto: alcune sono iscritte in elenchi Unesco o in reti nazionali; altre restano calendari di paese, documentati da comuni e confraternite.",
      "Su EVERAS le date dell’edizione in corso stanno sulle schede evento, perché cambiano. Le guide culturali spiegano origine e significato quando le fonti lo consentono, senza inventare orari o «la festa più importante dell’isola».",
    ],
    href: "/cultura/tradizioni-sarde",
    hrefLabel: "Tradizioni sarde",
  },
  {
    title: "Artigianato e mestieri tradizionali",
    paragraphs: [
      "Tessitura, coltelleria, intreccio, sughero, corallo, ceramica, filigrana: sono filiere legate a territori precisi, non a un generico «handmade sardo». Pattada è associata alla resolza, Aggius ai tappeti, Castelsardo all’intreccio, Alghero al corallo, la Gallura al sughero, Assemini alla ceramica. Dove un mestiere è ancora praticato, lo dicono musei civici, cooperative e botteghe, non un catalogo turistico.",
      "Questa sezione non vende oggetti. Serve a capire perché un paese ha un museo del sughero o una mostra di coltelli, e a collegare fiere e sagre del calendario quando un organizzatore le pubblica.",
    ],
    href: "/cultura/artigianato-sardo",
    hrefLabel: "Artigianato sardo",
  },
  {
    title: "Musica, canto e poesia",
    paragraphs: [
      "Il canto a tenore è iscritto nella Lista rappresentativa del patrimonio culturale immateriale Unesco. Accanto stanno il canto a chitarra, i cori delle processioni, la poesia improvvisata, gli strumenti da piazza e da chiesa. Non è un unico «suono della Sardegna»: i repertori cambiano tra Barbagia, Logudoro e Campidano.",
      "Molte feste tengono musica e rito insieme. Per le date dei concerti e delle rassegne si usa il calendario; per il contesto, le guide a festa e paese.",
    ],
    href: "/cultura/musica-canto-poesia-sarda",
    hrefLabel: "Musica, canto e poesia",
  },
  {
    title: "Cucina e prodotti della tradizione",
    paragraphs: [
      "Pane, pasta, carni, pesce di costa, formaggi, dolci e vini non sono un menu unico. Le sagre raccontano spesso un prodotto e un comune, non «la cucina sarda» in astratto. Orari di sagre e prezzi dei piatti stanno sulle fonti dell’edizione (Comune, Pro Loco, scheda evento), non in questa guida.",
      "La guida alla cucina resta culturale: filiere e geografici, non ricette SEO. Date di sagre e prezzi dei piatti stanno sulle schede evento e sulle fonti dell’edizione.",
    ],
    href: "/cultura/cucina-sarda",
    hrefLabel: "Cucina tradizionale",
  },
  {
    title: "Paesi, musei e luoghi della cultura",
    paragraphs: [
      "Musei archeologici nazionali (Cagliari, Sassari), civici, etnografici, diocesani: ognuno racconta un pezzo, non l’isola intera. Un nuraghe visitabile non è un museo; un museo non è una festa. Le guide EVERAS tengono questi livelli distinti e rimandano ai siti ufficiali per orari e biglietti, che qui non si inventano.",
      "Scopri la Sardegna elenca i comuni per Nord, Centro e Sud. Da un paese si arriva agli eventi di quel comune. Da un tema (Candelieri, Sartiglia, zona blu) si arriva ai paesi in cui quel tema ha senso. La guida ai musei ragiona per territorio, senza un elenco automatico di tutte le sale.",
    ],
    href: "/cultura/musei-sardegna",
    hrefLabel: "Musei della Sardegna",
  },
  {
    title: "La cultura sarda oggi",
    paragraphs: [
      "Le tradizioni non sono un oggetto fermo. Cambiano i percorsi delle processioni, i pubblici, i finanziamenti, il modo in cui i giovani imparano un canto o un mestiere. Turismo, associazioni, scuole e digitalizzazione pesano, in modo diverso da un paese all’altro.",
      "EVERAS non è un archivio folklorico. È un calendario vivo collegato a testi che spiegano il contesto. La guida sulle tradizioni oggi approfondisce trasmissione, turismo e associazioni; ogni scheda evento resta il documento dell’edizione corrente, non di «come si è sempre fatto».",
    ],
    href: "/cultura/tradizioni-sarde-oggi",
    hrefLabel: "Tradizioni che cambiano",
  },
  {
    title: "Scopri la Sardegna attraverso gli eventi",
    paragraphs: [
      "Un evento può essere l’ingresso in un territorio: una Faradda, una tappa di Autunno in Barbagia, una sagra, una mostra in un museo civico. Si arriva per una data e si può restare sulla guida del comune o sul tema. Questo è il valore che cerchiamo: non solo «cosa fare», ma capire dove si è.",
      "Sotto, quando il database ha date pubblicate, trovi sagre e tradizioni in programma. Se la lista è vuota, il testo resta: puoi tornare più tardi o pubblicare un appuntamento se lo organizzi.",
    ],
    href: "/cultura/scopri-sardegna-eventi",
    hrefLabel: "Scoprire l’isola dagli eventi",
  },
];

export const CULTURA_PILLAR_SOURCES: CulturaSource[] = [
  {
    label: "UNESCO — Su Nuraxi di Barumini (World Heritage)",
    href: "https://whc.unesco.org/en/list/833/",
  },
  {
    label: "UNESCO — Canto a tenore (patrimonio immateriale)",
    href: "https://ich.unesco.org/en/RL/canto-a-tenore-sardinian-pastoral-songs-00165",
  },
  {
    label: "UNESCO — Feste delle grandi macchine a spalla (Candelieri)",
    href: "https://ich.unesco.org/en/RL/celebrations-of-big-shoulder-borne-processional-structures-00721",
  },
  {
    label: "Legge 15 dicembre 1999, n. 482 — minoranze linguistiche",
    href: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1999-12-15;482",
  },
  {
    label: "Regione Autonoma della Sardegna",
    href: "https://www.regione.sardegna.it/",
  },
];

export const CULTURA_PILLAR_HERO = {
  src: "/images/cultura/cultura-sarda-tradizioni-hero.webp",
  alt: "Nuraghe, abito tradizionale e maschere del carnevale sardo in un paesaggio mediterraneo",
} as const;

