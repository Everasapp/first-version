import type { CultureTownArticle } from "@/src/lib/seo/cultura-towns";

const GIANNI = { author: "Gianni Careddu" } as const;

export const NORD_CULTURE_TOWNS: CultureTownArticle[] = [
  {
    slug: "castelsardo",
    path: "/cultura-sarda/castelsardo",
    town: "Castelsardo",
    province: "Sassari",
    area: "Anglona",
    title: "Castelsardo: castello, intreccio e Lunissanti",
    h1: "Castelsardo",
    description:
      "Castelsardo in Sardegna: storia del borgo Doria, Museo dell’intreccio, Lunissanti, cattedrale e Roccia dell’Elefante.",
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
    visitPhoto: {
      src: "/images/cultura/castelsardo-elefante.webp",
      alt: "La Roccia dell’Elefante sulla strada tra Castelsardo e Sedini",
      credit: {
        ...GIANNI,
        license: "CC BY-SA 3.0",
        licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
        sourceUrl:
          "https://commons.wikimedia.org/wiki/File:Castelsardo_-_Roccia_dell%27Elefante_(01).jpg",
      },
    },
    intro:
      "Castelsardo è un borgo a picco sul golfo dell’Asinara: il castello dei Doria in cima, le case colorate sotto, il porto in basso. Chi lo cerca vuole il museo dell’intreccio, il Lunissanti e la Roccia dell’Elefante. Questa scheda tiene insieme storia, mestieri e visite, senza trattarlo solo come cartolina da tramonto.",
    history: [
      "Nel XII secolo i Doria genovesi alzano la rocca su un promontorio già abitato. Si chiama Castel Genovese, poi Castel Aragonese quando la corona catalano-aragonese la prende nel 1448. I Savoia, nel Settecento, le danno il nome attuale: Castelsardo. Non è un villaggio inventato per i turisti: è una piazzaforte che ha cambiato padrone restando sullo stesso scoglio.",
      "Dal Cinquecento è sede vescovile (diocesi di Ampurias, oggi Tempio-Ampurias). La concattedrale di Sant’Antonio Abate, con la cupola maiolicata, e le cripte del Maestro di Castelsardo raccontano quella stagione. Sotto le mura restano porto, pescherecci e le cestinaie che lavorano ancora sull’uscio.",
    ],
    traditions: [
      {
        title: "L’intreccio, mestiere del borgo",
        body: "A Castelsardo l’intreccio non è folklore da vetrina: è un sapere passato da pescatori e contadini, oggi dalle cestinaie che usano palma nana, fieno marino e rafia. Corbule, canestri, crivelli, nasse. Lo vedi nelle vie del centro, non solo in museo. Il MIM, Museo dell’intreccio mediterraneo, lo mette in fila con pezzi di tutto il Mediterraneo, compreso su fassoi degli stagni oristanesi.",
      },
      {
        title: "Lunissanti",
        body: "Il lunedì santo è il rito più cercato del paese. La Confraternita di Santa Croce, dal Cinquecento, porta i Misteri da Santa Maria delle Grazie all’abbazia di Tergu, con i cori Miserere, Stabat e Jesus. La sera la Notti Santa spegne le luci del borgo. Non è uno spettacolo: è un pellegrinaggio. Arriva presto, lascia l’auto in basso, cammina.",
      },
    ],
    visit: [
      {
        name: "Castello dei Doria e Museo dell’intreccio",
        body: "Il MIM è dentro la fortezza: nove sale su due piani, terrazze sul golfo. Orari e biglietti sul sito del museo (mimcastelsardo.it). Dagli spalti, con il tempo pulito, si arriva a vedere l’Asinara. Accanto, il percorso verso il Museo delle origini genovesi e le cripte della cattedrale.",
      },
      {
        name: "Cattedrale, centro e Roccia dell’Elefante",
        body: "Sant’Antonio Abate è gotico-catalano e rinascimentale, con la pala del Maestro di Castelsardo. Santa Maria delle Grazie custodisce il Cristo nero del Lunissanti. Fuori paese, al km 4 della SS134 verso Sedini, la Roccia dell’Elefante è una trachite a forma di pachiderma, con domus de janas scavate nel corpo. Fermati con attenzione: la strada è stretta.",
      },
    ],
    faqs: [
      {
        question: "Cosa vedere a Castelsardo in un giorno?",
        answer:
          "Mattina in salita: cattedrale, vie del centro, cestinaie. Poi il castello e il museo dell’intreccio. Nel pomeriggio la Roccia dell’Elefante, sulla strada per Sedini.",
      },
      {
        question: "Quando è il Lunissanti?",
        answer:
          "Il lunedì santo, la settimana prima di Pasqua. Date e orari li pubblica la Confraternita ogni anno: il percorso tocca Santa Maria e Tergu.",
      },
    ],
    publishedAt: "2026-09-11",
  },
  {
    slug: "aggius",
    path: "/cultura-sarda/aggius",
    town: "Aggius",
    province: "Sassari",
    area: "Gallura",
    title: "Aggius: musei, tappeti e Valle della Luna",
    h1: "Aggius",
    description:
      "Aggius in Gallura: Museo etnografico MEOC, Museo del Banditismo, tappeti, coro e Valle della Luna.",
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
    traditions: [
      {
        title: "Tappeti e tessitura",
        body: "Il tappeto aggese è il pezzo che esce dal paese. Al MEOC c’è la mostra permanente, con telai e dimostrazioni. In paese restano botteghe: meglio chiamare prima. Lana, colori, motivi geometrici: è un mestiere, non un souvenir da spiaggia.",
      },
      {
        title: "Coro e Settimana Santa",
        body: "Il Coro di Aggius è tra i più noti della Gallura. A Pasqua il borgo tiene i riti spagnoli delle confraternite, dalla Domenica delle Palme alla Resurrezione: uno dei pochi comuni galluresi che li ha conservati per intero. Se cerchi «coro Aggius» o «Settimana Santa Aggius», le date cambiano ogni anno con il calendario liturgico.",
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
    publishedAt: "2026-09-11",
  },
  {
    slug: "tempio-pausania",
    path: "/cultura-sarda/tempio-pausania",
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
    traditions: [
      {
        title: "Lu carrasciali timpiesu",
        body: "Il carnevale di Tempio è allegorico, con carri e maschere, e include lu palu di la frisgiola, giostra a cavallo intorno a un dolce. A marzo le strade si riempiono. A Pasqua li casgiatini, a Natale i papassini. In tavola la suppa cuata. Ad agosto i patroni: San Paolo e la Vergine di Buoncammino.",
      },
      {
        title: "Sughero, vino e abito",
        body: "La lavorazione del sughero ha un museo delle macchine in via Limbara, presso Agris. Vermentino, karana e moscato escono dalle cantine intorno. L’abito tradizionale femminile tempiese è tra i più ricchi della Gallura: lo vedi a luglio, all’incontro internazionale del folklore.",
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
    publishedAt: "2026-09-11",
  },
  {
    slug: "ozieri",
    path: "/cultura-sarda/ozieri",
    town: "Ozieri",
    province: "Sassari",
    area: "Logudoro",
    title: "Ozieri: museo archeologico, Bisarcio e Premio Ozieri",
    h1: "Ozieri",
    description:
      "Ozieri in Logudoro: Civico Museo Archeologico, cultura di Ozieri, basilica di Bisarcio, altane e Premio di letteratura sarda.",
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
    publishedAt: "2026-09-11",
  },
  {
    slug: "stintino",
    path: "/cultura-sarda/stintino",
    town: "Stintino",
    province: "Sassari",
    area: "Nurra",
    title: "Stintino: Museo della Tonnara, Asinara e Pelosa",
    h1: "Stintino",
    description:
      "Stintino in Sardegna: storia dei pescatori dell’Asinara, MUT Museo della Tonnara, Tonnara Saline e cosa vedere oltre la Pelosa.",
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
      "Stintino è un paese di pescatori nato tardi, quando l’Asinara diventò colonia penale e le famiglie lasciarono l’isola. Oggi tutti cercano la Pelosa. Questa scheda parte dal MUT, il Museo della Tonnara: senza quella storia il paese è solo una spiaggia.",
    history: [
      "Nel 1885 lo Stato fa dell’Asinara un lazzaretto e poi un carcere. I pastori e i tonnarotti che ci vivevano scendono sulla lingua di terra di fronte, in Nurra: nasce Istintinu, poi Stintino. Comune autonomo solo dal 1988. Prima era frazione di Sassari. L’identità è quella: gente dell’isola che ha portato reti, barche e la Tonnara Saline sul golfo.",
      "La mattanza nel golfo dell’Asinara dura fino al Novecento. Poi il turismo prende la Pelosa e il porto. Il museo, aperto nel 2016 nell’ex stabilimento Alpi, tiene attrezzi, diari, abiti, video. Non è un museo di pezzi rari: è la memoria di un mestiere spento.",
    ],
    traditions: [
      {
        title: "La tonnara",
        body: "Reti fisse, camere, ciurma, rais. Il MUT ricostruisce il ciclo con filmati e oggetti. D’estate il museo apre anche di sera: conviene, perché di giorno la coda è alla Pelosa. Le Tonnare, il villaggio sul mare verso l’Asinara, restano il segno visibile di quella economia.",
      },
      {
        title: "Paese di mare, non solo spiaggia",
        body: "Processione della Madonna, festa in porto, barche. Stintino è piccolo: in inverno si svuota, in agosto si riempie. Se vuoi il paese, vieni fuori stagione o la sera, dopo che i bagnanti sono scesi dalla Pelosa.",
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
    publishedAt: "2026-09-11",
  },
];
