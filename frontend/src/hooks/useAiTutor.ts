// ─── useAiTutor Hook ────────────────────────────────────────────────────
// Socratic chat with context-awareness, directness tracking, and streaming.

import { useState, useCallback, useRef } from 'react';
import { useWorkspace } from '../store/useWorkspace';
import { streamAiResponse } from '../lib/aiApi';
import { buildSystemPrompt, buildUserMessage } from '../lib/aiContext';
import { logInteraction } from '../lib/aiLogger';

const DIRECTNESS_KEYWORDS = [
  "don't know", "dont know", "no idea", "i'm stuck", "im stuck",
  "just tell me", "give me the answer", "what's the answer",
  "what is the answer", "show me", "i give up", "help me",
];

function detectDirectnessRequest(text: string): boolean {
  const lower = text.toLowerCase();
  return DIRECTNESS_KEYWORDS.some((kw) => lower.includes(kw));
}

export function useAiTutor() {
  const {
    code,
    language,
    activeTab,
    currentStep,
    steps,
    messages,
    addMessage,
  } = useWorkspace();

  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [directnessLevel, setDirectnessLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef(false);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim() || isStreaming) return;

      // Detect if student is asking for more direct help
      if (detectDirectnessRequest(text) && directnessLevel < 2) {
        setDirectnessLevel((prev) => Math.min(prev + 1, 2));
      }

      // Build conversation history (last 6 exchanges)
      const history = messages
        .slice(-12) // last 6 exchanges = 12 messages
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const ctx = {
        code,
        language,
        activePage: 'workspace',
        activeTab,
        currentStep,
        steps,
        topic: 'Fibonacci Algorithm - Iterative Implementation',
        learningMode: 'practice' as const,
        directnessLevel,
        conversationHistory: history,
      };

      const systemPrompt = buildSystemPrompt(ctx, 'chat');
      const userMsg = buildUserMessage(text);

      // Add user message immediately
      addMessage({ role: 'user', content: text });

      // Prepare streaming
      setIsStreaming(true);
      setStreamingText('');
      setError(null);
      abortRef.current = false;

      const assistantMsgId = `assistant-${Date.now()}`;

      streamAiResponse(
        { messages: [{ role: 'user', content: userMsg }], systemPrompt },
        // onChunk
        (chunk) => {
          if (abortRef.current) return;
          setStreamingText((prev) => prev + chunk);
        },
        // onComplete
        (finalText) => {
          if (abortRef.current) return;
          setIsStreaming(false);
          setStreamingText('');
          addMessage({ role: 'assistant', content: finalText });
          logInteraction(
            directnessLevel >= 2 ? 'direct_answer' : 'socratic',
            text,
            finalText,
            directnessLevel,
            { topic: ctx.topic, language }
          );
        },
        // onError
        (err) => {
          setIsStreaming(false);
          setError(err);
          setStreamingText('');
        }
      );
    },
    [code, language, activeTab, currentStep, steps, messages, addMessage, directnessLevel, streamingText]
  );

  const resetDirectness = useCallback(() => setDirectnessLevel(0), []);

  return {
    sendMessage,
    isStreaming,
    streamingText,
    directnessLevel,
    resetDirectness,
    error,
  };
}
