# Consenso Analytics e sospensione AdSense

## Stato dal 4 ottobre 2026

AdSense è sospeso: `GooglePublisherTags` non carica più `adsbygoogle.js` o il
messaggio Funding Choices. Il banner di EVERAS gestisce solo Google Analytics.

Il codice applica il Consent Mode di base:

- Tutti i segnali iniziali sono `denied` prima di qualsiasi tag Google.
- Il tag GA4 viene montato soltanto quando il visitatore ha accettato Analytics.
- “Accetta” aggiorna solo `analytics_storage` a `granted`; i segnali pubblicitari
  restano `denied`.
- “Rifiuta” conserva `analytics_storage: denied` e non carica GA4.
- La scelta viene salvata nel cookie tecnico `everas_analytics_consent_v1`,
  valido 180 giorni, con Path=/, SameSite=Lax e Secure su HTTPS.
- Il bootstrap ripristina una precedente accettazione prima della configurazione
  GA4. Cookie assenti o valori non validi non concedono il consenso.
- “Preferenze cookie” nel footer riapre la scelta. Revocare cancella `_ga` e
  `_ga_*` per il dominio corrente e i domini superiori, poi ricarica il documento
  per eliminare il runtime Analytics già caricato.
- `/privacy` e `/cookie` non caricano GA4 anche quando il consenso è accettato.
- L'invito di installazione PWA aspetta che sia stata effettuata una scelta.

## Verifica

I test controllano defaults e ripristino prima dei tag, riconoscimento della
scelta, aggiornamenti di consenso, assenza di GA senza accettazione e rimozione
dei cookie Analytics senza cancellare autenticazione o preferenze.

Dopo ogni deploy, verificare in una nuova sessione:

1. Il banner è visibile e nessun tag Analytics/AdSense è caricato.
2. Rifiuto, navigazione e ricaricamento conservano GA disattivato.
3. Il comando nel footer riapre le preferenze.
4. Accettazione e ricaricamento caricano una sola sorgente GA4.
5. Revoca ricarica il documento senza tag GA4.
6. Privacy/Cookie restano accessibili senza tag Google.

La raccolta effettiva nei report GA4 dipende anche dalle impostazioni della
proprietà, dai blocchi del browser e dai tempi di elaborazione. Il codice non
può ricostruire visite pregresse non registrate.

## Fonte tecnica

https://developers.google.com/tag-platform/security/guides/consent
