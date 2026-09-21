# Snapshot POST-DEPLOY (read-only) — 16 schede Cultura Sarda

- **Data snapshot:** 21 settembre 2026
- **Commit di riferimento (contenuto schede):** `5365c9e97b0e47910859ca2115d98a315151b56a` (`feat(cultura): expand editorial town pages`, 20 settembre 2026 21:57 +0200)
- **HEAD live al momento del fetch:** `abd3e5c` (compressione immagini statiche; nessun cambio di `title` / `description` / `sources` / `relatedLinks` delle 16 schede)
- **Origine URL:** `https://www.everas.it`
- **Sitemap consultata:** `https://www.everas.it/sitemap.xml` (HTTP 200, 713 `<loc>`, non è un indice)
- **robots.txt:** `Allow: /` per queste URL; `Sitemap: https://www.everas.it/sitemap.xml`
- **Fase:** sola lettura. Nessuna richiesta di indicizzazione.

## Elenco delle 16 pagine

| # | Pagina | Path repository | URL live |
| -: | ------ | --------------- | -------- |
| 1 | Selargius | `/cultura-sarda/sud-sardegna/selargius` | https://www.everas.it/cultura-sarda/sud-sardegna/selargius |
| 2 | Serri | `/cultura-sarda/sud-sardegna/serri` | https://www.everas.it/cultura-sarda/sud-sardegna/serri |
| 3 | Guspini | `/cultura-sarda/sud-sardegna/guspini` | https://www.everas.it/cultura-sarda/sud-sardegna/guspini |
| 4 | Bitti | `/cultura-sarda/centro-sardegna/bitti` | https://www.everas.it/cultura-sarda/centro-sardegna/bitti |
| 5 | Sant'Antioco | `/cultura-sarda/sud-sardegna/sant-antioco` | https://www.everas.it/cultura-sarda/sud-sardegna/sant-antioco |
| 6 | Oliena | `/cultura-sarda/centro-sardegna/oliena` | https://www.everas.it/cultura-sarda/centro-sardegna/oliena |
| 7 | Orroli | `/cultura-sarda/sud-sardegna/orroli` | https://www.everas.it/cultura-sarda/sud-sardegna/orroli |
| 8 | Isili | `/cultura-sarda/sud-sardegna/isili` | https://www.everas.it/cultura-sarda/sud-sardegna/isili |
| 9 | Villanovaforru | `/cultura-sarda/sud-sardegna/villanovaforru` | https://www.everas.it/cultura-sarda/sud-sardegna/villanovaforru |
| 10 | Codrongianos | `/cultura-sarda/nord-sardegna/codrongianos` | https://www.everas.it/cultura-sarda/nord-sardegna/codrongianos |
| 11 | Bonorva | `/cultura-sarda/nord-sardegna/bonorva` | https://www.everas.it/cultura-sarda/nord-sardegna/bonorva |
| 12 | Sedini | `/cultura-sarda/nord-sardegna/sedini` | https://www.everas.it/cultura-sarda/nord-sardegna/sedini |
| 13 | Borutta | `/cultura-sarda/nord-sardegna/borutta` | https://www.everas.it/cultura-sarda/nord-sardegna/borutta |
| 14 | Ardara | `/cultura-sarda/nord-sardegna/ardara` | https://www.everas.it/cultura-sarda/nord-sardegna/ardara |
| 15 | Perfugas | `/cultura-sarda/nord-sardegna/perfugas` | https://www.everas.it/cultura-sarda/nord-sardegna/perfugas |
| 16 | Isola dell'Asinara | `/cultura-sarda/nord-sardegna/isola-dell-asinara` | https://www.everas.it/cultura-sarda/nord-sardegna/isola-dell-asinara |

Slug e path presi dal repository (`CultureTownArticle.path`), non inventati.

---

## A. Snapshot generale

Fetch HTTP GET su origine produzione, 21 settembre 2026. `Words` = conteggio approssimativo di token alfanumerici nell’elemento `<article>` (testo visibile: intro, sezioni, FAQ, fonti, link correlati, eventuale blocco eventi). `FAQ` / `Sources` / `RelatedLinks` allineati a repository e confermati sul live (FAQPage JSON-LD). `Index status` da Search Console: non disponibile in questo workspace.

