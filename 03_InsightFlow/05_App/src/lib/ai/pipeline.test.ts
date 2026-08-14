import assert from "node:assert/strict";
import test from "node:test";
import { FeedbackAnalysisSchema } from "./schemas.ts";
import { validateEvidenceIds, aggregatePainPoint, normalizeFeedback } from "./pipeline.ts";
import { getAIConfig } from "./config.ts";

test("valid feedback output passes and controlled vocabulary is enforced", () => {
  const valid={category:"ux",intent:"complaint",sentiment:"negative",sentimentScore:-.8,feature:"search",severity:"high",summary:"Search fails",painPoint:"Search recall",userNeed:"Find saved content",confidence:.9};
  assert.equal(FeedbackAnalysisSchema.parse(valid).category,"ux");
  assert.equal(FeedbackAnalysisSchema.safeParse({...valid,category:"random"}).success,false);
  assert.equal(FeedbackAnalysisSchema.safeParse({...valid,confidence:2}).success,false);
});

test("unknown evidence ids are rejected",()=>{
  assert.throws(()=>validateEvidenceIds(["FB_1","MISSING"],new Set(["FB_1"])),/Unknown evidence/);
});

test("pain point statistics are calculated from evidence",()=>{
  const result=aggregatePainPoint({id:"PP_1",name:"Search",description:"Search issues",subtopics:["Recall"],supportingFeedbackIds:["FB_1","FB_2"],confidence:.9},[
    {id:"FB_1",content:"a",sentiment:"negative",severity:"critical"},
    {id:"FB_2",content:"b",sentiment:"neutral",severity:"high"},
  ],4);
  assert.equal(result.feedbackCount,2); assert.equal(result.percentage,50); assert.equal(result.negativeRate,50); assert.equal(result.severity,"critical");
});

test("normalization preserves original text and truncates model input",()=>{
  const value=normalizeFeedback({id:"FB_1",content:`  ${"x".repeat(5000)}  `});
  assert.equal(value.originalText.length,5004); assert.equal(value.normalizedText.length,4000);
});

test("missing API key selects demo mode",()=>{
  assert.equal(getAIConfig({}).mode,"demo");
});
