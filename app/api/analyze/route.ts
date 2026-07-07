import { NextResponse } from 'next/server'
import { getKnowledgeBase } from '@/lib/kb'
import { analyze, anthropicConfigured } from '@/lib/anthropic'
import { mockMemo } from '@/lib/mock'
import type { AnalyzeResponse } from '@/lib/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// The queries used to pull the most relevant knowledge-base passages for each
// dimension of the memo.
const RETRIEVAL_QUERIES = [
  'system architecture, infrastructure, cloud, vendor dependencies, scaling and cost',
  'data assets, proprietary data, data rights, training data, data moat',
  'AI and machine learning models, evaluation, benchmarks, model quality',
  'security, data handling, compliance, privacy',
  'team, engineering, key-person risk, ownership',
  'business model, revenue, retention, market, product strengths and weaknesses',
]

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      companyId?: string
      companyName?: string
      sector?: string
      dealContext?: string
    }
    if (!body.companyName) {
      return NextResponse.json({ error: 'companyName is required' }, { status: 400 })
    }

    const kb = getKnowledgeBase()
    const companyId = body.companyId || (await kb.ensureCompany(body.companyName, body.sector))

    // Retrieve top passages per dimension, then dedupe.
    const seen = new Set<string>()
    const retrievedContext: string[] = []
    for (const query of RETRIEVAL_QUERIES) {
      const passages = await kb.retrieve(companyId, query, 3)
      for (const p of passages) {
        if (!seen.has(p)) {
          seen.add(p)
          retrievedContext.push(p)
        }
      }
    }

    const source: AnalyzeResponse['source'] = anthropicConfigured() ? 'ai' : 'mock'
    const memo = anthropicConfigured()
      ? await analyze({
          companyName: body.companyName,
          sector: body.sector,
          dealContext: body.dealContext,
          retrievedContext,
        })
      : mockMemo(body.companyName)

    return NextResponse.json({ source, memo, retrievedContext } satisfies AnalyzeResponse)
  } catch (err) {
    console.error('analyze error', err)
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
