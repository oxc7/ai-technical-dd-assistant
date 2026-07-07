/**
 * Embedding abstraction.
 *
 * - If VOYAGE_API_KEY is set, uses Voyage AI for production-quality semantic
 *   embeddings (Anthropic's recommended embedding provider).
 * - Otherwise falls back to a dependency-free local hashing embedding so the
 *   whole RAG pipeline runs with zero external services. The local embedding is
 *   demo-grade: it captures lexical overlap, not deep semantics.
 */

const LOCAL_DIM = 256

export function embeddingsAreLocal(): boolean {
  return !process.env.VOYAGE_API_KEY
}

export async function embed(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return []
  if (process.env.VOYAGE_API_KEY) {
    try {
      return await voyageEmbed(texts)
    } catch (err) {
      console.warn('Voyage embedding failed, falling back to local embedding:', err)
    }
  }
  return texts.map(localEmbed)
}

async function voyageEmbed(texts: string[]): Promise<number[][]> {
  const res = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.VOYAGE_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: texts,
      model: process.env.VOYAGE_MODEL || 'voyage-3',
    }),
  })
  if (!res.ok) throw new Error(`Voyage API ${res.status}: ${await res.text()}`)
  const json = (await res.json()) as { data: { embedding: number[] }[] }
  return json.data.map((d) => d.embedding)
}

/** Deterministic local embedding: hashed bag-of-tokens, L2-normalized. */
function localEmbed(text: string): number[] {
  const vec = new Array<number>(LOCAL_DIM).fill(0)
  const tokens = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2)
  for (const token of tokens) {
    let h = 2166136261
    for (let i = 0; i < token.length; i++) {
      h ^= token.charCodeAt(i)
      h = Math.imul(h, 16777619)
    }
    vec[Math.abs(h) % LOCAL_DIM] += 1
  }
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1
  return vec.map((v) => v / norm)
}

export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1)
}

/** Split a document into overlapping chunks for retrieval. */
export function chunkText(text: string, size = 900, overlap = 150): string[] {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= size) return clean ? [clean] : []
  const chunks: string[] = []
  let start = 0
  while (start < clean.length) {
    chunks.push(clean.slice(start, start + size))
    start += size - overlap
  }
  return chunks
}
