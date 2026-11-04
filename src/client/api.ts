import type { Item, ItemInput, ItemPatch } from '../shared/schemas'
import seed from '../../data/seed.json'

// Das Frontend spricht nur mit dieser Schnittstelle. Welche Variante dahinter steckt,
// entscheidet der Build-Modus:
//   npm run dev / build        -> HttpApi  (echtes Backend unter /api)
//   npm run build:static       -> LocalApi (Daten im Browser, kein Server nötig)
export interface Api {
  list(): Promise<Item[]>
  create(input: ItemInput): Promise<Item>
  update(id: number, patch: ItemPatch): Promise<Item>
  remove(id: number): Promise<void>
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })
  if (!res.ok) throw new Error(`API-Fehler ${res.status}`)
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T)
}

const httpApi: Api = {
  list: () => request('/items'),
  create: (input) => request('/items', { method: 'POST', body: JSON.stringify(input) }),
  update: (id, patch) => request(`/items/${id}`, { method: 'PATCH', body: JSON.stringify(patch) }),
  remove: (id) => request<void>(`/items/${id}`, { method: 'DELETE' }),
}

// --- Aufgabe 7: Statischer Modus ohne Backend (localStorage) -------------------------
const KEY = 'kepler-fullstack-items'

function load(): Item[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Item[]
  } catch {
    /* localStorage nicht verfügbar (z. B. Privatmodus) -> Demodaten */
  }
  return seed as Item[]
}

function save(items: Item[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    /* ignorieren */
  }
}

const localApi: Api = {
  async list() {
    return load()
  },
  async create(input) {
    const items = load()
    const item: Item = {
      id: items.reduce((m, i) => Math.max(m, i.id), 0) + 1,
      ...input,
      done: false,
      createdAt: new Date().toISOString(),
    }
    save([...items, item])
    return item
  },
  async update(id, patch) {
    const items = load()
    const item = items.find((i) => i.id === id)
    if (!item) throw new Error('Nicht gefunden')
    Object.assign(item, patch)
    save(items)
    return item
  },
  async remove(id) {
    save(load().filter((i) => i.id !== id))
  },
}

export const api: Api = import.meta.env.MODE === 'static' ? localApi : httpApi
