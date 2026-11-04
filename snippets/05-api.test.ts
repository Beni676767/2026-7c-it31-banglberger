// Aufgabe 5 – Vorlage: ergänze diese Tests in src/server/app.test.ts (innerhalb von describe)
// Voraussetzung: Die Routen aus Aufgabe 2 sind fertig.

it('POST legt einen Eintrag an (201)', async () => {
  const res = await app().request('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Neu' }),
  })
  expect(res.status).toBe(201)
  const body = (await res.json()) as { id: number; title: string }
  expect(body.title).toBe('Neu')
})

it('POST mit leerem Titel liefert 400', async () => {
  const res = await app().request('/api/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: '' }),
  })
  expect(res.status).toBe(400)
})

it('DELETE eines unbekannten Eintrags liefert 404', async () => {
  const res = await app().request('/api/items/999', { method: 'DELETE' })
  expect(res.status).toBe(404)
})
