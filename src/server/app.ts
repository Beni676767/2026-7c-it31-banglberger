import { Hono } from 'hono'
import { itemInput, itemPatch } from '../shared/schemas'
import type { Store } from './store'

// Die App wird als Funktion gebaut, damit Tests sie mit einem Test-Store starten können.
export function createApp(store: Store) {
  const app = new Hono()

  app.get('/api/health', (c) => c.json({ status: 'ok' }))

  app.get('/api/items', async (c) => c.json(await store.list()))

  // TODO Aufgabe 2: POST /api/items   -> Eintrag anlegen (Zod-Validierung, Status 201)
  // TODO Aufgabe 2: PATCH /api/items/:id  -> Eintrag ändern
  // TODO Aufgabe 2: DELETE /api/items/:id -> Eintrag löschen
  // Fertige Lösung zum Vergleichen: snippets/02-routes.ts
  app.post('/api/items', (c) => c.json({ error: 'Noch nicht implementiert' }, 501))
  app.patch('/api/items/:id', (c) => c.json({ error: 'Noch nicht implementiert' }, 501))
  app.delete('/api/items/:id', (c) => c.json({ error: 'Noch nicht implementiert' }, 501))

  void itemInput
  void itemPatch

  return app
}
