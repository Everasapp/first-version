import type { CulturaArticle } from "@/src/lib/seo/cultura-articles";
import {
  wikiCommonsPhoto,
  type PhotoCredit,
} from "@/src/lib/seo/cultura-towns";

const CC_BY_SA_4 = {
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
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

export const CULTURA_GUIDE_ARTICLES_PHASE2: CulturaArticle[] = [
  {
    slug: "lingue-sardegna",
    path: "/cultura/lingue-sardegna",
    kind: "guide",
    title: "Lingue della Sardegna: sardo, catalano, gallurese, sassarese e tabarchino",
    h1: "Lingue della Sardegna: sardo, catalano, gallurese, sassarese e altre varietà",
    description:
      "Sardo logudorese e campidanese, catalano di Alghero, gallurese, sassarese e tabarchino: varietà, tutela delle minoranze e territorio.",
    intro:
      "Sull’isola non si parla «un dialetto». Ci sono il sardo, con le sue varietà, e altre lingue storiche legate a città e isole: catalano ad Alghero, gallurese in Gallura, sassarese a Sassari e hinterland, tabarchino a Carloforte e Calasetta. Questa guida tiene i nomi distinti. Non è un corso e non inventa quanti parlanti restano: i dati demografici si leggono su Istat e indagini regionali, che cambiano.",
    excerpt:
      "Sardo, alguerès, gallurese, sassarese e tabarchino: lingue di territorio, non un folklore unico.",
    hero: wikiCommonsPhoto({
      src: "/images/cultura/cultura-lingue-alghero-hero.webp",
      alt: "Piazza Civica ad Alghero: lo spazio pubblico della città catalana",
      author: "Tatyana Peshkova",
      commonsFile: "Alghero,_Piazza_Civica.jpg",
      ...CC_BY_SA_4,
    }),
    sections: [
      {
        title: "Lingua sarda",
        paragraphs: [
          "Il sardo è una lingua romanza autonoma, non un «italiano regionale». Si è formata sull’isola a partire dal latino, con una documentazione scritta medievale (condaghes, Carta de Logu). Oggi convive con l’italiano in modo diverso da un comune all’altro: in alcuni paesi è ancora lingua di piazza, in altri resta in famiglia, nei toponimi, nei canti.",
          "Lo Stato italiano la include tra le minoranze linguistiche storiche con la legge 15 dicembre 1999, n. 482. La Regione Autonoma della Sardegna ha una politica linguistica propria (norme regionali successive). Questa pagina non sostituisce i testi di legge: li indica. L’uso quotidiano non coincide col riconoscimento giuridico.",
        ],
      },
      {
        title: "Logudorese e campidanese",
        paragraphs: [
          "Le due grandi aree del sardo che i linguisti descrivono più spesso sono il logudorese (centro-nord dell’isola, in senso largo) e il campidanese (centro-sud). Non sono due «lingue ufficiali» separate: sono raggruppamenti di varietà locali, con transizioni. Un parlante di Nuoro e uno di Cagliari non hanno lo stesso sistema fonetico né lo stesso lessico di tutti i giorni.",
          "Altri raggruppamenti (nuorese, arborense, e le parlote di singoli paesi) servono agli specialisti. Qui basta il punto: il sardo non è uniforme. Le guide dei comuni, quando parlano di lingua, devono dire il territorio, non «si parla sardo» come se fosse un codice unico.",
        ],
      },
      {
        title: "Gallurese",
        paragraphs: [
          "Il gallurese si parla in Gallura. I linguisti lo collegano al gruppo tosco-corso, non al sardo propriamente detto: è un fatto di classificazione, non un giudizio di «autenticità». Tempio, Calangianus, Arzachena, La Maddalena e i paesi dell’entroterra gallurese sono i rinvii territoriali su EVERAS.",
          "Lingua e turismo costiero non coincidono. Chi arriva per la Costa Smeralda non sente automaticamente il gallurese in ogni locale: la lingua sta nei paesi, nelle famiglie, nei toponimi. La guida Tempio e quella di La Maddalena restano i testi di luogo.",
        ],
      },
      {
        title: "Sassarese",
        paragraphs: [
          "Il sassarese (sassaresu) è la parlata di Sassari e di una fascia di comuni vicini. Come il gallurese, è descritto come varietà di transizione tosco-corsa, distinta dal sardo logudorese dei paesi intorno. In città convive con italiano e, in misura variabile, con il sardo.",
          "La guida Sassari lo ricorda senza farne un gadget. I Candelieri e la Cavalcata sono riti della città: la lingua della piazza in quei giorni è mista. Non inventiamo percentuali di parlanti.",
        ],
      },
      {
        title: "Catalano di Alghero",
        paragraphs: [
          "Ad Alghero (L’Alguer) si parla una varietà di catalano, l’alguerès, legata al ripopolamento aragonese del Trecento. È riconosciuta come minoranza linguistica storica (legge 482/1999). Scuola, toponomastica e rapporti con la Generalitat de Catalunya sono fatti amministrativi documentati dal Comune, non uno slogan da menu.",
          "Alghero non è «la Sardegna catalana». È una città con una storia linguistica specifica, in Nurra, accanto a comuni dove si parla sardo. La scheda Alghero e l’artigianato del corallo tengono mestiere e lingua distinti.",
        ],
      },
      {
        title: "Tabarchino",
        paragraphs: [
          "A Carloforte (Isola di San Pietro) e a Calasetta (Sant’Antioco) si parla il tabarchino, varietà ligure portata dalle comunità di origine pegliese-tabarchina nel Settecento. Anche questa è una minoranza linguistica storica riconosciuta. Non è sardo e non è catalano.",
          "Le schede dei due comuni, quando esistono in Scopri la Sardegna, sono il rinvio territoriale. Questa guida non racconta la pesca o il tonno come «essenza» della lingua: sono economie locali, un altro piano.",
        ],
      },
      {
        title: "Tutela, scuola, identità",
        paragraphs: [
          "La legge 482/1999 consente, nei comuni che lo deliberano, usi nella scuola e nella pubblica amministrazione. L’applicazione è a macchia: dipende da giunte, organici, domanda delle famiglie. Un cartello bilingue non misura quanta lingua si parla in casa.",
          "Identità e lingua non coincidono al cento per cento. Si può essere di un paese e parlare soprattutto italiano; si può cantare in sardo senza usarlo al mercato. Le feste (Cavalcata, patronali, rassegne di poesia) sono uno dei luoghi in cui le varietà restano pubbliche. Per le date: calendario EVERAS, non questa pagina.",
        ],
      },
    ],
    faqs: [
      {
        question: "Il gallurese è sardo?",
        answer:
          "Per la linguistica è una varietà del gruppo tosco-corso, distinta dal sardo. Resta una lingua storica della Gallura, riconosciuta nel quadro delle minoranze. Il nome «sardo» in senso stretto indica un altro gruppo romanzo.",
      },
      {
        question: "Dove si parla catalano in Sardegna?",
        answer:
          "Ad Alghero, come varietà algueresa. Non in tutta la provincia di Sassari. Dettagli di scuola e toponomastica: Comune di Alghero.",
      },
      {
        question: "Esiste un sardo standard unico?",
        answer:
          "Ci sono proposte di normalizzazione scritta, discusse da linguisti e istituzioni. L’uso parlato resta locale. Questa guida non adotta un’ortografia unica come se fosse legge.",
      },
    ],
    sources: [
      {
        label: "Legge 15 dicembre 1999, n. 482 — minoranze linguistiche",
        href: "https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:legge:1999-12-15;482",
      },
      {
        label: "Regione Autonoma della Sardegna",
        href: "https://www.regione.sardegna.it/",
      },
      {
        label: "Comune di Alghero",
        href: "https://www.comune.alghero.ss.it/",
      },
      {
        label: "Comune di Sassari",
        href: "https://www.comune.sassari.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura-sarda/nord-sardegna/alghero", label: "Guida Alghero" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      {
        href: "/cultura-sarda/nord-sardegna/tempio-pausania",
        label: "Guida Tempio Pausania",
      },
      {
        href: "/cultura-sarda/nord-sardegna/la-maddalena",
        label: "Guida La Maddalena",
      },
      {
        href: "/cultura-sarda/sud-sardegna/carloforte",
        label: "Guida Carloforte",
      },
      { href: "/cultura/territori-sardegna", label: "Territori dell’isola" },
      { href: "/cultura/musica-canto-poesia-sarda", label: "Musica e poesia" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["arte-cultura"],
    eventSectionTitle: "Incontri, mostre e rassegne legate a lingua e cultura",
    publishedAt: "2026-09-20",
  },
  {
    slug: "musica-canto-poesia-sarda",
    path: "/cultura/musica-canto-poesia-sarda",
    kind: "guide",
    title: "Musica, canto e poesia della Sardegna",
    h1: "Musica, canto e poesia della Sardegna",
    description:
      "Canto a tenore Unesco, canto a chitarra, cantadores, cori, launeddas, poesia improvvisata e musica nelle feste, con rassegne in calendario su EVERAS.",
    intro:
      "Non esiste un unico «suono della Sardegna». C’è il canto a tenore dell’interno, il canto a chitarra del Logudoro, i cori delle processioni, le launeddas, la poesia a gara, e poi jazz, cantautori, bande. Questa guida tiene i repertori distinti e rimanda alle schede dei paesi e alle date del calendario. Non inventiamo programmi di festival.",
    excerpt:
      "Tenore, chitarra, cantadores e feste: musiche di territorio, non una colonna sonora unica.",
    hero: {
      src: "/images/cultura/maria-carta-ritratto.webp",
      alt: "Maria Carta, cantante di Siligo: una voce che ha portato repertori sardi fuori dall’isola",
      credit: {
        author: "EVERAS",
        license: "Illustrazione originale",
        licenseUrl: "https://www.everas.it/cultura/maria-carta-siligo",
        sourceUrl: "https://www.everas.it/cultura/maria-carta-siligo",
        sourceLabel: "Cultura sarda",
        creditPrefix: "Illustrazione",
      },
    },
    sections: [
      {
        title: "Canto a tenore",
        paragraphs: [
          "Il canto a tenore è iscritto dal 2005 nella Lista rappresentativa del patrimonio culturale immateriale Unesco. È un canto maschile a quattro parti, tipico soprattutto della Barbagia e di aree interne vicine: le denominazioni delle voci (boghe, mesa boghe, contra, bassu, con varianti locali) e i repertori si imparano in paese, non da un manuale unico.",
          "Unesco descrive una pratica viva, non un fossile. I gruppi cambiano, si esibiscono in piazza, in concorsi, in registrazioni. Per ascoltarlo in contesto di festa, si guarda il calendario del comune (Mamoiada, Orgosolo, Bitti e altri centri documentati nelle fonti etnografiche). Orari: schede evento e Comuni.",
        ],
      },
      {
        title: "Canto a chitarra",
        paragraphs: [
          "Il canto a chitarra è un altro sistema, legato in particolare al Logudoro: voce e chitarra, forme metriche e gare. Non è il tenore «con uno strumento in più». Ha scuole, cantadores e un pubblico proprio. Le rassegne si tengono in paesi precisi; le date stanno sulle locandine dell’anno.",
          "Confondere tenore e chitarra in un’unica playlist «folk sardo» cancella proprio ciò che i paesi distinguono.",
        ],
      },
      {
        title: "Cantadores e poesia improvvisata",
        paragraphs: [
          "Le gare di poesia improvvisata (cantadores, estemporanea in sardo o in italiano a seconda dei circuiti) sono un teatro orale: tema estratto, metro, pubblico che giudica. Restano vive in alcuni comuni e in festival. Peppino Mereu, a Tonara, è un poeta scritto, un altro piano: la scheda EVERAS su Mereu non è una gara, è letteratura.",
          "Non elenchiamo i campioni in carica: ruotano. Se una gara è pubblicata su EVERAS, la scheda ha luogo e orario.",
        ],
      },
      {
        title: "Cori, strumenti, launeddas",
        paragraphs: [
          "Nelle processioni e in chiesa si sentono cori di confraternita, con repertori distinti da quelli di piazza. Le launeddas (strumento ad ancia, tre canne) sono documentate soprattutto nel Campidano e in aree meridionali; costruzione e insegnamento restano di bottega e scuola, non di souvenir.",
          "Organetto, fisarmonica, tamburi dei gremi sassaresi, flauti: ogni festa ha la sua organica. I Candelieri e la Sartiglia non si «sonorizzano» allo stesso modo.",
        ],
      },
      {
        title: "Poesia in lingua sarda e contemporaneo",
        paragraphs: [
          "Accanto all’improvvisazione c’è la poesia scritta in sardo e in italiano. Mereu, ma anche altre voci di paese, stanno nelle biblioteche e nelle antologie, non solo in palco. Maria Carta ha portato canti e poesia in un circuito nazionale e internazionale: la scheda a Siligo è il rinvio biografico.",
          "Il contemporaneo non è un tradimento. Paolo Fresu e Time in Jazz a Berchidda, JazzAlguer, rassegne in città: jazz e repertori locali si incrociano senza che uno cancelli l’altro. Hub e articoli EVERAS tengono le date distinte da questa guida.",
        ],
      },
      {
        title: "Musica e feste",
        paragraphs: [
          "Molte tradizioni non si capiscono a cuffie chiuse: il tenore in una sagra, i tamburi in Faradda, la chitarra in una gara. Per questo il ponte naturale è il calendario. Sotto, concerti e spettacoli pubblicati. Se la lista è vuota, restano le guide dei paesi e la possibilità di pubblicare una rassegna.",
        ],
      },
    ],
    faqs: [
      {
        question: "Il canto a tenore è Unesco?",
        answer:
          "Sì, dal 2005, come patrimonio culturale immateriale. Non è una festa di un solo giorno: è una pratica musicale, soprattutto dell’interno.",
      },
      {
        question: "Tenore e canto a chitarra sono la stessa cosa?",
        answer:
          "No. Organico, geografia e repertori sono diversi. Il tenore è un canto a più voci; il canto a chitarra è voce e chitarra, con un altro circuito di gare.",
      },
      {
        question: "Dove ascoltare musica tradizionale quest’anno?",
        answer:
          "Sulle schede evento EVERAS e sui calendari dei Comuni. Questa guida non fissa palchi e orari.",
      },
    ],
    sources: [
      {
        label: "UNESCO — Canto a tenore",
        href: "https://ich.unesco.org/en/RL/canto-a-tenore-sardinian-pastoral-songs-00165",
      },
      {
        label: "Regione Autonoma della Sardegna",
        href: "https://www.regione.sardegna.it/",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/lingue-sardegna", label: "Lingue della Sardegna" },
      { href: "/cultura/maria-carta-siligo", label: "Maria Carta" },
      { href: "/cultura/peppino-mereu-tonara", label: "Peppino Mereu" },
      { href: "/cultura/paolo-fresu-jazz", label: "Paolo Fresu e Berchidda" },
      {
        href: "/cultura-sarda/centro-sardegna/mamoiada",
        label: "Guida Mamoiada",
      },
      { href: "/eventi-sardegna/jazzalguer", label: "JazzAlguer" },
      { href: "/eventi/musica-concerti", label: "Musica e spettacoli" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["musica-concerti"],
    eventSectionTitle: "Concerti, rassegne e spettacoli in calendario",
    publishedAt: "2026-09-20",
  },
  {
    slug: "costumi-sardi",
    path: "/cultura/costumi-sardi",
    kind: "guide",
    title: "Costumi tradizionali sardi: territori, feste e identità",
    h1: "Costumi tradizionali sardi",
    description:
      "Perché gli abiti tradizionali cambiano da paese a paese: elementi, uso nelle feste, significato sociale, evoluzione, con rinvio a Cavalcata e guide comunali.",
    intro:
      "L’abito tradizionale sardo non è un uniforme dell’isola. Cambia il taglio, il colore, il copricapo, i gioielli, a volte da un paese al successivo. Questa guida spiega perché, senza trasformarsi in un atlante di ricami. Quando si nomina un costume, si indica il territorio. Orari di sfilate e noleggi non stanno qui: stanno sui calendari dei Comuni e delle Pro Loco.",
    excerpt:
      "Abiti di paese, non un costume unico: dove si vedono, cosa dicono, come sono cambiati.",
    hero: {
      src: "/images/cultura/cavalcata-sarda-hero.webp",
      alt: "Gruppi in abito tradizionale alla Cavalcata Sarda a Sassari",
      credit: everasPhoto("/cultura/costumi-sardi"),
    },
    sections: [
      {
        title: "Perché i costumi cambiano da territorio a territorio",
        paragraphs: [
          "L’abito è stato, e in parte resta, un segno di comune, di stato civile, di festa. Panno, lino, orbace, velluto, corallo, filigrana: i materiali seguono filiere locali e commerci. Un osservatore della Cavalcata a Sassari vede decine di gruppi, ognuno con regole proprie di vestizione. Non è un «mix sardo»: è un elenco di paesi.",
          "Le differenze non sono capricci estetici. Storici e etnografi le legano a comunità, gremi, disponibilità di tessuti e a come la festa pubblica ha fissato un modello (spesso tra Otto e Novecento, quando si fotografano e si «mettono in mostra» gli abiti).",
        ],
      },
      {
        title: "Elementi principali",
        paragraphs: [
          "In molte zone si distinguono, con nomi locali, camicia, gonnellino o gonnella, corpetto, scialle, grembiule, copricapo. I gioielli (bottoni, catene, corallo, filigrana d’oro o d’argento) non sono un optional da vetrina: in alcune comunità fanno parte dell’abito di festa. La guida all’artigianato tratta mestieri e territori (Alghero e il corallo, filigrana, tessitura ad Aggius) senza vendere pezzi.",
          "Maschile e femminile, abito da lavoro e abito da festa, abito da sposa: sono registri diversi. Ridurli a un’unica foto «uomo e donna in costume» è proprio ciò che questa pagina evita.",
        ],
      },
      {
        title: "Differenze tra aree dell’isola",
        paragraphs: [
          "Barbagia, Ogliastra, Campidano, Gallura, Sassarese, Sulcis: ogni area ha famiglie di abiti, e dentro l’area i paesi si distinguono ancora. Non disegnamo qui una mappa colore per colore: sarebbe un catalogo da copiare da repertori museali, e i musei etnografici (Nuoro, Aggius, e le sezioni dei civici) sono il posto per vederli da vicino, con didascalie di provenienza.",
          "Se un museo indica «abito di Orgosolo» o «di Desulo», quella è la fonte. In assenza di didascalia, non attribuiamo un ricamo a un comune.",
        ],
      },
      {
        title: "Uso nelle feste",
        paragraphs: [
          "Si indossa alle patronali, in Cavalcata a Sassari, in alcuni cortei nuziali (Sposalizio Selargino), in processioni. I Candelieri a Sassari sono un altro registro: i gremi hanno vesti e ruoli propri, non l’abito «di tutti i paesi». Sant’Efisio vede delegazioni in abito dai comuni che partecipano, accanto al corteo cagliaritano.",
          "Date: schede evento e Comuni. Questa guida non dice «quando mettersi il costume».",
        ],
      },
      {
        title: "Significato sociale e storico",
        paragraphs: [
          "L’abito ha detto ricchezza, vedovanza, appartenenza a un gremio, età. Parte di quei codici si è persa o si è semplificata. Ciò che resta in sfilata è spesso l’abito «di rappresentanza» fissato in fotografie e statuti di gruppi folkloristici del Novecento. Distinguere il vestito di casa di un secolo fa da quello da palco è un lavoro da museo, non da didascalia turistica.",
          "I gruppi in costume sono associazioni, con prove e spese. Non sono comparse a nolo per una locandina.",
        ],
      },
      {
        title: "Evoluzione e identità locale",
        paragraphs: [
          "Si cuciono ancora abiti nuovi; si restaurano quelli ereditati. Tessuti e tagli si adattano. L’identità locale passa anche da questa manutenzione, non da un originale immutabile. Turismo e Cavalcata hanno reso visibili abiti che in paese si vedono poche volte l’anno: è un fatto, non un giudizio.",
          "Per vedere gli abiti in contesto: Cavalcata (articolo e hub), guide Sassari, Selargius, paesi della Barbagia. Per i mestieri che li tengono in vita: artigianato sardo.",
        ],
      },
    ],
    faqs: [
      {
        question: "Esiste un unico costume sardo?",
        answer:
          "No. Ogni comunità ha (o ha avuto) abiti propri. Ciò che si vede in Cavalcata è proprio la somma di quelle differenze.",
      },
      {
        question: "Dove vederli senza una festa?",
        answer:
          "Nei musei etnografici e nelle sezioni dei musei civici che espongono abiti con provenienza. Orari sui siti dei musei, non in questa guida.",
      },
      {
        question: "Si possono noleggiare?",
        answer:
          "Alcuni gruppi e sarte lo fanno per matrimoni o sfilate. Non pubblichiamo listini: si chiede in paese o alla Pro Loco.",
      },
    ],
    sources: [
      {
        label: "Comune di Sassari — Cavalcata Sarda",
        href: "https://www.comune.sassari.it/",
      },
      {
        label: "ISRE — Istituto superiore regionale etnografico (Nuoro)",
        href: "https://www.isresardegna.it/",
      },
      {
        label: "UNESCO — Grandi macchine a spalla (contesto Candelieri)",
        href: "https://ich.unesco.org/en/RL/celebrations-of-big-shoulder-borne-processional-structures-00721",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/cavalcata-sarda-sassari", label: "Cavalcata Sarda" },
      { href: "/cultura/artigianato-sardo", label: "Artigianato sardo" },
      { href: "/cultura/musei-sardegna", label: "Musei per territorio" },
      { href: "/cultura/grandi-feste-sarde", label: "Grandi feste" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/eventi-sardegna/cavalcata-sarda", label: "Cavalcata, calendario" },
      { href: "/eventi-sardegna/sposalizio-selargino", label: "Sposalizio Selargino" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["sagre-tradizioni", "celebrazioni"],
    eventSectionTitle: "Feste in cui gli abiti di paese sono in piazza",
    publishedAt: "2026-09-20",
  },
  {
    slug: "cucina-sarda",
    path: "/cultura/cucina-sarda",
    kind: "guide",
    title: "Cucina tradizionale sarda: pane, terra, mare e sagre",
    h1: "La cucina tradizionale sarda",
    description:
      "Cucina sarda come fatto culturale: pani, pasta, carni pastorali, pesce, formaggi, dolci e vini per territorio, e il cibo nelle sagre in calendario su EVERAS.",
    intro:
      "Non c’è un menu unico dell’isola. C’è il pane dell’interno e quello da forno di paese, la pasta dell’Ogliastra e quella del Campidano, il porceddu e la bottarga, formaggi a denominazione e dolci di festa. Questa guida è culturale, non una raccolta di ricette. Prezzi, orari di sagre e menù dell’anno stanno sulle schede evento e sui siti di Comuni e Pro Loco.",
    excerpt:
      "Filiere e territori, non ricette SEO: pane, sagre, formaggi e mare, con il calendario di ciò che è in programma.",
    hero: {
      src: "/images/seo/sagre-sardegna-cover.webp",
      alt: "Sagra di paese in Sardegna: stand gastronomici in piazza",
      credit: everasPhoto("/cultura/cucina-sarda", "Fotografia originale"),
    },
    sections: [
      {
        title: "Pane e tradizione",
        paragraphs: [
          "Il pane racconta forni e paesi: carasau e pistoccu nell’interno pastorale, civraxiu e altri pani del Campidano, forme rituali per feste e lutti. I nomi cambiano da un comune all’altro; non li unifichiamo. I forni pubblici e le sagre del pane, quando esistono, sono eventi locali, non un «tour del pane sardo».",
          "Una sagra del pane è una festa di prodotto, spesso novecentesca o recente. Non è automaticamente un rito antico. La scheda del comune e quella evento dicono come è presentata l’edizione.",
        ],
      },
      {
        title: "Pasta e primi piatti",
        paragraphs: [
          "Culurgiones (in particolare ogliastrini, con disciplinari e sagre di paese), malloreddus, fregula, lorighittas a Morgongiori, altri formati locali: sono geografie, non un primo «tipico» intercambiabile. Gli ingredienti (patata, pecorino, zafferano, frutti di mare) seguono l’area.",
          "Non pubblichiamo ricette né tempi di cottura. Per mangiarli in festa, il calendario sagre è il ponte onesto.",
        ],
      },
      {
        title: "Carni e cucina pastorale",
        paragraphs: [
          "Porceddu, agnello, capretto, interiora, piatti di cortile: la cucina pastorale dell’interno è documentata nella letteratura etnografica e nelle sagre. Non è l’unica cucina dell’isola e non è «più autentica» di quella di costa. Dipende da chi viveva di gregge e da cosa si poteva conservare.",
          "Orari di sagre della pecora o del maialetto: Pro Loco e Comuni dell’anno in corso.",
        ],
      },
      {
        title: "Pesce e tradizioni costiere",
        paragraphs: [
          "Bottarga di muggine (Cabras e Sinis, con un festival dedicato), pesce di scoglio, arselle, ricette di Carloforte legate al tonno e alla cucina ligure-tabarchina: di nuovo, territori. Alghero e Cagliari hanno storie di mercato diverse da Cabras. Non mescoliamo un ristorante di porto con una laguna.",
          "Il Festival della Bottarga a Cabras ha un hub EVERAS: lì le date. Questa guida non copia il programma.",
        ],
      },
      {
        title: "Formaggi",
        paragraphs: [
          "Pecorino sardo, Fiore sardo e altri formaggi ovini e caprini hanno disciplinari e consorzi quando sono DOP o IGP. Il nome commerciale non coincide sempre col formaggio di ovile. Per le denominazioni si consultano i consorzi e le banche dati europee, non un blog di ricette.",
          "Sagre del formaggio: di nuovo, calendario e comune. Non indichiamo caseifici da visitare senza fonte ufficiale del produttore.",
        ],
      },
      {
        title: "Dolci tradizionali",
        paragraphs: [
          "Seadas (o sebadas), papassini, gueffus, pabassinas, dolci di santi e di matrimoni: il repertorio è largo e locale. Molti si fanno in casa o in pasticceria di paese in periodi precisi. Una vetrina turistica tutto l’anno non è la prova che «si è sempre fatto così».",
        ],
      },
      {
        title: "Vini e bevande",
        paragraphs: [
          "Cannonau, Vermentino di Gallura (DOCG), Vernaccia di Oristano, Malvasia di Bosa, Carignano del Sulcis, Monica, Nuragus: sono denominazioni e territori viticoli documentati. Mirto e altre distillazioni o liquori di erbe stanno in un altro registro, più recente o più di cantina domestica.",
          "Degustazioni e sagre del vino: schede evento. Non facciamo da enoteca.",
        ],
      },
      {
        title: "Il cibo nelle feste e nelle sagre",
        paragraphs: [
          "La sagra è spesso il luogo in cui un paese mette in piazza un prodotto. Ingresso, stand, prezzi dei piatti: Pro Loco e Comune. EVERAS pubblica la scheda quando l’organizzatore la inserisce, con data e locandina, senza copiare il menù.",
        ],
      },
      {
        title: "Le specialità cambiano da territorio a territorio",
        paragraphs: [
          "Ogliastra, Gallura, Campidano, Sulcis, Barbagia, Sinis non condividono lo stesso carrello. Per questo le guide dei comuni e il calendario filtrato per città sono più onesti di una lista «le dieci cose da mangiare in Sardegna». Sotto, sagre e appuntamenti gastronomici in programma.",
        ],
      },
    ],
    faqs: [
      {
        question: "Questa pagina contiene ricette?",
        answer:
          "No. È una guida culturale su filiere e territori. Per cucinare servono fonti di cucina; per mangiare in festa, il calendario sagre.",
      },
      {
        question: "Dov’è la sagra della bottarga?",
        answer:
          "Il Festival della Bottarga è legato a Cabras e al Sinis. Date e programma: hub EVERAS e fonti del Comune, non un orario fisso in questa guida.",
      },
      {
        question: "Il pane carasau è di tutta l’isola?",
        answer:
          "È uno dei pani più noti, legato soprattutto all’interno pastorale. Altri territori hanno altri pani. Non è l’unico pane sardo.",
      },
    ],
    sources: [
      {
        label: "Regione Autonoma della Sardegna — Agricoltura",
        href: "https://www.regione.sardegna.it/",
      },
      {
        label: "Comune di Cabras",
        href: "https://www.comune.cabras.or.it/",
      },
      {
        label: "Calendario sagre EVERAS",
        href: "https://www.everas.it/eventi-sardegna/sagre",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/eventi-sardegna/sagre", label: "Sagre in Sardegna" },
      {
        href: "/eventi-sardegna/festival-della-bottarga",
        label: "Festival della Bottarga",
      },
      { href: "/cultura/artigianato-sardo", label: "Artigianato sardo" },
      { href: "/cultura/territori-sardegna", label: "Territori dell’isola" },
      { href: "/eventi/food-drink", label: "Food & Drink in calendario" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["sagre-tradizioni", "food-drink"],
    eventSectionTitle: "Sagre e appuntamenti di cibo in calendario",
    publishedAt: "2026-09-20",
  },
  {
    slug: "nuraghi-archeologia-sardegna",
    path: "/cultura/nuraghi-archeologia-sardegna",
    kind: "guide",
    title: "Nuraghi e archeologia della Sardegna",
    h1: "Nuraghi e archeologia della Sardegna",
    description:
      "Cosa sono i nuraghi, cosa documentano gli scavi su villaggi, tombe dei giganti, pozzi sacri e domus de janas, musei e come visitare i siti senza teorie pseudoscientifiche.",
    intro:
      "I nuraghi sono monumenti in pietra dell’età del Bronzo, non «torri di un popolo misterioso». Gli archeologi parlano di civiltà nuragica per indicare società isolane di quel periodo, con villaggi, sepolture e luoghi di culto. Questa guida separa ciò che gli scavi documentano dalle interpretazioni (funzione militare, residenziale, simbolica). Non usiamo giganti, Atlantide, extraterrestri o genealogie da social.",
    excerpt:
      "Fatti di scavo e Unesco a Barumini; interpretazioni etichettate come tali. Musei e siti, orari dai gestori.",
    hero: wikiCommonsPhoto({
      src: "/images/cultura/cultura-nuraghe-santu-antine-hero.webp",
      alt: "Nuraghe Santu Antine a Torralba: torre nuragica dell’età del Bronzo nel Logudoro",
      author: "Giovi77",
      commonsFile: "Nuraghe_Santu_Antine.jpg",
      ...CC_BY_SA_4,
    }),
    sections: [
      {
        title: "Cosa sono i nuraghi",
        paragraphs: [
          "Un nuraghe è una costruzione a torre, in pietra a secco, a pianta circolare, spesso con tholos interna. Può essere una torre isolata o un complesso con bastioni, cortili, torri aggiunte. Sono migliaia sull’isola; lo stato di conservazione varia da rudere a sito musealizzato.",
          "Il nome «nuraghe» è quello usato in sardo e nella letteratura archeologica. Non implica un’unica funzione per tutti gli edifici.",
        ],
      },
      {
        title: "Quando furono costruiti",
        paragraphs: [
          "La costruzione dei nuraghi si colloca nell’età del Bronzo sarda, su un arco di secoli (in sintesi: dal II millennio a.C. verso il I, con fasi diverse secondo i siti). Le datazioni puntuali dipendono da scavi, carbonio 14, sequenze stratigrafiche. Un cartello turistico con un solo anno è quasi sempre una semplificazione.",
          "Prima dei nuraghi ci sono neolitico e calcolitico (cultura di Ozieri, domus de janas). Dopo, l’età del Ferro, i contatti con Fenici e Punici, Roma. La guida alla storia inquadra la sequenza; qui restiamo sui monumenti.",
        ],
      },
      {
        title: "Principali tipologie",
        paragraphs: [
          "Gli archeologi distinguono, tra l’altro, nuraghi monotorre e complessi polilobati, con o senza antemurale. Non è una classifica di «bellezza»: è una tipologia di cantiere. Su Nuraxi di Barumini è l’esempio di complesso iscritto Unesco (1997), con villaggio.",
          "Altri siti noti al pubblico (Santu Antine a Torralba, Losa a Abbasanta, Arrubiu a Orroli, Palmavera presso Alghero) hanno gestioni e orari propri. Li citiamo come luoghi documentati, non come itinerario obbligatorio.",
        ],
      },
      {
        title: "Villaggi nuragici",
        paragraphs: [
          "Accanto a molte torri gli scavi hanno trovato capanne, cortili, spazi produttivi. Il villaggio non è un accessorio: è la prova di comunità stanziali. L’estensione e la durata di vita si leggono nei rapporti di scavo, non in una frase da brochure.",
        ],
      },
      {
        title: "Tombe dei giganti, domus de janas, pozzi sacri",
        paragraphs: [
          "Le tombe dei giganti (tumbas de gigantes) sono sepolture collettive dell’età nuragica, con esedra e stele. Il nome popolare non implica giganti storici: è un nome tradizionale. Le domus de janas sono ipogei funerari soprattutto prenuragici (neolitico-calcolitico): un altro periodo, un’altra pratica. I pozzi sacri (es. Santa Cristina a Paulilatino, Su Tempiesu a Orune) sono strutture idraulico-cultuali nuragiche, con datazioni e interpretazioni discusse.",
          "Tenere insieme questi monumenti in un unico «tour megalitico» confonde tre o quattro fenomeni diversi. I musei lo spiegano meglio di una lista Instagram.",
        ],
      },
      {
        title: "Cultura nuragica: fatti e interpretazioni",
        paragraphs: [
          "Fatto: società dell’età del Bronzo in Sardegna, con architettura in pietra, metallurgia, sepolture collettive, contatti mediterranei. Interpretazione (aperta): organizzazione politica, ruolo delle torri, identità etnica, rapporto con i «Shardana» delle fonti egizie. Quest’ultimo nesso è un’ipotesi dibattuta, non un dato di scavo.",
          "Le statue di Mont’e Prama (Cabras, Sinis) sono sculture nuragiche di età del Ferro antico, oggi in museo a Cabras e a Cagliari: un capitolo distinto dalle torri. Fonte: scavi e Ministero della Cultura, non ricostruzioni fantasiose di «giganti».",
        ],
      },
      {
        title: "Musei archeologici",
        paragraphs: [
          "Cagliari (Museo archeologico nazionale), Sassari (Sanna), Cabras (Mont’e Prama), Ozieri, e i civici dei territori. Orari, chiusure lunedì, biglietti: siti del Ministero, della Regione e dei Comuni. Questa pagina non li copia perché cambiano.",
          "La guida musei (fase 3) sarà il posto per una scelta ragionata per area. Intanto: Barumini, Ozieri, Sassari, Cagliari, Cabras come rinvii EVERAS.",
        ],
      },
      {
        title: "Come visitare i siti",
        paragraphs: [
          "Siti musealizzati hanno biglietto, percorsi, a volte visita guidata. Nuraghi in campagna possono essere su terreno privato o senza recinzione: accesso, pericolo di crollo, divieti. Non indichiamo sentieri «segreti». Si parte dai siti con gestione pubblica e dai musei.",
          "Eventi (notti dei musei, aperture straordinarie, visite guidate): calendario EVERAS, categoria Arte e cultura, quando un organizzatore li pubblica.",
        ],
      },
    ],
    faqs: [
      {
        question: "I nuraghi erano fortezze?",
        answer:
          "Alcuni studiosi sottolineano il controllo del territorio e la difesa; altri la residenza e il prestigio. Non c’è una risposta unica per tutte le torri. I rapporti di scavo del singolo sito pesano più di una teoria generale.",
      },
      {
        question: "Domus de janas e nuraghi sono della stessa epoca?",
        answer:
          "In genere no. Le domus de janas sono soprattutto prenuragiche. I nuraghi e le tombe dei giganti appartengono all’età del Bronzo nuragica. Un territorio può avere entrambi, a secoli di distanza.",
      },
      {
        question: "Barumini è l’unico sito Unesco?",
        answer:
          "Su Nuraxi è il sito nuragico iscritto nella Lista del patrimonio mondiale (1997). Altri monumenti dell’isola hanno tutele nazionali o regionali diverse. Il canto a tenore e i Candelieri sono Unesco su altri elenchi (immateriale).",
      },
    ],
    sources: [
      {
        label: "UNESCO — Su Nuraxi di Barumini",
        href: "https://whc.unesco.org/en/list/833/",
      },
      {
        label: "Rete musei archeologici della Sardegna",
        href: "https://www.musei.sardegna.beniculturali.it/",
      },
      {
        label: "Guida alla storia della Sardegna su EVERAS",
        href: "https://www.everas.it/cultura/storia-sardegna",
      },
    ],
    relatedLinks: [
      { href: "/cultura", label: "Cultura sarda" },
      { href: "/cultura/storia-sardegna", label: "Storia della Sardegna" },
      { href: "/cultura/musei-sardegna", label: "Musei per territorio" },
      { href: "/cultura-sarda/sud-sardegna/barumini", label: "Guida Barumini" },
      { href: "/cultura-sarda/nord-sardegna/ozieri", label: "Guida Ozieri" },
      { href: "/cultura-sarda/nord-sardegna/sassari", label: "Guida Sassari" },
      { href: "/cultura-sarda/centro-sardegna/cabras", label: "Guida Cabras" },
      { href: "/eventi/arte-cultura", label: "Arte e cultura in calendario" },
      { href: "/pubblica", label: "Pubblica un evento" },
    ],
    relatedCategorySlugs: ["arte-cultura"],
    eventSectionTitle: "Visite, mostre e aperture archeologiche in calendario",
    publishedAt: "2026-09-20",
  },
];
