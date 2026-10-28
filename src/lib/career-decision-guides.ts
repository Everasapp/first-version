export const DECISION_GUIDES_PATH = "/idee-e-percorsi/guide";
export const DECISION_GUIDES_REVIEWED = "2026-10-28";
export type DecisionGuide = {slug: string; title: string; summary: string; introduction: string; sections: {title: string; text: string}[]; checklist: string[]; exercise: string; sources: {label: string; href: string}[]};
export const DECISION_GUIDES: DecisionGuide[] = [
  {
    "slug": "cambiare-lavoro-dopo-40-50-anni",
    "title": "Cambiare lavoro dopo i 40 o 50 anni: come valutare un percorso",
    "summary": "Valuta obiettivo, competenze, tempo e sostenibilità prima di scegliere un corso.",
    "introduction": "Avere esperienza non significa dover restare nello stesso mestiere. Ma cambiare lavoro richiede una scelta concreta: quale ruolo vuoi raggiungere, cosa puoi già dimostrare e quale preparazione ti manca? L’età da sola non risponde a queste domande. Una buona valutazione parte dalla tua situazione, senza promesse di assunzione rapida.",
    "sections": [
      {
        "title": "Definisci il cambiamento che cerchi",
        "text": "Vuoi lasciare il settore, cambiare mansioni o rendere il lavoro compatibile con nuove esigenze? Scrivi tre condizioni indispensabili: luogo, orari, tipo di attività. Distingui queste condizioni dalle preferenze. Un ruolo interessante può non essere sostenibile se richiede trasferimenti o turni che non puoi seguire."
      },
      {
        "title": "Parti dalle prove della tua esperienza",
        "text": "Per ogni lavoro o attività precedente annota un compito, il problema affrontato e il risultato osservabile. Gestire appuntamenti, controllare ordini o spiegare un servizio possono offrire punti di partenza. Non equivalgono automaticamente alle competenze del nuovo mestiere: individua cosa trasferisci e cosa devi studiare."
      },
      {
        "title": "Confronta due alternative reali",
        "text": "Leggi almeno tre annunci recenti per ciascun ruolo. Annota titoli richiesti, strumenti, esperienza e sede. Non scegliere soltanto dal nome del corso: confronta il programma con le attività effettive. Per le professioni regolamentate verifica il percorso riconosciuto prima di acquistare specializzazioni."
      },
      {
        "title": "Calcola il costo completo",
        "text": "Somma quota del corso, materiali, esami, trasporti e tempo di studio. Valuta anche il reddito necessario durante la transizione e la compatibilità con gli impegni. Se ricevi sostegni economici, verifica gli obblighi con il servizio competente: il corso non modifica da solo le relative regole."
      },
      {
        "title": "Fai una prova prima di impegnarti",
        "text": "Un colloquio con la scuola, un esercizio introduttivo o una visita concordata possono aiutarti a verificare l’interesse. Definisci una data per riesaminare la scelta e quali informazioni ti mancano. Puoi decidere di procedere, cambiare formula o rimandare: il primo corso disponibile non è necessariamente il migliore per te."
      }
    ],
    "checklist": [
      "Ho scelto un ruolo preciso, non solo un settore.",
      "Conosco i requisiti e le competenze da integrare.",
      "Ho confrontato almeno due percorsi.",
      "Il calendario è compatibile con la mia vita.",
      "Ho un limite di spesa e una data di rivalutazione."
    ],
    "exercise": "Compila due colonne per due professioni: competenze già dimostrabili, preparazione mancante, tempi, costi e primo esperimento. Scegli la prossima azione che riduce un dubbio, non quella che richiede subito una spesa.",
    "sources": [
      {
        "label": "National Careers Service — Gestire la carriera nelle fasi successive della vita",
        "href": "https://nationalcareers.service.gov.uk/managing-your-career-later-in-life"
      },
      {
        "label": "Europass — Pianifica la tua carriera",
        "href": "https://europass.europa.eu/it/plan-your-career"
      }
    ]
  },
  {
    "slug": "qualifica-abilitazione-certificazione-attestato",
    "title": "Qualifica, abilitazione, certificazione e attestato: cosa cambia",
    "summary": "Capisci cosa documenta il titolo di un corso e quali verifiche fare prima di iscriverti.",
    "introduction": "La parola “certificato” non basta per capire il valore di un corso. Occorre sapere chi rilascia il documento, che cosa valuta e per quale utilizzo è riconosciuto. Titoli con nomi simili possono avere effetti diversi. Questa guida aiuta a formulare le domande giuste, senza sostituire la verifica della specifica professione.",
    "sections": [
      {
        "title": "Qualifica: cerca il riferimento preciso",
        "text": "Una qualificazione riconosciuta si collega a un sistema pubblico e a risultati di apprendimento definiti. INAPP permette di consultare il Repertorio nazionale delle qualificazioni. Chiedi denominazione, repertorio, autorità competente ed estremi del riconoscimento. L’accreditamento generale di una scuola non dimostra, da solo, il riconoscimento di ogni suo corso."
      },
      {
        "title": "Abilitazione: verifica che cosa consente di esercitare",
        "text": "Per alcune attività la normativa richiede requisiti professionali specifici. Un corso può preparare a un passaggio del percorso senza conferire da solo il diritto di esercitare. Chiedi quale attività intendi svolgere e verifica con l’autorità competente quali titoli, esami o altri adempimenti servono. Non esiste una risposta unica valida per tutti i mestieri."
      },
      {
        "title": "Certificazione: chiedi chi certifica e rispetto a quale standard",
        "text": "La certificazione delle competenze nel sistema pubblico segue procedure e soggetti titolati. Esistono inoltre certificazioni di prodotto, linguistiche o private con finalità diverse. Un badge digitale o un certificato di completamento non diventano automaticamente una qualifica pubblica: chiedi standard, ente emittente, modalità di valutazione ed eventuale scadenza."
      },
      {
        "title": "Attestato: leggi ciò che dimostra",
        "text": "Può documentare presenza, completamento o superamento di una verifica. È utile per descrivere la formazione svolta, ma il suo effetto dipende dal percorso e dalla disciplina applicabile. Anche il solo nome “attestato” non permette di attribuire o escludere valore legale: occorre esaminare il documento preciso."
      },
      {
        "title": "Confronta il titolo con il tuo obiettivo",
        "text": "Se vuoi aggiornare una tecnica, un corso privato può essere pertinente. Se ti serve un requisito per lavorare o partecipare a una selezione, confronta il titolo richiesto con quello rilasciato. Non dedurre equivalenze dalla durata, dal prezzo o da espressioni promozionali come “riconosciuto ovunque”."
      }
    ],
    "checklist": [
      "Ho la denominazione esatta del documento finale.",
      "So chi lo emette e quale verifica è prevista.",
      "Ho verificato il riferimento pubblico o lo standard dichiarato.",
      "So se serve un esame o un percorso ulteriore.",
      "Ho una conferma scritta dell’utilizzo che mi interessa."
    ],
    "exercise": "Prima di pagare invia alla scuola: “Quale documento riceverò? Qual è il riferimento del riconoscimento? Questo titolo soddisfa il requisito per l’attività che intendo svolgere? Quali passaggi restano?” Conserva programma e risposta.",
    "sources": [
      {
        "label": "INAPP — Atlante e qualificazioni",
        "href": "https://www.inapp.gov.it/atlantelavoro/cose-atlante-e-qualificazioni/"
      },
      {
        "label": "INAPP — Sistema nazionale di certificazione delle competenze",
        "href": "https://www.inapp.gov.it/atlantelavoro/sistema-nazionale-di-certificazione-delle-competenze/"
      }
    ]
  },
  {
    "slug": "corso-gratuito-requisiti-controlli",
    "title": "Corso gratuito: chi può partecipare e cosa controllare",
    "summary": "Distingui gratuità, requisiti, selezione e condizioni di frequenza.",
    "introduction": "Un corso gratuito può essere una buona opportunità, ma non è necessariamente aperto a tutti. Il finanziamento, i destinatari e l’edizione determinano le condizioni. Prima di inviare documenti, leggi il bando o la scheda ufficiale e verifica quale soggetto raccoglie l’iscrizione.",
    "sections": [
      {
        "title": "Individua il finanziamento",
        "text": "Un corso finanziato da un fondo, un percorso regionale e una promozione privata possono avere regole diverse. Non trasferire i requisiti di un programma a un altro. La scheda dovrebbe indicare organizzatore, ente finanziatore o misura, destinatari e modalità di partecipazione."
      },
      {
        "title": "Controlla la tua situazione al momento richiesto",
        "text": "Stato occupazionale, residenza, età, titoli e iscrizione a servizi per il lavoro possono essere rilevanti. Chiedi quando devono essere posseduti i requisiti e come documentarli. Se il percorso fa riferimento a GOL, verifica con il Centro per l’impiego l’accesso e la coerenza con il tuo percorso individuale."
      },
      {
        "title": "Forma.Temp: non confondere iscrizione e ammissione",
        "text": "Forma.Temp finanzia formazione per candidati e lavoratori della somministrazione; le Agenzie per il Lavoro realizzano l’offerta. I corsi finanziati dal Fondo non prevedono costi per i partecipanti. Il Patto Formativo descrive calendario e condizioni del progetto: richiedilo e leggilo. L’invio della candidatura non equivale alla conferma del posto."
      },
      {
        "title": "Valuta l’impegno prima di accettare",
        "text": "Verifica frequenza minima, assenze, verifiche e requisiti tecnici. Un’aula virtuale a tempo pieno richiede presenza agli orari indicati. Domanda se le lezioni sono registrate: non è garantito. Considera connessione, computer, spostamenti e tempo, anche quando la formazione non ha una quota."
      },
      {
        "title": "Controlla il risultato atteso",
        "text": "Chiedi il documento finale, le condizioni di rilascio e gli eventuali servizi successivi. Corso gratuito non significa assunzione garantita o qualifica abilitante. Se vengono richiesti pagamenti incompatibili con la misura dichiarata, chiarisci con il finanziatore prima di procedere."
      }
    ],
    "checklist": [
      "Rientro nei destinatari di questa edizione.",
      "Conosco la procedura e ho la conferma di ammissione.",
      "Posso rispettare il calendario e le presenze.",
      "So quali strumenti devo avere.",
      "Conosco titolo finale, verifiche e soggetto finanziatore."
    ],
    "exercise": "Confronta due corsi gratuiti nella stessa disciplina: destinatari, calendario, frequenza, selezione e documento finale. Il corso più utile è quello pertinente al tuo obiettivo e realmente frequentabile.",
    "sources": [
      {
        "label": "Forma.Temp — Informazioni per i lavoratori",
        "href": "https://www.formatemp.it/formatemp-per-i-lavoratori/"
      },
      {
        "label": "Sardegna Lavoro — Linee guida GOL",
        "href": "https://www.sardegnalavoro.it/wp-content/uploads/2024/12/Linee_Guida_GOL_2.pdf"
      }
    ]
  },
  {
    "slug": "online-registrato-diretta-aula",
    "title": "Online registrato, diretta o aula: quale formula puoi seguire davvero",
    "summary": "Scegli la modalità in base a orari, pratica, supporto e obiettivo.",
    "introduction": "Due corsi con lo stesso argomento possono richiedere giornate molto diverse. “Online” descrive il luogo di accesso, non la libertà di orario. Per scegliere bene devi sapere come avvengono le lezioni, quando puoi esercitarti e chi corregge il tuo lavoro.",
    "sections": [
      {
        "title": "Registrato: libertà di orario, organizzazione da costruire",
        "text": "Le videolezioni permettono di studiare nei momenti disponibili, secondo le condizioni di accesso del fornitore. Chiedi durata dell’accesso, aggiornamenti, assistenza e verifiche. Metti in agenda due sessioni di studio e una di pratica: acquistare una libreria di video non crea da solo una routine."
      },
      {
        "title": "Diretta: verifica l’incastro con la tua settimana",
        "text": "L’aula virtuale può richiedere presenza, webcam, esercitazioni e collegamento in fasce precise. Chiedi se puoi recuperare una lezione e come si registrano le presenze. Non presumere che “a distanza” significhi seguire dal telefono o guardare tutto la sera: i requisiti possono escluderlo."
      },
      {
        "title": "Aula: considera il valore della correzione sul posto",
        "text": "Per manualità, attrezzature e procedure, osservazione e feedback ravvicinato possono essere importanti. Verifica quanti partecipanti ci sono, quanto tempo esercita ciascuno e quali strumenti sono disponibili. Metti nel confronto anche viaggio, parcheggio, materiali e eventuale necessità di una modella."
      },
      {
        "title": "Ibrido: chiedi il calendario di entrambe le parti",
        "text": "Teoria online e pratica in aula possono combinarsi, ma le trasferte restano necessarie. Individua tutte le date obbligatorie prima di iscriverti. Per un titolo riconosciuto verifica che la modalità proposta sia quella autorizzata per quel percorso."
      },
      {
        "title": "Scegli in base a ciò che devi dimostrare",
        "text": "Per imparare uno strumento digitale può servire un progetto revisionato. Per una tecnica manuale valuta quanta pratica supervisionata è necessaria. In entrambi i casi chiedi come viene controllata la competenza, oltre al numero di ore. Se il tuo obiettivo richiede una qualifica, verifica prima il titolo e poi la comodità della formula."
      }
    ],
    "checklist": [
      "Ho distinto lezioni registrate e dirette.",
      "Conosco orari obbligatori e possibilità di recupero.",
      "Ho gli strumenti tecnici e i materiali necessari.",
      "So chi corregge le esercitazioni e come.",
      "La modalità è coerente con il titolo e il risultato cercato."
    ],
    "exercise": "Disegna una settimana reale, includendo lavoro, famiglia, riposo e spostamenti. Inserisci lezioni e pratica del corso scelto. Se funziona solo eliminando tutti gli imprevisti, confronta una formula diversa.",
    "sources": [
      {
        "label": "Talentform — FAQ sulla frequenza dei corsi",
        "href": "https://www.talentform.it/faq-frequently-asked-question/"
      }
    ]
  },
  {
    "slug": "cv-corso-progetto-senza-esperienza",
    "title": "Come presentare nel CV un corso e un progetto senza esperienza lavorativa",
    "summary": "Descrivi ciò che hai imparato e realizzato, distinguendo formazione ed esperienza professionale.",
    "introduction": "Se stai entrando in un settore nuovo, il CV può mostrare preparazione e prove pratiche senza inventare un lavoro precedente. L’obiettivo è far capire cosa sai fare oggi, come lo hai imparato e quali attività hai effettivamente svolto.",
    "sections": [
      {
        "title": "Scegli il corso pertinente all’annuncio",
        "text": "Inserisci nome del percorso, ente, periodo e stato: completato o in corso. Aggiungi ore e titolo finale se verificabili. Seleziona pochi argomenti collegati alla posizione: una lista di tutti i moduli rende difficile capire il contributo del corso."
      },
      {
        "title": "Crea una sezione per i progetti",
        "text": "Usa un titolo come “Progetti didattici” o “Portfolio”. Descrivi obiettivo, strumenti, contributo personale e risultato prodotto. Per un lavoro di gruppo spiega quale parte hai svolto. Non indicare come cliente reale l’attività immaginaria di un’esercitazione."
      },
      {
        "title": "Mostra prove comprensibili",
        "text": "Un file ordinato, una breve relazione o tre schermate commentate possono essere più chiari di un link senza spiegazione. Elimina dati personali e materiale riservato. Controlla permessi di accesso, leggibilità su telefono e licenze delle immagini. Non condividere lavori di altri come tuoi."
      },
      {
        "title": "Scrivi azioni verificabili",
        "text": "Esempio: “Progetto didattico: ho creato uno scadenzario in Excel con filtri e controlli sui duplicati, usando dati inventati”. Oppure: “Ho sviluppato un piano editoriale dimostrativo con sei contenuti e criteri di misurazione”. Non aggiungere aumenti di vendite o risultati aziendali mai misurati."
      },
      {
        "title": "Prepara la spiegazione per il colloquio",
        "text": "Scegli un progetto e raccontalo in due minuti: richiesta, scelta, difficoltà e controllo finale. Spiega cosa faresti diversamente. Puoi valorizzare competenze maturate in altri lavori o nel volontariato, chiarendo il contesto e senza attribuire loro titoli professionali non posseduti."
      }
    ],
    "checklist": [
      "Il corso è pertinente e lo stato è corretto.",
      "Ho separato progetti didattici e lavori retribuiti.",
      "Ho descritto il mio contributo con verbi concreti.",
      "Link e file funzionano senza esporre dati riservati.",
      "Posso spiegare e rifare ciò che dichiaro."
    ],
    "exercise": "Prendi un annuncio e scegli tre requisiti. Per ciascuno scrivi una prova reale: esperienza precedente, esercizio del corso o progetto. Se manca una prova, trattala come competenza da sviluppare, non da aggiungere comunque al CV.",
    "sources": [
      {
        "label": "Europass — Crea un CV",
        "href": "https://europass.europa.eu/it/create-europass-cv"
      },
      {
        "label": "EURES — Riconoscere le competenze da descrivere nel CV",
        "href": "https://eures.europa.eu/struggling-list-your-skills-cv-you-have-more-you-think-2026-07-29_it"
      }
    ]
  }
];
export const decisionGuideUrl = (slug: string) => `${DECISION_GUIDES_PATH}/${slug}`;
