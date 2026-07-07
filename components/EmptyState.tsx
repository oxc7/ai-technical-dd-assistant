export function EmptyState() {
  return (
    <div className="card flex h-full min-h-[320px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-3 text-3xl">📊</div>
      <h3 className="font-serif text-lg font-semibold">No memo yet</h3>
      <p className="mt-2 max-w-sm text-sm text-dim">
        Add the target&rsquo;s documents to the knowledge base, then generate a grounded diligence
        memo. Load an example to see the full output.
      </p>
    </div>
  )
}
