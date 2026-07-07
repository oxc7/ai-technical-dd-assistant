export type RiskLevel = 'Low' | 'Medium' | 'High'
export type Priority = 'Low' | 'Medium' | 'High'
export type DocumentKind = 'technical' | 'business' | 'other'

export type IngestDoc = {
  title: string
  kind: DocumentKind
  content: string
}

export type Finding = {
  area: string
  finding: string
  riskLevel: RiskLevel
  evidence: string
  followUpQuestion: string
}

export type AiOpportunity = {
  opportunity: string
  valueLever: string
  priority: Priority
  rationale: string
}

export type RollupFit = {
  platformReadiness: RiskLevel
  integrationRisk: RiskLevel
  techConsolidation: RiskLevel
  notes: string
}

export type Memo = {
  companyName: string
  executiveSummary: string
  overallRisk: RiskLevel
  recommendation: string
  strengths: string[]
  weaknesses: string[]
  findings: Finding[]
  aiOpportunities: AiOpportunity[]
  rollupFit: RollupFit
  keyRisks: string[]
}

export type AnalyzeResponse = {
  source: 'ai' | 'mock'
  memo: Memo
  retrievedContext: string[]
}
