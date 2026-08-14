import assert from "node:assert/strict";import test from "node:test";
import {mergeAnalysisResults,percentConfidence} from "./live-data.ts";
test("confidence supports model 0-1 values",()=>{assert.equal(percentConfidence(.94),94);assert.equal(percentConfidence(88),88)});
test("retry merge replaces failures without duplicating successful feedback",()=>{const base={feedbackResults:[{id:"A"}],failures:[{feedbackId:"B"}],painPoints:[],requirements:[]};const retry={feedbackResults:[{id:"B"}],failures:[],painPoints:[{id:"P"}],requirements:[{id:"R"}]};const merged=mergeAnalysisResults(base,retry);assert.deepEqual(merged.feedbackResults.map(x=>x.id),["A","B"]);assert.equal(merged.failures.length,0);assert.equal(merged.status,"complete")});
