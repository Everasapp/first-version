import type { CulturaArticle } from "@/src/lib/seo/cultura-articles";
import type { CulturePhoto } from "@/src/lib/seo/cultura-towns";

const CC_BY_4 = {
  license: "CC BY 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by/4.0/deed.it",
} as const;
const CC_BY_3 = {
  license: "CC BY 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by/3.0/deed.it",
} as const;
const CC_BY_2 = {
  license: "CC BY 2.0",
  licenseUrl: "https://creativecommons.org/licenses/by/2.0/deed.it",
} as const;
const CC_BY_SA_4 = {
  license: "CC BY-SA 4.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/deed.it",
} as const;
const CC_BY_SA_3 = {
  license: "CC BY-SA 3.0",
  licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/deed.it",
} as const;
const CC0 = {
  license: "CC0",
  licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/deed.it",
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

export const CULTURA_SPIAGGE_ARTICLES: CulturaArticle[] = [
  {
    slug: "spiagge-piu-belle-sardegna",
    path: "/cultura/spiagge-piu-belle-sardegna",
    title:
      "Le spiagge più belle della Sardegna: guida da nord a sud, con foto",
    h1: "Le spiagge più belle della Sardegna",
    description:
      "Guida lunga alle spiagge più belle della Sardegna: Pelosa, Cala Goloritzé, Cala Mariolu, Tuerredda, Is Arutas, Piscinas e altre, con foto, come arrivarci e link alle guide paese EVERAS.",
    intro:
      "Non esiste una sola “spiaggia più bella” in Sardegna: cambia il granito, cambia il calcare, cambia il quarzo. Questa guida gira l’isola da nord a sud e da est a ovest, ferma diciotto tratti di costa che tornano in ogni classifica seria, e per ciascuno mette una fotografia dal web con licenza libera e il link alla sorgente. Non è un volantino: è un itinerario per capire dove sei, come ci arrivi e quale paese sta dietro la sabbia.",
    excerpt:
      "Da La Pelosa a Cala Goloritzé, da Tuerredda a Is Arutas: diciotto spiagge, una foto ciascuna e il paese collegato su EVERAS.",
    hero: wikiPhoto(
      "/images/cultura/spiagge-sardegna-hero.webp",
      "Cala Goloritzé nel Golfo di Orosei: calcare, acqua turchese e la caletta sotto la falesia",
      "delaere",
      "File:Cala_Goloritze_o.jpg",
      CC_BY_2,
    ),
    sections: [
      {
        title: "Come leggere questa guida",
        paragraphs: [
          "Le spiagge sarde non sono tutte uguali sotto il nome “caraibiche”. A nord e in Gallura il mare lavora il granito: insenature, massi, sabbia chiara. Nel Golfo di Orosei il calcare cade a picco e le calette si raggiungono a piedi o in barca. A ovest, nel Sinis, la battigia è fatta di granelli di quarzo; sulla Costa Verde le dune prendono il vento. A sud tornano le torri spagnole, le lagune e le isolette a un tiro di nuotata.",
          "Questa lista non è una classifica da like. È un giro dell’isola: Nurra e Gallura, Costa Smeralda, Golfo di Orosei, costa orientale bassa, Sarrabus e Sulcis, Sinis, Costa Verde, Iglesiente. Per ogni spiaggia trovi dove sta, come ci si arriva, cosa cambia in alta stagione e quale guida paese aprire su EVERAS. Le foto arrivano da Wikimedia Commons: sotto ciascuna c’è autore, licenza e link alla pagina originale.",
          "Due avvertenze, sempre. Prima: numeri, ticket e divieti li decidono Comuni e parchi, e cambiano da un’estate all’altra. Non copiamo orari da una locandina vecchia. Seconda: la Spiaggia Rosa di Budelli, nell’arcipelago di La Maddalena, non sta in questa lista come tappa da calpestare. È protetta, non si sbarca, si guarda da lontano. Chi cerca “la più bella” e pensa a quella sabbia, deve sapere che il pezzo più famoso è anche quello che non si usa.",
        ],
      },
      {
        title: "La Pelosa, Stintino",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-pelosa-stintino.webp",
          "La Pelosa a Stintino, con l’acqua bassa, l’isolotto e la torre spagnola",
          "Gianni Careddu",
          "File:Stintino_-_La_Pelosa_(03).JPG",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "La Pelosa è la spiaggia che chiude il nord-ovest: Capo Falcone, Stintino, lo specchio d’acqua verso l’Asinara. L’acqua è bassa per decine di metri, il fondale chiaro, l’isolotto della torre spagnola sta lì in mezzo come un segno. È il motivo per cui d’agosto la Nurra si intasa. Non è una caletta nascosta: è un teatro di sabbia e vento, e va trattato come tale.",
          "In alta stagione l’accesso è regolato. Servono prenotazione, tetto di presenze, regole su scarpe, asciugamani e ombrelloni: il Comune di Stintino le aggiorna ogni anno. Fuori stagione la stessa lingua di terra è un altro posto: vento, poca gente, il paese che torna a essere un paese di pescatori. La Pelosa non spiega Stintino da sola. Dietro c’è la Tonnara Saline, il MUT, le famiglie scese dall’Asinara quando l’isola divenne carcere.",
          "Come arrivarci: statale verso Stintino, poi Capo Falcone. In estate parti presto o prendi i servizi che il Comune indica, non lasciare l’auto in doppia fila sulla panoramica. Per l’isola di fronte, l’Asinara è parco: traghetti e visite guidate, non un gommone libero. Apri la guida di Stintino su EVERAS per museo, Tonnare e il resto del paese.",
        ],
      },
      {
        title: "Rena Bianca, Santa Teresa Gallura",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-rena-bianca.webp",
          "Rena Bianca a Santa Teresa Gallura, sabbia chiara e case sul promontorio",
          "Or kriminal",
          "File:Rena_Bianca_Beach,_Santa_Teresa_Gallura.jpg",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Rena Bianca è la spiaggia sotto piazza: scendi da Santa Teresa Gallura e sei già in acqua, con la Corsica a vista quando il cielo è pulito. Sabbia chiara, granito intorno, il paese a scacchiera alle spalle. È comoda, ed è per questo che in agosto a metà mattina i posti buoni sono finiti.",
          "Il pezzo che tiene insieme spiaggia e storia è la Torre di Longonsardo, sul porto vecchio. Da lassù Capo Testa da un lato, lo Stretto di Bonifacio dall’altro. Chi arriva solo per il bagno perde il capo: sentieri, calette di granito, vento. Rena Bianca è il salotto; Capo Testa è il resto della costa.",
          "Come arrivarci: il paese è il capolinea nord della Gallura, da Olbia in un’ora scarso. In alta stagione lascia l’auto fuori dal centro e scendi a piedi. Se la spiaggia sotto piazza è piena, sposta la giornata a Capo Testa o verso le calette laterali. Guida di Santa Teresa Gallura su EVERAS: torre, capo, porto.",
        ],
      },
      {
        title: "Cala Brandinchi, San Teodoro",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-cala-brandinchi.webp",
          "Cala Brandinchi a San Teodoro, insenatura chiara tra la vegetazione della costa",
          "Patrice Garcia",
          "File:Cala_Brandinchi,_Sardaigne_-_panoramio.jpg",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Cala Brandinchi, nel territorio di San Teodoro, è l’insenatura che i volantini chiamano “Tahiti”. Pini, acqua bassa, sabbia chiara, uno stagno retrodunale dietro le dune. Il soprannome è pubblicità; il posto è vero: una baia chiusa, facile da saturare, con una zona umida che non è un optional da cartolina.",
          "Lo stagno dietro la spiaggia è il motivo per cui qui non si tratta solo di ombrelloni. Cavalieri d’Italia e altri ucchi arrivano quando l’acqua lo permette. In estate la cala è piena entro metà mattina; il parcheggio e i varchi sulle dune sono il punto in cui si vede chi ha letto i cartelli e chi no. Non attraversare la vegetazione retrodunale: è la difesa della spiaggia, non un sentiero più corto.",
          "Come arrivarci: da San Teodoro verso nord, segnaletica per Brandinchi. Arriva presto, o scegli un giorno di settimana. A pochi minuti c’è La Cinta, più lunga, con Tavolara in faccia: stessa costa, altro respiro. Guida di San Teodoro su EVERAS per paese, stagno e calendario.",
        ],
      },
      {
        title: "La Cinta, San Teodoro",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-la-cinta.webp",
          "La Cinta a San Teodoro, con l’isola di Tavolara sullo sfondo",
          "Emabarto01",
          "File:Vista_sull%27isola_di_Tavolara_dalla_spiaggia_La_Cinta_di_San_Teodoro.png",
          CC0,
        ),
        paragraphs: [
          "La Cinta è la spiaggia lunga di San Teodoro: un nastro di sabbia verso sud-est, lo stagno alle spalle, Tavolara che cresce in fondo come una montagna in mare. Non è una caletta. È una costa da camminare, da vento, da kitesurf quando il maestrale tira. Brandinchi è il salotto chiuso; La Cinta è il viale.",
          "Lo stagno di San Teodoro separa il paese dalla battigia. Ci sono passerelle e varchi: usarli. In estate i lidi occupano un tratto, il resto resta libero. Fuori stagione la spiaggia è di chi cammina il cane e di chi guarda l’isola. Tavolara ha regole di sbarco e di parco: non è un’appendice da gommone selvaggio.",
          "Come arrivarci: dal centro di San Teodoro sei lì in pochi minuti. Meglio a piedi o in bici se sei in paese; in auto i parcheggi si riempiono e si pagano. Se cerchi acqua ferma e pini, Brandinchi. Se cerchi spazio e l’isola in faccia, La Cinta.",
        ],
      },
      {
        title: "Capriccioli, Costa Smeralda",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-capriccioli.webp",
          "Capriccioli sulla Costa Smeralda, caletta tra i graniti e il mare verde",
          "gpatgn",
          "File:Spiaggia_di_Capriccioli_-_panoramio.jpg",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Capriccioli è il pezzo della Costa Smeralda che ancora si raggiunge senza un pellegrinaggio: due calette di granito rosa, ginepri, acqua verde, nel comune di Arzachena verso Porto Cervo. Non è “la spiaggia dei vip” da copertina. È una costa disegnata dai massi, comoda, e per questo piena d’estate.",
          "Vicino, più riservata e più faticosa da meritare, c’è la Spiaggia del Principe: un sentiero tra la macchia, una baia chiusa, lo stesso mare. Wikimedia non ci ha dato una foto all’altezza, quindi resta qui come sorella di Capriccioli, non come scheda a sé. Liscia Ruja, Romazzino, Cala Granu e Cala di Volpe completano il giro: stesso granito, accessi e parcheggi diversi, stesso avvertimento sull’estate.",
          "Come arrivarci: da Porto Cervo / Arzachena, strade interne della Costa Smeralda, poi a piedi gli ultimi metri. In agosto i parcheggi sono il vero ostacolo. Dietro le calette c’è un territorio che non è solo mare: Li Muri, Li Lolghi, i nuraghi di Arzachena. Apri la guida del comune su EVERAS prima di trattare questa costa come un resort continuo.",
        ],
      },
      {
        title: "Cala Goloritzé, Baunei",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-cala-goloritze.webp",
          "L’arco di calcare di Cala Goloritzé sul mare del Golfo di Orosei",
          "Mentnafunangann",
          "File:Cala_Goloritz%C3%A9_4.JPG",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Cala Goloritzé è il manifesto del Golfo di Orosei: arco di calcare in mare, pinnacolo di 143 metri, ciottoli bianchi, parete a picco. Sta nel territorio di Baunei, sotto l’altopiano del Golgo. Non è una spiaggia da ombrellone. È un monumento naturale, e si visita come tale: numeri chiusi, sentiero, niente scarpe da trekking gettate sulla battigia come se fosse un lido.",
          "Due modi per arrivarci, e uno solo da prendere sul serio a piedi: il sentiero dal Golgo, circa un’ora e mezza di discesa (e la stessa salita al ritorno), con calcare, caldo, poca ombra. In barca si arriva al largo; lo sbarco sulla cala è regolato, spesso vietato. Prenotazione e tetto di presenze li pubblica il Comune di Baunei: controlla prima di partire, non fidarti di un post dell’anno scorso.",
          "Cosa non fare: ombrelloni, casse bluetooth, prese di ciottoli. Cosa sì: acqua, scarpe, rispetto del sentiero. Baunei non è solo la cala. È l’altopiano, Pedra Longa, il paese a mezza costa. La guida EVERAS parte da lì, non dal gommone.",
        ],
      },
      {
        title: "Cala Luna, Golfo di Orosei",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-cala-luna.webp",
          "Cala Luna nel Golfo di Orosei, spiaggia lunga chiusa dalle pareti di calcare",
          "trolvag",
          "File:Cala_Luna,_Dorgali_NU,_Sardinia,_Italy_-_panoramio.jpg",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Cala Luna è la spiaggia lunga del golfo: un chilometro scarso di sabbia e ciottoli, oleandri, grotte nella parete, un canyon alle spalle che porta verso l’interno. Sta sul confine tra Dorgali e Baunei. È più “spiaggia” di Goloritzé, e per questo d’estate è un approdo di barche. Resta, però, una cala di parete, non un lido.",
          "A piedi il classico è da Cala Fuili, sopra Cala Gonone: tre-quattro ore tra andata e ritorno, sentiero esposto al sole, qualche passaggio su roccia. In barca da Cala Gonone sei lì in mezz’ora. Le grotte in fondo alla spiaggia sono il pezzo fotografato da sempre; non sono un bagno pubblico, e il crollo di massi non è un’ipotesi da cartolina.",
          "Come organizzarsi: acqua, cappello, niente orari da copiare da un blog. I battelli hanno corse e prezzi che cambiano; i sentieri si chiudono per incendio o dissesto. Cala Gonone è frazione di Dorgali: paese, porto, Grotta del Bue Marino. Apri la guida di Dorgali e quella di Baunei, e tieni il golfo come un sistema, non come tre calette staccate.",
        ],
      },
      {
        title: "Cala Mariolu, Baunei",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-cala-mariolu.webp",
          "Cala Mariolu vista dall’alto, ciottoli chiari e acqua turchese sotto le falesie",
          "Roberto Mura",
          "File:Cala_Mariolu_2012.jpg",
          CC_BY_SA_3,
        ),
        paragraphs: [
          "Cala Mariolu, in sardo Ispuligidenie - “pulci di neve” - è la battigia di ciottoli calcarei così chiari da sembrare neve. L’acqua è quella del golfo quando il mare è fermo: turchese, trasparente, con la falesia che cade dritta. Sta sotto Baunei, tra Goloritzé e Sisine. In estate è una delle calette più battute dai battelli.",
          "L’accesso vero è dal mare. Il sentiero c’è, ma è per chi sa dove mette i piedi, non per chi ha visto una foto e ha indossato le ciabatte. I ciottoli non si portano via: sono la spiaggia. Ombrelloni e lettini non c’entrano. C’è chi ci arriva all’alba col gommone e se ne va prima che il golfo si riempia: è l’unico modo per vederla senza la fila di scafi.",
          "Come arrivarci: partenze da Cala Gonone, Santa Maria Navarrese, Arbatax, a seconda del periodo. Chiedi al porto, non a un volantino da hotel. Goloritzé, Mariolu e Sisine sono tre facce della stessa costa: se ne fai una sola, scegli in base alle gambe (Goloritzé a piedi) o al mare (Mariolu in barca).",
        ],
      },
      {
        title: "Cala Sisine, Baunei",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-cala-sisine.webp",
          "Cala Sisine, spiaggia di ciottoli chiusa tra le falesie e la macchia del Golfo di Orosei",
          "clurr (Flickr)",
          "File:Cala_Sisine.jpg",
          CC_BY_2,
        ),
        paragraphs: [
          "Cala Sisine è la più “spiaggia” delle calette di Baunei: più larga, ciottoli e sabbia, un capannello di oleandri che dà un’ombra vera, il rio che in certi mesi arriva ancora al mare. Meno arco da cartolina di Goloritzé, meno neve di Mariolu, più spazio per stare. Resta una cala di falesia: ci arrivi in barca o con una camminata lunga dal Golgo.",
          "Il sentiero da Santa Maria Navarrese / Sopramonte è una giornata, non una passeggiata dopo pranzo. In barca è la tappa di mezzo di molti giro-golfo. D’estate i battelli scaricano, i primi metri di battigia si riempiono, il fondo della cala resta più vuoto. Fuori stagione, con mare mosso, Sisine è un muro di sassi e vento: non è un difetto, è il golfo.",
          "Come usarla: stessa disciplina delle calette vicine. Niente fuochi, niente rifiuti, niente ciottoli in tasca. Santa Maria Navarrese è la porta sud; Cala Gonone quella nord. Baunei sta sopra, sull’altopiano. La guida EVERAS del comune è il posto da cui ripartire quando scendi dalla barca.",
        ],
      },
      {
        title: "Bidderosa, Orosei",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-bidderosa.webp",
          "Spiaggia di Bidderosa ad Orosei, sabbia chiara e pineta della Baronia",
          "Aggrucar",
          "File:Spiaggia_di_Bidderosa.jpg",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Bidderosa, nel comune di Orosei, è un’oasi: pineta, calette in fila, uno stagno, un numero chiuso di auto. Non è il golfo a picco. È la Baronia bassa, sabbia più calda, pini, un sistema di spiagge (Bidderosa, ma anche i tratti vicini verso Osalla e Furat) che funziona solo se i varchi e i parcheggi restano quelli.",
          "In estate l’accesso è a pagamento e a numero: quando i posti auto finiscono, la pineta non si inventa un secondo ingresso. È il punto. Berchida, poco a nord, è la sorella più aperta e più ventosa. Chi cerca “la più bella della Baronia” spesso intende questa costa, non Cala Gonone: stesso mare orientale, altra geologia, altri pini.",
          "Come arrivarci: da Orosei verso nord, poi la strada dell’oasi. Controlla orari e ticket sul Comune o sul gestore dell’anno. Non lasciare l’auto sulla provinciale e non aprire varchi nelle dune. Guida di Orosei su EVERAS per il paese, lo stagno, il resto della costa.",
        ],
      },
      {
        title: "Porto Giunco, Villasimius",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-porto-giunco.webp",
          "Porto Giunco a Villasimius, spiaggia sotto la torre aragonese e laguna alle spalle",
          "dronepicr",
          "File:Beach_of_the_Tower_of_Porto_Giunco_(Spiaggia_di_Porto_Giunco)_in_Sardinia,_Italy_(48402631107).jpg",
          CC_BY_2,
        ),
        paragraphs: [
          "Porto Giunco è la spiaggia sotto la torre: Villasimius, Capo Carbonara, sabbia chiara, una laguna retrodunale (Notteri) dove in inverno e in passo si vedono i fenicotteri. L’Area Marina Protetta è il motivo per cui questa costa non è solo un lido. La torre aragonese sta sul rilievo; la battigia è sotto; dietro, l’acqua dolce e salmastra.",
          "D’estate è una delle spiagge più battute del sud-est: parcheggi, passerelle, fila. Fuori stagione è un altro posto, e la laguna si legge meglio. Simius, Punta Molentis, Porto Sa Ruxi completano il giro di Villasimius. Carbonara si gira in kayak o con i battelli dell’area marina, non a caso sulle poseidonie.",
          "Come arrivarci: Villasimius da Cagliari in un’ora. In agosto il paese è pieno; la spiaggia sotto la torre si raggiunge a piedi dagli stalli segnalati. Non tagliare le dune verso la laguna. Guida di Villasimius su EVERAS per Capo Carbonara, paese e calendario.",
        ],
      },
      {
        title: "Costa Rei, Muravera",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-costa-rei.webp",
          "Costa Rei, nastro di sabbia dorata del Sarrabus verso Capo Ferrato",
          "gian luca bucci",
          "File:Costa_Rei_-_Spiaggia_-_panoramio.jpg",
          CC_BY_3,
        ),
        paragraphs: [
          "Costa Rei, nel comune di Muravera, è la spiaggia lunga del Sarrabus: sabbia dorata, mare spesso calmo, un nastro di chilometri che tiene famiglie, lidi e tratti liberi. Non ha l’arco di Goloritzé né i ciottoli-neve di Mariolu. Ha lo spazio. È la costa in cui il sud-est diventa vacanza da settimana, non da gita in barca.",
          "Dietro la battigia ci sono stagni, il Monte Nai, Castiadas a sud con Cala Sinzias e Cala Pira, più chiuse, più “da foto”. Costa Rei è il viale; le calette verso Capo Ferrato sono i vicoli. In estate i lidi occupano pezzi; il resto resta spiaggia pubblica. Il vento di levante, quando arriva, cambia il colore dell’acqua in un’ora.",
          "Come arrivarci: da Muravera / Villaputzu verso mare, poi la litoranea. In agosto i parcheggi sulla provinciale sono il collo di bottiglia. Guida di Muravera e di Castiadas su EVERAS: paese, stagni, l’altra faccia del Sarrabus che non è solo ombrellone.",
        ],
      },
      {
        title: "Su Giudeu e Chia, Domus de Maria",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-su-giudeu.webp",
          "Su Giudeu a Chia, sabbia chiara, isolotti e dune nel territorio di Domus de Maria",
          "Vid Pogacnik",
          "File:Spiaggia_Su_Giudeu_2.jpg",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Su Giudeu è la spiaggia che i volantini chiamano “Chia”: due isolotti a un nuoto, sabbia chiara, dune, il comune di Domus de Maria. La costa di Chia è più lunga: Sa Colonia, Monte Cogoni, Cala Cipolla più a ovest, la torre. Su Giudeu è il pezzo fotografato, l’acqua bassa tra gli scogli, il vento che in certi giorni alza il kitesurf due cale più in là.",
          "Le dune sono il punto debole. Ogni scorciatoia verso la battigia le mangia. I varchi ci sono; usarli. Cala Cipolla, verso Capo Spartivento, è più piccola, più chiusa, a pagamento in alta stagione, e si satura in un’ora. Tuerredda, ancora più ovest, è un altro comune e un altro parcheggio: non mescolarle in un solo pomeriggio da cartina.",
          "Come arrivarci: da Cagliari verso sud, Pula, poi Chia. In estate la statale è lenta; i parcheggi di Su Giudeu si pagano e finiscono. Guida di Domus de Maria su EVERAS per il paese dietro le dune, e Pula se vuoi Nora dopo il bagno.",
        ],
      },
      {
        title: "Tuerredda, Teulada",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-tuerredda.webp",
          "Tuerredda a Teulada, baia turchese con l’isolotto di fronte e la macchia alle spalle",
          "zipckr",
          "File:Tueredda.jpg",
          CC_BY_2,
        ),
        paragraphs: [
          "Tuerredda è la baia che chiude molte liste del sud: Teulada, un isolotto a nuoto, acqua di un turchese che in foto sembra ritoccato, macchia alle spalle. È bella, ed è per questo che in luglio e agosto il parcheggio è un mestiere e la battigia una scacchiera di teli. Fuori da quei mesi torna una cala di costa, con il maestrale che la può chiudere in un pomeriggio.",
          "L’isolotto è il pezzo da nuoto, non da conquista. Le scogliere laterali tengono il pesce; la posidonia non è un fastidio. Il Comune regola parcheggio e, in certi anni, l’accesso. Non inventiamo prezzi: guarda i cartelli del giorno. Vicino, sullo stesso tratto, Porto Zafferano e le calette verso Capo Malfatano: stesso mare, meno nome sui social.",
          "Come arrivarci: da Chia verso ovest sulla litoranea, o da Teulada. Non lasciare l’auto in curva. Se a mezzogiorno è piena, non “inventare” un varco nella macchia: torna a Cala Cipolla o scendi a Porto Pino, un’altra geografia, più spazio.",
        ],
      },
      {
        title: "Porto Pino, Sant’Anna Arresi",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-porto-pino.webp",
          "Porto Pino, dune bianche e mare turchese nel Sulcis",
          "Cristiano Cani",
          "File:Porto_pino_sardegna_2.jpg",
          CC_BY_2,
        ),
        paragraphs: [
          "Porto Pino, Sant’Anna Arresi, è la spiaggia lunga del Sulcis: sabbia bianca, dune alte, pini, un nastro che verso ovest diventa più selvatico. Non ha l’isolotto di Tuerredda. Ha il respiro. In estate un tratto è attrezzato; il resto, verso le dune di Guardia de Is Arena, è vento e sabbia che si muove.",
          "Le dune sono tra le più alte del Mediterraneo occidentale. Camminarci sopra “per la foto” le rovina. I varchi e le passerelle ci sono per quello. Dietro, il paese e l’entroterra del Sulcis non sono un parcheggio: Sant’Antioco e Carloforte stanno di là del ponte e del mare, un’altra isola, un’altra lingua.",
          "Come arrivarci: da Sant’Anna Arresi verso mare, segnaletica per Porto Pino. In agosto i lidi e gli stalli si riempiono; sposta la giornata verso le ore basse o verso i tratti extra-lido, a piedi. Se cerchi il sud senza la coda di Tuerredda, qui lo spazio c’è ancora.",
        ],
      },
      {
        title: "Is Arutas, Cabras",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-is-arutas.webp",
          "Is Arutas nel Sinis: granelli di quarzo, acqua chiara e scogli calcarei",
          "Vid Pogacnik",
          "File:Is_Aruttas_1.jpg",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Is Arutas, nel comune di Cabras, è la spiaggia dei “grani di riso”: quarzo bianco e rosa, arrotondato dal mare, che sotto i piedi non è sabbia. Sta sulla penisola del Sinis, Area Marina Protetta, di fronte all’isola di Mal di Ventre. L’acqua è quella del golfo di Oristano: più fredda, più viva, più ondata di maestrale delle calette orientali.",
          "I granelli non si portano via. Non è uno slogan: è il materiale della spiaggia, e ogni manciata in tasca è un furto lento. Mari Ermi e Maimoni, a nord e a sud, sono la stessa costa, stessa regola. Tharros e Capo San Marco stanno a pochi minuti: dopo il bagno, il capo e i nuraghi. Cabras è bottarga, stagni, Museo Civico Giovanni Marongiu, non solo il parcheggio di Is Arutas.",
          "Come arrivarci: da Oristano / Cabras verso il Sinis, poi San Giovanni di Sinis e la litoranea. In estate il parcheggio si paga e si riempie; il bus interno, quando c’è, è la via seria. Guida di Cabras su EVERAS per Tharros, stagni e paese.",
        ],
      },
      {
        title: "Piscinas, Costa Verde",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-piscinas.webp",
          "Le dune di Piscinas sulla Costa Verde, sabbia alta e mare aperto verso ovest",
          "Gianni Careddu",
          "File:Arbus_-_Dune_di_Piscinas_(02).JPG",
          CC_BY_SA_4,
        ),
        paragraphs: [
          "Piscinas, territorio di Arbus, è la spiaggia delle dune: tra le più alte d’Europa, un deserto che arriva al mare, vento di ponente, nessun lido da cartolina. La Costa Verde si chiama così per la macchia, ma qui il primo colore è la sabbia. Dietro, le miniere di Ingurtosu e Montevecchio: questa costa è un pezzo di Iglesiente, non un resort.",
          "L’isolamento è il punto e il rischio. La strada è lunga, sterrata in tratti, il cellulare balla, il mare è aperto. In estate qualche struttura alle spalle della duna tiene un bar e un posto letto; non aspettarti una passeggiata da lungomare. Le dune non si scendono in fuoristrada. I corsi d’acqua che tagliano la spiaggia cambiano ogni inverno.",
          "Come arrivarci: da Arbus / Guspini verso Ingurtosu, poi la discesa a mare. Controlla lo stato della strada dopo le piogge. Porta acqua. Se vuoi un’altra faccia della stessa costa, Scivu è la cala più chiusa a sud. Guspini è la guida EVERAS più vicina che abbiamo in directory, per l’entroterra minerario.",
        ],
      },
      {
        title: "Cala Domestica, Buggerru",
        photo: wikiPhoto(
          "/images/cultura/spiaggia-cala-domestica.webp",
          "Cala Domestica a Buggerru, insenatura tra le falesie dell’Iglesiente vista dal mare",
          "Giorgio Galeotti",
          "File:Cala_Domestica_-_Buggerru,_Sud_Sardegna,_Italy_-_August_13,_2020.jpg",
          CC_BY_4,
        ),
        paragraphs: [
          "Cala Domestica è un’insenatura da miniera: Buggerru, falesie, una spiaggia chiusa in fondo al canyon, la torre spagnola in alto, le gallerie che i minatori usavano per arrivare al mare. L’Iglesiente qui non nasconde il lavoro. Il mare è quello di ponente, spesso mosso, di un blu diverso dalle calette del golfo.",
          "Si arriva in auto fino al parcheggio sopra, poi a piedi la discesa. In estate il fondovalle si riempie; resta comunque una cala, non un lido. La galleria verso la caletta laterale è il pezzo fotografato: attenzione a testa, piede, umidità. La torre si raggiunge con un sentiero. Il paese, Buggerru, è una scogliera di case nata per le miniere, non per l’ombrellone.",
          "Come arrivarci: da Iglesias / Gonnesa verso Buggerru, poi i cartelli per Cala Domestica. Non lasciare l’auto in curva sulla provinciale. Guida di Gonnesa su EVERAS per l’Iglesiente vicino; Portoscuso e Carloforte se vuoi continuare sul mare del Sulcis.",
        ],
      },
      {
        title: "Quando andarci, e con quali regole",
        paragraphs: [
          "Giugno e settembre sono i mesi in cui queste spiagge restano spiagge. Luglio e agosto sono i mesi in cui diventano code: Pelosa, Tuerredda, Brandinchi, Mariolu, Porto Giunco. Il Golfo di Orosei, col maestrale, si chiude; il Sinis, col maestrale, si alza. Il sud-est, col levante, cambia colore. Non esiste “il giorno giusto” per tutta l’isola.",
          "Regole che tornano ovunque: niente sabbia e ciottoli in tasca, niente varchi sulle dune, niente fuochi, i ticket quando un Comune li mette. La Pelosa, Goloritzé, Bidderosa, in certi anni Cala Cipolla: numeri chiusi. Budelli: niente sbarco. L’Asinara e La Maddalena: parchi, traghetti, regole. I prezzi e gli orari non li fissiamo noi: li pubblica chi gestisce l’accesso.",
          "Fuori estate queste coste sono un altro viaggio. Piscinas col vento è un deserto. Goloritzé a ottobre è un sentiero. Is Arutas a maggio è quarzo e poca gente. Se cerchi la foto da cartolina senza la folla, sposta il calendario, non il gommone.",
        ],
      },
      {
        title: "Come continuare su EVERAS",
        paragraphs: [
          "Ogni spiaggia di questa guida ha un paese dietro. Stintino, Santa Teresa, San Teodoro, Arzachena, Baunei, Dorgali, Orosei, Villasimius, Muravera, Domus de Maria, Cabras: le schede stanno in Scopri la Sardegna. Lì trovi storia, tradizioni, cosa visitare, e sotto gli eventi. Il mare è il motivo per cui arrivi; il paese è il motivo per cui resti.",
          "Cultura Sarda continua a tema - zona blu, feste, personaggi. Il calendario resta il posto per sagre e weekend. Questa pagina è la costa: da nord a sud, con la foto, la licenza e il link a chi l’ha scattata.",
        ],
      },
    ],
    faqs: [
      {
        question: "Quali sono le spiagge più belle della Sardegna?",
        answer:
          "Non c’è una sola risposta. A nord La Pelosa e Rena Bianca; in Gallura Brandinchi, La Cinta e Capriccioli; nel Golfo di Orosei Goloritzé, Luna, Mariolu e Sisine; a sud Porto Giunco, Costa Rei, Su Giudeu, Tuerredda e Porto Pino; a ovest Is Arutas, Piscinas e Cala Domestica. Questa guida le tiene tutte, con foto e come arrivarci.",
      },
      {
        question: "Qual è la spiaggia più bella del nord Sardegna?",
        answer:
          "La Pelosa a Stintino è quella più fotografata: acqua bassa, torre, Asinara in faccia. Rena Bianca a Santa Teresa è sotto il paese. A San Teodoro, Brandinchi è la cala chiusa, La Cinta è la spiaggia lunga con Tavolara.",
      },
      {
        question: "Come si arriva a Cala Goloritzé?",
        answer:
          "A piedi dal Golgo di Baunei, in circa un’ora e mezza di discesa, con prenotazione quando il Comune la chiede. In barca si arriva al largo; lo sbarco sulla cala è regolato o vietato. Controlla il bando dell’anno in corso.",
      },
      {
        question: "La Pelosa è a pagamento?",
        answer:
          "In alta stagione l’accesso è regolato: tetto di presenze, prenotazione, regole su scarpe e ombrelloni. I dettagli li pubblica il Comune di Stintino e cambiano ogni estate. Fuori stagione il regime è un altro.",
      },
      {
        question: "Si può visitare la Spiaggia Rosa di Budelli?",
        answer:
          "No: non si sbarca, non si cammina sulla sabbia rosa. Fa parte del Parco di La Maddalena. Si può al massimo vederla da un’imbarcazione autorizzata, a distanza. Non è una tappa da bagno.",
      },
      {
        question: "Quando è il momento migliore per le spiagge sarde?",
        answer:
          "Giugno e settembre: acqua già buona, meno code. Luglio e agosto saturano Pelosa, Tuerredda, Mariolu, Brandinchi. Il Golfo di Orosei dipende dal maestrale; il Sinis e la Costa Verde dal ponente.",
      },
      {
        question: "Da dove arrivano le foto di questa guida?",
        answer:
          "Da Wikimedia Commons, con licenze libere (Creative Commons o pubblico dominio). Sotto ogni immagine trovi autore, licenza e il link alla pagina originale. Le foto sono ridimensionate per il web.",
      },
    ],
    relatedLinks: [
      {
        href: "/cultura-sarda/nord-sardegna/stintino",
        label: "Guida Stintino",
      },
      {
        href: "/cultura-sarda/nord-sardegna/santa-teresa-gallura",
        label: "Guida Santa Teresa Gallura",
      },
      {
        href: "/cultura-sarda/nord-sardegna/san-teodoro",
        label: "Guida San Teodoro",
      },
      {
        href: "/cultura-sarda/nord-sardegna/arzachena",
        label: "Guida Arzachena",
      },
      {
        href: "/cultura-sarda/nord-sardegna/la-maddalena",
        label: "Guida La Maddalena",
      },
      {
        href: "/cultura-sarda/centro-sardegna/baunei",
        label: "Guida Baunei",
      },
      {
        href: "/cultura-sarda/centro-sardegna/dorgali",
        label: "Guida Dorgali",
      },
      {
        href: "/cultura-sarda/centro-sardegna/orosei",
        label: "Guida Orosei",
      },
      {
        href: "/cultura-sarda/sud-sardegna/villasimius",
        label: "Guida Villasimius",
      },
      {
        href: "/cultura-sarda/sud-sardegna/muravera",
        label: "Guida Muravera",
      },
      {
        href: "/cultura-sarda/sud-sardegna/domus-de-maria",
        label: "Guida Domus de Maria",
      },
      {
        href: "/cultura-sarda/centro-sardegna/cabras",
        label: "Guida Cabras",
      },
      {
        href: "/cultura-sarda/sud-sardegna/guspini",
        label: "Guida Guspini",
      },
      {
        href: "/cultura-sarda/sud-sardegna/gonnesa",
        label: "Guida Gonnesa",
      },
    ],
    publishedAt: "2026-09-18",
  },
];
