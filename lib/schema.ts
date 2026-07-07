import { z } from 'zod'

const RiskLevel = z.enum(['Low', 'Medium', 'High'])
const Priority = z.enum(['Low', 'Medium', 'High'])

export const FindingSchema = z.object({
  area: z
    .string()
    .describe('Diligence area, e.g. Architecture, Data, AI Model, Security, Scalability, Team, IP.'),
  finding: z.string().describe('The specific finding for this area.'),
  riskLevel: RiskLevel,
  evidence: z
    .string()
    .describe('The concrete evidence from the provided knowledge base that supports this finding.'),
  followUpQuestion: z
    .string()
    .describe('The single most important follow-up question to put to management or counsel.'),
})

export const AiOpportunitySchema = z.object({
  opportunity: z.string().describe('A concrete AI workflow or capability the business should pursue.'),
  valueLever: z
    .string()
    .describe('The value lever it drives, e.g. revenue growth, cost/ops efficiency, retention, risk reduction.'),
  priority: Priority,
  rationale: z.string().describe('Why this is the right move for this specific business.'),
})

export const RollupFitSchema = z.object({
  platformReadiness: RiskLevel.describe(
    'How ready this target is to serve as a platform (High = strong platform candidate).',
  ),
  integrationRisk: RiskLevel.describe('Risk of integrating this target into a portfolio platform.'),
  techConsolidation: RiskLevel.describe(
    'How cleanly the tech stack consolidates with other portfolio companies (High = consolidates cleanly).',
  ),
  notes: z.string().describe('Buy-and-build assessment: platform vs bolt-on, and integration considerations.'),
})

export const MemoSchema = z.object({
  companyName: z.string(),
  executiveSummary: z.string().describe('2-4 sentences a partner can read in the investment committee.'),
  overallRisk: RiskLevel,
  recommendation: z
    .string()
    .describe('A crisp recommendation, e.g. "Proceed to confirmatory diligence", "Proceed with conditions", "Pass".'),
  strengths: z.array(z.string()).describe('The business and technical strengths.'),
  weaknesses: z.array(z.string()).describe('The business and technical weaknesses and gaps.'),
  findings: z.array(FindingSchema),
  aiOpportunities: z
    .array(AiOpportunitySchema)
    .describe('The best AI path forward for this business, prioritized. Especially important when the target does not yet know how to use AI.'),
  rollupFit: RollupFitSchema,
  keyRisks: z.array(z.string()),
})

export type MemoSchemaType = z.infer<typeof MemoSchema>
