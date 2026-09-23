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
const PUBLIC_DOMAIN = {
  license: "Public domain",
  licenseUrl: "https://creativecommons.org/publicdomain/mark/1.0/deed.it",
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

export const CULTURA_GUIDE_ARTICLES: CulturaArticle[] = [
  {
    slug: "storia-sardegna",
    path: "/cultura/storia-sardegna",
    kind: "guide",
    title: "Storia della Sardegna: dalle prime civiltà all’isola contemporanea",
    h1: "Storia della Sardegna: un viaggio attraverso i secoli",
    description:
      "Cronologia verificabile della Sardegna: preistoria, Ozieri, nuraghi, Fenici e Roma, giudicati, Aragona, Spagna, Savoia, Italia e autonomia, con musei e siti da visitare.",
    intro:
      "Questa guida è una linea del tempo, non un romanzo delle origini. Le date e i nomi che seguono si appoggiano a scavi, trattati e leggi. Dove gli studiosi discutono (funzione dei nuraghi, identità dei popoli nuragici) lo diciamo. Non usiamo teorie su «civiltà perdute» o genealogie inventate.",
    excerpt:
      "Preistoria, nuraghi, giudicati, Aragona e autonomia: una cronologia da leggere con i documenti.",
    hero: wikiCommonsPhoto({
      src: "/images/cultura/cultura-storia-castello-hero.webp",
      alt: "Il quartiere di Castello a Cagliari in una xilografia storica: il colle pisano e aragonese",
      author: "Giuseppe Barberis",
      commonsFile: "Cagliari Panorama del Quartiere di Castello.jpg",
      ...PUBLIC_DOMAIN,
    }),
    sections: [
      {
        title: "La Sardegna preistorica",
        paragraphs: [
          "Le prime comunità stabili sull’isola si collocano nel Neolitico. Villaggi, sepolture ipogeiche (domus de janas) e ceramiche dipinte documentano società agricole e pastorali, in contatto con altre sponde del Mediterraneo. Le datazioni precise dipendono dai siti e dalle campagne di scavo: i musei archeologici di Cagliari e Sassari tengono i reperti e gli apparati scientifici aggiornati.",
          "Non esiste un unico «popolo preistorico sardo» da mettere in una didascalia. Ci sono facies culturali successive, con discontinuità e influssi. Per vederne i materiali si parte dalle vetrine, non da un itinerario da copertina.",
        ],
      },
      {
        title: "La cultura di Ozieri",
        paragraphs: [
          "La cultura di Ozieri (o di San Michele), dal nome del territorio del Logudoro, è una delle facies neolitiche meglio documentate sull’isola: ceramica, idoletti, sepolture. Il Museo civico archeologico di Ozieri e il Museo nazionale G.A. Sanna a Sassari ne conservano collezioni. Il nome della cultura è una convenzione archeologica, non il «fondatore» mitico del paese.",
          "Ozieri oggi è un comune con una propria guida su EVERAS. La cultura preistorica e la città contemporanea non coincidono: si attraversano nello stesso territorio. Per orari del museo si consulta il Comune o la rete museale, non questa pagina.",
        ],
      },
      {
        title: "Nuraghi e civiltà nuragica",
        paragraphs: [
          "I nuraghi sono torri e complessi in pietra a secco dell’età del Bronzo, sparsi in gran parte dell’isola. Su Nuraxi di Barumini è iscritto nella Lista del patrimonio mondiale Unesco dal 1997. Accanto ai nuraghi gli scavi documentano villaggi, tombe dei giganti, pozzi sacri. La funzione originaria (difesa, residenza, culto, controllo del territorio) è oggetto di dibattito scientifico: non c’è una spiegazione unica certificata per tutti i monumenti.",
          "«Civiltà nuragica» è il nome usato dagli archeologi per queste società. Non implica un regno unitario né una scrittura decifrata. Per distinguere fatti di scavo e interpretazioni, la guida ai nuraghi è il posto dedicato. Qui basta il rinvio: Barumini, i musei, le schede dei comuni che hanno un sito visitabile.",
        ],
      },
      {
        title: "Fenici, Punici e Romani",
        paragraphs: [
          "Dal IX-VIII secolo a.C. gli scali fenici (tra cui quelli del golfo di Cagliari e del Sinis) legano l’isola alle rotte del Mediterraneo occidentale. Cartagine estende il controllo; dopo la prima guerra punica Roma organizza la provincia di Sardinia (con la Corsica, in fasi diverse). Città, strade, ville, iscrizioni latine: il segno romano è documentato, non è una vernice da «tour romano».",
          "Nora, Tharros, Karales (Cagliari) sono i nomi che tornano nei manuali e nei parchi archeologici. Accessi, biglietti e orari sono dei gestori dei siti (Comune, Ministero della Cultura, consorzi). EVERAS non li copia: linka gli eventi culturali quando un organizzatore li pubblica.",
        ],
      },
      {
        title: "I Giudicati",
        paragraphs: [
          "Nel Medioevo l’isola è organizzata in giudicati: Cagliari, Arborea, Torres (Logudoro), Gallura. Sono enti politici con corti, condaghes (registri) e, in Arborea, una tradizione legislativa nota (Carta de Logu, associata a Eleonora d’Arborea). Non sono «quattro regni da fiaba»: sono formazioni storiche, con alleanze e conflitti con Pisa, Genova e poi la Corona d’Aragona.",
          "La scheda su Eleonora d’Arborea in questa stessa sezione culturale approfondisce un nodo di quella storia. Oristano e i comuni dell’Arborèa tengono memoria nei musei civici e nelle feste, senza che ogni piazza sia automaticamente «giudicale».",
        ],
      },
      {
        title: "La conquista aragonese",
        paragraphs: [
          "La Corona d’Aragona interviene in Sardegna nel Trecento. La presa di Cagliari e la lunga guerra con Arborea (fino alla sconfitta arborense nel Quattrocento) sono fatti di cronaca politica e militare, non un’annessione istantanea di tutta l’isola. Restano fonti in catalano e in sardo, e una geografia di castelli e ville.",
          "Alghero, ripopolata in parte da catalani dopo la conquista, è il caso più visibile di quella fase sul piano linguistico. La guida del comune e, in seguito, la pagina sulle lingue tengono il distinguo: storia urbana, non etichetta per tutta la Nurra.",
        ],
      },
      {
        title: "La Sardegna sotto la Spagna",
        paragraphs: [
          "Con l’unione delle corone iberiche l’isola resta nel sistema spagnolo: viceré, Inquisizione, privilegi cittadini, gremi. Sassari e Cagliari consolidano corporazioni che ancora oggi portano i candelieri o organizzano cortei. Gli archivi comunali e diocesani sono la fonte; molti fondi sono lacunosi per saccheggi e incendi, come ricordano gli storici locali sui Candelieri.",
          "Non riduciamo tre secoli a «dominazione». Ci sono rivolte, peste, riforme, e una società di villaggi che continua a parlare sardo e a tenere santi propri. Per i riti che sopravvivono, si vedano le guide alle feste, non questa cronologia.",
        ],
      },
      {
        title: "Il periodo sabaudo",
        paragraphs: [
          "Nel 1720, con il trattato dell’Aia, il Regno di Sardegna passa ai Savoia. Arrivano riforme amministrative, nuove classi dirigenti, progetti di «modernizzazione» che gli storici discutono (enfiteusi, chiusure dei terreni, rapporti con le comunità). Cagliari resta capitale del regno sabaudo che, nell’Ottocento, sarà il nucleo dello Stato italiano.",
          "Garibaldi a Caprera è un capitolo di questa transizione, trattato in un articolo a parte. Non è la sintesi dell’isola: è un episodio documentato in un arcipelago specifico.",
        ],
      },
      {
        title: "La Sardegna nell’Italia unita",
        paragraphs: [
          "Dal 1861 l’isola è regione del Regno d’Italia. Banditismo, questione sarda, emigrazione, miniere del Sulcis-Iglesiente, malaria e bonifiche: sono temi di storia sociale ed economica, con fonti parlamentari e inchieste. Il Novecento porta le due guerre, il fascismo, la Resistenza, e intellettuali (Gramsci, Lussu, Deledda) che partono da paesi precisi.",
          "Le biografie in Cultura sarda (Deledda, Gramsci, Lussu, Cossiga, Maria Carta) non sostituiscono un manuale. Servono a non staccare i nomi celebri dai comuni. Le schede paese restano il luogo in cui quella storia ha una strada e un museo.",
        ],
      },
      {
        title: "La Sardegna contemporanea",
        paragraphs: [
          "Lo Statuto speciale del 1948 istituisce la Regione autonoma della Sardegna. Industria, turismo costiero, spopolamento dell’interno, lingue, beni culturali: le politiche regionali e nazionali si intrecciano. I dati demografici e occupazionali si leggono su Istat e Regione, non in una guida culturale.",
          "Oggi un calendario di sagre e mostre è anche un indicatore di chi tiene ancora le piazze. EVERAS pubblica le date che organizzatori e enti inseriscono: è un documento dell’anno in corso, non la prova che «la tradizione è eterna».",
        ],
      },
      {
        title: "Dove vedere la storia della Sardegna oggi",
        paragraphs: [
          "Musei nazionali archeologici di Cagliari e Sassari (Sanna), parco di Barumini, aree di Nora e Tharros, musei civici (Ozieri, Cabras per Mont’e Prama, e altri). Orari e tariffe: siti del Ministero della Cultura, della Regione e dei Comuni. Questa pagina non li elenca perché cambiano.",
          "Su EVERAS: guida Ozieri, Barumini, Sassari, Cagliari, Oristano; articoli su Eleonora, Deledda, Gramsci; categoria Arte e cultura per mostre e visite guidate pubblicate. Se organizzi una conferenza o un’apertura straordinaria, la scheda evento è il posto giusto: non va scritta a mano in questa cronologia.",
        ],
      },
    ],
    faqs: [
      {
        question: "Qual è la data di inizio della civiltà nuragica?",
        answer:
          "Gli archeologi la collocano nell’età del Bronzo, con fasi diverse secondo i siti. Non c’è un anno di fondazione unico. Unesco data l’iscrizione di Barumini al 1997; la costruzione dei nuraghi è millenni prima.",
      },
      {
        question: "I giudicati coprivano tutta la Sardegna?",
        answer:
          "I quattro giudicati (Cagliari, Arborea, Torres, Gallura) organizzano gran parte dell’isola nel Medioevo, con confini e alleanze che cambiano. Non sono equivalenti alle province di oggi.",
      },
      {
        question: "Dove vedere reperti nuragici a Sassari o Cagliari?",
        answer:
          "Al Museo nazionale G.A. Sanna a Sassari e al Museo archeologico nazionale di Cagliari. Conferma aperture sul sito ufficiale prima di partire.",
      },
    ],
    sources: [
      {
        label: "UNESCO — Su Nuraxi di Barumini",
        href: "https://whc.unesco.org/en/list/833/",
      },
      {
        label: "Museo archeologico nazionale di Cagliari (rete musei Sardegna)",
        href: "https://www.musei.sardegna.beniculturali.it/",
      },
      {
        label: "Museo nazionale G.A. Sanna, Sassari (rete musei Sardegna)",
        href: "https://www.musei.sardegna.beniculturali.it/",
      },
      {
        label: "Regione Autonoma della Sardegna — Statuto speciale",
        href: "https://www.regione.sardegna.it/",
      },
      {
        label: "Comune di Ozieri — Museo civico",
        href: "https://www.comune.ozieri.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura-sarda/sud-sardegna/barumini", label: "Guida Barumini" },
      { href: "/cultura-sarda/nord-sardegna/ozieri", label: "Guida Ozieri" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/cultura/nuraghi-archeologia-sardegna", label: "Nuraghi e archeologia" },
      { href: "/cultura/musei-sardegna", label: "Musei per territorio" },
      { href: "/cultura/eleonora-darborea", label: "Eleonora d’Arborea" },
      { href: "/eventi/arte-cultura", label: "Arte e cultura in calendario" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["arte-cultura"],
    eventSectionTitle: "Mostre e appuntamenti di storia e archeologia",
    publishedAt: "2026-09-20",
  },
  {
    slug: "tradizioni-sarde",
    path: "/cultura/tradizioni-sarde",
    kind: "guide",
    title: "Tradizioni sarde: feste, riti e cultura popolare",
    h1: "Tradizioni sarde: feste, riti e cultura popolare",
    description:
      "Feste e riti: Settimana Santa, carnevali, patronali, processioni, sagre agricole e abiti, con il calendario vivo di EVERAS.",
    intro:
      "Una tradizione, qui, è una pratica che una comunità ripete e riconosce: un lunedì santo, una corsa a cavallo, un santo patrono, un pane di festa. Non è un marchio turistico. Questa guida tiene i tipi di festa distinti e rimanda alle schede dei paesi e alle grandi feste documentate. Le date dell’anno in corso stanno nel database eventi, non in queste frasi.",
    excerpt:
      "Carnevali, Settimana Santa, patronali e sagre: come si tengono, e dove vederle sul calendario.",
    hero: wikiCommonsPhoto({
      src: "/images/cultura/cultura-tradizioni-mamuthones-hero.webp",
      alt: "Mamuthone di Mamoiada: maschera nera, pelle di pecora e campanacci",
      author: "Alice Grussu",
      commonsFile: "Mamuthones.jpg",
      ...CC_BY_SA_4,
    }),
    sections: [
      {
        title: "Perché le feste sono importanti nella cultura sarda",
        paragraphs: [
          "In molti comuni l’anno si misura ancora sui santi, sui raccolti e sulla Quaresima. La festa organizza lavoro, spesa, musica e chi può entrare in corteo. Gremi, confraternite, Pro Loco e parrocchie non sono comparse: sono gli enti che tengono il rito, con statuti e ruoli.",
          "Ridurre tutto a «folklore» cancella queste differenze. Un voto alla Madonna dopo un’epidemia (come nelle memorie sui Candelieri di Sassari) non è la stessa cosa di una sagra di prodotto nata nel Novecento. La guida alle grandi feste approfondisce i casi più documentati; qui resta la mappa dei tipi.",
        ],
      },
      {
        title: "Settimana Santa e riti religiosi",
        paragraphs: [
          "La Settimana Santa ha forme locali: processioni, confraternite, canti. A Castelsardo il Lunissanti (lunedì santo) è tra i riti più descritti dalle fonti comunali e diocesane. Altri paesi tengono addobbi, statue vestite, percorsi diversi. Non esiste un unico copione isolano.",
          "Orari delle processioni: bollettini parrocchiali e Comuni dell’anno in corso. Su EVERAS compaiono quando un organizzatore pubblica la scheda. La guida Castelsardo resta il rinvio territoriale.",
        ],
      },
      {
        title: "Carnevali della Sardegna",
        paragraphs: [
          "Mamoiada (Mamuthones e Issohadores) e Ottana (Boes e Merdules) sono i carnevali dell’interno più citati in letteratura etnografica: maschere di legno, pelle, campanacci. Sa Sartiglia a Oristano è un’altra grammatica: giostra equestre dei gremi, a Carnevale. Non vanno mescolati in un unico «carnevale sardo».",
          "Date: dipendono dal calendario liturgico (martedì grasso e dintorni) e dalle delibere dei Comuni. Hub EVERAS: Carnevale in Sardegna, schede Mamoiada e Ottana, articolo e hub Sartiglia.",
        ],
      },
      {
        title: "Feste patronali",
        paragraphs: [
          "Ogni comune ha uno o più santi titolari. La patronale può durare un giorno o una settimana: messa, processione, stand, concerti. Non le elenchiamo tutte: sarebbero un rubrica parrocchiale, non una guida. Il modo onesto è la scheda del comune e il filtro città sul calendario.",
          "Alcune patronali sono diventate attrattori regionali (Sant’Efisio a Cagliari, Sagra del Redentore a Nuoro). Restano comunque feste di una città, con confraternite e itinerari propri. Vedi la guida alle grandi feste.",
        ],
      },
      {
        title: "Processioni e riti comunitari",
        paragraphs: [
          "Processioni mariane, discese di candelieri, corse a cavallo votive (Ardia di Sedilo, Corsa degli Scalzi a Cabras): sono riti in cui il corpo della comunità occupa la strada. Il significato dichiarato (voto, ringraziamento, identità di gremio) sta nelle fonti locali. L’interpretazione antropologica è un altro piano: qui non la spacciamo per fatto.",
          "Percorsi e chiusure stradali li decidono i Comuni. EVERAS non li anticipa.",
        ],
      },
      {
        title: "Feste legate alla primavera e all’estate",
        paragraphs: [
          "Primavera: Settimana Santa, prime sagre, alcune patronali. Estate: mare, piazze, concerti accanto ai santi. Autunno in Barbagia (Cortes Apertas) è un circuito di paesi, non una singola sagra: ha un hub con tabella tappe. Sant’Efisio parte il 1° maggio da Cagliari verso Nora, secondo il calendario dell’Arciconfraternita e del Comune.",
          "«Feste sul mare» non è una categoria storica: è un modo contemporaneo di occupare lungomare e piazze. Sta nel calendario estivo, distinto dai voti antichi.",
        ],
      },
      {
        title: "Tradizioni agricole e pastorali",
        paragraphs: [
          "Vendemmie, raccolti, sant’Antonio, sagre del formaggio o del grano: le fonti sono spesso Pro Loco e cooperative, nate nel Novecento o dopo. Non tutte hanno un rito «antico» documentato. Distinguere una sagra di promozione da un voto agricolo richiede la scheda del paese e, se c’è, lo statuto della festa.",
          "Il calendario sagre di EVERAS raccoglie quelle pubblicate. Non è l’inventario completo dell’isola.",
        ],
      },
      {
        title: "Musica, canto e abiti tradizionali",
        paragraphs: [
          "In molte feste si indossa l’abito del paese e si canta. L’abito non è un costume da noleggio: taglio e gioiello dicono il comune. Il canto a tenore è patrimonio Unesco; altri repertori (launeddas, cori, chitarra) hanno geografie diverse. Le guide su costumi e musica approfondiscono abiti e repertori; qui il rinvio è alle feste in cui quei segni si vedono (Cavalcata, patronali, Carnevale).",
          "Non fotografiamo «il sardo in costume» come tipo. Indichiamo il territorio quando parliamo di un abito.",
        ],
      },
      {
        title: "Tradizioni che cambiano nel tempo",
        paragraphs: [
          "Percorsi, orari, pubblici e finanziamenti cambiano. Una sagra può nascere per il turismo e poi radicarsi; un rito può accorciarsi. I giovani imparano maschere e canti in associazioni, non solo in famiglia. Questo non «invalida» la festa: è la sua storia recente.",
          "La guida sulle tradizioni oggi approfondisce turismo, Pro Loco e digitale. Intanto ogni scheda evento su EVERAS è già l’edizione di quest’anno, non quella di cinquant’anni fa.",
        ],
      },
      {
        title: "Le tradizioni sarde negli eventi di oggi",
        paragraphs: [
          "Sotto, gli appuntamenti di sagre e celebrazioni pubblicati in calendario. Se la lista è vuota, la guida resta utile: puoi aprire i paesi, le grandi feste, o pubblicare un evento se lo organizzi.",
          "Per Cavalcata, Candelieri, Sartiglia, Sant’Efisio, Autunno in Barbagia: usa anche gli hub in Eventi in Sardegna, dove le date sono legate alle schede.",
        ],
      },
    ],
    faqs: [
      {
        question: "Qual è la differenza tra sagra e festa patronale?",
        answer:
          "La patronale è legata al santo del paese e al calendario liturgico. La sagra è spesso (non sempre) una festa di prodotto o di piazza, a volte nata nel Novecento. Nella pratica i due calendari si sovrappongono: la scheda evento e il Comune dicono come è presentata l’edizione.",
      },
      {
        question: "Le maschere di Mamoiada si vedono solo a Carnevale?",
        answer:
          "Il rito principale è il carnevale locale. Uscite in altri periodi vanno verificate sul calendario del Comune o della Pro Loco, non date per scontate.",
      },
      {
        question: "Dove trovo le date di quest’anno?",
        answer:
          "Sulle schede evento EVERAS e sui siti di Comuni e confraternite. Questa guida non fissa orari.",
      },
    ],
    sources: [
      {
        label: "UNESCO — Canto a tenore",
        href: "https://ich.unesco.org/en/RL/canto-a-tenore-sardinian-pastoral-songs-00165",
      },
      {
        label: "Comune di Castelsardo",
        href: "https://www.comune.castelsardo.ss.it/",
      },
      {
        label: "Comune di Cagliari — Sant’Efisio",
        href: "https://www.comune.cagliari.it/",
      },
      {
        label: "Regione Autonoma della Sardegna",
        href: "https://www.regione.sardegna.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/grandi-feste-sarde", label: "Grandi feste tradizionali" },
      { href: "/cultura/musica-canto-poesia-sarda", label: "Musica e poesia" },
      { href: "/cultura/costumi-sardi", label: "Costumi tradizionali" },
      {
        href: "/cultura/calendario-tradizioni-sarde",
        label: "Tradizioni durante l’anno",
      },
      { href: "/eventi-sardegna/carnevale-sardegna", label: "Carnevale in Sardegna" },
      {
        href: "/cultura-sarda/centro-sardegna/mamoiada",
        label: "Guida Mamoiada",
      },
      {
        href: "/cultura-sarda/centro-sardegna/ottana",
        label: "Guida Ottana",
      },
      { href: "/cultura-sarda/nord-sardegna/castelsardo", label: "Guida Castelsardo" },
      { href: "/eventi-sardegna/sagre", label: "Sagre in Sardegna" },
      { href: "/eventi/celebrazioni", label: "Celebrazioni in calendario" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["sagre-tradizioni", "celebrazioni"],
    eventSectionTitle: "Sagre, riti e feste in calendario",
    publishedAt: "2026-09-20",
  },
  {
    slug: "grandi-feste-sarde",
    path: "/cultura/grandi-feste-sarde",
    kind: "guide",
    title: "Grandi feste tradizionali della Sardegna",
    h1: "Grandi feste tradizionali della Sardegna",
    description:
      "Sant’Efisio, Cavalcata Sarda, Candelieri, Sartiglia, Redentore, Autunno in Barbagia e altri riti documentati: dove, quando in senso largo, significato e link alle schede EVERAS.",
    intro:
      "Questa pagina non è una classifica. «Grande» qui significa: festa con fonti pubbliche (Comune, confraternita, Unesco, letteratura storica) e un raggio che supera il solo quartiere. Per ogni caso indichiamo dove si svolge, il periodo nel calendario, ciò che è documentato su origine e segni distintivi. Le date esatte dell’edizione stanno sulle schede evento e sugli hub in Eventi in Sardegna.",
    excerpt:
      "Le feste più documentate dell’isola, senza «la più importante», con rinvio a calendari e guide paese.",
    hero: {
      src: "/images/cultura/candelieri-sassari-hero.webp",
      alt: "Candelieri portati in processione nel centro di Sassari",
      credit: everasPhoto("/cultura/grandi-feste-sarde"),
    },
    sections: [
      {
        title: "Sant’Efisio a Cagliari",
        paragraphs: [
          "Dove: Cagliari, con pellegrinaggio verso Nora (Pula). Periodo: tradizionalmente dal 1° maggio, secondo il calendario dell’Arciconfraternita del Gonfalone e del Comune di Cagliari. Origine: culto del martire Efisio, con processione documentata in età moderna e contemporanea come festa votiva della città.",
          "Segni distintivi: carri, abiti dei paesi che partecipano, tragitto verso Nora. Non la definiamo «la festa più importante della Sardegna»: è la patronale-processione più visibile del capoluogo, con partecipazione di delegazioni da altri comuni. Evoluzione: il percorso e i servizi cambiano per viabilità e sicurezza; i dettagli sono del Comune. Hub EVERAS: /eventi-sardegna/sant-efisio. Guida: Cagliari, Pula.",
        ],
      },
      {
        title: "Cavalcata Sarda a Sassari",
        paragraphs: [
          "Dove: Sassari. Periodo: di solito metà maggio; il giorno esatto lo pubblica il Comune ogni anno. Origine: nata in età sabauda (fine Ottocento) in occasione di una visita reale, poi diventata rassegna dei gruppi in costume da vari paesi dell’isola, con pariglie all’ippodromo.",
          "È una festa laica di città, non un rito di gremio come i Candelieri. Patrimonio: non risulta iscritta Unesco come i Candelieri. Articolo EVERAS: Cavalcata Sarda; hub calendario; guida Sassari.",
        ],
      },
      {
        title: "Festa dei Candelieri a Sassari",
        paragraphs: [
          "Dove: Sassari, corso e chiese del centro. Periodo: la Faradda è tradizionalmente la sera del 14 agosto, vigilia dell’Assunta. Origine: voto e offerta di ceri legati alla peste e alla Vergine; documenti cittadini cinquecenteschi e memoria dei gremi. Dal 2013 la festa è inclusa, con Nola, Palmi e Viterbo, nella rete Unesco delle «grandi macchine a spalla».",
          "Segni: candelieri lignei portati dai gremi, ordine di ingresso, musiche. Non è una sfilata folklorica inventata per l’estate. Articolo, hub e guida Sassari su EVERAS. Orari minuto per minuto: Comune e gremi.",
        ],
      },
      {
        title: "Sa Sartiglia a Oristano",
        paragraphs: [
          "Dove: Oristano. Periodo: domenica e martedì di Carnevale (gremio dei Contadini e dei Falegnami). Origine: giostra equestre di età spagnola, tenuta dai gremi; il Componidori, la stella, la maschera e le pariglie sono gli elementi distintivi descritti dalle fonti oristanesi.",
          "Non è un palio «tipico sardo» intercambiabile con Sedilo o con la Cavalcata. Articolo EVERAS e hub /eventi-sardegna/sa-sartiglia; guida Oristano.",
        ],
      },
      {
        title: "Sagra del Redentore a Nuoro",
        paragraphs: [
          "Dove: Nuoro, con il monte Ortobene. Periodo: fine agosto, in relazione alla statua del Redentore sul monte (inaugurata nel 1901) e alla festa della città. Origine: festa religiosa e civile nuorese, con processione e presenza di gruppi in costume.",
          "Partecipano delegazioni da altri paesi, ma resta una festa di Nuoro. Date e programma: Comune di Nuoro. Su EVERAS: guida Nuoro e schede evento quando pubblicate. Non c’è, in questa fase, un hub festival dedicato.",
        ],
      },
      {
        title: "Autunno in Barbagia",
        paragraphs: [
          "Dove: paesi della Barbagia e del Mandrolisai, a turno. Periodo: autunno, un borgo (o più) ogni weekend; il calendario tappe cambia ogni anno. Origine contemporanea: circuito di Cortes Apertas, ospitalità in corti e botteghe, coordinato tra comuni. Non è un rito unico medievale: è una rete di aperture di paesi.",
          "Hub EVERAS con tabella tappe: /eventi-sardegna/autunno-in-barbagia. Le schede dei singoli paesi (Mamoiada, Oliena, Gavoi, ecc.) restano in Scopri la Sardegna. Non inventiamo il programma di un weekend se manca la scheda.",
        ],
      },
      {
        title: "Settimana Santa di Castelsardo",
        paragraphs: [
          "Dove: Castelsardo. Periodo: Lunissanti, lunedì della Settimana Santa. Origine: rito della confraternita, con canti e percorso nel centro storico, descritto dalle fonti locali. È una Settimana Santa di un comune, non il modello di tutta l’isola.",
          "Guida Castelsardo su EVERAS. Orari: parrocchia e Comune. Collegamento anche all’intreccio e all’Anglona nella guida paese, quando il testo lo consente.",
        ],
      },
      {
        title: "Altre feste documentate",
        paragraphs: [
          "Ardia di Sedilo (San Costantino, 6-7 luglio): corsa votiva a cavallo; hub EVERAS /eventi-sardegna/ardia-sedilo. Corsa degli Scalzi a Cabras: rito legato a San Salvatore di Sinis; hub dedicato. Sposalizio Selargino a Selargius: matrimonio tradizionale in costume, in settembre. Sagra degli agrumi a Muravera: festa di prodotto del Sarrabus, con hub in calendario.",
          "JazzAlguer, Santa Greca, Festival della Bottarga, Isole che Parlano sono rassegne o feste con forte identità locale, ma di natura diversa (festival, patronale lunga, rassegna culturale). Restano negli hub evento. Non le mescoliamo ai voti Unesco o alle giochi equestri senza dirlo.",
        ],
      },
      {
        title: "Le feste nel calendario EVERAS",
        paragraphs: [
          "Sotto: sagre e celebrazioni pubblicate. Per una festa specifica apri l’hub o l’articolo. Se organizzi un’edizione, pubblica la scheda: entra in guida e in città senza che riscriviamo a mano questa pagina.",
        ],
      },
    ],
    faqs: [
      {
        question: "Quale festa Unesco c’è in Sardegna tra queste?",
        answer:
          "I Candelieri di Sassari sono nella rete Unesco delle grandi macchine a spalla (2013). Il canto a tenore è un altro elemento Unesco, musicale, non una singola festa di piazza. Barumini è patrimonio mondiale come sito archeologico.",
      },
      {
        question: "Sant’Efisio è sempre il 1° maggio?",
        answer:
          "Il 1° maggio è la data tradizionale d’inizio a Cagliari, confermata dalle fonti comunali e dell’Arciconfraternita. Variazioni di percorso o orario si leggono sul programma dell’anno.",
      },
      {
        question: "Cavalcata e Candelieri sono la stessa festa?",
        answer:
          "No. Cavalcata: primavera, gruppi da tutta l’isola, festa laica. Candelieri: 14 agosto, gremi sassaresi, voto all’Assunta.",
      },
    ],
    sources: [
      {
        label: "UNESCO — Grandi macchine a spalla (Candelieri)",
        href: "https://ich.unesco.org/en/RL/celebrations-of-big-shoulder-borne-processional-structures-00721",
      },
      {
        label: "Comune di Cagliari",
        href: "https://www.comune.cagliari.it/",
      },
      {
        label: "Comune di Sassari",
        href: "https://www.comune.sassari.it/",
      },
      {
        label: "Comune di Oristano",
        href: "https://www.comune.oristano.it/",
      },
      {
        label: "Comune di Nuoro",
        href: "https://www.comune.nuoro.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/tradizioni-sarde", label: "Feste e tradizioni" },
      { href: "/cultura/costumi-sardi", label: "Costumi tradizionali" },
      { href: "/cultura/candelieri-sassari", label: "Candelieri, approfondimento" },
      { href: "/cultura/cavalcata-sarda-sassari", label: "Cavalcata Sarda" },
      { href: "/cultura/sa-sartiglia-oristano", label: "Sa Sartiglia" },
      { href: "/eventi-sardegna/sant-efisio", label: "Sant’Efisio, calendario" },
      {
        href: "/eventi-sardegna/autunno-in-barbagia",
        label: "Autunno in Barbagia",
      },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/cultura-sarda/sud-sardegna/cagliari", label: "Guida Cagliari" },
      { href: "/cultura-sarda/centro-sardegna/nuoro", label: "Guida Nuoro" },
      { href: "/cultura-sarda/centro-sardegna/oristano", label: "Guida Oristano" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["sagre-tradizioni", "celebrazioni"],
    eventSectionTitle: "Feste e riti in programma",
    publishedAt: "2026-09-20",
  },
  {
    slug: "artigianato-sardo",
    path: "/cultura/artigianato-sardo",
    kind: "guide",
    title: "Artigianato sardo: mestieri, materiali e territori",
    h1: "Artigianato sardo: mestieri, materiali e tradizioni ancora vive",
    description:
      "Tessitura, coltelli, intreccio, sughero, corallo, ceramica e filigrana: territori associati, musei e fiere, senza vetrina commerciale.",
    intro:
      "Un mestiere sardo è spesso un paese, un materiale e una scuola di bottega. Questa guida associa filiere e territori quando le fonti (musei civici, disciplinari, letteratura locale) lo fanno. Non è un catalogo di vendita e non certifica «l’artigiano più autentico». Per visitare una bottega servono contatto e orario del laboratorio, che qui non si inventano.",
    excerpt:
      "Da Pattada ad Aggius, da Castelsardo ad Alghero: mestieri legati a un territorio, non a un souvenir generico.",
    hero: {
      src: "/images/cultura/pattada-coltellinaio-everas.webp",
      alt: "Artigiano al lavoro sulla resolza pattadese in bottega a Pattada",
      credit: everasPhoto("/cultura-sarda/nord-sardegna/pattada"),
    },
    sections: [
      {
        title: "Tessitura",
        paragraphs: [
          "Tappeti e tessuti a mano sono documentati in più centri dell’interno e della Gallura. Aggius tiene il Museo etnografico Oliva Carta Cannas (MEOC) e una tradizione di tappeto che la guida del paese racconta senza farne una vetrina. Altri paesi della Barbagia e del Logudoro hanno sarte e telai: la presenza va verificata sul posto, comune per comune.",
          "Fiere e dimostrazioni compaiono a volte nelle Cortes Apertas e in mostre civiche. Date: calendario EVERAS e Comuni.",
        ],
      },
      {
        title: "Ceramica",
        paragraphs: [
          "Assemini, nell’area cagliaritana, è associata alla ceramica nella letteratura locale e nelle attività produttive del Novecento e contemporanee. Non è l’unico centro: botteghe esistono altrove, con stili diversi. Orari di laboratori: i produttori e il Comune, non questa pagina.",
          "Mostre e mercati di ceramica, quando pubblicati, cadono in fiere e artigianato sul calendario.",
        ],
      },
      {
        title: "Coltelleria",
        paragraphs: [
          "Pattada è il comune più legato alla resolza (rasola) nella percezione comune e nella storiografia locale del mestiere. La guida Pattada su EVERAS è il testo di approfondimento: botteghe, museo, come non ridurre il paese a un coltello da vetrina. Altri centri hanno fabbri e coltellinai: non li elenchiamo senza fonte.",
          "Una fiera di coltelli è un evento, non la prova dell’identità del paese. Se è in calendario, la scheda lo dice.",
        ],
      },
      {
        title: "Intreccio",
        paragraphs: [
          "Castelsardo è associato all’intreccio di fibre vegetali (cestini, nasse) nelle guide locali e nel museo dell’intreccio. La scheda paese tiene insieme mestiere, centro storico e Lunissanti. L’intreccio esiste anche in altri comuni costieri e di stagno: Castelsardo non è un monopolio, è il caso più visibile nel Nord.",
        ],
      },
      {
        title: "Lavorazione del sughero",
        paragraphs: [
          "La Gallura, in particolare Tempio Pausania e Calangianus, è il distretto del sughero più documentato: fabbriche, museo delle macchine a Tempio, paesaggio da sughereta. La guida Tempio e quella di Calangianus (classe B, da arricchire) sono i rinvii. Il sughero è industria e mestiere, non solo souvenir di tappo.",
        ],
      },
      {
        title: "Corallo",
        paragraphs: [
          "Alghero è storicamente legata al corallo rosso: pesca, lavorazione, gioielleria. Fonti: Comune, musei cittadini, normativa sulla pesca. Non è un invito a comprare corallo in spiaggia. La guida Alghero e la pagina sulle lingue (catalano) tengono mestiere e identità urbana distinti.",
        ],
      },
      {
        title: "Legno, gioielleria, strumenti",
        paragraphs: [
          "Maschere di carnevale (Mamoiada, Ottana) sono scultura in legno con funzione rituale, non arredo. La filigrana (oro, argento) è mestiere orato documentato in più centri; il corallo di Alghero vi si intreccia. Launeddas e altri strumenti hanno costruttori e scuole: per nomi e visite servono associazioni e musei etnografici, non un elenco pubblicitario.",
        ],
      },
      {
        title: "Fiere, botteghe e calendario",
        paragraphs: [
          "Sotto: fiere, mercatini e sagre pubblicate, che a volte includono dimostrazioni di mestiere. Se non c’è nulla in programma, restano le guide dei paesi e la possibilità di pubblicare una mostra o una fiera. EVERAS non intermedia la vendita.",
        ],
      },
    ],
    faqs: [
      {
        question: "Si può visitare una bottega a Pattada o Aggius?",
        answer:
          "Alcune botteghe accolgono visitatori su appuntamento. Non pubblichiamo orari: chiama il laboratorio o il Comune. Le guide paese spiegano il mestiere senza fare da catalogo.",
      },
      {
        question: "Il sughero si vede solo in Gallura?",
        answer:
          "Il distretto più noto è gallurese (Tempio, Calangianus). Sugherete e lavorazioni esistono anche altrove. Per musei e fabbriche, parti dalle schede di quei comuni.",
      },
      {
        question: "Questa guida vende artigianato?",
        answer:
          "No. È un testo culturale. Eventuali fiere sono schede evento di terzi.",
      },
    ],
    sources: [
      {
        label: "Comune di Pattada",
        href: "https://www.comune.pattada.ss.it/",
      },
      {
        label: "Comune di Aggius — MEOC",
        href: "https://www.comune.aggius.ss.it/",
      },
      {
        label: "Comune di Castelsardo",
        href: "https://www.comune.castelsardo.ss.it/",
      },
      {
        label: "Comune di Alghero",
        href: "https://www.comune.alghero.ss.it/",
      },
      {
        label: "Comune di Tempio Pausania",
        href: "https://www.comune.tempiopausania.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura-sarda/nord-sardegna/pattada", label: "Guida Pattada" },
      { href: "/cultura-sarda/nord-sardegna/aggius", label: "Guida Aggius" },
      {
        href: "/cultura-sarda/nord-sardegna/castelsardo",
        label: "Guida Castelsardo",
      },
      {
        href: "/cultura-sarda/sud-sardegna/samugheo",
        label: "Guida Samugheo",
      },
      {
        href: "/cultura-sarda/sud-sardegna/assemini",
        label: "Guida Assemini",
      },
      { href: "/cultura-sarda/nord-sardegna/alghero", label: "Guida Alghero" },
      {
        href: "/cultura-sarda/nord-sardegna/tempio-pausania",
        label: "Guida Tempio Pausania",
      },
      { href: "/cultura/costumi-sardi", label: "Costumi tradizionali" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/eventi/fiere-mercatini", label: "Fiere e mercatini" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["fiere-mercatini", "sagre-tradizioni"],
    eventSectionTitle: "Fiere, sagre e mostre di mestiere",
    publishedAt: "2026-09-20",
  },
];
