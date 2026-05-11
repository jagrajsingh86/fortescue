import { PILLARS } from "./pillars";
import type { AssessmentAnswers, Band, PillarScore } from "@/types/assessment";

export function getPillarScore(pillarIdx: number, answers: AssessmentAnswers): number {
  const pillar = PILLARS[pillarIdx];
  let sum = 0;
  let count = 0;
  pillar.questions.forEach((_, qi) => {
    const key = `${pillarIdx}-${qi}`;
    if (answers[key] !== undefined) {
      sum += answers[key];
      count++;
    }
  });
  return count ? sum / count : 0;
}

export function getOverallScore(answers: AssessmentAnswers): number {
  const scores = PILLARS.map((_, i) => getPillarScore(i, answers));
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function getBand(score: number): Band {
  if (score < 4) return "Foundational";
  if (score < 7) return "Scaling";
  return "Autonomous";
}

export function getAllPillarScores(answers: AssessmentAnswers): PillarScore[] {
  return PILLARS.map((p, i) => {
    const score = getPillarScore(i, answers);
    return {
      pillarId: p.id,
      pillarName: p.name,
      score,
      band: getBand(score),
    };
  });
}

export function totalQuestions(): number {
  return PILLARS.reduce((acc, p) => acc + p.questions.length, 0);
}
