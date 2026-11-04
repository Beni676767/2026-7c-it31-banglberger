// Aufgabe 4 – Referenzlösung: speichere als src/server/db/index.ts
// (Datenbank öffnen + Migrationen anwenden) und src/server/store.sqlite.ts (siehe unten).
// Treiber: libSQL = SQLite-kompatibel. Lokal eine Datei, später derselbe Code mit Turso (Cloud).

// ===== src/server/db/index.ts =====
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'

export async function openDb(url = `file:${process.env.DATABASE_PATH ?? './data/app.db'}`) {
  const db = drizzle(createClient({ url }))
  await migrate(db, { migrationsFolder: './drizzle' }) // legt/ändert Tabellen anhand der Migrationen
  return db
}

// ===== src/server/store.sqlite.ts =====
import { eq } from 'drizzle-orm'
import type { Item } from '../shared/schemas'
import { items } from './db/schema'
import type { Store } from './store'
import type { openDb } from './db'

type Db = Awaited<ReturnType<typeof openDb>>

export async function createSqliteStore(db: Db, seed: Item[] = []): Promise<Store> {
  // Demodaten nur beim allerersten Start einfügen
  if ((await db.select().from(items)).length === 0 && seed.length > 0) {
    await db.insert(items).values(seed)
  }

  return {
    async list() {
      return db.select().from(items)
    },
    async create(input) {
      const [row] = await db
        .insert(items)
        .values({ ...input, done: false, createdAt: new Date().toISOString() })
        .returning()
      return row
    },
    async update(id, patch) {
      const [row] = await db.update(items).set(patch).where(eq(items.id, id)).returning()
      return row
    },
    async remove(id) {
      const rows = await db.delete(items).where(eq(items.id, id)).returning()
      return rows.length > 0
    },
  }
}

// ===== src/server/index.ts: statt createMemoryStore =====
// const store = await createSqliteStore(await openDb(), seed)
