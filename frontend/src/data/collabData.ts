// ─── Collaboration & Social Learning Data Models ────────────────────────────
// Types for live collaboration, study groups, peer review, community forum,
// and AI moderation. In production these map to database tables.

// ── Student (minimal, references existing user system) ──────────────────────

export interface Student {
  id: string;
  name: string;
  avatar: string;
  color: string; // unique cursor color for collab
  xp: number;
  reputation: number;
}

// ── Live Collaboration ────────────────────────────────────────────────────

export interface CollaborationSession {
  id: string;
  title: string;
  hostId: string;
  code: string;
  language: string;
  participants: CollaborationParticipant[];
  createdAt: number;
  lastActive: number;
  groupId?: string; // linked to a study group
  projectId?: string; // linked to a curriculum project
  inviteCode: string; // short code to join
  isPublic: boolean;
}

export interface CollaborationParticipant {
  studentId: string;
  name: string;
  avatar: string;
  color: string;
  cursorPosition?: { line: number; column: number };
  selectionRange?: { startLine: number; startCol: number; endLine: number; endCol: number };
  isOnline: boolean;
  lastSeen: number;
}

export interface CursorPresence {
  studentId: string;
  name: string;
  color: string;
  avatar: string;
  position: { line: number; column: number };
  selection?: { startLine: number; startCol: number; endLine: number; endCol: number };
}

// ── Study Groups ───────────────────────────────────────────────────────────

export type GroupVisibility = 'public' | 'private';
export type MemberRole = 'creator' | 'member';

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topicFocus: string; // curriculum topic ID
  maxMembers: number;
  visibility: GroupVisibility;
  creatorId: string;
  members: GroupMember[];
  createdAt: number;
  lastActive: number;
  activityScore: number; // for sorting/recommendation
  topicsCovered: string[]; // topic IDs covered in this group
  inviteCode: string;
}

export interface GroupMember {
  studentId: string;
  name: string;
  avatar: string;
  role: MemberRole;
  joinedAt: number;
  xpEarned: number;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  content: string;
  timestamp: number;
  type: 'text' | 'code' | 'system';
}

export interface GroupSolution {
  id: string;
  groupId: string;
  studentId: string;
  studentName: string;
  title: string;
  code: string;
  language: string;
  topicId: string;
  createdAt: number;
  upvotes: number;
}

// ── Peer Code Review ───────────────────────────────────────────────────────

export type ReviewStatus = 'pending' | 'in-review' | 'completed' | 'closed';

export interface CodeReview {
  id: string;
  submitterId: string;
  submitterName: string;
  code: string;
  language: string;
  topicId: string; // which curriculum topic
  exerciseId?: string;
  challengeId?: string;
  projectId?: string;
  description: string; // what they want reviewed
  status: ReviewStatus;
  reviewers: ReviewAssignment[];
  comments: ReviewComment[];
  overallRating?: number; // 1-5
  overallFeedback?: string;
  createdAt: number;
  updatedAt: number;
  markedHelpfulBy: string[]; // reviewer IDs marked helpful by submitter
}

export interface ReviewAssignment {
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  xpReward: number;
  status: 'assigned' | 'completed' | 'declined';
  completedAt?: number;
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  reviewerId: string;
  reviewerName: string;
  line?: number; // inline comment on specific line
  content: string;
  createdAt: number;
  isResolved: boolean;
}

export interface ReviewerReputation {
  studentId: string;
  reviewsGiven: number;
  helpfulCount: number;
  totalXp: number;
}

// ── Community Forum ────────────────────────────────────────────────────────

export type ThreadStatus = 'open' | 'answered' | 'locked';
export type SortBy = 'recent' | 'upvoted' | 'unanswered';

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topicId: string; // linked to curriculum topic
  icon: string;
  threadCount: number;
}

export interface ForumThread {
  id: string;
  categoryId: string;
  topicId: string; // curriculum topic for tagging
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  codeSnippet?: { code: string; language: string };
  tags: string[];
  upvotes: number;
  upvotedBy: string[];
  replyCount: number;
  status: ThreadStatus;
  acceptedAnswerId?: string;
  createdAt: number;
  updatedAt: number;
  isAiModerated: boolean;
  moderationFlag?: ModerationFlag;
}

export interface ForumReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  codeSnippet?: { code: string; language: string };
  upvotes: number;
  upvotedBy: string[];
  isAcceptedAnswer: boolean;
  isAiGenerated: boolean;
  createdAt: number;
}

// ── AI Moderation ──────────────────────────────────────────────────────────

export type ModerationAction = 'none' | 'flag_hostile' | 'flag_offtopic' | 'flag_loweffort' | 'flag_spam';

export interface ModerationFlag {
  id: string;
  postId: string; // thread or reply ID
  postType: 'thread' | 'reply';
  action: ModerationAction;
  reason: string;
  confidence: number; // 0-1
  detectedBy: 'ai' | 'human';
  resolved: boolean;
  resolvedBy?: string;
  createdAt: number;
}

export interface SimilarityMatch {
  threadId: string;
  threadTitle: string;
  similarityScore: number; // 0-1
  hasAcceptedAnswer: boolean;
  replyCount: number;
}

export interface AiTutorReply {
  threadId: string;
  content: string;
  generatedAt: number;
  isPosted: boolean;
}

// ─ Notifications ──────────────────────────────────────────────────────────

export type NotificationType =
  | 'collab_invite'
  | 'collab_joined'
  | 'group_invite'
  | 'group_message'
  | 'review_assigned'
  | 'review_comment'
  | 'review_helpful'
  | 'forum_reply'
  | 'forum_upvote'
  | 'forum_accepted'
  | 'moderation_flag';

export interface Notification {
  id: string;
  studentId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: number;
}
