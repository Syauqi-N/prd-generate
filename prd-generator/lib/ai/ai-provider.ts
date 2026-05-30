export interface GeneratePRDInput {
  productName: string;
  idea: string;
  productType: string;
  outputStyle: string;
  targetUsage: string;
  templateName: string;
  answers: Record<string, string>;
  language?: string;
}

export interface GeneratePRDOutput {
  content: string;
  tokenInput?: number;
  tokenOutput?: number;
  provider?: string;
  model?: string;
}

export interface RegenerateSectionInput {
  documentContext: string;
  sectionTitle: string;
  sectionContent: string;
  instruction: string;
}

export interface ImproveSectionInput {
  sectionTitle: string;
  sectionContent: string;
  improvementType: string;
}

export interface AIProvider {
  generatePRD(input: GeneratePRDInput): Promise<GeneratePRDOutput>;
  regenerateSection(input: RegenerateSectionInput): Promise<string>;
  improveSection(input: ImproveSectionInput): Promise<string>;
}
