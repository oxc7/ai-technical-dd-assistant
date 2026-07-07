import type { IngestDoc } from '../types'
import type { KnowledgeBase, StoredDoc } from './interface'
import { chunkText, cosineSimilarity, embed } from '../embeddings'

type MemChunk = { content: string; embedding: number[] }
type MemDoc = { id: string; title: string; kind: string; chars: number; chunks: MemChunk[] }
type MemCompany = { id: string; name: string; sector?: string; docs: MemDoc[] }

/**
 * In-memory knowledge base. Used automatically when DATABASE_URL is unset, so
 * the app runs with zero infrastructure. Data is process-local and ephemeral —
 * fine for a demo, not for production (use the Postgres backend for that).
 *
 * Held on globalThis so it survives Next.js dev hot-reloads and is shared across
 * the ingest and analyze routes.
 */
const store: Map<string, MemCompany> = (globalThis as any).__ddMemoryKB__ ?? new Map()
;(globalThis as any).__ddMemoryKB__ = store

let counter = 0
const nextId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${counter++}`

export class MemoryKnowledgeBase implements KnowledgeBase {
  backend = 'memory' as const

  async ensureCompany(name: string, sector?: string): Promise<string> {
    for (const c of store.values()) {
      if (c.name.toLowerCase() === name.toLowerCase()) return c.id
    }
    const id = nextId('co')
    store.set(id, { id, name, sector, docs: [] })
    return id
  }

  async ingest(companyId: string, docs: IngestDoc[]): Promise<StoredDoc[]> {
    const company = store.get(companyId)
    if (!company) throw new Error('Company not found')
    const stored: StoredDoc[] = []
    for (const doc of docs) {
      const chunks = chunkText(doc.content)
      const embeddings = await embed(chunks)
      const memDoc: MemDoc = {
        id: nextId('doc'),
        title: doc.title,
        kind: doc.kind,
        chars: doc.content.length,
        chunks: chunks.map((content, i) => ({ content, embedding: embeddings[i] })),
      }
      company.docs.push(memDoc)
      stored.push({ id: memDoc.id, title: memDoc.title, kind: memDoc.kind, chars: memDoc.chars })
    }
    return stored
  }

  async listDocuments(companyId: string): Promise<StoredDoc[]> {
    const company = store.get(companyId)
    if (!company) return []
    return company.docs.map((d) => ({ id: d.id, title: d.title, kind: d.kind, chars: d.chars }))
  }

  async retrieve(companyId: string, query: string, k: number): Promise<string[]> {
    const company = store.get(companyId)
    if (!company) return []
    const [queryEmbedding] = await embed([query])
    const scored: { content: string; score: number }[] = []
    for (const doc of company.docs) {
      for (const chunk of doc.chunks) {
        scored.push({
          content: chunk.content,
          score: cosineSimilarity(queryEmbedding, chunk.embedding),
        })
      }
    }
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, k)
      .map((s) => s.content)
  }
}
