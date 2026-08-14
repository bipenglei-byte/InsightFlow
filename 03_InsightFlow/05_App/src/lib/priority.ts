import type { Priority } from "./types";

export type PriorityInputs = { frequency: number; severity: number; impact: number; businessValue: number; confidence: number };
const clamp = (value: number) => Math.min(100, Math.max(0, value));

export function calculatePriorityScore(values: PriorityInputs) {
  return Math.round(clamp(values.frequency) * .3 + clamp(values.severity) * .25 + clamp(values.impact) * .2 + clamp(values.businessValue) * .15 + clamp(values.confidence) * .1);
}

export function getPriorityFromScore(score: number): Priority {
  const value = clamp(score);
  if (value >= 85) return "P0";
  if (value >= 65) return "P1";
  if (value >= 40) return "P2";
  return "P3";
}
