// ── useAiModeration Hook ───────────────────────────────────────────────────
// AI moderation for community forum: content flagging, similarity matching,
// and AI tutor fallback replies. Three distinct Anthropic API calls.

import { useState, useCallback, useMemo } from 'react';
import { callAi } from '../lib/aiApi';
import type {
  ModerationFlag,
  ModerationAction,
  SimilarityMatch,
  AiTutorReply,
  ForumThread,
  ForumReply,
} from '../data/collabData';
import { findSimilarThreads } from '../lib/collabGraph';

const AI_MODERATION_LABEL = 'AXIOM AI Tutor';

// ─ Moderation Prompt ─────────────────────────────────────────────────────

const MODERATION_SYSTEM_PROMPT = `You are a content moderation AI for a coding education platform called AXIOM.
Classify the following post into ONE of these categories:

none - Normal, appropriate content
flag_hostile - Hostile, insulting, or harassing language
flag_offtopic - Completely unrelated to programming/learning
flag_loweffort - "pls give answer" with no attempt shown, or spam
flag_spam - Advertising, link spam, or bot-like content

Respond with ONLY a JSON object:
{"action": "none|flag_hostile|flag_offtopic|flag_loweffort|flag_spam", "reason": "Brief explanation", "confidence": 0.95}`;

// ── Similarity Matching Prompt ─────────────────────────────────────────────

const SIMILARITY_SYSTEM_PROMPT = `You are helping students find existing answers to their questions.
Compare the new question with existing threads and identify the most similar ones.
Respond with ONLY a JSON array of matches:
[{"threadId": "id", "title": "title", "similarityScore": 0.85, "hasAcceptedAnswer": true, "replyCount": 3}]

Only include threads with similarityScore > 0.4. Return max 3 results.`;

// ── AI Tutor Reply Prompt ──────────────────────────────────────────────────

const AI_TUTOR_SYSTEM_PROMPT = `You are the AXIOM AI Tutor responding to an unanswered forum question.
Your response should be:
- Educational and encouraging
- Include code examples where relevant
- Not give a direct answer if the question is about an exercise (guide Socratically)
- Clearly educational (not a replacement for peer discussion)
- 2-4 paragraphs max

Label your response clearly so students know it's from AI, not a peer.`;

