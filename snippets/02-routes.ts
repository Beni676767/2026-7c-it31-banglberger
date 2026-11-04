// Aufgabe 2 – Referenzlösung für src/server/app.ts (Ersatz für die drei TODO-Routen)
// Erst selbst versuchen, dann vergleichen!

app.post('/api/items', async (c) => {
  const parsed = itemInput.safeParse(await c.req.json().catch(() => null))
  if (!parsed.success) {
    return c.json({ error: 'Ungültige Eingabe', details: parsed.error.issues }, 400)
  }
  const item = await store.create(parsed.data)
  return c.json(item, 201)
})

app.patch('/api/items/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const parsed = itemPatch.safeParse(await c.req.json().catch(() => null))
  if (!Number.isInteger(id) || !parsed.success) {
    return c.json({ error: 'Ungültige Eingabe' }, 400)
  }
  const item = await store.update(id, parsed.data)
  return item ? c.json(item) : c.json({ error: 'Nicht gefunden' }, 404)
})

app.delete('/api/items/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const removed = await store.remove(id)
  return removed ? c.body(null, 204) : c.json({ error: 'Nicht gefunden' }, 404)
})
