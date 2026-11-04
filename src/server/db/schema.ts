import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// Tabellen-Definition in TypeScript. Daraus erzeugt "npm run db:generate" die SQL-Migration.
export const items = sqliteTable('items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  category: text('category').notNull().default('Allgemein'),
  note: text('note').notNull().default(''),
  done: integer('done', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull(),
})
