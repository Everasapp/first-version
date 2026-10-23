import { cities } from "@/src/data/cities";
import { getCourseDeadline } from "@/src/lib/course-registration-deadlines";

export type LearningSeoPage = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  advice: string;
  city?: string;
  area?: string;
  closingSoon?: boolean;
  guidance?: readonly { title: string; text: string }[];
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
  { slug: "per-disoccupati", title: "Corsi gratuiti per disoccupati in Sardegna", description: "Esplora la formazione rivolta a disoccupati in Sardegna e online e verifica i requisiti con gli enti.", intro: "Alcuni corsi professionali sono riservati a persone disoccupate o in cerca di occupazione. Le condizioni di accesso cambiano da programma a programma.", advice: "Verifica prima dell’iscrizione lo stato occupazionale richiesto, l’eventuale DID e i requisiti previsti dall’ente.", freeOnly: true, topic: "formazione", keywords: ["disoccupat", "inoccupat", "g.o.l.", "gol", "percettor", "naspi"], guidance: [
    { title: "Prima verifica l’accesso", text: "Per i percorsi GOL verifica con il Centro per l’Impiego se puoi partecipare e quale percorso ti è stato assegnato. Essere disoccupati non dà automaticamente accesso a ogni corso finanziato." },
    { title: "Confronta l’impegno reale", text: "Controlla frequenza obbligatoria, selezione, ore in aula o in diretta e presenza di stage. Un corso con FAD e pratica in azienda non è interamente online." },
    { title: "Distingui costo e indennità", text: "La gratuità riguarda la quota del corso. Trasporti, attrezzature e condizioni per un’eventuale indennità vanno verificati con l’ente. Nella raccolta entrano solo proposte gratuite della macroarea Formazione con destinatari indicati nel titolo; altre opportunità potrebbero non essere incluse." },
  ] },
  { slug: "nord-sardegna", title: "Corsi e workshop nel Nord Sardegna", description: "Confronta corsi e laboratori a Sassari, in Gallura e nel Nord Sardegna: sedi, costi e modalità di partecipazione.", intro: "Dalla formazione per il lavoro ai laboratori per passione: questa raccolta riunisce le attività del catalogo con sede nei comuni del Nord Sardegna, inclusi Sassari, Alghero, Olbia e Santa Teresa Gallura.", advice: "La raccolta segue la sede del corso: le proposte interamente online si trovano nel catalogo generale. Controlla dove si svolgono lezioni e pratica prima di organizzare gli spostamenti.", area: "Nord Sardegna", guidance: [
    { title: "Scegli una sede raggiungibile", text: "Valuta l’orario dell’ultima lezione, il viaggio di ritorno e quante presenze sono richieste. Un costo contenuto può comportare spostamenti frequenti." },
    { title: "Guarda tutte le sedi", text: "Per i percorsi misti, la sede di riferimento può essere diversa dall’azienda che ospita la pratica. Chiedi all’ente dove dovrai recarti e con quale frequenza." },
    { title: "Parti dal tuo obiettivo", text: "Per cambiare lavoro cerca programma e competenze attese; per sperimentare una passione confronta livello iniziale, materiali e ore di pratica. Ogni attività rimanda alla stessa scheda completa del catalogo." },
  ] },
  { slug: "iscrizioni-in-scadenza", title: "Corsi con iscrizioni in scadenza", description: "Scadenze ufficiali di iscrizione nei prossimi 30 giorni per corsi e workshop in Sardegna e online.", intro: "Qui trovi i corsi del catalogo per cui abbiamo verificato una scadenza ufficiale nei prossimi 30 giorni. L’elenco è ordinato per termine di iscrizione: non usa la data di inizio come scadenza.", advice: "Prima di inviare la domanda verifica documenti, modalità di consegna e condizioni di ammissione. I posti possono esaurirsi prima del termine; una proroga vale solo se comunicata dall’organizzatore.", closingSoon: true, guidance: [
    { title: "Controlla il termine ufficiale", text: "Sotto ogni scheda trovi la scadenza e la fonte che la conferma. Se l’ente non specifica un orario limite, verifica direttamente entro quale ora consegnare la domanda." },
    { title: "Prepara la domanda", text: "Distingui una richiesta di informazioni da una domanda valida. Controlla se occorrono un modulo firmato, allegati e invio al protocollo o tramite un portale." },
    { title: "Aspetta la conferma del posto", text: "L’invio della domanda non equivale all’ammissione. Possono esserci graduatorie, priorità di residenza, selezioni o un numero minimo di iscritti per attivare il corso. La raccolta non è esaustiva: mostra solo i termini verificati dalla redazione." },
  ] },
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
  id?: string;
  area?: string;
  title: string;
  municipality?: string;
  learningTopic?: string;
  categories?: string[];
  category?: string;
  isFree?: boolean | null;
}, page: LearningSeoPage, now: Date = new Date()) {
  const area = event.area ?? cities.find((city) => city.city.toLocaleLowerCase("it") === event.municipality?.toLocaleLowerCase("it"))?.area;
  if (page.area && area !== page.area) return false;
  if (page.closingSoon && !getCourseDeadline(event.id ?? "", now)) return false;
  if (page.city && event.municipality?.toLocaleLowerCase("it") !== page.city.toLocaleLowerCase("it")) return false;
  if (page.freeOnly && !event.isFree) return false;
  if (page.topic === "formazione" && !["imparare-professioni", "imparare-lingue-lavoro", "imparare-mestieri", "imparare-impresa"].includes(event.learningTopic ?? "")) return false;
  if (page.discipline && !(event.categories ?? []).includes(page.discipline) && event.category !== page.discipline) return false;
  if (page.keywords?.length && !page.keywords.some((term) => term === "gol" ? /\bgol\b/i.test(event.title) : event.title.toLocaleLowerCase("it").includes(term))) return false;
  return true;
}
