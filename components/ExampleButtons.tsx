'use client'

import { EXAMPLES, type ExampleCompany } from '@/lib/examples'

export function ExampleButtons({ onPick }: { onPick: (example: ExampleCompany) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXAMPLES.map((ex) => (
        <button key={ex.id} type="button" className="btn btn-ghost text-sm" onClick={() => onPick(ex)}>
          Load example: {ex.name}
        </button>
      ))}
    </div>
  )
}
