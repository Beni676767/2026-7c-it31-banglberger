import { useEffect, useState } from 'preact/hooks'
import type { Item } from '../shared/schemas'
import { api } from './api'

export function App() {
  const [items, setItems] = useState<Item[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .list()
      .then(setItems)
      .catch((e: Error) => setError(e.message))
  }, [])

  // TODO Aufgabe 3: Formular zum Anlegen, Checkbox "erledigt", Löschen-Button.
  // Fertige Lösung zum Vergleichen: snippets/03-App.tsx

  return (
    <main class="mx-auto max-w-2xl p-6">
      <h1 class="text-3xl font-bold text-brand">Meine Fullstack-App</h1>
      <p class="mb-6 text-slate-600">Ändere Titel und Thema in src/client/App.tsx.</p>

      {error && <p class="mb-4 rounded bg-red-100 p-3 text-red-800">{error}</p>}

      <ul class="space-y-3">
        {items.map((item) => (
          <li key={item.id} class="rounded-lg border border-slate-200 p-4 shadow-sm">
            <span class="text-xs uppercase tracking-wide text-slate-500">{item.category}</span>
            <h2 class="font-semibold">{item.title}</h2>
            {item.note && <p class="text-sm text-slate-600">{item.note}</p>}
          </li>
        ))}
      </ul>
    </main>
  )
}
