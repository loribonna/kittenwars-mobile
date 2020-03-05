# KITTENWARS

Applicativo mobile (React Native) di Kittenwars. L'applicativo è sviluppato e
testato solo per Android.

-   Prima installazione: `npm install`.
-   Compilazione (release):
    -   Prima fase: `npm run android:bundle`,
    -   Seconda fase:
        `cd android && ./gradlew assembleRelease -x bundleReleaseJsAndAssets`
-   Avvio su device in modalità debug: `npm run android`

## Requisiti

L'applicativo necessita di un file di ambiente (`.env`) comprensivo di:

-   `CLIENT_ID`: configurazione applicativo per accesso a google.

È inoltre necessario il file `.keystore` per firmare l'applicativo.

Test:

-   `npm run test`
-   La maggior parte dei componenti effettuano operazioni CRUD basiche. L'unico
    test effettuato si trova in `dto.spec.ts` per verificare il funzionamento
    dei DTO.

## Traccia concordata

Tecnologie:

-   Backend realizzato tramite il framework NestJS. Questa scelta è motivata dal
    fatto che ho già utilizzato Django per una tesina progettuale, per cui
    vorrei utilizzare un framework diverso.
-   App mobile realizzata tramite React Native.
-   Interfaccia Web realizzata tramite React. Gli utenti amministratori avranno
    funzionalità avanzate tramite questa.

Funzionalità:

-   Autenticazione tramite i principali OAuth provider, sfruttando la libreria
    PassportJS.
-   All’utente autenticato viene permesso di:
-   Votare le immagini, selezionando tra due proposte.
-   Inserire nuove immagini -> scatto foto. Queste verranno proposte ad un
    amministratore prima di venire inserite nel sistema di votazione.
-   Vedere il proprio punteggio.
-   Vedere una classifica di punteggi e la propria posizione in essa.
-   Visualizzare le immagini più votate e meno votate.
-   All’utente non autenticato viene permesso solo di visualizzare le immagini
    più votate e meno votate.
