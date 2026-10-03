# Verifica consenso Google AdSense

Il codice imposta i quattro segnali Consent Mode v2 su `denied` prima dei
tag Google. Il timeout di 500 ms non concede il consenso: lascia alla CMP
il tempo di aggiornare gli stati. La modalità avanzata può inviare segnali
senza cookie anche con consenso negato.

Le pagine `/privacy` e `/cookie` non caricano AdSense o Analytics. I link nel
footer aprono un nuovo documento, così i tag già caricati vengono eliminati.

## Stato dell’account verificato il 3 ottobre 2026

- `everas.it` è l’unico sito nell’elenco dell’account.
- Esito della revisione del 30 settembre: **Low value content**.
- `ads.txt`: **Authorized**.
- Messaggio europeo per `everas.it`: **Published**, ultima modifica indicata
  10 settembre 2026; inglese e altre 31 lingue.
- Abilitate e salvate entrambe le opzioni Consent Mode, pubblicità e analisi.

La correzione del consenso non risolve da sola l’esito sui contenuti. Non è
stata richiesta una nuova revisione. Le prove di accettazione, rifiuto e revoca
sul sito restano da completare dopo il deploy.

## Impostazioni da mantenere nell’account AdSense

1. In **Privacy e messaggi → Regolamenti europei**, selezionare il sito
   `everas.it` e verificare che il messaggio sia pubblicato.
2. Impostare la privacy policy a `https://www.everas.it/privacy` e verificare
   che siano disponibili accettazione, rifiuto e gestione delle opzioni.
3. In **Impostazioni**, abilitare **Attiva la modalità di consenso per scopi
   pubblicitari** e **Attiva la modalità di consenso per scopi di analisi**.
   Google applica queste impostazioni a tutti i siti/app con messaggi europei
   nell'account: verificare l'eventuale presenza di altri siti prima di salvare.
4. Verificare il collegamento per riaprire le preferenze della CMP e revocare
   il consenso dopo la prima scelta.

Non aggiungere un secondo banner o aggiornamenti manuali che concedano
automaticamente il consenso: gli aggiornamenti spettano alla CMP certificata.

## Controlli dopo il deploy

Da una nuova sessione browser in Italia, controllare con Tag Assistant:

- Prima della scelta: tutti e quattro gli stati predefiniti sono `denied`.
- Rifiuto: restano negati e non vengono creati cookie Analytics/pubblicitari.
- Accettazione: la CMP aggiorna gli stati coerentemente con la scelta.
- Ricaricamento: la CMP recupera la scelta e aggiorna gli stati.
- Revoca: gli aggiornamenti riflettono il nuovo rifiuto; non verificare soltanto
  la scomparsa del banner.
- Aprire Privacy/Cookie dal footer e direttamente: nessun caricamento dei
  tag AdSense, Analytics o del messaggio Funding Choices.

Questi controlli runtime restano da completare
prima di considerare terminata l'integrazione. Non garantiscono l'approvazione
AdSense: occorre anche leggere il motivo dell'eventuale rifiuto nell'account.

## Fonti Google

- https://developers.google.com/tag-platform/security/guides/consent
- https://support.google.com/adsense/answer/16053245?hl=it
- https://support.google.com/adsense/answer/10961370?hl=en
- https://support.google.com/adsense/answer/10960768?hl=en
