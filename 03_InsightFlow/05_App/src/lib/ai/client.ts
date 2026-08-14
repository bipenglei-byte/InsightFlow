import {getAIConfig} from "./config"; import {OpenAICompatibleProvider} from "./provider";
export function createAIClient(){const config=getAIConfig();return {config,provider:new OpenAICompatibleProvider(config)}}
