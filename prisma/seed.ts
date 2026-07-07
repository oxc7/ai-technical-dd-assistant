/**
 * Seeds the Postgres knowledge base with the sample companies. Requires
 * DATABASE_URL and a migrated database. Run: npm run seed
 */
import { getKnowledgeBase } from '../lib/kb'
import { EXAMPLES } from '../lib/examples'

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set — nothing to seed (the in-memory KB needs no seeding).')
    process.exit(1)
  }
  const kb = getKnowledgeBase()
  for (const example of EXAMPLES) {
    const companyId = await kb.ensureCompany(example.name, example.sector)
    await kb.ingest(companyId, example.documents)
    console.log(`Seeded ${example.name} (${example.documents.length} documents).`)
  }
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
