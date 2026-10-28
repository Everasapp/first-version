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
  body?: { title: string; text: string; items?: string[] }[];
  author?: { name: string; role: string; url: string };
  updatedAt?: string;
  sourcesNote?: string;
  sources?: { label: string; href: string }[];
};

/** Original practical prompts; the historical articles retain their cited sources. */
const ORIGINAL_EDITORIAL_PATHS: EditorialLearningPath[] = [
  {
    path: "/cultura-sarda/nord-sardegna/sassari",
    title: "Sassari: dal territorio a una nuova competenza",
    category: "Imparare in città",
    summary: "Osserva la città con un taccuino e scegli tra un percorso per il lavoro e un corso per passione.",
    image: { src: "/images/cultura/sassari-panorama-everas.webp", alt: "Piazza d’Italia a Sassari, con il Palazzo della Provincia e le palme" },
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
    image: {
      src: "/images/cultura/giuseppe-biasi-ballo-tondo-everas.webp",
      alt: "Ballo tondo di Giuseppe Biasi: figure in cerchio davanti a un paese sardo",
      credit: { label: "Foto: Sailko · Giuseppe Biasi, Ballo tondo (1934–35) · CC BY 3.0 · ritaglio per il web", href: "https://commons.wikimedia.org/wiki/File:Giuseppe_biasi,_ballo_tondo,_1934-35.jpg" },
    },
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
    image: { src: "/images/cultura/pattada-coltellinaio-everas.webp", alt: "Artigiano al lavoro sulla resolza pattadese in bottega a Pattada" },
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
    path: `${PASSION_PATH}/inglese-parlato-esercizi-principianti`,
    title: "Inglese parlato: come allenarsi anche senza un corso",
    category: "Lingue e comunicazione",
    summary: "Un piano pratico di sette giorni per iniziare a parlare inglese, anche da soli, e capire quando serve un insegnante.",
    image: { src: "/images/learning/english-learning-workspace.webp", alt: "Cuffie, quaderno e lezione audio per esercitarsi con l'inglese parlato" },
    discover: "Capire una parola non significa riuscire a usarla in una conversazione. Per sbloccare il parlato serve una pratica breve e ripetuta, fatta di frasi utili, ascolto attento e piccoli tentativi di risposta. Questa guida propone un esercizio originale EVERAS, non sostituisce la valutazione del livello né promette di diventare fluenti in una settimana.",
    body: [
      { title: "Perché conosci le parole ma ti blocchi quando parli", text: "Quando leggi, hai tempo di rileggere; durante una conversazione devi recuperare parole e costruire frasi in pochi secondi. Ecco perché sapere la grammatica non è sufficiente. Invece di imparare altre liste di vocaboli, prova a riutilizzare ogni giorno cinque frasi legate alla tua vita: presentarti, chiedere un'informazione, raccontare cosa hai fatto e spiegare cosa vorresti fare. Il traguardo iniziale non è parlare senza errori: è farti capire e riuscire a continuare." },
      { title: "Prepara un piccolo repertorio personale", text: "Scrivi tre situazioni che potresti vivere davvero: un viaggio, una telefonata o una presentazione di lavoro. Per ciascuna prepara due domande e due possibili risposte, scegliendo parole che sai già pronunciare. Ad esempio, al posto di cercare una frase complicata per chiedere indicazioni, puoi partire da 'How can I get to the station?' e 'Is it far from here?'. Prova anche a cambiare un solo elemento: station diventa museum oppure hospital. Questo è un modo per passare dalla memorizzazione alla costruzione di nuove frasi." },
      { title: "Allenati ad ascoltare e a rispondere", text: "Scegli un audio breve in inglese, possibilmente accompagnato da trascrizione, su un argomento familiare. Ascoltalo una volta per capire il senso generale; poi riascoltalo fermandoti dopo ogni frase e prova a ripeterla. Infine chiudi la trascrizione e rispondi a voce a una domanda sul contenuto. Se non ricordi una parola, descrivila con parole più semplici. Il materiale deve essere abbastanza comprensibile da permetterti di riprovare senza trasformare l'esercizio in una traduzione continua." },
      { title: "Come misurare un miglioramento reale", text: "Registra sul telefono una presentazione di 30–60 secondi il primo giorno e ripeti lo stesso compito una settimana dopo, senza leggere. Controlla se riesci a completare più frasi, usare meno pause lunghe e correggerti senza fermarti. Non confrontare accenti e velocità con quelli di un madrelingua: valuta se il messaggio è più chiaro. Conserva le due registrazioni per decidere cosa allenare nel mese successivo." },
      { title: "Quando conviene cercare un corso o un insegnante", text: "La pratica autonoma aiuta a prendere confidenza, ma può non bastare per riconoscere errori ricorrenti o affrontare conversazioni impreviste. Un corso di conversazione dovrebbe lasciarti tempo per parlare e ricevere un riscontro comprensibile, non limitarsi a spiegazioni frontali. Chiedi quante persone partecipano, quanto tempo effettivo è dedicato al parlato, quali livelli sono ammessi e se è prevista una prova orientativa. Se devi preparare un esame certificato, cerca invece un percorso dedicato all'esame richiesto." },
    ],
    exercise: { title: "Sette giorni, dieci minuti al giorno", steps: [
      "Giorno 1: registra una presentazione di 30 secondi. Riascoltala e scegli soltanto due difficoltà su cui lavorare.",
      "Giorno 2: scrivi cinque frasi utili su di te e pronunciale lentamente senza leggerle almeno due volte.",
      "Giorno 3: trasforma le cinque frasi in domande e rispondi a voce con informazioni vere.",
      "Giorno 4: ascolta un minuto di audio semplice con trascrizione, poi ripeti tre frasi facendo attenzione alle pause.",
      "Giorno 5: simula una situazione pratica, come ordinare qualcosa o chiedere indicazioni. Inventa due risposte possibili.",
      "Giorno 6: racconta in un minuto cosa hai fatto ieri e cosa farai domani. Se manca una parola, prova a spiegarla con parole più semplici.",
      "Giorno 7: ripeti la registrazione del primo giorno. Annota un miglioramento concreto e una difficoltà che merita un aiuto esterno.",
    ] },
    choose: [
      "Se sei all'inizio, cerca corsi che consentano di fare domande semplici e dialoghi guidati. Una classe di livello troppo alto può lasciarti in silenzio.",
      "Se comprendi già testi e audio ma parli poco, valuta lezioni di conversazione con gruppi piccoli e correzioni puntuali.",
      "Se ti serve l'inglese per lavoro, chiedi esercitazioni su chiamate, email, presentazioni o colloqui, non soltanto dialoghi da viaggio.",
      "Verifica calendario, costo totale, frequenza richiesta e modalità online o in presenza. Un corso generico non implica il conseguimento di una certificazione linguistica.",
    ],
    links: [{ label: "Cerca corsi di inglese", href: `${LEARNING_PATH}?disciplina=lingue&q=inglese` }, { label: "Tutte le lingue", href: `${LEARNING_PATH}?disciplina=lingue` }],
  },

  {
    path: `${PASSION_PATH}/ceramica-forme-e-materiali`,
    title: "Ceramica: dalla curiosità al primo oggetto",
    category: "Ceramica e manualità",
    summary: "Esplora forme e superfici, prepara una piccola idea e scegli un laboratorio adatto a chi comincia.",
    image: { src: "/images/passion-paths/ceramica-forme-e-materiali.webp", alt: "Mani che modellano una ciotola sul tornio in uno studio di ceramica" },
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
    image: { src: "/images/passion-paths/fotografia-luce-e-territorio.webp", alt: "Macchina fotografica, obiettivi e stampe di paesaggi su un tavolo" },
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
    image: { src: "/images/passion-paths/tessitura-trame-e-colori.webp", alt: "Telaio in legno con un tessuto a strisce colorate e gomitoli di filo" },
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
  {
    path: `${PASSION_PATH}/acquerello-primi-passi`,
    title: "Acquerello: primi passi con acqua e colore", category: "Pittura e creatività",
    summary: "Come iniziare con pochi materiali, allenare la mano e capire se un laboratorio è adatto a te.",
    image: { src: "/images/passion-paths/acquerello-primi-passi.webp", alt: "Tavolo da acquerello con pennelli, tavolozza e un paesaggio dipinto" },
    discover: "Un percorso pratico per iniziare anche senza un corso attivo in zona. Leggi i consigli, prova l'esercizio con ciò che hai e scopri quali domande fare a un insegnante.",
    body: [{"title":"Materiali essenziali","text":"Per cominciare bastano un pennello morbido, un piccolo set di pigmenti, due contenitori per l’acqua, un panno e carta adatta alle tecniche umide. Non serve comprare subito molti colori: usa ciò che hai e confronta i risultati. Se il foglio si deforma, può essere la carta, non un errore nella tecnica."},{"title":"Tre modi di usare l’acqua","text":"L’acquerello varia con la quantità di acqua e con l’umidità della superficie. Prova lo stesso colore su carta asciutta con poco pigmento, poi con un lavaggio diluito, infine su carta già bagnata. Aspetta che asciughi prima di giudicare colori e bordi."},{"title":"La differenza tra copiare e imparare","text":"Riprodurre un modello seguendo l’insegnante può essere piacevole, ma verifica che il laboratorio insegni anche velature, sovrapposizioni, colore e correzione degli errori. L’obiettivo è acquisire gesti ripetibili in autonomia."}],
    exercise: { title: "Esercizio pratico: prova in autonomia", steps: ["Ritaglia tre piccoli riquadri e usa sempre lo stesso colore.","Nel primo usa poca acqua, nel secondo una velatura, nel terzo inumidisci la carta prima.","Lascia asciugare senza ritoccare, poi annota le differenze.","Ripeti la prova e confronta i risultati."] },
    choose: ["Verifica se dipingerai personalmente o assisterai a una dimostrazione.","Chiedi se carta, pigmenti e pennelli sono inclusi.","Controlla il livello richiesto e quanto feedback riceverai."],
    links: [{ label: "Cerca corsi e laboratori", href: `${LEARNING_PATH}?disciplina=pittura-disegno&q=acquerello` }],
  },
  {
    "path": "/idee-e-percorsi/per-passione/primo-sito-web-da-zero",
    "title": "Creare il tuo primo sito web: dal progetto alla pubblicazione",
    "category": "Competenze digitali",
    "summary": "Un metodo per principianti, un progetto reale dal portfolio MC Design e un esercizio guidato per organizzare pagine, contenuti e controlli prima di andare online.",
    "image": {
      "src": "/images/passion-paths/primo-sito-web-da-zero.webp",
      "alt": "Computer con la bozza di una pagina web e un quaderno di schemi"
    },
    "author": {
      "name": "Marina Canalis",
      "role": "Web designer e sviluppatrice, fondatrice di MC Design e ideatrice di EVERAS",
      "url": "https://www.mc-design.site/it/about"
    },
    "updatedAt": "2026-10-24",
    "discover": "Per iniziare non devi già saper programmare né acquistare un abbonamento. Il risultato di questo esercizio è un piccolo progetto verificabile: obiettivo, mappa delle pagine, bozza della homepage e prova con un lettore. Puoi prepararlo su carta e usarlo per scegliere un corso, costruire il sito in autonomia o spiegare le tue esigenze a un professionista.",
    "body": [
      {
        "title": "1. Decidi chi deve usare il sito e per fare cosa",
        "text": "Il primo lavoro è completare due frasi: «Questo sito si rivolge a…» e «Dopo averlo visitato, una persona dovrebbe…». Un portfolio aiuta a valutare dei lavori; il sito di un servizio aiuta a capire un’offerta e chiedere informazioni. Se provi a fare tutto nella prima schermata, chi legge deve decidere da solo cosa conta. Scegli un’azione principale e raccogli le informazioni necessarie per compierla. Nel metodo presentato da MC Design, obiettivi, pubblico e contenuti precedono la scelta della soluzione tecnica."
      },
      {
        "title": "2. Un caso reale: il portfolio di Kate Tojeiro",
        "text": "Nel portfolio MC Design, il sito di Kate Tojeiro è documentato come un progetto progettato e sviluppato da zero in Webflow, con design visivo, architettura del sito e impaginazioni responsive pensati per presentare il lavoro creativo e l’identità personale. Sono previste anche interazioni e animazioni discrete. È un esempio reale di come struttura e presentazione possano lavorare insieme. La descrizione pubblica non fornisce dati su richieste ricevute o risultati commerciali: qui lo usiamo per osservare il progetto, senza attribuirgli risultati non documentati."
      },
      {
        "title": "3. Dal caso reale alla tua mappa delle pagine",
        "text": "Per un primo portfolio puoi partire da quattro pagine. È una proposta didattica per il tuo esercizio, non la ricostruzione delle pagine del sito di Kate Tojeiro. Disegna quattro rettangoli e collega ciascuno alla pagina che dovrebbe seguire. Per ogni pagina scrivi una domanda del visitatore e una risposta breve. Se due pagine rispondono alla stessa domanda con gli stessi contenuti, valuta se unirle.",
        "items": [
          "Home: che cosa fai, per chi e dove posso vedere un esempio?",
          "Progetti: quali lavori mostrano le tue capacità e quale problema affronta ciascuno?",
          "Chi sono: quale esperienza è rilevante per il tipo di lavoro che presenti?",
          "Contatti: come posso scriverti e quali informazioni ti servono per rispondere?"
        ]
      },
      {
        "title": "4. Una homepage di esempio, già impostata",
        "text": "Immagina, solo per questo esercizio, un illustratore che lavora per piccole attività. Il suo obiettivo è ricevere richieste per illustrazioni personalizzate. Un titolo utilizzabile come punto di partenza è «Illustrazioni per dare un volto alla tua attività». Il testo successivo può chiarire «Creo immagini per menu, confezioni e comunicazione di piccoli marchi». È un esempio inventato: adattalo a ciò che sai fare davvero, evitando clienti, esperienze o risultati che non puoi documentare.",
        "items": [
          "Apertura: titolo, spiegazione breve e collegamento «Guarda i progetti».",
          "Selezione: tre lavori con immagine, contesto e ruolo svolto. Se sono esercitazioni personali, dichiaralo.",
          "Metodo: tre passaggi comprensibili, per esempio confronto iniziale, proposta e consegna.",
          "Presentazione: poche righe sull’esperienza pertinente e un collegamento alla pagina Chi sono.",
          "Contatto: un invito specifico, per esempio «Descrivimi il progetto», con un recapito o un modulo essenziale."
        ]
      },
      {
        "title": "5. Prepara testi e immagini prima di rifinire il design",
        "text": "Per ogni progetto seleziona un’immagine principale e scrivi cosa doveva comunicare, quale parte hai realizzato e perché hai fatto una scelta. «Ho usato titoli brevi perché le persone consultano il menu dal telefono» spiega più di «Design moderno e innovativo». Usa immagini che puoi pubblicare e riducine il peso senza perdere la qualità necessaria. Aggiungi un testo alternativo quando l’immagine comunica informazioni. Sulla bozza sostituisci i blocchi segnaposto con contenuti realistici: la lunghezza dei testi e le proporzioni delle immagini cambiano l’equilibrio della pagina."
      },
      {
        "title": "6. Scegli lo strumento dopo aver definito le esigenze",
        "text": "La scelta dipende da cosa devi costruire e da come vuoi aggiornarlo. Prima di confrontare le piattaforme, scrivi se ti servono articoli, progetti aggiornabili, moduli, prenotazioni o vendite. Un CMS è un sistema per gestire contenuti ricorrenti, come le schede dei progetti, senza ridisegnare ogni pagina. Webflow compare nel caso reale MC Design, ma non è un passaggio obbligatorio dell’esercizio. Se vuoi imparare il codice, cerca un percorso che affronti HTML, CSS e pratica guidata; se preferisci strumenti visuali, verifica comunque che insegni struttura, responsive e gestione dei contenuti."
      },
      {
        "title": "7. Prova la navigazione anche sul telefono",
        "text": "Controlla che titoli e pulsanti si capiscano senza spiegazioni, che i testi non richiedano uno zoom e che immagini e menu non coprano i contenuti. Prova a raggiungere un progetto e poi il contatto: il percorso deve funzionare anche partendo da una pagina interna. Usa inoltre il tasto Tab per muoverti tra i collegamenti e verifica di riconoscere dove si trova il focus. Le animazioni possono accompagnare la lettura, ma le informazioni principali devono restare comprensibili anche senza di esse. Prima risolvi un collegamento che non funziona, poi rifinisci gli effetti."
      },
      {
        "title": "8. Cosa controllare prima della pubblicazione",
        "text": "Il dominio è l’indirizzo del sito; l’hosting è il servizio che lo rende disponibile online. Prima di acquistare, annota costi iniziali, rinnovi e ciò che il piano comprende. Prepara inoltre una breve descrizione per ogni pagina e un titolo che ne chiarisca il contenuto. Queste basi aiutano a presentare il sito, ma non garantiscono una posizione su Google. Pubblicare richiede anche una verifica concreta di contenuti, strumenti utilizzati e modalità di contatto.",
        "items": [
          "Apri tutti i collegamenti principali, inclusi logo, menu, pulsanti e contatti.",
          "Invia una prova dal modulo e verifica di riceverla davvero; controlla anche i messaggi di errore.",
          "Rimuovi testi segnaposto, pagine vuote e recapiti di prova.",
          "Verifica chi può aggiornare il sito, chi controlla dominio e account e come recuperare gli accessi.",
          "Controlla quali dati personali raccogli e quali strumenti di tracciamento attivi; predisponi informative e gestione del consenso adeguate alla configurazione.",
          "Assegna a qualcuno il controllo periodico di contenuti, collegamenti e rinnovi."
        ]
      },
      {
        "title": "9. Come capire se il primo progetto funziona",
        "text": "Mostra la bozza a una persona che non conosce la tua idea e chiedile: «Che cosa offre questo sito?», «Dove guarderesti un lavoro?» e «Come chiederesti informazioni?». Non indicare i pulsanti e non spiegare mentre prova. Annota dove esita e modifica un elemento alla volta, per esempio il titolo o il nome di una voce del menu. Ripeti la prova: se la persona riesce a completare il compito più facilmente, hai un riscontro sul progetto. Questa piccola verifica serve a migliorare una bozza, non misura da sola l’efficacia commerciale del futuro sito."
      }
    ],
    "exercise": {
      "title": "Il tuo primo progetto su carta: una sessione di 60 minuti",
      "steps": [
        "Primi 10 minuti: scegli una tua attività reale o un progetto personale. Scrivi destinatario, bisogno e azione principale. Esempio: «Il mio portfolio aiuta una piccola attività a valutare le mie illustrazioni e chiedermi informazioni».",
        "Successivi 10 minuti: disegna la mappa di massimo quattro pagine. Per ciascuna indica una domanda a cui risponde e il passo successivo.",
        "Per 15 minuti: prepara la homepage in cinque sezioni usando l’esempio della guida. Scrivi un titolo preciso, due frasi introduttive e il testo di un pulsante.",
        "Per 10 minuti: scegli un lavoro da mostrare. Descrivi contesto, contributo personale e una scelta motivata; indica chiaramente se è un’esercitazione.",
        "Negli ultimi 15 minuti: fai provare la bozza a una persona, annota un ostacolo e correggilo. Conserva le due versioni e scrivi perché hai cambiato quell’elemento."
      ]
    },
    "choose": [
      "Se parti da zero, cerca un corso con obiettivo e prerequisiti chiari. Chiedi quale sito realizzerai e cosa dovrai già saper fare.",
      "Verifica che ci siano esercitazioni, revisione del tuo progetto e prove sul telefono, oltre alle dimostrazioni del docente.",
      "Per un percorso su Webflow o altri strumenti visuali, controlla se comprende CMS, aggiornamenti e pubblicazione. Per un percorso sul codice, chiedi quanta pratica è prevista su HTML e CSS.",
      "Chiedi se account e dominio resteranno sotto il tuo controllo e quali costi continueranno dopo il corso.",
      "Porta al docente mappa, testi e prove con il lettore: sono una base concreta per capire quali competenze ti mancano."
    ],
    "links": [
      {
        "label": "Cerca corsi per creare siti web",
        "href": "/imparare-e-fare-in-sardegna?disciplina=digitale-informatica&q=web"
      },
      {
        "label": "Tutti i corsi di competenze digitali",
        "href": "/imparare-e-fare-in-sardegna?disciplina=digitale-informatica"
      }
    ],
    "sourcesNote": "Guida originale EVERAS sviluppata a partire dall’esperienza professionale di Marina Canalis e dal metodo presentato su MC Design. MC Design ed EVERAS sono progetti della stessa autrice. Il caso Kate Tojeiro è documentato nel portfolio; la mappa delle pagine, i testi dell’illustratore e l’esercizio sono esempi didattici originali.",
    "sources": [
      {
        "label": "MC Design: portfolio e progetto Kate Tojeiro",
        "href": "https://www.mc-design.site/work"
      },
      {
        "label": "MC Design: metodo di progettazione dei siti web",
        "href": "https://www.mc-design.site/it/web-design-sassari"
      },
      {
        "label": "Marina Canalis: profilo professionale",
        "href": "https://www.mc-design.site/it/about"
      }
    ]
  },
  {
    path: `${PASSION_PATH}/cucina-primo-laboratorio`,
    title: "Il primo laboratorio di cucina: cosa imparare davvero", category: "Cucina e gastronomia",
    summary: "Come prepararti a una lezione pratica, organizzare ingredienti e valutare ciò che hai imparato.",
    image: { src: "/images/passion-paths/cucina-primo-laboratorio.webp", alt: "Piano di cucina con verdure, erbe e ingredienti pronti per un laboratorio" },
    discover: "Un percorso pratico per iniziare anche senza un corso attivo in zona. Leggi i consigli, prova l'esercizio con ciò che hai e scopri quali domande fare a un insegnante.",
    body: [{"title":"Scegli una tecnica precisa","text":"Preparare la pasta fresca, cuocere un impasto o tagliare gli ingredienti sono abilità differenti. Individua un solo gesto che vorresti ripetere da solo dopo la lezione e controlla se il corso lo prevede davvero."},{"title":"Organizza prima di cucinare","text":"Leggi la ricetta, pesa gli ingredienti, prepara gli utensili e distingui i tempi di lavorazione, riposo e cottura. Questa preparazione permette di concentrarsi su consistenza, temperatura e tecnica."},{"title":"Igiene, allergie e sicurezza","text":"Lava mani e superfici, separa gli alimenti crudi da quelli pronti al consumo e rispetta le indicazioni di conservazione. Prima di iscriverti segnala eventuali allergie alimentari e chiedi quali strumenti professionali utilizzerai."}],
    exercise: { title: "Esercizio pratico: prova in autonomia", steps: ["Scegli una ricetta semplice e annota i passaggi in ordine.","Organizza ingredienti e attrezzi prima di iniziare.","Misura separatamente tempi di preparazione e cottura.","Ripeti la ricetta e annota una difficoltà specifica da chiedere al docente."] },
    choose: ["Chiedi se ogni partecipante cucina o assiste soltanto.","Verifica ingredienti, materiali e degustazioni compresi nel prezzo.","Controlla dimensione del gruppo e gestione degli allergeni."],
    links: [{ label: "Cerca corsi e laboratori", href: `${LEARNING_PATH}?disciplina=cucina&q=cucina` }],
  },
  {
    path: `${PASSION_PATH}/stretching-relax-preghiera`,
    title: "Stretching, relax e preghiera: un momento per corpo e spirito", category: "Benessere e spiritualità",
    summary: "Movimento dolce, riposo e un tempo di preghiera cristiana per ritrovare calma e relazione con il Creatore.",
    image: { src: "/images/passion-paths/stretching-relax-preghiera.webp", alt: "Tappetino, Bibbia aperta e un angolo raccolto per relax e preghiera" },
    discover: "Un percorso pratico per iniziare anche senza un corso attivo in zona. Leggi i consigli, prova l'esercizio con ciò che hai e scopri quali domande fare a un insegnante.",
    body: [{"title":"Una pausa senza prestazioni","text":"Scegli un momento breve e uno spazio tranquillo. Muovi delicatamente spalle, braccia e collo senza forzare, senza trattenere il respiro e senza cercare posizioni difficili. Fermati se avverti dolore o malessere."},{"title":"Rilassamento e ascolto del corpo","text":"Cambiare posizione dopo molte ore seduti, camminare a passo comodo e concedersi una pausa possono essere gesti semplici. Se hai limitazioni o dubbi medici chiedi consiglio a un professionista sanitario: questa guida non sostituisce cure o riabilitazione."},{"title":"Preghiera e connessione con Dio Creatore","text":"Per chi vive la fede cristiana, puoi dedicare alcuni minuti a leggere un Salmo, ringraziare Dio per la vita e affidargli le preoccupazioni. La preghiera è relazione sincera con il Creatore, non una tecnica che promette benefici medici. Puoi dire: «Signore, grazie per questo giorno. Guidami nella tua pace e aiutami a prendermi cura del corpo e dello spirito. Amen»."}],
    exercise: { title: "Esercizio pratico: prova in autonomia", steps: ["Trova uno spazio calmo e muovi lentamente spalle e braccia.","Concediti una breve pausa o una passeggiata a ritmo comodo.","Se lo desideri, leggi qualche versetto dei Salmi e parla con Dio in preghiera.","Scrivi una piccola abitudine di cura che vuoi ripetere."] },
    choose: ["Per lo stretching verifica livello, intensità e adattamenti possibili.","Distingui le attività fisiche dalle iniziative spirituali: hanno scopi differenti.","In caso di sintomi o condizioni mediche non sostituire le cure con esercizi o preghiera."],
    links: [{ label: "Cerca corsi e laboratori", href: `${LEARNING_PATH}?disciplina=benessere-movimento&q=stretching` }],
  },
];

export const EDITORIAL_LEARNING_PATHS = [...ORIGINAL_EDITORIAL_PATHS, ...NEW_PASSION_PATHS];

export function findEditorialLearningPath(path: string) {
  return EDITORIAL_LEARNING_PATHS.find((item) => item.path === path);
}