| Pagina | URL | HTTP | Index status | Canonical | Title | Words | FAQ | Sources | RelatedLinks |
| ------ | --- | ---: | ------------ | --------- | ----- | ----: | --: | ------: | -----------: |
| Selargius | https://www.everas.it/cultura-sarda/sud-sardegna/selargius | 200 | Dato non disponibile | uguale all’URL | Selargius: matrimonio selargino \| EVERAS | 701 | 4 | 3 | 6 |
| Serri | https://www.everas.it/cultura-sarda/sud-sardegna/serri | 200 | Dato non disponibile | uguale all’URL | Serri: Santuario nuragico di Santa Vittoria \| EVERAS | 660 | 5 | 3 | 2 |
| Guspini | https://www.everas.it/cultura-sarda/sud-sardegna/guspini | 200 | Dato non disponibile | uguale all’URL | Guspini: Medio Campidano e Montevecchio \| EVERAS | 630 | 5 | 3 | 3 |
| Bitti | https://www.everas.it/cultura-sarda/centro-sardegna/bitti | 200 | Dato non disponibile | uguale all’URL | Bitti: canto a tenore e patrimonio culturale \| EVERAS | 821 | 5 | 2 | 2 |
| Sant'Antioco | https://www.everas.it/cultura-sarda/sud-sardegna/sant-antioco | 200 | Dato non disponibile | uguale all’URL | Sant'Antioco: Sulki, archeologia e tradizione \| EVERAS | 801 | 5 | 4 | 3 |
| Oliena | https://www.everas.it/cultura-sarda/centro-sardegna/oliena | 200 | Dato non disponibile | uguale all’URL | Oliena: Supramonte, archeologia e tradizioni \| EVERAS | 815 | 5 | 4 | 3 |
| Orroli | https://www.everas.it/cultura-sarda/sud-sardegna/orroli | 200 | Dato non disponibile | uguale all’URL | Orroli: Nuraghe Arrubiu \| EVERAS | 655 | 5 | 2 | 3 |
| Isili | https://www.everas.it/cultura-sarda/sud-sardegna/isili | 200 | Dato non disponibile | uguale all’URL | Isili: Nuraghe Is Paras \| EVERAS | 574 | 4 | 2 | 3 |
| Villanovaforru | https://www.everas.it/cultura-sarda/sud-sardegna/villanovaforru | 200 | Dato non disponibile | uguale all’URL | Villanovaforru: Genna Maria \| EVERAS | 652 | 5 | 3 | 3 |
| Codrongianos | https://www.everas.it/cultura-sarda/nord-sardegna/codrongianos | 200 | Dato non disponibile | uguale all’URL | Codrongianos: Saccargia \| EVERAS | 558 | 4 | 2 | 3 |
| Bonorva | https://www.everas.it/cultura-sarda/nord-sardegna/bonorva | 200 | Dato non disponibile | uguale all’URL | Bonorva: Sant'Andrea Priu \| EVERAS | 679 | 5 | 3 | 3 |
| Sedini | https://www.everas.it/cultura-sarda/nord-sardegna/sedini | 200 | Dato non disponibile | uguale all’URL | Sedini: Domus La Rocca \| EVERAS | 515 | 4 | 1 | 3 |
| Borutta | https://www.everas.it/cultura-sarda/nord-sardegna/borutta | 200 | Dato non disponibile | uguale all’URL | Borutta: San Pietro di Sorres \| EVERAS | 547 | 4 | 2 | 3 |
| Ardara | https://www.everas.it/cultura-sarda/nord-sardegna/ardara | 200 | Dato non disponibile | uguale all’URL | Ardara: Santa Maria del Regno \| EVERAS | 545 | 4 | 3 | 3 |
| Perfugas | https://www.everas.it/cultura-sarda/nord-sardegna/perfugas | 200 | Dato non disponibile | uguale all’URL | Perfugas: MAP e Pozzo sacro Predio Canopoli \| EVERAS | 522 | 4 | 2 | 3 |
| Isola dell'Asinara | https://www.everas.it/cultura-sarda/nord-sardegna/isola-dell-asinara | 200 | Dato non disponibile | uguale all’URL | Isola dell'Asinara: colonia penale e Parco Nazionale \| EVERAS | 605 | 5 | 2 | 3 |

Osservazioni tecniche comuni (non sono errori):

