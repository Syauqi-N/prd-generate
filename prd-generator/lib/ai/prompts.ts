export const GENERATE_PRD_PROMPT = `You are an expert product manager.

Create a complete Product Requirements Document based on the following product idea and user answers.
Output language: Indonesian.
Output format: Markdown.
Tone: clear, structured, professional, easy to understand.

Product Name:
{{productName}}

Product Idea:
{{idea}}

Product Type:
{{productType}}

Output Style:
{{outputStyle}}

Target Usage:
{{targetUsage}}

Selected Template:
{{templateName}}

User Answers:
{{answers}}

The PRD must include:
1. Product Overview
2. Background
3. Problem Statement
4. Goals & Objectives
5. Target Users
6. User Personas
7. Core Features
8. User Flow
9. Functional Requirements
10. Non-Functional Requirements
11. MVP Scope
12. Out of Scope
13. Acceptance Criteria
14. Risks & Assumptions
15. Success Metrics
16. Future Enhancements

Make the output detailed but not too verbose.
Use headings, bullet points, and tables when useful.
Do not invent fake market data.
If information is missing, make reasonable assumptions and label them as assumptions.`;

export const REGENERATE_SECTION_PROMPT = `You are an expert product manager.
Rewrite and improve the selected PRD section.

Document Context:
{{documentContext}}

Selected Section Title:
{{sectionTitle}}

Selected Section Content:
{{sectionContent}}

Instruction:
{{instruction}}

Output language: Indonesian.
Output only the improved section content in Markdown.
Do not rewrite the entire PRD.`;

export const IMPROVE_SECTION_PROMPT = `You are an expert product manager and technical writer.
Improve the following PRD section to make it clearer, more actionable, and more useful for a development team.

Section Title:
{{sectionTitle}}

Section Content:
{{sectionContent}}

Improvement Type:
{{improvementType}}

Output language: Indonesian.
Return only the improved Markdown section.`;

export const GENERATE_AI_PRD_PROMPT = `You are an expert software architect and product manager specializing in writing PRDs for AI coding tools like Cursor, v0, Lovable, Bolt, and CLI tools like Claude Code, OpenAI Codex CLI, Gemini CLI, and Aider.

Create a highly structured, technical PRD optimized for AI coding tools based on the following:

Product Name: {{productName}}
Product Idea: {{idea}}
Platform: {{platform}}
Target AI Tool: {{aiTool}}
User Answers: {{answers}}

IMPORTANT: If the target AI tool is a CLI tool (Claude Code, OpenAI Codex CLI, Gemini CLI, Aider, Continue), optimize the output for terminal-based AI workflows:
- Add a "Prompt Chaining Guide" section with step-by-step prompts to feed the CLI tool
- Keep instructions imperative and direct ("Create...", "Implement...", "Add...")
- Include copy-paste ready prompt snippets

If the target is a GUI tool (Cursor, v0, Lovable, Bolt, Windsurf), optimize for visual/chat-based workflows.

The PRD must include these sections in order:

## 1. Product Overview
Brief, clear description of what this product does.

## 2. Tech Stack
Explicit recommended tech stack with specific libraries/frameworks. No vague suggestions.

## 3. Project Structure
Suggested folder/file structure the AI should generate.

## 4. Core Features
Numbered list of features with clear scope boundaries.

## 5. Data Models
All entities/schemas with fields and types.

## 6. User Stories
Format: As a [user], I want to [action] so that [benefit].
Group by feature.

## 7. UI Components
List all pages and key components needed.

## 8. API Endpoints
All endpoints with method, path, request, and response format.

## 9. Acceptance Criteria
Per feature, specific and testable criteria.

## 10. MVP Scope
Exact list of what is IN scope and OUT of scope for v1.

## 11. Implementation Notes
Specific instructions, constraints, or preferences for the AI coding tool.

## 12. Prompt Guide for {{aiTool}}
Step-by-step prompts or instructions to feed into {{aiTool}} to build this product efficiently.

Rules:
- Be extremely specific and explicit — no ambiguity
- Use technical language
- Every feature must have clear boundaries
- Output in Markdown
- Language: Indonesian
`;

export const GENERATE_QUESTIONS_PROMPT = `You are an expert product manager.

A user wants to build the following product:
"{{idea}}"

Target platform: {{platform}}
Target AI coding tool: {{aiTool}}

Generate exactly 3 to 5 highly specific, contextual questions to clarify the product requirements.
Questions must be tailored to THIS specific product — not generic.
Focus on: core functionality, auth/data needs, key interactions, technical constraints, scope.

Return ONLY a valid JSON array of question strings. No explanation, no markdown, no extra text.
Example: ["Question 1?", "Question 2?", "Question 3?"]`;

export function buildGeneratePRDPrompt(vars: Record<string, string>): string {
  let prompt = GENERATE_PRD_PROMPT;
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }
  return prompt;
}

export function buildRegenerateSectionPrompt(vars: Record<string, string>): string {
  let prompt = REGENERATE_SECTION_PROMPT;
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }
  return prompt;
}

export function buildImproveSectionPrompt(vars: Record<string, string>): string {
  let prompt = IMPROVE_SECTION_PROMPT;
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }
  return prompt;
}

export function buildGenerateAIPRDPrompt(vars: Record<string, string>): string {
  let prompt = GENERATE_AI_PRD_PROMPT;
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }
  return prompt;
}

export function buildGenerateQuestionsPrompt(vars: Record<string, string>): string {
  let prompt = GENERATE_QUESTIONS_PROMPT;
  for (const [key, value] of Object.entries(vars)) {
    prompt = prompt.replaceAll(`{{${key}}}`, value);
  }
  return prompt;
}
