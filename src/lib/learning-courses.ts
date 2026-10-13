export const LEARNING_PATH = "/imparare-e-fare-in-sardegna";

export const LEARNING_TOPICS = [
  { key: "imparare-arti", anchor: "arti", title: "Arti e manualità", description: "Ceramica, pittura, fotografia e laboratori per lavorare con le mani.", advice: "Per un primo laboratorio cerca un percorso senza prerequisiti. Confronta ore di pratica, materiali inclusi, eventuali cotture e quota associativa: il prezzo della lezione può essere solo una parte del costo." },
  { key: "imparare-professioni", anchor: "professioni", title: "Competenze professionali e digitali", description: "Strumenti digitali, comunicazione e formazione per il lavoro.", advice: "Parti da un obiettivo concreto: gestire un sito, comunicare sui social o migliorare un processo di lavoro. Verifica i requisiti dei corsi finanziati e distingui l’attestato di frequenza da una qualifica professionale." },
  { key: "imparare-lingue", anchor: "lingue", title: "Lingue", description: "Inglese e altre lingue, dai primi passi alla conversazione.", advice: "Un corso generale lavora su più abilità; la conversazione serve soprattutto a praticare il parlato. Scegli il livello con la scuola e confronta costo totale, iscrizione, materiali, frequenza e possibilità di recuperare le lezioni." },
] as const;

export type LearningTopic = (typeof LEARNING_TOPICS)[number]["key"];

export function isLearningTopic(value: string | null | undefined): value is LearningTopic {
  return LEARNING_TOPICS.some((topic) => topic.key === value);
}
