import { getAIConfig } from "../../../lib/ai/config.ts";

export function GET() {
  return Response.json({
    status: "ok",
    service: "insightflow",
    mode: getAIConfig().mode,
  });
}
