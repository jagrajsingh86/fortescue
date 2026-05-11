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
        q: "How does your organisation develop AI skills and talent?",
        options: [
          { text: "No formal AI training or development programmes exist.", score: 1 },
          {
            text: "Ad-hoc training available for technical teams only, talent grown through informal learning.",
            score: 3,
          },
          {
            text: "Structured AI Literacy Programme for all employees — not just technologists — with Communities of Practice as SME innovation conduits into the Architecture Review Board.",
            score: 5,
          },
          {
            text: "Employee Experience managed through weekly pulse surveys for proactive response, with value-aligned structures measuring business value drivers across journey flows.",
            score: 7,
          },
          {
            text: "Human/AI Teaming models define how humans and agents divide decisions, escalate and share accountability.",
            score: 9,
          },
        ],
      },
      {
        q: "How does your organisation support internal mobility and team structure?",
        options: [
          { text: "Traditional job postings with fixed hierarchical team structures.", score: 1 },
          { text: "Internal job boards with basic search and limited cross-functional movement.", score: 3 },
          {
            text: "Mobility Marketplace platform enables employees to discover and move roles across BUs, reducing attrition.",
            score: 5,
          },
          {
            text: "Regular measurement of team-level psychological safety linked to innovation output and incident culture.",
            score: 7,
          },
          {
            text: "Distributed Teams build ephemeral capabilities to quickly respond to changes, with Continuous Innovation strategy empowering discoveries.",
            score: 9,
          },
        ],
      },
      {
        q: "How mature are your organisation's ways of working and innovation culture?",
        options: [
          { text: "Traditional methods with no structured approach to innovation.", score: 1 },
          { text: "Some agile practices adopted but inconsistently applied across the organisation.", score: 3 },
          {
            text: "Design Thinking, Systems Thinking and value-based journey flows embedded as standard Ways of Working.",
            score: 5,
          },
          {
            text: "Value-aligned structures organise and measure business value drivers across journey flows, linking ways of working to outcomes.",
            score: 7,
          },
          {
            text: "Continuous Innovation strategy established with empowered employees enabling discoveries through structured experimentation.",
            score: 10,
          },
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
        q: "How mature is your AI governance and compliance framework?",
        options: [
          { text: "No formal AI governance policies exist.", score: 1 },
          { text: "Basic guidelines documented but no audit trails or clear ownership.", score: 2 },
          {
            text: "Formal AI Governance with ownership and audit trails for AI decisions covering model risk and bias.",
            score: 5,
          },
          {
            text: "RegTech Automation monitors compliance and regulatory reporting to flag exposures in real time, with Hybrid Data Governance guardrails across business units.",
            score: 7,
          },
          {
            text: "Distributed Governance constructs responding in real time to market and business needs, with Digital Twin Ops for scenario testing before committing changes.",
            score: 10,
          },
        ],
      },
      {
        q: "How does your organisation deliver technology initiatives?",
        options: [
          { text: "Traditional waterfall project management with manual controls.", score: 1 },
          { text: "Agile projects adopted but still project-based funding and siloed delivery.", score: 3 },
          {
            text: "Projects-to-Products shift — user-centric, autonomously reconfigurable, outcome-oriented with DevSecOps, Cloud Control Framework and Value Stream Mapping.",
            score: 5,
          },
          {
            text: "Net Zero integrated at every level of tech, product and governance with Carbon Accounting instrumenting Scope 1, 2 and 3 data automatically.",
            score: 7,
          },
          {
            text: "Safe and Sustainable Ops with risk-weighted automation, proactive value-based decisioning and living digital twins modelling critical processes.",
            score: 9,
          },
        ],
      },
      {
        q: "How does your organisation manage cloud enablement and financial governance?",
        options: [
          { text: "Limited cloud adoption with no structured financial controls.", score: 1 },
          { text: "Some cloud migration underway but costs are not systematically tracked.", score: 3 },
          {
            text: "Cloud Control Framework with Value-Driven Ops and financial risk controls, supported by FinOps Practice for continuous cost visibility.",
            score: 5,
          },
          {
            text: "Hybrid Data Governance guardrails on business unit entitlements with automated compliance monitoring integrated into cloud operations.",
            score: 7,
          },
          {
            text: "Distributed Governance responding in real time to market needs with fully automated, risk-weighted cloud operations and proactive value-based decisioning.",
            score: 10,
          },
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
        q: "What is the current state of AI adoption across the enterprise?",
        options: [
          { text: "Experimental or proof-of-concept only.", score: 1 },
          {
            text: "AI Pairing — some teams paired with their own AI companion or CoPilot for productivity.",
            score: 3,
          },
          {
            text: "Augmented Developer tools with Agentic AI, RAG for proprietary knowledge access, and Context Engineering designing systems to use information effectively.",
            score: 5,
          },
          {
            text: "Centralised AI Framework Libraries with models, connectors and patterns for ADLC pipelines, plus AI Observability monitoring model drift and tracing decisions.",
            score: 7,
          },
          {
            text: "Agent Marketplace — a secure, curated platform to maintain and consume approved agents, with Machine Customers enabling autonomous transactions and proactive negotiation.",
            score: 10,
          },
        ],
      },
      {
        q: "How does your organisation manage AI safety, ethics and responsible AI?",
        options: [
          { text: "No formal AI ethics or safety processes.", score: 1 },
          { text: "Basic review process before deployment but no structured testing.", score: 3 },
          {
            text: "AI Red Teaming with structured adversarial testing for jailbreaks, bias and unsafe outputs before and after deployment.",
            score: 5,
          },
          {
            text: "AI Ethics Council developing formal guidance and policies, with Synthetic Data Gen providing privacy-safe, statistically valid training data.",
            score: 7,
          },
          {
            text: "Policy Pattern Management with LLM and SLM policy models published for all product teams, governing agent behaviour at scale.",
            score: 9,
          },
        ],
      },
      {
        q: "How are AI agents and orchestration integrated into your enterprise architecture?",
        options: [
          { text: "No agent capabilities or orchestration in place.", score: 1 },
          { text: "Isolated chatbots or single-purpose AI tools with no integration.", score: 2 },
          {
            text: "Context Engineering designing systems to understand and use information effectively, with Retrieval-Augmented Generation for proprietary knowledge.",
            score: 5,
          },
          {
            text: "Agent Ready Integration with APIs exposed via MCP and A2A standards, plus AI Orchestration coordinating models, data, workflows and systems.",
            score: 7,
          },
          {
            text: "Agent Marketplace with Machine Customers, Multimodal AI extending to images, audio, video and sensor data, and Small Language Models for low-latency edge deployment.",
            score: 10,
          },
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
        q: "How does your organisation treat data strategically?",
        options: [
          { text: "Data is a by-product of systems with no overarching strategy.", score: 1 },
          { text: "Some data governance exists but siloed across teams with no central ownership.", score: 3 },
          {
            text: "Data Centricity — data-first strategy over platform, with Data Contracts defining versioned agreements on schema, SLAs and quality between producers and consumers.",
            score: 5,
          },
          {
            text: "Data as a Product — forming valuable products and insights from data assets, with Unified Data Fabric virtualising data across disparate systems for self-service analytics.",
            score: 7,
          },
          {
            text: "Data Marketplace enabling secure live data exchange, transactions and monetisation, with Data Democratisation guardrails enabling safe ideation and execution.",
            score: 10,
          },
        ],
      },
      {
        q: "What is your organisation's analytics and data pipeline maturity?",
        options: [
          { text: "Manual reporting and spreadsheet-based analysis.", score: 1 },
          { text: "Batch ETL pipelines with standard BI tools.", score: 3 },
          {
            text: "Real-Time Analytics moving from batch to event-driven pipelines, with IT/OT Convergence merging entitlements to safely increase interoperability.",
            score: 5,
          },
          {
            text: "Knowledge Graphs representing entity relationships explicitly, improving AI reasoning and cross-domain analytics, with Hyper Personalisation via enterprise-wide immutable unique IDs.",
            score: 7,
          },
          {
            text: "Privacy Enhancing Technologies — federated learning, differential privacy and homomorphic encryption to share insights safely across boundaries.",
            score: 10,
          },
        ],
      },
      {
        q: "How is data quality, trust and asset value managed?",
        options: [
          { text: "No formal data quality processes in place.", score: 1 },
          { text: "Reactive data cleansing when issues surface, no proactive governance.", score: 3 },
          {
            text: "Data as an Asset — building trust, value and relevance in data with formal Data Contracts between producers and consumers.",
            score: 5,
          },
          {
            text: "Hyper Personalisation with centralised service for enterprise-wide immutable unique IDs, supported by Unified Data Fabric for consistent access.",
            score: 7,
          },
          {
            text: "Secure live data exchange with guardrails enabling safe ideation and autonomous execution, with Privacy Enhancing Tech protecting insights across organisational boundaries.",
            score: 10,
          },
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
        q: "How mature is your security and trust architecture?",
        options: [
          { text: "Perimeter-based security with castle-and-moat approach.", score: 1 },
          { text: "Some identity-based controls implemented but incomplete coverage.", score: 3 },
          {
            text: "Zero Trust Framework with Supply Chain Security — software bill of materials and signed artefacts to manage third-party and OSS risk.",
            score: 5,
          },
          {
            text: "Continuous Threat Exposure Management with state awareness and self-optimising threat analysis.",
            score: 7,
          },
          {
            text: "Quantum-Safe Crypto implementing post-quantum algorithms for NIST deadlines and harvest-now-decrypt-later threats.",
            score: 10,
          },
        ],
      },
      {
        q: "What is your approach to platform and architecture modernisation?",
        options: [
          { text: "Monolithic legacy systems with manual deployments.", score: 1 },
          { text: "Some cloud migration underway with basic CI/CD pipelines.", score: 3 },
          {
            text: "Platform Engineering with internal developer platform — golden paths, self-serve and embedded security, plus API Strategy with structured lifecycle and bounded contexts.",
            score: 5,
          },
          {
            text: "Composable Architecture for rapid business enablement with Smart Operations auto-sensing anomalies for self-healing, plus eBPF Observability for deep kernel-level telemetry.",
            score: 7,
          },
          {
            text: "Edge and Sovereign Cloud processing data close to source for latency, residency and disconnected ops, with Connected Workforce telemetry-based knowledge and automation.",
            score: 10,
          },
        ],
      },
      {
        q: "How does your organisation manage cloud economics and operational efficiency?",
        options: [
          { text: "No cloud cost visibility or governance in place.", score: 1 },
          { text: "Basic cloud billing monitoring with limited accountability.", score: 3 },
          {
            text: "FinOps Practice providing continuous cloud cost visibility and structured economics linked to Finance Risk Controls, with Core Modernisation into reusable modular patterns.",
            score: 5,
          },
          {
            text: "Smart Operations auto-sensing anomalies and patterns for self-healing and reduction of operational overhead, with Composable Architecture enabling rapid reconfiguration.",
            score: 7,
          },
          {
            text: "Democratisation with guardrails enabling safe ideation and execution of technology assets, with fully automated cost optimisation across hybrid, edge and sovereign cloud.",
            score: 10,
          },
        ],
      },
    ],
  },
];
