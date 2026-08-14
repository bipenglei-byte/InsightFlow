import assert from "node:assert/strict";
import test from "node:test";
import { calculatePriorityScore, getPriorityFromScore } from "./priority.ts";

test("calculates the documented weighted priority score", () => {
  assert.equal(calculatePriorityScore({ frequency: 95, severity: 90, impact: 95, businessValue: 80, confidence: 92 }), 91);
});

test("clamps every score dimension to the 0-100 range", () => {
  assert.equal(calculatePriorityScore({ frequency: 120, severity: -10, impact: 100, businessValue: 100, confidence: 100 }), 75);
});

test("maps score boundaries to P0-P3", () => {
  assert.equal(getPriorityFromScore(85), "P0");
  assert.equal(getPriorityFromScore(84), "P1");
  assert.equal(getPriorityFromScore(64), "P2");
  assert.equal(getPriorityFromScore(39), "P3");
});
