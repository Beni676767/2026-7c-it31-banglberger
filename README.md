# Fullstack-App – Template (BRG Kepler Graz, 7. Klasse)

Ein Repository für das ganze Modul **IT-31 Fullstack-App**. Du erweiterst es Aufgabe für Aufgabe.

## Schnellstart

```bash
npm install
npm run dev
```

* Frontend: <http://localhost:5173> (Vite, Hot Reload)
* Backend: <http://localhost:3000/api/items> (Hono)

## Aufbau

* `src/client/` – Oberfläche (Preact + Tailwind). `api.ts` ist die einzige Stelle, die mit dem Backend spricht.
* `src/server/` – API (Hono). `store.ts` ist die Daten-Schnittstelle, `db/schema.ts` das Datenbank-Schema.
* `src/shared/schemas.ts` – Zod-Schemas und Typen für Frontend **und** Backend.
* `data/seed.json` – Demodaten.
* `drizzle/` – SQL-Migrationen (werden aus dem Schema erzeugt).
* `snippets/` – Referenzlösungen zu jeder Aufgabe (erst selbst versuchen!).
* `AGENTS.md` – Regeln für KI-Agenten (Antigravity, Cline, Jules, AI Studio).

## Befehle

* `npm run dev` – Entwicklung · `npm test` – Tests · `npm run typecheck` – TypeScript prüfen
* `npm run build` – Build für den Container · `npm run build:static` – Build ohne Backend (einbettbar)
* `npm run db:generate` – Migration aus einer Schema-Änderung erzeugen

## Aufgaben

Die Aufgabenstellungen (inkl. Links, Anleitungen für VS Code, Antigravity und Google AI Studio) findest du in Microsoft Teams.
Die `TODO Aufgabe N`-Kommentare im Code zeigen dir, wo du arbeitest.