- HTTP 200, nessun redirect, URL finale = URL richiesto.
- Canonical assoluto identico all’URL previsto.
- Tag `meta name="robots"` assente: nessuna direttiva `noindex` dichiarata (comportamento default: indicizzabile).
- Tutte e 16 le URL sono presenti in `sitemap.xml`.
- Contenuto editoriale presente (`<article>`, H1 = nome del comune, description valorizzata).
- Tutti i `relatedLinks` interni (25 URL uniche) rispondono HTTP 200.

---

## B. Search Console baseline

Nel workspace **non è disponibile** un collegamento a Google Search Console (nessun tool MCP / credenziale GSC). Non è stato possibile leggere stato di indicizzazione, ultimo crawl, canonical selezionato da Google, impression, clic, CTR, posizione, query, paese o dispositivo.

| Pagina | Click | Impression | CTR | Posizione | Query | Stato |
| ------ | ----: | ---------: | --: | --------: | ----: | ----- |
| Selargius | — | — | — | — | — | Dato non disponibile |
| Serri | — | — | — | — | — | Dato non disponibile |
| Guspini | — | — | — | — | — | Dato non disponibile |
| Bitti | — | — | — | — | — | Dato non disponibile |
| Sant'Antioco | — | — | — | — | — | Dato non disponibile |
| Oliena | — | — | — | — | — | Dato non disponibile |
| Orroli | — | — | — | — | — | Dato non disponibile |
| Isili | — | — | — | — | — | Dato non disponibile |
| Villanovaforru | — | — | — | — | — | Dato non disponibile |
| Codrongianos | — | — | — | — | — | Dato non disponibile |
| Bonorva | — | — | — | — | — | Dato non disponibile |
| Sedini | — | — | — | — | — | Dato non disponibile |
| Borutta | — | — | — | — | — | Dato non disponibile |
| Ardara | — | — | — | — | — | Dato non disponibile |
| Perfugas | — | — | — | — | — | Dato non disponibile |
| Isola dell'Asinara | — | — | — | — | — | Dato non disponibile |

`—` = valore non misurato. Non equivale a zero. Non è stato possibile distinguere «pagina non indicizzata» da «indicizzata senza impression».

Nessuna richiesta di indicizzazione è stata inviata.

---

## C. Query trovate

### Selargius

Nessuna query disponibile al momento dello snapshot.

### Serri

Nessuna query disponibile al momento dello snapshot.

### Guspini

Nessuna query disponibile al momento dello snapshot.

### Bitti

Nessuna query disponibile al momento dello snapshot.

### Sant'Antioco

Nessuna query disponibile al momento dello snapshot.

### Oliena

Nessuna query disponibile al momento dello snapshot.

### Orroli

Nessuna query disponibile al momento dello snapshot.

### Isili

Nessuna query disponibile al momento dello snapshot.

### Villanovaforru

Nessuna query disponibile al momento dello snapshot.

### Codrongianos

Nessuna query disponibile al momento dello snapshot.

### Bonorva

Nessuna query disponibile al momento dello snapshot.

### Sedini

Nessuna query disponibile al momento dello snapshot.

### Borutta

Nessuna query disponibile al momento dello snapshot.

### Ardara

Nessuna query disponibile al momento dello snapshot.

### Perfugas

Nessuna query disponibile al momento dello snapshot.

### Isola dell'Asinara

Nessuna query disponibile al momento dello snapshot.

---

## Snapshot SEO da repository (21/09/2026)

Campi letti dagli oggetti `CultureTownArticle` (`publishedAt` nel codice: `2026-09-20`). Title/description live coincidono col repository; il `<title>` HTML aggiunge il suffisso di layout ` | EVERAS`.

