export type LearningSeoPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  advice: string;
  city?: string;
  freeOnly?: boolean;
  topic?: string;
  discipline?: string;
  keywords?: string[];
};

/** Curated permanent landing pages. Do not generate arbitrary query combinations. */
export const learningSeoPages: readonly LearningSeoPage[] = [
  { slug: "sardegna", title: "Corsi in Sardegna", description: "Scopri corsi, workshop e formazione in Sardegna: confronta attività, sedi, date e costi.", intro: "Dalla formazione per il lavoro ai laboratori creativi, qui trovi le opportunità di apprendimento disponibili in Sardegna.", advice: "Controlla sempre le sedi, le date delle lezioni, i requisiti e il costo complessivo prima di iscriverti." },
  { slug: "formazione-professionale", title: "Formazione professionale in Sardegna", description: "Percorsi di formazione professionale in Sardegna: corsi per il lavoro, competenze digitali e aggiornamento.", intro: "I percorsi professionali aiutano a migliorare competenze utili al lavoro: confronta programmi, destinatari e attestati.", advice: "Verifica se il corso rilascia una qualifica riconosciuta oppure un semplice attestato di frequenza.", topic: "formazione" },
  { slug: "gratuiti", title: "Corsi gratuiti in Sardegna", description: "Trova corsi gratuiti in Sardegna e online, con date, requisiti e informazioni degli organizzatori.", intro: "Raccogliamo le proposte segnalate come gratuite: alcune richiedono requisiti personali o amministrativi per partecipare.", advice: "Controlla presso l’ente eventuali requisiti, condizioni di finanziamento e spese accessorie.", freeOnly: true },
  { slug: "per-disoccupati", title: "Corsi per disoccupati in Sardegna", description: "Esplora la formazione rivolta a disoccupati in Sardegna e online e verifica i requisiti con gli enti.", intro: "Alcuni corsi professionali sono riservati a persone disoccupate o in cerca di occupazione. Le condizioni di accesso cambiano da programma a programma.", advice: "Verifica prima dell’iscrizione lo stato occupazionale richiesto, l’eventuale DID e i requisiti previsti dall’ente.", topic: "formazione", keywords: ["disoccupat", "inoccupat", "g.o.l.", "programma gol", "percettor", "naspi"] },
  { slug: "sassari", title: "Corsi a Sassari", description: "Corsi, workshop e laboratori a Sassari: trova proposte formative vicino a te.", intro: "Una selezione di attività formative che si svolgono a Sassari, dai corsi per il lavoro alle esperienze creative.", advice: "Verifica sempre sede, disponibilità di posti e modalità di iscrizione.", city: "Sassari" },
  { slug: "cagliari", title: "Corsi a Cagliari", description: "Corsi, workshop e laboratori a Cagliari: scopri formazione e nuove competenze.", intro: "Esplora corsi di formazione, lingue, laboratori e opportunità per imparare a Cagliari.", advice: "Confronta calendario, costo totale e livello richiesto.", city: "Cagliari" },
  { slug: "inglese", title: "Corsi di inglese in Sardegna", description: "Cerca corsi di inglese e conversazione in Sardegna, anche online.", intro: "Per iniziare da zero o migliorare la conversazione, scegli un corso di inglese adatto al tuo livello.", advice: "Chiedi una verifica del livello di partenza e controlla lezioni, materiali e eventuali recuperi.", keywords: ["inglese", "english"] },
  { slug: "informatica", title: "Corsi di informatica in Sardegna", description: "Corsi di informatica e competenze digitali in Sardegna e online.", intro: "Dalle basi del computer agli strumenti digitali per il lavoro, confronta percorsi e programmi.", advice: "Verifica quali software saranno utilizzati e se servono conoscenze preliminari.", discipline: "Digitale e informatica" },
  { slug: "pittura", title: "Corsi di pittura in Sardegna", description: "Corsi di pittura e disegno in Sardegna: lezioni pratiche e laboratori creativi.", intro: "Scopri laboratori e corsi per sperimentare tecniche pittoriche e sviluppare la tua creatività.", advice: "Controlla se materiali e strumenti sono inclusi e quanta pratica prevede il corso.", discipline: "Pittura e disegno" },
  { slug: "bambini", title: "Laboratori e corsi per bambini in Sardegna", description: "Attività educative, corsi e laboratori per bambini e famiglie in Sardegna.", intro: "Esperienze pratiche, laboratori e attività educative per imparare divertendosi.", advice: "Verifica fascia d’età, accompagnamento richiesto e materiali inclusi.", discipline: "Laboratori per bambini e famiglie" },
];

export function findLearningSeoPage(slug: string) {
  return learningSeoPages.find((page) => page.slug === slug);
}

export function matchesLearningSeoPage(event: {
  title: string;
  municipality?: string;
  learningTopic?: string;
  categories?: string[];
  category?: string;
  isFree?: boolean;
}, page: LearningSeoPage) {
  if (page.city && event.municipality?.toLocaleLowerCase("it") !== page.city.toLocaleLowerCase("it")) return false;
  if (page.freeOnly && !event.isFree) return false;
  if (page.topic === "formazione" && !["imparare-professioni", "imparare-lingue-lavoro", "imparare-mestieri", "imparare-impresa"].includes(event.learningTopic ?? "")) return false;
  if (page.discipline && !(event.categories ?? []).includes(page.discipline) && event.category !== page.discipline) return false;
  if (page.keywords?.length && !page.keywords.some((term) => event.title.toLocaleLowerCase("it").includes(term))) return false;
  return true;
}
