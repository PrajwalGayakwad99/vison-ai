// ─── Collaboration Matching Engine ──────────────────────────────────────────
// Standalone, testable matching functions for study groups and peer reviews.
// No React dependencies — pure functions.
//
// Database schema suggestion:
//
//   students (id, name, avatar, color, xp, reputation)
//   collab_sessions (id, title, host_id, code, language, invite_code, is_public, group_id, project_id)
//   collab_participants (session_id, student_id, color, is_online)
//   study_groups (id, name, description, topic_focus, max_members, visibility, creator_id, invite_code)
//   group_members (group_id, student_id, role, joined_at, xp_earned)
//   group_messages (id, group_id, student_id, content, type, timestamp)
//   group_solutions (id, group_id, student_id, title, code, language, topic_id)
//   code_reviews (id, submitter_id, code, language, topic_id, description, status)
//   review_assignments (review_id, reviewer_id, xp_reward, status)
//   review_comments (id, review_id, reviewer_id, line, content)
//   forum_categories (id, name, description, topic_id, icon)
//   forum_threads (id, category_id, topic_id, author_id, title, content, status)
//   forum_replies (id, thread_id, author_id, content, is_accepted_answer, is_ai_generated)
//   moderation_flags (id, post_id, post_type, action, reason, confidence, resolved)
//   notifications (id, student_id, type, title, message, link, read)

import type {
  StudyGroup,
  CodeReview,
  ReviewerReputation,
  Student,
  ForumThread,
} from '../data/collabData';
import type { Topic, StudentProgress } from '../data/curriculumData';
import { resolveStatus } from './curriculumGraph';

// ── Match Study Group ──────────────────────────────────────────────────────
// Suggests groups based on student's current curriculum topic and progress.
// Prioritizes: same topic > similar difficulty > active groups > available spots.

export function matchStudyGroup(
  studentProgress: StudentProgress,
  studentTopic: Topic | null,
  availableGroups: StudyGroup[]
): { recommended: StudyGroup[]; reason: string } {
  if (!studentTopic) {
    // No current topic — suggest popular active groups
    const sorted = [...availableGroups]
      .filter((g) => g.members.length < g.maxMembers)
      .sort((a, b) => b.activityScore - a.activityScore);
    return {
      recommended: sorted.slice(0, 5),
      reason: 'Showing active groups. Complete a topic for better recommendations.',
    };
  }

  const scored = availableGroups
    .filter((g) => g.members.length < g.maxMembers)
    .map((group) => {
      let score = 0;

      // Exact topic match (highest priority)
      if (group.topicFocus === studentTopic.id) {
        score += 100;
      }

      // Group covers this topic
      if (group.topicsCovered.includes(studentTopic.id)) {
        score += 50;
      }

      // Difficulty alignment — match students at similar level
      const studentMastery = getStudentMastery(studentTopic.id, studentProgress);
      const groupAvgMastery = getGroupAvgMastery(group, studentProgress);
      const masteryDiff = Math.abs(studentMastery - groupAvgMastery);
      score += Math.max(0, 30 - masteryDiff); // Closer mastery = higher score

      // Activity score
      score += group.activityScore * 0.5;

      // Available spots bonus
      const spotsLeft = group.maxMembers - group.members.length;
      score += spotsLeft * 5;

      return { group, score };
    })
    .sort((a, b) => b.score - a.score);

  const recommended = scored.slice(0, 5).map((s) => s.group);

  const reason = studentTopic
    ? `Recommended based on your current topic: "${studentTopic.title}" (${getStudentMastery(studentTopic.id, studentProgress)}% mastery)`
    : 'Showing most active groups';

  return { recommended, reason };
}

function getStudentMastery(topicId: string, progress: StudentProgress): number {
  const tp = progress.topicProgress[topicId];
  if (!tp) return 0;
  const mc = tp.modeCompletion;
  return Math.round(
    ((mc.explanationViewed ? 0.1 : 0) +
      (mc.visualizationInteracted ? 0.1 : 0) +
      (mc.exercisesTotal > 0 ? (mc.exercisesPassed / mc.exercisesTotal) * 0.4 : 0) +
      (mc.challengesTotal > 0 ? (mc.challengesPassed / mc.challengesTotal) * 0.4 : 0)) * 100
  );
}

