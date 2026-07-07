'use client'

import { useState } from 'react'
import type { AnalyzeResponse, DocumentKind, IngestDoc } from '@/lib/types'
import type { StoredDoc } from '@/lib/kb/interface'
import type { ExampleCompany } from '@/lib/examples'
import { Header } from '@/components/Header'
import { ExampleButtons } from '@/components/ExampleButtons'
import { EmptyState } from '@/components/EmptyState'
import { MemoView } from '@/components/MemoView'

type KbInfo = { backend: string; companyId: string; documents: StoredDoc[] }

const KIND_LABELS: Record<DocumentKind, string> = {
  technical: 'Technical',
  business: 'Business',
  other: 'Other',
}

export default function Home() {
  const [companyName, setCompanyName] = useState('')
  const [sector, setSector] = useState('')
  const [dealContext, setDealContext] = useState('')
  const [docs, setDocs] = useState<IngestDoc[]>([])

  const [draftTitle, setDraftTitle] = useState('')
  const [draftKind, setDraftKind] = useState<DocumentKind>('technical')
  const [draftContent, setDraftContent] = useState('')

  const [kbInfo, setKbInfo] = useState<KbInfo | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addDraft() {
    if (!draftTitle.trim() || !draftContent.trim()) return
    setDocs((d) => [...d, { title: draftTitle.trim(), kind: draftKind, content: draftContent.trim() }])
    setDraftTitle('')
    setDraftContent('')
    setKbInfo(null)
  }

  function removeDoc(i: number) {
    setDocs((d) => d.filter((_, idx) => idx !== i))
    setKbInfo(null)
  }

  function loadExample(ex: ExampleCompany) {
    setCompanyName(ex.name)
    setSector(ex.sector)
    setDealContext(ex.dealContext)
    setDocs(ex.documents)
    setKbInfo(null)
    setResult(null)
    setError(null)
  }

  async function ingest(): Promise<KbInfo | null> {
    const res = await fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName, sector, documents: docs }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Ingest failed')
    const info: KbInfo = { backend: json.backend, companyId: json.companyId, documents: json.documents }
    setKbInfo(info)
    return info
  }

  async function generate() {
    setError(null)
    if (!companyName.trim()) {
      setError('Enter a company name.')
      return
    }
    setBusy(true)
    try {
      let info = kbInfo
      if (!info && docs.length > 0) info = await ingest()
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: info?.companyId,
          companyName,
          sector,
          dealContext,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Analysis failed')
      setResult(json as AnalyzeResponse)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
      <Header backend={kbInfo?.backend} source={result?.source} />

      <div className="mb-6">
        <ExampleButtons onPick={loadExample} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Intake column */}
        <div className="space-y-4">
          <div className="card space-y-3 p-5">
            <h2 className="font-serif text-lg font-semibold">Target</h2>
            <input
              className="input"
              placeholder="Company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              className="input"
              placeholder="Sector (optional)"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            />
            <textarea
              className="input"
              placeholder="Deal context (optional) — e.g. platform candidate for an AI roll-up"
              rows={2}
              value={dealContext}
              onChange={(e) => setDealContext(e.target.value)}
            />
          </div>

          <div className="card space-y-3 p-5">
            <h2 className="font-serif text-lg font-semibold">Knowledge base</h2>
            <p className="text-sm text-dim">
              Add any information you have — technical or non-technical. It is chunked, embedded, and
              retrieved to ground the memo.
            </p>

            {docs.length > 0 && (
              <ul className="space-y-2">
                {docs.map((d, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between rounded-lg border border-border bg-panel px-3 py-2 text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span className="badge badge-low">{KIND_LABELS[d.kind]}</span>
                      <span className="text-white">{d.title}</span>
                      <span className="text-faint">· {d.content.length} chars</span>
                    </span>
                    <button className="text-faint hover:text-white" onClick={() => removeDoc(i)}>
                      remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-2 border-t border-border pt-3">
              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="Document title"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                />
                <select
                  className="input max-w-[140px]"
                  value={draftKind}
                  onChange={(e) => setDraftKind(e.target.value as DocumentKind)}
                >
                  <option value="technical">Technical</option>
                  <option value="business">Business</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <textarea
                className="input"
                placeholder="Paste architecture notes, GitHub summary, product docs, website text, commercials…"
                rows={5}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
              />
              <button className="btn btn-ghost text-sm" onClick={addDraft}>
                + Add to knowledge base
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="btn btn-primary" onClick={generate} disabled={busy}>
              {busy ? 'Analyzing…' : 'Generate diligence memo'}
            </button>
            {kbInfo && (
              <span className="text-xs text-faint">
                {kbInfo.documents.length} docs in KB ({kbInfo.backend})
              </span>
            )}
          </div>
          {error && <p className="text-sm text-[#ff9a9a]">{error}</p>}
        </div>

        {/* Output column */}
        <div>{result ? <MemoView result={result} /> : <EmptyState />}</div>
      </div>

      <footer className="mt-12 border-t border-border pt-6 text-xs text-faint">
        An early-stage screen to focus confirmatory diligence and value-creation planning. Not a
        substitute for confirmatory technical, legal, or financial diligence.
      </footer>
    </main>
  )
}
