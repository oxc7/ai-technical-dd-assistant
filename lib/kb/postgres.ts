import { PrismaClient } from '@prisma/client'
import type { IngestDoc } from '../types'
import type { KnowledgeBase, StoredDoc } from './interface'
import { chunkText, embed } from '../embeddings'

const prisma: PrismaClient = (globalThis as any).__ddPrisma__ ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') (globalThis as any).__ddPrisma__ = prisma

function toVectorLiteral(v: number[]): string {
  return `[${v.join(',')}]`
}

/**
 * Postgres + pgvector knowledge base. Embeddings live in a `vector` column that
 * Prisma doesn't model natively, so chunk writes and similarity search use raw
 * SQL. Retrieval is cosine distance (`<=>`) ordered ascending.
 *
 * Requires the vector column + index, created once by ensureSchema().
 */
export class PostgresKnowledgeBase implements KnowledgeBase {
  backend = 'postgres' as const
  private schemaReady = false

  private async ensureSchema() {
    if (this.schemaReady) return
    await prisma.$executeRawUnsafe('CREATE EXTENSION IF NOT EXISTS vector')
    // Add the embedding vector column to the Chunk table if the migration hasn't.
    await prisma.$executeRawUnsafe(
      'ALTER TABLE "Chunk" ADD COLUMN IF NOT EXISTS embedding vector',
    )
    this.schemaReady = true
  }

  async ensureCompany(name: string, sector?: string): Promise<string> {
    const existing = await prisma.company.findFirst({ where: { name } })
    if (existing) return existing.id
    const created = await prisma.company.create({ data: { name, sector } })
    return created.id
  }

  async ingest(companyId: string, docs: IngestDoc[]): Promise<StoredDoc[]> {
    await this.ensureSchema()
    const stored: StoredDoc[] = []
    for (const doc of docs) {
      const record = await prisma.document.create({
        data: { companyId, title: doc.title, kind: doc.kind, content: doc.content },
      })
      const chunks = chunkText(doc.content)
      const embeddings = await embed(chunks)
      for (let i = 0; i < chunks.length; i++) {
        await prisma.$executeRawUnsafe(
          'INSERT INTO "Chunk" (id, "documentId", content, embedding, "createdAt") VALUES (gen_random_uuid()::text, $1, $2, $3::vector, now())',
          record.id,
          chunks[i],
          toVectorLiteral(embeddings[i]),
        )
      }
      stored.push({ id: record.id, title: doc.title, kind: doc.kind, chars: doc.content.length })
    }
    return stored
  }

  async listDocuments(companyId: string): Promise<StoredDoc[]> {
    const docs = await prisma.document.findMany({
      where: { companyId },
      select: { id: true, title: true, kind: true, content: true },
      orderBy: { createdAt: 'asc' },
    })
    return docs.map((d) => ({ id: d.id, title: d.title, kind: d.kind, chars: d.content.length }))
  }

  async retrieve(companyId: string, query: string, k: number): Promise<string[]> {
    await this.ensureSchema()
    const [queryEmbedding] = await embed([query])
    const rows = await prisma.$queryRawUnsafe<{ content: string }[]>(
      `SELECT c.content
       FROM "Chunk" c
       JOIN "Document" d ON d.id = c."documentId"
       WHERE d."companyId" = $1 AND c.embedding IS NOT NULL
       ORDER BY c.embedding <=> $2::vector
       LIMIT $3`,
      companyId,
      toVectorLiteral(queryEmbedding),
      k,
    )
    return rows.map((r) => r.content)
  }
}
