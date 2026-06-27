// ── AI Context Payload Builder ─────────────────────────────────────────
// Assembles system prompts from the current workspace state so every AI
// call is grounded in what the student actually sees.

import type { ExecutionStep } from '../store/useWorkspace';

export interface ContextState {
  code: string;
  language: string;
  activePage: string;
  activeTab: string;
  currentStep: number;
  steps: ExecutionStep[];
  topic: string;
  learningMode: 'practice' | 'quiz' | 'debugging' | 'explore';
  directnessLevel: number; // 0 = pure Socratic, 1 = mixed, 2 = direct
  conversationHistory: { role: 'user' | 'assistant'; content: string }[];
  quizQuestion?: string;
  quizCorrectAnswer?: string;
  quizStudentAnswer?: string;
  hintCount?: number;
}

const HISTORY_WINDOW = 6; // last N messages sent to AI

export function buildSystemPrompt(ctx: ContextState, mode: 'chat' | 'debug' | 'hint' | 'progress'): string {
  const base = buildBaseContext(ctx);

  switch (mode) {
    case 'chat':
      return buildSocraticPrompt(base, ctx);
    case 'debug':
      return buildDebugPrompt(base, ctx);
    case 'hint':
      return buildHintPrompt(base, ctx);
    case 'progress':
      return buildProgressPrompt(base, ctx);
    default:
      return base;
  }
}

function buildBaseContext(ctx: ContextState): string {
  return `You are AXIOM, an AI tutor for a coding learning platform.
Topic: ${ctx.topic || 'General Programming'}
Current Language: ${ctx.language}
Learning Mode: ${ctx.learningMode}
Active View: ${ctx.activeTab}`;
}

function buildSocraticPrompt(base: string, ctx: ContextState): string {
  const directness = ctx.directnessLevel;
  let socraticLevel: string;

  if (directness === 0) {
    socraticLevel = `DIRECTNESS LEVEL: 0 (Pure Socratic)
- NEVER give direct answers or corrected code
- Ask exactly 1-2 guiding questions that point the student toward the insight
- Reference the student's actual code (shown below) in your questions
- Be encouraging and patient`;
  } else if (directness === 1) {
    socraticLevel = `DIRECTNESS LEVEL: 1 (Guided)
- You may give partial hints and explain concepts, but don't write the full solution
- Start with a guiding question, then offer a conceptual explanation if they struggle
- You may reference specific lines of the student's code`;
  } else {
    socraticLevel = `DIRECTNESS LEVEL: 2 (Direct)
- The student has asked for direct help. Provide a clear explanation with examples
- You may show corrected code snippets but always explain WHY the fix works`;
  }

  const codeContext = ctx.code
    ? `\n\nSTUDENT'S CURRENT CODE:\n\`\`\`${ctx.language}\n${ctx.code}\n\`\`\``
    : '';

  const stepContext = ctx.currentStep < ctx.steps.length
    ? `\n\nCURRENT EXECUTION STATE (Step ${ctx.currentStep + 1}/${ctx.steps.length}):\n${JSON.stringify(ctx.steps[ctx.currentStep], null, 2)}`
    : '';

  const historyContext = ctx.conversationHistory.length > 0
    ? `\n\nRECENT CONVERSATION (last ${HISTORY_WINDOW} exchanges):\n${ctx.conversationHistory
        .slice(-HISTORY_WINDOW)
        .map((m) => `${m.role === 'user' ? 'Student' : 'AI Tutor'}: ${m.content}`)
        .join('\n')}`
    : '';

  return `${base}

${socraticLevel}

${codeContext}${stepContext}${historyContext}

Always keep your responses concise (2-4 sentences) unless the student asks for more detail.`;
}

function buildDebugPrompt(base: string, ctx: ContextState): string {
  const directness = ctx.directnessLevel;
  let guidanceLevel: string;

  if (directness <= 1) {
    guidanceLevel = `Your response MUST be structured into these sections:
### Issue Found
[What's wrong — reference specific line numbers if possible]

### Why It's Wrong Conceptually
[Explain the conceptual error, not just the syntax]

### Guiding Question
[1 question that points toward the fix WITHOUT giving the answer]`;
  } else {
    guidanceLevel = `The student wants direct help. Provide:
### Issue Found
### Why It's Wrong Conceptually
### Suggested Fix
[Include corrected code with explanation of WHY it works]`;
  }

  return `${base}

ROLE: AI Debugging Assistant
DIRECTNESS LEVEL: ${directness}

STUDENT'S CODE:
\`\`\`${ctx.language}
${ctx.code}
\`\`\`

${guidanceLevel}

Be precise about line numbers and specific syntax. Keep it concise.`;
}

function buildHintPrompt(base: string, ctx: ContextState): string {
  const hintNum = ctx.hintCount || 0;
  let directness: string;

  if (hintNum === 0) {
    directness = `Hint 1 of 3: Give a very subtle nudge. Point to the relevant concept without giving anything away.`;
  } else if (hintNum === 1) {
    directness = `Hint 2 of 3: Be more specific. Reference what aspect of the problem they should reconsider.`;
  } else {
    directness = `Hint 3 of 3 (Final): Be quite direct but still don't state the exact answer. Give them enough to solve it.`;
  }

  return `${base}

ROLE: Quiz Hint Generator
QUESTION: ${ctx.quizQuestion || 'N/A'}
STUDENT'S ANSWER: ${ctx.quizStudentAnswer || 'N/A'}
HINT NUMBER: ${hintNum + 1}

${directness}

Keep your hint to 1-2 sentences. Do NOT reveal the correct answer.`;
}

function buildProgressPrompt(base: string, ctx: ContextState): string {
  return `${base}

ROLE: Progress Analyst
Generate a short, personalized "what to review next" recommendation based on the session data below.

Write conversationally (2-3 short paragraphs). Reference specific concepts the student struggled with.

SESSION DATA:
${JSON.stringify(ctx, null, 2)}

Format:
- Strengths (what they did well)
- Review Recommended (specific concepts to revisit)
- Next Up (what to try next)`;
}

export function buildUserMessage(text: string): string {
  return text;
}
