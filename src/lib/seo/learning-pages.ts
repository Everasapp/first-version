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
  startMonthOffset?: 0 | 1;
  relatedPath?: { href: string; label: string };
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
  { slug: "in-partenza-questo-mese", title: "Corsi in partenza questo mese", description: "Corsi e workshop con avvio confermato nel mese corrente, in Sardegna e online.", intro: "Trova le attività del catalogo che iniziano questo mese e devono ancora cominciare. Le proposte senza una data di avvio confermata restano nel catalogo generale.", advice: "La data di inizio non è una scadenza di iscrizione né una conferma di posti disponibili. Chiedi all’organizzatore se puoi ancora partecipare.", startMonthOffset: 0, guidance: [
    { title: "Confronta il calendario completo", text: "Prima di scegliere, controlla frequenza, durata delle lezioni e impegno tra un incontro e l’altro. La data nella card è l’avvio del percorso, non l’elenco di tutte le lezioni." },
    { title: "Verifica l’ammissione", text: "Un corso futuro può avere già chiuso le iscrizioni o richiedere una selezione. Consulta la scheda e contatta l’ente prima di organizzare il tuo tempo." },
    { title: "Se cerchi corsi già iniziati", text: "Questa raccolta mostra solo gli avvii da oggi in avanti. Per percorsi continuativi o con preiscrizioni senza calendario, usa il catalogo generale e chiedi se sono possibili nuovi ingressi." },
  ] },
  { slug: "in-partenza-prossimo-mese", title: "Corsi in partenza il prossimo mese", description: "Organizza la formazione con i corsi e workshop in avvio il prossimo mese, in Sardegna e online.", intro: "Confronta in anticipo le attività del catalogo con una data di avvio confermata nel prossimo mese. La raccolta segue il calendario e si aggiorna al cambio del mese.", advice: "Muoviti prima dell’avvio: per corsi finanziati, gruppi a numero chiuso o attività con materiali possono servire passaggi preliminari.", startMonthOffset: 1, guidance: [
    { title: "Prepara documenti e attrezzatura", text: "Leggi i requisiti e chiedi all’ente se occorrono documenti, un test iniziale, software o materiali da acquistare prima della prima lezione." },
    { title: "Controlla le sovrapposizioni", text: "Due percorsi interessanti possono svolgersi negli stessi orari. Per le lezioni in diretta verifica se la frequenza è obbligatoria: una registrazione non sostituisce automaticamente la presenza." },
    { title: "Distingui avvio e iscrizione", text: "La presenza in questo elenco conferma una data pubblicata, non l’apertura delle iscrizioni. Controlla i termini nella scheda e chiedi conferma del posto all’organizzatore." },
  ] },
  { slug: "inglese-nord-sardegna", title: "Corsi di inglese nel Nord Sardegna", description: "Inglese e conversazione a Sassari, Alghero, Olbia e nel Nord Sardegna: confronta livello, sedi e costi.", intro: "Una selezione dei corsi di lingua inglese con sede nel Nord Sardegna. Parti dal livello e dall’uso che vuoi fare della lingua: conversazione, studio o lavoro.", advice: "I livelli base, intermedio e avanzato non indicano sempre una certificazione CEFR precisa. Chiedi una valutazione iniziale e il programma effettivo.", area: "Nord Sardegna", discipline: "Lingue", keywords: ["inglese", "english"], guidance: [
    { title: "Scegli il livello con la scuola", text: "Confronta ciò che sai già fare con gli obiettivi del gruppo. Un test iniziale può evitare un corso troppo semplice o difficile; la sola durata non indica il livello raggiungibile." },
    { title: "Confronta il costo intero", text: "Controlla ore di lezione, quota di iscrizione, libri, piattaforme ed eventuale esame. Un attestato di frequenza e una certificazione linguistica sono risultati diversi." },
    { title: "Verifica l’accesso al gruppo", text: "Per corsi comunali possono esserci priorità di residenza o limiti d’età. Un gruppo già avviato può richiedere una verifica prima dell’ingresso. Per lezioni interamente online usa anche la raccolta inglese in Sardegna." },
  ] },
  { slug: "amministrazione-contabilita", title: "Corsi di amministrazione e contabilità", description: "Confronta formazione amministrativa, contabile e paghe in Sardegna e online e collegala al tuo progetto di cambio lavoro.", intro: "Scegli una competenza per il lavoro d’ufficio: segreteria, documenti contabili, paghe o gestione amministrativa. Questa raccolta segue la disciplina assegnata nel catalogo e comprende anche percorsi con avvio ancora da definire.", advice: "I corsi sono opportunità alternative o complementari, non tappe tutte obbligatorie. Confronta le basi richieste e la parte di programma già coperta prima di sommare più percorsi.", topic: "formazione", discipline: "Amministrazione e contabilità", relatedPath: { href: "/idee-e-percorsi/diventare-addetto-amministrativo-contabile", label: "Cambiare lavoro: il percorso per addetto amministrativo contabile" }, guidance: [
    { title: "Parti dalle operazioni", text: "Se inizi da zero, cerca gestione documenti, fatture e fogli di calcolo con esercitazioni. Per paghe o gestionali specifici verifica quali conoscenze si danno già per acquisite." },
    { title: "Chiedi una prova pratica", text: "Verifica se userai dati didattici e software dimostrativi, se il docente correggerà gli esercizi e quale progetto potrai conservare per mostrare ciò che hai imparato." },
    { title: "Collega corso e obiettivo", text: "La guida al cambio lavoro aiuta a ordinare lo studio e capire cosa manca. Un corso non garantisce un impiego, una qualifica regionale o l’abilitazione a professioni regolamentate." },
  ] },
  { slug: "centro-sardegna", title: "Corsi e workshop nel Centro Sardegna", description: "Corsi e laboratori nei comuni del Centro Sardegna: confronta sedi, durata e costi.", intro: "Esplora le attività del catalogo con sede nei comuni del Centro Sardegna, tra formazione per il lavoro e corsi per coltivare una passione.", advice: "Controlla il comune e la sede effettiva delle lezioni. Per attività con pratica esterna chiedi se gli spostamenti sono organizzati o a carico dei partecipanti.", area: "Centro Sardegna", guidance: [
    { title: "Pianifica gli spostamenti", text: "Confronta quante giornate richiedono presenza e quali mezzi puoi utilizzare per raggiungere la sede e tornare a casa." },
    { title: "Scegli il formato", text: "Un laboratorio breve permette di provare una tecnica; un corso strutturato richiede continuità. Guarda programma e ore di pratica oltre al titolo." },
    { title: "Chiedi cosa è incluso", text: "Per attività artigianali o all’aperto verifica materiali, attrezzatura e possibili costi aggiuntivi prima di confermare." },
  ] },
  { slug: "sud-sardegna", title: "Corsi e workshop nel Sud Sardegna", description: "Formazione, corsi e laboratori nel Sud Sardegna: sedi, programmi e informazioni per scegliere.", intro: "Trova attività formative con sede nei comuni del Sud Sardegna, dai corsi professionali ai laboratori creativi. Per le proposte del solo capoluogo puoi consultare la raccolta Cagliari.", advice: "Una sede nel Sud Sardegna non significa necessariamente Cagliari: controlla indirizzo e modalità delle singole lezioni.", area: "Sud Sardegna", guidance: [
    { title: "Controlla sede e orari", text: "Verifica dove si svolge ogni parte del corso e considera il tempo di viaggio, soprattutto per lezioni serali o attività in più sedi." },
    { title: "Confronta le proposte", text: "Prima di scegliere tra corsi simili, guarda prerequisiti, ore di esercitazione, materiali e tipo di attestato previsto." },
    { title: "Chiarisci l’iscrizione", text: "La presenza nel catalogo non conferma un posto libero. Per corsi finanziati o gruppi a numero chiuso chiedi requisiti e tempi di ammissione." },
  ] },
  { slug: "olbia", title: "Corsi a Olbia", description: "Corsi, workshop e formazione a Olbia: confronta attività del catalogo, sedi e modalità di iscrizione.", intro: "Le opportunità del catalogo che indicano Olbia come comune di svolgimento: formazione per il lavoro, lingue e attività per passione.", advice: "Controlla l’indirizzo e la parte di corso svolta in presenza. Per altre sedi in Gallura consulta anche la raccolta del Nord Sardegna.", city: "Olbia" },
  { slug: "sassari", title: "Corsi a Sassari", description: "Corsi, workshop e laboratori a Sassari: trova proposte formative vicino a te.", intro: "Una selezione di attività formative che si svolgono a Sassari, dai corsi per il lavoro alle esperienze creative.", advice: "Verifica sempre sede, disponibilità di posti e modalità di iscrizione.", city: "Sassari" },
  { slug: "cagliari", title: "Corsi a Cagliari", description: "Corsi, workshop e laboratori a Cagliari: scopri formazione e nuove competenze.", intro: "Esplora corsi di formazione, lingue, laboratori e opportunità per imparare a Cagliari.", advice: "Confronta calendario, costo totale e livello richiesto.", city: "Cagliari" },
  { slug: "inglese", title: "Corsi di inglese in Sardegna", description: "Cerca corsi di inglese e conversazione in Sardegna, anche online.", intro: "Per iniziare da zero o migliorare la conversazione, scegli un corso di inglese adatto al tuo livello.", advice: "Chiedi una verifica del livello di partenza e controlla lezioni, materiali e eventuali recuperi.", keywords: ["inglese", "english"] },
  { slug: "informatica", title: "Corsi di informatica in Sardegna", description: "Corsi di informatica e competenze digitali in Sardegna e online.", intro: "Dalle basi del computer agli strumenti digitali per il lavoro, confronta percorsi e programmi.", advice: "Verifica quali software saranno utilizzati e se servono conoscenze preliminari.", discipline: "Digitale e informatica" },
  { slug: "pittura", title: "Corsi di pittura in Sardegna", description: "Corsi di pittura e disegno in Sardegna: lezioni pratiche e laboratori creativi.", intro: "Scopri laboratori e corsi per sperimentare tecniche pittoriche e sviluppare la tua creatività.", advice: "Controlla se materiali e strumenti sono inclusi e quanta pratica prevede il corso.", discipline: "Pittura e disegno" },
  { slug: "bambini", title: "Laboratori e corsi per bambini in Sardegna", description: "Attività educative, corsi e laboratori per bambini e famiglie in Sardegna.", intro: "Esperienze pratiche, laboratori e attività educative per imparare divertendosi.", advice: "Verifica fascia d’età, accompagnamento richiesto e materiali inclusi.", discipline: "Laboratori per bambini e famiglie" },
];

function romeDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

export function learningCollectionMonth(offset: 0 | 1, now: Date) {
  const [year, month] = romeDateKey(now).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1 + offset, 15, 12));
  return {
    key: romeDateKey(date).slice(0, 7),
    label: new Intl.DateTimeFormat("it-IT", { timeZone: "Europe/Rome", month: "long", year: "numeric" }).format(date),
  };
}

export function findLearningSeoPage(slug: string, now: Date = new Date()) {
  const page = learningSeoPages.find((page) => page.slug === slug);
  if (!page || page.startMonthOffset === undefined) return page;
  const month = learningCollectionMonth(page.startMonthOffset, now);
  return { ...page, title: `Corsi in partenza a ${month.label}`, description: `Corsi e workshop con avvio confermato a ${month.label}, in Sardegna e online. Confronta programmi e requisiti.`, intro: `Le attività del catalogo con avvio a ${month.label}, da oggi in avanti. Sono escluse le proposte già iniziate e quelle senza una data di avvio confermata. Verifica con l’ente se le iscrizioni sono ancora aperte.` };
}

export function matchesLearningSeoPage(event: {
  id?: string;
  area?: string;
  startDate?: string;
  scheduleMode?: string;
  title: string;
  municipality?: string;
  learningTopic?: string;
  categories?: string[];
  category?: string;
  isFree?: boolean | null;
}, page: LearningSeoPage, now: Date = new Date()) {
  if (page.startMonthOffset !== undefined) {
    const start = new Date(event.startDate ?? "");
    if (event.scheduleMode === "enrollment" || !Number.isFinite(start.getTime())) return false;
    const day = romeDateKey(start);
    if (day < romeDateKey(now) || day.slice(0, 7) !== learningCollectionMonth(page.startMonthOffset, now).key) return false;
  }
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
