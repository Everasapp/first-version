# InMobi Choice e Google Analytics

## Configurazione dal 4 ottobre 2026

InMobi Choice sostituisce il banner Analytics locale con CMP TCF 2.3 + Google
Basic Consent. La proprietà www.everas.it usa solo opzioni Essentials gratuite:
configurazione Worldwide, tema di base, nessun logo, nessun vendor non-IAB,
nessun Consent or Pay, nessuna integrazione SSP o abbonamento Premium.

- I quattro segnali Google partono da denied prima della CMP e di GA.
- Il tag universale ufficiale è conservato senza modifiche in inmobi-choice-tag.ts.
- InMobi scrive gli aggiornamenti gtag, che il bootstrap rispecchia per il gate
  React: GA4 si carica soltanto con analytics_storage=granted.
- La CMP persiste e ripristina le scelte. Il vecchio cookie
  everas_analytics_consent_v1 non può più concedere alcun consenso.
- Pubblicità e statistiche hanno scelte distinte: la nostra integrazione non
  sovrascrive i segnali pubblicitari inviati dalla CMP.
- Preferenze cookie riapre la CMP tramite displayConsentUi.
- La revoca cancella solo i cookie _ga e _ga_* e ricarica il documento per
  arrestare il runtime già caricato. Autenticazione e scelte CMP restano.
- /privacy e /cookie non caricano GA4. L'invito PWA aspetta la scelta Analytics.
- AdSense resta sospeso in attesa dell'approvazione; meta account e ads.txt restano.

## Verifica dopo il deploy

1. Nuova visita: un solo banner InMobi, Accetta tutti arancione, nessun GA/AdSense.
2. Rifiuto e ricarica: nessun GA.
3. Footer Preferenze cookie: pannello della CMP con finalità Google.
4. Accetta Analytics: una sorgente GA4; scelta ripristinata alla ricarica.
5. Revoca Analytics: ricaricamento, nessun GA e cookie Analytics rimossi.
6. Accetta solo Analytics: pubblicità rifiutata e GA disponibile.
7. Privacy/Cookie accessibili, senza GA.

La raccolta nei report GA4 dipende anche dalla proprietà e dai blocchi del browser.
La CMP deve essere aggiornata in caso di nuovi servizi o futuri cambiamenti del piano.

## Fonti

https://support.inmobi.com/choice/getting-started-cmp/inmobi-cmp-premium
https://support.inmobi.com/choice/how-to-guide/google-basic-consent-with-inmobi-cmp/implementation-gbc-web
https://support.inmobi.com/choice/implementing-cmp-via-code/web-sdk/cmp2-ccpa-api-index
https://developers.google.com/tag-platform/security/guides/consent
