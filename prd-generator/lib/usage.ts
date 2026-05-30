import { prisma } from "@/lib/db";

export type UsageAction =
  | "GENERATE_PRD"
  | "REGENERATE_PRD"
  | "REGENERATE_SECTION"
  | "IMPROVE_SECTION"
  | "EXPORT_PDF"
  | "EXPORT_MARKDOWN"
  | "PAYMENT_SUCCESS"
  | "CREDIT_ADDED"
  | "CREDIT_REDUCED";

export async function logUsage(params: {
  userId: string;
  documentId?: string;
  action: UsageAction;
  creditUsed?: number;
  aiProvider?: string;
  aiModel?: string;
  tokenInput?: number;
  tokenOutput?: number;
  metadata?: Record<string, unknown>;
}) {
  return prisma.usageLog.create({
    data: {
      userId: params.userId,
      documentId: params.documentId,
      action: params.action,
      creditUsed: params.creditUsed ?? 0,
      aiProvider: params.aiProvider,
      aiModel: params.aiModel,
      tokenInput: params.tokenInput,
      tokenOutput: params.tokenOutput,
      metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : undefined,
    },
  });
}
