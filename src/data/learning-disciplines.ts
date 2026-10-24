import type { LearningArea } from "@/src/lib/learning-courses";

export type LearningDiscipline = {
  slug: string;
  name: string;
  areas: readonly LearningArea[];
};

/** Subjects are independent of purpose (macroarea) and format (course/workshop). */
export const learningDisciplines: readonly LearningDiscipline[] = [
  { slug: "digitale-informatica", name: "Digitale e informatica", areas: ["formazione"] },
  { slug: "marketing-comunicazione", name: "Marketing e comunicazione", areas: ["formazione"] },
  { slug: "amministrazione-contabilita", name: "Amministrazione e contabilità", areas: ["formazione"] },
  { slug: "gestione-impresa", name: "Gestione d’impresa e leadership", areas: ["formazione"] },
  { slug: "risorse-umane", name: "Risorse umane", areas: ["formazione"] },
  { slug: "sicurezza-lavoro", name: "Sicurezza sul lavoro", areas: ["formazione"] },
  { slug: "competenze-tecniche", name: "Competenze tecniche e mestieri", areas: ["formazione"] },
  { slug: "salute-sanita", name: "Salute e formazione sanitaria", areas: ["formazione"] },
  { slug: "educazione-didattica", name: "Educazione e didattica", areas: ["formazione", "corsi-workshop"] },
  { slug: "competenze-trasversali", name: "Metodo di studio e competenze trasversali", areas: ["formazione"] },
  { slug: "enologia-sommellerie", name: "Enologia e sommellerie", areas: ["formazione"] },
  { slug: "lingue", name: "Lingue", areas: ["formazione", "corsi-workshop"] },
  { slug: "fotografia-video", name: "Fotografia, cinema e video", areas: ["formazione", "corsi-workshop"] },
  { slug: "ceramica", name: "Ceramica", areas: ["corsi-workshop"] },
  { slug: "pittura-disegno", name: "Pittura e disegno", areas: ["corsi-workshop"] },
  { slug: "artigianato-tessitura", name: "Artigianato, tessitura e sartoria", areas: ["corsi-workshop"] },
  { slug: "musica", name: "Musica", areas: ["corsi-workshop"] },
  { slug: "teatro", name: "Teatro e arti espressive", areas: ["corsi-workshop"] },
  { slug: "cucina", name: "Cucina e pasticceria", areas: ["formazione", "corsi-workshop"] },
  { slug: "benessere-movimento", name: "Benessere fisico e spirituale", areas: ["formazione", "corsi-workshop"] },
  { slug: "ambiente-sostenibilita", name: "Ambiente e sostenibilità", areas: ["formazione", "corsi-workshop"] },
  { slug: "natura-saperi", name: "Natura e saperi del territorio", areas: ["corsi-workshop"] },
  { slug: "laboratori-bambini", name: "Laboratori per bambini e famiglie", areas: ["corsi-workshop"] },
 ];

export function isLearningDiscipline(slug: string) {
  return learningDisciplines.some((discipline) => discipline.slug === slug);
}

export function disciplinesForArea(area?: LearningArea) {
  return learningDisciplines.filter((discipline) => !area || discipline.areas.includes(area));
}

export function retainDisciplinesForArea(slugs: string[], area?: LearningArea) {
  const allowed = new Set(disciplinesForArea(area).map((discipline) => discipline.slug));
  return slugs.filter((slug) => allowed.has(slug));
}
