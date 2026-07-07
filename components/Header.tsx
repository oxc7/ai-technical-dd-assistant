export function Header({ backend, source }: { backend?: string; source?: string }) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Technical Due Diligence Assistant
          </h1>
          <p className="mt-2 max-w-2xl text-dim">
            Ingest a target&rsquo;s technical and business information into a knowledge base, then
            generate a grounded diligence memo: findings, strengths and weaknesses, the best AI path
            forward, and roll-up fit.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 text-xs text-faint">
          {backend && (
            <span>
              KB: <span className="text-accent-2">{backend === 'postgres' ? 'Postgres + pgvector' : 'in-memory'}</span>
            </span>
          )}
          {source && (
            <span>
              LLM: <span className="text-accent-2">{source === 'ai' ? 'Claude (live)' : 'mock (no API key)'}</span>
            </span>
          )}
        </div>
      </div>
    </header>
  )
}
