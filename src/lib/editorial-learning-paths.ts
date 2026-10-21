import { LEARNING_PATH } from "@/src/lib/learning-courses";

export const IDEAS_PATH = "/idee-e-percorsi";

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
};

/** Original practical prompts; the historical articles retain their cited sources. */
export const EDITORIAL_LEARNING_PATHS: EditorialLearningPath[] = [
  {
    path: "/cultura-sarda/nord-sardegna/sassari",
    title: "Sassari: dal territorio a una nuova competenza",
    category: "Imparare in città",
    summary: "Osserva la città con un taccuino e scegli tra un percorso per il lavoro e un corso per passione.",
    image: { src: "/images/cultura/sassari-panorama-everas.webp", alt: "Piazza d’Italia a Sassari" },
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
    image: { src: "/images/cultura/giuseppe-biasi-ballo-tondo-everas.webp", alt: "Dettaglio dell’opera Ballo tondo di Giuseppe Biasi", credit: { label: "Giuseppe Biasi · Foto Sailko, CC BY 3.0 · ritaglio", href: "https://commons.wikimedia.org/wiki/File:Giuseppe_biasi,_ballo_tondo,_1934-35.jpg" } },
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
    image: { src: "/images/cultura/pattada-coltellinaio-everas.webp", alt: "Illustrazione di un artigiano al lavoro in bottega" },
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

export function findEditorialLearningPath(path: string) {
  return EDITORIAL_LEARNING_PATHS.find((item) => item.path === path);
}
