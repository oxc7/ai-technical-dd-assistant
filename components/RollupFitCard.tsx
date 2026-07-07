import type { RollupFit } from '@/lib/types'
import { RiskBadge } from './RiskBadge'

export function RollupFitCard({ fit }: { fit: RollupFit }) {
  const metrics = [
    { label: 'Platform readiness', value: fit.platformReadiness },
    { label: 'Integration risk', value: fit.integrationRisk },
    { label: 'Tech consolidation', value: fit.techConsolidation },
  ]
  return (
    <div className="card p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent-2">
        Roll-up / Buy-and-build Fit
      </h3>
      <div className="mb-4 flex flex-wrap gap-3">
        {metrics.map((m) => (
          <div key={m.label} className="flex items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2">
            <span className="text-xs text-faint">{m.label}</span>
            <RiskBadge level={m.value} />
          </div>
        ))}
      </div>
      <p className="text-sm text-dim">{fit.notes}</p>
    </div>
  )
}
