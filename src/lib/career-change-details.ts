export type CareerChangeDetails = {
 previousExperience: string; transferable: string; toLearn: string;
 project: { title: string; task: string; deliverable: string; check: string; cvExample: string };
 jobTerms: string[]; contexts: string; employerQuestion: string;
};

/** Editorial examples: contexts and search terms are not live job listings. */
export const CAREER_CHANGE_DETAILS: Record<string, CareerChangeDetails> = {
  "diventare-addetto-amministrativo-contabile": {
    "previousExperience": "Vendita, gestione della cassa o ordini",
    "transferable": "Controllo degli importi, precisione e rispetto delle scadenze.",
    "toLearn": "Contabilità, documenti fiscali e uso del gestionale richiedono formazione specifica.",
    "project": {
      "title": "Scadenzario di una piccola attività",
      "task": "In quattro sessioni prepara 20 documenti fittizi, registra incassi e pagamenti, individua tre anomalie e scrivi il passaggio di consegne.",
      "deliverable": "Un foglio di calcolo con formule verificabili, archivio ordinato e una pagina di spiegazione.",
      "check": "I totali tornano e una seconda persona trova ogni documento; distingue cosa puoi correggere da cosa devi segnalare.",
      "cvExample": "Ho costruito uno scadenzario didattico e documentato i controlli sugli importi."
    },
    "jobTerms": [
      "addetto amministrativo junior",
      "impiegato contabile junior",
      "back office amministrativo"
    ],
    "contexts": "Studi professionali, imprese di servizi, attività commerciali e uffici amministrativi.",
    "employerQuestion": "Chiedi quali operazioni svolgerai con affiancamento, quale gestionale usano e che preparazione contabile richiedono."
  },
  "diventare-addetto-paghe-personale": {
    "previousExperience": "Segreteria, gestione turni o amministrazione",
    "transferable": "Gestione dei dati, riservatezza e attenzione alle variazioni.",
    "toLearn": "Normativa, contratti collettivi ed elaborazione paghe non si apprendono dalla sola gestione dei turni.",
    "project": {
      "title": "Un mese di presenze simulato",
      "task": "Distribuisci il lavoro in quattro sessioni: anagrafiche inventate, presenze, variazioni e controllo di due esempi didattici di cedolino con un docente.",
      "deliverable": "Registro delle presenze, checklist e nota sulle anomalie da sottoporre al responsabile.",
      "check": "Ogni variazione è tracciata alla fonte; nessun dato personale reale e nessuna consulenza fiscale improvvisata.",
      "cvExample": "Ho completato una simulazione del ciclo presenze e descritto i controlli prima dell’elaborazione."
    },
    "jobTerms": [
      "addetto paghe junior",
      "payroll assistant",
      "amministrazione del personale junior"
    ],
    "contexts": "Studi di consulenza del lavoro, uffici del personale e società di servizi.",
    "employerQuestion": "Verifica software, supervisione e tipo di contratto: gestione del personale e selezione non sono lo stesso lavoro."
  },
  "diventare-social-media-manager": {
    "previousExperience": "Vendita, accoglienza, scrittura o gestione di una piccola attività",
    "transferable": "Ascolto del cliente, conoscenza del prodotto e comunicazione.",
    "toLearn": "Strategia, misurazione, gestione delle autorizzazioni e advertising richiedono competenze ulteriori.",
    "project": {
      "title": "Una settimana di contenuti per un’attività immaginaria",
      "task": "Prepara un brief, scegli un pubblico, scrivi sei contenuti e realizza due esempi grafici. Definisci poi come valuteresti il risultato.",
      "deliverable": "Calendario, esempi e una pagina con obiettivi e indicatori; usa immagini autorizzate.",
      "check": "Ogni contenuto ha uno scopo e una chiamata all’azione; gli indicatori non sono risultati inventati.",
      "cvExample": "Ho progettato un piano editoriale dimostrativo, collegando pubblico, contenuti e misurazione."
    },
    "jobTerms": [
      "social media assistant",
      "content creator junior",
      "assistente marketing"
    ],
    "contexts": "Agenzie, imprese turistiche, commercio e organizzazioni culturali: contesti da esplorare, non offerte verificate.",
    "employerQuestion": "Chiedi se il ruolo comprende foto, video, pubblicità e disponibilità fuori orario, oltre al calendario dei post."
  },
  "diventare-graphic-designer-digitale": {
    "previousExperience": "Comunicazione, fotografia, disegno o preparazione di materiali per il lavoro",
    "transferable": "Sensibilità visiva, attenzione ai dettagli e capacità di ascoltare un brief.",
    "toLearn": "Tipografia, impaginazione, accessibilità ed esportazione professionale richiedono esercizio.",
    "project": {
      "title": "Identità visiva per un laboratorio immaginario",
      "task": "In quattro sessioni definisci brief e pubblico, costruisci una gerarchia visiva e realizza locandina, post e scheda informativa coerenti.",
      "deliverable": "Tre elaborati, file ordinati e spiegazione delle scelte; indica font e licenze.",
      "check": "I testi sono leggibili anche su mobile e i file sono esportati nel formato corretto, senza risorse prive di licenza.",
      "cvExample": "Ho sviluppato un progetto grafico dimostrativo dal brief alle esportazioni per stampa e digitale."
    },
    "jobTerms": [
      "graphic designer junior",
      "grafico impaginatore",
      "grafico esecutivista"
    ],
    "contexts": "Studi grafici, tipografie, agenzie e uffici comunicazione.",
    "employerQuestion": "Chiedi quali strumenti, formati e lavorazioni sono richiesti: la grafica per stampa e il design di interfacce hanno esigenze diverse."
  },
  "diventare-data-analyst-junior": {
    "previousExperience": "Amministrazione, vendite, magazzino o lavoro su fogli di calcolo",
    "transferable": "Familiarità con indicatori, anomalie e domande operative.",
    "toLearn": "Pulizia dei dati, SQL, statistica di base e visualizzazione vanno appresi e verificati.",
    "project": {
      "title": "Analisi di un piccolo dataset aperto",
      "task": "Scegli dati aperti con licenza chiara, formula tre domande, pulisci i dati e crea due grafici. Documenta limiti e trasformazioni.",
      "deliverable": "File riproducibile, dizionario dei dati e relazione breve con fonti e limiti.",
      "check": "Un’altra persona riproduce i risultati; non confondi correlazione, previsione e causa.",
      "cvExample": "Ho pulito e analizzato un dataset aperto, documentando trasformazioni e limiti delle conclusioni."
    },
    "jobTerms": [
      "data analyst junior",
      "reporting analyst junior",
      "addetto reporting"
    ],
    "contexts": "Aziende di servizi, uffici commerciali, consulenza e organizzazioni che gestiscono dati.",
    "employerQuestion": "Verifica se il ruolo richiede soprattutto Excel e reporting o anche SQL, Python e strumenti di business intelligence."
  },
  "diventare-addetto-back-office-logistico": {
    "previousExperience": "Vendita, assistenza clienti, magazzino o gestione ordini",
    "transferable": "Controllo delle informazioni, comunicazione e gestione delle priorità.",
    "toLearn": "Documenti di trasporto, procedure, gestionali e possibili lingue di lavoro richiedono preparazione.",
    "project": {
      "title": "Dall’ordine alla consegna",
      "task": "Crea dieci ordini fittizi: due incompleti, uno in ritardo e uno con reso. Organizza stati, documenti e comunicazioni in quattro sessioni.",
      "deliverable": "Registro ordini, checklist, due email professionali e un passaggio di consegne.",
      "check": "Ogni ordine ha stato, responsabile e prossima azione; sai spiegare come hai gestito un’eccezione.",
      "cvExample": "Ho simulato il flusso degli ordini e gestito ritardi e resi con un registro delle azioni."
    },
    "jobTerms": [
      "back office logistico",
      "addetto gestione ordini",
      "impiegato logistica junior"
    ],
    "contexts": "Distribuzione, imprese commerciali, trasporti e produzione.",
    "employerQuestion": "Controlla turni, luogo di lavoro, inglese richiesto e separazione tra attività d’ufficio e movimentazione fisica."
  },
  "diventare-estetista": {
    "previousExperience": "Accoglienza, vendita, assistenza alla persona o attività manuali",
    "transferable": "Ascolto, precisione e organizzazione degli appuntamenti.",
    "toLearn": "Le abilità trasferibili non sostituiscono qualifica, pratica supervisionata e requisiti professionali.",
    "project": {
      "title": "Dossier didattico della cabina",
      "task": "Prepara una scheda cliente fittizia, una checklist di igiene e tre schede di osservazione da compilare durante esercitazioni autorizzate dal docente.",
      "deliverable": "Dossier anonimo con correzioni del tutor e distinzione fra osservazione e trattamento eseguito.",
      "check": "Il docente valida il materiale; non presenti come esperienza su clienti una semplice osservazione.",
      "cvExample": "Durante la formazione ho documentato organizzazione della cabina e procedure, con revisione del tutor."
    },
    "jobTerms": [
      "estetista qualificata",
      "estetista apprendista",
      "estetista centro benessere"
    ],
    "contexts": "Centri estetici e strutture benessere; controlla quali titoli richiedono per ciascuna mansione.",
    "employerQuestion": "Prima di candidarti confronta requisiti dell’annuncio e titolo posseduto. Un attestato di tecnica non sostituisce la qualifica."
  },
  "diventare-massaggiatore-benessere": {
    "previousExperience": "Accoglienza, sport non sanitario o lavori manuali",
    "transferable": "Ascolto, cura della postazione e capacità di seguire una procedura.",
    "toLearn": "Anatomia, controindicazioni, pressione e manualità richiedono formazione e correzione del docente.",
    "project": {
      "title": "Diario della pratica supervisionata",
      "task": "Durante il corso registra obiettivi, manovre esercitate e feedback ricevuti. Aggiungi una checklist di accoglienza e dei casi in cui fermarsi.",
      "deliverable": "Diario senza dati personali, validazione del tutor e descrizione corretta dell’ambito benessere.",
      "check": "Nessuna promessa terapeutica; distingui ciò che sai fare da ciò che hai soltanto visto in video.",
      "cvExample": "Ho svolto esercitazioni supervisionate nel massaggio di benessere, documentando procedure e correzioni."
    },
    "jobTerms": [
      "operatore massaggio benessere",
      "operatore olistico",
      "addetto trattamenti benessere"
    ],
    "contexts": "Strutture benessere e operatori del settore: verifica sempre attività effettive e requisiti.",
    "employerQuestion": "Leggi con attenzione gli annunci di spa therapist: possono richiedere una qualifica di estetista o competenze che il corso breve non conferisce."
  },
  "diventare-parrucchiere-acconciatore": {
    "previousExperience": "Vendita, accoglienza, moda o attività manuali",
    "transferable": "Relazione con la clientela, sensibilità visiva e organizzazione.",
    "toLearn": "Titolo professionale, igiene, taglio e colorimetria richiedono un percorso specifico.",
    "project": {
      "title": "Portfolio tecnico su testina",
      "task": "Nelle esercitazioni della scuola prepara una scheda di taglio, documenta divisioni e passaggi e confronta il risultato con il progetto. Chiedi una revisione al docente.",
      "deliverable": "Tre schede con foto autorizzate, strumenti usati e correzioni del tutor.",
      "check": "Il procedimento è ricostruibile; indichi chiaramente che si tratta di esercitazioni, senza trattamenti improvvisati su persone.",
      "cvExample": "Ho documentato esercitazioni di taglio su testina, con schede tecniche e feedback del docente."
    },
    "jobTerms": [
      "acconciatore apprendista",
      "parrucchiere qualificato",
      "assistente di salone"
    ],
    "contexts": "Saloni e imprese di acconciatura; distingui avviamento, lavoro qualificato e responsabilità tecnica.",
    "employerQuestion": "Chiedi mansioni, affiancamento e titolo richiesto. I corsi online collegati servono ad approfondire tecniche, non sostituiscono l’abilitazione."
  }
};