| Pagina | publishedAt | path | Area | Provincia | Tema (title) | Sources | RelatedLinks |
| ------ | ----------- | ---- | ---- | --------- | ------------ | ------: | -----------: |
| Selargius | 2026-09-20 | `/cultura-sarda/sud-sardegna/selargius` | Campidano di Cagliari | Cagliari | matrimonio selargino | 3 | 6 |
| Serri | 2026-09-20 | `/cultura-sarda/sud-sardegna/serri` | Sarcidano | Cagliari | Santuario nuragico di Santa Vittoria | 3 | 2 |
| Guspini | 2026-09-20 | `/cultura-sarda/sud-sardegna/guspini` | Medio Campidano | Sud Sardegna | Montevecchio | 3 | 3 |
| Bitti | 2026-09-20 | `/cultura-sarda/centro-sardegna/bitti` | Barbagia | Nuoro | canto a tenore | 2 | 2 |
| Sant'Antioco | 2026-09-20 | `/cultura-sarda/sud-sardegna/sant-antioco` | Sulcis | Sud Sardegna | Sulki, archeologia e tradizione | 4 | 3 |
| Oliena | 2026-09-20 | `/cultura-sarda/centro-sardegna/oliena` | Barbagia | Nuoro | Supramonte, archeologia e tradizioni | 4 | 3 |
| Orroli | 2026-09-20 | `/cultura-sarda/sud-sardegna/orroli` | Sarcidano | Cagliari | Nuraghe Arrubiu | 2 | 3 |
| Isili | 2026-09-20 | `/cultura-sarda/sud-sardegna/isili` | Sarcidano | Cagliari | Nuraghe Is Paras | 2 | 3 |
| Villanovaforru | 2026-09-20 | `/cultura-sarda/sud-sardegna/villanovaforru` | Marmilla | Sud Sardegna | Genna Maria | 3 | 3 |
| Codrongianos | 2026-09-20 | `/cultura-sarda/nord-sardegna/codrongianos` | Logudoro | Sassari | Saccargia | 2 | 3 |
| Bonorva | 2026-09-20 | `/cultura-sarda/nord-sardegna/bonorva` | Meilogu | Sassari | Sant'Andrea Priu | 3 | 3 |
| Sedini | 2026-09-20 | `/cultura-sarda/nord-sardegna/sedini` | Anglona | Sassari | Domus La Rocca | 1 | 3 |
| Borutta | 2026-09-20 | `/cultura-sarda/nord-sardegna/borutta` | Meilogu | Sassari | San Pietro di Sorres | 2 | 3 |
| Ardara | 2026-09-20 | `/cultura-sarda/nord-sardegna/ardara` | Logudoro | Sassari | Santa Maria del Regno | 3 | 3 |
| Perfugas | 2026-09-20 | `/cultura-sarda/nord-sardegna/perfugas` | Anglona | Sassari | MAP e Pozzo sacro Predio Canopoli | 2 | 3 |
| Isola dell'Asinara | 2026-09-20 | `/cultura-sarda/nord-sardegna/isola-dell-asinara` | Nurra | Sassari | colonia penale e Parco Nazionale | 2 | 3 |

### Title e description (repository)

1. **Selargius** — title: `Selargius: matrimonio selargino` — description: `Selargius e l’Antico Sposalizio Selargino: rito nuziale campidanese, costumi, luoghi e partecipazione della comunità.`
2. **Serri** — title: `Serri: Santuario nuragico di Santa Vittoria` — description: `Serri e il Santuario nuragico di Santa Vittoria: archeologia, luoghi del culto e stratificazioni storiche sulla Giara di Serri.`
3. **Guspini** — title: `Guspini: Medio Campidano e Montevecchio` — description: `Guspini e Montevecchio: patrimonio minerario, archeologia industriale e memoria del lavoro nel paesaggio storico della Sardegna.`
4. **Bitti** — title: `Bitti: canto a tenore e patrimonio culturale` — description: `Bitti e il canto a tenore: patrimonio musicale della Sardegna, quattro voci tradizionali e Museo Multimediale del Canto a Tenore.`
5. **Sant'Antioco** — title: `Sant'Antioco: Sulki, archeologia e tradizione` — description: `Sant’Antioco e l’antica Sulki/Sulci: archeologia fenicio-punica, patrimonio cristiano e tradizioni legate al culto del santo.`
6. **Oliena** — title: `Oliena: Supramonte, archeologia e tradizioni` — description: `Oliena tra Supramonte e Valle di Lanaittu: archeologia nuragica e paleolitica, patrimonio del paese e tradizioni della comunità.`
7. **Orroli** — title: `Orroli: Nuraghe Arrubiu` — description: `Orroli e il Nuraghe Arrubiu: complesso nuragico pentalobato a Su Pranu, sul basalto del Sarcidano.`
8. **Isili** — title: `Isili: Nuraghe Is Paras` — description: `Isili e il Nuraghe Is Paras: torre in calcare, tholos e area archeologica all’uscita del paese, nel Sarcidano.`
9. **Villanovaforru** — title: `Villanovaforru: Genna Maria` — description: `Villanovaforru e Genna Maria: complesso nuragico, riusi storici e museo civico nella Marmilla.`
10. **Codrongianos** — title: `Codrongianos: Saccargia` — description: `Codrongianos e la Basilica della Santissima Trinità di Saccargia: romanico, bicromia e affreschi absidali nel Logudoro.`
11. **Bonorva** — title: `Bonorva: Sant'Andrea Priu` — description: `Bonorva e la necropoli di Sant'Andrea Priu: domus de janas, Tomba del Capo e riuso cristiano nel Meilogu.`
12. **Sedini** — title: `Sedini: Domus La Rocca` — description: `Sedini e La Rocca: domus de janas nel tessuto urbano, riusi storici e museo etnografico-archeologico.`
13. **Borutta** — title: `Borutta: San Pietro di Sorres` — description: `Borutta e San Pietro di Sorres: ex cattedrale della diocesi di Sorres, bicromia romanica e monastero benedettino nel Meilogu.`
14. **Ardara** — title: `Ardara: Santa Maria del Regno` — description: `Ardara e Santa Maria del Regno: cappella palatina dei giudici di Torres, basalto e retablo di Giovanni Muru.`
15. **Perfugas** — title: `Perfugas: MAP e Pozzo sacro Predio Canopoli` — description: `Perfugas: Museo Archeologico e Paleobotanico dell’Anglona e Pozzo sacro Predio Canopoli nel centro del paese.`
16. **Isola dell'Asinara** — title: `Isola dell'Asinara: colonia penale e Parco Nazionale` — description: `Asinara: dalla colonia penale al Parco Nazionale, memoria carceraria a Cala d’Oliva e Osservatorio della Memoria.`

