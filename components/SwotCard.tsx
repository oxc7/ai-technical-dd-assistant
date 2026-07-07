export function SwotCard({ strengths, weaknesses }: { strengths: string[]; weaknesses: string[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="card p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent-2">Strengths</h3>
        <ul className="space-y-2 text-sm text-dim">
          {strengths.map((s, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-accent-2">+</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="card p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#ff9a9a]">Weaknesses</h3>
        <ul className="space-y-2 text-sm text-dim">
          {weaknesses.map((w, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#ff9a9a]">–</span>
              <span>{w}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
