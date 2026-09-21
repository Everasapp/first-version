import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";

const GIANNI = { author: "Gianni Careddu" } as const;

export const NORD_CULTURE_TOWNS: CultureTownArticle[] = [
  {
    slug: "sassari",
    path: "/cultura-sarda/nord-sardegna/sassari",
    town: "Sassari",
    province: "Sassari",
    area: "Sassarese",
    title: "Sassari: Candelieri, Museo Sanna e Cavalcata",
    h1: "Sassari",
    description:
      "Sassari: Faradda dei Candelieri Unesco, Museo Sanna, Cavalcata Sarda, cattedrale e centro.",
    hero: {
      src: "/images/cultura/sassari-panorama.webp",
      alt: "Panorama di Sassari sul colle, tra il centro storico e i quartieri nuovi",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Sassari,_panorama_(01).jpg",
      },
    },
    traditionPhoto: {
      src: "/images/cultura/sassari-candelieri.webp",
      alt: "La Discesa dei Candelieri lungo il corso di Sassari",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Sassari_-_La_Discesa_dei_candelieri_2012_(01).jpg",
      },
    },
    intro:
      "Sassari è la città del Nord: non un borgo da cartolina, una piazza che tiene gremi, museo e corso. Chi la cerca per i Candelieri o per la Cavalcata trova anche il Museo Sanna e un centro da camminare, senza trattarla solo come scalo verso il mare.",
    history: [
      "Nel Medioevo Sassari è comune libero nel giudicato di Torres, poi entra nell’orbita aragonese e spagnola. Resta città di corporazioni: i gremi, le confraternite di mestiere, sono ancora quelli che portano i candelieri.",
      "Piazza d’Italia, il Palazzo Ducale, il corso Vittorio Emanuele che scende verso Santa Maria di Betlem: il tessuto che vedi è Ottocento e Novecento sopra un nucleo più vecchio. Via Roma tiene il Museo Sanna, la più grande istituzione museale del Nord Sardegna. Fuori porta, Monte d’Accoddi è un altare prenuragico a terrazze: non è un nuraghe, è un’altra cosa, e vale il giro in auto.",
    ],
    language: [
      "In centro e nei quartieri si parla sassarese (sassaresu), una varietà che i linguisti collegano al gruppo tosco-corso, distinta dal sardo logudorese dei paesi intorno. Convive con l’italiano. Non pubblichiamo percentuali di parlanti: cambiano e non le inventiamo.",
      "La guida alle lingue tiene sassarese, gallurese e catalano di Alghero su piani diversi. Nei giorni dei Candelieri e della Cavalcata la piazza è mista: italiano, sassarese, sardo dei gruppi in costume.",
    ],
    traditions: [
      {
        title: "Faradda di li Candareri",
        body: "La sera del 14 agosto i gremi scendono i candelieri lignei da piazza Castello a Santa Maria di Betlem, voto all’Assunta. Tamburi, flauti, otto portatori per cero, ballo lungo il corso. Dal 2013 è patrimonio Unesco con la Rete delle grandi macchine a spalla italiane, insieme a Nola, Palmi e Viterbo. Non è una sfilata turistica: è il rito della città. Arriva presto, il centro si chiude. Storia e significato stanno nell’approfondimento sui Candelieri e nella guida alle grandi feste.",
      },
      {
        title: "Cavalcata Sarda",
        body: "A metà maggio Sassari tiene la Cavalcata: gruppi in costume da tutta l’isola, a piedi e a cavallo, poi le pariglie all’ippodromo Pinna. Nata a fine Ottocento per una visita reale, è diventata la grande festa laica dei vestiti. Date sul sito del Comune: ogni anno il programma si allarga ai giorni prima della domenica. Storia, abiti e calendario stanno nella scheda Cavalcata e nella guida ai costumi.",
      },
    ],
    crafts: [
      {
        title: "Gremi, mestieri di città",
        body: "I gremi che portano i candelieri nascono come corporazioni di mestiere. Oggi sono confraternite di festa più che botteghe da visitare: non c’è un «artigianato sassarese» unico da vetrina. Il posto per oggetti e abiti è la sezione etnografica del Museo Sanna e il Museo dei Candelieri accanto a Santa Maria di Betlem. Orari sui gestori, non qui.",
      },
    ],
    visit: [
      {
        name: "Museo nazionale Giovanni Antonio Sanna",
        body: "Via Roma 64, a pochi minuti da piazza d’Italia. Archeologia dal Neolitico all’età romana, pinacoteca, sezione etnografica. Chiuso il lunedì; di solito aperto la prima domenica del mese. Orari su musei.sardegna.beniculturali.it: cambiano, controlla prima. Non è un museo da mezz’ora: se ti interessa il Nord, parti da qui.",
      },
      {
        name: "Centro, cattedrale, Candelieri",
        body: "San Nicola in piazza Duomo, corso Vittorio Emanuele, piazza Tola, Santa Maria di Betlem in fondo alla discesa. Il Museo dei Candelieri, accanto a Santa Maria, tiene i ceri e la storia dei gremi: utile se non sei in città il 14 agosto. Monte d’Accoddi sta fuori, verso Porto Torres: auto o bus, non a piedi dal centro.",
      },
      {
        name: "Collezione Mineralogica Uniss",
        body: "Dipartimento di Agraria, via Enrico De Nicola 1. Minerali, rocce, fossili e suoli sardi: visita su prenotazione, non è il Museo Sanna. La scheda è in Cultura Sarda, con il Geomuseo Monte Arci di Masullas.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere a Sassari in un giorno?",
        answer:
          "Mattina al Museo Sanna. Poi il corso, la cattedrale e Santa Maria di Betlem. Se hai l’auto, nel pomeriggio Monte d’Accoddi.",
      },
      {
        question: "Quando sono i Candelieri?",
        answer:
          "La Faradda è la sera del 14 agosto. La Cavalcata Sarda è a metà maggio: la data esatta la pubblica il Comune ogni anno.",
      },
      {
        question: "Si parla sardo a Sassari?",
        answer:
          "In città è più visibile il sassarese, una parlata distinta dal sardo logudorese dei paesi. L’italiano è ovunque. Dettagli nella guida alle lingue della Sardegna.",
      },
    ],
    sources: [
      {
        label: "Comune di Sassari",
        href: "https://www.comune.sassari.it/",
      },
      {
        label: "UNESCO — Feste delle grandi macchine a spalla",
        href: "https://ich.unesco.org/en/RL/celebrations-of-big-shoulder-borne-processional-structures-00721",
      },
      {
        label: "Rete musei archeologici della Sardegna",
        href: "https://www.musei.sardegna.beniculturali.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/candelieri-sassari", label: "Candelieri" },
      { href: "/cultura/cavalcata-sarda-sassari", label: "Cavalcata Sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/costumi-sardi", label: "Costumi tradizionali" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/eventi-sardegna/candelieri-sassari", label: "Candelieri, calendario" },
      { href: "/eventi-sardegna/cavalcata-sarda", label: "Cavalcata, calendario" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "alghero",
    path: "/cultura-sarda/nord-sardegna/alghero",
    town: "Alghero",
    province: "Sassari",
    area: "Nurra",
    title: "Alghero: città catalana, corallo e Museo MACOR",
    h1: "Alghero",
    description:
      "Alghero: storia catalana, Museo del Corallo a Villa Costantino, Focs de Sant Joan e bastioni.",
    hero: {
      src: "/images/cultura/alghero-panorama.webp",
      alt: "Alghero vista dal mare, con le mura e il porto sul golfo",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Alghero_-_Panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/alghero-visit.webp",
      alt: "Alghero dai bastioni, con le case del centro sul golfo",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Alghero_-_Panorama_(02).jpg",
      },
    },
    intro:
      "Alghero è L’Alguer: città catalana in Nurra, mura sul mare, corallo rosso. Chi arriva per i bastioni trova anche il MACOR a Villa Costantino. Questa scheda tiene lingua, mestiere e visite, senza ridurla a tramonto sui merli.",
    history: [
      "Nel 1354 Pietro IV d’Aragona prende Alghero e la ripopola con catalani. Le mura, i bastioni, Porta Terra e la cattedrale di Santa Maria raccontano quella piazzaforte. Fuori le mura, verso piazza Sulis, restano le ville di inizio Novecento. Nettuno e Porto Conte sono un altro giro: auto o battello, non il centro.",
      "Il corallo — Corallium rubrum — ha tenuto pesca e oreficeria per secoli. Oggi il mestiere è regolamentato e più magro; il museo in Villa Costantino, liberty del 1927, lo mette in fila con biologia, economia e pezzi lavorati.",
    ],
    language: [
      "Ad Alghero (L’Alguer) si parla l’alguerès, varietà di catalano riconosciuta come minoranza linguistica storica dalla legge 15 dicembre 1999, n. 482. Scuola, insegne e rapporti con la Generalitat de Catalunya sono fatti amministrativi documentati dal Comune, non uno slogan da menu.",
      "Alghero non è «la Sardegna catalana». È una città in Nurra, accanto a comuni dove si parla sardo. La guida alle lingue tiene catalano, sardo, sassarese e gallurese distinti.",
    ],
    traditions: [
      {
        title: "Focs de Sant Joan",
        body: "Intorno al 23 giugno, San Giovanni, Alghero tiene falò, flama del Canigó, rito del comparatico e salto del fuoco sulla spiaggia di San Giovanni. Bianco, processione, fuoco. Date e iscrizioni le pubblica la Pro Loco ogni anno: non è uno show fisso, è una festa di città.",
      },
    ],
    crafts: [
      {
        title: "Corallo",
        body: "Pesca e lavorazione del corallo rosso sono il mestiere più documentato della città. Il MACOR a Villa Costantino racconta biologia ed economia, non un souvenir da spiaggia. Oreficeria e filigrana si intrecciano al corallo: la guida all’artigianato tiene i territori distinti e non vende pezzi. Orari del museo: museialghero.it.",
      },
    ],
    visit: [
      {
        name: "MACOR Museo del Corallo",
        body: "Villa Costantino, via XX Settembre 8, fuori le mura. Unica villa liberty visitabile in città, sede del Museo del Corallo. Storia, biologia ed economia del Corallium rubrum, pezzi degli orafi algheresi. Biglietti e orari su museialghero.it; spesso c’è l’Alghero Ticket cumulativo con gli altri musei comunali. Prenota in alta stagione.",
      },
      {
        name: "Bastioni, cattedrale, centro",
        body: "Cammina i bastioni al mattino, prima dei pullman. Santa Maria, San Francesco, via Carlo Alberto. Il Museo archeologico e Casa Manno stanno nel sistema Musei Alghero: stesso sito del corallo. Grotta di Nettuno e Capo Caccia sono fuori: traghetto dal porto o scalinata del Escala del Cabirol, con regole di accesso che cambiano.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere ad Alghero oltre ai bastioni?",
        answer:
          "Il Museo del Corallo a Villa Costantino, poi cattedrale e centro. Se hai mezza giornata in più, Nettuno o Porto Conte: non sono il paese, sono il territorio.",
      },
      {
        question: "Si parla ancora catalano ad Alghero?",
        answer:
          "Sì, l’alguerès è lingua viva, anche se non tutti la usano. Lo senti in centro, nelle feste di Sant Joan e nelle insegne. Non è un costume da indossare per un pomeriggio. La guida alle lingue colloca Alghero nel quadro delle minoranze (legge 482/1999).",
      },
    ],
    sources: [
      {
        label: "Comune di Alghero",
        href: "https://www.comune.alghero.ss.it/",
      },
      {
        label: "Legge 15 dicembre 1999, n. 482 — minoranze linguistiche",
        href: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1999-12-15;482",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: catalano di Alghero" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato e corallo" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/eventi-sardegna/jazzalguer", label: "JazzAlguer" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "olbia",
    path: "/cultura-sarda/nord-sardegna/olbia",
    town: "Olbia",
    province: "Sassari",
    area: "Gallura",
    title: "Olbia: museo di Isola Peddone e San Simplicio",
    h1: "Olbia",
    description:
      "Olbia, Gallura: Museo archeologico Isola Peddone, basilica di San Simplicio e festa di Mesu Maju.",
    hero: {
      src: "/images/cultura/olbia-marina.webp",
      alt: "La marina di Olbia sul golfo, con barche e lungomare",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Olbia,_marina_di_Olbia_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/olbia-san-simplicio.webp",
      alt: "La basilica romanica di San Simplicio ad Olbia",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Olbia_-_Basilica_di_San_Simplicio_(02).JPG",
      },
    },
    intro:
      "Olbia è porto, aeroporto e città di Gallura, non solo lo scalo per la Costa Smeralda. Isola Peddone tiene il museo del porto; San Simplicio è la basilica. Questa scheda parte da lì, senza trattarla come un parcheggio verso le spiagge.",
    history: [
      "Olbia, «felice» in greco, è porto fenicio, focese, punico, romano. Negli scavi del tunnel sotto il lungomare, negli anni Novanta, sono uscite navi romane e un’imbarcazione medievale: tre relitti stanno in museo, con timoni e alberi che in Italia non trovi altrove. I Vandali affondano la flotta nel V secolo; la città si riduce, poi rinasce.",
      "Nel Medioevo è Terranova, capitale del giudicato di Gallura. Il nome Olbia torna nel 1939. Corso Umberto, il molo Brin, San Simplicio un po’ in disparte rispetto al traffico: il centro che cammini è Novecento sopra un golfo che ha sempre lavorato. L’aeroporto e i traghetti pesano; la basilica e il museo tengono il resto. La Costa Smeralda è un altro pezzo di costa, non il nome culturale di Olbia.",
    ],
    language: [
      "In città si sente il gallurese accanto all’italiano. I linguisti lo collegano al gruppo tosco-corso, non al sardo del Logudoro. Non è un gadget da lungomare: sta nelle famiglie, nei toponimi, nei paesi dell’entroterra gallurese più che nei locali della costa.",
      "La guida alle lingue e quella ai territori (Gallura) tengono questo distinguo. Non inventiamo quanti parlanti restano.",
    ],
    traditions: [
      {
        title: "San Simplicio, Mesu Maju",
        body: "A metà maggio Olbia fa sa festa manna de Mesu Maju: patrono, processione, gruppi folk, sagra delle cozze, palio. Il 15 maggio è il giorno del santo. Date e percorso li pubblica il Comitato ogni anno. Non è una sagra di paese piccolo: è la festa della città di Gallura.",
      },
      {
        title: "Città di porto",
        body: "Olbia vive di scalo, cantiere, commercio. Il museo sull’isolotto Peddone, a forma di nave ormeggiata, racconta proprio quello: città e porto insieme, dal relitto al Corso. Se la usi solo per noleggiare l’auto, ti perdi la ragione per cui il golfo esiste.",
      },
    ],
    crafts: [
      {
        title: "Scalo e cantiere",
        body: "Non c’è un mestiere da vetrina come la resolza o il tappeto. Il lavoro visibile è il porto: traghetti, aeroporto, cantiere. Isola Peddone tiene i relitti e la storia di quel golfo. La Costa Smeralda è un altro comune culturale, anche quando cade nello stesso itinerario turistico.",
      },
    ],
    visit: [
      {
        name: "Museo Archeologico, Isola Peddone",
        body: "Piazzale Benedetto Brin, sull’isolotto Peddone, molo del porto vecchio. Relitti, testa di Ercole, sale da fenici e romani fino a Terranova. Ingresso di solito gratuito; orari sul sito del Comune (comune.olbia.ot.it), spesso martedì-domenica con pausa pomeridiana. Chiudi il telefono e guarda i timoni: sono il pezzo.",
      },
      {
        name: "Basilica di San Simplicio e necropoli",
        body: "Romanico di granito, XI-XII secolo, un po’ fuori dal Corso. Accanto, l’area Tempio-Necropoli ha restituito centinaia di tombe romane: ingresso da via D’Annunzio e piazza San Simplicio, orari comunali. In un pomeriggio ci stai museo più basilica a piedi. Il resto — Pittulongu, Porto Rotondo — è un altro giro.",
      },
    ],
    faqs: [
      {
        question: "Olbia merita una sosta o si scende solo dall’aereo?",
        answer:
          "Merita almeno Isola Peddone e San Simplicio. In tre ore le fai a piedi dal centro. Il mare è un altro programma.",
      },
      {
        question: "Quando è la festa di San Simplicio?",
        answer:
          "A metà maggio, con il culmine il 15. Il programma esatto — processione, sagra, palio — lo pubblica ogni anno il Comitato della festa.",
      },
      {
        question: "A Olbia si parla sardo?",
        answer:
          "La parlata storica della città è il gallurese, distinta dal sardo. L’italiano è ovunque. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Olbia",
        href: "https://www.comune.olbia.ot.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: gallurese" },
      { href: "/cultura/territori-sardegna", label: "Territori: Gallura" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura-sarda/nord-sardegna/la-maddalena", label: "Guida La Maddalena" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "porto-torres",
    path: "/cultura-sarda/nord-sardegna/porto-torres",
    town: "Porto Torres",
    province: "Sassari",
    area: "Nurra",
    title: "Porto Torres: San Gavino e Turris Libisonis",
    h1: "Porto Torres",
    description:
      "Porto Torres: basilica di San Gavino, Antiquarium Turritano, Turris Libisonis, Festha Manna e ponte romano.",
    hero: {
      src: "/images/cultura/porto-torres-panorama.webp",
      alt: "Porto Torres vista dal mare, con il porto e il golfo dell’Asinara",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Porto_Torres,_panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/porto-torres-san-gavino.webp",
      alt: "La basilica romanica di San Gavino a Porto Torres",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Porto_Torres_-_Basilica_di_San_Gavino_(02).JPG",
      },
    },
    intro:
      "Porto Torres è colonia romana e porto, non un borgo ricostruito. San Gavino è la basilica più grande del romanico sardo; sotto e accanto resta Turris Libisonis. Si viene per i martiri, l’Antiquarium e il ponte sul Riu Mannu, non per una cartolina di golfo.",
    history: [
      "Turris Libisonis è colonia romana, porto del nord-ovest con rapporti su Ostia. Terme, mosaici, ponte di inizio I secolo sul Riu Mannu: la città moderna sta sopra quella. L’area detta Palazzo di Re Barbaro è il quartiere che si visita; l’Antiquarium, in via Ponte Romano, tiene statue, iscrizioni, corredi.",
      "Gavino, Proto e Gianuario, martiri di inizio IV secolo, danno il nome alla basilica su Monte Agellu: due absidi, navata lunghissima, cripta con le tombe ritrovate nel 1614. È chiesa di giudici e pellegrini, non di vetrina. Il Novecento aggiunge cantiere, petrolchimico, traghetti. L’Asinara è un altro comune e un parco: si raggiunge da qui, non è Porto Torres.",
    ],
    language: [
      "Si parla sassarese della Nurra, accanto all’italiano. È la stessa area di Sassari, distinta dal sardo logudorese dei paesi più interni. In porto si mescolano anche lingue di passaggio. La guida alle lingue tiene sassarese e sardo su piani diversi. Non pubblichiamo percentuali di parlanti.",
    ],
    traditions: [
      {
        title: "Festha Manna e martiri turritani",
        body: "Tra maggio e Pentecoste Porto Torres fa la Festha Manna: simulacri di Gavino, Proto e Gianuario, processione, pellegrinaggio notturno da San Nicola di Sassari, scambio delle chiavi tra i due sindaci. Non è la Corsa degli Scalzi di Cabras: è il rito turritano. Date sul sito del Comune, ogni anno diverse con la Pasqua.",
      },
    ],
    crafts: [
      {
        title: "Porto e cantiere",
        body: "Il mestiere visibile è lo scalo: banchina, traghetti, industria. Non c’è un artigianato turritano da vetrina. Il posto per oggetti e iscrizioni è l’Antiquarium. Orari sul gestore: da fine 2025 il museo ha avuto chiusure per allestimento, si conferma prima di partire.",
      },
    ],
    visit: [
      {
        name: "Basilica di San Gavino",
        body: "In centro, su Monte Agellu. Entra, scendi in cripta, guarda le due absidi: non c’è facciata da cartolina, c’è una nave di pietra. Orari e visite guidate li comunica la parrocchia e il Comune. Accanto, Balai Vicino e Balai Lontano sul mare.",
      },
      {
        name: "Antiquarium Turritano e area archeologica",
        body: "Via Ponte Romano 99, accanto alla stazione marittima. Museo e scavi di Turris Libisonis; l’area si visita spesso con accompagnamento a orari fissi. Da dicembre 2025 il museo ha avuto chiusure per nuovo allestimento: verifica su antiquariumportotorres.cultura.gov.it prima di partire. Il ponte romano sul Riu Mannu si vede dal sito.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere a Porto Torres in un giorno?",
        answer:
          "Mattina a San Gavino e cripta. Poi Antiquarium e scavi, se aperti. Nel pomeriggio il ponte romano e Balai, oppure il traghetto per l’Asinara.",
      },
      {
        question: "Quando è la Festha Manna?",
        answer:
          "Intorno a Pentecoste, di solito tra fine maggio e giugno, con processione e pellegrinaggio da Sassari. Il Comune pubblica il programma ogni primavera.",
      },
      {
        question: "Si parla sardo a Porto Torres?",
        answer:
          "In città è più visibile il sassarese della Nurra, distinto dal logudorese dei paesi. L’italiano è ovunque. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Porto Torres",
        href: "https://comune.porto-torres.ss.it/",
      },
      {
        label: "Antiquarium Turritano (MiC)",
        href: "https://antiquariumportotorres.cultura.gov.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: sassarese" },
      { href: "/cultura/storia-sardegna", label: "Storia della Sardegna" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/cultura-sarda/nord-sardegna/stintino", label: "Guida Stintino" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "la-maddalena",
    path: "/cultura-sarda/nord-sardegna/la-maddalena",
    town: "La Maddalena",
    province: "Sassari",
    area: "Gallura",
    title: "La Maddalena: Caprera, Garibaldi e l’arcipelago",
    h1: "La Maddalena",
    description:
      "La Maddalena: Compendio Garibaldino di Caprera, Memoriale di Forte Arbuticci, porto e parco dell’arcipelago.",
    hero: {
      src: "/images/cultura/la-maddalena-panorama.webp",
      alt: "La Maddalena vista dal mare, con il paese sull’isola",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:La_Maddalena,_panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/la-maddalena-caprera.webp",
      alt: "Il Compendio Garibaldino a Caprera, la Casa Bianca di Giuseppe Garibaldi",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:La_Maddalena,_compendio_garibaldino_di_Caprera_(23).jpg",
      },
    },
    intro:
      "La Maddalena è comune di isole, marina militare e parco. Caprera, unita da un ponte, tiene la casa di Garibaldi. Chi arriva per le spiagge dell’arcipelago può entrare in Compendio e Memoriale: è un’altra visita, non un optional.",
    history: [
      "L’arcipelago — Maddalena, Caprera, Santo Stefano, Spargi, Budelli, Razzoli, Santa Maria — è stato scalo, presidio, frontiera. Nel 1793 i francesi attaccano e vengono respinti; Nelson ci passa; nell’Ottocento e nel Novecento la Marina fa della Maddalena una piazzaforte. Il paese sul porto è quello: calata, arsenale, case di granito.",
      "Garibaldi compra terra a Caprera nel 1855 e ci vive, con interruzioni, fino al 1882. La Casa Bianca, gli edifici agricoli, la tomba: oggi è museo statale. A quattro chilometri, Forte Arbuticci (anni 1890) è dal 2012 il Memoriale Giuseppe Garibaldi. Il Parco nazionale regola spiagge e approdi: non è un mare libero da cartina.",
    ],
    language: [
      "Sull’arcipelago si parla gallurese e italiano. La presenza della Marina e il turismo estivo pesano sull’uso quotidiano: in inverno il paese è piccolo, in agosto si mescolano lingue di passaggio. Non è un laboratorio linguistico da vetrina.",
      "La guida alle lingue colloca il gallurese nel gruppo tosco-corso, distinto dal sardo. Tempio e Aggius, in terraferma, restano i rinvii per sentirlo in un contesto di paese interno.",
    ],
    traditions: [
      {
        title: "Isole e Marina",
        body: "La Maddalena è paese di militari, pescatori, traghettatori. Il centro sul porto, Cala Gavetta, tiene botteghe e passeggiata. Le processioni e le feste di mare ci sono; l’identità visibile, però, è l’arcipelago e la base. In inverno si svuota, in agosto si riempie di barche.",
      },
      {
        title: "Caprera, casa e memoria",
        body: "Due musei per lo stesso uomo: il Compendio racconta la vita quotidiana, il Memoriale le campagne. Prenota il Compendio: ingressi contingentati, venti persone ogni quarto d’ora. Il Memoriale si raggiunge in auto, moto o bici, non col bus di linea.",
      },
    ],
    visit: [
      {
        name: "Compendio Garibaldino, Caprera",
        body: "Casa Bianca, giardino, area cimiteriale. Circa 50 minuti, martedì-domenica, ultimo ingresso nel pomeriggio. Biglietti e fasce su museigaribaldini.cultura.gov.it. Caprera è collegata da un ponte: a piedi, in bici o in auto dal porto della Maddalena. In estate c’è anche il bus urbano fino alla casa-museo.",
      },
      {
        name: "Memoriale di Forte Arbuticci e paese",
        body: "Stessa isola, quattro chilometri, orari diversi dal Compendio: spesso solo pomeriggio. Tredici sezioni nel forte. Poi torna in paese: calata, Museo diocesano se aperto, traghetto da Palau (un quarto d’ora). Le spiagge del parco hanno regole e, in alta stagione, limiti: controlla il sito del Parco prima di salire su un gommone.",
      },
    ],
    faqs: [
      {
        question: "Come si arriva a Caprera e alla casa di Garibaldi?",
        answer:
          "Traghetto Palau–La Maddalena, poi ponte per Caprera. Il Compendio è raggiungibile in auto, bici o bus urbano. Prenota il biglietto: gli ingressi sono a fasce.",
      },
      {
        question: "Si visitano Compendio e Memoriale nello stesso giorno?",
        answer:
          "Sì, se calcoli il trasferimento e gli orari diversi. Il Memoriale apre più tardi e non ha mezzo pubblico. Verifica su museigaribaldini.cultura.gov.it.",
      },
    ],
    sources: [
      {
        label: "Musei Garibaldini — Caprera (MiC)",
        href: "https://museigaribaldini.cultura.gov.it/",
      },
      {
        label: "Comune di La Maddalena",
        href: "https://www.comune.lamaddalena.ot.it/",
      },
      {
        label: "Parco nazionale Arcipelago di La Maddalena",
        href: "https://www.lamaddalenapark.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/giuseppe-garibaldi-caprera", label: "Garibaldi a Caprera" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: gallurese" },
      { href: "/cultura/territori-sardegna", label: "Territori: Gallura" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura-sarda/nord-sardegna/olbia", label: "Guida Olbia" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "arzachena",
    path: "/cultura-sarda/nord-sardegna/arzachena",
    town: "Arzachena",
    province: "Sassari",
    area: "Gallura",
    title: "Arzachena: Li Muri, Albucciu e Museo Ruzittu",
    h1: "Arzachena",
    description:
      "Arzachena, Gallura: Museo Ruzittu, necropoli di Li Muri, nuraghe Albucciu. La Costa Smeralda è un altro pezzo del comune.",
    hero: {
      src: "/images/cultura/arzachena-panorama.webp",
      alt: "Panorama di Arzachena tra i graniti della Gallura",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Arzachena,_panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/arzachena-li-muri.webp",
      alt: "I circoli funerari della necropoli di Li Muri, nel territorio di Arzachena",
      credit: {
        author: "Mboesch",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Arzachena-necropoli-li-muri.jpg",
      },
    },
    intro:
      "Arzachena è un paese di Gallura interna con un parco archeologico sparso nel granito. La Costa Smeralda sta nel comune, ma non è il paese. Si viene per Li Muri, Albucciu, La Prisgiona e il Museo Ruzittu.",
    history: [
      "Prima delle ville a mare c’è una cultura preistorica che gli archeologi chiamano di Arzachena: circoli funerari a Li Muri, IV millennio a.C., piccoli, precisi, diversi dalle tombe del resto dell’isola. Poi nuraghi a corridoio come Albucciu, villaggi come La Prisgiona, tombe di giganti (Coddu Ecchju, Li Lolghi, Moru). Il territorio è questo, non solo il golfo.",
      "Il comune autonomo nasce nel 1921. Negli anni Sessanta l’Aga Khan lancia la Costa Smeralda: Porto Cervo, Cala di Volpe, un altro mondo nello stesso municipio. Cannigione resta il borgo di mare del paese. In centro, via Mozart, il Museo civico Michele Ruzittu — intitolato a chi spinse l’autonomia — ha riaperto nel 2022 dopo anni di chiusura.",
    ],
    language: [
      "Si parla gallurese, accanto all’italiano. I linguisti lo collegano al gruppo tosco-corso, non al sardo propriamente detto. In costa, d’estate, la piazza è mista. La guida alle lingue tiene gallurese e sardo distinti. Non pubblichiamo conteggi di parlanti.",
    ],
    traditions: [
      {
        title: "Paese e Costa Smeralda",
        body: "Due geografie. Il paese sta nell’entroterra, granito e piazza; la Costa è un progetto turistico degli anni Sessanta. Se cerchi «Arzachena cosa vedere» e ti escono solo yacht, sei sulla metà sbagliata della scheda. Il Fungo, il masso in centro, è il segno visibile del granito, non un monumento inventato.",
      },
    ],
    visit: [
      {
        name: "Museo civico Michele Ruzittu",
        body: "Via Mozart, centro paese. Reperti da Li Muri ad Albucciu e La Prisgiona, sezione minerali. Gestione Ge.se.co. Orari e biglietti su arzachenaturismo.com o sul Comune: cambiano, il museo chiude spesso il lunedì. Il cumulativo con i siti conviene se fai più di un recinto. Non entrare nei recinti fuori orario: è scavo, non pascolo.",
      },
      {
        name: "Li Muri, Albucciu, La Prisgiona",
        body: "Li Muri: circoli funerari, mezz’ora, auto. Albucciu e il tempietto di Malchittu stanno sulla strada per Cannigione. La Prisgiona e Coddu Ecchju verso Capichera. In un giorno ne fai due o tre, non tutti. Scarpe, acqua, orari su arzachenaturismo.com. Porto Cervo è un altro pomeriggio, se ti serve.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere ad Arzachena oltre alla Costa Smeralda?",
        answer:
          "Il Museo Ruzittu in centro, Li Muri, il nuraghe Albucciu. Se resta tempo, La Prisgiona o una tomba di giganti. La Costa è la costa, non il paese.",
      },
      {
        question: "I siti archeologici sono aperti in inverno?",
        answer:
          "Sì, con orari più corti. Il museo chiude spesso il lunedì. Controlla arzachenaturismo.com o il Comune: in bassa stagione qualche recinto può chiudere un giorno.",
      },
      {
        question: "Si parla sardo ad Arzachena?",
        answer:
          "Si parla gallurese, una varietà distinta dal sardo. L’italiano è ovunque, d’estate anche altre lingue. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Arzachena",
        href: "https://www.comune.arzachena.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/nuraghi-archeologia-sardegna", label: "Nuraghi e archeologia" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: gallurese" },
      { href: "/cultura/territori-sardegna", label: "Territori: Gallura" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura-sarda/nord-sardegna/olbia", label: "Guida Olbia" },
      { href: "/cultura-sarda/nord-sardegna/tempio-pausania", label: "Guida Tempio" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "castelsardo",
    path: "/cultura-sarda/nord-sardegna/castelsardo",
    town: "Castelsardo",
    province: "Sassari",
    area: "Anglona",
    title: "Castelsardo, intreccio e Lunissanti",
    h1: "Castelsardo, intreccio e Lunissanti",
    description:
      "A Castelsardo il MIM documenta l’intreccio di fibre vegetali; il Lunissanti è il rito della Confraternita di Santa Croce verso Tergu. Non una guida al borgo.",
    hero: {
      src: "/images/cultura/castelsardo-panorama.webp",
      alt: "Castelsardo sul promontorio, con il castello dei Doria sul mare dell’Asinara",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Castelsardo_(01).JPG",
      },
    },
    intro:
      "Castelsardo si legge meglio attraverso due fatti culturali, non attraverso una lista di attrazioni. Il primo è l’intreccio di fibre vegetali: mestiere ancora visibile in paese e documentato dal MIM, Museo dell’intreccio mediterraneo, nella fortezza dei Doria. Il secondo è il Lunissanti: rito di Settimana Santa della Confraternita dell’Oratorio di Santa Croce, con percorso verso l’abbazia di Tergu.",
    historyHeading: "L’intreccio e il MIM",
    history: [
      "L’intreccio a Castelsardo non è un folklore da vetrina. È un sapere di cestineria — corbule, canestri, crivelli, setacci — legato a usi quotidiani, pesca e campagna, che nelle vie del centro resta pratica delle cestinaie, non solo pezzo da museo. La guida EVERAS all’artigianato colloca Castelsardo tra i territori dell’intreccio; qui il punto è il rapporto tra quel mestiere e questo comune. Non è tessitura a telaio: Samugheo e il MURATS raccontano un’altra filiera.",
      "SardegnaCultura colloca il MIM nel castello dei Doria (XII secolo), via Marconi: centro di documentazione su prodotti intrecciati con fibre vegetali del Mediterraneo, con nove ambienti su due piani — tecniche al piano inferiore, ambiti d’uso al superiore. In mostra, soprattutto, pezzi della cestineria di Castelsardo; spazio anche a manufatti sardi di vita quotidiana e, tra i pezzi segnalati, «su fassoi» degli stagni di Cabras e Santa Giusta. Orari e biglietti: mimcastelsardo.it. Non li copiamo.",
    ],
    traditionsHeading: "Il Lunissanti",
    traditions: [
      {
        title: "Confraternita, Misteri, Tergu",
        body: "SardegnaCultura descrive il Lunissanti come apertura della Settimana Santa (Chida Santa) a Castelsardo: il lunedì successivo alla Domenica delle Palme. Prima dell’alba i membri della Confraternita dell’Oratorio di Santa Croce, in tunica e cappuccio bianchi, si muovono verso Santa Maria di Tergu. Dodici Apostoli portano i Misteri; tre cori della stessa confraternita (Miserere, Stabat, Jesus) cantano a quattro voci. Dopo la messa del mattino la processione percorre circa otto chilometri fino all’abbazia di Nostra Signora di Tergu, dove i Misteri sono offerti alla Madonna; nel pomeriggio il corteo rientra alla chiesa di Santa Maria in paese. La sera, la Notti Santa riporta Misteri e cori nel centro storico. Non è un carnevale di maschere: Ottana e Mamoiada restano un altro calendario. Non è uno spettacolo da brochure: è un rito di confraternita. Date e orari dell’edizione: confraternita e fonti locali; su EVERAS, quando pubblicati.",
      },
    ],
    visitHeading: "Il paese sotto il castello",
    visit: [
      {
        name: "Fortezza e tessuto urbano",
        body: "Il castello dei Doria non è qui un itinerario panoramico: è la sede del MIM. Sotto la rocca, il tessuto storico tiene botteghe di intreccio e le chiese del rito — Santa Maria come nodo del rientro dei Misteri. Non elenchiamo cattedrale, spiagge né la Roccia dell’Elefante: non sono il nucleo di questa scheda. Samugheo per la tessitura; Ottana e Mamoiada per i carnevali di maschere; la guida ai mestieri e quella alle tradizioni per il quadro isolano.",
      },
    ],
    faqs: [
      {
        question: "Che cos’è il Museo dell’intreccio mediterraneo?",
        answer:
          "È il museo etnografico nel castello dei Doria a Castelsardo. SardegnaCultura lo presenta come centro di documentazione sull’intreccio di fibre vegetali del Mediterraneo, con forte presenza della cestineria locale. Sede e aperture: mimcastelsardo.it.",
      },
      {
        question: "Che cos’è il Lunissanti di Castelsardo?",
        answer:
          "È il rito che apre la Settimana Santa in paese: lunedì dopo le Palme, organizzato dalla Confraternita dell’Oratorio di Santa Croce, con Misteri, cori e percorso verso l’abbazia di Tergu. Non è un carnevale e non è «la» Settimana Santa di tutta l’isola.",
      },
      {
        question: "Qual è il rapporto tra il Lunissanti e Tergu?",
        answer:
          "Il percorso del Lunissanti collega Castelsardo all’abbazia di Nostra Signora di Tergu: lì, secondo SardegnaCultura, i Misteri sono offerti alla Madonna prima del rientro in paese. Tergu non «ospita» un festival generico: è tappa del rito di questa confraternita.",
      },
    ],
    sources: [
      {
        label: "Comune di Castelsardo",
        href: "https://www.comune.castelsardo.ss.it/",
      },
      {
        label: "MIM — Museo dell’intreccio mediterraneo",
        href: "https://www.mimcastelsardo.it/",
      },
      {
        label: "SardegnaCultura, Museo dell’intreccio mediterraneo",
        href: "https://www.sardegnacultura.it/index.php/articolo/castelsardo-museo-dellintreccio-mediterraneo",
      },
      {
        label: "SardegnaCultura, Settimana Santa a Castelsardo",
        href: "https://www.sardegnacultura.it/articolo/settimana-santa-a-castelsardo",
      },
    ],
    relatedLinksHeading: "Scopri anche",
    relatedLinksIntro:
      "Samugheo per la tessitura, non per l’intreccio; Ottana e Mamoiada per i carnevali di maschere, non per il Lunissanti; artigianato e tradizioni per il quadro isolano senza rifare questa scheda.",
    relatedLinks: [
      { href: "/cultura/artigianato-sardo", label: "Artigianato sardo" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura/tradizioni-sarde", label: "Feste e tradizioni" },
      { href: "/cultura-sarda/sud-sardegna/samugheo", label: "Guida Samugheo" },
      { href: "/cultura-sarda/centro-sardegna/ottana", label: "Guida Ottana" },
      { href: "/cultura-sarda/centro-sardegna/mamoiada", label: "Guida Mamoiada" },
    ],
    publishedAt: "2026-09-20",
  },
  {
    slug: "aggius",
    path: "/cultura-sarda/nord-sardegna/aggius",
    town: "Aggius",
    province: "Sassari",
    area: "Gallura",
    title: "Aggius: musei, tappeti e Valle della Luna",
    h1: "Aggius",
    description:
      "Aggius, Gallura: Museo etnografico MEOC, Museo del Banditismo, tappeti, coro e Valle della Luna.",
    hero: {
      src: "/images/cultura/aggius-panorama.webp",
      alt: "Panorama di Aggius ai piedi dei monti di granito, in Gallura",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Aggius,_panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/aggius-valle-luna.webp",
      alt: "La Valle della Luna, o Piana dei Grandi Sassi, nel territorio di Aggius",
      credit: {
        author: "Tiuliano",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Valle_della_Luna-Aggius.jpg",
      },
    },
    intro:
      "Aggius è un borgo di granito in Gallura, Bandiera Arancione, con due musei che pochi paesi di queste dimensioni tengono aperti: l’etnografico più grande dell’isola e l’unico museo italiano sul banditismo. Si viene per i tappeti, il coro e la Valle della Luna.",
    history: [
      "Il paese sta su un dosso di granito, a oltre 500 metri. Le case in pietra, le viuzze, gli stazzi intorno: è Gallura interna, non costa. Per secoli è stato un crocevia di pastori, contrabbando e latitanze. Il museo nella vecchia Pretura non esalta i fuorilegge: mette in fila sentenze, armi e storie di un territorio isolato, dalla Spagna ai Savoia.",
      "Nel Novecento Aggius tiene tessitura e coro. Gavino Gabriel porta il canto aggese al Vittoriale: D’Annunzio chiama un corista «Galletto di Gallura», nome che il coro porta ancora. Oggi il borgo vive di granito, tappeti e visitatori che salgono da Tempio o dalla Costa Smeralda per un giorno diverso dal mare.",
    ],
    language: [
      "Si parla gallurese. I linguisti lo collegano al gruppo tosco-corso, non al sardo propriamente detto. Il coro e i toponimi tengono la lingua in pubblico; in casa l’uso varia. La guida alle lingue e quella a Tempio (città di riferimento della Gallura interna) sono i rinvii.",
    ],
    traditions: [
      {
        title: "Coro e Settimana Santa",
        body: "Il Coro di Aggius è tra i più noti della Gallura. A Pasqua il borgo tiene i riti spagnoli delle confraternite, dalla Domenica delle Palme alla Resurrezione: uno dei pochi comuni galluresi che li ha conservati per intero. Se cerchi «coro Aggius» o «Settimana Santa Aggius», le date cambiano ogni anno con il calendario liturgico.",
      },
    ],
    crafts: [
      {
        title: "Tappeti e tessitura",
        body: "Il tappeto aggese è il pezzo che esce dal paese. Al MEOC c’è la mostra permanente, con telai e dimostrazioni. In paese restano botteghe: meglio chiamare prima. Lana, colori, motivi geometrici: è un mestiere, non un souvenir da spiaggia. La guida all’artigianato colloca Aggius nella tessitura, senza catalogo di vendita.",
      },
    ],
    visit: [
      {
        name: "MEOC e Museo del Banditismo",
        body: "Il MEOC, Museo etnografico Oliva Carta Cannas, è in via Monti di Lizu: casa gallurese, mestieri, tessitura, costumi, canto in sottofondo. A pochi minuti, in via Pretura, il Museo del Banditismo occupa l’ex pretura: quattro sale, documenti, foto segnaletiche. Spesso il biglietto è cumulativo. Orari su museodiaggius.it: in inverno si prenota.",
      },
      {
        name: "Valle della Luna e nuraghe Izzana",
        body: "Fuori dal centro, la Valle della Luna (Piana dei Grandi Sassi) è un campo di graniti arrotondati, da percorrere a piedi. Il nuraghe Izzana è il più grande della Gallura. Servono auto e scarpe: i mezzi da Olbia o Sassari sono pochi.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere ad Aggius?",
        answer:
          "I due musei in centro (MEOC e Banditismo), una bottega di tappeti se è aperta, poi la Valle della Luna. In un giorno ci stai, in due cammini meglio.",
      },
      {
        question: "I musei sono aperti in inverno?",
        answer:
          "La stagione piena è primavera-autunno. Da novembre a marzo chiedi a museodiaggius.it o al Comune: spesso si entra su appuntamento.",
      },
    ],
    sources: [
      {
        label: "Comune di Aggius",
        href: "https://www.comune.aggius.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato: tessitura" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: gallurese" },
      { href: "/cultura/costumi-sardi", label: "Costumi tradizionali" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      {
        href: "/cultura-sarda/nord-sardegna/tempio-pausania",
        label: "Guida Tempio Pausania",
      },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "tempio-pausania",
    path: "/cultura-sarda/nord-sardegna/tempio-pausania",
    town: "Tempio Pausania",
    province: "Sassari",
    area: "Gallura",
    title: "Tempio Pausania: granito, sughero e carnevale",
    h1: "Tempio Pausania",
    description:
      "Tempio Pausania: centro in granito, Museo Bernardo De Muro, macchine del sughero, carnevale timpiesu e Limbara.",
    hero: {
      src: "/images/cultura/tempio-panorama.webp",
      alt: "Panorama di Tempio Pausania, la città di granito ai piedi del Limbara",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Tempio_Pausania,_panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/tempio-centro.webp",
      alt: "Tempio Pausania vista dai colli, con il campanile al centro del granito",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Tempio_Pausania,_panorama_(04).jpg",
      },
    },
    intro:
      "Tempio Pausania è la città di pietra della Gallura, ai piedi del Limbara: cattedrale, sughero, moscato e un carnevale che riempie le strade. Si viene per il centro in granito e per due musei diversi: il tenore Bernardo De Muro e le macchine del sughero.",
    history: [
      "In età giudicale si chiama Templo. Nel 1879 aggiunge Pausania, in memoria della diocesi antica di Phausania. È sede vescovile e di tribunale, riferimento dell’entroterra gallurese. Il tessuto è granito: palazzi, pavimenti, viali. Nino Visconti, giudice di Gallura citato da Dante, ha qui una residenza attribuita. Fabrizio De André visse all’Agnata, poco fuori: piazza Faber, con un’installazione nata anche con Renzo Piano, lo ricorda in centro.",
      "Sughero e granito hanno tenuto l’economia. L’ex collegio degli Scolopi è oggi biblioteca e Museo De Muro. La stazione ferroviaria ha dipinti di Giuseppe Biasi. Non è un borgo piccolo: è una cittadina di montagna, con parchi, fonti di Rinaggiu e aria che d’estate chi scappa dalla costa viene a cercare.",
    ],
    language: [
      "A Tempio si parla gallurese. I linguisti lo distinguono dal sardo: è una varietà del gruppo tosco-corso, come in altra Gallura. L’italiano è la lingua pubblica della cittadina. La guida alle lingue è il testo di inquadramento.",
    ],
    traditions: [
      {
        title: "Lu carrasciali timpiesu",
        body: "Il carnevale di Tempio è allegorico, con carri e maschere, e include lu palu di la frisgiola, giostra a cavallo intorno a un dolce. A marzo le strade si riempiono. A Pasqua li casgiatini, a Natale i papassini. In tavola la suppa cuata. Ad agosto i patroni: San Paolo e la Vergine di Buoncammino. Date: Comune, ogni anno.",
      },
    ],
    crafts: [
      {
        title: "Sughero e abito tempiese",
        body: "La lavorazione del sughero ha un museo delle macchine in via Limbara, presso Agris: affilatrici, seghe, timbratrici da tappo. Conferma l’apertura al gestore. Vermentino, karana e moscato escono dalle cantine intorno, un altro piano rispetto al mestiere. L’abito tradizionale femminile tempiese è tra i più ricchi della Gallura: lo vedi a luglio, all’incontro internazionale del folklore, e nella guida ai costumi. La guida all’artigianato colloca Tempio e Calangianus nel distretto del sughero.",
      },
    ],
    visit: [
      {
        name: "Centro, cattedrale e Museo De Muro",
        body: "Piazza Gallura, palazzo Pes di Villamarina, cattedrale di San Pietro, oratorio del Rosario e Santa Croce formano il cuore. Il Museo Bernardo De Muro è nella biblioteca G.M. Dettori (ex Scolopi): costumi di scena, dischi, foto del tenore tempiese. Ingresso in genere gratuito, in orario di biblioteca.",
      },
      {
        name: "Macchine del sughero e Limbara",
        body: "Il Museo storico delle macchine del sughero è in via Limbara 9: affilatrici, seghe, timbratrici da tappo. Conferma l’apertura ad Agris (079 672269). Poi fonti di Rinaggiu, parco delle Rimembranze, nuraghe Majori. Per Izzana si sale verso Aggius.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere a Tempio Pausania?",
        answer:
          "Il centro in granito e la cattedrale, il Museo De Muro in biblioteca, se è aperto il museo del sughero. A carnevale resti per i carri; d’estate per il Limbara.",
      },
      {
        question: "Quando è il carnevale di Tempio?",
        answer:
          "Nelle settimane prima di Quaresima, con il clou a febbraio-marzo. Le date esatte le pubblica il Comune ogni anno.",
      },
    ],
    sources: [
      {
        label: "Comune di Tempio Pausania",
        href: "https://www.comune.tempiopausania.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato: sughero" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: gallurese" },
      { href: "/cultura/territori-sardegna", label: "Territori: Gallura" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura-sarda/nord-sardegna/aggius", label: "Guida Aggius" },
      { href: "/cultura-sarda/nord-sardegna/calangianus", label: "Guida Calangianus" },
      { href: "/eventi-sardegna/carnevale-sardegna", label: "Carnevale in Sardegna" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "ozieri",
    path: "/cultura-sarda/nord-sardegna/ozieri",
    town: "Ozieri",
    province: "Sassari",
    area: "Logudoro",
    title: "Ozieri: museo archeologico, Bisarcio e Premio Ozieri",
    h1: "Ozieri",
    description:
      "Ozieri, Logudoro: Civico Museo Archeologico, cultura di Ozieri, basilica di Bisarcio, altane e Premio Ozieri.",
    hero: {
      src: "/images/cultura/ozieri-panorama.webp",
      alt: "Panorama di Ozieri sull’anfiteatro del Logudoro",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Ozieri_-_Panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/ozieri-chilivani.webp",
      alt: "La piana di Chilivani nel territorio di Ozieri, verso la basilica di Bisarcio",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Ozieri_-_Piana_di_Chilivani_(01).jpg",
      },
    },
    intro:
      "Ozieri è la città più grande del Logudoro, disposta ad anfiteatro. Il nome della cultura preistorica più nota della Sardegna esce da una grotta qui accanto. Si viene per il museo alle Clarisse, la basilica di Bisarcio e una tradizione di poesia e canto a chitarra che non è da cartolina.",
    history: [
      "Nel Neolitico recente (circa 3500-2900 a.C.) dalla grotta di San Michele si definisce la cultura di Ozieri: ceramiche, domus de janas, idoli, una rete che copre l’isola. I reperti stanno nel museo civico, a Cagliari e al Sanna di Sassari. Poi nuraghi, il ponte romano Pont’ezzu, il giudicato, il capoluogo del Monte Acuto nel Trecento.",
      "Nel Settecento Ozieri è il secondo centro del nord-ovest. Francesco Ignazio Mannu, ozierese, scrive Procurade ’e moderare, l’inno dei moti antifeudali. Nel Cinquecento il Maestro di Ozieri dipinge chiese del nord. Il centro di oggi ha altane, palazzi, la cattedrale dell’Immacolata, piazza Cantareddu dove ancora si ascoltano cantadores.",
    ],
    language: [
      "Si parla sardo logudorese. Ozieri è uno dei centri in cui la lingua scritta e recitata è più visibile: Premio Ozieri, cantigos a chiterra, coro. L’italiano è la lingua amministrativa. La guida alle lingue e quella a musica e poesia tengono poesia improvvisata e sardo parlato su piani distinti.",
    ],
    traditions: [
      {
        title: "Poesia, Premio Ozieri e canto a chitarra",
        body: "Il Premio Ozieri per la letteratura sarda, dal 1956 circa, è il passaggio obbligato per chi scrive in sardo. L’Usignolo della Sardegna premia i cantigos a chiterra. Il Coro di Ozieri ha lavorato sul canto polivocale. Piazza Cantareddu resta il palco: se cerchi «Premio Ozieri» guarda il calendario del Comune.",
      },
      {
        title: "Cavalli e suspiros",
        body: "Chilivani è l’ippodromo storico dell’isola: Ozieri alleva e addestra da generazioni. In pasticceria i suspiros — mandorle, miele, glassa — sono il dolce del paese dall’Ottocento. Non confonderli con i sospiri di altri comuni: qui sono ozieresi.",
      },
    ],
    visit: [
      {
        name: "Civico Museo Archeologico alle Clarisse",
        body: "Ex convento delle clarisse, in centro. Preistoria (pisside a corna di toro dalla grotta di San Michele), nuragico, punico-romano, medievale, seimila monete al piano superiore. Orari sul sito del museo comunale: di solito chiuso il lunedì. Vicino: museo diocesano di arte sacra e, se aperto, il museo del cavallo.",
      },
      {
        name: "Bisarcio, grotta di San Michele, centro",
        body: "La basilica di Sant’Antioco di Bisarcio, romanica in pietra vulcanica, domina la piana di Chilivani: è una delle chiese medievali più importanti dell’isola. La grotta di San Michele si visita con indicazioni del Comune. In centro: cattedrale, Fonte Grixoni, altane, Pont’ezzu sul rio Mannu.",
      },
    ],
    faqs: [
      {
        question: "Perché si chiama cultura di Ozieri?",
        answer:
          "Dalla grotta di San Michele, nel territorio comunale. I reperti del Neolitico recente trovati lì hanno dato il nome a una facies diffusa in tutta la Sardegna. Si vedono nel museo civico.",
      },
      {
        question: "Cosa visitare ad Ozieri in un giorno?",
        answer:
          "Mattina al museo alle Clarisse e in centro (cattedrale, altane). Pomeriggio a Bisarcio, in piana di Chilivani. Se resta tempo, Pont’ezzu o la grotta, con orario confermato.",
      },
    ],
    sources: [
      {
        label: "Comune di Ozieri",
        href: "https://www.comune.ozieri.ss.it/",
      },
      {
        label: "Rete musei archeologici della Sardegna",
        href: "https://www.musei.sardegna.beniculturali.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/storia-sardegna", label: "Storia: cultura di Ozieri" },
      { href: "/cultura/nuraghi-archeologia-sardegna", label: "Nuraghi e archeologia" },
      { href: "/cultura/musica-canto-poesia-sarda", label: "Musica e poesia" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "stintino",
    path: "/cultura-sarda/nord-sardegna/stintino",
    town: "Stintino",
    province: "Sassari",
    area: "Nurra",
    title: "Stintino: Museo della Tonnara, Asinara e Pelosa",
    h1: "Stintino",
    description:
      "Stintino: pescatori dell’Asinara, MUT Museo della Tonnara e Tonnara Saline. La Pelosa è costa, non il paese.",
    hero: {
      src: "/images/cultura/stintino-panorama.webp",
      alt: "Stintino visto dal mare, con la lingua di terra della Nurra",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Stintino_-_Panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/stintino-tonnare.webp",
      alt: "Le Tonnare di Stintino sul golfo dell’Asinara",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Stintino_-_Le_Tonnare_(01).JPG",
      },
    },
    intro:
      "Stintino è un paese di pescatori nato tardi, quando l’Asinara diventò colonia penale e le famiglie lasciarono l’isola. Oggi tutti cercano la Pelosa. Questa scheda parte dal MUT, il Museo della Tonnara: senza quella storia il paese è solo una spiaggia. Non allunghiamo l’elenco delle calette: accessi e regole della Pelosa stanno sul Comune, e cambiano.",
    history: [
      "Nel 1885 lo Stato fa dell’Asinara un lazzaretto e poi un carcere. I pastori e i tonnarotti che ci vivevano scendono sulla lingua di terra di fronte, in Nurra: nasce Istintinu, poi Stintino. Comune autonomo solo dal 1988. Prima era frazione di Sassari. L’identità è quella: gente dell’isola che ha portato reti, barche e la Tonnara Saline sul golfo.",
      "La mattanza nel golfo dell’Asinara dura fino al Novecento. Poi il turismo prende la Pelosa e il porto. Il museo, aperto nel 2016 nell’ex stabilimento Alpi, tiene attrezzi, diari, abiti, video. Non è un museo di pezzi rari: è la memoria di un mestiere spento.",
    ],
    language: [
      "Le famiglie che scesero dall’Asinara portarono il parlato di quell’isola, oggi mescolato all’italiano e al sardo della Nurra. Non forziamo un’etichetta unica: Stintino è un paese recente (comune dal 1988), e la lingua di piazza cambia con la stagione. La guida alle lingue inquadra sardo, sassarese e catalano dei comuni vicini senza attribuire a Stintino una «varietà da brochure».",
    ],
    traditions: [
      {
        title: "Paese di mare, non solo spiaggia",
        body: "Processione della Madonna, festa in porto, barche. Stintino è piccolo: in inverno si svuota, in agosto si riempie. Se vuoi il paese, vieni fuori stagione o la sera, dopo che i bagnanti sono scesi dalla Pelosa. Accessi e regole della Pelosa: Comune, ogni stagione.",
      },
    ],
    crafts: [
      {
        title: "La tonnara",
        body: "Reti fisse, camere, ciurma, rais: un mestiere spento, non un souvenir. Il MUT (Museo della Tonnara) ricostruisce il ciclo con filmati e oggetti. D’estate il museo apre anche di sera: conviene, perché di giorno la coda è alla Pelosa. Le Tonnare, il villaggio sul mare verso l’Asinara, restano il segno visibile di quella economia. Orari: mutstintino.com.",
      },
    ],
    visit: [
      {
        name: "MUT Museo della Tonnara",
        body: "Via Lepanto, sulla panoramica verso il paese, affaccio su porto Minori. Percorso multimediale sulla Tonnara Saline, Stintino e l’Asinara. Biglietto intero 5 euro (verifica su mutstintino.com). Orari cambiano tra estate e inverno: d’estate spesso serali. Prenotazioni: mut@comune.stintino.ss.it.",
      },
      {
        name: "Tonnare, Pelosa, Asinara",
        body: "Il villaggio delle Tonnare si raggiunge in auto o bici. La Pelosa è a nord, Capo Falcone: in alta stagione servono regole di accesso, non entrare col sacco pieno. L’Asinara è parco: traghetti da Stintino o Porto Torres, visite guidate. Il museo serve a capire cosa stai guardando dal molo.",
      },
    ],
    faqs: [
      {
        question: "Oltre alla Pelosa, cosa vedere a Stintino?",
        answer:
          "Il Museo della Tonnara e il villaggio delle Tonnare. Poi il porto e, se vuoi l’isola, l’Asinara con biglietto del parco.",
      },
      {
        question: "Il museo è aperto in estate?",
        answer:
          "Sì, spesso anche in orario serale tra giugno e settembre. In inverno chiude alcuni giorni feriali: controlla mutstintino.com prima di partire.",
      },
    ],
    sources: [
      {
        label: "Comune di Stintino",
        href: "https://www.comune.stintino.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/territori-sardegna", label: "Territori: Nurra" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura-sarda/nord-sardegna/alghero", label: "Guida Alghero" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "palau",
    path: "/cultura-sarda/nord-sardegna/palau",
    town: "Palau",
    province: "Sassari",
    area: "Gallura",
    title: "Palau: Roccia dell’Orso, Monte Altura e museo etnografico",
    h1: "Palau",
    description:
      "Palau, Gallura: Roccia dell’Orso monumento naturale, Fortezza di Monte Altura e Museo etnografico. Non solo lo scalo per La Maddalena.",
    hero: {
      src: "/images/cultura/palau-panorama.webp",
      alt: "Panorama di Palau sul golfo, tra case e mare della Gallura",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Palau,_panorama_(01).jpg",
      },
    },
    visitPhoto: {
      src: "/images/cultura/palau-capo-orso.webp",
      alt: "La Roccia dell’Orso a Capo d’Orso, sopra Palau",
      credit: {
        author: "Discanto",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Palau,_capo_d'Orso_(02).jpg",
      },
    },
    intro:
      "Palau si legge dal granito e dalla Roccia dell’Orso: monumento naturale, simbolo del comune, punto di riferimento della costa di fronte a La Maddalena. Chi la riduce al molo dei traghetti perde le fortificazioni di fine Ottocento e il Museo etnografico, dove la Gallura degli stazzi e dei mestieri sta senza mare. Il porto collega l’arcipelago; non è la tesi di questa scheda.",
    historyHeading: "Comune e costa fortificata",
    history: [
      "Il Comune documenta la nascita di Palau come ente autonomo con la legge regionale n. 2 del 6 febbraio 1959: la frazione omonima si stacca da Tempio Pausania. Il territorio confina con Arzachena, Tempio Pausania e Santa Teresa Gallura, e guarda il mare verso l’arcipelago di La Maddalena. Prima di quella data Palau non è ancora comune: è frazione gallurese legata a Tempio.",
      "Alla fine dell’Ottocento, sulla costa nord-orientale prospiciente La Maddalena, nasce il sistema delle «Grandi Fortificazioni». SardegnaCultura colloca sul territorio di Palau tre grandi batterie — Monte Altura, Capo d’Orso e Baragge — concepite insieme alle opere sulle isole per la difesa del Mediterraneo occidentale. Il rapporto con La Maddalena è dunque anche militare e architettonico, non solo di collegamento marittimo. La Batteria di Capo d’Orso, documentata dal Ministero della Cultura tra i beni abbandonati, non è oggi fruibile come sito di visita: dopo la Seconda guerra mondiale le fortificazioni di Palau persero importanza e furono lasciate; lo stato di conservazione risulta cattivo. Resta patrimonio storico del sistema, distinto dalla Fortezza di Monte Altura, visitabile.",
    ],
    language: [
      "Si parla gallurese, accanto all’italiano. È la stessa area di Tempio e Arzachena, distinta dal sardo. La guida alle lingue tiene gallurese e sardo distinti.",
    ],
    traditionsHeading: "Roccia dell’Orso",
    traditions: [
      {
        title: "Monumento naturale e simbolo",
        body: "SardegnaCultura descrive la Roccia dell’Orso come formazione granitica su un rilievo di circa 120 metri, modellata da vento e agenti atmosferici fino alla sagoma di un orso sul braccio di mare tra Palau e La Maddalena. La scheda regionale ne indica frequentazione fin da tempi preistorici e presenza negli scritti dei geografi antichi: Tolomeo (II secolo d.C.) la richiama come «Areti Promontorium»; la prima illustrazione grafica compare nell’Itinerario di Alberto La Marmora. Nel 1993 la Regione Sardegna la dichiara monumento naturale; l’immagine dell’orso è nel gonfalone del comune. ISPRA la classifica come museo in situ di interesse geologico e paesaggistico: nicchie e tafoni nel granito; sul sito sono documentati materiali prenuragici e nuragici (ceramica e litica). Non è un belvedere generico: è il fatto culturale che tiene insieme paesaggio, memoria di navigazione e identità civica.",
      },
    ],
    crafts: [
      {
        title: "Museo etnografico",
        body: "SardegnaCultura colloca il Museo etnografico in via Nazionale 111, località Montiggia: due saloni e sei sezioni — ambiente domestico, viticoltura e vinicoltura, agricoltura, allevamento, mezzi di trasporto, mestieri. Gli oggetti vengono da stazzi e dalle prime botteghe artigiane: arredi e utensili di panificazione e caseificazione, torchi e botti, aratri, campanacci, carro a buoi, attrezzi del fabbro, del falegname e del calzolaio. La scheda regionale lo presenta come strumento per leggere le origini del paese gallurese attraverso la vita agro-pastorale. È la Gallura senza mare: non un’appendice del porto.",
      },
    ],
    visitHeading: "Roccia, fortezza, museo",
    visit: [
      {
        name: "Roccia dell’Orso",
        body: "Il sito è documentato da SardegnaCultura come monumento naturale visitabile a Capo d’Orso. Orari, biglietti e modalità di accesso si confermano sul gestore e sulla scheda regionale: qui non li copiamo. Si distingue dalla Batteria di Capo d’Orso, che resta fuori dalla visita ordinaria.",
      },
      {
        name: "Fortezza di Monte Altura",
        body: "Costruita tra il 1887 e il 1889 in granito locale, la batteria di Monte Altura doveva battere lo specchio d’acqua a ovest, con vista dalle isole alla Corsica. SardegnaCultura la descrive come cittadella militare — alloggi, magazzini, scuderie, officine — e come uno dei più grandi forti edificati in Italia nel XIX secolo; dal 1990, con il passaggio alla Soprintendenza, è valorizzata in chiave culturale e aperta alle visite guidate. Accesso e aperture: scheda regionale e gestore. Non inventiamo orari.",
      },
      {
        name: "Museo etnografico e collegamento con La Maddalena",
        body: "Il museo a Montiggia completa il percorso culturale: stazzi e mestieri, non spiagge. Il porto resta infrastruttura di collegamento con l’arcipelago di La Maddalena; su EVERAS la scheda dell’arcipelago racconta Caprera e il Compendio garibaldino. Qui il punto è Palau: orso, fortezza, museo.",
      },
    ],
    faqs: [
      {
        question: "Perché la Roccia dell’Orso è importante per Palau?",
        answer:
          "Perché è monumento naturale dal 1993, simbolo sul gonfalone comunale e formazione granitica documentata da SardegnaCultura e ISPRA come luogo di navigazione antica e di frequentazione preistorica. Non è solo un punto panoramico.",
      },
      {
        question: "Che cos’è la Fortezza di Monte Altura?",
        answer:
          "È la batteria di fine Ottocento (1887–1889) sul territorio di Palau, parte delle Grandi Fortificazioni a difesa della costa verso La Maddalena. SardegnaCultura la indica come sito visitabile, distinto dalla Batteria di Capo d’Orso.",
      },
      {
        question:
          "Qual è il rapporto tra Palau e il sistema difensivo di La Maddalena?",
        answer:
          "Sul territorio di Palau sorsero tre grandi batterie — Monte Altura, Capo d’Orso e Baragge — concepite insieme alle fortificazioni dell’arcipelago. Il rapporto è militare e architettonico, oltre che di collegamento marittimo.",
      },
      {
        question: "Cosa racconta il Museo etnografico di Palau?",
        answer:
          "Stazzi, agricoltura, viticoltura, allevamento e mestieri della Gallura, attraverso oggetti recuperati negli stazzi e nelle prime botteghe. SardegnaCultura lo presenta come lettura delle origini del paese senza ridurlo al porto.",
      },
      {
        question: "Palau appartiene alla cultura gallurese?",
        answer:
          "Sì: si parla gallurese, distinto dal sardo, e il Museo etnografico documenta la vita agro-pastorale gallurese. La guida alle lingue colloca gallurese e sardo su piani distinti.",
      },
    ],
    sources: [
      {
        label: "SardegnaCultura — Palau, Roccia dell’Orso",
        href: "https://www.sardegnacultura.it/articolo/palau-roccia-dell-orso",
      },
      {
        label: "SardegnaCultura — Palau, Fortezza di Monte Altura",
        href: "https://www.sardegnacultura.it/articolo/palau-fortezza-di-monte-altura",
      },
      {
        label: "SardegnaCultura — Palau, Museo etnografico",
        href: "https://www.sardegnacultura.it/articolo/palau-museo-etnografico",
      },
      {
        label: "ISPRA — L’Orso di Palau",
        href: "https://www.isprambiente.gov.it/it/attivita/museo/regioni/musei/l2019orso-di-palau",
      },
      {
        label: "MiC — Batteria Capo d’Orso (beni abbandonati)",
        href: "https://beniabbandonati.cultura.gov.it/beni/batteria-capo-dorso-fabbricati-interni-allopera/",
      },
      {
        label: "Comune di Palau — costituzione del Comune",
        href: "https://comune.palau.ss.it/luoghi/2908617/comune-palau",
      },
    ],
    relatedLinksHeading: "Scopri anche",
    relatedLinksIntro:
      "La Maddalena per l’arcipelago e il sistema difensivo; Aggius per l’etnografia gallurese di entroterra; Arzachena e Santa Teresa per la Gallura costiera e settentrionale.",
    relatedLinks: [
      { href: "/cultura/lingue-sardegna", label: "Lingue: gallurese" },
      { href: "/cultura/territori-sardegna", label: "Territori: Gallura" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura-sarda/nord-sardegna/la-maddalena", label: "Guida La Maddalena" },
      { href: "/cultura-sarda/nord-sardegna/arzachena", label: "Guida Arzachena" },
      {
        href: "/cultura-sarda/nord-sardegna/santa-teresa-gallura",
        label: "Guida Santa Teresa Gallura",
      },
      { href: "/cultura-sarda/nord-sardegna/aggius", label: "Guida Aggius" },
    ],
    publishedAt: "2026-09-21",
  },
  {
    slug: "santa-teresa-gallura",
    path: "/cultura-sarda/nord-sardegna/santa-teresa-gallura",
    town: "Santa Teresa Gallura",
    province: "Sassari",
    area: "Gallura",
    title: "Santa Teresa Gallura: torre Longonsardo e Capo Testa",
    h1: "Santa Teresa Gallura",
    description:
      "Santa Teresa Gallura: Torre di Longonsardo, Capo Testa e Stretto di Bonifacio.",
    hero: {
      src: "/images/cultura/santa-teresa-panorama.webp",
      alt: "Panorama di Santa Teresa Gallura sulla costa dello Stretto",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Santa_Teresa_Gallura_-_Panorama_(01).JPG",
      },
    },
    visitPhoto: {
      src: "/images/cultura/santa-teresa-torre.webp",
      alt: "La Torre di Longonsardo a Santa Teresa Gallura",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Santa_Teresa_Gallura_-_Torre_di_Longonsardo_(03).JPG",
      },
    },
    intro:
      "Santa Teresa è il punto più a nord della Sardegna: Stretto di Bonifacio, Corsica a vista, granito di Capo Testa. Chi arriva per Rena Bianca trova anche la Torre di Longonsardo e un paese disegnato a scacchiera. Questa scheda tiene torre, capo e porto, non solo la spiaggia sotto piazza.",
    history: [
      "Il forte e la torre aragonese di Longonsardo controllano lo Stretto da secoli. Il paese moderno nasce nell’Ottocento voluto da Vittorio Emanuele I: pianta regolare, piazza centrale, nome alla moglie Maria Teresa. Prima c’erano torri, pastori e il porto naturale. Il comune è gallurese, lingua e tutto: di fronte c’è Bonifacio, non Olbia.",
      "Capo Testa, a ovest, è un altro mondo di granito: cave romane, faro, calette. Il turismo ha riempito agosto; fuori stagione restano vento, sentieri e il traghetto per la Corsica quando gira. Santa Teresa non è un sobborgo di Palau: è testa di ponte nord.",
    ],
    language: [
      "Si parla gallurese, accanto all’italiano. Di fronte c’è Bonifacio: lo Stretto è anche un confine linguistico, non solo geografico. La guida alle lingue colloca il gallurese nel gruppo tosco-corso, distinto dal sardo. Non inventiamo quanti parlanti restano.",
    ],
    traditions: [
      {
        title: "Torre e Stretto",
        body: "La Torre di Longonsardo (o aragonese) domina il porto vecchio: si visita in estate e nei weekend secondo orari comunali. Da lassù Capo Testa da un lato, Corsica dall’altro. È il pezzo di storia che tiene insieme dogana e paese a scacchiera. Date di feste: Comune.",
      },
    ],
    crafts: [
      {
        title: "Granito di Capo Testa",
        body: "Le cave di granito sul capo sono documentate dall’antichità: pietra estratta e spedita, non un souvenir. Oggi il mestiere visibile è più il taglio e il paesaggio di cava che una bottega da visitare. Si cammina sui sentieri segnati; non si entra dove è vietato.",
      },
    ],
    visit: [
      {
        name: "Torre di Longonsardo e centro",
        body: "La torre sul promontorio, poi piazza Vittorio Emanuele e le vie a scacchiera fino a Rena Bianca. In alta stagione la spiaggia sotto il paese è piena entro metà mattina: arriva presto o scegli Capo Testa. Orari torre e biglietti: chiedi in Informazioni turistiche in piazza.",
      },
      {
        name: "Capo Testa",
        body: "A pochi minuti in auto o bici: faro, calette, cave di granito usate fin dall’antichità. Sentieri sul granito: scarpe chiuse, vento forte. Non è un parcheggio illimitato in agosto: usa gli stalli segnalati e non lasciare rifiuti sulle rocce.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere a Santa Teresa Gallura in un giorno?",
        answer:
          "Mattina alla torre e in centro verso Rena Bianca. Pomeriggio a Capo Testa. Con più tempo, traghetto per Bonifacio o giro verso Palau.",
      },
      {
        question: "La torre si può visitare?",
        answer:
          "Sì, in stagione con orario del Comune. Fuori estate può essere chiusa infrasettimanale: conferma in loco prima di salire.",
      },
      {
        question: "Si parla sardo a Santa Teresa?",
        answer:
          "Si parla gallurese, distinto dal sardo. L’italiano è ovunque. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Santa Teresa Gallura",
        href: "https://www.comune.santateresagallura.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: gallurese" },
      { href: "/cultura/territori-sardegna", label: "Territori: Gallura" },
      { href: "/cultura-sarda/nord-sardegna/palau", label: "Guida Palau" },
      { href: "/cultura-sarda/nord-sardegna/tempio-pausania", label: "Guida Tempio" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "sorso",
    path: "/cultura-sarda/nord-sardegna/sorso",
    town: "Sorso",
    province: "Sassari",
    area: "Romangia",
    title: "Sorso: Romangia, Noli Me Tollere e costa di Platamona",
    h1: "Sorso",
    description:
      "Sorso, Romangia: chiesa Noli Me Tollere, vino e Carnevale. Platamona è la costa del comune.",
    hero: {
      src: "/images/cultura/sorso-panorama.webp",
      alt: "Panorama di Sorso sulla piana della Romangia",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Sorso_-_Panorama_(01).JPG",
      },
    },
    visitPhoto: {
      src: "/images/cultura/sorso-arboriamar.webp",
      alt: "La pineta e la costa di Arboriamar a Sorso",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Sorso_-_Arboriamar_(01).JPG",
      },
    },
    intro:
      "Sorso è il grande comune della Romangia, a nord di Sassari: vigneti, centro vivo, mare a Platamona e Arboriamar. Chi la tratta solo come spiaggia perde la chiesa Noli Me Tollere e un Carnevale che riempie le vie. Questa scheda tiene paese e costa insieme.",
    history: [
      "Territorio abitato da sempre: nuraghi, tombe, poi villaggi della Romangia legati a Sassari. Sorso cresce come centro agricolo e vinicolo; il sassarese e il sardo si mescolano nelle case. Nel Novecento la costa di Platamona diventa balneare, mentre il nucleo resta sull’entroterra fertile, a pochi chilometri dal mare.",
      "Oggi è uno dei comuni più popolosi del Nord dopo Sassari e Olbia. Il centro ha municipio, chiese, mercato; la pineta e le spiagge sono l’altra metà del comune. Non è un borgo-cartolina: è una città-paese che lavora e va al mare la sera.",
    ],
    language: [
      "Si parla sassarese della Romangia, accanto all’italiano e, in misura variabile, al sardo. Sorso e Sennori stanno nella fascia di Sassari, non in Gallura. La guida alle lingue tiene sassarese e sardo distinti. Non pubblichiamo percentuali.",
    ],
    traditions: [
      {
        title: "Noli Me Tollere e Carnevale",
        body: "La chiesa di Noli Me Tollere è il segno religioso più citato: culto e festa che tirano gente dalla provincia. A febbraio il Carnevale di Sorso è tra i più seguiti del Nord: maschere, carri, rogo. Date: Comune e Pro Loco, ogni anno. Hub EVERAS: Carnevale in Sardegna.",
      },
    ],
    crafts: [
      {
        title: "Vino della Romangia",
        body: "Il mestiere documentato è agricolo: vigneti di collina, Cannonau, Vermentino e uvaggi locali. Si parte dalle cantine in paese, non dallo scaffale in costa. Non pubblichiamo listini né orari di degustazione: si chiede in azienda o in Comune.",
      },
    ],
    visit: [
      {
        name: "Centro e Noli Me Tollere",
        body: "Cammina il centro: municipio, chiese, vie commerciali. La chiesa di Noli Me Tollere si visita secondo orari parrocchiali; in festa il paese si chiude e si riempie. Chiedi in Comune o in pro loco il calendario di Carnevale e delle patronali.",
      },
      {
        name: "Arboriamar e Platamona",
        body: "La costa comunale è pineta e spiaggia lunga: Arboriamar, Platamona verso Porto Torres. D’estate parcheggi e lidi; fuori stagione è passeggiata al vento. Non lasciare l’auto sulla sabbia e rispetta le zone dunali segnalate.",
      },
    ],
    faqs: [
      {
        question: "Sorso è sul mare?",
        answer:
          "Il centro è nell’entroterra della Romangia; le spiagge di Platamona e Arboriamar sono nel territorio comunale, a pochi minuti in auto.",
      },
      {
        question: "Cosa non perdere a Sorso?",
        answer:
          "Il centro con Noli Me Tollere, una cantina se è aperta, e a febbraio il Carnevale. La costa è nel comune, non è il paese.",
      },
      {
        question: "Si parla sardo a Sorso?",
        answer:
          "In Romangia è più visibile il sassarese, accanto all’italiano. Non è il gallurese né il logudorese dei paesi alti. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Sorso",
        href: "https://www.comune.sorso.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: sassarese" },
      { href: "/cultura/cucina-sarda", label: "Cucina tradizionale" },
      { href: "/eventi-sardegna/carnevale-sardegna", label: "Carnevale in Sardegna" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "ittiri",
    path: "/cultura-sarda/nord-sardegna/ittiri",
    town: "Ittiri",
    province: "Sassari",
    area: "Logudoro",
    title: "Ittiri: costumi, Logudoro e paese alto",
    h1: "Ittiri",
    description:
      "Ittiri, Logudoro: costume tradizionale, chiese e paese alto tra Sassari e l’interno.",
    hero: {
      src: "/images/cultura/ittiri-panorama.webp",
      alt: "Panorama di Ittiri sul colle del Logudoro",
      credit: {
        author: "Giovanniittiri",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Panorama_di_Ittiri.jpg",
      },
    },
    traditionPhoto: {
      src: "/images/cultura/ittiri-costume.webp",
      alt: "Costume tradizionale di Ittiri",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Ittiri_-_Costume_tradizionale_(03).JPG",
      },
    },
    intro:
      "Ittiri è paese alto del Logudoro, tra Sassari e l’interno: noto per il costume femminile tra i più ricchi dell’isola e per una comunità che lo porta ancora in Cavalcata e feste. Questa scheda parte da lì, non da un elenco di spiagge che non ci sono.",
    history: [
      "Il territorio è pieno di segni prenuragici e nuragici; il paese medievale sta nella rete del giudicato di Torres e poi nei feudi. Ittiri cresce come centro agricolo e pastorale: grano, vigna, ovini. Il nome resta legato al sardo logudorese e a una dignità del vestito che non è folklore da vetrina.",
      "Nel Novecento emigrazione e ritorno, come in molti paesi del Nord interno. Oggi Ittiri è comune vivo, non museo: scuole, piazza, associazioni che tengono vivo il costume e le feste. Monte Torru e le campagne intorno spiegano perché il paese sta sul colle.",
    ],
    language: [
      "Si parla sardo logudorese, accanto all’italiano. Ittiri non è sassarese di città né gallurese. La guida alle lingue e quella ai costumi tengono parlato e abito su piani distinti.",
    ],
    traditions: [
      {
        title: "Feste e Cavalcata",
        body: "Patronali, processioni, canto. Ittiri manda gruppi a cavallo e in costume quando Sassari chiama la Cavalcata: è parte della rete dei paesi del Nord interno. Date: Comune e Pro Loco. Storia della rassegna: scheda Cavalcata e guida ai costumi.",
      },
    ],
    crafts: [
      {
        title: "Sarte e costume",
        body: "Il vestito tradizionale femminile — colori, gioielli, veli — è tra i più fotografati alle sfilate. Non è un costume da noleggio per un giorno: famiglie e sarte lo custodiscono. Se lo vedi in piazza, stai a bordo campo: è rito, non set. Non pubblichiamo botteghe né listini.",
      },
    ],
    visit: [
      {
        name: "Centro e chiese",
        body: "Il centro sul colle: parrocchiale, vie alte, vista sulla campagna. Chiedi in Comune o in pro loco se ci sono mostre o depositi del costume visitabili: non sempre aperti al pubblico, ma in festa il paese si spiega da solo.",
      },
      {
        name: "Campagna e Monte Torru",
        body: "Nei dintorni: colline, nuraghi, strade verso Thiesi, Banari, Florinas. Monte Torru è il belvedere tipico. Auto necessaria; in estate il caldo in piana è forte: acqua e orari mattutini.",
      },
    ],
    faqs: [
      {
        question: "Perché Ittiri è famosa?",
        answer:
          "Per il costume tradizionale, tra i più elaborati della Sardegna, e per il ruolo nelle sfilate e feste del Nord.",
      },
      {
        question: "Cosa vedere a Ittiri in mezza giornata?",
        answer:
          "Il centro e le chiese; se c’è una festa o una mostra del costume, resta per quella. Poi un giro sulle colline verso Monte Torru.",
      },
      {
        question: "Si parla sardo a Ittiri?",
        answer:
          "Sì, logudorese, accanto all’italiano. Non è il sassarese di Sassari. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Ittiri",
        href: "https://www.comune.ittiri.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/costumi-sardi", label: "Costumi tradizionali" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/cavalcata-sarda-sassari", label: "Cavalcata Sarda" },
      { href: "/eventi-sardegna/cavalcata-sarda", label: "Cavalcata, calendario" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "calangianus",
    path: "/cultura-sarda/nord-sardegna/calangianus",
    town: "Calangianus",
    province: "Sassari",
    area: "Gallura",
    title: "Calangianus: Museo del Sughero e Gallura interna",
    h1: "Calangianus",
    description:
      "Calangianus, Gallura interna: Museo del Sughero, filiera del sughero e paese granitico.",
    hero: {
      src: "/images/cultura/calangianus-panorama.webp",
      alt: "Panorama di Calangianus tra sugherete e granito della Gallura",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Calangianus_-_Panorama_(01).JPG",
      },
    },
    visitPhoto: {
      src: "/images/cultura/calangianus-museo-sughero.webp",
      alt: "Interno del Museo del Sughero a Calangianus",
      credit: {
        author: "Calangianese nel cuore",
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Museo_del_Sughero_-_Calangianus_-_2.jpg",
      },
    },
    intro:
      "Calangianus è la capitale del sughero in Gallura: non uno slogan, una filiera di boschi, fabbriche e un museo. Chi scende da Tempio verso la costa passa di qui. Questa scheda parte dal Museo del Sughero e dal paese granitico, non dalle spiagge lontane.",
    history: [
      "Paese gallurese di entroterra, tra sugherete e granito. Nel Novecento la lavorazione del sughero — tappi, pannelli, agglomerati — fa di Calangianus un centro industriale di nicchia conosciuto in Europa. Prima c’erano pastorizia, carbone, piccole attività: il sughero cambia scala e tiene lavoro quando altri paesi si svuotano.",
      "Il tessuto urbano è quello tipico della Gallura interna: case in pietra, chiese, l’ex convento dei cappuccini. Tempio è vicina; il mare (Olbia, Palau) è un’altra mezz’ora. Calangianus non è una frazione-spiaggia: è fabbrica e museo di un mestiere ancora vivo.",
    ],
    language: [
      "Si parla gallurese, accanto all’italiano. È l’entroterra di Tempio e Aggius, non la costa. La guida alle lingue tiene gallurese e sardo distinti.",
    ],
    traditions: [
      {
        title: "Gallura interna",
        body: "Feste patronali, lingua, cucina di entroterra. A settembre e ottobre, quando si lavora il bosco, il paese ha un altro ritmo rispetto ad agosto in costa. Date: Comune.",
      },
    ],
    crafts: [
      {
        title: "Sughero",
        body: "La decortica estiva, i piazzali, le aziende: il ciclo del sughero si vede ancora. Il museo racconta attrezzi, macchine, storia sociale. Non è un’attrazione da brochure: è la ragione per cui il paese compare nelle mappe economiche dell’isola. La guida all’artigianato colloca Tempio e Calangianus nello stesso distretto, senza catalogo di vendita.",
      },
    ],
    visit: [
      {
        name: "Museo del Sughero",
        body: "In paese, dedicato alla filiera: dall’albero al tappo. Verifica orari e visite sul Comune o sui canali del museo: in paesi piccoli i giorni cambiano. Se puoi, abbina una ditta che apre al pubblico o un piazzale di stoccaggio visto dalla strada — senza entrare dove non sei invitato.",
      },
      {
        name: "Centro ed ex convento",
        body: "Cammina il centro granitico e l’ex convento dei cappuccini, spesso usato per mostre e cultura. Da Calangianus parti per Tempio, per le sugherete e per i sentieri del Limbara se hai gambe e mappa.",
      },
    ],
    faqs: [
      {
        question: "Perché Calangianus è legata al sughero?",
        answer:
          "Perché qui si è concentrata lavorazione e commercio del sughero gallurese. Il Museo del Sughero lo spiega meglio di qualsiasi brochure.",
      },
      {
        question: "Il museo è aperto tutto l’anno?",
        answer:
          "Orari variabili: conferma con il Comune prima di partire, soprattutto fuori estate e il lunedì.",
      },
      {
        question: "Si parla sardo a Calangianus?",
        answer:
          "Si parla gallurese, distinto dal sardo. L’italiano è ovunque. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Calangianus",
        href: "https://comune.calangianus.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato: sughero" },
      { href: "/cultura/lingue-sardegna", label: "Lingue: gallurese" },
      { href: "/cultura/territori-sardegna", label: "Territori: Gallura" },
      { href: "/cultura/musei-sardegna", label: "Musei" },
      { href: "/cultura-sarda/nord-sardegna/tempio-pausania", label: "Guida Tempio" },
      { href: "/cultura-sarda/nord-sardegna/aggius", label: "Guida Aggius" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "valledoria",
    path: "/cultura-sarda/nord-sardegna/valledoria",
    town: "Valledoria",
    province: "Sassari",
    area: "Anglona",
    title: "Valledoria: foce del Coghinas e San Pietro a Mare",
    h1: "Valledoria",
    description:
      "Valledoria, Anglona: foce del Coghinas. San Pietro a Mare è la frazione-spiaggia, non il comune.",
    hero: {
      src: "/images/cultura/valledoria-panorama.webp",
      alt: "Panorama di Valledoria sulla piana verso il mare",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Valledoria_-_Panorama_(01).JPG",
      },
    },
    visitPhoto: {
      src: "/images/cultura/valledoria-san-pietro.webp",
      alt: "San Pietro a Mare a Valledoria, sulla costa dell’Anglona",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 4.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Valledoria_-_San_Pietro_a_Mare_(01).JPG",
      },
    },
    intro:
      "Valledoria sta dove il Coghinas arriva al mare: piana fertile, spiaggia lunga, Anglona costiera tra Castelsardo e la Gallura. Chi cerca solo il lido perde la foce e il paese agricolo dietro le dune. Questa scheda tiene fiume, mare e centro insieme.",
    history: [
      "La piana del Coghinas è coltivata da secoli: orti, vigneti, pastorizia. Valledoria come comune moderno nasce nel Novecento (autonomia da Sedini e altri assetti); prima il territorio era sparso tra frazioni e chiese. San Pietro a Mare è il fronte balneare; il nome del comune parla della valle, non solo della battigia.",
      "Il turismo estivo ha allargato campeggi e seconde case. Fuori stagione restano vento di maestrale, foce e un paese che lavora la terra. Badesi è di fronte sulla foce: stesso paesaggio, due comuni.",
    ],
    language: [
      "Si parla sardo della fascia di Anglona, accanto all’italiano. Non è gallurese né sassarese di città. Castelsardo, a ovest, è il rinvio di territorio. La guida alle lingue tiene l’Anglona distinta dalla Gallura.",
    ],
    traditions: [
      {
        title: "Foce e paese",
        body: "Il Coghinas marca il confine naturale: pesca, zone umide, luce bassa la sera. Non è una riserva sempre accessibile allo stesso modo: rispetta i divieti stagionali. Patronali e sagre, quando Comune e Pro Loco le pubblicano, stanno in calendario. San Pietro a Mare è la frazione-spiaggia, non il nome culturale del comune.",
      },
    ],
    visit: [
      {
        name: "San Pietro a Mare",
        body: "Spiaggia ampia, stabilimenti in estate, passeggiata fuori stagione. Parcheggia negli stalli; la sabbia e le dune non sono strade. In paese dietro la costa: chiese, piazza, servizi — utili se viaggi con bambini.",
      },
      {
        name: "Foce del Coghinas",
        body: "Verso Badesi: foce, canali, luce bassa la sera. Ideale a piedi o in bici. Porta binocolo se ti interessa l’avifauna; non entrare con mezzi dove è vietato. Da Valledoria puoi salire a Castelsardo o continuare verso Santa Teresa e la Gallura.",
      },
    ],
    faqs: [
      {
        question: "Valledoria e San Pietro a Mare sono la stessa cosa?",
        answer:
          "San Pietro a Mare è la frazione-spiaggia; Valledoria è il comune, con il centro nella piana dietro la costa.",
      },
      {
        question: "Cosa vedere oltre la spiaggia?",
        answer:
          "La foce del Coghinas e un giro in paese. Con più tempo, Castelsardo a ovest. La battigia non è la storia del comune.",
      },
      {
        question: "Si parla sardo a Valledoria?",
        answer:
          "Sì, sardo di Anglona, accanto all’italiano. Non è il gallurese della costa a est. Dettagli nella guida alle lingue.",
      },
    ],
    sources: [
      {
        label: "Comune di Valledoria",
        href: "https://comune.valledoria.ss.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/territori-sardegna", label: "Territori: Anglona" },
      { href: "/cultura-sarda/nord-sardegna/castelsardo", label: "Guida Castelsardo" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    publishedAt: "2026-09-11",
  },
];
