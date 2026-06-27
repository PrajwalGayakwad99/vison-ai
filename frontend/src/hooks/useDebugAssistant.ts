// ─── useDebugAssistant Hook ─────────────────────────────────────────────
// Sends code + errors to AI and returns structured debug analysis.

import { useState, useCallback } from 'react';
import { useWorkspace } from '../store/useWorkspace';
import { callAi } from '../lib/aiApi';
import { buildSystemPrompt } from '../lib/aiContext';
import { logInteraction } from '../lib/aiLogger';

export interface DebugAnalysis {
  issue: string;
  explanation: string;
  guidingQuestion: string;
  rawResponse: string;
}

export function useDebugAssistant() {
  const { code, language, currentStep, steps, directnessLevel = 0 } = useWorkspace();
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DebugAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parseDebugResponse = (raw: string): DebugAnalysis => {
    // Parse the structured response from the AI
    const issueMatch = raw.match(/### Issue Found\s*\n([\s\S]*?)(?=###|$)/i);
    const whyMatch = raw.match(/### Why It's Wrong Conceptually\s*\n([\s\S]*?)(?=###|$)/i);
    const questionMatch = raw.match(/### Guiding Question\s*\n([\s\S]*?)(?=###|$)/i);
    const fixMatch = raw.match(/### Suggested Fix\s*\n([\s\S]*?)(?=###|$)/i);

    return {
      issue: issueMatch ? issueMatch[1].trim() : '',
      explanation: whyMatch ? whyMatch[1].trim() : (fixMatch ? fixMatch[1].trim() : ''),
      guidingQuestion: questionMatch ? questionMatch[1].trim() : '',
      rawResponse: raw,
    };
  };

  const analyze = useCallback(
    async (errorMessage?: string, expectedOutput?: string, actualOutput?: string) => {
      if (!code) return;
      setAnalyzing(true);
      setError(null);
      setResult(null);

      const ctx = {
        code,
        language,
        activePage: 'workspace',
        activeTab: 'flow',
        currentStep,
        steps,
        topic: 'Debugging Session',
        learningMode: 'debugging' as const,
        directnessLevel: directnessLevel ?? 0,
        conversationHistory: [],
      };

      let errorContext = '';
      if (errorMessage) errorContext += `\nRUNTIME ERROR:\n${errorMessage}`;
      if (expectedOutput) errorContext += `\nEXPECTED OUTPUT:\n${expectedOutput}`;
      if (actualOutput) errorContext += `\nACTUAL OUTPUT:\n${actualOutput}`;

      const systemPrompt = buildSystemPrompt(ctx, 'debug');
      const userPrompt = `Analyze this code for issues.${errorContext}`;

      try {
        const raw = await callAi({
          messages: [{ role: 'user', content: userPrompt }],
          systemPrompt,
          maxTokens: 1024,
          temperature: 0.3,
        });

        const parsed = parseDebugResponse(raw);
        setResult(parsed);
        logInteraction('debug', userPrompt, raw, ctx.directnessLevel, {
          topic: ctx.topic,
          language,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Debug analysis failed');
      } finally {
        setAnalyzing(false);
      }
    },
    [code, language, currentStep, steps, directnessLevel]
  );

  const clear = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { analyze, analyzing, result, error, clear };
}
