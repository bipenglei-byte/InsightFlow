export type AIErrorCode="provider_not_configured"|"rate_limited"|"timeout"|"invalid_output"|"provider_error";
export class AIError extends Error{code:AIErrorCode;retryable:boolean;constructor(code:AIErrorCode,message:string,retryable=false){super(message);this.code=code;this.retryable=retryable;this.name="AIError"}}
export function publicAIError(error:unknown){if(error instanceof AIError)return {code:error.code,message:error.message,retryable:error.retryable};return {code:"provider_error",message:"AI processing failed. Please retry.",retryable:true};}
