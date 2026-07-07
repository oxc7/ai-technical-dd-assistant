export function RiskBadge({ level }: { level: string }) {
  const l = level.toLowerCase()
  const cls = l === 'high' ? 'badge-high' : l === 'medium' ? 'badge-med' : 'badge-low'
  return <span className={`badge ${cls}`}>{level}</span>
}
