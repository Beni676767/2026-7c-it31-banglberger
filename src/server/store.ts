import type { Item, ItemInput, ItemPatch } from '../shared/schemas'

// Eine "Store"-Schnittstelle: Die API weiß nicht, WO die Daten liegen.
//   Aufgabe 2: MemoryStore  (Daten nur im Arbeitsspeicher)
//   Aufgabe 4: SqliteStore  (Daten dauerhaft in einer SQLite-Datei)
//   Aufgabe 7: LocalStore   (im Browser, siehe src/client/api.ts)
export interface Store {
  list(): Promise<Item[]>
  create(input: ItemInput): Promise<Item>
  update(id: number, patch: ItemPatch): Promise<Item | undefined>
  remove(id: number): Promise<boolean>
}

export function createMemoryStore(seed: Item[] = []): Store {
  let items = [...seed]
  let nextId = items.reduce((max, i) => Math.max(max, i.id), 0) + 1

  return {
    async list() {
      return items
    },
    async create(input) {
      const item: Item = {
        id: nextId++,
        ...input,
        done: false,
        createdAt: new Date().toISOString(),
      }
      items.push(item)
      return item
    },
    async update(id, patch) {
      const item = items.find((i) => i.id === id)
      if (!item) return undefined
      Object.assign(item, patch)
      return item
    },
    async remove(id) {
      const before = items.length
      items = items.filter((i) => i.id !== id)
      return items.length < before
    },
  }
}
