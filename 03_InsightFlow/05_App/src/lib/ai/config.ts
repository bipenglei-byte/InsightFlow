export type AIMode="demo"|"live";
export type AIConfig={mode:AIMode;provider:string;apiKey?:string;baseUrl:string;model:string;batchSize:number;concurrency:number;timeoutMs:number};
export function getAIConfig(env:Record<string,string|undefined>=process.env):AIConfig{
  const live=Boolean(env.AI_API_KEY&&env.AI_MODEL);
  return {mode:live?"live":"demo",provider:env.AI_PROVIDER||"openai-compatible",apiKey:env.AI_API_KEY,baseUrl:(env.AI_BASE_URL||"https://api.openai.com/v1").replace(/\/$/,""),model:env.AI_MODEL||"demo",batchSize:Number(env.AI_BATCH_SIZE)||10,concurrency:Number(env.AI_CONCURRENCY)||3,timeoutMs:Number(env.AI_TIMEOUT_MS)||60000};
}
