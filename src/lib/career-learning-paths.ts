/** Editorial study plans. Course associations describe coverage, never a qualification. */
export type CareerStep = { title: string; learn: string; practice: string; check: string };
export type CareerCourse = { slug: string; stages: number[]; coverage: string; limit: string };
export type CareerLearningPath = {
  slug: string; role: string; summary: string; introduction: string;
  startingPoint: string; firstExperiment: string; skills: string[];
  steps: CareerStep[]; portfolio: string[]; applications: string[];
  gaps: string[]; credentials: string; courses: CareerCourse[];
  sources: { label: string; href: string; note: string }[];
};

export const CAREER_PATH_REVIEWED = "2026-10-23";
export const careerPathUrl = (slug: string) => `/idee-e-percorsi/${slug}`;

export const CAREER_LEARNING_PATHS: CareerLearningPath[] = [
{
  "slug": "diventare-estetista",
  "role": "Estetista",
  "summary": "Dalla scelta della qualifica alla pratica supervisionata: costruisci un percorso nel settore estetico e scegli gli aggiornamenti utili.",
  "introduction": "Se vuoi cambiare lavoro e occuparti della cura estetica della persona, parti dal percorso professionale richiesto, prima di acquistare singole tecniche. Accoglienza, precisione, igiene e capacità di ascolto contano quanto la manualità. I corsi brevi collegati in questa pagina sono integrazioni: non costituiscono da soli un percorso per diventare estetista.",
  "startingPoint": "Raccogli titolo di studio, eventuali qualifiche ed esperienza. Chiedi a un ente accreditato in Sardegna quale percorso autorizzato è adatto alla tua situazione, quali requisiti richiede e quale titolo rilascia. Confronta costo totale, pratica in aula, stage, esame e materiali.",
  "firstExperiment": "Visita una scuola e chiedi di osservare una lezione dimostrativa. Prepara una simulazione di accoglienza e organizzazione della postazione, senza eseguire trattamenti su persone. Valuta se ti interessano lavoro di precisione, relazione con la clientela e routine di igiene.",
  "skills": [
    "Igiene e sicurezza",
    "Anatomia e cosmetologia",
    "Manualità supervisionata",
    "Accoglienza e organizzazione della cabina"
  ],
  "steps": [
    {
      "title": "Scegli il percorso di qualifica",
      "learn": "Differenza tra qualifica professionale, specializzazione e attestato di un corso privato.",
      "practice": "Confronta due offerte autorizzate chiedendo gli estremi di riconoscimento e il titolo finale.",
      "check": "La scuola conferma per iscritto accesso, ore, pratica, esame, costo complessivo e finalità del titolo."
    },
    {
      "title": "Costruisci le basi in aula",
      "learn": "Anatomia della pelle, cosmetici, igiene, controindicazioni, preparazione della cabina e limiti del ruolo.",
      "practice": "Segui esercitazioni e protocolli sotto la guida dei docenti, usando i materiali previsti dalla scuola.",
      "check": "Sai motivare la scelta dei prodotti, riconoscere quando non procedere e seguire le procedure senza saltare passaggi."
    },
    {
      "title": "Consolida la pratica supervisionata",
      "learn": "Trattamenti viso e corpo previsti dal programma, cura delle unghie, epilazione e comunicazione con la cliente.",
      "practice": "Documenta esercitazioni e stage autorizzati con una scheda di osservazione, rispettando riservatezza e consenso.",
      "check": "Il tutor verifica manualità, igiene, tempi e capacità di riconoscere i tuoi limiti."
    },
    {
      "title": "Completa il titolo e scegli una specializzazione",
      "learn": "Preparazione all’esame, aggiornamento tecnico, organizzazione degli appuntamenti e presentazione delle competenze.",
      "practice": "Dopo aver verificato i requisiti scegli un corso breve coerente, ad esempio viso o ciglia, evitando acquisti sovrapposti.",
      "check": "Distingui chiaramente nel curriculum qualifica, esperienza supervisionata e attestati privati."
    }
  ],
  "portfolio": [
    "Schede didattiche anonime approvate dal tutor.",
    "Checklist di igiene e preparazione della cabina.",
    "Registro delle esercitazioni con valutazione del docente."
  ],
  "applications": [
    "Valuta centri estetici e strutture benessere verificando titolo richiesto, mansioni e affiancamento.",
    "Prima di aprire un’attività verifica i requisiti professionali e amministrativi con Regione e SUAPE competente."
  ],
  "gaps": [
    "Nel catalogo collegato non è ancora presente un percorso completo di qualifica iniziale verificato: questi corsi non coprono quel passaggio.",
    "Le videolezioni non sostituiscono la pratica supervisionata e l’esame del percorso professionale.",
    "Microblading e PMU richiedono una verifica specifica dei requisiti: non sono una tappa obbligatoria per diventare estetista."
  ],
  "credentials": "L’attività di estetista è disciplinata dalla legge 1/1990. Prima dell’iscrizione verifica con Regione e scuola accreditata il percorso riconosciuto adatto al tuo caso. I corsi tecnici qui collegati non sono presentati come qualifiche abilitanti. Sono escluse dal ruolo le prestazioni con finalità terapeutica.",
  "courses": [
    {
      "slug": "pulizia-viso-oligenesi-online",
      "stages": [
        2,
        4
      ],
      "coverage": "Ripasso del protocollo viso e dell’organizzazione della postazione.",
      "limit": "Videocorso integrativo; non sostituisce la formazione professionale iniziale o la pratica in aula."
    },
    {
      "slug": "extension-ciglia-rcr-sassari-2026",
      "stages": [
        4
      ],
      "coverage": "Approfondimento pratico sulla tecnica ciglia a Sassari.",
      "limit": "Corso breve con quota mensile: concorda calendario e verifica i requisiti per applicare la tecnica professionalmente."
    },
    {
      "slug": "laminazione-ciglia-rcr-sassari-2026",
      "stages": [
        4
      ],
      "coverage": "Una possibile specializzazione sulle ciglia naturali.",
      "limit": "Non è necessario seguire tutte le specializzazioni; scegli in base agli obiettivi e alla preparazione."
    }
  ],
  "sources": [
    {
      "label": "Normattiva — Legge 4 gennaio 1990, n. 1",
      "href": "https://www.normattiva.it/eli/id/1990/01/05/090G0009/CONSOLIDATED",
      "note": "Disciplina dell’attività di estetista; verificare il testo vigente e le disposizioni regionali applicabili."
    }
  ]
},
{
  "slug": "diventare-massaggiatore-benessere",
  "role": "Massaggiatore del benessere",
  "summary": "Anatomia, sicurezza e pratica guidata: orientati nel massaggio non sanitario e scegli una specializzazione coerente.",
  "introduction": "Questo percorso riguarda il massaggio per il benessere, non la riabilitazione o il trattamento di patologie. Prima delle tecniche avanzate servono ascolto, igiene, conoscenza dei limiti e manualità supervisionata. Le singole specializzazioni non equivalgono a una preparazione professionale completa.",
  "startingPoint": "Chiarisci quali servizi vuoi offrire e verifica requisiti, limiti operativi e adempimenti con gli uffici competenti. Confronta programmi con anatomia, controindicazioni e molte esercitazioni corrette dal docente; chiedi esattamente che valore ha l’attestato.",
  "firstExperiment": "Osserva una dimostrazione in una scuola. Simula accoglienza, preparazione della postazione e colloquio iniziale; non improvvisare trattamenti su persone con dolore o problemi di salute.",
  "skills": [
    "Anatomia di base",
    "Igiene e controindicazioni",
    "Postura e manualità",
    "Ascolto e limiti del ruolo"
  ],
  "steps": [
    {
      "title": "Costruisci le basi",
      "learn": "Anatomia, igiene, controindicazioni, ergonomia e differenza tra benessere e prestazione sanitaria.",
      "practice": "Confronta due programmi e prepara una checklist di sicurezza.",
      "check": "Sai spiegare quando fermarti e rinviare a un professionista sanitario."
    },
    {
      "title": "Impara sotto supervisione",
      "learn": "Manovre fondamentali, pressione, ritmo e postura dell’operatore.",
      "practice": "Esercitati in aula con feedback individuale e documenta le correzioni del tutor.",
      "check": "Il docente verifica esecuzione, sicurezza e gestione della seduta."
    },
    {
      "title": "Scegli una tecnica complementare",
      "learn": "Confronta destinatari e prerequisiti di Lomi Lomi, Kobido e altri approfondimenti.",
      "practice": "Scegli un solo corso coerente con la preparazione; Kobido richiede basi già acquisite.",
      "check": "Sai descrivere cosa aggiunge la specializzazione e cosa non copre."
    },
    {
      "title": "Prepara l’ingresso nel lavoro",
      "learn": "Consenso, riservatezza, organizzazione degli appuntamenti e presentazione corretta dei servizi.",
      "practice": "Prepara un portfolio didattico e chiedi a una struttura quali competenze e requisiti richiede.",
      "check": "Non dichiari abilitazioni sanitarie o capacità terapeutiche ottenute da un corso breve."
    }
  ],
  "portfolio": [
    "Registro delle esercitazioni validato dal tutor.",
    "Checklist di igiene, accoglienza e controindicazioni.",
    "Descrizione di una seduta di benessere senza promesse terapeutiche."
  ],
  "applications": [
    "Valuta strutture benessere verificando attività effettive, affiancamento e requisiti.",
    "Prima di lavorare in autonomia verifica il servizio concreto con SUAPE e uffici competenti."
  ],
  "gaps": [
    "I corsi brevi non sostituiscono un percorso completo con pratica supervisionata.",
    "Non sono corsi per diventare fisioterapista, massofisioterapista o massaggiatore capo bagnino."
  ],
  "credentials": "Gli attestati dei corsi collegati non sono qualifiche sanitarie. Il massaggio di benessere va distinto dalle professioni e arti sanitarie elencate dal Ministero della Salute. Verifica separatamente i requisiti se il servizio ricade nell’attività estetica.",
  "courses": [
    {
      "slug": "massaggio-rilassante-drenante-rcr-sassari-2026",
      "stages": [
        1,
        2
      ],
      "coverage": "Introduzione teorico-pratica a Sassari.",
      "limit": "Da concordare ore totali e calendario; quota mensile, non qualifica sanitaria."
    },
    {
      "slug": "massaggio-anticellulite-oligenesi-online",
      "stages": [
        3
      ],
      "coverage": "Integrazione video sulle manualità estetiche.",
      "limit": "Non sostituisce correzione in aula o requisiti per esercitare attività estetica."
    },
    {
      "slug": "massaggio-lomi-lomi-tao-sassari-2026-11-21",
      "stages": [
        3
      ],
      "coverage": "Approfondimento Lomi Lomi a Sassari, aperto anche a principianti.",
      "limit": "Edizione territoriale alternativa: non occorre frequentare tutte le sedi; non copre da sola l’intera preparazione."
    },
    {
      "slug": "massaggio-kobido-tao-sassari-2026-11-07",
      "stages": [
        3
      ],
      "coverage": "Specializzazione viso Kobido a Sassari.",
      "limit": "Richiede preparazione nel massaggio classico svedese; non è il primo corso per chi parte da zero."
    },
    {
      "slug": "massaggio-lomi-lomi-tao-oristano-2026-11-21",
      "stages": [
        3
      ],
      "coverage": "Approfondimento Lomi Lomi a Oristano, aperto anche a principianti.",
      "limit": "Edizione territoriale alternativa: non occorre frequentare tutte le sedi; non copre da sola l’intera preparazione."
    },
    {
      "slug": "massaggio-kobido-tao-oristano-2026-11-07",
      "stages": [
        3
      ],
      "coverage": "Specializzazione viso Kobido a Oristano.",
      "limit": "Richiede preparazione nel massaggio classico svedese; non è il primo corso per chi parte da zero."
    },
    {
      "slug": "massaggio-lomi-lomi-tao-nuoro-2026-11-21",
      "stages": [
        3
      ],
      "coverage": "Approfondimento Lomi Lomi a Nuoro, aperto anche a principianti.",
      "limit": "Edizione territoriale alternativa: non occorre frequentare tutte le sedi; non copre da sola l’intera preparazione."
    },
    {
      "slug": "massaggio-kobido-tao-nuoro-2026-11-07",
      "stages": [
        3
      ],
      "coverage": "Specializzazione viso Kobido a Nuoro.",
      "limit": "Richiede preparazione nel massaggio classico svedese; non è il primo corso per chi parte da zero."
    },
    {
      "slug": "massaggio-lomi-lomi-tao-cagliari-2026-11-21",
      "stages": [
        3
      ],
      "coverage": "Approfondimento Lomi Lomi a Cagliari, aperto anche a principianti.",
      "limit": "Edizione territoriale alternativa: non occorre frequentare tutte le sedi; non copre da sola l’intera preparazione."
    },
    {
      "slug": "massaggio-kobido-tao-cagliari-2026-11-07",
      "stages": [
        3
      ],
      "coverage": "Specializzazione viso Kobido a Cagliari.",
      "limit": "Richiede preparazione nel massaggio classico svedese; non è il primo corso per chi parte da zero."
    }
  ],
  "sources": [
    {
      "label": "Ministero della Salute — Elenco professioni",
      "href": "https://www.salute.gov.it/new/it/tema/professioni-sanitarie/elenco-professioni/",
      "note": "Riferimento per distinguere il percorso benessere dalle professioni e arti sanitarie."
    }
  ]
},
{
  "slug": "diventare-parrucchiere-acconciatore",
  "role": "Parrucchiere e acconciatore",
  "summary": "Dalla formazione riconosciuta alla pratica in salone: scegli le basi prima di specializzarti in taglio, colore o styling.",
  "introduction": "Cambiare lavoro per entrare in salone significa combinare manualità, attenzione alla persona e organizzazione. Il punto di partenza è individuare il percorso professionale riconosciuto adatto alla propria situazione: un video o un seminario non bastano a ottenere l’abilitazione.",
  "startingPoint": "Raccogli titoli ed esperienza e chiedi a un ente accreditato quale percorso autorizzato puoi frequentare. Confronta titolo finale, laboratorio, stage, esame, costo dei materiali e requisiti per il ruolo a cui aspiri.",
  "firstExperiment": "Visita una scuola o osserva una giornata in salone con il consenso del responsabile. Simula accoglienza e preparazione della postazione, senza eseguire colorazioni o trattamenti su persone.",
  "skills": [
    "Igiene e sicurezza",
    "Taglio e styling",
    "Colorimetria",
    "Consulenza e lavoro in salone"
  ],
  "steps": [
    {
      "title": "Verifica il percorso professionale",
      "learn": "Qualifica, abilitazione e requisiti per le diverse responsabilità in salone.",
      "practice": "Richiedi a due scuole gli estremi di riconoscimento e il titolo rilasciato.",
      "check": "Hai conferma scritta di accesso, pratica, esame e costo totale."
    },
    {
      "title": "Impara le basi in laboratorio",
      "learn": "Capello e cuoio capelluto, igiene, strumenti, lavaggio e asciugatura.",
      "practice": "Lavora su testina e nelle esercitazioni autorizzate, sotto guida del docente.",
      "check": "Il tutor verifica postura, ordine e corretto uso degli strumenti."
    },
    {
      "title": "Consolida taglio e colore",
      "learn": "Geometrie di taglio, colorimetria, prodotti e precauzioni.",
      "practice": "Prepara schede tecniche e prove supervisionate documentando il procedimento.",
      "check": "Sai motivare le scelte e riconoscere situazioni da non trattare autonomamente."
    },
    {
      "title": "Passa al lavoro in salone",
      "learn": "Accoglienza, tempi, appuntamenti, collaborazione e aggiornamento.",
      "practice": "Costruisci un portfolio con consenso e cerca opportunità con affiancamento.",
      "check": "Distingui nel curriculum titoli riconosciuti, pratica e seminari privati."
    }
  ],
  "portfolio": [
    "Portfolio di esercitazioni con valutazione del tutor.",
    "Schede tecniche di taglio e colore svolte in formazione.",
    "Checklist di preparazione e riordino."
  ],
  "applications": [
    "Cerca ruoli coerenti con il titolo e verifica mansioni e affiancamento.",
    "Per aprire un salone verifica requisiti e responsabile tecnico con SUAPE e Comune."
  ],
  "gaps": [
    "La formazione online integra la pratica supervisionata e non sostituisce il percorso professionale riconosciuto.",
    "Concorda le date delle dirette e verifica materiali necessari e livello di ingresso."
  ],
  "credentials": "L’attività è disciplinata dalla legge 174/2005. Verifica requisiti professionali e amministrativi con il Comune competente; i corsi privati di aggiornamento non vanno confusi con un percorso riconosciuto abilitante.",
  "courses": [
    {
      "slug": "taglio-donna-serrone-online",
      "stages": [
        3
      ],
      "coverage": "Geometrie, divisioni e forme del taglio donna.",
      "limit": "Aggiornamento tecnico online, non titolo abilitante. Un corso costa 179 € per 6 mesi; valuta il pacchetto con corsi aggiuntivi per evitare acquisti sovrapposti."
    },
    {
      "slug": "colorimetria-serrone-online",
      "stages": [
        3
      ],
      "coverage": "Pigmenti, schiariture e gestione del colore.",
      "limit": "Aggiornamento tecnico online, non titolo abilitante. Un corso costa 179 € per 6 mesi; valuta il pacchetto con corsi aggiuntivi per evitare acquisti sovrapposti."
    },
    {
      "slug": "acconciatura-sposa-serrone-online",
      "stages": [
        4
      ],
      "coverage": "Approfondimento su raccolti e styling sposa.",
      "limit": "Aggiornamento tecnico online, non titolo abilitante. Un corso costa 179 € per 6 mesi; valuta il pacchetto con corsi aggiuntivi per evitare acquisti sovrapposti."
    }
  ],
  "sources": [
    {
      "label": "SardegnaImpresa — Acconciatori",
      "href": "https://www.sardegnaimpresa.eu/it/acconciatori",
      "note": "Quadro degli adempimenti per l’attività in Sardegna."
    },
    {
      "label": "Camera di commercio Nord Sardegna — Imprese artigiane",
      "href": "https://www.ss.camcom.it/servizi-amministrativi-per-le-imprese/imprese-artigiane/albo-imprese-artigiane",
      "note": "Accertamento dei requisiti professionali da parte del Comune."
    }
  ]
},
  {
    slug: "diventare-addetto-amministrativo-contabile",
    role: "Addetto amministrativo contabile",
    summary: "Dalla gestione dei documenti alle prime registrazioni: costruisci le basi per un ruolo operativo in ufficio.",
    introduction: "Se vuoi passare da vendita, accoglienza o assistenza clienti a un lavoro d’ufficio, parti dalle operazioni che permettono a un’azienda di tenere in ordine documenti, incassi e scadenze. L’obiettivo iniziale è saper preparare e controllare il lavoro da sottoporre al responsabile amministrativo. Le procedure cambiano tra aziende: imparare un software senza capire i documenti non basta.",
    startingPoint: "Puoi valorizzare precisione, gestione della cassa, rapporti con i fornitori e rispetto delle scadenze. Prima di scegliere il corso, verifica di saper creare cartelle, usare email e allegati e fare calcoli percentuali. Se queste operazioni sono difficili, dedica prima alcune sessioni alle basi digitali. Titolo di studio ed esperienza richiesti dipendono dal corso e dall’offerta di lavoro.",
    firstExperiment: "Prepara dieci fatture interamente inventate e un elenco di scadenze. Prova ad associare ogni documento al suo pagamento. Se ti interessa trovare e spiegare le incongruenze, hai un primo elemento concreto per valutare questo cambio di lavoro.",
    skills: ["Documenti amministrativi", "Contabilità di base", "Excel e controlli", "Scadenze e riservatezza"],
    steps: [
      { title: "Organizza il lavoro d’ufficio", learn: "Archiviazione, nomi dei file, versioni dei documenti, email professionali e calendario delle scadenze.", practice: "Crea l’archivio mensile di una piccola attività fittizia con cartelle per acquisti, vendite e pagamenti; scrivi una richiesta di documento mancante.", check: "Un’altra persona deve riuscire a trovare un documento senza chiederti dove sia e distinguere una bozza dalla versione approvata." },
      { title: "Comprendi documenti e registrazioni", learn: "Differenza tra preventivo, ordine, fattura e pagamento; basi di contabilità generale, IVA e fatturazione elettronica, con esercitazioni guidate.", practice: "Ricostruisci il percorso di cinque acquisti e cinque vendite e confronta importi, date e documenti di supporto.", check: "Spiega perché un incasso non coincide sempre con un ricavo e segnala i casi da sottoporre a chi supervisiona la contabilità." },
      { title: "Usa il foglio di calcolo per controllare", learn: "Tabelle, filtri, somme condizionali, ricerche e confronto tra elenchi. Prima l’accuratezza, poi la velocità.", practice: "Costruisci uno scadenzario che distingua pagato, da pagare e documento incompleto, usando soltanto dati simulati.", check: "Totali e saldi devono tornare dopo l’aggiunta di nuove righe; documenta come hai individuato un duplicato e un importo errato." },
      { title: "Passa dal caso didattico al flusso aziendale", learn: "Importazione e controllo dei dati in un gestionale, autorizzazioni, tracciabilità delle correzioni e passaggio di consegne.", practice: "Chiedi al docente una prova su un gestionale dimostrativo; descrivi i controlli da fare prima di registrare e prima di chiudere il mese.", check: "Riesci a presentare una lista di anomalie e priorità, senza modificare dati reali o improvvisare una decisione fiscale." },
    ],
    portfolio: ["Archivio con venti documenti fittizi e regole di denominazione.", "Scadenzario con controlli sui duplicati e riconciliazione di un estratto simulato.", "Una pagina che spiega errori trovati, correzioni e punti da far verificare al responsabile."],
    applications: ["Cerca ruoli come segreteria amministrativa, impiegato amministrativo junior e supporto contabile; confronta le mansioni, non solo il titolo.", "Nel CV collega un’esperienza precedente a una prova: gestione della cassa → controllo degli importi; vendita → gestione delle richieste dei clienti.", "Chiedi quali gestionali si usano, se è previsto affiancamento e quali operazioni dovrai svolgere in autonomia."],
    gaps: ["Un’esperienza guidata su un gestionale aziendale e un riscontro sul progetto restano da organizzare.", "Contabilità avanzata, bilancio e adempimenti fiscali richiedono approfondimenti ulteriori. Un corso sulla contabilità degli enti locali non sostituisce la preparazione per un’azienda privata."],
    credentials: "Il percorso prepara a valutare ruoli operativi junior. Un attestato di frequenza non equivale a una qualifica regionale né all’abilitazione da commercialista. Per concorsi e percorsi con qualifica valgono i requisiti del relativo bando.",
    courses: [{ slug: "segreteria-amministrativo-contabile-talentform-online-2026-11-02", stages: [1, 2, 3], coverage: "Segreteria, archivio, contabilità generale, IVA e fatturazione elettronica: una base coerente con le prime tappe.", limit: "Verifica con l’ente la quantità di pratica su Excel e gestionali; non sostituisce l’affiancamento in azienda." }],
    sources: [{ label: "INAPP — Operatore di contabilità", href: "https://www.inapp.gov.it/atlantelavoro/repertorio-nazionale-qualificazioni/profilo/?id_profilo=6293", note: "Riferimento per le competenze del ruolo. La qualificazione descritta appartiene al repertorio lombardo: non attribuisce una qualifica ai corsi qui collegati." }],
  },
  {
    slug: "diventare-addetto-paghe-personale",
    role: "Addetto paghe e amministrazione del personale",
    summary: "Impara a leggere un cedolino, controllare le presenze e lavorare con un software paghe sotto supervisione.",
    introduction: "Questo percorso riguarda il lavoro operativo nell’amministrazione del personale: raccogliere dati corretti, gestire presenze e documenti e partecipare all’elaborazione delle paghe. È diverso dalla selezione del personale e dalla consulenza del lavoro. La cura dei dettagli e la capacità di chiedere una verifica sono importanti quanto il calcolo.",
    startingPoint: "Puoi partire da segreteria, contabilità, gestione dei turni o assistenza ai colleghi. Servono dimestichezza con percentuali e fogli di calcolo, attenzione alla riservatezza e disponibilità ad aggiornarsi. Prima di iscriverti, confronta il livello iniziale richiesto con le tue conoscenze: una specializzazione software può dare per già acquisite le basi del rapporto di lavoro.",
    firstExperiment: "Usa un facsimile didattico di cedolino e un calendario di presenze inventate. Distingui lordo, trattenute e netto e prepara cinque domande da fare a un docente. Non usare buste paga di altre persone come materiale per il portfolio.",
    skills: ["Rapporto di lavoro", "Presenze e cedolino", "Controlli con Excel", "Software paghe"],
    steps: [
      { title: "Capisci il rapporto di lavoro", learn: "Lessico di base di assunzione, orario, contratto collettivo, retribuzione e cessazione; confini del ruolo operativo.", practice: "Prepara una scheda dipendente fittizia con i campi da raccogliere e una lista di documenti da verificare con il responsabile.", check: "Sai riconoscere le informazioni mancanti senza scegliere autonomamente un inquadramento o fornire consulenza." },
      { title: "Collega presenze e cedolino", learn: "Elementi della retribuzione, assenze, contributi e aspetti fiscali, seguendo esempi aggiornati spiegati dal docente.", practice: "Confronta due mesi simulati con ferie e assenze differenti e annota quali dati cambiano nel cedolino.", check: "Spiega le differenze tra i due casi e distingui un errore di input da una regola che richiede una verifica specialistica." },
      { title: "Esercitati su un software paghe", learn: "Anagrafiche, inserimento presenze, elaborazione assistita e controlli degli output in un ambiente dimostrativo.", practice: "Completa un ciclo mensile didattico e conserva una checklist dei controlli. Se il corso non include accesso pratico al software, cerca un laboratorio aggiuntivo.", check: "Riesci a ricostruire l’origine di una variazione e a rifare il controllo dopo una correzione, senza intervenire su posizioni reali." },
      { title: "Organizza chiusura e comunicazioni", learn: "Scadenze, gestione degli accessi, protezione dei documenti e comunicazione di un’anomalia al referente.", practice: "Simula il passaggio di consegne di fine mese con stato delle lavorazioni, problemi aperti e destinatari autorizzati.", check: "Il destinatario capisce cosa è stato completato, cosa deve validare e quali informazioni non vanno inoltrate." },
    ],
    portfolio: ["Registro presenze inventato e due cedolini esclusivamente didattici commentati.", "Checklist del ciclo mensile con punti di controllo e approvazione.", "Breve relazione su un’anomalia simulata e su come l’hai segnalata."],
    applications: ["Cerca addetto paghe junior, payroll assistant o amministrazione del personale junior, verificando l’affiancamento previsto.", "Indica il software realmente usato in esercitazione e il tipo di prova completata; non dichiarare esperienza professionale per una simulazione.", "Se ti interessa soprattutto il recruiting, valuta un percorso risorse umane distinto: non è la stessa specializzazione."],
    gaps: ["La pratica supervisionata su un ciclo paghe completo va concordata con docente o datore di lavoro.", "Norme, contratti e software cambiano: pianifica aggiornamento e revisione degli esempi prima di usarli in un contesto reale."],
    credentials: "Questa guida non prepara all’abilitazione da consulente del lavoro. L’accesso a quella professione segue un percorso distinto con requisiti di studio, pratica, esame di Stato e iscrizione all’Albo. I corsi collegati non sostituiscono tali passaggi.",
    courses: [
      { slug: "ufficio-personale-busta-paga-cfa-online-2026-10-28", stages: [1, 2], coverage: "Rapporto di lavoro, retribuzione ed esercitazioni sul cedolino: una possibile base iniziale.", limit: "Edizione alternativa a quella di novembre; non serve frequentarle entrambe. Chiedi quale software è previsto." },
      { slug: "ufficio-personale-busta-paga-cfa-online-2026-11-04", stages: [1, 2], coverage: "Un’altra edizione del percorso CFA per le basi dell’amministrazione del personale.", limit: "Alternativa all’edizione di ottobre, da scegliere in base a calendario e ammissione." },
      { slug: "paghe-zucchetti-talentform-online-2026-11-05", stages: [2, 3], coverage: "Percorso paghe con riferimento al software Zucchetti, utile per collegare teoria e strumento.", limit: "Confronta il programma con il corso di base per evitare sovrapposizioni; verifica accesso pratico e prerequisiti con l’ente." },
    ],
    sources: [
      { label: "INAPP — Operatore specializzato paghe e contributi", href: "https://www.inapp.gov.it/atlantelavoro/repertorio-nazionale-qualificazioni/profilo/?id_profilo=9252", note: "Riferimento alle competenze operative; profilo del repertorio siciliano, non una qualifica riconosciuta ai corsi elencati." },
      { label: "Consiglio nazionale dei consulenti del lavoro — Accesso alla professione", href: "https://www.cnoconsulentidellavoro.it/component/k2/accesso-alla-professione", note: "Per distinguere il ruolo operativo dal percorso professionale regolamentato." },
    ],
  },
  {
    slug: "diventare-social-media-manager",
    role: "Social media manager",
    summary: "Trasforma la familiarità con i social in un metodo: obiettivi, contenuti, relazione con il pubblico e misurazione.",
    introduction: "Pubblicare spesso non è ancora gestire la comunicazione di un’attività. Il cambio di carriera richiede di saper capire un obiettivo, scegliere a chi parlare, organizzare il lavoro e spiegare i risultati. Parti da un progetto piccolo e verificabile: un’attività locale, un’associazione o un marchio inventato, senza promettere aumenti di vendite che non puoi dimostrare.",
    startingPoint: "Esperienza nella vendita, nella scrittura, nell’accoglienza o nella fotografia può essere utile, ma va collegata a un metodo. Prova a scrivere testi chiari, usare un foglio di calcolo e distinguere un’opinione da un dato. Non occorrono molti follower per iniziare a studiare: occorrono capacità di analisi, continuità e rispetto di immagini, persone e accessi agli account.",
    firstExperiment: "Scegli un’attività fittizia in Sardegna e descrivi un solo pubblico e un solo obiettivo. Scrivi tre post con funzioni diverse: informare, rispondere a un dubbio e invitare a un’azione. Spiega perché ciascuno dovrebbe essere utile a quel pubblico.",
    skills: ["Strategia editoriale", "Scrittura e contenuti", "Community", "Analisi dei risultati"],
    steps: [
      { title: "Definisci obiettivo e pubblico", learn: "Brief, proposta di valore, bisogni del pubblico, scelta dei canali e differenza tra comunicazione organica e pubblicitaria.", practice: "Raccogli cinque domande tipiche dei clienti e confronta la comunicazione di tre attività simili senza copiarne testi o immagini.", check: "Riesci a motivare la scelta di un canale e di un obiettivo concreto, invece di dire che devi essere presente ovunque." },
      { title: "Costruisci un piano editoriale", learn: "Temi ricorrenti, tono di voce, scrittura, formati, accessibilità dei contenuti e organizzazione delle approvazioni.", practice: "Prepara un calendario di quattro settimane con dodici contenuti, incluse bozze di testo, immagini utilizzabili e indicazioni per un breve video.", check: "Ogni contenuto ha destinatario, scopo e azione attesa. Puoi realizzarlo con il tempo e le risorse disponibili." },
      { title: "Gestisci contenuti e conversazioni", learn: "Programmazione, moderazione, gestione delle richieste e passaggio dei problemi a chi può risolverli. Usa l’IA come supporto da verificare.", practice: "Simula cinque risposte a richieste o critiche e prepara una procedura per autorizzazioni, password e approvazione delle bozze.", check: "Sai riconoscere una risposta che richiede consenso del cliente e correggere un contenuto generato dall’IA che inventa fatti." },
      { title: "Leggi i risultati e proponi un miglioramento", learn: "Indicatori coerenti con l’obiettivo, lettura di un report e differenza tra risultati organici, pubblicitari e conversioni.", practice: "Crea un report con dati simulati chiaramente dichiarati e formula due ipotesi da testare il mese successivo.", check: "Distingui ciò che i dati mostrano da ciò che non puoi concludere. Non confondi visualizzazioni, contatti e vendite." },
    ],
    portfolio: ["Brief di una pagina e calendario editoriale di quattro settimane.", "Sei contenuti finiti, con motivazione delle scelte e fonti delle immagini.", "Report dimostrativo con dati dichiarati come simulati, limiti e proposta di miglioramento."],
    applications: ["Confronta annunci per social media assistant, content creator junior e social media manager junior: produzione video, advertising e strategia possono essere ruoli diversi.", "Presenta un caso completo invece di una raccolta di post senza contesto. Indica cosa hai fatto personalmente e cosa è una simulazione.", "Prima di accettare un incarico chiarisci numero di canali, produzione dei materiali, approvazioni, assistenza clienti e budget pubblicitario."],
    gaps: ["Un progetto reale con obiettivi concordati e dati leggibili resta da costruire; i risultati di una simulazione non dimostrano efficacia commerciale.", "Gestione avanzata delle inserzioni e tracciamento delle conversioni richiedono pratica dedicata. I budget pubblicitari non sono inclusi automaticamente nei corsi."],
    credentials: "Questi corsi sono opportunità formative e non garantiscono un impiego o l’autonomia su ogni attività di marketing. Valuta programma, esercitazioni e feedback oltre all’attestato. Il progetto deve rendere visibili capacità e limiti.",
    courses: [
      { slug: "social-media-manager-ia-forit-online-2026-10-26", stages: [1, 2, 3, 4], coverage: "Strategie social, contenuti, campagne e impiego dell’IA: un possibile percorso iniziale.", limit: "Alternativa al percorso Talentform; verifica esercitazioni e approfondimento della misurazione nel programma dell’ente." },
      { slug: "social-media-content-creator-talentform-online-2026-10-26", stages: [1, 2, 3], coverage: "Preparazione social media e content creation, da confrontare con il tuo progetto.", limit: "Non va sommato automaticamente a un altro corso di base equivalente. Le campagne reali richiedono autorizzazioni e budget separati." },
      { slug: "comunicazione-contenuti-digitali-cfa-online-2026-11-18", stages: [2, 3], coverage: "Comunicazione e produzione di contenuti digitali, utile per consolidare la parte editoriale.", limit: "Copre una parte del percorso; non dimostra da solo competenze di strategia o advertising avanzato." },
    ],
    sources: [{ label: "INAPP — Social Media Manager", href: "https://www.inapp.gov.it/atlantelavoro/repertorio-nazionale-qualificazioni/profilo/?id_profilo=13678", note: "Riferimento alle competenze di comunicazione e relazione con il pubblico. Profilo lombardo; il piano di esercitazioni è una proposta editoriale EVERAS." }],
  },
  {
    slug: "diventare-graphic-designer-digitale",
    role: "Graphic designer digitale",
    summary: "Dal brief a un progetto coerente: studia composizione, tipografia, strumenti e preparazione dei file.",
    introduction: "Se vuoi cambiare lavoro attraverso la creatività, impara prima a risolvere un problema di comunicazione visiva. Conoscere un programma o produrre immagini con l’IA non basta a costruire un’identità chiara e leggibile. Un primo obiettivo concreto è realizzare materiali coordinati per una piccola attività, motivando le scelte e consegnando file utilizzabili.",
    startingPoint: "Puoi valorizzare sensibilità visiva, fotografia, illustrazione o conoscenza di un settore, ma servono anche organizzazione e disponibilità a rivedere il lavoro. Verifica il computer richiesto dai software, eventuali licenze e il budget per lo studio. Illustrazione, grafica editoriale, web design e modellazione 3D sono specializzazioni diverse: scegline una prima di accumulare corsi.",
    firstExperiment: "Progetta un volantino per un laboratorio inventato usando solo testo e forme semplici. Prepara due versioni con gerarchie diverse e chiedi a tre persone di trovare subito titolo, data e azione richiesta. Usa le risposte per scegliere la versione più chiara.",
    skills: ["Brief e composizione", "Tipografia e colore", "Strumenti grafici", "File e presentazione"],
    steps: [
      { title: "Allena le basi visive", learn: "Gerarchia, allineamenti, spazi, contrasto, colore e leggibilità. Analizza progetti spiegando le scelte, senza limitarti a dire se ti piacciono.", practice: "Rifai lo stesso avviso in tre composizioni e costruisci una piccola guida di caratteri, colori e spaziature.", check: "Le informazioni restano leggibili anche in piccolo e le scelte rispondono al contenuto, non soltanto al gusto personale." },
      { title: "Impara gli strumenti adatti all’output", learn: "Differenza tra immagini raster, vettori e impaginazione; gestione delle dimensioni, dei file sorgente e delle risorse con licenza.", practice: "Produci un elemento vettoriale, un’immagine elaborata e una pagina impaginata, seguendo esercizi revisionati da un docente.", check: "Sai scegliere lo strumento, ritrovare i file modificabili e dichiarare da dove provengono immagini e caratteri." },
      { title: "Sviluppa un sistema coordinato", learn: "Traduzione di un brief in proposta visiva, coerenza tra formati e presentazione di alternative motivate.", practice: "Crea per un marchio fittizio una locandina, tre contenuti social e un pieghevole o un documento breve.", check: "I materiali appartengono alla stessa identità e funzionano nei rispettivi formati, senza essere semplici ridimensionamenti." },
      { title: "Prepara consegna e portfolio", learn: "Esportazione per schermo e stampa, organizzazione dei sorgenti, verifica tecnica e gestione delle revisioni.", practice: "Prepara una cartella di consegna con anteprime, file finali e note; fai revisionare il progetto e documenta almeno una correzione.", check: "Chi riceve i materiali sa quale file usare e per cosa. Distingui il tuo contributo da template, risorse esterne e strumenti generativi." },
    ],
    portfolio: ["Un caso completo dal brief agli elaborati, con due alternative e motivazione della scelta.", "Un progetto coordinato per schermo e stampa, con prove di leggibilità.", "Una pagina di processo che mostri revisione, file consegnati e licenze delle risorse."],
    applications: ["Per ruoli di grafico junior prepara pochi casi curati e pertinenti all’attività dell’azienda o dello studio.", "Se l’annuncio richiede impaginazione, mostra pagine e griglie; se richiede contenuti digitali, mostra adattamenti e materiali per schermo.", "Chiedi chi segue stampa e verifica finale, quali software sono richiesti e come vengono gestite le revisioni."],
    gaps: ["Il corso introduttivo di grafica e marketing non copre automaticamente una preparazione completa al design.", "Servono esercitazioni revisionate su tipografia e strumenti. Il laboratorio editoriale è un approfondimento successivo; non sostituisce le basi e ha un calendario distinto."],
    credentials: "Un attestato non rende equivalenti grafica, illustrazione e progettazione di interfacce. Scegli in base ai lavori che vuoi saper produrre e alla possibilità di ricevere revisioni. Verifica separatamente eventuali qualifiche dichiarate dall’ente e i costi delle licenze.",
    courses: [
      { slug: "grafica-digital-marketing-ia-forit-online-2026-11-03", stages: [1, 2, 3], coverage: "Introduzione alla comunicazione visiva e ai contenuti digitali nel contesto del marketing.", limit: "Percorso ampio, non una scuola completa di graphic design: chiedi software, ore di laboratorio e tipo di revisioni." },
      { slug: "grafica-editoriale-carol-rollo-cagliari-2027-04-06", stages: [3, 4], coverage: "Approfondimento di grafica editoriale in presenza a Cagliari, per lavorare su composizione e impaginazione.", limit: "Specializzazione da valutare dopo le basi; controlla livello di ingresso, materiali e calendario della scheda." },
    ],
    sources: [{ label: "INAPP — Tecnico grafico", href: "https://www.inapp.gov.it/atlantelavoro/repertorio-nazionale-qualificazioni/profilo/?id_profilo=13719", note: "Riferimento per competenze di progettazione ed esecuzione. Profilo del repertorio veneto; non certifica i corsi qui associati." }],
  },
  {
    slug: "diventare-data-analyst-junior",
    role: "Data analyst junior",
    summary: "Parti da una domanda, pulisci i dati e costruisci un’analisi che un’altra persona possa verificare.",
    introduction: "Se ti piace capire perché un risultato cambia, l’analisi dei dati può essere un percorso da esplorare. Il punto di partenza non è un grafico spettacolare: è una domanda utile, un insieme di dati controllato e un ragionamento riproducibile. Il primo traguardo è un piccolo progetto completo da discutere in una candidatura junior, senza confondere una prima preparazione con l’esperienza di un analista autonomo.",
    startingPoint: "Esperienza in vendite, amministrazione, logistica o controllo delle attività può aiutarti a formulare domande sensate. Verifica le basi di percentuali, medie e fogli di calcolo. Se inizi da zero, non studiare contemporaneamente tutti gli strumenti: prima tabelle e controlli, poi interrogazioni e automazione. Leggere documentazione tecnica, anche in inglese, diventa progressivamente utile.",
    firstExperiment: "Crea un foglio con vendite simulate di tre prodotti per tre mesi. Rispondi a una domanda precisa, per esempio quale prodotto cresce di più, indicando come gestisci prezzi diversi e righe mancanti. Mostra anche un caso in cui la prima impressione era sbagliata.",
    skills: ["Pulizia e qualità dei dati", "Excel e SQL", "Python", "Visualizzazione e spiegazione"],
    steps: [
      { title: "Formula la domanda e controlla i dati", learn: "Unità di analisi, tipi di variabile, valori mancanti, duplicati, medie e percentuali. Documenta origine e limiti del dataset.", practice: "Scegli dati pubblici con licenza compatibile o dati inventati; crea un dizionario delle colonne e un registro delle correzioni.", check: "Sai spiegare cosa rappresenta ogni riga e quali domande quei dati non permettono di affrontare." },
      { title: "Analizza con un foglio di calcolo", learn: "Tabelle, filtri, formule, ricerche e aggregazioni; confronto dei risultati con controlli indipendenti.", practice: "Prepara un’analisi mensile con tabella riepilogativa e tre indicatori definiti in modo esplicito.", check: "L’analisi si aggiorna con un nuovo mese senza correzioni manuali nascoste e i totali tornano con il dato di partenza." },
      { title: "Aggiungi SQL e Python in modo progressivo", learn: "Interrogazioni e unioni tra tabelle con SQL; lettura, pulizia e riepilogo dei dati con Python. Sono strumenti complementari, non nomi da aggiungere al CV.", practice: "Ripeti una parte dell’analisi con uno script e documenta come eseguirlo. Esercitati su filtri e aggregazioni SQL in un ambiente didattico.", check: "Un’altra persona riesce a riprodurre il risultato e una modifica ai dati non rompe silenziosamente il processo." },
      { title: "Visualizza e spiega una decisione", learn: "Scelta dei grafici, indicatori, dashboard e comunicazione dei limiti. Power BI è una possibile estensione, da scegliere in base ai ruoli cercati.", practice: "Produci una pagina con tre visualizzazioni, una conclusione e una domanda ancora aperta; chiedi a una persona non tecnica di leggerla.", check: "Sai distinguere un’associazione da una spiegazione causale e proporre una verifica successiva, senza sostenere più di quanto mostrano i dati." },
    ],
    portfolio: ["Dataset documentato e registro di pulizia con controlli prima e dopo.", "Foglio di analisi e script riproducibile con istruzioni, senza dati personali.", "Report di una pagina che risponda alla domanda iniziale, esponga limiti e suggerisca una verifica."],
    applications: ["Confronta data analyst junior, reporting assistant e supporto business intelligence: SQL, Python e dashboard non hanno lo stesso peso in ogni annuncio.", "Pubblica un progetto leggibile con domanda, dati, metodo e risultati; indica esplicitamente i dati simulati.", "Durante un colloquio preparati a spiegare un errore trovato e una scelta di pulizia, oltre al grafico finale."],
    gaps: ["Il corso collegato riguarda Excel e Python: non attribuiamo al programma un modulo SQL o Power BI che non abbiamo verificato.", "Per SQL, statistica applicata e dashboard serve uno studio aggiuntivo con esercitazioni. Le risorse Microsoft Learn sono esterne al catalogo EVERAS e non sostituiscono automaticamente un corso completo."],
    credentials: "Il percorso è una base di orientamento per ruoli junior. Un attestato di frequenza non equivale a una laurea, a una certificazione Microsoft o a una garanzia di assunzione. Eventuali esami di certificazione hanno requisiti e condizioni proprie.",
    courses: [{ slug: "data-analyst-excel-python-talentform-online-2026-10-29", stages: [1, 2, 3], coverage: "Organizzazione e analisi dei dati con Excel e Python, da usare come base per un progetto.", limit: "Per la tappa 3 copre la parte Python; SQL e Power BI restano da integrare. Chiedi livello di ingresso e modalità di revisione degli esercizi." }],
    sources: [
      { label: "Microsoft Learn — Percorso professionale analista dei dati", href: "https://learn.microsoft.com/it-it/training/career-paths/data-analyst", note: "Riferimento alle attività del ruolo e risorsa di studio esterna, con particolare attenzione agli strumenti Microsoft." },
      { label: "Microsoft Learn — Preparare i dati per l’analisi con Power BI", href: "https://learn.microsoft.com/it-it/training/paths/prepare-data-power-bi/", note: "Integrazione facoltativa per la preparazione dei dati in Power BI; non è un corso del catalogo EVERAS." },
    ],
  },
  {
    slug: "diventare-addetto-back-office-logistico",
    role: "Addetto back office logistico e gestione ordini",
    summary: "Impara a seguire un ordine, controllare i dati e coordinare informazioni tra clienti, fornitori e magazzino.",
    introduction: "Questo percorso riguarda l’ufficio che tiene insieme ordini, disponibilità e comunicazioni operative. Può interessarti se provieni da vendita, magazzino o assistenza clienti e vuoi lavorare di più su dati e organizzazione. Il primo obiettivo è seguire correttamente un ordine e segnalare un problema in tempo, non dirigere una supply chain dopo un solo corso.",
    startingPoint: "Valorizza conoscenza dei prodotti, gestione delle richieste e attenzione ai tempi. Servono basi digitali, precisione nei codici e capacità di scrivere messaggi chiari. L’inglese può essere importante per clienti e fornitori esteri, ma il livello richiesto dipende dal ruolo. Se vuoi guidare mezzi o lavorare nella movimentazione fisica, verifica separatamente i requisiti di quell’attività.",
    firstExperiment: "Simula cinque ordini con quantità, disponibilità e date richieste diverse. Prepara un elenco delle priorità e un messaggio al cliente quando un articolo non è disponibile. Valuta se ti piace gestire informazioni che cambiano senza perdere i controlli.",
    skills: ["Ciclo dell’ordine", "Excel e dati", "Documenti e scadenze", "Comunicazione operativa"],
    steps: [
      { title: "Ricostruisci il ciclo dell’ordine", learn: "Passaggi da richiesta e conferma a preparazione, spedizione e consegna; ruoli di cliente, fornitore, ufficio e magazzino.", practice: "Disegna il flusso di un ordine fittizio e indica quali dati e autorizzazioni servono a ogni passaggio.", check: "Sai riconoscere chi deve aggiornare un’informazione e quando un ordine non può avanzare per dati mancanti." },
      { title: "Controlla anagrafiche e quantità", learn: "Codici articolo, unità di misura, quantità, disponibilità e fogli di controllo con filtri e ricerche.", practice: "Costruisci un registro di venti ordini con errori intenzionali: un codice duplicato, un indirizzo incompleto e una quantità non coerente.", check: "Trovi gli errori prima della consegna e puoi spiegare come prevenire la loro ripetizione, senza cambiare il dato originale senza traccia." },
      { title: "Gestisci comunicazioni e imprevisti", learn: "Stato dell’ordine, documenti di accompagnamento, priorità e comunicazioni a clienti e fornitori; lessico operativo in inglese quando necessario.", practice: "Simula un ritardo, una consegna parziale e una richiesta urgente; per ciascun caso scrivi aggiornamento, responsabile e prossima verifica.", check: "Distingui una data confermata da una stima e comunichi il problema senza promettere una soluzione non autorizzata." },
      { title: "Lavora su un flusso condiviso", learn: "Uso di un gestionale dimostrativo, passaggio di consegne e controlli sui tempi; riservatezza e limiti di accesso ai dati.", practice: "Prepara un riepilogo giornaliero con ordini aperti, anomalie e azioni; chiedi una revisione a chi conosce il settore.", check: "Un collega può riprendere il lavoro dal tuo riepilogo e capire quali dati sono affidabili e quali devono essere confermati." },
    ],
    portfolio: ["Mappa del ciclo dell’ordine con responsabilità e controlli.", "Registro di venti ordini simulati, anomalie rilevate e correzioni documentate.", "Tre messaggi operativi e un riepilogo di fine giornata, tutti con dati inventati."],
    applications: ["Cerca back office logistico junior, gestione ordini e customer service logistico, confrontando presenza in sede, turni e competenze richieste.", "Rendi visibile il collegamento tra la tua esperienza e il flusso: vendita → richieste clienti; magazzino → codici e disponibilità.", "Chiedi quale gestionale si usa, che affiancamento è previsto e se il ruolo riguarda solo l’ufficio o anche attività operative distinte."],
    gaps: ["L’utilizzo di uno specifico gestionale e le procedure dell’azienda vanno imparati con esercitazioni o affiancamento.", "Import-export, dogane e acquisti sono specializzazioni ulteriori: il corso complementare non è obbligatorio per ogni ruolo logistico."],
    credentials: "La formazione di back office non abilita alla guida di carrelli elevatori o di altri mezzi. L’attestato del corso non va presentato come patentino né come qualifica da responsabile logistico. Verifica eventuali requisiti specifici della mansione prima di candidarti.",
    courses: [
      { slug: "back-office-logistico-ordini-talentform-online-2026-11-02", stages: [1, 2, 3], coverage: "Logistica, ordini, dati, Excel e rapporti con clienti e fornitori: il corso più direttamente collegato al percorso.", limit: "La pratica su un gestionale specifico e le procedure di una singola azienda restano da verificare." },
      { slug: "acquisti-import-export-inglese-talentform-online-2026-11-03", stages: [3], coverage: "Approfondimento complementare per chi mira a uffici acquisti e rapporti internazionali.", limit: "Non è necessario per tutti i ruoli e può sovrapporsi nel calendario al corso di base: scegli in base all’obiettivo." },
    ],
    sources: [{ label: "INAPP — Esplora le professioni", href: "https://www.inapp.gov.it/atlantelavoro/esplora/", note: "Riferimento alla distinzione tra gestione amministrativa della logistica, acquisti, magazzini e trasporti. Il piano pratico è una proposta editoriale EVERAS." }],
  },
];

export function findCareerLearningPath(slug: string) {
  return CAREER_LEARNING_PATHS.find((path) => path.slug === slug);
}
