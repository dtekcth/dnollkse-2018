# DNollK.se

Detta repo innehåller källkoden till hemsidan för Datateknologsektionens (dtek.se) mottagningskommitté DNollK.
Målet med sidan är att vara en samlingsplats för all information som de nyantagna på utbildningsprogrammet
Datateknik på Chalmers tekniska högskola kommer behöva under de första fyra veckorna på deras Chalmerstid, mottagningen.

## Node / Meteor / React
Detta projekt bygger på ramverket Meteor ([meteor.com](meteor.com)). Meteor ger en bra grund för webbapplikationer med stor flexibilitet.
Databashantering sköts genom Meteors MongoDB driver som även sköter client subscriptions och publications.
Allt som ändras i databasen sker genom metoder som körs både på klienten och server, med hjälp av clientside prediction och serverside reconciliation. Varje klient har en mini-instans av MongoDB vid namn Minimongo, men denna är bara synkad envägs från server->klient, och endast det som klienten subscribar till kommer att synkas!

## Assets
Alla stylesheets processeras genom Laravel Mix och använder sig av Indented SASS syntax.
Tailwind är ett CSS ramverk skrivet som ett PostCSS plugin som inte tvingar ett visst utseende,
vilket t.ex. Bootstrap eller Semantic UI gör. Delar av frontenden är skapade via CSS klasser som definierar vissa CSS 
properties, som man även kan kombinera till CSS komponenter ifall det används ofta.
Mer om Tailwind kan du läsa på [tailwindcss.com](tailwindcss.com).

## Frontend
Hela frontenden är skriven med hjälp av React. Routing sköts genom React Router v4.

Det finns 2 primära layouts; MainLayout och AdminLayout.
MainLayout används för att visa omslagsbilden, navigation och footer.
AdminLayout används för navigation i adminpanelen.

Det finns även en utility-layout som används utöver de 2 andra; AuthorizedLayout.
Denna kan användas för att begränsa åtkomst till en viss sida.
Detta sköts på klienten i React Router, vilket betyder att åtkomst till data måste även begränsas i serverpublikationerna,
vilket man kan göra med hjälp av Meteor Roles paketet.

## Installation
För att installera behövs endast Meteor installeras, då det kommer med sin egna inbyggda version av NodeJS.
Meteor går att enkelt installeras från deras hemsida.

**Notera att Meteor endast krävs ifall man ska utveckla eller bygga sin egen version av hemsidan**

## Kompilation
För att bygga hemsidan till en pure NodeJS applikation kör man kommandot:
```
meteor build [output]
```
i root av repot.

När sidan är startad kommer du att presenteras av en setup skärm som låter dig skapa ett admin konto.
Efter det kommer sidan att vara helt tom. Vissa permissions kommer att ha skapats automatiskt som kan givetvis
ändras i admin panelen.
Omslagsbild, kommittéer, sidor måste konfigureras i admin panelen under Committees, Pages och Settings.
Just nu finns inga defaults, men det kommer nog ändras i framtiden!

## Utveckling
För att utveckla för meteor är det så simpelt som att starta applikationen genom kommandot:
```
meteor npm start
```
Meteor kommer då att läsa av filer som ändras och automatiskt hot-reloada koden och
även refresha din browser när en ändring sker.

För att processera stylesheets måste man köra kommandot:
```
meteor npm watch:dev
```
som också kommer att bygga styles vid varje ändring.

Dessa två kommandon körs vanligtvis sida vid sida.

## Frågor?
Om man har frågor kan maila till [mailto:dnollk@dtek.se](dnollk@dtek.se).
Om man hittar buggar eller önskar features osv. är det bara att skapa en issue.
