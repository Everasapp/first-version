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
  {
    slug: "cavalcata-sarda",
    path: "/eventi-sardegna/cavalcata-sarda",
    title: "Cavalcata Sarda a Sassari: data, sfilata e come vederla",
    h1: "Cavalcata Sarda a Sassari",
    description:
      "La Cavalcata Sarda: quando si svolge a Sassari, il corteo in costume e dove sistemarsi per vedere la sfilata.",
    titleIncludes: ["cavalcata sarda"],
    paragraphs: [
      "La Cavalcata Sarda è la grande sfilata di Sassari: gruppi in costume da tutta l’isola, cavalli e musiche tradizionali lungo il centro. Chi cerca “Cavalcata Sarda 2026” vuole in pratica il giorno esatto (di solito una domenica di maggio), l’ora di partenza e dove stare senza perdere il corteo.",
      "Non è una sagra di paese: è un appuntamento identitario, con migliaia di persone in piazza e transenne in corso. Conviene arrivare presto, lasciare l’auto fuori dal centro e seguire il percorso a piedi. Nel pomeriggio e in serata ci sono spesso spettacoli e concerti collegati.",
      "Su EVERAS trovi la scheda della sfilata e gli eventi intorno quando sono pubblicati. Per la viabilità resta decisivo il Comune di Sassari. Se la data dell’anno in corso non è ancora in calendario, torna tra qualche giorno: la aggiorniamo appena arriva la conferma.",
    ],
    faqs: [
      {
        question: "Quando è la Cavalcata Sarda?",
        answer:
          "Di solito a maggio, a Sassari, in una domenica indicata dal Comune. La data precisa cambia ogni anno: controlla la scheda su Everas.",
      },
      {
        question: "La sfilata è gratuita?",
        answer:
          "Vedere il corteo dalle strade è in genere libero. Tribune o postazioni riservate, se previste, sono indicate sulla scheda o dal Comune.",
      },
    ],
  },
  {
    slug: "ardia-sedilo",
    path: "/eventi-sardegna/ardia-sedilo",
    title: "Ardia di Sedilo: date, corsa a cavallo e come arrivarci",
    h1: "Ardia di Sedilo",
    description:
      "S’Ardia a Sedilo: quando si corre intorno al santuario di San Costantino, orari e consigli per vederla da vicino.",
    titleIncludes: ["ardia di sedilo", "s'ardia", "s’ardia"],
    paragraphs: [
      "L’Ardia di Sedilo è una corsa a cavallo votiva, non uno spettacolo da palio. I cavalieri partono dal santuario di San Costantino e si lanciano in una discesa stretta, tra polvere e folla. Chi cerca “Ardia Sedilo” vuole il giorno (intorno al 6 e 7 luglio), l’ora della corsa e come arrivare al santuario senza restare bloccato in macchina.",
      "Si corre in due giornate: la sera del 6 e il mattino del 7, legate alla festa di San Costantino. Non è un evento da tribuna comoda. Meglio lasciare l’auto a distanza, arrivare con largo anticipo e seguire le indicazioni del Comune e dei volontari. I bambini vanno tenuti lontani dal tracciato.",
      "Su EVERAS teniamo la scheda con data e luogo quando l’edizione è pubblicata, più eventuali sagre e veglie intorno. Per il programma religioso e le chiusure stradali resta utile il Comune di Sedilo. Se a luglio la scheda non c’è ancora, manca solo la conferma dell’anno in corso.",
    ],
    faqs: [
      {
        question: "Quando si corre l’Ardia a Sedilo?",
        answer:
          "Tradizionalmente il 6 luglio al tramonto e il 7 luglio al mattino, per San Costantino. Controlla sempre l’orario sulla scheda dell’anno in corso.",
      },
      {
        question: "Si può vedere gratis?",
        answer:
          "Sì, dal santuario e dalle aree segnalate. Non ci sono biglietti per la corsa: è una festa religiosa, con regole strette di sicurezza.",
      },
    ],
  },
  {
    slug: "corsa-degli-scalzi",
    path: "/eventi-sardegna/corsa-degli-scalzi",
    title: "Corsa degli Scalzi a Cabras: date, percorso e programma",
    h1: "Corsa degli Scalzi a Cabras",
    description:
      "La Corsa degli Scalzi da Cabras a San Salvatore di Sinis: quando si fa, il voto a San Salvatore e come seguire i running.",
    titleIncludes: ["corsa degli scalzi"],
    paragraphs: [
      "La Corsa degli Scalzi è il voto di Cabras a San Salvatore: centinaia di uomini in saio bianco corrono scalzi dalla basilica fino al santuario di San Salvatore di Sinis, e poi fanno il rientro. Chi cerca “Corsa degli Scalzi 2026” vuole i giorni (fine agosto–inizio settembre), l’ora della partenza e se in paese ci sono sagre e concerti.",
      "Non è una maratona sportiva. È una corsa religiosa, polverosa, affollata. Il tratto tra Cabras e San Salvatore si segue meglio dai bordi della strada, arrivando all’alba. A San Salvatore, nei giorni intorno, il villaggio si anima con stand, musica e la festa del santo. Il centro di Cabras si chiude al traffico.",
      "Su EVERAS trovi la scheda principale e gli appuntamenti collaterali quando sono pubblicati. Per il minuto per minuto della processione resta il programma della parrocchia e del Comune. Apri la scheda per data, orario e come arrivare al Sinis.",
    ],
    faqs: [
      {
        question: "Quando è la Corsa degli Scalzi a Cabras?",
        answer:
          "Di solito a cavallo tra fine agosto e i primi di settembre, con andata e rientro in giorni distinti. La data esatta è sulla scheda Everas.",
      },
      {
        question: "Dove si vede meglio?",
        answer:
          "Alla partenza a Cabras e all’arrivo a San Salvatore di Sinis. Lungo la strada i running passano veloci: scegli un punto e resta sul ciglio, fuori dal tracciato.",
      },
    ],
  },
  {
    slug: "sagra-degli-agrumi",
    path: "/eventi-sardegna/sagra-degli-agrumi",
    title: "Sagra degli Agrumi a Muravera: date, stand e programma",
    h1: "Sagra degli Agrumi a Muravera",
    description:
      "La Sagra degli Agrumi nel Sarrabus: quando si fa a Muravera, sfilate, stand e cosa vedere nel weekend.",
    titleIncludes: ["sagra degli agrumi", "agrumi a muravera"],
    paragraphs: [
      "La Sagra degli Agrumi è la festa di Muravera e del Sarrabus: arance, sfilate in costume, carri e stand in paese. Chi cerca “Sagra degli Agrumi 2026” vuole il weekend esatto (di solito a febbraio o inizio primavera), se c’è la sfilata della domenica e dove parcheggiare.",
      "Non è solo gastronomia. C’è un corteo, musica, bancarelle e un centro che si riempie per due o tre giorni. Conviene arrivare la mattina, lasciare l’auto fuori dal nucleo e muoversi a piedi. Se vieni da Cagliari, calcola la Statale Orientale Sarda e il traffico della domenica.",
      "Su EVERAS raccogliamo la sagra e gli eventi collegati (concerti, InVaso, iniziative in piazza) quando sono pubblicati. Se a febbraio la scheda non è ancora online, manca la locandina dell’edizione: la aggiungiamo appena il Comune e la Pro Loco la confermano.",
    ],
    faqs: [
      {
        question: "Quando è la Sagra degli Agrumi a Muravera?",
        answer:
          "In genere a febbraio, in un weekend indicato dal Comune. Le date si spostano di anno in anno: guarda il calendario Everas.",
      },
      {
        question: "L’ingresso è a pagamento?",
        answer:
          "Entrare in paese è di solito libero. Qualche degustazione o spettacolo può avere un prezzo: è scritto sulla scheda.",
      },
    ],
  },
  {
    slug: "isole-che-parlano",
    path: "/eventi-sardegna/isole-che-parlano",
    title: "Isole che Parlano a Palau: date, programma e isole",
    h1: "Isole che Parlano a Palau",
    description:
      "Il festival Isole che Parlano: concerti, incontri e traversate da Palau verso le isole, con calendario su EVERAS.",
    titleIncludes: ["isole che parlano"],
    paragraphs: [
      "Isole che Parlano è il festival di Palau che mescola musica, parole e traversate verso Spargi e le altre isole. Non è una sagra: è una rassegna di settembre, con concerti all’aperto, incontri e qualche appuntamento che si raggiunge in barca. Chi cerca il programma vuole sapere quale giorno si va sull’isola e cosa resta a terra, a Palau.",
      "Il formato premia chi si organizza: orari di imbarco, posti limitati, serate in piazza. Meglio leggere la scheda prima di partire da Olbia o Santa Teresa. Il vento può spostare un concerto dalla spiaggia al paese: per questo teniamo date e luogo aggiornati, non un volantino fisso.",
      "Su EVERAS trovi l’edizione principale e gli appuntamenti distinti quando hanno senso da soli (laboratori per bambini, tappe in altri paesi). Evitiamo di ripetere ogni singola sessione del programma. Apri la scheda per orari, ingresso e come arrivare a Palau.",
    ],
    faqs: [
      {
        question: "Quando è Isole che Parlano?",
        answer:
          "Di solito a settembre, su più giorni. Il calendario preciso cambia ogni edizione: è sulle schede Everas.",
      },
      {
        question: "Serve il biglietto?",
        answer:
          "Alcuni concerti sono gratuiti, altri a pagamento o con prenotazione per le traversate. Il dettaglio è sulla scheda dell’appuntamento.",
      },
    ],
  },
  {
    slug: "sposalizio-selargino",
    path: "/eventi-sardegna/sposalizio-selargino",
    title: "Antico Sposalizio Selargino: date, rito e programma",
    h1: "Antico Sposalizio Selargino",
    description:
      "Lo Sposalizio Selargino a Selargius: il rito nuziale in costume, le date di settembre e come vedere il corteo.",
    titleIncludes: ["sposalizio selargino", "antico sposalizio"],
    paragraphs: [
      "L’Antico Sposalizio Selargino è il rito del matrimonio tradizionale campidanese, a Selargius. Per più giorni a settembre il paese mette in scena fidanzamento, cortei e la cerimonia in costume. Chi cerca “Sposalizio Selargino 2026” vuole il weekend della sfilata, l’ora del corteo nuziale e se ci sono sagre in piazza.",
      "Non è un matrimonio vero aperto al pubblico come uno spettacolo da teatro: è una festa di comunità, con gruppi in abito, traccas e strade chiuse. Conviene arrivare da Cagliari con l’autobus o lasciare l’auto fuori dal centro. La domenica è il giorno più affollato.",
      "Su EVERAS trovi la scheda dell’edizione con le date complete e gli eventi intorno. Per i dettagli del rito (sa coia, i gruppi folkloristici, la chiesa) resta utile anche il Comune di Selargius. Noi teniamo il calendario: quando, dove, se l’ingresso è libero.",
    ],
    faqs: [
      {
        question: "Quando si svolge lo Sposalizio Selargino?",
        answer:
          "A settembre, su più giorni, con il cuore nel weekend della sfilata. Le date esatte sono sulla scheda Everas.",
      },
      {
        question: "Si può assistere gratis?",
        answer:
          "Il corteo in paese è in genere libero. Alcuni momenti in chiesa o cene collegate possono richiedere prenotazione: è indicato sulla scheda.",
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
