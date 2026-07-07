import type { IngestDoc } from '../types'

export type StoredDoc = {
  id: string
  title: string
  kind: string
  chars: number
}

export interface KnowledgeBase {
  /** Human-readable label for which backend is active. */
  backend: 'postgres' | 'memory'

  /** Ensure a company exists (by name) and return its id. */
  ensureCompany(name: string, sector?: string): Promise<string>

  /** Chunk, embed, and store documents for a company. Returns stored docs. */
  ingest(companyId: string, docs: IngestDoc[]): Promise<StoredDoc[]>

  /** List documents stored for a company. */
  listDocuments(companyId: string): Promise<StoredDoc[]>

  /** Retrieve the top-k most relevant chunk texts for a query. */
  retrieve(companyId: string, query: string, k: number): Promise<string[]>
}
