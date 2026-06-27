// ─── useQuizHints Hook ──────────────────────────────────────────────────
// Generates progressive hints for quiz questions without revealing answers.

import { useState, useCallback } from 'react';
import { useWorkspace } from '../store/useWorkspace';
import { callAi } from '../lib/aiApi';
import { buildSystemPrompt } from '../lib/aiContext';
import { logInteraction } from '../lib/aiLogger';

const MAX_HINTS = 3;

export function useQuizHints() {
  const { code, language, currentStep, steps, directnessLevel = 0 } = useWorkspace();
  const [hints, setHints] = useState<string[]>([]);
  const [currentHintIdx, setCurrentHintIdx] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestHint = useCallback(
    async (question: string, correctAnswer: string, studentAnswer: string) => {
      if (currentHintIdx >= MAX_HINTS - 1) return; // Already at max hints

      setGenerating(true);
      setError(null);

      const ctx = {
        code,
        language,
        activePage: 'workspace',
        activeTab: 'quiz',
        currentStep,
        steps,
        topic: 'Quiz Session',
        learningMode: 'quiz' as const,
        directnessLevel: directnessLevel ?? 0,
        conversationHistory: [],
        quizQuestion: question,
        quizCorrectAnswer: correctAnswer,
        quizStudentAnswer: studentAnswer,
        hintCount: currentHintIdx,
      };

      const systemPrompt = buildSystemPrompt(ctx, 'hint');

      try {
        const hint = await callAi({
          messages: [{ role: 'user', content: `Generate hint ${currentHintIdx + 1} of ${MAX_HINTS}.` }],
          systemPrompt,
          maxTokens: 256,
          temperature: 0.5,
        });

        setHints((prev) => [...prev, hint]);
        setCurrentHintIdx((prev) => prev + 1);
        logInteraction('hint', question, hint, ctx.directnessLevel, {
          topic: 'Quiz',
          language,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Hint generation failed');
      } finally {
        setGenerating(false);
      }
    },
    [code, language, currentStep, steps, directnessLevel, currentHintIdx]
  );

  const reset = useCallback(() => {
    setHints([]);
    setCurrentHintIdx(0);
    setError(null);
  }, []);

  return {
    requestHint,
    hints,
    currentHintIdx,
    hintCount: currentHintIdx,
    maxHints: MAX_HINTS,
    remainingHints: MAX_HINTS - currentHintIdx,
    generating,
    error,
    reset,
  };
}
