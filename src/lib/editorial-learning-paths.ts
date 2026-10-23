import { LEARNING_PATH } from "@/src/lib/learning-courses";

export const IDEAS_PATH = "/idee-e-percorsi";
export const PASSION_PATH = `${IDEAS_PATH}/per-passione`;

export type EditorialLearningPath = {
  path: string;
  title: string;
  category: string;
  summary: string;
  image: { src: string; alt: string; credit?: { label: string; href: string } };
  discover: string;
  exercise: { title: string; steps: string[] };
  choose: string[];
  links: { label: string; href: string }[];
  body?: { title: string; text: string }[];
  sources?: { label: string; href: string }[];
};

/** Original practical prompts; the historical articles retain their cited sources. */
const ORIGINAL_EDITORIAL_PATHS: EditorialLearningPath[] = [
  {
    path: "/cultura-sarda/nord-sardegna/sassari",
    title: "Sassari: dal territorio a una nuova competenza",
    category: "Imparare in città",
    summary: "Osserva la città con un taccuino e scegli tra un percorso per il lavoro e un corso per passione.",
    image: { src: "/images/cultura/sassari-panorama-everas.webp", alt: "Piazza d’Italia a Sassari" },
    discover: "Una città può diventare un punto di partenza per imparare: un dettaglio architettonico da disegnare, una scena da fotografare o un mestiere da approfondire. La guida qui sopra racconta Sassari; questo percorso ti aiuta a trasformare la curiosità in una scelta concreta.",
    exercise: {
      title: "Un taccuino di osservazione in 20 minuti",
      steps: [
        "Scegli un luogo pubblico che conosci e osserva tre dettagli: una forma, un colore e un materiale. Puoi annotarli anche senza fotografare persone.",
        "Dedica dieci minuti a uno schizzo o a tre fotografie dello stesso dettaglio, cambiando punto di vista. Non serve acquistare attrezzatura.",
        "Scrivi cosa vorresti imparare meglio e quanto tempo puoi dedicare ogni settimana. Usa queste due informazioni per confrontare i corsi.",
      ],
    },
    choose: [
      "Per un obiettivo professionale, cerca programma, requisiti di accesso, prove finali e valore dichiarato dell’attestato. La semplice frequenza non equivale a una qualifica.",
      "Per una passione, confronta livello iniziale, dimensione del gruppo, materiali inclusi e occasioni di pratica.",
      "Controlla la sede effettiva: un ente può avere sede a Sassari e proporre lezioni online o in un altro comune.",
    ],
    links: [
      { label: "Cerca formazione a Sassari", href: `${LEARNING_PATH}?city=Sassari#formazione` },
      { label: "Cerca corsi e workshop a Sassari", href: `${LEARNING_PATH}?city=Sassari#corsi-workshop` },
    ],
  },
  {
    path: "/cultura/giuseppe-biasi-pittore-sardegna",
    title: "Giuseppe Biasi: osservare per iniziare a dipingere",
    category: "Arte da sperimentare",
    summary: "Dalla lettura delle opere a un esercizio personale di colore e composizione, senza esperienza richiesta.",
    image: { src: "/images/cultura/giuseppe-biasi-ballo-tondo-everas.webp", alt: "Dettaglio dell’opera Ballo tondo di Giuseppe Biasi", credit: { label: "Giuseppe Biasi · Foto Sailko, CC BY 3.0 · ritaglio", href: "https://commons.wikimedia.org/wiki/File:Giuseppe_biasi,_ballo_tondo,_1934-35.jpg" } },
    discover: "Dopo aver letto la storia dell’artista, torna a una delle immagini della guida. Guarda come sono distribuite le figure, dove cade l’attenzione e quali colori ricompaiono. Puoi osservare questi elementi senza cercare subito di riprodurre il dipinto.",
    exercise: {
      title: "Tre colori, una composizione: prova in 30 minuti",
      steps: [
        "Prendi un foglio e una matita. Riduci una scena quotidiana a cinque forme grandi: persone, oggetti e sfondo, senza dettagli del volto.",
        "Scegli tre colori che possiedi già e distribuiscili nelle forme. Prova a ripetere un colore in più punti per collegare le parti dell’immagine.",
        "Rifai un piccolo schizzo spostando la forma principale. Confronta le due versioni e annota quale ti sembra più equilibrata e perché.",
      ],
    },
    choose: [
      "Questo è uno spunto originale di EVERAS per esercitarsi: non una ricostruzione del metodo insegnato da Biasi.",
      "Per proseguire, cerca un corso di pittura per principianti e controlla se comprende disegno, colore e composizione, oltre alla realizzazione di un singolo lavoro.",
      "Chiedi quali materiali servono e se puoi provare una lezione prima di acquistare tutto. I corsi creativi per passione appartengono a Corsi e workshop.",
    ],
    links: [{ label: "Cerca corsi di pittura", href: `${LEARNING_PATH}?q=pittura#corsi-workshop` }],
  },
  {
    path: "/cultura/artigianato-sardo",
    title: "Artigianato sardo: scegli cosa provare con le mani",
    category: "Materiali e manualità",
    summary: "Ceramica, tessuti e intreccio: parti dai materiali e impara a valutare un laboratorio creativo.",
    image: { src: "/images/cultura/pattada-coltellinaio-everas.webp", alt: "Illustrazione di un artigiano al lavoro in bottega" },
    discover: "Le tecniche raccontate nella guida richiedono strumenti e tempi diversi. Per scegliere il primo laboratorio, parti dal materiale che ti incuriosisce e dal tipo di esperienza che vuoi fare: provare un gesto, completare un oggetto o seguire un percorso continuativo.",
    exercise: {
      title: "Una trama di carta in 20 minuti",
      steps: [
        "Prepara alcune strisce di carta di recupero, anche strappandole a mano. Disponine cinque parallele su un piano.",
        "Passa una seconda serie di strisce sopra e sotto le prime, alternando l’ordine a ogni riga. Osserva come cambia la trama variando larghezza e colore.",
        "Annota cosa ti è piaciuto del lavoro: ripetizione, precisione, forma o colore. È un esercizio semplice per esplorare la manualità, non una riproduzione di una tecnica tradizionale sarda.",
      ],
    },
    choose: [
      "In un laboratorio di ceramica verifica materiali, cotture, smalti e tempi di ritiro: completare la modellazione non significa avere subito l’oggetto finito.",
      "Per tessitura o intreccio, chiedi quali strumenti userai e quanto tempo avrai per esercitarti. La fotografia di un manufatto non prova che il corso insegni a realizzarlo.",
      "Ceramica e laboratori creativi per passione restano in Corsi e workshop. Non presentiamo un incontro introduttivo come abilitazione professionale.",
    ],
    links: [
      { label: "Cerca laboratori di ceramica", href: `${LEARNING_PATH}?q=ceramica#corsi-workshop` },
      { label: "Esplora arti e manualità", href: `${LEARNING_PATH}#arti` },
    ],
  },
];

