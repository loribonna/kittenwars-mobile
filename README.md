# KITTENWARS

## Server

Tecnologie:
-	Backend realizzato tramite il framework NestJS. Questa scelta è motivata dal fatto che ho già utilizzato Django per una tesina progettuale, per cui vorrei utilizzare un framework diverso.
-	App mobile realizzata tramite React Native.
-	Interfaccia Web realizzata tramite React. Gli utenti amministratori avranno funzionalità avanzate tramite questa.

Funzionalità:
-	Autenticazione tramite i principali OAuth provider, sfruttando la libreria PassportJS.
-	All’utente autenticato viene permesso di:
  -	Votare le immagini, selezionando tra due proposte.
  -	Inserire nuove immagini -> scatto foto. Queste verranno proposte ad un amministratore prima di venire inserite nel sistema di votazione.
  -	Vedere il proprio punteggio.
  -	Vedere una classifica di punteggi e la propria posizione in essa.
  -	Visualizzare le immagini più votate e meno votate. 
-	All’utente non autenticato viene permesso solo di visualizzare le immagini più votate e meno votate.
