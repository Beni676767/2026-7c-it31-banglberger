# AGENTS.md – Regeln für KI-Agenten in diesem Projekt

Dieses Projekt ist eine Schul-Fullstack-App (BRG Kepler Graz, 7. Klasse). Die Datei wird von Antigravity, Cline, Jules und Google AI Studio gelesen. Schreibe Kommentare, UI-Texte und Commit-Messages auf **Deutsch**.

## Stack
* Frontend: Vite + Preact + TypeScript + Tailwind CSS v4 (`src/client/`)
* Backend: Hono auf Node (`src/server/`), Validierung mit Zod (`src/shared/schemas.ts`)
* Datenbank: SQLite über Drizzle ORM (`src/server/db/`, Migrationen in `drizzle/`)
* Tests: Vitest (`src/**/*.test.ts`), CI: `.github/workflows/ci.yml`

## Befehle
* `npm install` – Abhängigkeiten
* `npm run dev` – Backend (3000) + Frontend (5173) mit Hot Reload
* `npm test` – Tests · `npm run typecheck` – TypeScript prüfen
* `npm run build` – Container-Build · `npm run build:static` – statischer Build ohne Backend
* `npm run db:generate` – Migration aus Schema-Änderung erzeugen

## Regeln
1. Ändere nur, was die Aufgabe verlangt. Keine neuen Abhängigkeiten ohne Rückfrage.
2. Die API kennt nur die `Store`-Schnittstelle (`src/server/store.ts`). Datenzugriff gehört nicht in Routen.
3. Eingaben immer mit Zod validieren, Fehler als JSON mit passendem HTTP-Status.
4. Nach jeder Änderung `npm run typecheck` und `npm test` ausführen.
5. Niemals Schlüssel, Passwörter oder `.env` einchecken. Neue Variablen kommen in `.env.example`.
6. Ordner `snippets/` sind Referenzlösungen für Schüler:innen – nicht verändern, nicht blind kopieren.
7. Arbeite auf einem eigenen Branch (`aufgabe-N-...`) und committe in kleinen Schritten.
