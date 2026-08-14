import { POST as runAnalysis } from "../run/route";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  return runAnalysis(request);
}
