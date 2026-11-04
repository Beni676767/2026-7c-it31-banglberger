// Aufgabe 3 – Referenzlösung für src/client/App.tsx (Formular, Erledigt-Checkbox, Löschen)
import { useEffect, useState } from 'preact/hooks'
import type { Item } from '../shared/schemas'
import { api } from './api'

export function App() {
  const [items, setItems] = useState<Item[]>([])
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Allgemein')
  const [error, setError] = useState('')

  const reload = () =>
    api
      .list()
      .then(setItems)
      .catch((e: Error) => setError(e.message))

  useEffect(() => {
    reload()
  }, [])

  async function add(e: Event) {
    e.preventDefault()
    try {
      await api.create({ title, category, note: '' })
      setTitle('')
      await reload()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  async function toggle(item: Item) {
    await api.update(item.id, { done: !item.done })
    await reload()
  }

  async function remove(item: Item) {
    await api.remove(item.id)
    await reload()
  }

  return (
    <main class="mx-auto max-w-2xl p-6">
      <h1 class="text-3xl font-bold text-brand">Meine Fullstack-App</h1>

      {error && <p class="my-4 rounded bg-red-100 p-3 text-red-800">{error}</p>}

      <form onSubmit={add} class="my-6 flex gap-2">
        <input
          class="flex-1 rounded border border-slate-300 p-2"
          placeholder="Neuer Eintrag"
          value={title}
          onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          required
        />
        <input
          class="w-36 rounded border border-slate-300 p-2"
          value={category}
          onInput={(e) => setCategory((e.target as HTMLInputElement).value)}
        />
        <button class="rounded bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
          Hinzufügen
        </button>
      </form>

      <ul class="space-y-3">
        {items.map((item) => (
          <li key={item.id} class="flex items-center gap-3 rounded-lg border border-slate-200 p-4 shadow-sm">
            <input type="checkbox" checked={item.done} onChange={() => toggle(item)} />
            <div class="flex-1">
              <span class="text-xs uppercase tracking-wide text-slate-500">{item.category}</span>
              <h2 class={item.done ? 'font-semibold line-through' : 'font-semibold'}>{item.title}</h2>
              {item.note && <p class="text-sm text-slate-600">{item.note}</p>}
            </div>
            <button class="text-red-600 hover:underline" onClick={() => remove(item)}>
              Löschen
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