---

## Controllo anomalie

Nessuna anomalia tecnica concreta tra quelle elencate nel brief:

- HTTP diverso da 200: nessuna
- redirect inatteso: nessuno
- canonical diverso dall’URL previsto: nessuno
- `noindex`: assente su tutte e 16
- URL assente dalla sitemap: nessuna
- relatedLink 404: nessuno (25/25 URL interne HTTP 200)
- title / description / H1 mancanti: nessuno
- pagina non raggiungibile: nessuna
- discrepanza repository vs live su title/description/H1: nessuna (solo suffisso layout ` | EVERAS` sul `<title>`)
- Google-selected canonical: non verificabile (Search Console non collegata)

Limite di questo snapshot (non è un difetto delle pagine): **Search Console non è collegata**, quindi non c’è stato di indicizzazione Google né query.

---

## Baseline aggregata (gruppo 16)

| Metrica | Valore |
| ------- | ------ |
| Pagine nel gruppo | 16 |
| HTTP 200 | 16 |
| In sitemap | 16 |
| Con contenuto editoriale | 16 |
| Indicizzate (GSC) | non calcolato (dato non disponibile) |
| Non ancora indicizzate (GSC) | non calcolato (dato non disponibile) |
| Con impression (GSC) | non calcolato (dato non disponibile) |
| Con clic (GSC) | non calcolato (dato non disponibile) |
| Impression totali | non calcolato |
| Clic totali | non calcolato |
| CTR aggregato | non calcolato |
| Posizione media aggregata | non calcolato |

FAQ totali (somma repository/live): 73. Sources totali: 41. RelatedLinks totali: 49.

---

## Confronto con lo stato precedente

Nessuna baseline Search Console precedente disponibile per un confronto omogeneo.

Nel repository non risultano file `docs/seo/snapshot-*` precedenti su queste 16 URL.

---

## Note metodologiche

- Snapshot tecnico: GET HTTP verso `www.everas.it`, 21 settembre 2026, User-Agent `EverasSnapshotBot/1.0`.
- Canonical, title, description, robots, H1 letti dall’HTML live.
- Presenza in sitemap: string match dell’URL assoluto in `https://www.everas.it/sitemap.xml`.
- FAQ live: conteggio `"@type":"Question"` nel JSON-LD FAQPage.
- `relatedLinks` verificati con GET sulle URL interne uniche.
- Search Console: nessun accesso in questo ambiente; i trattini non sono zeri.
- Non è stato usato `site:` di Google come sostituto di GSC.
- Non è stata richiesta l’indicizzazione.
- Parole «utili»: stima sul testo di `<article>`, non sul solo body editoriale del file TypeScript.
- `publishedAt` nel codice è `2026-09-20`; la data di questa fotografia operativa è **21 settembre 2026**.
