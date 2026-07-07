import { NextResponse } from 'next/server'
import { getKnowledgeBase } from '@/lib/kb'
import type { IngestDoc } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      companyName?: string
      sector?: string
      documents?: IngestDoc[]
    }
    if (!body.companyName || !body.documents?.length) {
      return NextResponse.json({ error: 'companyName and documents are required' }, { status: 400 })
    }

    const kb = getKnowledgeBase()
    const companyId = await kb.ensureCompany(body.companyName, body.sector)
    await kb.ingest(companyId, body.documents)
    const docs = await kb.listDocuments(companyId)

    return NextResponse.json({ backend: kb.backend, companyId, documents: docs })
  } catch (err) {
    console.error('ingest error', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
