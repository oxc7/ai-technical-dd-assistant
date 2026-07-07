import type { DocumentKind } from './types'

export type ExampleCompany = {
  id: string
  name: string
  sector: string
  dealContext: string
  documents: { title: string; kind: DocumentKind; content: string }[]
}

export const EXAMPLES: ExampleCompany[] = [
  {
    id: 'fielddesk',
    name: 'FieldDesk',
    sector: 'Vertical B2B SaaS (field services)',
    dealContext: 'Platform candidate for a field-services software roll-up. $14M ARR, ~120% net revenue retention.',
    documents: [
      {
        title: 'Architecture overview',
        kind: 'technical',
        content:
          'FieldDesk is a multi-tenant Next.js + Node monolith on AWS. Data in Postgres (RDS). AI features (job summarization, smart scheduling suggestions) call AWS Bedrock directly from the API layer with no abstraction. Inference is AWS-only. There is no offline evaluation of model outputs; quality is judged anecdotally by the product team. Prompts and job data are sent to the model API without a documented data-flow diagram.',
      },
      {
        title: 'Data & model notes',
        kind: 'technical',
        content:
          'Models are used off-the-shelf. Any tuning is on public datasets. FieldDesk has 6 years of scheduling and job-outcome data across 900 customers, but it is not currently used for training. There is no written position on whether customer contracts permit using this data for model training.',
      },
      {
        title: 'Company & commercial summary',
        kind: 'business',
        content:
          '$14M ARR growing 30% YoY. 900 customers, logo retention 94%, net revenue retention ~120%. Pricing is seat-based. The founders want to "do more with AI" but do not have a roadmap. One lead engineer owns all AI work. Sales cite scheduling automation as the top requested feature.',
      },
    ],
  },
  {
    id: 'ledgerloop',
    name: 'LedgerLoop',
    sector: 'Fintech / accounting automation',
    dealContext: 'Potential bolt-on to an accounting-software platform. Founder-led, pre-institutional.',
    documents: [
      {
        title: 'Product & tech snapshot',
        kind: 'technical',
        content:
          'LedgerLoop automates invoice capture and reconciliation. Python/FastAPI backend, React frontend, Postgres. Uses an OpenAI model for document extraction with a hand-built rules layer on top. Extraction accuracy is tracked on a 500-invoice labeled test set updated quarterly — a real evaluation loop. Infra is on GCP. SOC 2 Type II in progress.',
      },
      {
        title: 'Commercial & team',
        kind: 'business',
        content:
          '$4M ARR, 60% YoY growth, gross margin 78%. Two ML engineers plus a founder-CTO. Customer data is governed by a DPA that permits aggregate, de-identified model improvement. Main risk cited by the team is dependence on a single model vendor for extraction.',
      },
    ],
  },
]
