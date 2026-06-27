// ─── useProgressFeedback Hook ───────────────────────────────────────────
// Aggregates session data and gets personalized review recommendations.

import { useState, useCallback } from 'react';
import { useWorkspace } from '../store/useWorkspace';
import { callAi } from '../lib/aiApi';
import { buildSystemPrompt } from '../lib/aiContext';
import { logInteraction, getSessionStats, getAllInteractions } from '../lib/aiLogger';

export interface ProgressFeedback {
  strengths: string[];
  reviewRecommendations: string[];
  nextSteps: string[];
  rawResponse: string;
  sessionSummary: {
    totalInteractions: number;
    interactionBreakdown: Record<string, number>;
    topicsCovered: string[];
  };
}

export function useProgressFeedback() {
  const { code, language, currentStep, steps, messages, directnessLevel = 0 } = useWorkspace();
  const [feedback, setFeedback] = useState<ProgressFeedback | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async () => {
    setAnalyzing(true);
    setError(null);

    // Aggregate session data
    const stats = getSessionStats();
    const interactions = getAllInteractions();

    // Extract topics from interactions
    const topicsCovered = [
      ...new Set(interactions.map((i) => i.topic).filter(Boolean)),
    ] as string[];

    // Count hint usage
    const hintCount = stats.byTag.hint || 0;
    const debugCount = stats.byTag.debug || 0;
    const socraticCount = stats.byTag.socratic || 0;

    // Calculate error patterns from debug interactions
    const errorPatterns: string[] = [];
    interactions
      .filter((i) => i.tag === 'debug')
      .forEach((i) => {
        if (i.assistantResponse.toLowerCase().includes('off-by-one'))
          errorPatterns.push('Off-by-one errors');
        if (i.assistantResponse.toLowerCase().includes('base case'))
          errorPatterns.push('Base case handling');
        if (i.assistantResponse.toLowerCase().includes('index'))
          errorPatterns.push('Array indexing');
      });

    // Deduplicate error patterns
    const uniquePatterns = [...new Set(errorPatterns)];

    const sessionData = {
      totalInteractions: stats.total,
      hintUsage: hintCount,
      debugSessions: debugCount,
      socraticExchanges: socraticCount,
      avgDirectness: Math.round(stats.avgDirectness * 10) / 10,
      errorPatterns: uniquePatterns,
      language,
      topicsCovered,
      currentStep,
      totalSteps: steps.length,
      messagesExchanged: messages.length,
    };

    const ctx = {
      code,
      language,
      activePage: 'progress',
      activeTab: 'flow',
      currentStep,
      steps,
      topic: 'Progress Review',
      learningMode: 'explore' as const,
      directnessLevel: directnessLevel ?? 0,
      conversationHistory: [],
    };

    const systemPrompt = buildSystemPrompt(ctx, 'progress');
    const userPrompt = `Analyze my session and give me feedback.\n\n${JSON.stringify(sessionData, null, 2)}`;

    try {
      const raw = await callAi({
        messages: [{ role: 'user', content: userPrompt }],
        systemPrompt,
        maxTokens: 1024,
        temperature: 0.5,
      });

      // Parse response into structured sections
      const strengthsMatch = raw.match(/Strengths?:?\s*\n([\s\S]*?)(?=Review|Next|Recommend|$)/i);
      const reviewMatch = raw.match(/Review[\s\S]*?:?\s*\n([\s\S]*?)(?=Next|Up|$)/i);
      const nextMatch = raw.match(/Next[\s\S]*?:?\s*\n([\s\S]*?)(?=##|$)/i);

      const parsed: ProgressFeedback = {
        strengths: strengthsMatch
          ? strengthsMatch[1].trim().split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)
          : [],
        reviewRecommendations: reviewMatch
          ? reviewMatch[1].trim().split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)
          : [],
        nextSteps: nextMatch
          ? nextMatch[1].trim().split('\n').map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)
          : [],
        rawResponse: raw,
        sessionSummary: {
          totalInteractions: stats.total,
          interactionBreakdown: stats.byTag,
          topicsCovered,
        },
      };

      setFeedback(parsed);
      logInteraction('progress', userPrompt, raw, 0, { topic: 'Progress Review' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Progress analysis failed');
    } finally {
      setAnalyzing(false);
    }
  }, [code, language, currentStep, steps, messages, directnessLevel]);

  const clear = useCallback(() => {
    setFeedback(null);
    setError(null);
  }, []);

  return { analyze, analyzing, feedback, error, clear };
}
