import type { KnowledgeBase } from './interface'
import { MemoryKnowledgeBase } from './memory'

let cached: KnowledgeBase | null = null

/**
 * Pick the knowledge-base backend:
 * - Postgres + pgvector when DATABASE_URL is set (production path).
 * - In-memory otherwise (zero-infra demo path).
 */
export function getKnowledgeBase(): KnowledgeBase {
  if (cached) return cached
  if (process.env.DATABASE_URL) {
    // Imported lazily so the app runs without @prisma/client generated in demo mode.
    const { PostgresKnowledgeBase } = require('./postgres') as typeof import('./postgres')
    cached = new PostgresKnowledgeBase()
  } else {
    cached = new MemoryKnowledgeBase()
  }
  return cached
}

export type { KnowledgeBase, StoredDoc } from './interface'
