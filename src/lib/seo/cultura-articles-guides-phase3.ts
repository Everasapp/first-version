import type { CulturaArticle } from "@/src/lib/seo/cultura-articles";
import {
  wikiCommonsPhoto,
  type PhotoCredit,
} from "@/src/lib/seo/cultura-towns";

const CC_BY_SA_4 = {
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
} as const;
const CC_BY_3 = {
  license: "CC BY 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
} as const;

function everasPhoto(path: string, license = "Illustrazione originale"): PhotoCredit {
  return {
    author: "EVERAS",
    license,
    licenseUrl: `https://www.everas.it${path}`,
    sourceUrl: "https://www.everas.it/cultura",
    sourceLabel: "Cultura sarda",
    creditPrefix: license.startsWith("Foto") ? "Foto" : "Illustrazione",
  };
}

export const CULTURA_GUIDE_ARTICLES_PHASE3: CulturaArticle[] = [
  {
    slug: "musei-sardegna",
    path: "/cultura/musei-sardegna",
    kind: "guide",
    title: "Musei della Sardegna: una guida per territorio",
    h1: "Musei della Sardegna: una guida per territorio",
    description:
      "Musei per area: Sanna, Cagliari, ISRE Nuoro, civici di Alghero, Olbia, Ozieri, Aggius, Castelsardo, Pattada. Orari solo sulle fonti ufficiali.",
    intro:
      "Questa non è una directory di tutte le sale dell’isola. È una guida ragionata: quali musei servono a capire un territorio, cosa conservano, e dove confermare orari e biglietti. Un nuraghe visitabile non è un museo; un museo civico di paese non è il Museo Sanna. Le date di mostre e aperture straordinarie, quando un organizzatore le pubblica, stanno nel calendario EVERAS.",
    excerpt:
      "Dal Sanna di Sassari ai civici di Gallura e all’ISRE di Nuoro: musei scelti per territorio, non un elenco automatico.",
    hero: wikiCommonsPhoto({
      src: "/images/cultura/cultura-museo-sanna-hero.webp",
      alt: "Facciata del Museo nazionale Giovanni Antonio Sanna a Sassari",
      author: "Dr. Thomas Liptak",
      commonsFile: "Sardinia,_Sassari,_Museo_Nazionale_G._A._Sanna.jpg",
      ...CC_BY_SA_4,
    }),
    sections: [
      {
        title: "Come usare questa guida",
        paragraphs: [
          "Per ogni museo indichiamo comune, cosa racconta e perché conta. Non copiamo orari, prezzi, chiusure natalizie: cambiano e appartengono al gestore (Ministero, Comune, fondazione, cooperativa). Il rinvio è al sito ufficiale o al Comune. Se una sala è chiusa per restauro, lo dice quella fonte, non questa pagina.",
          "Le schede paese in Scopri la Sardegna restano il posto in cui museo, piazza e festa stanno insieme. Qui raggruppiamo per area, per chi arriva da un tema (archeologia, etnografia, mestieri) e non da un solo comune.",
        ],
      },
      {
        title: "Nord Sardegna",
        paragraphs: [
          "A Sassari il Museo nazionale Giovanni Antonio Sanna (via Roma) è il riferimento archeologico ed etnografico del Nord: Neolitico, nuragico, età romana, pinacoteca. Monte d’Accoddi, nel territorio, è un sito prenuragico: non è una sala del Sanna, è un altro tipo di visita. Orari del museo: rete dei musei archeologici della Sardegna.",
          "Ad Alghero il MACOR (Museo del Corallo) a Villa Costantino racconta biologia ed economia del Corallium rubrum, non un souvenir. Fa parte del sistema Musei Alghero, con archeologico e Casa Manno: biglietti sul sito comunale. A Stintino il MUT (Museo della Tonnara) documenta un mestiere spento, non la Pelosa. Ad Olbia il Museo archeologico di Isola Peddone tiene relitti e storia del porto: Comune di Olbia per aperture.",
          "In Anglona, Castelsardo ha il MIM (Museo dell’intreccio mediterraneo) nel castello dei Doria. In Gallura interna, Aggius tiene il MEOC (etnografico Oliva Carta Cannas) e il Museo del Banditismo nell’ex pretura. Tempio Pausania ha il Museo Bernardo De Muro in biblioteca e, quando Agris lo apre, il Museo delle macchine del sughero. A Pattada CULTER è il museo del coltello. Ad Ozieri il Civico Museo Archeologico alle Clarisse è il posto della cultura di Ozieri. Guide paese: i dettagli di salita, parcheggio e contesto.",
        ],
      },
      {
        title: "Centro Sardegna",
        paragraphs: [
          "Il centro dell’isola non ha un unico «museo della Barbagia». Ha civici, etnografici e siti aperti in modo discontinuo. Si parte dalle schede dei comuni (Mamoiada, Orgosolo, Oliena, Fonni) e si verifica l’apertura sul Comune o sulla cooperativa che gestisce. Non elenchiamo sale di cui non abbiamo una fonte stabile.",
          "Le maschere di carnevale si vedono meglio in paese, in febbraio, che in una vetrina fuori stagione. Il Museo delle Maschere Mediterranee a Mamoiada, quando è aperto, è il rinvio per distinguere Mamuthones e Issohadores da maschere di altri comuni. Date di carnevale: hub e calendario EVERAS.",
        ],
      },
      {
        title: "Nuorese",
        paragraphs: [
          "A Nuoro l’Istituto superiore regionale etnografico (ISRE) gestisce il Museo della vita e delle tradizioni popolari sarde: abiti, oggetti di lavoro, allestimenti di interni. È il posto per vedere differenze di costume con didascalie di provenienza, non una foto unica «sarda». Orari e mostre temporanee: ISRE e Comune di Nuoro.",
          "Il MAN (Museo d’Arte della Provincia di Nuoro) è un altro istituto: arte moderna e contemporanea, non etnografia. Non confonderlo con l’ISRE. La guida Nuoro in Scopri la Sardegna tiene ISRE, MAN, Deledda e Redentore; questa pagina non la duplica.",
        ],
      },
      {
        title: "Ogliastra",
        paragraphs: [
          "In Ogliastra i musei civici sono piccoli, spesso a gestione comunale o associativa, con aperture stagionali. Non costruiamo un elenco copiato da guide turistiche. Si parte dai Comuni (Lanusei, Tortolì, Jerzu, Baunei, e gli altri) e dalle schede paese su EVERAS, quando il comune ha una guida.",
          "Paesaggio, transumanza e costa alta non equivalgono a un museo. Un centro visite o un punto informativo va verificato sul posto. Mostre e sagre pubblicate cadono nel calendario, non in questa lista.",
        ],
      },
      {
        title: "Oristanese",
        paragraphs: [
          "Oristano ha l’Antiquarium arborense: reperti del territorio giudicale e romano, utile prima o dopo una visita a Tharros. Cabras tiene il Museo civico Giovanni Marongiu, dove si vedono (quando l’allestimento lo consente) i giganti di Mont’e Prama: sculture nuragiche da un contesto di scavo, non da un mito. Orari: Comuni di Oristano e Cabras.",
          "Tharros, sul Sinis, è un parco archeologico, non un museo cittadino. La distinzione serve: biglietto e percorso sono del gestore del sito. Il Festival della Bottarga è un evento, non una sala.",
        ],
      },
      {
        title: "Cagliari",
        paragraphs: [
          "Il Museo archeologico nazionale di Cagliari, nella Cittadella dei Musei, è la collezione statale più ampia dell’isola: preistoria, nuragico, fenicio-punico, romano. Accanto, nella stessa cittadella, pinacoteca e altre collezioni: ognuna ha un orario proprio sulla rete musei.sardegna.beniculturali.it.",
          "Cagliari ha anche musei civici e diocesani. Non li fondiamo in un «museo della città». Per Sant’Efisio, quartieri e calendario urbano si usa la guida Cagliari, con rinvio all’hub EVERAS. Qui restano i musei.",
        ],
      },
      {
        title: "Sud Sardegna",
        paragraphs: [
          "Su Nuraxi di Barumini è sito Unesco (1997), con villaggio e centro di accoglienza. Non è un museo di città: è un complesso archeologico. Biglietti e fasce di visita: gestore del sito e Comune, non questa guida. La scheda Barumini resta il rinvio territoriale.",
          "Nel Sulcis-Iglesiente contano musei e centri legati all’industria mineraria (Iglesias e i siti del Parco geominerario, dove aperti). Sono storia del lavoro, non folklore. Aperture spesso legate a consorzi e stagioni: si conferma sul gestore. Assemini è associata alla ceramica nella guida all’artigianato; un laboratorio non è automaticamente un museo civico.",
        ],
      },
      {
        title: "Mostre, aperture e calendario",
        paragraphs: [
          "Sotto, mostre e appuntamenti di arte e cultura pubblicati su EVERAS. Se la lista è vuota, i musei restano: si consulta il sito ufficiale e, se organizzi una mostra o una visita guidata, puoi pubblicarla. Non inventiamo «notte dei musei» senza locandina dell’anno.",
        ],
      },
    ],
    faqs: [
      {
        question: "Dove confermare orari e biglietti?",
        answer:
          "Sul sito del museo, del Comune o della rete musei.sardegna.beniculturali.it. Questa guida non copia listini.",
      },
      {
        question: "Qual è il museo più importante della Sardegna?",
        answer:
          "Non lo decidiamo. Il Sanna e il Nazionale di Cagliari sono i poli statali più ampi; ISRE a Nuoro è il riferimento etnografico regionale. La scelta dipende da cosa cerchi (archeologia, abiti, mestieri).",
      },
      {
        question: "Un sito archeologico è un museo?",
        answer:
          "No. Barumini, Tharros, Nora, Monte d’Accoddi sono siti. I musei conservano reperti e allestimenti. Si visitano in modo diverso, con biglietti diversi.",
      },
    ],
    sources: [
      {
        label: "Rete musei archeologici della Sardegna",
        href: "https://www.musei.sardegna.beniculturali.it/",
      },
      {
        label: "UNESCO — Su Nuraxi di Barumini",
        href: "https://whc.unesco.org/en/list/833/",
      },
      {
        label: "Comune di Sassari",
        href: "https://www.comune.sassari.it/",
      },
      {
        label: "Comune di Cagliari",
        href: "https://www.comune.cagliari.it/",
      },
      {
        label: "Comune di Nuoro",
        href: "https://www.comune.nuoro.it/",
      },
      {
        label: "Comune di Alghero",
        href: "https://www.comune.alghero.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/nuraghi-archeologia-sardegna", label: "Nuraghi e archeologia" },
      { href: "/cultura/storia-sardegna", label: "Storia della Sardegna" },
      { href: "/cultura/costumi-sardi", label: "Costumi tradizionali" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/cultura-sarda/nord-sardegna/alghero", label: "Guida Alghero" },
      { href: "/cultura-sarda/nord-sardegna/ozieri", label: "Guida Ozieri" },
      { href: "/cultura-sarda/sud-sardegna/cagliari", label: "Guida Cagliari" },
      { href: "/cultura-sarda/centro-sardegna/nuoro", label: "Guida Nuoro" },
      { href: "/cultura-sarda/centro-sardegna/oristano", label: "Guida Oristano" },
      { href: "/cultura-sarda/centro-sardegna/mamoiada", label: "Guida Mamoiada" },
      { href: "/cultura-sarda/sud-sardegna/barumini", label: "Guida Barumini" },
      {
        href: "/cultura-sarda/centro-sardegna/orani",
        label: "Guida Orani",
      },
      {
        href: "/cultura-sarda/nord-sardegna/castelsardo",
        label: "Guida Castelsardo",
      },
      { href: "/cultura-sarda", label: "Scopri la Sardegna" },
      { href: "/eventi/arte-cultura", label: "Arte e cultura in calendario" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["arte-cultura"],
    eventSectionTitle: "Mostre e aperture culturali in calendario",
    publishedAt: "2026-09-20",
  },
  {
    slug: "territori-sardegna",
    path: "/cultura/territori-sardegna",
    kind: "guide",
    title: "Territori della Sardegna: come il luogo forma lingue, mestieri e feste",
    h1: "Sardegna e territorio: dalle coste alle aree interne",
    description:
      "Gallura, Sassarese, Nurra, Anglona, Logudoro, Monteacuto, Barbagia, Ogliastra, Oristanese, Campidano, Sulcis-Iglesiente e Cagliaritano: culture di territorio, non un’isola unica.",
    intro:
      "Le culture dell’isola non coincidono con le province di oggi. Gallura non è il Sassarese; la Barbagia non è il Campidano. Questa guida tiene i nomi storici dei territori e li collega alle schede dei comuni e alle guide tematiche. Non è un itinerario da copertina e non inventa confini netti dove gli studiosi descrivono fasce di transizione.",
    excerpt:
      "Perché un rito, un abito o un mestiere stanno in un paese e non in quello accanto: una geografia culturale, non un tour.",
    hero: wikiCommonsPhoto({
      src: "/images/cultura/cultura-territori-supramonte-hero.webp",
      alt: "Il Supramonte sopra Oliena: entroterra calcareo della Barbagia",
      author: "Gianni Careddu",
      commonsFile: "Oliena_-_Supramonte_(14).JPG",
      ...CC_BY_SA_4,
    }),
    sections: [
      {
        title: "Gallura",
        paragraphs: [
          "La Gallura è granito, sugherete, stazzi, e una lingua (il gallurese) che i linguisti collegano al gruppo tosco-corso, non al sardo propriamente detto. Tempio Pausania, Aggius, Calangianus, Arzachena, Olbia, Palau, Santa Teresa, La Maddalena: comuni diversi, stessa area in senso largo. La Costa Smeralda è un pezzo di costa e di economia recente, non il nome culturale dell’entroterra.",
          "Sughero e tessitura (Aggius, Tempio) stanno nelle guide all’artigianato e nei musei civici. Olbia è porto, non solo scalo per le spiagge. La Maddalena è arcipelago e parco. Guide: Tempio, Aggius, Olbia, La Maddalena.",
        ],
      },
      {
        title: "Sassarese e Nurra",
        paragraphs: [
          "Sassari è città di gremi, Candelieri e Cavalcata, con il sassarese come parlata urbana. La Nurra è la piana e la costa ovest: Alghero (catalano, corallo, mura), Porto Torres (Turris Libisonis, San Gavino), Stintino (tonnara, Asinara). Non sono un unico «nord ovest turistico».",
          "Lingue: sassarese in città, catalano ad Alghero, sardo nei paesi. La guida alle lingue tiene i distinguo. Musei: Sanna, MACOR, MUT, San Gavino a Porto Torres.",
        ],
      },
      {
        title: "Anglona",
        paragraphs: [
          "Castelsardo è il centro più visibile: piazzaforte, intreccio, Lunissanti. L’Anglona è anche l’entroterra verso Sedini, Tergu, Valledoria: campagne, chiese romaniche, la Roccia dell’Elefante come segno di strada, non come «monumento misterioso».",
          "La scheda Castelsardo collega mestiere e Settimana Santa. Non estendiamo il Lunissanti a tutta l’Anglona: è un rito di quel borgo e della confraternita.",
        ],
      },
      {
        title: "Logudoro",
        paragraphs: [
          "Il Logudoro è una delle aree in cui il sardo logudorese e il canto a chitarra sono più documentati. Ozieri (cultura preistorica omonima, museo alle Clarisse, Premio Ozieri) è un riferimento urbano. Ittiri, Sorso, altri comuni della fascia hanno calendari propri: si aprono le schede, non si copiano.",
          "Romanico di pietra vulcanica (Bisarcio nel territorio di Ozieri) e poesia in sardo stanno qui più che in costa. La guida Ozieri e quella alla musica sono i rinvii.",
        ],
      },
      {
        title: "Monteacuto",
        paragraphs: [
          "Pattada è il comune più legato, su EVERAS, al mestiere della resolza e al monte. Il Monteacuto è una curatoria storica, non un marchio turistico. Frazioni, lago Lerno, coltelli, palio: la scheda Pattada tiene i piani distinti.",
          "Ozieri, in età medievale, fu anche riferimento del Monte Acuto: i territori si sovrappongono nei documenti. Non forziamo un confine da cartina stradale.",
        ],
      },
      {
        title: "Barbagia",
        paragraphs: [
          "Barbagia è un nome antico (le «Barbarie» delle fonti) che oggi indica soprattutto i paesi dell’interno nuorese: Mamoiada, Orgosolo, Oliena, Fonni, Gavoi e altri. Carnevali di maschera, canto a tenore, Autunno in Barbagia (Cortes Apertas) come circuito di paesi, non come una sagra sola.",
          "Non è «la Sardegna autentica» per contrasto alla costa. È un insieme di comuni con regole e abiti diversi. Mamoiada ha una guida su EVERAS ancora da irrobustire; l’hub Autunno in Barbagia tiene le tappe dell’edizione.",
        ],
      },
      {
        title: "Ogliastra",
        paragraphs: [
          "L’Ogliastra è costa alta e interni (Tortolì, Lanusei, Jerzu, Baunei, e i paesi della fascia). Compare nelle discussioni sulla zona blu insieme ad altre aree interne: la scheda EVERAS sulla longevità è il posto per quel tema, non questa geografia.",
          "Lingua campidanese di transizione, calendari di paese, pochi musei stabili: onestà da guida. Si entra dai comuni, non da un «tour Ogliastra» inventato.",
        ],
      },
      {
        title: "Oristanese",
        paragraphs: [
          "Oristano è città della Sartiglia, dell’Arborèa giudicale, dell’Antiquarium. Il Sinis (Cabras, Tharros, stagno) è un altro paesaggio: pesca, bottarga, Mont’e Prama. Eleonora d’Arborea sta nella scheda biografica, non in ogni piazza.",
          "Sa Sartiglia è febbraio, a Oristano, con gremio e Componidori: hub e approfondimento culturale già esistenti. Non la spostiamo «in Barbagia» né la facciamo festa dell’intera provincia.",
        ],
      },
      {
        title: "Campidano",
        paragraphs: [
          "Il Campidano è la piana meridionale: agricoltura, centri medi, sardo campidanese, launeddas in una geografia più meridionale. Non è un deserto culturale in attesa di Cagliari. Sagre di prodotto e patronali sono il calendario visibile; le fonti sono Comuni e Pro Loco.",
          "La guida alla cucina e quella alle lingue evitano di trattare il Campidano come «la cucina sarda» in blocco.",
        ],
      },
      {
        title: "Sulcis-Iglesiente",
        paragraphs: [
          "Miniere, carbone, piombo, zinco: storia industriale documentata, parchi e musei del lavoro dove aperti. Iglesias, Carbonia, i siti del Parco geominerario. Accanto, isole sulcitane: Carloforte e Calasetta con il tabarchino, varietà ligure riconosciuta. Sant’Antioco ha un’altra storia insulare.",
          "Non è folklore minerario da cartolina. È economia, migrazioni, chiusure di pozzi. Le date di visite guidate in miniera, quando pubblicate, stanno nel calendario.",
        ],
      },
      {
        title: "Cagliaritano",
        paragraphs: [
          "Cagliari (Karales) è capoluogo, porto, Museo archeologico nazionale, partenza di Sant’Efisio verso Nora. L’hinterland (Quartu, Assemini, Selargius, e gli altri comuni) ha calendari propri: Sposalizio selargino, ceramica di Assemini, Poetto come spiaggia urbana, non come «essenza» culturale.",
          "La guida Cagliari in Scopri la Sardegna è ancora stampino: non la sostituiamo qui con una pagina turistica. Sant’Efisio ha hub e Comune.",
        ],
      },
      {
        title: "Perché le tradizioni cambiano da territorio a territorio",
        paragraphs: [
          "Lingua, economia (pastorizia, pesca, miniera, sughero), confessione e confraternite, distanze dal mare: pesano insieme. Un lunedì santo a Castelsardo non è il carnevale di Mamoiada; una Faradda a Sassari non è una sagra di prodotto in Campidano. La guida alle tradizioni e quella ai costumi tengono i tipi distinti; questa pagina tiene i luoghi.",
          "Sotto, sagre e feste pubblicate. Il territorio si vede anche da una data: si arriva per un evento e si può restare sulla scheda del comune.",
        ],
      },
    ],
    faqs: [
      {
        question: "Gallura e Sassarese sono la stessa cosa?",
        answer:
          "No. Lingue, paesaggi e centri di riferimento sono diversi. Tempio e Olbia non sono Sassari; Alghero è in Nurra, con una storia catalana propria.",
      },
      {
        question: "La Barbagia è un’unica tradizione?",
        answer:
          "No. È un insieme di paesi, con maschere, canti e calendari diversi. Autunno in Barbagia è un circuito di tappe, non una festa sola.",
      },
      {
        question: "Dove sono le guide dei comuni?",
        answer:
          "In Scopri la Sardegna, divise in Nord, Centro e Sud. Questa pagina è la geografia culturale; le schede sono i luoghi.",
      },
    ],
    sources: [
      {
        label: "Regione Autonoma della Sardegna",
        href: "https://www.regione.sardegna.it/",
      },
      {
        label: "Legge 15 dicembre 1999, n. 482 — minoranze linguistiche",
        href: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1999-12-15;482",
      },
      {
        label: "UNESCO — Canto a tenore",
        href: "https://ich.unesco.org/en/RL/canto-a-tenore-sardinian-pastoral-songs-00165",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato sardo" },
      { href: "/cultura/tradizioni-sarde", label: "Feste e tradizioni" },
      { href: "/cultura-sarda", label: "Scopri la Sardegna" },
      { href: "/cultura-sarda/nord-sardegna/tempio-pausania", label: "Guida Tempio" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/cultura-sarda/nord-sardegna/pattada", label: "Guida Pattada" },
      { href: "/eventi-sardegna/autunno-in-barbagia", label: "Autunno in Barbagia" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["sagre-tradizioni"],
    eventSectionTitle: "Feste e sagre in calendario, per territorio",
    publishedAt: "2026-09-20",
  },
  {
    slug: "calendario-tradizioni-sarde",
    path: "/cultura/calendario-tradizioni-sarde",
    kind: "guide",
    title: "Tradizioni sarde durante l’anno: inverno, primavera, estate, autunno",
    h1: "La Sardegna e le sue feste durante l’anno",
    description:
      "Calendario culturale per stagioni: carnevali, Settimana Santa, patronali, sagre, Autunno in Barbagia e Natale. Le date dell’edizione stanno nel database EVERAS.",
    intro:
      "L’anno culturale dell’isola non è un manifesto turistico. In inverno pesano carnevali e alcuni voti; in primavera Settimana Santa e Sant’Efisio; in estate patronali e piazze; in autunno raccolti e Cortes Apertas. Questa guida è stabile: spiega i tipi di stagione. Le date dell’anno in corso, quando un organizzatore le pubblica, stanno sotto, nel calendario. Non copiamo orari da un’edizione all’altra.",
    excerpt:
      "Quattro stagioni di riti e sagre, con le date vive nel database, non scritte nel testo.",
    hero: wikiCommonsPhoto({
      src: "/images/cultura/cultura-calendario-sant-efisio-hero.webp",
      alt: "Abiti tradizionali alla festa di Sant’Efisio a Cagliari, nel calendario di maggio",
      author: "Antonio Cunico",
      commonsFile: "Festa_di_S._Efisio_Cagliari_Costumi_3.jpg",
      ...CC_BY_SA_4,
    }),
    sections: [
      {
        title: "Inverno",
        paragraphs: [
          "Carnevale, in Sardegna, non è un unico corso mascherato. Mamoiada, Ottana, Tempio (lu carrasciali timpiesu), e altri comuni tengono maschere, carri o giochi a cavallo in giorni legati al calendario liturgico, che slitta ogni anno. Sa Sartiglia a Oristano è a febbraio, nella domenica e nel martedì grasso, con regole del gremio: approfondimento e hub già esistono.",
          "Sant’Antonio, falò, alcune sagre di prodotto invernale: dipendono dal paese. La guida alle tradizioni spiega i tipi; qui conta il fatto stagionale. Date: Carnevale in Sardegna su EVERAS e schede evento.",
        ],
      },
      {
        title: "Primavera",
        paragraphs: [
          "La Settimana Santa è il blocco più denso: Lunissanti a Castelsardo (lunedì santo, confraternita, Tergu), riti a Alghero, Cagliari, Iglesias e in altri centri, ognuno con cori e percorsi propri. Non esiste «la» Settimana Santa sarda. Sant’Efisio parte il 1° maggio da Cagliari verso Nora, secondo Arciconfraternita e Comune.",
          "Cavalcata Sarda a Sassari è a metà maggio (data dell’edizione sul Comune). Olbia tiene Mesu Maju intorno al 15 maggio (San Simplicio). Prime sagre di primavera: calendario, non questa pagina.",
        ],
      },
      {
        title: "Estate",
        paragraphs: [
          "Patronali, processioni, palii, concerti in piazza: l’estate mescola voti antichi e programmazione contemporanea. I Candelieri a Sassari sono il 14 agosto (Faradda), patrimonio Unesco con la rete delle macchine a spalla. Sagra del Redentore a Nuoro è sul calendario estivo della città, con salita al monte: hub EVERAS per l’edizione.",
          "«Feste sul mare» è una categoria di palinsesto, non una voce etnografica. Stintino, La Maddalena, Alghero, Costa: piazze piene, paesi che in inverno si svuotano. Distinguere una festa di porto da un rito documentato richiede la scheda del comune.",
        ],
      },
      {
        title: "Autunno",
        paragraphs: [
          "Vendemmie, raccolti, sagre di miele, vino, olio, castagne: spesso nate o rifondate nel Novecento da Pro Loco. Autunno in Barbagia (Cortes Apertas) è un circuito di paesi in date successive, non una sagra unica: la tabella tappe sta sull’hub EVERAS.",
          "Fine estate e settembre tengono ancora patronali. L’autunno interno è anche chiusura di alcune spiagge e riapertura di musei civici su appuntamento: orari sui gestori.",
        ],
      },
      {
        title: "Natale",
        paragraphs: [
          "Presepi, novene, messe di mezzanotte, qualche corteo: le pratiche natalizie sono locali e cambiano. Non inventiamo un «Natale sardo» unico, né mercati copiati da altre città italiane. Dove un Comune o una parrocchia pubblica un programma, la scheda evento può ospitarlo.",
          "Dolci di festa (papassini, e altri a seconda del paese) stanno nella guida alla cucina come geografia, non come ricettario di dicembre.",
        ],
      },
      {
        title: "Come usare il calendario EVERAS",
        paragraphs: [
          "Il testo di questa pagina non si aggiorna ogni settimana. Si aggiornano le schede evento. Se sotto non c’è nulla, la stagione esiste lo stesso: puoi aprire le grandi feste, i paesi, o pubblicare un appuntamento se lo organizzi.",
        ],
      },
    ],
    faqs: [
      {
        question: "Le date in questa guida sono dell’anno in corso?",
        answer:
          "No. Qui restano periodi e tipi di festa. Giorno, ora e luogo dell’edizione stanno sulla scheda evento, quando è pubblicata.",
      },
      {
        question: "Sant’Efisio è sempre il 1° maggio?",
        answer:
          "La partenza da Cagliari è tradizionalmente il 1° maggio. Percorso, soste e orari dell’anno li pubblicano Arciconfraternita e Comune.",
      },
      {
        question: "Autunno in Barbagia è una sola festa?",
        answer:
          "No. È un calendario di tappe in paesi diversi. L’hub EVERAS tiene la tabella; ogni tappa è un comune.",
      },
    ],
    sources: [
      {
        label: "UNESCO — Feste delle grandi macchine a spalla (Candelieri)",
        href: "https://ich.unesco.org/en/RL/celebrations-of-big-shoulder-borne-processional-structures-00721",
      },
      {
        label: "Comune di Sassari",
        href: "https://www.comune.sassari.it/",
      },
      {
        label: "Comune di Cagliari",
        href: "https://www.comune.cagliari.it/",
      },
      {
        label: "Comune di Oristano",
        href: "https://www.comune.oristano.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/tradizioni-sarde", label: "Feste e tradizioni" },
      { href: "/cultura/grandi-feste-sarde", label: "Grandi feste" },
      { href: "/eventi-sardegna/carnevale-sardegna", label: "Carnevale" },
      { href: "/eventi-sardegna/sant-efisio", label: "Sant’Efisio" },
      { href: "/eventi-sardegna/autunno-in-barbagia", label: "Autunno in Barbagia" },
      { href: "/eventi-sardegna/sagre", label: "Sagre" },
      { href: "/cultura/scopri-sardegna-eventi", label: "Scoprire l’isola dagli eventi" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["sagre-tradizioni", "celebrazioni"],
    eventSectionTitle: "Feste e sagre in programma in questa stagione",
    publishedAt: "2026-09-20",
  },
  {
    slug: "tradizioni-sarde-oggi",
    path: "/cultura/tradizioni-sarde-oggi",
    kind: "guide",
    title: "Come nascono e come cambiano le tradizioni sarde",
    h1: "Tradizioni sarde oggi: trasmissione, turismo, associazioni",
    description:
      "Le tradizioni sarde non sono immobili: giovani, Pro Loco, turismo, musei, artigiani e digitale. Una guida su come cambiano riti e sagre, senza folklorismo.",
    intro:
      "Una tradizione non è un oggetto fermo in una teca. È una pratica che qualcuno insegna, ripete, finanzia, a volte accorcia o sposta di giorno. Questa pagina è riflessiva di proposito: non elenca feste (quello sta nelle altre guide) e non decide cosa è «autentico». Distingue fatti osservabili — un percorso cambiato, un pubblico nuovo, un bando regionale — dalle opinioni su cosa dovrebbe restare.",
    excerpt:
      "Pro Loco, gremi, scuole, Instagram: la cultura sarda come fatto vivo, non come souvenir fermo.",
    hero: wikiCommonsPhoto({
      src: "/images/cultura/cultura-tradizioni-oggi-isre-hero.webp",
      alt: "Sala delle maschere al museo etnografico ISRE di Nuoro: mamuthones e issohadores in vetrina",
      author: "Sailko",
      commonsFile:
        "Nuoro,_museo_etnografico_sardo,_interno,_sala_delle_maschere,_mamuthones_e_issocadores_di_mamoiada,_01.jpg",
      ...CC_BY_3,
    }),
    sections: [
      {
        title: "Trasmissione tra generazioni",
        paragraphs: [
          "Maschere, canti, abiti, resolza, intreccio: si imparano in famiglia, in bottega, in associazione, a volte in un laboratorio scolastico. Il passaggio non è automatico. Dove i giovani escono dal paese, un rito può restare in mano a poche persone; dove una scuola di tenore o un corso di telaio tiene, la pratica si allarga a chi non ha nonni del mestiere.",
          "Questo non «invalida» la festa. È la sua storia recente. I musei etnografici (ISRE a Nuoro, MEOC ad Aggius) documentano oggetti; le persone, il lunedì dopo, decidono se indossarli ancora.",
        ],
      },
      {
        title: "Feste religiose e confraternite",
        paragraphs: [
          "Gremi sassaresi, Arciconfraternita di Sant’Efisio, Confraternita di Santa Croce a Castelsardo: tengono statuti, turni, voti. Cambiano percorsi per viabilità, sicurezza, numeri. Una processione più corta non è per forza uno svuotamento: a volte è un adattamento documentato dal Comune.",
          "Chiesa, laici e amministrazione civile si sovrappongono. Orari della messa e della sfilata stanno sull’edizione, non su una guida «per sempre».",
        ],
      },
      {
        title: "Sagre che si trasformano",
        paragraphs: [
          "Molte sagre nascono nel secondo Novecento per promuovere un prodotto o un paese. Alcune si radicano e diventano il calendario atteso; altre durano tre edizioni. Distinguere un voto agricolo antico da una sagra di promozione richiede la scheda del comune e, se c’è, lo statuto della Pro Loco.",
          "Menu, prezzi, location sul lungomare: sono scelte dell’anno. EVERAS le mostra sulla scheda evento, non le fissa in questa prosa.",
        ],
      },
      {
        title: "Turismo",
        paragraphs: [
          "Il turismo sposta pubblici, calendari, a volte il senso di una piazza. Una Faradda resta rito di città con migliaia di ospiti; una spiaggia può saturare un paese (Stintino) e lasciare il museo della tonnara mezzo vuoto a mezzogiorno. Non moralizziamo: registriamo il doppio uso dello stesso suolo.",
          "«Autenticità» da brochure è un criterio povero. Meglio chiedere chi organizza, chi paga, chi balla, e leggere la fonte (Comune, gremio, parco).",
        ],
      },
      {
        title: "Associazioni, Pro Loco, giovani",
        paragraphs: [
          "Le Pro Loco, le cooperative, i comitati di festa, i gruppi folk: sono i soggetti che tengono in piedi locandine e permessi. I giovani entrano come suonatori, social media, volontari, o restano fuori. Una Cavalcata o un carnevale visibile nasconde, nei paesi piccoli, la fatica di trovare otto portatori o un tenore.",
          "Pubblicare un evento su EVERAS è una di queste fatiche burocratiche, in piccolo: rende visibile l’edizione corrente, non «la tradizione eterna».",
        ],
      },
      {
        title: "Musei e artigiani",
        paragraphs: [
          "Il museo congela un oggetto; la bottega lo usa. Pattada, Aggius, Castelsardo, Alghero: mestieri ancora praticati accanto a vetrine. La guida all’artigianato rifiuta il catalogo di vendita. L’artigiano che insegna a un apprendista è trasmissione; il souvenir da banchina è un altro mercato, legittimo ma distinto.",
        ],
      },
      {
        title: "Digitalizzazione ed eventi contemporanei",
        paragraphs: [
          "Locandine su Instagram, prenotazioni online (Caprera, Pelosa, alcuni musei), streaming di gare poetiche: il digitale è già dentro le pratiche. Non è un tradimento automatico. È un canale. JazzAlguer, Time in Jazz, rassegne in città stanno accanto ai voti: la guida alla musica tiene i repertori distinti senza gerarchie di «purezza».",
          "Questa pagina non chiude il cerchio. Sotto, sagre e appuntamenti pubblicati: sono già il documento di come una comunità ha scelto di mostrarsi quest’anno.",
        ],
      },
    ],
    faqs: [
      {
        question: "Una tradizione che cambia è meno vera?",
        answer:
          "No. Cambiare percorso, pubblico o data è parte della storia della pratica. Conta chi la tiene e come la documenta, non uno slogan di autenticità.",
      },
      {
        question: "Il turismo rovina le feste?",
        answer:
          "A volte le finanzia, a volte le comprime. Dipende dal comune e dall’edizione. Non c’è una risposta unica per l’isola.",
      },
      {
        question: "Come si vede una tradizione «di quest’anno» su EVERAS?",
        answer:
          "Sulla scheda evento: luogo, orario, organizzatore. Le guide culturali spiegano il contesto; non sostituiscono la locandina.",
      },
    ],
    sources: [
      {
        label: "Regione Autonoma della Sardegna",
        href: "https://www.regione.sardegna.it/",
      },
      {
        label: "UNESCO — Canto a tenore",
        href: "https://ich.unesco.org/en/RL/canto-a-tenore-sardinian-pastoral-songs-00165",
      },
      {
        label: "UNESCO — Feste delle grandi macchine a spalla",
        href: "https://ich.unesco.org/en/RL/celebrations-of-big-shoulder-borne-processional-structures-00721",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/tradizioni-sarde", label: "Feste e tradizioni" },
      { href: "/cultura/calendario-tradizioni-sarde", label: "Tradizioni durante l’anno" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato sardo" },
      { href: "/cultura/musica-canto-poesia-sarda", label: "Musica e poesia" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura/scopri-sardegna-eventi", label: "Scoprire l’isola dagli eventi" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["sagre-tradizioni", "arte-cultura"],
    eventSectionTitle: "Appuntamenti di quest’anno in calendario",
    publishedAt: "2026-09-20",
  },
  {
    slug: "scopri-sardegna-eventi",
    path: "/cultura/scopri-sardegna-eventi",
    kind: "guide",
    title: "Scopri la Sardegna attraverso gli eventi",
    h1: "Scopri la Sardegna attraverso gli eventi",
    description:
      "Come usare il calendario EVERAS per capire un territorio: feste, sagre, musica, artigianato, musei, famiglie e comuni. Non solo cosa fare, ma dove si è.",
    intro:
      "Un evento può essere l’ingresso in un territorio: una Faradda, una tappa di Autunno in Barbagia, una mostra in un civico, una sagra di paese. Si arriva per una data e si può restare sulla guida del comune o sul tema. Questo è il valore che EVERAS cerca: non solo «cosa fare questo weekend», ma capire dove si è. Le date stanno nel database; i testi culturali restano. Se una lista sotto è vuota, il ponte resta: puoi esplorare le guide o pubblicare un appuntamento se lo organizzi.",
    excerpt:
      "Dal calendario alle guide: feste, sagre, musica, mestieri e musei come porte sui comuni.",
    hero: {
      src: "/images/seo/eventi-sardegna-cover.webp",
      alt: "Una piazza in festa in Sardegna: l’evento come accesso al territorio",
      credit: everasPhoto("/cultura/scopri-sardegna-eventi", "Fotografia originale"),
    },
    sections: [
      {
        title: "Feste tradizionali",
        paragraphs: [
          "Candelieri, Cavalcata, Sartiglia, Sant’Efisio, carnevali, Lunissanti: le grandi feste hanno hub in Eventi in Sardegna e approfondimenti in Cultura. La scheda evento dell’edizione ha giorno e ora; la guida spiega origine e regole quando le fonti lo consentono.",
          "Categoria celebrazioni e sagre-tradizioni sul calendario. Guide: tradizioni, grandi feste, calendario stagionale.",
        ],
      },
      {
        title: "Sagre e gastronomia",
        paragraphs: [
          "Una sagra racconta spesso un prodotto e un comune, non «la cucina sarda». Food & Drink e sagre sono i filtri. La guida alla cucina tiene pane, carni, mare e formaggi come geografia; i prezzi dei piatti stanno sulla locandina dell’anno.",
        ],
      },
      {
        title: "Musica e canto",
        paragraphs: [
          "Tenore in piazza, chitarra, jazz a Berchidda o Alghero, bande: repertori diversi. Categoria musica e concerti. La guida a musica e poesia tiene Unesco e contemporaneo distinti. Maria Carta, Fresu, Mereu hanno schede proprie, non sono locandine.",
        ],
      },
      {
        title: "Artigianato",
        paragraphs: [
          "Fiere, biennali del coltello, dimostrazioni in Cortes Apertas: categoria fiere e mercatini. La guida all’artigianato rinvia a Pattada, Aggius, Castelsardo, Alghero, Tempio senza vendere oggetti. Una fiera non certifica l’identità di un paese; la rende visibile per un weekend.",
        ],
      },
      {
        title: "Archeologia e storia",
        paragraphs: [
          "Visite guidate, aperture straordinarie, conferenze: categoria arte e cultura. La guida ai nuraghi e quella alla storia distinguono scavo e interpretazione. Barumini, Ozieri, Cabras, Nora: schede comune e musei, non un tour inventato.",
        ],
      },
      {
        title: "Musei e mostre",
        paragraphs: [
          "Mostre temporanee e notti dei musei, quando pubblicate, cadono in arte e cultura. Orari ordinari restano sui siti dei musei. La guida ai musei ragiona per territorio e rifiuta l’elenco automatico.",
        ],
      },
      {
        title: "Eventi per famiglie",
        paragraphs: [
          "Laboratori, feste di piazza, rassegne per bambini: categoria famiglie e bambini. Non è una sezione «turistica per tutti». È un filtro di pubblico. Il contesto del comune resta nelle guide paese.",
        ],
      },
      {
        title: "Eventi nei comuni della Sardegna",
        paragraphs: [
          "Ogni guida comunale in Scopri la Sardegna mostra gli eventi di quel comune, quando ci sono. Nord, Centro, Sud: stessa griglia del calendario. Da un paese si sale al tema (lingua, mestiere, festa); da un tema si scende al paese.",
          "Sotto, un estratto dal calendario vivo. Per pubblicare: area organizzatori. EVERAS non sostituisce il Comune; rende visibile ciò che gli organizzatori affidano al database.",
        ],
      },
    ],
    faqs: [
      {
        question: "In cosa EVERAS è diverso da una lista di «cose da fare»?",
        answer:
          "Accanto alla data ci sono guide di territorio e di tema. Si può capire un rito o un mestiere, non solo scegliere un orario.",
      },
      {
        question: "Se non ci sono eventi in una categoria?",
        answer:
          "Il testo della guida resta. Puoi aprire i comuni, tornare più tardi, o pubblicare un appuntamento se lo organizzi.",
      },
      {
        question: "Le feste Unesco hanno una pagina a parte?",
        answer:
          "Candelieri e canto a tenore sono citati nelle guide, con link Unesco. Le date dell’edizione restano sulle schede evento e sugli hub.",
      },
    ],
    sources: [
      {
        label: "UNESCO — Canto a tenore",
        href: "https://ich.unesco.org/en/RL/canto-a-tenore-sardinian-pastoral-songs-00165",
      },
      {
        label: "UNESCO — Feste delle grandi macchine a spalla",
        href: "https://ich.unesco.org/en/RL/celebrations-of-big-shoulder-borne-processional-structures-00721",
      },
      {
        label: "Regione Autonoma della Sardegna",
        href: "https://www.regione.sardegna.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/eventi-sardegna", label: "Eventi e sagre" },
      { href: "/cultura-sarda", label: "Scopri la Sardegna" },
      { href: "/cultura/tradizioni-sarde", label: "Feste e tradizioni" },
      { href: "/cultura/cucina-sarda", label: "Cucina tradizionale" },
      { href: "/cultura/musica-canto-poesia-sarda", label: "Musica e poesia" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/eventi/famiglie-bambini", label: "Eventi per famiglie" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: [
      "sagre-tradizioni",
      "celebrazioni",
      "musica-concerti",
      "fiere-mercatini",
      "arte-cultura",
      "famiglie-bambini",
    ],
    eventSectionTitle: "Eventi in calendario collegati a queste guide",
    publishedAt: "2026-09-20",
  },
];
