import assert from "node:assert/strict"; import test from "node:test";
import {accuracy,classificationMetrics,confusionMatrix,severityMetrics,confidenceBuckets} from "./metrics.ts";
test("classification metrics calculate accuracy and macro F1",()=>{const m=classificationMetrics(["a","a","b","b"],["a","b","b","b"],["a","b"]);assert.equal(m.accuracy,.75);assert.equal(Number(m.macroF1.toFixed(3)),.733)});
test("confusion matrix totals equal evaluated samples",()=>{const m=confusionMatrix(["a","b","a"],["a","a","b"],["a","b"]);assert.equal(m.flat().reduce((a,b)=>a+b,0),3)});
test("severity distance reports exact and off-by-one",()=>{const m=severityMetrics(["low","high","critical"],["medium","high","low"]);assert.equal(m.exactAccuracy,1/3);assert.equal(m.offByOne,1);assert.equal(m.offByTwoPlus,1);assert.equal(m.meanDistance,4/3)});
test("confidence buckets use actual category correctness",()=>{const b=confidenceBuckets([{confidence:.95,correct:true},{confidence:.92,correct:false},{confidence:.75,correct:true}]);assert.equal(b[0].actualAccuracy,.5);assert.equal(b[2].actualAccuracy,1)});
test("accuracy rejects misaligned inputs",()=>assert.throws(()=>accuracy(["a"],[]),/same length/));
