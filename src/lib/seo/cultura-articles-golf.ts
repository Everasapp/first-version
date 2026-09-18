import type { CulturaArticle } from "@/src/lib/seo/cultura-articles";
import type { CulturePhoto } from "@/src/lib/seo/cultura-towns";

const CC_BY_SA_4 = {
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
} as const;
const CC_BY_SA_3 = {
  license: "CC BY-SA 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
} as const;

function wikiPhoto(
  src: string,
  alt: string,
  author: string,
  filePage: string,
  license: { license: string; licenseUrl: string },
): CulturePhoto {
  return {
    src,
    alt,
    credit: {
      author,
      ...license,
      sourceUrl: `https://commons.wikimedia.org/wiki/${filePage}`,
    },
  };
}

export const CULTURA_GOLF_ARTICLES: CulturaArticle[] = [
  {
    slug: "golf-in-sardegna",
    path: "/cultura/golf-in-sardegna",
    title:
      "Golf in Sardegna: i nove campi dell’isola, paese per paese",
    h1: "Golf in Sardegna",
    description:
      "Guida ai campi da golf in Sardegna: Pevero, Puntaldia, Tanka, Is Molas, Is Arenas, Florinas, Cagliari Golf Club, La Mora Bianca e Sacuba, con i comuni intorno e i link alle guide EVERAS.",
    intro:
      "In Sardegna il golf non è un’unica costa da resort. Sono nove campi, sparsi tra Gallura, Sassarese, Oristanese e sud: 18 buche sul granito della Costa Smeralda, 9 buche a un passo da Quartu, un percorso tra le dune di Narbolia. Questa guida li elenca tutti e li appoggia al paese che sta intorno, così da Pevero apri Arzachena e da Tanka apri Villasimius.",
    excerpt:
      "Nove campi da golf in Sardegna, ciascuno col comune intorno: da Pevero ad Arzachena a Tanka a Villasimius.",
    hero: wikiPhoto(
      "/images/cultura/arzachena-panorama.webp",
      "Arzachena tra i graniti della Gallura, territorio del Pevero Golf Club e della Costa Smeralda",
      "Gianni Careddu",
      "File:Arzachena,_panorama_(01).jpg",
      CC_BY_SA_4,
    ),
    sections: [
      {
        title: "Come leggere questa guida",
        paragraphs: [
          "La lista dei nove campi è quella della guida Solendra (solendra-golf.webflow.io), che copre tutti i percorsi aperti sull’isola e li raggruppa anche per aeroporto: Cagliari, Olbia, Alghero. Qui non rifacciamo il tour operator. Teniamo l’inventario e lo traduciamo in geografia EVERAS: ogni campo ha un comune, e quasi sempre una guida paese da aprire prima di prenotare il tee time.",
          "I green fee, gli orari e il numero di buche cambiano. Solendra indica fasce orientative; i club aggiornano listini e calendario in proprio. Non copiamo prezzi come se fossero un tariffario EVERAS. Conta il dove: da quale città parti, quale paese hai alle spalle, quale costa o quale campagna stai attraversando.",
          "Due avvertenze. Prima: “Cagliari Golf Club” sta a Flumini di Quartu, non in Castello. Seconda: Is Arenas è in comune di Narbolia, che su EVERAS non ha ancora una scheda propria: intorno trovi Oristano, Cabras e Bosa. La Mora Bianca, nel testo del club e sul sito ufficiale, sta in campagna di Assemini, a pochi minuti da Cagliari; la scheda Solendra in testa riporta anche Chia / Domus de Maria, ma il campo di pratica è quello del Campidano.",
        ],
      },
      {
        title: "I nove campi, con le città intorno",
        paragraphs: [
          "Pevero Golf Club — Arzachena (Costa Smeralda, Cala di Volpe). Città intorno: Olbia. 18 buche, circa 30 minuti dall’aeroporto di Olbia.",
          "Golf Club Puntaldia — San Teodoro. Città intorno: Olbia, Loiri Porto San Paolo. 9 buche sul mare, con driving range; 30–40 minuti da Olbia.",
          "Botanic Golf Sacuba Resort — Olbia, località Enas / area nuragica di Pedres. Città intorno: Loiri Porto San Paolo, Golfo Aranci. 9 buche, circa 10 minuti da Olbia.",
          "Florinas Golf — Florinas, località Cantaru Ena. Città intorno: Sassari. 9 buche più pitch & putt, circa 30 minuti da Alghero.",
          "Is Arenas Golf & Country Club — Narbolia, pineta di Is Arenas. Città intorno: Oristano, Cabras, Bosa. 18 buche tra dune e pini, costa ovest.",
          "Is Molas Golf Club — Santa Margherita di Pula, comune di Pula. Città intorno: Cagliari, Domus de Maria. 18 buche più un nove, 40–50 minuti da Cagliari.",
          "Tanka Golf Club — Villasimius. Città intorno: Cagliari, Quartu Sant’Elena. 18 buche, circa un’ora da Cagliari.",
          "Cagliari Golf Club — Quartu Sant’Elena, Flumini di Quartu. Città intorno: Cagliari. 9 buche, 15–20 minuti da Cagliari.",
          "La Mora Bianca Golf & Country — Assemini. Città intorno: Cagliari, Sestu, Decimomannu. Campo pratica e percorso corto, 20 minuti da Cagliari.",
        ],
      },
      {
        title: "Pevero Golf Club, Arzachena",
        photo: wikiPhoto(
          "/images/cultura/arzachena-panorama.webp",
          "Arzachena tra i graniti della Gallura, comune del Pevero Golf Club",
          "Gianni Careddu",
          "File:Arzachena,_panorama_(01).jpg",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Il Pevero è il campo che il resto d’Europa associa alla Sardegna: 18 buche, par 72, disegnato da Robert Trent Jones tra Cala di Volpe e il golfo del Pevero, nel comune di Arzachena. Granito, laghetti, macchia, maestrale. Non è “Porto Cervo” come indirizzo da cartolina: è territorio di Arzachena, lo stesso dei circoli funerari di Li Muri e del nuraghe Albucciu. Chi arriva solo per il tee time e se ne va senza il paese perde metà della costa.",
          "Da Olbia sono circa 30 minuti. Intorno, oltre al resort, ci sono Cannigione, le ville della Costa Smeralda e le spiagge di Capriccioli. Apri la guida di Arzachena su EVERAS per i siti archeologici; quella di Olbia se lo scalo è il punto di partenza.",
        ],
      },
      {
        title: "Golf Club Puntaldia, San Teodoro",
        photo: wikiPhoto(
          "/images/cultura/san-teodoro-panorama.webp",
          "San Teodoro in Gallura, comune del Golf Club Puntaldia",
          "Azotoliquido",
          "File:SanTeodoro_Panorama.JPG",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Puntaldia sta sul mare di San Teodoro: 9 buche tecniche tra macchia e baie, green con bunker e pendenze, vista sulle calette e, in barca, su Tavolara e Molara. Non è il 18 buche da classifica mondiale. È un campo da controllo della palla, a pochi minuti da La Cinta e da Cala Brandinchi.",
          "Da Olbia 30–40 minuti. Loiri Porto San Paolo è sulla stessa costa, un po’ più a nord. Se cerchi il paese e lo stagno, non solo il resort, apri la guida di San Teodoro. Per lo scalo, Olbia.",
        ],
      },
      {
        title: "Botanic Golf Sacuba, Olbia",
        photo: wikiPhoto(
          "/images/cultura/olbia-marina.webp",
          "La marina di Olbia, città del Botanic Golf Sacuba a località Enas",
          "Gianni Careddu",
          "File:Olbia,_marina_di_Olbia_(01).jpg",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Sacuba è il campo più vicino all’aeroporto di Olbia: località Enas, valle verso Pedres, 9 buche par 35 in un giardino botanico di lentisco, sughera, olivo e mirto. Solendra lo mette a circa 10 minuti da OLB. Non è Costa Smeralda da villa. È entroterra di Olbia, con il castello di Pedres e le tombe di giganti a un tiro di auto, Tavolara in prospettiva.",
          "Intorno: Olbia come città e scalo, Loiri Porto San Paolo e Golfo Aranci se ti sposti sulla costa. La guida di Olbia su EVERAS tiene museo, San Simplicio e il golfo; non trattare Sacuba come un’isola senza città.",
        ],
      },
      {
        title: "Florinas Golf, verso Sassari",
        photo: wikiPhoto(
          "/images/cultura/florinas-panorama.webp",
          "Florinas nel Logudoro, comune del Florinas Golf",
          "Gianni Careddu",
          "File:Florinas,_panorama_(02).jpg",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Florinas è l’unico dei nove che non vende il mare in copertina. Località Cantaru Ena, colline del Logudoro, 9 buche più un tracciato pitch & putt. Solendra lo dà a circa 30 minuti da Alghero e a breve da Sassari. Green fee da circolo, non da Costa Smeralda. Serve a chi sta in città o atterra ad Alghero e non vuole attraversare l’isola.",
          "Il paese è Florinas; la città intorno è Sassari. Apri entrambe le guide: Candelieri e Cavalcata da una parte, Logudoro dall’altra.",
        ],
      },
      {
        title: "Is Arenas, Narbolia",
        photo: wikiPhoto(
          "/images/cultura/cabras-panorama.webp",
          "Cabras e il Sinis, territorio vicino alla pineta di Is Arenas a Narbolia",
          "Gianni Careddu",
          "File:Cabras_-_Panorama_(02).JPG",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Is Arenas è il campo della costa ovest: 18 buche, par 72, pineta e dune nel comune di Narbolia, provincia di Oristano. Robert von Hagge tra i pini, vento, un tratto di litorale ancora poco costruito. Da Cagliari è più di un’ora; da Alghero Solendra indica 90–105 minuti. Non è un appendice di Oristano città: è pineta, tra il Sinis e la Planargia.",
          "Narbolia non ha ancora una guida EVERAS. Intorno, le schede che tengono il territorio sono Oristano, Cabras (Tharros, Sinis, bottarga) e Bosa sul Temo. Se atterri a Cagliari, Is Arenas è il campo più lontano dei nove; se sei già nel Sinis, è quello che hai sotto costa.",
        ],
      },
      {
        title: "Is Molas Golf Club, Pula",
        photo: wikiPhoto(
          "/images/cultura/pula-panorama.webp",
          "Pula nel Sulcis, comune di Is Molas a Santa Margherita",
          "Dirgela",
          "File:Pula_panorama.jpg",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Is Molas sta a Santa Margherita di Pula: 18 buche più un nove, uno dei percorsi da torneo più citati in Italia, tra le ultime colline del Sulcis e il mare. Da Cagliari 40–50 minuti. Il paese vero è Pula, con Nora a un passo. Il golf qui non è un’isola: è la stessa costa delle spiagge, del sito fenicio-romano e dei resort di Santa Margherita.",
          "Intorno: Pula, Cagliari come scalo, Domus de Maria se scendi verso Chia. Apri la guida di Pula prima di trattare Is Molas come un indirizzo senza storia.",
        ],
      },
      {
        title: "Tanka Golf Club, Villasimius",
        photo: wikiPhoto(
          "/images/cultura/villasimius-panorama.webp",
          "Villasimius nel Sarrabus, comune del Tanka Golf Club",
          "Giamas",
          "File:Villasimius3.jpg",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Tanka è il 18 buche del sud-est: par 70, Luigi Rota Caremoli, granito e macchia con il mare di Villasimius in fondo. Da Cagliari circa un’ora. Il comune è Villasimius, Capo Carbonara, le calette del Sarrabus. Quartu Sant’Elena sta sulla strada, se parti dal golfo degli Angeli.",
          "Apri la guida di Villasimius per il paese e il capo; Cagliari e Quartu se organizzi la giornata dallo scalo o dalla città.",
        ],
      },
      {
        title: "Cagliari Golf Club, Quartu Sant’Elena",
        photo: wikiPhoto(
          "/images/cultura/quartu-sant-elena-panorama.webp",
          "Quartu Sant’Elena, comune del Cagliari Golf Club a Flumini di Quartu",
          "Gianni Careddu",
          "File:Quartu_Sant'Elena_-_Costume_tradizionale_(09).JPG",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Il Cagliari Golf Club non è in centro Cagliari. Sta a Flumini di Quartu, via Bouganvillee, 9 buche par 36 più driving range, macchia e specchi d’acqua, 15–20 minuti da Cagliari e dall’aeroporto. È il campo urbano del sud: chi atterra a Elmas e ha un pomeriggio, spesso parte da qui.",
          "Il comune è Quartu Sant’Elena; la città intorno è Cagliari. Due guide, una costa: Poetto da una parte, Castello dall’altra.",
        ],
      },
      {
        title: "La Mora Bianca, Assemini",
        photo: wikiPhoto(
          "/images/cultura/assemini-panorama.webp",
          "Assemini nel Campidano, comune di La Mora Bianca Golf & Country",
          "Gianni Careddu",
          "File:Assemini_-_Costume_tradizionale_(11).JPG",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "La Mora Bianca è il circolo di campagna a ridosso di Cagliari: Assemini, strada provinciale 2, azienda agricola della famiglia Vincis, driving range e un percorso corto (6 buche par 3, in crescita verso le 9). Non è Pevero. È il campo dove si impara e si allena, a 20 minuti da Elmas. Solendra lo mette tra i campi raggiungibili da Cagliari; il sito del club conferma Assemini, non la costa di Chia.",
          "Intorno: Assemini, poi Cagliari, Sestu, Decimomannu. Apri la guida di Assemini per il paese della ceramica; Cagliari se lo usi come base città.",
        ],
      },
      {
        title: "Da quale aeroporto",
        paragraphs: [
          "Cagliari (CAG): La Mora Bianca, Cagliari Golf Club, Is Molas, Tanka. Is Arenas è raggiungibile ma è un trasferimento lungo, verso Narbolia.",
          "Olbia (OLB): Sacuba (il più vicino), Pevero, Puntaldia.",
          "Alghero (AHO): Florinas. Is Arenas sta sulla costa ovest, più vicino a Oristano che al Riviera del Corallo, anche se Solendra lo elenca tra i campi in raggio da Alghero.",
        ],
      },
      {
        title: "Come continuare su EVERAS",
        paragraphs: [
          "Apri le guide paese collegate: Arzachena, San Teodoro, Olbia, Florinas, Pula, Villasimius, Quartu, Assemini, più Oristano, Cabras e Bosa per Is Arenas. Scopri la Sardegna è la directory; il calendario è dove torni se un club o un comune pubblica un torneo o una festa.",
          "L’inventario dei nove campi lo dobbiamo a Solendra. Questa pagina lo tiene sul territorio EVERAS, non al posto della loro guida di soggiorni e trasferimenti.",
        ],
      },
    ],
    faqs: [
      {
        question: "Quanti campi da golf ci sono in Sardegna?",
        answer:
          "La guida Solendra ne elenca nove, da Pevero a La Mora Bianca. Non è una lista di lidi: sono i percorsi aperti sull’isola, tra 18 buche da torneo e circoli da pratica.",
      },
      {
        question: "Quale campo è più vicino a Cagliari?",
        answer:
          "Cagliari Golf Club a Flumini di Quartu (15–20 minuti) e La Mora Bianca ad Assemini (circa 20 minuti). Is Molas è a Pula, Tanka a Villasimius.",
      },
      {
        question: "Quale campo è più vicino a Olbia?",
        answer:
          "Botanic Golf Sacuba, località Enas, circa 10 minuti dall’aeroporto. Pevero è ad Arzachena, Puntaldia a San Teodoro.",
      },
      {
        question: "C’è un campo ad Oristano?",
        answer:
          "Il 18 buche della costa ovest è Is Arenas, nel comune di Narbolia, tra pineta e dune. Oristano, Cabras e Bosa sono le città intorno. Su EVERAS Narbolia non ha ancora una scheda propria.",
      },
      {
        question: "I prezzi dei green fee sono su EVERAS?",
        answer:
          "No. Cambiano per stagione e per club. Solendra indica fasce orientative; conferma sul sito del circolo prima di partire.",
      },
    ],
    relatedLinks: [
      {
        href: "/cultura-sarda/nord-sardegna/arzachena",
        label: "Guida Arzachena",
      },
      {
        href: "/cultura-sarda/nord-sardegna/san-teodoro",
        label: "Guida San Teodoro",
      },
      { href: "/cultura-sarda/nord-sardegna/olbia", label: "Guida Olbia" },
      {
        href: "/cultura-sarda/nord-sardegna/florinas",
        label: "Guida Florinas",
      },
      {
        href: "/cultura-sarda/nord-sardegna/sassari",
        label: "Guida Sassari",
      },
      {
        href: "/cultura-sarda/sud-sardegna/pula",
        label: "Guida Pula",
      },
      {
        href: "/cultura-sarda/sud-sardegna/villasimius",
        label: "Guida Villasimius",
      },
      {
        href: "/cultura-sarda/sud-sardegna/quartu-sant-elena",
        label: "Guida Quartu Sant’Elena",
      },
      {
        href: "/cultura-sarda/sud-sardegna/cagliari",
        label: "Guida Cagliari",
      },
      {
        href: "/cultura-sarda/sud-sardegna/assemini",
        label: "Guida Assemini",
      },
      {
        href: "/cultura-sarda/centro-sardegna/oristano",
        label: "Guida Oristano",
      },
      {
        href: "/cultura-sarda/centro-sardegna/cabras",
        label: "Guida Cabras",
      },
      {
        href: "/cultura-sarda/centro-sardegna/bosa",
        label: "Guida Bosa",
      },
      {
        href: "/cultura-sarda/sud-sardegna/domus-de-maria",
        label: "Guida Domus de Maria",
      },
      { href: "/eventi/olbia", label: "Eventi a Olbia" },
      { href: "/eventi/cagliari", label: "Eventi a Cagliari" },
    ],
    publishedAt: "2026-09-18",
  },
];
