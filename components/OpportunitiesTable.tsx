import type { AiOpportunity } from '@/lib/types'
import { RiskBadge } from './RiskBadge'

export function OpportunitiesTable({ opportunities }: { opportunities: AiOpportunity[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-panel-2 text-left text-[0.72rem] uppercase tracking-wider text-faint">
            <th className="px-4 py-3">AI Opportunity</th>
            <th className="px-4 py-3">Value Lever</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Rationale</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((o, i) => (
            <tr key={i} className="border-t border-border align-top">
              <td className="px-4 py-3 font-medium text-white">{o.opportunity}</td>
              <td className="px-4 py-3 text-dim">{o.valueLever}</td>
              <td className="px-4 py-3">
                <RiskBadge level={o.priority} />
              </td>
              <td className="px-4 py-3 text-dim">{o.rationale}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
