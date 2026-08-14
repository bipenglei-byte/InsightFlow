import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";

const dir = path.resolve(process.cwd(), "../04_Data/evaluation");
const versions = ["v1", "v2", "v3"] as const;
const metrics: Record<string, any> = {};

function errorRow(row: any) {
  let errorType = "E8_OTHER";
  let gold = "";
  let prediction = "";
  let rootCause = "One or more deterministic labels differ.";
  let fixStrategy = "Review the decision rule against this boundary case.";
  if (row.schema_valid !== "1") {
    errorType = "E7_SCHEMA_FAILURE";
    rootCause = "Model output did not satisfy the structured schema.";
    fixStrategy = "Inspect validation error and structured-output compatibility.";
  } else if (row.gold_category !== row.pred_category) {
    errorType = "E1_CATEGORY_BOUNDARY";
    gold = row.gold_category;
    prediction = row.pred_category;
    rootCause = `Category boundary selected ${row.pred_category} instead of ${row.gold_category}.`;
    fixStrategy = "Clarify this category boundary with a minimal decision rule or example.";
  } else if (row.gold_severity !== row.pred_severity) {
    errorType = "E2_SEVERITY_RULE";
    gold = row.gold_severity;
    prediction = row.pred_severity;
    rootCause = `Severity was classified ${row.pred_severity} instead of ${row.gold_severity}.`;
    fixStrategy = "Tighten workflow-impact and critical/high boundary definitions.";
  } else if (row.gold_intent !== row.pred_intent) {
    gold = row.gold_intent;
    prediction = row.pred_intent;
    rootCause = `Intent was classified ${row.pred_intent} instead of ${row.gold_intent}.`;
    fixStrategy = "Clarify complaint/request/suggestion/question decision order.";
  } else {
    gold = row.gold_sentiment;
    prediction = row.pred_sentiment;
    rootCause = `Sentiment was classified ${row.pred_sentiment} instead of ${row.gold_sentiment}.`;
    fixStrategy = "Clarify mixed-valence and neutral boundaries.";
  }
  return { id: row.id, content: row.content, gold, prediction, error_type: errorType, root_cause: rootCause, fix_strategy: fixStrategy };
}

for (const version of versions) {
  metrics[version] = JSON.parse(fs.readFileSync(path.join(dir, `metrics_${version}.json`), "utf8"));
  const rows = Papa.parse<any>(fs.readFileSync(path.join(dir, `predictions_${version}.csv`), "utf8"), { header: true, skipEmptyLines: true }).data;
  const errors = rows.filter((row) => row.schema_valid !== "1" || row.gold_category !== row.pred_category || row.gold_intent !== row.pred_intent || row.gold_sentiment !== row.pred_sentiment || row.gold_severity !== row.pred_severity).map(errorRow);
  fs.writeFileSync(path.join(dir, `error_cases_${version}.csv`), Papa.unparse(errors));
}

const runs = Object.fromEntries(versions.map((version) => {
  const value = metrics[version];
  return [version, { runDate: value.runDate, sampleCount: value.sampleCount, categoryAccuracy: value.category.accuracy, categoryMacroF1: value.category.macroF1, intentAccuracy: value.intent.accuracy, sentimentAccuracy: value.sentiment.accuracy, sentimentMacroF1: value.sentiment.macroF1, severityAccuracy: value.severity.exactAccuracy, severityMeanDistance: value.severity.meanDistance, schemaFailureRate: value.schemaFailureRate, confidence: value.confidence }];
}));
const result = { datasetVersion: "evaluation-dataset-v1", sampleCount: 100, provider: metrics.v3.provider, model: metrics.v3.model, temperature: 0.1, promptVersions: versions.map((version) => metrics[version].promptVersion), runs, bestPrompt: { version: "feedback-analyzer-v3", basis: "Best overall automatic metrics: highest category accuracy, category macro F1, intent accuracy, sentiment accuracy, and severity accuracy; zero schema failures." }, humanEvaluation: { hallucination: "pending", painPoint: "pending", userNeed: "pending", prd: "not_tested" } };
const v3Rows = Papa.parse<any>(fs.readFileSync(path.join(dir, "predictions_v3.csv"), "utf8"), { header: true, skipEmptyLines: true }).data;
const manualRows = v3Rows.map((row) => ({ id: row.id, content: row.content, gold_pain_point: row.gold_pain_point, pred_pain_point: row.pred_pain_point, pain_point_score: "", pain_point_note: "", gold_user_need: row.gold_user_need, pred_user_need: row.pred_user_need, user_need_score: "", user_need_note: "", hallucination_flag: "" }));
fs.writeFileSync(path.join(dir, "manual_review_v3.csv"), Papa.unparse(manualRows));
fs.writeFileSync(path.join(dir, "evaluation_results.json"), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
