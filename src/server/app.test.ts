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

  it('POST legt einen gültigen Eintrag mit 201 an', async () => {
    const res = await app().request('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Tic-Tac-Toe spielen', rating: 5 }),
    })

    expect(res.status).toBe(201)
    expect(await res.json()).toMatchObject({ title: 'Tic-Tac-Toe spielen', rating: 5 })
  })

  it('POST lehnt einen leeren Titel mit 400 ab', async () => {
    const res = await app().request('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    })

    expect(res.status).toBe(400)
  })

  it('PATCH verändert einen Eintrag', async () => {
    const res = await app().request('/api/items/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: true, rating: 4 }),
    })

    expect(res.status).toBe(200)
    expect(await res.json()).toMatchObject({ done: true, rating: 4 })
  })

  it('PATCH liefert für eine unbekannte ID 404', async () => {
    const res = await app().request('/api/items/9999', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: true }),
    })

    expect(res.status).toBe(404)
  })

  it('DELETE löscht einen Eintrag und liefert 204', async () => {
    const res = await app().request('/api/items/1', { method: 'DELETE' })
    expect(res.status).toBe(204)
  })

  it('DELETE liefert beim zweiten Versuch 404', async () => {
    const api = app()
    await api.request('/api/items/1', { method: 'DELETE' })
    const res = await api.request('/api/items/1', { method: 'DELETE' })
    expect(res.status).toBe(404)
  })
})
