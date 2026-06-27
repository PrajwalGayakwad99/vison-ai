// ─── generatePracticeProblems ──────────────────────────────────────────────
// AI-powered practice problem generation with structured JSON output and caching.
// Uses the existing aiApi.ts for Anthropic API calls.

import { callAi } from '../lib/aiApi';
import type { Topic, Exercise, Difficulty } from '../data/curriculumData';

export interface GeneratedExercise {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  testCases: { input: string; expectedOutput: string }[];
  difficulty: Difficulty;
  aiGenerated: true;
}

const JSON_SCHEMA_PROMPT = `You must respond with VALID JSON ONLY. No markdown, no explanation, no backticks.
The JSON must match this exact structure:

{
  "exercises": [
    {
      "title": "Problem title",
      "description": "Clear problem statement with input/output examples",
      "starterCode": "Code stub the student should complete",
      "solution": "Complete working solution",
      "testCases": [
        {"input": "input_value", "expectedOutput": "expected_output"}
      ],
      "difficulty": "beginner|intermediate|advanced|expert"
    }
  ]
}

Rules:
- Generate exactly 3 exercises
- Difficulty should match the requested level
- Problems must be ORIGINAL (not copies of standard problems)
- Test cases must be specific and verifiable
- Starter code should be a function stub, not a complete solution
- Solutions must be correct and well-commented`;

export async function generatePracticeProblems(
  topic: Topic,
  existingExercises: Exercise[],
  difficulty?: Difficulty
): Promise<GeneratedExercise[]> {
  const targetDifficulty = difficulty || topic.difficulty;

  // Build examples from existing exercises (use 2-3 as style reference)
  const examples = existingExercises.slice(0, 3);
  const examplesText = examples.length > 0
    ? `Here are ${examples.length} example problems from this topic's exercise bank for style/format reference:\n\n` +
      examples.map((e, i) =>
        `Example ${i + 1}: "${e.title}" (${e.difficulty})\n${e.description}\nStarter: ${e.starterCode}\nSolution: ${e.solution}\n`
      ).join('\n')
    : 'No existing exercises to reference. Create problems that fit the topic description.';

  const systemPrompt = `You are an expert programming educator creating practice problems for "${topic.title}".

Topic: ${topic.title}
Description: ${topic.description}
Difficulty Level: ${targetDifficulty}
Concepts Covered: ${topic.explanation.slice(0, 500)}...

${examplesText}

${JSON_SCHEMA_PROMPT}`;

  const userPrompt = `Generate 3 ${targetDifficulty}-level practice problems for the topic "${topic.title}".

Make sure the problems:
1. Directly test understanding of ${topic.title}
2. Are appropriately challenging for ${targetDifficulty} level
3. Have clear, unambiguous test cases
4. Follow the style of the provided examples (if any)`;

  try {
    const rawResponse = await callAi({
      messages: [{ role: 'user', content: userPrompt }],
      systemPrompt,
      maxTokens: 3000,
      temperature: 0.8,
      model: 'claude-sonnet-4-20250514',
    });

    // Parse JSON from response
    let jsonStr = rawResponse.trim();
    // Remove markdown code blocks if present
    jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');

    const parsed = JSON.parse(jsonStr);

    if (!parsed.exercises || !Array.isArray(parsed.exercises)) {
      throw new Error('Invalid response format: missing exercises array');
    }

    return parsed.exercises.map((ex: any, i: number) => ({
      id: `ai-${topic.id}-${Date.now()}-${i}`,
      title: ex.title || `AI Problem ${i + 1}`,
      description: ex.description || '',
      starterCode: ex.starterCode || '',
      solution: ex.solution || '',
      testCases: ex.testCases || [{ input: '', expectedOutput: '' }],
      difficulty: (['beginner', 'intermediate', 'advanced', 'expert'].includes(ex.difficulty) ? ex.difficulty : targetDifficulty) as Difficulty,
      aiGenerated: true as const,
    }));
  } catch (err) {
    // If JSON parsing fails, return a helpful error exercise
    return [
      {
        id: `ai-error-${Date.now()}`,
        title: 'AI Generation Failed',
        description: 'Could not generate practice problems. Please try again.\n\nError: ' + (err instanceof Error ? err.message : 'Unknown error'),
        starterCode: '# Problem generation failed',
        solution: '',
        testCases: [],
        difficulty: targetDifficulty,
        aiGenerated: true,
      },
    ];
  }
}

// ─── Cache Management ──────────────────────────────────────────────────────

export function getCachedProblems(topicId: string): GeneratedExercise[] {
  try {
    const raw = localStorage.getItem(`axiom-ai-problems-${topicId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function cacheProblems(topicId: string, problems: GeneratedExercise[]) {
  try {
    const existing = getCachedProblems(topicId);
    // Deduplicate by title
    const newProblems = problems.filter(
      (p) => !existing.some((e) => e.title === p.title)
    );
    localStorage.setItem(`axiom-ai-problems-${topicId}`, JSON.stringify([...existing, ...newProblems]));
  } catch { /* ignore */ }
}

export function clearCachedProblems(topicId: string) {
  try {
    localStorage.removeItem(`axiom-ai-problems-${topicId}`);
  } catch { /* ignore */ }
}
