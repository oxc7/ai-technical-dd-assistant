import type { Finding } from '@/lib/types'
import { RiskBadge } from './RiskBadge'

export function FindingsTable({ findings }: { findings: Finding[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="bg-panel-2 text-left text-[0.72rem] uppercase tracking-wider text-faint">
            <th className="px-4 py-3">Area</th>
            <th className="px-4 py-3">Finding</th>
            <th className="px-4 py-3">Risk</th>
            <th className="px-4 py-3">Evidence</th>
            <th className="px-4 py-3">Follow-up Question</th>
          </tr>
        </thead>
        <tbody>
          {findings.map((f, i) => (
            <tr key={i} className="border-t border-border align-top">
              <td className="px-4 py-3 font-medium text-white">{f.area}</td>
              <td className="px-4 py-3 text-dim">{f.finding}</td>
              <td className="px-4 py-3">
                <RiskBadge level={f.riskLevel} />
              </td>
              <td className="px-4 py-3 text-dim">{f.evidence}</td>
              <td className="px-4 py-3 text-dim">{f.followUpQuestion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