function getGroupAvgMastery(group: StudyGroup, progress: StudentProgress): number {
  const scores = group.members
    .map((m) => getStudentMastery(group.topicFocus, progress))
    .filter((s) => s > 0);
  if (scores.length === 0) return 50;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

// ── Match Reviewers ────────────────────────────────────────────────────────
// Finds 2-3 peers who have mastered the same topic for peer review.

export function matchReviewers(
  review: CodeReview,
  allStudents: Student[],
  studentProgress: Record<string, StudentProgress>,
  existingReviewers: ReviewerReputation[]
): { matched: ReviewerReputation[]; reason: string } {
  // Find students who have mastered this topic
  const qualified = allStudents
    .filter((s) => s.id !== review.submitterId) // not self
    .map((student) => {
      const progress = studentProgress[student.id];
      if (!progress) return null;
      const mastery = getStudentMastery(review.topicId, progress);
      return { student, mastery };
    })
    .filter((r): r is { student: Student; mastery: number } => r !== null && r.mastery >= 80);

  if (qualified.length === 0) {
    return {
      matched: [],
      reason: 'No qualified reviewers found. AI review will be provided instead.',
    };
  }

  // Score by: mastery level + reputation + XP (to distribute load)
  const scored = qualified
    .map(({ student, mastery }) => {
      const rep = existingReviewers.find((r) => r.studentId === student.id);
      const reviewsGiven = rep?.reviewsGiven || 0;
      const helpfulRate = rep && rep.reviewsGiven > 0 ? rep.helpfulCount / rep.reviewsGiven : 0;

      // Score: mastery (40%) + helpful rate (40%) - reviews given load balancing (20%)
      const score = mastery * 0.4 + helpfulRate * 40 + Math.max(0, 20 - reviewsGiven * 2);

      return {
        studentId: student.id,
        studentName: student.name,
        studentAvatar: student.avatar,
        mastery,
        reviewsGiven,
        helpfulRate,
        helpfulCount: rep?.helpfulCount || 0,
        totalXp: 0,
        score,
        xpReward: mastery >= 90 ? 15 : mastery >= 80 ? 10 : 5,
      };
    })
    .sort((a, b) => b.score - a.score);

  const matched = scored.slice(0, 3);

  return {
    matched,
    reason: `Found ${matched.length} qualified reviewers who have mastered "${review.topicId}"`,
  };
}

// ── Forum Thread Similarity ───────────────────────────────────────────────
// Finds similar threads for the "did you mean?" suggestion.

export function findSimilarThreads(
  newTitle: string,
  newContent: string,
  existingThreads: ForumThread[],
  topicId: string
): { similar: ForumThread[]; shouldSuggest: boolean } {
  const newWords = extractKeywords(`${newTitle} ${newContent}`);

  const scored = existingThreads
    .filter((t) => t.topicId === topicId || t.topicId === '') // same topic or untagged
    .map((thread) => {
      const threadWords = extractKeywords(`${thread.title} ${thread.content}`);
      const overlap = newWords.filter((w) => threadWords.includes(w)).length;
      const totalUnique = new Set([...newWords, ...threadWords]).size;
      const similarity = totalUnique > 0 ? overlap / totalUnique : 0;

      return { thread, similarity };
    })
    .filter((s) => s.similarity > 0.3) // minimum threshold
    .sort((a, b) => b.similarity - a.similarity);

  const similar = scored.slice(0, 3).map((s) => s.thread);
  const shouldSuggest = similar.length > 0 && scored[0]?.similarity > 0.5;

  return { similar, shouldSuggest };
}

function extractKeywords(text: string): string[] {
  const stopwords = new Set([
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'shall', 'can', 'need', 'must', 'ought',
    'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'him', 'she', 'her',
    'it', 'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom',
    'this', 'that', 'these', 'those', 'and', 'but', 'or', 'nor', 'not',
    'so', 'yet', 'both', 'either', 'neither', 'each', 'every', 'all',
    'any', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'only',
    'own', 'same', 'than', 'too', 'very', 'just', 'because', 'as', 'until',
    'while', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'out', 'off', 'over', 'under',
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
    'why', 'how', 'get', 'got', 'like', 'make', 'way', 'much', 'many',
    'using', 'use', 'help', 'pls', 'please', 'give', 'why', 'does', 'not',
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopwords.has(w));
}

// ── Group Activity Score ───────────────────────────────────────────────────
// Computes a group's activity score for sorting recommendations.

export function computeGroupActivityScore(
  group: StudyGroup,
  messageCount: number,
  solutionCount: number,
  daysSinceLastActive: number
): number {
  const recencyFactor = Math.max(0, 1 - daysSinceLastActive / 30); // decays over 30 days
  const engagementScore = (messageCount * 0.5 + solutionCount * 2) * recencyFactor;
  const memberFactor = group.members.length / group.maxMembers;

  return Math.round(engagementScore * memberFactor * 10);
}
