export type Sentiment = "positive" | "neutral" | "negative" | "mixed";
export type Severity = "critical" | "high" | "medium" | "low";
export type Priority = "P0" | "P1" | "P2" | "P3";
export type ConfidenceLevel = "high" | "medium" | "low";
export type ProjectStatus = "analyzed" | "processing" | "draft" | "failed";
export type ProcessingStatus = "pending" | "processing" | "complete" | "failed";

export interface Feedback { id:string; content:string; category:string; intent:string; sentiment:Sentiment; sentimentScore:number; feature:string; severity:Severity; summary:string; painPointId:string; confidence:number; source:string; rating:number; date:string }
export interface Subtopic { name:string; percentage:number }
export interface PainPoint { id:string; name:string; slug:string; description:string; feedbackCount:number; percentage:number; severity:Severity; confidence:number; negativeRate:number; subtopics:Subtopic[]; supportingFeedbackIds:string[]; userNeed:string; opportunity:string }
export interface Requirement { id:string; painPointId:string; title:string; userNeed:string; frequencyScore:number; severityScore:number; impactScore:number; businessValue:number; confidenceScore:number; priorityScore:number; priority:Priority; aiPriority:Priority; manualPriority:Priority|null; feedbackCount:number }
export interface Project { id:string; name:string; productName:string; productType:string; analysisGoal:string; dataSource:string; language:string; feedbackCount:number; insightCount:number; status:ProjectStatus; updatedAt:string }
export interface Insight { id:string; title:string; detail:string; painPointId:string; evidenceCount:number; confidence:number }
export interface PrdSections { background:string; problemStatement:string; userEvidence:string; userNeed:string; productGoal:string; successMetrics:string; userStories:string; functionalRequirements:string; edgeCases:string; analytics:string; acceptanceCriteria:string }
export interface PrdDraft { id:string; requirementId:string; title:string; sections:PrdSections; hasHumanEdits:boolean }