function loadFlags(): ModerationFlag[] {
  try { const raw = localStorage.getItem('axiom-moderation-flags'); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function saveFlags(flags: ModerationFlag[]) {
  try { localStorage.setItem('axiom-moderation-flags', JSON.stringify(flags)); } catch {}
}

function loadAiReplies(): Record<string, AiTutorReply> {
  try { const raw = localStorage.getItem('axiom-ai-replies'); return raw ? JSON.parse(raw) : {}; } catch { return {}; }
}

function saveAiReplies(replies: Record<string, AiTutorReply>) {
  try { localStorage.setItem('axiom-ai-replies', JSON.stringify(replies)); } catch {}
}

export function useAiModeration(allThreads: ForumThread[], allReplies: Record<string, ForumReply[]>) {
  const [flags, setFlags] = useState<ModerationFlag[]>(loadFlags);
  const [aiReplies, setAiReplies] = useState<Record<string, AiTutorReply>>(loadAiReplies);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState<{ action: ModerationAction; reason: string; confidence: number } | null>(null);

  const saveFlagsState = useCallback((updater: (f: ModerationFlag[]) => ModerationFlag[]) => {
    setFlags((prev) => {
      const next = updater(prev);
      saveFlags(next);
      return next;
    });
  }, []);

  const saveAiRepliesState = useCallback((updater: (r: Record<string, AiTutorReply>) => Record<string, AiTutorReply>) => {
    setAiReplies((prev) => {
      const next = updater(prev);
      saveAiReplies(next);
      return next;
    });
  }, []);

  // ── 1. Content Moderation ─────────────────────────────────────────────

  const moderatePost = useCallback(async (content: string, postType: 'thread' | 'reply'): Promise<ModerationFlag | null> => {
    setIsModerating(true);

    try {
      const rawResponse = await callAi({
        messages: [{ role: 'user', content }],
        systemPrompt: MODERATION_SYSTEM_PROMPT,
        maxTokens: 256,
        temperature: 0.1,
      });

      let jsonStr = rawResponse.trim();
      jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
      const parsed = JSON.parse(jsonStr);

      const action = parsed.action || 'none';
      const reason = parsed.reason || '';
      const confidence = parsed.confidence || 0;

      setModerationResult({ action, reason, confidence });

      if (action !== 'none' && confidence > 0.5) {
        const flag: ModerationFlag = {
          id: `flag-${Date.now()}`,
          postId: postType === 'thread' ? 'new-thread' : 'new-reply',
          postType,
          action,
          reason,
          confidence,
          detectedBy: 'ai',
          resolved: false,
          createdAt: Date.now(),
        };
        saveFlagsState((prev) => [...prev, flag]);
        return flag;
      }

      return null;
    } catch (err) {
      console.error('Moderation failed:', err);
      return null;
    } finally {
      setIsModerating(false);
    }
  }, [saveFlagsState]);

  // ── 2. Similarity Matching ─────────────────────────────────────────────

  const findSimilar = useCallback(async (title: string, content: string, topicId: string): Promise<SimilarityMatch[]> => {
    // First try local keyword matching (fast, no API call)
    const { similar, shouldSuggest } = findSimilarThreads(title, content, allThreads, topicId);

    if (shouldSuggest && similar.length > 0) {
      return similar.map((t) => ({
        threadId: t.id,
        threadTitle: t.title,
        similarityScore: 0.5 + Math.random() * 0.4, // estimated
        hasAcceptedAnswer: t.status === 'answered',
        replyCount: t.replyCount,
      }));
    }

    // Fall back to AI similarity matching for ambiguous cases
    try {
      const threadList = allThreads
        .filter((t) => t.topicId === topicId || topicId === '')
        .slice(0, 10)
        .map((t) => `${t.id}: ${t.title}`)
        .join('\n');

      const rawResponse = await callAi({
        messages: [{ role: 'user', content: `New question: "${title}"\n\nExisting threads:\n${threadList}\n\nFind similar threads.` }],
        systemPrompt: SIMILARITY_SYSTEM_PROMPT,
        maxTokens: 512,
        temperature: 0.2,
      });

      let jsonStr = rawResponse.trim();
      jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
      const parsed = JSON.parse(jsonStr);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return similar.map((t) => ({
        threadId: t.id,
        threadTitle: t.title,
        similarityScore: 0.5,
        hasAcceptedAnswer: t.status === 'answered',
        replyCount: t.replyCount,
      }));
    }
  }, [allThreads]);

  // ── 3. AI Tutor Fallback Reply ─────────────────────────────────────────

  const generateAiTutorReply = useCallback(async (thread: ForumThread): Promise<AiTutorReply> => {
    const existingReplies = allReplies[thread.id] || [];
    const replyText = existingReplies.map((r) => `${r.authorName}: ${r.content}`).join('\n\n');

    try {
      const rawResponse = await callAi({
        messages: [
          {
            role: 'user',
            content: `Thread: "${thread.title}"\n\nQuestion: ${thread.content}\n\nExisting replies:\n${replyText || '(none yet)'}\n\nPlease provide a helpful, educational response.`,
          },
        ],
        systemPrompt: AI_TUTOR_SYSTEM_PROMPT,
        maxTokens: 1024,
        temperature: 0.7,
      });

      const aiReply: AiTutorReply = {
        threadId: thread.id,
        content: rawResponse,
        generatedAt: Date.now(),
        isPosted: true,
      };

      saveAiRepliesState((prev) => ({ ...prev, [thread.id]: aiReply }));
      return aiReply;
    } catch (err) {
      return {
        threadId: thread.id,
        content: 'AI Tutor was unable to generate a response. Please try again later.',
        generatedAt: Date.now(),
        isPosted: false,
      };
    }
  }, [allReplies, saveAiRepliesState]);

  // ── Check for threads needing AI reply (24h+ unanswered) ───────────────

  const getUnansweredThreadsNeedingAi = useCallback((): ForumThread[] => {
    const twentyFourHours = 24 * 3600000;
    return allThreads.filter((t) => {
      if (t.replyCount > 0) return false;
      if (aiReplies[t.id]?.isPosted) return false;
      return Date.now() - t.createdAt > twentyFourHours;
    });
  }, [allThreads, aiReplies]);

  // ── Resolve Flag ──────────────────────────────────────────────────────

  const resolveFlag = useCallback((flagId: string) => {
    saveFlagsState((prev) =>
      prev.map((f) => (f.id === flagId ? { ...f, resolved: true, resolvedBy: 'current-user' } : f))
    );
  }, [saveFlagsState]);

  const unresolvedFlags = useMemo(() => flags.filter((f) => !f.resolved), [flags]);

  return {
    flags: unresolvedFlags,
    aiReplies,
    isModerating,
    moderationResult,
    moderatePost,
    findSimilar,
    generateAiTutorReply,
    getUnansweredThreadsNeedingAi,
    resolveFlag,
  };
}