export const NEW_PASSION_PATHS: EditorialLearningPath[] = [
  {
    path: `${PASSION_PATH}/ceramica-forme-e-materiali`,
    title: "Ceramica: dalla curiosità al primo oggetto",
    category: "Ceramica e manualità",
    summary: "Esplora forme e superfici, prepara una piccola idea e scegli un laboratorio adatto a chi comincia.",
    image: { src: "/images/passion-paths/ceramica-forme-e-materiali.svg", alt: "Ceramica: forme e materiali, percorso creativo EVERAS" },
    discover: "La ceramica invita a osservare gli oggetti di ogni giorno: una ciotola, un vaso, il bordo di un piatto. Prima di scegliere un laboratorio, prova a capire cosa ti attrae: costruire una forma, lavorare una superficie o dare colore a un oggetto. Questo percorso parte dall’osservazione e ti aiuta a portare al docente un’idea semplice, lasciando spazio alla sperimentazione.",
    body: [
      { title: "Un punto di partenza in Sardegna", text: "Assemini è uno dei centri sardi legati alla lavorazione della ceramica, come racconta il portale regionale SardegnaTurismo. Puoi prendere spunto dalle forme che incontri in una bottega, in un museo o nelle immagini di una collezione, annotando luogo e autore quando li conosci. Usa questi riferimenti per allenare lo sguardo: il tuo primo progetto può essere personale, senza riprodurre un manufatto tradizionale." },
      { title: "Scegli un gesto prima di comprare gli strumenti", text: "Chiedi se il laboratorio propone modellazione manuale, tornio oppure decorazione e quale attività svolgerai davvero. Per una prima esperienza può essere utile un oggetto piccolo, concordato con chi insegna. Non occorre attrezzare una stanza prima di una lezione di prova: informati su materiali disponibili, abbigliamento richiesto e possibilità di proseguire con incontri successivi." },
      { title: "Pensa anche a ciò che succede dopo la lezione", text: "La modellazione è soltanto una fase del lavoro. Chiedi chi segue asciugatura, cotture e finitura, quali passaggi sono inclusi e quando potrai ritirare il pezzo. Se immagini una tazza o una ciotola da usare con alimenti, parlane prima con il laboratorio: una forma riuscita non dimostra che materiali e finitura siano adatti a quell’uso. Puoi iniziare con un oggetto decorativo, senza dover risolvere subito ogni scelta tecnica." },
    ],
    exercise: { title: "Una forma, tre possibilità: prova in 30 minuti", steps: [
      "Scegli tre oggetti che possiedi già e disegnane il profilo su un foglio. Osserva la relazione tra base, apertura e altezza, senza cercare un disegno perfetto.",
      "Prendi la forma più semplice e fai tre piccoli schizzi: uno basso e largo, uno alto e stretto, uno con un bordo diverso. Aggiungi una nota sulla sensazione che ti dà ogni versione.",
      "Scegli una sola variante e descrivi dimensioni indicative, funzione decorativa e superficie che vorresti ottenere. Non serve acquistare argilla per questo esercizio.",
      "Porta il foglio al laboratorio e chiedi quale variante sia realistica per una prima lezione. Conserva lo schizzo e una foto del risultato per capire cosa hai imparato e cosa vorresti riprovare.",
    ] },
    choose: [
      "Verifica che il livello sia iniziale e che il numero di partecipanti consenta un aiuto individuale. Una dimostrazione e un laboratorio pratico offrono esperienze diverse.",
      "Chiedi quali materiali, cotture e finiture sono inclusi nel prezzo e se ci saranno altri incontri o costi per completare il pezzo.",
      "Scegli il corso in base al gesto che vuoi imparare: un incontro al tornio non equivale a un percorso di modellazione o decorazione.",
      "Alla fine valuta un progresso concreto, per esempio controllare meglio lo spessore o spiegare una scelta di forma, invece di giudicare soltanto se il pezzo è bello.",
    ],
    links: [{ label: "Cerca corsi di ceramica", href: `${LEARNING_PATH}?disciplina=ceramica#corsi-workshop` }],
    sources: [{ label: "SardegnaTurismo: Assemini e la tradizione ceramica", href: "https://www.sardegnaturismo.it/it/esplora/assemini" }],
  },
  {
    path: `${PASSION_PATH}/fotografia-luce-e-territorio`,
    title: "Fotografia: racconta un luogo con sei immagini",
    category: "Fotografia e territorio",
    summary: "Un percorso da provare anche con lo smartphone: osserva la luce, scegli un soggetto e costruisci un piccolo racconto.",
    image: { src: "/images/passion-paths/fotografia-luce-e-territorio.svg", alt: "Fotografia: luce e territorio, percorso creativo EVERAS" },
    discover: "Un angolo di Sassari, una passeggiata nel tuo comune o un dettaglio del paesaggio possono diventare il tema di un piccolo racconto fotografico. Per cominciare non devi visitare un posto lontano né comprare una fotocamera: scegli un luogo accessibile che conosci e prova a guardarlo con una domanda precisa. Il percorso propone esercizi di osservazione e selezione, da approfondire poi con un corso.",
    body: [
      { title: "Parti da una domanda, non dall’attrezzatura", text: "Chiediti cosa vuoi raccontare: i colori di una strada, le tracce del lavoro artigiano oppure il rapporto tra edifici e vegetazione. Scrivi una frase prima di uscire e limita il progetto a un’area piccola. Avere un tema ti aiuta a distinguere una fotografia coerente con il racconto da una bella immagine che appartiene a un’altra storia." },
      { title: "Osserva cosa cambia spostandoti", text: "Fotografa lo stesso soggetto da tre posizioni, poi confronta sfondo, ombre e parti più chiare. Se puoi tornare in un altro momento, ripeti una fotografia e osserva le differenze senza decidere in anticipo quale luce sia migliore. All’inizio concentrati su una sola variabile alla volta. Un quaderno con due righe per ogni prova può essere più utile di molti scatti che non riguarderai." },
      { title: "Costruisci una sequenza leggibile", text: "Raccogli una vista d’insieme, alcuni dettagli e un’immagine che chiuda il percorso. Seleziona sei fotografie e disponile in un ordine che accompagni chi guarda. Scrivi una didascalia breve e chiedi a qualcuno di descrivere la storia che riconosce. Presenta le immagini come un esercizio personale; quando includi persone o lavori realizzati da altri, concorda con loro riprese e modalità di condivisione." },
    ],
    exercise: { title: "Un luogo, sei immagini: una passeggiata di osservazione", steps: [
      "Scegli un percorso breve, accessibile e adatto al tempo che hai. Prima di uscire completa la frase: «Voglio raccontare questo luogo attraverso…». Puoi anche lavorare su oggetti e angoli di casa.",
      "Realizza una vista generale, due dettagli, una fotografia di forme o colori ricorrenti e due alternative per la conclusione. Prova punti di vista diversi prima di cambiare soggetto.",
      "Scegli sei immagini e assegna a ognuna una funzione. Elimina le ripetizioni e controlla se la sequenza resta comprensibile senza una spiegazione a voce.",
      "Scrivi cinque righe: cosa volevi raccontare, quale immagine funziona e quale rifaresti. Porta questa selezione a una lezione o a una revisione fotografica, invece dell’intera cartella di scatti.",
    ] },
    choose: [
      "Verifica se il corso accetta lo smartphone o richiede una fotocamera con controlli manuali. Non acquistare attrezzatura prima di conoscere i requisiti.",
      "Cerca esercitazioni e revisione delle immagini: ascoltare una spiegazione tecnica e ricevere un riscontro sui propri scatti sono attività complementari.",
      "Confronta fotografia di base, racconto fotografico e postproduzione. Scegli il programma che risponde alla difficoltà emersa nel tuo esercizio.",
      "Per uscite e workshop controlla sede, spostamenti, accessibilità, durata e attrezzatura da portare. Un corso online può richiedere lavoro fotografico autonomo tra le lezioni.",
    ],
    links: [{ label: "Cerca corsi di fotografia", href: `${LEARNING_PATH}?disciplina=fotografia-video&q=fotografia#corsi-workshop` }],
  },
  {
    path: `${PASSION_PATH}/tessitura-trame-e-colori`,
    title: "Tessitura: comincia da trame e colori",
    category: "Tessuti e artigianato",
    summary: "Dall’osservazione dei tessuti a un piccolo intreccio di carta: scopri cosa chiedere al tuo primo laboratorio.",
    image: { src: "/images/passion-paths/tessitura-trame-e-colori.svg", alt: "Tessitura: trame e colori, percorso creativo EVERAS" },
    discover: "Un tessuto si può osservare come una superficie fatta di ritmo, colore e ripetizione. Questo percorso parte da materiali che hai già per aiutarti a capire se ti incuriosiscono soprattutto il gesto, la struttura o la composizione. L’esercizio di carta è un primo esperimento di manualità; per imparare a preparare e usare un telaio serve un insegnamento pratico dedicato.",
    body: [
      { title: "Guarda i tessuti come un piccolo archivio", text: "Scegli tre tessuti diversi che puoi osservare da vicino e annota colore, regolarità e sensazione al tatto. Se ti interessa la Sardegna, il MURATS di Samugheo è un riferimento per conoscere il patrimonio tessile dell’Isola, presentato anche dal portale regionale SardegnaTurismo. Consulta le informazioni del museo prima di organizzare una visita: questo percorso non annuncia un laboratorio o una visita già prenotabile su EVERAS." },
      { title: "Distingui l’ispirazione dalla tecnica", text: "Puoi prendere spunto dalla ripetizione di forme o dall’accostamento dei colori senza attribuire al tuo esercizio il nome di una lavorazione tradizionale. Conserva una nota sul riferimento che hai osservato e costruisci una tua variazione semplice. Se vuoi studiare una tecnica specifica, chiedi al docente quale esperienza iniziale richieda e quali passaggi siano effettivamente inclusi nelle lezioni." },
      { title: "Immagina un progetto piccolo e concluso", text: "Prima di pensare a un tappeto o a un lavoro complesso, concorda un campione che ti permetta di esercitare poche operazioni e ricevere correzioni. Chiedi se il telaio è già predisposto o se imparerai anche a prepararlo, quali filati userai e quanto lavoro autonomo è previsto. Un risultato piccolo, accompagnato dalle note sugli errori, può aiutarti a scegliere come continuare." },
    ],
    exercise: { title: "Tre trame di carta, una palette personale", steps: [
      "Prepara strisce di carta di recupero in due colori. Disponi cinque strisce parallele e passa le altre alternativamente sopra e sotto, come in un semplice esercizio di intreccio.",
      "Crea un secondo campione cambiando la larghezza delle strisce e un terzo variando la sequenza dei colori. Mantieni simili le dimensioni per confrontare meglio i risultati.",
      "Metti i tre campioni uno accanto all’altro e annota quale ti sembra più regolare, quale più vivace e quale vorresti sviluppare con un altro materiale.",
      "Fotografa i campioni con le tue note. Usali per spiegare al docente cosa ti interessa, ricordando che la carta non riproduce il comportamento dei filati né insegna a usare un telaio.",
    ] },
    choose: [
      "Verifica se il corso riguarda tessitura al telaio, intreccio, ricamo o sartoria: sono proposte diverse anche quando compaiono nella stessa disciplina del catalogo.",
      "Chiedi quali strumenti siano disponibili, se i materiali sono compresi e se potrai continuare a esercitarti tra gli incontri.",
      "Controlla se il programma include preparazione del telaio, lettura di schemi e revisione dei campioni oppure una sola esperienza introduttiva.",
      "Scegli una prima prova compatibile con tempo e spazio disponibili. Valuta un acquisto di strumenti soltanto dopo aver capito con quale lavorazione vuoi proseguire.",
    ],
    links: [{ label: "Cerca corsi di tessitura", href: `${LEARNING_PATH}?disciplina=artigianato-tessitura&q=tessitura#corsi-workshop` }, { label: "Esplora artigianato e sartoria", href: `${LEARNING_PATH}?disciplina=artigianato-tessitura#corsi-workshop` }],
    sources: [{ label: "SardegnaTurismo: Samugheo e il patrimonio tessile", href: "https://www.sardegnaturismo.it/it/esplora/samugheo" }, { label: "MURATS: informazioni ufficiali del museo", href: "https://www.murats.it/contatti/" }],
  },
];

export const EDITORIAL_LEARNING_PATHS = [...ORIGINAL_EDITORIAL_PATHS, ...NEW_PASSION_PATHS];

export function findEditorialLearningPath(path: string) {
  return EDITORIAL_LEARNING_PATHS.find((item) => item.path === path);
}
