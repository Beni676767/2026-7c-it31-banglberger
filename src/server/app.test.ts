import { describe, expect, it } from 'vitest'
import { createApp } from './app'
import { createMemoryStore } from './store'

describe('API', () => {
  const app = () =>
    createApp(
      createMemoryStore([
        { id: 1, title: 'Test', category: 'A', note: '', done: false, createdAt: '2026-01-01T00:00:00.000Z' },
      ]),
    )

  it('health liefert ok', async () => {
    const res = await app().request('/api/health')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'ok' })
  })

  it('GET /api/items liefert die Einträge', async () => {
    const res = await app().request('/api/items')
    const body = (await res.json()) as unknown[]
    expect(body).toHaveLength(1)
  })

  // TODO Aufgabe 5: Schreibe Tests für POST (201 + 400 bei leerem Titel), PATCH und DELETE.
  // Vorlage: snippets/05-api.test.ts
})
