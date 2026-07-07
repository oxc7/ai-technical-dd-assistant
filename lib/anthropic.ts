import Anthropic from '@anthropic-ai/sdk'
import { MemoSchema } from './schema'
import { SYSTEM_INSTRUCTIONS, buildAnalysisPrompt } from './prompt'
import type { Memo } from './types'

const RISK = { type: 'string', enum: ['Low', 'Medium', 'High'] } as const

/**
 * JSON schema for the memo, used as a strict tool so Claude returns validated,
 * parseable structured output. Forced tool-use is the most reliable structured-
 * output path across SDK/model versions.
 */
const MEMO_TOOL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: [
    'companyName',
    'executiveSummary',
    'overallRisk',
    'recommendation',
    'strengths',
    'weaknesses',
    'findings',
    'aiOpportunities',
    'rollupFit',
    'keyRisks',
  ],
  properties: {
    companyName: { type: 'string' },
    executiveSummary: { type: 'string' },
    overallRisk: RISK,
    recommendation: { type: 'string' },
    strengths: { type: 'array', items: { type: 'string' } },
    weaknesses: { type: 'array', items: { type: 'string' } },
    findings: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['area', 'finding', 'riskLevel', 'evidence', 'followUpQuestion'],
        properties: {
          area: { type: 'string' },
          finding: { type: 'string' },
          riskLevel: RISK,
          evidence: { type: 'string' },
          followUpQuestion: { type: 'string' },
        },
      },
    },
    aiOpportunities: {
      type: 'array',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['opportunity', 'valueLever', 'priority', 'rationale'],
        properties: {
          opportunity: { type: 'string' },
          valueLever: { type: 'string' },
          priority: RISK,
          rationale: { type: 'string' },
        },
      },
    },
    rollupFit: {
      type: 'object',
      additionalProperties: false,
      required: ['platformReadiness', 'integrationRisk', 'techConsolidation', 'notes'],
      properties: {
        platformReadiness: RISK,
        integrationRisk: RISK,
        techConsolidation: RISK,
        notes: { type: 'string' },
      },
    },
    keyRisks: { type: 'array', items: { type: 'string' } },
  },
} as const

export function anthropicConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}

export async function analyze(input: {
  companyName: string
  sector?: string
  dealContext?: string
  retrievedContext: string[]
}): Promise<Memo> {
  const client = new Anthropic()
  const response = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-opus-4-8',
    max_tokens: 16000,
    system: SYSTEM_INSTRUCTIONS,
    tools: [
      {
        name: 'emit_diligence_memo',
        description: 'Emit the completed technical due-diligence memo as structured data.',
        input_schema: MEMO_TOOL_SCHEMA as unknown as Anthropic.Tool.InputSchema,
        strict: true,
      },
    ],
    tool_choice: { type: 'tool', name: 'emit_diligence_memo' },
    messages: [{ role: 'user', content: buildAnalysisPrompt(input) }],
  })

  const block = response.content.find((b) => b.type === 'tool_use')
  if (!block || block.type !== 'tool_use') {
    throw new Error('Model did not return a structured memo')
  }
  // zod validates and narrows the model output to our Memo type.
  return MemoSchema.parse(block.input)
}
