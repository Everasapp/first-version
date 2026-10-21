export const LEARNING_PATH = "/imparare-e-fare-in-sardegna";

/** Applied to existing queries: restrict the public catalog without extra requests. */
export const PUBLIC_LEARNING_FILTER =
  "subcategory.like.imparare-%";

export function isLearningEvent(event: {
  category?: string | null;
  categories?: readonly string[] | null;
  subcategory?: string | null;
}): boolean {
  return isLearningTopic(event.subcategory);
}

/** Purpose and format are separate: a workshop can serve either area. */
export const LEARNING_AREAS = [
  {
    key: "formazione",
    anchor: "formazione",
    title: "Formazione",
    subtitle: "Competenze e professionalità",
    description:
      "Lezioni in aula e percorsi di studio per acquisire competenze professionali e aggiornare ciò che sai fare nel lavoro.",
    formats:
      "Corsi di formazione, lezioni in aula, aggiornamento professionale e seminari con obiettivi legati al lavoro.",
  },
  {
    key: "corsi-workshop",
    anchor: "corsi-workshop",
    title: "Corsi e workshop",
    subtitle: "Esperienze che arricchiscono",
    description:
      "Coltiva una passione, sperimenta un’attività e impara insieme ad altre persone, per il piacere di fare nuove esperienze.",
    formats:
      "Corsi per passione, workshop, laboratori, masterclass, seminari culturali ed esperienze guidate con una componente di apprendimento.",
  },
] as const;

export type LearningArea = (typeof LEARNING_AREAS)[number]["key"];

export const LEARNING_FORMATS = [
  { title: "Corsi", description: "Un percorso di lezioni per sviluppare una competenza o coltivare un interesse." },
  { title: "Workshop", description: "Un’attività pratica e concentrata su un tema o un progetto." },
  { title: "Laboratori", description: "Spazio alla sperimentazione, alla creazione e all’apprendimento attraverso la pratica." },
  { title: "Seminari e incontri", description: "Approfondimenti e momenti di confronto su un argomento." },
  { title: "Masterclass e percorsi intensivi", description: "Incontri o percorsi concentrati per approfondire una tecnica con una guida esperta." },
  { title: "Esperienze guidate", description: "Attività partecipative per scoprire un sapere, una tecnica o una tradizione." },
] as const;

// Preserve the existing editorial keys and anchors: no database migration or broken links.
export const LEARNING_TOPICS = [
  { key: "imparare-arti", area: "corsi-workshop", anchor: "arti", title: "Arti e manualità", description: "Ceramica, pittura, fotografia e laboratori per lavorare con le mani.", advice: "Per un primo laboratorio cerca un percorso senza prerequisiti. Confronta ore di pratica, materiali inclusi, eventuali cotture e quota associativa: il prezzo della lezione può essere solo una parte del costo." },
  { key: "imparare-professioni", area: "formazione", anchor: "professioni", title: "Competenze per il lavoro", description: "Lezioni e percorsi in ambito digitale, aziendale, tecnico e professionale.", advice: "Parti da un obiettivo concreto: gestire un sito, comunicare sui social o migliorare un processo di lavoro. Verifica i requisiti dei corsi finanziati e distingui l’attestato di frequenza da una qualifica professionale." },
  { key: "imparare-lingue", area: "corsi-workshop", anchor: "lingue", title: "Lingue", description: "Inglese e altre lingue, dai primi passi alla conversazione.", advice: "Un corso generale lavora su più abilità; la conversazione serve soprattutto a praticare il parlato. Scegli il livello con la scuola e confronta costo totale, iscrizione, materiali, frequenza e possibilità di recuperare le lezioni." },
  { key: "imparare-lingue-lavoro", area: "formazione", anchor: "lingue-lavoro", title: "Lingue per il lavoro", description: "Lingue applicate a professioni, settori e contesti lavorativi.", advice: "Confronta livello di partenza, obiettivi professionali, programma e modalità di valutazione." },
  { key: "imparare-mestieri", area: "formazione", anchor: "mestieri", title: "Competenze tecniche e di settore", description: "Lezioni e aggiornamento sulle competenze richieste nei diversi settori professionali.", advice: "Verifica requisiti di accesso, ore di pratica, strumenti e valore dell’eventuale attestato. Una qualifica è indicata soltanto quando confermata dall’ente." },
  { key: "imparare-impresa", area: "formazione", anchor: "impresa", title: "Impresa e sviluppo professionale", description: "Gestione, comunicazione, organizzazione e competenze per lavorare.", advice: "Scegli un percorso con obiettivi e destinatari chiari. Confronta contenuti, impegno richiesto e applicazioni nel tuo lavoro." },
  { key: "imparare-cucina", area: "corsi-workshop", anchor: "cucina", title: "Cucina e saperi del gusto", description: "Corsi di cucina e laboratori per scoprire tecniche e tradizioni.", advice: "Controlla quanto parteciperai alla preparazione, cosa è incluso e come vengono gestite eventuali esigenze alimentari." },
  { key: "imparare-musica-movimento", area: "corsi-workshop", anchor: "musica-movimento", title: "Musica, teatro e movimento", description: "Attività espressive, musicali e di movimento da vivere insieme.", advice: "Verifica livello, destinatari, frequenza e presenza di una lezione di prova, quando prevista dall’organizzatore." },
  { key: "imparare-benessere", area: "corsi-workshop", anchor: "benessere", title: "Benessere e crescita personale", description: "Pratiche e incontri per dedicare tempo a sé e imparare nuove abitudini.", advice: "Leggi obiettivi, modalità di partecipazione e competenze della guida per capire se l’attività risponde a ciò che cerchi." },
  { key: "imparare-natura", area: "corsi-workshop", anchor: "natura", title: "Natura e saperi del territorio", description: "Esperienze guidate per conoscere ambiente, tradizioni e tecniche locali.", advice: "Verifica il programma di apprendimento, gli spostamenti, l’attrezzatura richiesta e le condizioni di svolgimento." },
  { key: "imparare-famiglie", area: "corsi-workshop", anchor: "famiglie", title: "Bambini e famiglie", description: "Laboratori e attività per imparare e sperimentare insieme.", advice: "Controlla fasce d’età, presenza richiesta di un adulto, materiali e modalità di accompagnamento." },
] as const;

export type LearningTopic = (typeof LEARNING_TOPICS)[number]["key"];

export function isLearningTopic(value: string | null | undefined): value is LearningTopic {
  return LEARNING_TOPICS.some((topic) => topic.key === value);
}

/** Uses the existing editorial classification, never guesses from a course title. */
export function learningAreaForTopic(value: string | null | undefined): LearningArea | undefined {
  return LEARNING_TOPICS.find((topic) => topic.key === value)?.area;
}
