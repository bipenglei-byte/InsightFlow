import {NextResponse} from "next/server"; import {getAIConfig} from "@/lib/ai/config";
export const runtime="nodejs"; export async function GET(){const c=getAIConfig();return NextResponse.json({mode:c.mode,provider:c.provider,model:c.mode==="live"?c.model:null,liveReady:c.mode==="live"})}
