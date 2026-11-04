import { existsSync, readFileSync } from 'node:fs'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import type { Item } from '../shared/schemas'
import { createApp } from './app'
import { createMemoryStore } from './store'

const seed = JSON.parse(readFileSync('data/seed.json', 'utf-8')) as Item[]
const store = createMemoryStore(seed) // Aufgabe 4: durch SqliteStore ersetzen

const app = createApp(store)

// Im Container liefert das Backend auch das gebaute Frontend aus (npm run build).
if (existsSync('dist/client/index.html')) {
  app.use('/*', serveStatic({ root: './dist/client' }))
  app.get('*', serveStatic({ path: './dist/client/index.html' }))
}

const port = Number(process.env.PORT ?? 3000)
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server läuft auf http://localhost:${port}`)
})
