import type { Memo } from './types'

/**
 * High-quality sample memo returned when ANTHROPIC_API_KEY is not set, so the
 * demo always works. Modeled on a mid-market AI-enabled B2B SaaS target.
 */
export function mockMemo(companyName: string): Memo {
  const name = companyName || 'Target Co.'
  return {
    companyName: name,
    executiveSummary: `${name} is a growing B2B SaaS business with real proprietary workflow data and strong customer retention, but its AI capability is early and under-instrumented. The core product is solid; the AI roadmap is opportunistic rather than deliberate. As a platform for an AI roll-up the target is a credible base, provided the data moat is formalized and an evaluation and infrastructure discipline is put in place in the first 100 days.`,
    overallRisk: 'Medium',
    recommendation: 'Proceed to confirmatory diligence, with conditions on data rights and AI evaluation.',
    strengths: [
      'Sticky product with high logo retention and multi-year contracts, indicating durable demand.',
      'Proprietary workflow and outcome data accumulated across the customer base — a genuine, defensible asset if rights are clear.',
      'Clean, modern application stack that a portfolio platform could integrate without a rewrite.',
    ],
    weaknesses: [
      'AI features are bolted on without an evaluation framework, so model quality is asserted, not measured.',
      'Heavy dependence on a single cloud vendor for inference with no cost governance.',
      'No formal data-rights position on customer data used to train or tune models.',
      'Thin senior ML bench — key-person risk around one lead engineer.',
    ],
    findings: [
      {
        area: 'Architecture',
        finding: 'Heavy vendor lock-in',
        riskLevel: 'Medium',
        evidence: 'AWS-only inference stack; Bedrock and SageMaker referenced throughout the architecture notes with no abstraction layer.',
        followUpQuestion: 'What is the monthly inference and infrastructure cost, and how does it scale with usage?',
      },
      {
        area: 'Data',
        finding: 'No clear data moat',
        riskLevel: 'High',
        evidence: 'Model training described as using public datasets only; no documented use or rights over proprietary customer data.',
        followUpQuestion: 'What proprietary data exists, and do the customer contracts grant rights to use it for model training?',
      },
      {
        area: 'AI Model',
        finding: 'No evaluation framework',
        riskLevel: 'High',
        evidence: 'No benchmarks, offline eval sets, or quality metrics shown in any provided material.',
        followUpQuestion: 'How is model quality measured today, and what would a regression look like in production?',
      },
      {
        area: 'Security',
        finding: 'Undocumented data handling for AI features',
        riskLevel: 'Medium',
        evidence: 'No data-flow diagram or DPA references for prompts and outputs passing through third-party model APIs.',
        followUpQuestion: 'Where does customer data go when an AI feature runs, and which sub-processors see it?',
      },
      {
        area: 'Team',
        finding: 'Key-person risk on ML',
        riskLevel: 'Medium',
        evidence: 'AI work concentrated with one lead engineer per the org and product notes; no second owner named.',
        followUpQuestion: 'What is the retention and succession plan for the lead ML engineer?',
      },
    ],
    aiOpportunities: [
      {
        opportunity: 'Turn accumulated workflow data into a proprietary model advantage',
        valueLever: 'Durable moat / pricing power',
        priority: 'High',
        rationale: 'The retention data suggests a real proprietary corpus; formalizing rights and fine-tuning on it would create defensibility the current public-data approach lacks.',
      },
      {
        opportunity: 'Automate the highest-volume manual customer workflow with an LLM copilot',
        valueLever: 'Cost / ops efficiency',
        priority: 'High',
        rationale: 'A high-frequency, low-risk workflow is the fastest path to measurable operating leverage in the first 100 days.',
      },
      {
        opportunity: 'Stand up an evaluation and monitoring harness before scaling AI features',
        valueLever: 'Risk reduction',
        priority: 'Medium',
        rationale: 'Without measurement, further AI investment is unquantified risk; an eval harness de-risks the roadmap and the deal thesis.',
      },
    ],
    rollupFit: {
      platformReadiness: 'Medium',
      integrationRisk: 'Low',
      techConsolidation: 'High',
      notes: 'Credible platform base rather than a pure bolt-on: the modern stack consolidates cleanly with other portfolio companies, and shared AI infrastructure (eval, inference governance, a common data layer) could be built once and reused across add-ons. Platform readiness is gated on formalizing data rights and installing AI discipline.',
    },
    keyRisks: [
      'Customer-data rights may not permit the model training the value thesis assumes.',
      'Unmeasured model quality could degrade silently as usage scales.',
      'Concentrated inference spend with no cost controls pressures gross margin.',
    ],
  }
}
