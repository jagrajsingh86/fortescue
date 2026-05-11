import type { Pillar } from "@/types/assessment";
import { pillarAccents } from "./theme";

export const PILLARS: Pillar[] = [
  {
    id: "people",
    num: "01",
    name: "People & Culture",
    accent: pillarAccents[0],
    questions: [
      {
        q: "How does your organisation approach AI literacy and upskilling?",
        options: [
          { text: "No formal AI training. Staff learn ad hoc or not at all.", score: 1 },
          { text: "Targeted training for technical teams only.", score: 3 },
          { text: "AI literacy modules rolling out to selected business functions.", score: 5 },
          { text: "Structured AI literacy programme rolling out to all employees.", score: 7 },
          { text: "Continuous learning with AI copilots embedded in everyday workflows.", score: 10 },
        ],
      },
      {
        q: "How do humans and AI agents collaborate today?",
        options: [
          { text: "Humans work independently. AI is rarely used.", score: 1 },
          { text: "Some teams use AI as an individual productivity tool.", score: 3 },
          { text: "Cross-functional teams pilot human-in-the-loop AI workflows.", score: 5 },
          { text: "Policies define how humans and AI divide decisions and share accountability.", score: 7 },
          { text: "Distributed human-agent teams reconfigure dynamically as conditions change.", score: 10 },
        ],
      },
      {
        q: "How do you measure employee experience and psychological safety?",
        options: [
          { text: "No formal measurement.", score: 1 },
          { text: "Annual engagement surveys.", score: 3 },
          { text: "Quarterly surveys with team-level dashboards.", score: 5 },
          { text: "Weekly pulse surveys with team-level safety metrics.", score: 7 },
          { text: "Real-time signals linked to innovation and value outcomes.", score: 10 },
        ],
      },
    ],
  },
  {
    id: "process",
    num: "02",
    name: "Process & Governance",
    accent: pillarAccents[1],
    questions: [
      {
        q: "How mature is your AI governance?",
        options: [
          { text: "No formal AI governance in place.", score: 1 },
          { text: "Basic policies emerging. Ownership is unclear.", score: 3 },
          { text: "Defined governance forum reviewing high-risk use cases.", score: 5 },
          { text: "Formal policies, ownership, and audit trails covering model risk and bias.", score: 7 },
          { text: "Distributed governance that adapts in real time to market and business needs.", score: 10 },
        ],
      },
      {
        q: "How do you handle compliance and regulatory reporting?",
        options: [
          { text: "Manual, periodic reporting.", score: 1 },
          { text: "Partially automated, with significant human review.", score: 3 },
          { text: "Workflow automation covering core obligations.", score: 5 },
          { text: "RegTech automation flagging exposures in real time.", score: 7 },
          { text: "Risk-weighted automation with proactive, value-based decisioning.", score: 10 },
        ],
      },
      {
        q: "How is sustainability instrumented across the business?",
        options: [
          { text: "Not measured or reported.", score: 1 },
          { text: "Periodic manual reporting against high-level targets.", score: 3 },
          { text: "Scope 1 and 2 captured through dedicated systems.", score: 5 },
          { text: "Systems emit Scope 1, 2, and 3 data automatically.", score: 7 },
          { text: "Sustainable thinking integrated at every level of tech, product, and governance.", score: 10 },
        ],
      },
    ],
  },
  {
    id: "ai",
    num: "03",
    name: "AI Capabilities",
    accent: pillarAccents[2],
    questions: [
      {
        q: "What level of AI capability is deployed across the business?",
        options: [
          { text: "No production AI capabilities.", score: 1 },
          { text: "Individual copilots and assistants for some roles.", score: 3 },
          { text: "Production GenAI workflows in two or more business domains.", score: 5 },
          { text: "Agentic AI that learns, decides, negotiates, and transacts.", score: 7 },
          { text: "Curated agent marketplace with autonomous machine-to-machine activity.", score: 10 },
        ],
      },
      {
        q: "How do you manage AI safety, drift, and observability?",
        options: [
          { text: "No structured safety testing or monitoring.", score: 1 },
          { text: "Manual reviews before deployment; limited post-launch monitoring.", score: 3 },
          { text: "Evaluation harnesses run pre-release; basic production logging.", score: 5 },
          { text: "Red teaming plus observability tracking drift with human-readable explanations.", score: 7 },
          { text: "Continuous automated safety with policy pattern management across SLMs and LLMs.", score: 10 },
        ],
      },
      {
        q: "How are AI systems integrated with the rest of the enterprise?",
        options: [
          { text: "AI runs in isolation. Point solutions only.", score: 1 },
          { text: "Ad hoc API integrations into a few systems.", score: 3 },
          { text: "Reusable AI services exposed through an internal platform.", score: 5 },
          { text: "APIs exposed via MCP and Agent-to-Agent (A2A) standards.", score: 7 },
          { text: "Full AI orchestration across multimodal inputs, models, and workflows.", score: 10 },
        ],
      },
    ],
  },
  {
    id: "data",
    num: "04",
    name: "Data",
    accent: pillarAccents[3],
    questions: [
      {
        q: "How is data treated in the organisation?",
        options: [
          { text: "Data is a by-product of systems, not actively managed.", score: 1 },
          { text: "Data-first strategy emerging. Trust still being built.", score: 3 },
          { text: "Defined data domains with owners and quality metrics.", score: 5 },
          { text: "Data treated as a product, generating valuable insights.", score: 7 },
          { text: "Live data marketplace enabling secure exchange and monetisation.", score: 10 },
        ],
      },
      {
        q: "How accessible is data across business units?",
        options: [
          { text: "Heavily siloed by system and team.", score: 1 },
          { text: "Point integrations between key systems.", score: 3 },
          { text: "Central warehouse or lakehouse curated for analytics.", score: 5 },
          { text: "Unified data fabric virtualising disparate systems for self-service.", score: 7 },
          { text: "Fully democratised with guardrails enabling safe ideation and execution.", score: 10 },
        ],
      },
      {
        q: "How are data contracts and privacy handled?",
        options: [
          { text: "No formal contracts or privacy-enhancing technology.", score: 1 },
          { text: "Basic agreements between teams; manual privacy reviews.", score: 3 },
          { text: "Documented schemas and data classification policies enforced at ingestion.", score: 5 },
          { text: "Versioned data contracts defining schema, SLAs, and quality.", score: 7 },
          { text: "Federated learning, differential privacy, and homomorphic encryption in use.", score: 10 },
        ],
      },
    ],
  },
  {
    id: "tech",
    num: "05",
    name: "Technology",
    accent: pillarAccents[4],
    questions: [
      {
        q: "How modernised is the technology stack?",
        options: [
          { text: "Predominantly legacy monolithic systems.", score: 1 },
          { text: "Modernisation in flight. Reusable patterns emerging.", score: 3 },
          { text: "Cloud-native services with CI/CD for most workloads.", score: 5 },
          { text: "Composable architecture with modular, policy-controlled design.", score: 7 },
          { text: "Edge and sovereign cloud processing addressing latency and residency.", score: 10 },
        ],
      },
      {
        q: "What is the security posture?",
        options: [
          { text: "Perimeter-based security only.", score: 1 },
          { text: "Zero trust policies forming.", score: 3 },
          { text: "Identity-led access, MFA everywhere, and active threat detection.", score: 5 },
          { text: "Continuous threat exposure management with self-optimising analysis.", score: 7 },
          { text: "Quantum-safe cryptography in place for post-quantum threats.", score: 10 },
        ],
      },
      {
        q: "How mature is platform engineering and observability?",
        options: [
          { text: "Developers manage their own infrastructure individually.", score: 1 },
          { text: "Some shared platforms and tooling exist.", score: 3 },
          { text: "Defined platform team operating common services with paved roads.", score: 5 },
          { text: "Internal developer platform with golden paths and self-serve.", score: 7 },
          { text: "eBPF-grade observability with smart, self-healing operations.", score: 10 },
        ],
      },
    ],
  },
];
