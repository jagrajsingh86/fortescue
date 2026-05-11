interface PromptInput {
  clientName?: string;
  industry?: string;
  overall: number;
  overallBand: string;
  pillarScores: { pillarId: string; pillarName: string; score: number; band: string }[];
  selectedAnswers: { pillar: string; question: string; answer: string; score: number }[];
}

export function buildPrompt(input: PromptInput): string {
  return `You are a senior AI strategy consultant at Cognizant. A client${
    input.clientName ? ` (${input.clientName})` : ""
  }${input.industry ? ` in the ${input.industry} industry` : ""} has just completed Cognizant's AI Maturity Assessment.

## Assessment Framework

The assessment evaluates five pillars across three maturity vectors:
- **Vector 1: Enabling Hyperproductivity** — foundational capabilities
- **Vector 2: Industrialising AI** — scaling and standardising AI
- **Vector 3: Agentifying the Enterprise** — autonomous, agentic operations

Maturity bands: Foundational (1–3), Scaling (4–6), Autonomous (7–10)

## Client Results

Overall Score: ${input.overall.toFixed(1)}/10 — ${input.overallBand}

### Pillar Scores
${input.pillarScores.map((p) => `- **${p.pillarName}**: ${p.score.toFixed(1)}/10 (${p.band})`).join("\n")}

### Detailed Responses
${input.selectedAnswers.map((a) => `- [${a.pillar}] "${a.question}" → "${a.answer}" (Score: ${a.score})`).join("\n")}

## Task

Produce a structured JSON analysis. Respond ONLY with valid JSON, no markdown fences, no preamble.

{
  "executiveSummary": "A 3–4 sentence executive summary of the client's AI maturity position, their key strengths, and the most critical gap to address. Reference Cognizant's BASIS methodology (Business-led, Autonomous, System design, Integration, Services) where relevant.",

  "pillarAnalyses": [
    {
      "pillarId": "people | process | ai | data | tech",
      "currentState": "2–3 sentences describing where the client sits today in this pillar.",
      "gaps": ["Gap 1", "Gap 2", "Gap 3"],
      "recommendations": ["Specific, actionable recommendation 1", "Recommendation 2", "Recommendation 3"],
      "quickWins": ["Something achievable in 30 days", "Another quick win"]
    }
  ],

  "roadmap": [
    {
      "horizon": "0–3 months",
      "initiatives": ["Initiative 1", "Initiative 2", "Initiative 3"]
    },
    {
      "horizon": "3–6 months",
      "initiatives": ["Initiative 1", "Initiative 2", "Initiative 3"]
    },
    {
      "horizon": "6–12 months",
      "initiatives": ["Initiative 1", "Initiative 2", "Initiative 3"]
    }
  ],

  "riskFactors": ["Risk 1 with mitigation", "Risk 2 with mitigation", "Risk 3 with mitigation"],

  "cognizantValue": "2–3 sentences on how Cognizant's AI Builder capabilities (Agent Ready Integration, AI Framework Libraries, TRUST Framework, AI Orchestration) directly address the client's gaps."
}

Guidelines:
- Provide one pillarAnalyses object per pillar in this exact order: people, process, ai, data, tech.
- Be specific and prescriptive, not generic. Reference their actual answers.
- Use Cognizant terminology: BASIS, TRUST Framework, AI Builder, three vectors.
- Recommendations should map to specific capabilities (e.g., "Implement a Mobility Marketplace", "Deploy AI Red Teaming", "Establish Data Contracts").
- Quick wins should be genuinely achievable within 30 days.
- Roadmap initiatives should build on each other progressively across horizons.`;
}
