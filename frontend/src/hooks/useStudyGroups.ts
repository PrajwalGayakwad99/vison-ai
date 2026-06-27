// ── useStudyGroups Hook ───────────────────────────────────────────────────
// Manages study group CRUD, chat, solutions, member roster, and recommendations.
// Uses the matchStudyGroup function from collabGraph for intelligent matching.

import { useState, useCallback, useMemo } from 'react';
import type {
  StudyGroup,
  GroupMember,
  GroupMessage,
  GroupSolution,
  Student,
} from '../data/collabData';
import { matchStudyGroup, computeGroupActivityScore } from '../lib/collabGraph';
import type { Topic, StudentProgress } from '../data/curriculumData';
import { DEMO_GROUPS, DEMO_GROUP_MESSAGES, DEMO_GROUP_SOLUTIONS, DEMO_STUDENTS } from '../data/collabSeedData';

// Seed data from collabSeedData.ts
const MOCK_STUDENTS: Student[] = DEMO_STUDENTS;
const MOCK_GROUPS: StudyGroup[] = DEMO_GROUPS as unknown as StudyGroup[];
const MOCK_MESSAGES: Record<string, GroupMessage[]> = DEMO_GROUP_MESSAGES;
const MOCK_SOLUTIONS: Record<string, GroupSolution[]> = DEMO_GROUP_SOLUTIONS;

function loadGroups(): StudyGroup[] {
  try {
    const raw = localStorage.getItem('axiom-groups');
    return raw ? JSON.parse(raw) : MOCK_GROUPS;
  } catch { return MOCK_GROUPS; }
}

function saveGroups(groups: StudyGroup[]) {
  try { localStorage.setItem('axiom-groups', JSON.stringify(groups)); } catch {}
}

export function useStudyGroups(studentProgress: StudentProgress, currentTopic: Topic | null) {
  const [groups, setGroups] = useState<StudyGroup[]>(loadGroups);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, GroupMessage[]>>(MOCK_MESSAGES);
  const [solutions, setSolutions] = useState<Record<string, GroupSolution[]>>(MOCK_SOLUTIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const save = useCallback((updater: (g: StudyGroup[]) => StudyGroup[]) => {
    setGroups((prev) => {
      const next = updater(prev);
      saveGroups(next);
      return next;
    });
  }, []);

  // ── Derived Data ──────────────────────────────────────────────────────

  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) || null,
    [groups, activeGroupId]
  );

  const activeGroupMessages = useMemo(
    () => (activeGroupId ? messages[activeGroupId] || [] : []),
    [activeGroupId, messages]
  );

  const activeGroupSolutions = useMemo(
    () => (activeGroupId ? solutions[activeGroupId] || [] : []),
    [activeGroupId, solutions]
  );

  const recommendedGroups = useMemo(() => {
    const { recommended, reason } = matchStudyGroup(studentProgress, currentTopic, groups);
    return { groups: recommended, reason };
  }, [studentProgress, currentTopic, groups]);

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups;
    const q = searchQuery.toLowerCase();
    return groups.filter(
      (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.topicFocus.includes(q)
    );
  }, [groups, searchQuery]);

  // ── Actions ───────────────────────────────────────────────────────────

  const createGroup = useCallback((data: { name: string; description: string; topicFocus: string; maxMembers: number; visibility: 'public' | 'private' }) => {
    const newGroup: StudyGroup = {
      id: `group-${Date.now()}`,
      ...data,
      creatorId: 'current-user',
      members: [{ studentId: 'current-user', name: 'You', avatar: '👤', role: 'creator' as const, joinedAt: Date.now(), xpEarned: 0 }],
      createdAt: Date.now(),
      lastActive: Date.now(),
      activityScore: 10,
      topicsCovered: [data.topicFocus],
      inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
    };
    save((prev) => [...prev, newGroup]);
    setActiveGroupId(newGroup.id);
    return newGroup;
  }, [save]);

  const joinGroup = useCallback((groupId: string) => {
    save((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? {
              ...g,
              members: [...g.members, { studentId: 'current-user', name: 'You', avatar: '', role: 'member' as const, joinedAt: Date.now(), xpEarned: 0 }],
              lastActive: Date.now(),
            }
          : g
      )
    );
  }, [save]);

  const leaveGroup = useCallback((groupId: string) => {
    save((prev) =>
      prev
        .map((g) =>
          g.id === groupId
            ? { ...g, members: g.members.filter((m) => m.studentId !== 'current-user') }
            : g
        )
        .filter((g) => g.members.length > 0)
    );
    if (activeGroupId === groupId) setActiveGroupId(null);
  }, [save, activeGroupId]);

  const sendMessage = useCallback((groupId: string, content: string, type: 'text' | 'code' = 'text') => {
    const msg: GroupMessage = {
      id: `msg-${Date.now()}`,
      groupId,
      studentId: 'current-user',
      studentName: 'You',
      studentAvatar: '',
      content,
      timestamp: Date.now(),
      type,
    };
    setMessages((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), msg],
    }));
    save((prev) =>
      prev.map((g) =>
        g.id === groupId ? { ...g, lastActive: Date.now(), activityScore: g.activityScore + 1 } : g
      )
    );
  }, [save]);

  const postSolution = useCallback((groupId: string, data: { title: string; code: string; language: string; topicId: string }) => {
    const solution: GroupSolution = {
      id: `sol-${Date.now()}`,
      groupId,
      studentId: 'current-user',
      studentName: 'You',
      ...data,
      createdAt: Date.now(),
      upvotes: 0,
    };
    setSolutions((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), solution],
    }));
  }, []);

  const selectGroup = useCallback((groupId: string) => {
    setActiveGroupId(groupId);
  }, []);

  const goBack = useCallback(() => {
    setActiveGroupId(null);
  }, []);

  return {
    groups: filteredGroups,
    activeGroup,
    activeGroupMessages,
    activeGroupSolutions,
    recommendedGroups,
    activeGroupId,
    searchQuery,
    setSearchQuery,
    createGroup,
    joinGroup,
    leaveGroup,
    sendMessage,
    postSolution,
    selectGroup,
    goBack,
  };
}
