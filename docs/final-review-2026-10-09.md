# Revisione finale delle schede e della pubblicità

Il 9 ottobre il lotto selezionato di 30 descrizioni brevi è stato interamente
riscritto. «Interamente riscritto» non significa che tutti i programmi futuri
sono confermati o che Google abbia approvato il sito.

## Modifiche ai contenuti già applicate

- Gospel Worship: annuncio preliminare, senza orario, sede o gratuità inventati.
- Challenge Forte Village: gare 24–25 ottobre, calendario ufficiale e rimozione
  della tariffa Sprint di 85 euro scaduta il 31 dicembre 2025.
- Salon Belle Époque: aggiornamento alle 18:30 da Salude & Trigu, segnalando
  la precedente indicazione comunale delle 18:00; costo ancora da confermare.
- Borgo diVino: calendario ufficiale 17–18 ottobre, senza orari o voucher
  attribuiti al 2026 in assenza di conferma.
- Lollove: informazioni unite nella scheda canonica, duplicato conservato in
  bozza; vecchia URL verificata in produzione con risposta 308 verso la canonica.

Le tappe future restano contrassegnate come da verificare quando manca un
programma completo. Non sostituire le informazioni mancanti con quelle del 2025.

## Codice pronto, senza deploy

- Quattro redirect permanenti condividono la stessa mappa del fallback evento.
- Prezzo sconosciuto rimane sconosciuto anche dopo il passaggio alle card,
  nei dettagli e nella newsletter: «Prezzo da confermare».
- Il footer seleziona l'API CMP regionale per riaprire le preferenze fuori UE.
- Speaking Fluently usa un ID autonomo; la creatività fissa viene esclusa
  dall'elenco dinamico per evitare duplicazioni. Il contatore EVERAS cancellato
  scompare dalla lista admin, conservando l'ordine e le sue statistiche.
- Il branch maintenance/speaking-fluently-tracking ha il deploy Git disabilitato.

## Attivazione al prossimo deploy autorizzato

1. Pubblicare la PR solo quando il deploy sarà autorizzato.
2. Verificare tutte le URL di CONSOLIDATED_EVENT_SLUGS: 308 verso una canonica
   pubblicata e leggibile. Verificare che Speaking Fluently compaia una sola volta.
3. Aggiornare il backup di contatori e metadati pubblicitari, escludendo token.
4. Eseguire manualmente supabase/maintenance/activate-final-review.sql.
   Non si tratta di una migration automatica. La transazione controlla gli ID,
   gli slug e le revisioni dei duplicati. Non azzera statistiche esistenti.
5. In admin → Pubblicità verificare Speaking Fluently con contatori propri,
   assenza del vecchio contatore EVERAS e corretto incremento di view/click
   durante la normale fruizione. Non trasferire le statistiche istituzionali.
6. Verificare rifiuto, accettazione, ricaricamento e revoca dalla UE con la CMP
   pubblicata. Gli annunci AdSense restano sospesi.

## Consenso: evidenze e limiti

La configurazione remota consultata espone publisherName EVERAS, GDPR/USP,
Google Basic Consent, italiano e gdprPrivacyLink https://www.everas.it/privacy.
InMobi Choice compare nell'elenco CMP certificate di Google con ID 10.
Queste evidenze non provano da sole il funzionamento del flusso europeo.

Nel browser di verifica è apparso il pannello statunitense. Nessuna sorgente
GA4 prima della scelta; Analytics caricato dopo il consenso e ripristinato alla
ricarica. AdSense assente. Dopo il salvataggio, la riapertura attraverso il solo
displayConsentUi non ha mostrato il pannello: la correzione regionale è preparata
e coperta da test, ma la revoca completa deve essere verificata dopo il deploy.

Nel pannello US, Privacy Policy, Data Access e Data Deletion puntano alla home.
Correggere questi URL nella configurazione US di InMobi; il link GDPR è già corretto.
Non alterare il tag universale del fornitore né inventare una configurazione premium.

## Validazione completata

- 153 test Vitest passati su 22 file; typecheck TypeScript ed ESLint passati.
- La configurazione di produzione viene caricata dal loader Next.js e contiene
  i quattro redirect permanenti attesi.
- Tutti i campi modificati nelle quattro schede ricontrollati: nessuna differenza.
- Zero descrizioni sotto 300 caratteri di testo nelle schede pubblicate ancora
  attive al momento del controllo (157 schede, numero variabile nel tempo).
- Procedura di attivazione provata in una transazione conclusa con ROLLBACK:
  quattro duplicati in bozza; nuovo ordine attivo; incremento RPC di view e click
  corretto. Dopo ROLLBACK, nuovo ordine assente e vecchi contatori invariati
  (57 visualizzazioni, 4 click). Nessuna attivazione pubblicitaria applicata.
- Nessun deploy, merge o modifica al branch main.

## Fonti primarie

- https://challenge-fortevillage.com/race-information/time-schedule/?lang=it
- https://challenge-fortevillage.com/race-information/entry-fees/
- https://saludetrigu.it/evento/nessun-dorma-2026-18-ottobre/
- https://www.comune.sorso.ss.it/Novita/Notizie/Sorso-Estate-2026-ai-nastri-di-partenza
- https://borgodivino.it/al-via-ledizione-2026-di-borgo-divino-in-tour-presentate-ieri-alla-camera-dei-deputati-tutte-le-novita-della-rassegna-enogastronomica-itinerante-tra-i-borghi-piu-belli-ditalia/
- https://support.google.com/adsense/answer/13554116?hl=it
- https://support.inmobi.com/choice/getting-started-cmp/implementing-cmp-via-code/web-sdk/web-callbacks
