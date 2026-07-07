import type { AnalyzeResponse } from '@/lib/types'
import { RiskBadge } from './RiskBadge'
import { FindingsTable } from './FindingsTable'
import { SwotCard } from './SwotCard'
import { OpportunitiesTable } from './OpportunitiesTable'
import { RollupFitCard } from './RollupFitCard'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 font-serif text-xl font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export function MemoView({ result }: { result: AnalyzeResponse }) {
  const { memo, source, retrievedContext } = result
  return (
    <div>
      <div className="card p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wider text-faint">Diligence memo</p>
            <h2 className="font-serif text-2xl font-semibold">{memo.companyName}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-faint">Overall risk</span>
            <RiskBadge level={memo.overallRisk} />
          </div>
        </div>
        <p className="mt-4 text-dim">{memo.executiveSummary}</p>
        <div className="mt-4 rounded-lg border border-border bg-panel px-4 py-3 text-sm">
          <span className="text-faint">Recommendation: </span>
          <span className="font-medium text-white">{memo.recommendation}</span>
        </div>
        {source === 'mock' && (
          <p className="mt-4 text-xs text-faint">
            Sample output (no API key set). Configure ANTHROPIC_API_KEY for live, knowledge-base-grounded analysis.
          </p>
        )}
      </div>

      <Section title="Strengths & weaknesses">
        <SwotCard strengths={memo.strengths} weaknesses={memo.weaknesses} />
      </Section>

      <Section title="Findings">
        <FindingsTable findings={memo.findings} />
      </Section>

      <Section title="Best AI path forward">
        <OpportunitiesTable opportunities={memo.aiOpportunities} />
      </Section>

      <Section title="Roll-up fit">
        <RollupFitCard fit={memo.rollupFit} />
      </Section>

      <Section title="Key risks">
        <ul className="card space-y-2 p-5 text-sm text-dim">
          {memo.keyRisks.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#ff9a9a]">!</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </Section>

      {retrievedContext.length > 0 && (
        <Section title="Retrieved knowledge-base context">
          <details className="card p-5 text-sm text-dim">
            <summary className="cursor-pointer text-faint">
              {retrievedContext.length} passages grounded this memo (click to view)
            </summary>
            <ol className="mt-3 space-y-3">
              {retrievedContext.map((c, i) => (
                <li key={i} className="border-l-2 border-border pl-3">
                  {c}
                </li>
              ))}
            </ol>
          </details>
        </Section>
      )}
    </div>
  )
}
