export type FestivalHub = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  titleIncludes: string[];
  paragraphs: string[];
  faqs: Array<{ question: string; answer: string }>;
};

export const FESTIVAL_HUBS: FestivalHub[] = [
  {
    slug: "autunno-in-barbagia",
    path: "/eventi-sardegna/autunno-in-barbagia",
    title: "Autunno in Barbagia 2026: tappe, date e cosa vedere",
    h1: "Autunno in Barbagia 2026",
    description:
      "Guida alle Cortes Apertas: calendario delle tappe, borghi della Barbagia e cosa fare nei weekend di Autunno in Barbagia.",
    titleIncludes: ["autunno in barbagia", "cortes apertas"],
    paragraphs: [
      "Autunno in Barbagia è il grande itinerario d’ospitalità dei paesi interni: ogni weekend un borgo apre corti, cantine e laboratori artigiani. Non è un singolo evento, ma una stagione. Per questo su EVERAS raccogliamo le tappe una per una, con data e paese, così puoi scegliere dove andare senza perderti il calendario ufficiale.",
      "Le Cortes Apertas nascono per far entrare i visitatori nelle case e nei mestieri. Trovi pane, dolci, tessuti, coltelli, vino e musica nelle strade. È un formato che premia chi si muove in giornata: parti al mattino, cammini il centro storico, mangi in corte e torni la sera. Le tappe più attese toccano Oliena, Gavoi, Orgosolo, Mamoiada, Tonara e altri comuni della Barbagia e del Mandrolisai.",
      "Se cerchi “Autunno in Barbagia 2026” su Google, di solito vuoi tre cose: quale paese apre questo weekend, a che ora, e se c’è un programma serale. Qui trovi le schede collegate al calendario Everas. Quando una tappa è pubblicata, la vedi in elenco con locandina e dettagli; se manca ancora, torna tra qualche giorno: aggiorniamo le date appena arrivano da Comuni e Pro Loco.",
    ],
    faqs: [
      {
        question: "Quando si svolge Autunno in Barbagia?",
        answer:
          "Di solito da settembre a dicembre, un borgo ogni weekend. Le date cambiano ogni anno: controlla la tappa sul calendario Everas.",
      },
      {
        question: "Serve il biglietto?",
        answer:
          "L’ingresso ai paesi è in genere libero. Alcune degustazioni o visite guidate possono essere a pagamento: è indicato sulla scheda dell’evento.",
      },
    ],
  },
  {
    slug: "candelieri-sassari",
    path: "/eventi-sardegna/candelieri-sassari",
    title: "Festa dei Candelieri a Sassari: data, corteo e programma",
    h1: "Festa dei Candelieri a Sassari",
    description:
      "La Discesa dei Candelieri a Sassari: quando si fa, cosa vedere in centro e come arrivare alla Faradda.",
    titleIncludes: ["candelieri"],
    paragraphs: [
      "I Candelieri di Sassari sono la festa identitaria della città: grandi “candeleri” di legno portati a spalla dai gremi lungo un percorso che attraversa il centro, fino in piazza Duomo. Chi cerca “Candelieri Sassari” vuole in pratica il giorno della Faradda, gli orari del corteo e dove mettersi per vedere i gremi senza perdere i saluti.",
      "La tradizione è legata al voto per la peste e al 14 agosto, vigilia dell’Assunta. Intorno alla discesa ci sono prove, musiche, la vestizione dei candelieri e una folla che occupa Corso Vittorio Emanuele. Non è uno spettacolo da tribuna: è una processione civica. Meglio arrivare presto, lasciare l’auto fuori dal centro e seguire il corteo a piedi.",
      "Su EVERAS trovi l’appuntamento principale e gli eventi collaterali (concerti, mostre, aperitivi in centro) quando sono pubblicati. La scheda ti dice data, luogo e se l’ingresso è libero. Per il programma minuto per minuto dei gremi, resta utile anche l’ufficio turistico comunale: noi teniamo il calendario pulito, con le date confermate.",
    ],
    faqs: [
      {
        question: "In che giorno sono i Candelieri a Sassari?",
        answer:
          "La Faradda è tradizionalmente il 14 agosto. Concerti e iniziative collaterali possono occupare i giorni intorno: guarda le schede dell’anno in corso.",
      },
      {
        question: "Dove si vede meglio il corteo?",
        answer:
          "Lungo Corso Vittorio Emanuele e in piazza Duomo, dove arrivano i candelieri. Il centro è pedonale e molto affollato: raggiungi la zona a piedi.",
      },
    ],
  },
  {
    slug: "sa-sartiglia",
    path: "/eventi-sardegna/sa-sartiglia",
    title: "Sa Sartiglia a Oristano: date, maschere e come vederla",
    h1: "Sa Sartiglia di Oristano",
    description:
      "Guida alla Sartiglia: i giorni di carnevale a Oristano, la corsa alla stella e dove sistemarsi per vedere la giostra.",
    titleIncludes: ["sartiglia"],
    paragraphs: [
      "Sa Sartiglia è la giostra equestre di Oristano, tra le feste di carnevale più antiche della Sardegna. I cavalieri, mascherati, corrono al galoppo per infilzare una stella sospesa. Non è un palio turistico inventato ieri: è un rito della città, con Componidori, gremi e un cerimoniale che si ripete ogni anno in piazza e lungo le vie del centro.",
      "Chi cerca “Sartiglia 2026” di solito vuole le due giornate (domenica e martedì grasso, in base al calendario liturgico), l’ora della vestizione e se c’è la Sartiglia notturna o la pariglia. Gli orari si spostano di poco di anno in anno, ma il cuore resta lo stesso: mattina in centro, corsa, poi serata in città.",
      "Su EVERAS la scheda serve a non perdere la data esatta e gli eventi intorno (concerti, mostre, sagre di Carnevale). Per i posti migliori in piazza arriva all’alba o segui le indicazioni del Comune: le transenne cambiano e il centro si chiude al traffico. Se vieni da Sassari o Cagliari, calcola il parcheggio fuori dalle mura e la camminata.",
    ],
    faqs: [
      {
        question: "Quando si corre la Sartiglia?",
        answer:
          "Nelle giornate di Carnevale a Oristano, in genere domenica e martedì grasso. La data precisa cambia ogni anno col calendario.",
      },
      {
        question: "È gratis?",
        answer:
          "Vedere la corsa dalle strade è gratuito. Tribune o postazioni riservate, se previste, sono indicate sulla scheda o dal Comune.",
      },
    ],
  },
  {
    slug: "carnevale-sardegna",
    path: "/eventi-sardegna/carnevale-sardegna",
    title: "Carnevale in Sardegna: Mamoiada, Ottana, Tempio e Oristano",
    h1: "Carnevale in Sardegna",
    description:
      "Maschere, sfilate e Sartiglia: il Carnevale sardo da Mamoiada a Tempio Pausania, con date e programmi su EVERAS.",
    titleIncludes: ["carnevale", "mamuthones", "boes", "merdules", "carrasecare"],
    paragraphs: [
      "Il Carnevale in Sardegna non è una copia di Viareggio. È un insieme di riti diversi: i Mamuthones di Mamoiada, i Boes e Merdules di Ottana, le sfilate di Tempio Pausania e Bosa, la Sartiglia a Oristano. Chi cerca “carnevale Sardegna” vuole un quadro: dove andare questo weekend, quale maschera vedere, se c’è una sfilata serale.",
      "Le maschere tradizionali escono nei giorni grassi, ma i paesi organizzano anche cortei nei weekend precedenti. Mamoiada e Ottana attraggono chi vuole il rito antropologico; Tempio e Oristano chi vuole piazza, carri e spettacolo. Conviene scegliere un territorio e restarci: gli spostamenti interni in febbraio possono essere lenti e freddi.",
      "Il calendario Everas mette insieme sfilate, concerti e sagre di Carnevale quando sono pubblicati. Non sostituisce i programmi comunali minuto per minuto, ma ti dice cosa c’è in isola in quei giorni, con città e orario. Se stai pianificando un viaggio, parti dalle schede di Mamoiada, Ottana, Oristano e Tempio e poi allarga al resto.",
    ],
    faqs: [
      {
        question: "Qual è il Carnevale più famoso in Sardegna?",
        answer:
          "Dipende da cosa cerchi. Per le maschere tradizionali: Mamoiada e Ottana. Per la giostra: Oristano. Per le sfilate di carri: Tempio Pausania.",
      },
      {
        question: "Quando inizia il Carnevale sardo?",
        answer:
          "Le date seguono il calendario liturgico, di solito tra gennaio e febbraio-marzo. Controlla l’anno in corso sul calendario Everas.",
      },
    ],
  },
  {
    slug: "monumenti-aperti",
    path: "/eventi-sardegna/monumenti-aperti",
    title: "Monumenti Aperti in Sardegna: città, date e visite guidate",
    h1: "Monumenti Aperti in Sardegna",
    description:
      "Il calendario di Monumenti Aperti: quali città aprono chiese, musei e siti archeologici e come prenotare le visite.",
    titleIncludes: ["monumenti aperti"],
    paragraphs: [
      "Monumenti Aperti è il circuito che, in primavera e in autunno, apre palazzi, chiese, musei e siti di solito chiusi o poco visitati. Volontari e scuole fanno da guida. Per chi cerca “Monumenti Aperti Sardegna” la domanda è concreta: quali Comuni aderiscono questo weekend e a che ora partono i giri.",
      "Non è una sagra: è un programma di visite. Serve a vedere un territorio in profondità, spesso gratis o con offerta libera. Le tappe toccano città grandi e paesi piccoli, dal Nord al Sud. Ogni Comune pubblica un proprio pieghevole: su EVERAS teniamo l’evento con date e città, così non perdi l’appuntamento mentre confronti più località.",
      "Se vuoi fare due tappe nello stesso weekend, guarda prima le schede vicine (stessa provincia) e calcola i tempi di spostamento. Molti itinerari si fanno a piedi nel centro storico. Prenotazioni e limiti di capienza, quando ci sono, sono scritti sulla scheda o sul sito del Comune organizzatore.",
    ],
    faqs: [
      {
        question: "Monumenti Aperti è gratis?",
        answer:
          "Nella maggior parte dei casi le visite sono libere o su offerta. Alcuni siti particolari possono richiedere un biglietto: è indicato sulla scheda.",
      },
      {
        question: "Quante città partecipano?",
        answer:
          "Il numero cambia ogni edizione. Su EVERAS trovi le tappe pubblicate, città per città, con giorno e orario.",
      },
    ],
  },
  {
    slug: "sant-efisio",
    path: "/eventi-sardegna/sant-efisio",
    title: "Festa di Sant’Efisio a Cagliari: processione, date e percorso",
    h1: "Festa di Sant’Efisio a Cagliari",
    description:
      "La processione di Sant’Efisio: 1 maggio a Cagliari, il cammino verso Nora e come seguire il corteo senza perderti.",
    titleIncludes: ["sant'efisio", "sant efisio", "sant’efisio"],
    paragraphs: [
      "Sant’Efisio è la festa più grande di Cagliari e una delle processioni più lunghe del Mediterraneo. Il 1° maggio la statua esce da Stampace e il corteo di traccas, gruppi in costume e cavalieri attraversa la città verso Nora, a Pula. Chi cerca “Sant’Efisio 2026” vuole l’ora di partenza, il percorso e se il rientro è il 4 maggio.",
      "Non è solo folklore da cartolina: è un voto della città, con migliaia di persone in abito tradizionale. Il centro si ferma, i palchi si riempiono, e conviene arrivare all’alba se vuoi vedere l’uscita dalla chiesa. Lungo la strada statale il corteo è più disteso: molte famiglie lo aspettano nei paesi del percorso.",
      "Su EVERAS trovi la scheda della festa e gli eventi collaterali (concerti, veglie, mostre) quando sono pubblicati. Per la viabilità e le chiusure al traffico resta decisivo il Comune di Cagliari. Usa il calendario per non confondere l’andata del 1° maggio con il rientro, che è un altro momento, altrettanto sentito.",
    ],
    faqs: [
      {
        question: "Quando è Sant’Efisio a Cagliari?",
        answer:
          "La processione principale è il 1° maggio. Il rientro da Nora è nei giorni successivi, di solito il 4 maggio.",
      },
      {
        question: "Si può seguire a piedi?",
        answer:
          "Sì, in città. Fuori Cagliari il corteo è lungo: molti spettatori scelgono un tratto (Quartu, Capoterra, Pula) invece di camminare tutto il percorso.",
      },
    ],
  },
];

export function findFestivalHub(slug: string) {
  return FESTIVAL_HUBS.find((hub) => hub.slug === slug);
}

export function festivalHubLinks() {
  return FESTIVAL_HUBS.map((hub) => ({
    href: hub.path,
    label: hub.h1.replace(/\s+\d{4}$/, ""),
  }));
}
