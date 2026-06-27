// ── useForum Hook ─────────────────────────────────────────────────────────
// Manages forum categories, threads, replies, upvotes, search, and sorting.

import { useState, useCallback, useMemo } from 'react';
import type { ForumCategory, ForumThread, ForumReply, SortBy } from '../data/collabData';
import { findSimilarThreads } from '../lib/collabGraph';
import { DEMO_FORUM_CATEGORIES, DEMO_FORUM_THREADS, DEMO_FORUM_REPLIES } from '../data/collabSeedData';

const MOCK_CATEGORIES: ForumCategory[] = DEMO_FORUM_CATEGORIES;
const MOCK_THREADS: ForumThread[] = DEMO_FORUM_THREADS as unknown as ForumThread[];
const MOCK_REPLIES: Record<string, ForumReply[]> = DEMO_FORUM_REPLIES;

function loadThreads(): ForumThread[] {
  try { const raw = localStorage.getItem('axiom-forum-threads'); return raw ? JSON.parse(raw) : MOCK_THREADS; } catch { return MOCK_THREADS; }
}

function saveThreads(threads: ForumThread[]) {
  try { localStorage.setItem('axiom-forum-threads', JSON.stringify(threads)); } catch {}
}

function loadReplies(): Record<string, ForumReply[]> {
  try { const raw = localStorage.getItem('axiom-forum-replies'); return raw ? JSON.parse(raw) : MOCK_REPLIES; } catch { return MOCK_REPLIES; }
}

function saveReplies(replies: Record<string, ForumReply[]>) {
  try { localStorage.setItem('axiom-forum-replies', JSON.stringify(replies)); } catch {}
}

export function useForum() {
  const [threads, setThreads] = useState<ForumThread[]>(loadThreads);
  const [replies, setReplies] = useState<Record<string, ForumReply[]>>(loadReplies);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopicId, setFilterTopicId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'thread'>('list');

  const saveT = useCallback((updater: (t: ForumThread[]) => ForumThread[]) => {
    setThreads((prev) => {
      const next = updater(prev);
      saveThreads(next);
      return next;
    });
  }, []);

  const saveR = useCallback((updater: (r: Record<string, ForumReply[]>) => Record<string, ForumReply[]>) => {
    setReplies((prev) => {
      const next = updater(prev);
      saveReplies(next);
      return next;
    });
  }, []);

  // ── Derived Data ─────────────────────────────────────────────────────

  const categories: ForumCategory[] = MOCK_CATEGORIES;

  const activeThread = useMemo(
    () => threads.find((t) => t.id === activeThreadId) || null,
    [threads, activeThreadId]
  );

  const activeThreadReplies = useMemo(
    () => (activeThreadId ? replies[activeThreadId] || [] : []),
    [activeThreadId, replies]
  );

  const filteredThreads = useMemo(() => {
    let result = [...threads];

    if (filterTopicId) {
      result = result.filter((t) => t.topicId === filterTopicId);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) => t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q))
      );
    }

    switch (sortBy) {
      case 'recent':
        result.sort((a, b) => b.updatedAt - a.updatedAt);
        break;
      case 'upvoted':
        result.sort((a, b) => b.upvotes - a.upvotes);
        break;
      case 'unanswered':
        result = result.filter((t) => t.replyCount === 0 || t.status === 'open');
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    return result;
  }, [threads, sortBy, searchQuery, filterTopicId]);

  // Similar threads for "did you mean?"
  const similarThreads = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const { similar } = findSimilarThreads(searchQuery, '', threads, filterTopicId || '');
    return similar;
  }, [searchQuery, threads, filterTopicId]);

  const unansweredThreads = useMemo(
    () => threads.filter((t) => t.replyCount === 0 || t.status === 'open').length,
    [threads]
  );

  // ── Actions ───────────────────────────────────────────────────────────

  const createThread = useCallback((data: { categoryId: string; topicId: string; title: string; content: string; codeSnippet?: { code: string; language: string }; tags: string[] }) => {
    const thread: ForumThread = {
      id: `thread-${Date.now()}`,
      ...data,
      authorId: 'current-user',
      authorName: 'You',
      authorAvatar: '',
      upvotes: 0,
      upvotedBy: [],
      replyCount: 0,
      status: 'open',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isAiModerated: false,
    };
    saveT((prev) => [thread, ...prev]);
    setActiveThreadId(thread.id);
    setView('thread');
    return thread;
  }, [saveT]);

  const addReply = useCallback((threadId: string, content: string, codeSnippet?: { code: string; language: string }, isAiGenerated = false) => {
    const reply: ForumReply = {
      id: `reply-${Date.now()}`,
      threadId,
      authorId: 'current-user',
      authorName: 'You',
      authorAvatar: '',
      content,
      codeSnippet,
      upvotes: 0,
      upvotedBy: [],
      isAcceptedAnswer: false,
      isAiGenerated,
      createdAt: Date.now(),
    };
    saveR((prev) => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), reply],
    }));
    saveT((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, replyCount: t.replyCount + 1, updatedAt: Date.now() }
          : t
      )
    );
  }, [saveR, saveT]);

  const upvoteThread = useCallback((threadId: string) => {
    saveT((prev) =>
      prev.map((t) => {
        if (t.id !== threadId) return t;
        const hasUpvoted = t.upvotedBy.includes('current-user');
        return {
          ...t,
          upvotes: hasUpvoted ? t.upvotes - 1 : t.upvotes + 1,
          upvotedBy: hasUpvoted ? t.upvotedBy.filter((id) => id !== 'current-user') : [...t.upvotedBy, 'current-user'],
        };
      })
    );
  }, [saveT]);

  const upvoteReply = useCallback((threadId: string, replyId: string) => {
    saveR((prev) => {
      const threadReplies = prev[threadId] || [];
      return {
        ...prev,
        [threadId]: threadReplies.map((r) => {
          if (r.id !== replyId) return r;
          const hasUpvoted = r.upvotedBy.includes('current-user');
          return {
            ...r,
            upvotes: hasUpvoted ? r.upvotes - 1 : r.upvotes + 1,
            upvotedBy: hasUpvoted ? r.upvotedBy.filter((id) => id !== 'current-user') : [...r.upvotedBy, 'current-user'],
          };
        }),
      };
    });
  }, [saveR]);

  const acceptAnswer = useCallback((threadId: string, replyId: string) => {
    saveR((prev) => ({
      ...prev,
      [threadId]: (prev[threadId] || []).map((r) => ({
        ...r,
        isAcceptedAnswer: r.id === replyId,
      })),
    }));
    saveT((prev) =>
      prev.map((t) =>
        t.id === threadId ? { ...t, status: 'answered' as const, acceptedAnswerId: replyId } : t
      )
    );
  }, [saveR, saveT]);

  const selectThread = useCallback((threadId: string) => {
    setActiveThreadId(threadId);
    setView('thread');
  }, []);

  const goBack = useCallback(() => {
    setActiveThreadId(null);
    setView('list');
  }, []);

  return {
    categories,
    threads: filteredThreads,
    allThreads: threads,
    activeThread,
    activeThreadReplies,
    similarThreads,
    unansweredThreads,
    sortBy,
    searchQuery,
    filterTopicId,
    view,
    activeThreadId,
    setSortBy,
    setSearchQuery,
    setFilterTopicId,
    createThread,
    addReply,
    upvoteThread,
    upvoteReply,
    acceptAnswer,
    selectThread,
    goBack,
  };
}
