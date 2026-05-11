export interface Option {
  text: string;
  score: number;
}

export interface Question {
  q: string;
  options: Option[];
}

export interface Pillar {
  id: "people" | "process" | "ai" | "data" | "tech";
  name: string;
  num: string;
  accent: string;
  questions: Question[];
}

export type Band = "Foundational" | "Scaling" | "Autonomous";

export interface AssessmentAnswers {
  [key: string]: number;
}

export interface PillarScore {
  pillarId: string;
  pillarName: string;
  score: number;
  band: Band;
}

export interface PillarAnalysis {
  pillarId: string;
  currentState: string;
  gaps: string[];
  recommendations: string[];
  quickWins: string[];
}

export interface RoadmapHorizon {
  horizon: string;
  initiatives: string[];
}

export interface AIAnalysisData {
  executiveSummary: string;
  pillarAnalyses: PillarAnalysis[];
  roadmap: RoadmapHorizon[];
  riskFactors: string[];
  cognizantValue: string;
}

export interface AnalyseResponse {
  overall: number;
  overallBand: Band;
  pillarScores: PillarScore[];
  analysis: AIAnalysisData;
}
