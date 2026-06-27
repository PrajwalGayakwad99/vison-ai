// ── usePeerReview Hook ────────────────────────────────────────────────────
// Manages code review submission, review queue, inline comments, and reputation.

import { useState, useCallback, useMemo } from 'react';
import type {
  CodeReview,
  ReviewComment,
  ReviewerReputation,
  Student,
} from '../data/collabData';
import { matchReviewers } from '../lib/collabGraph';
import { DEMO_REVIEWS, DEMO_REVIEWER_REPUTATIONS, DEMO_STUDENTS } from '../data/collabSeedData';

const MOCK_STUDENTS: Student[] = DEMO_STUDENTS;
const MOCK_REPUTATIONS: ReviewerReputation[] = DEMO_REVIEWER_REPUTATIONS;
const MOCK_REVIEWS: CodeReview[] = DEMO_REVIEWS as unknown as CodeReview[];

function loadReviews(): CodeReview[] {
  try { const raw = localStorage.getItem('axiom-reviews'); return raw ? JSON.parse(raw) : MOCK_REVIEWS; } catch { return MOCK_REVIEWS; }
}

function saveReviews(reviews: CodeReview[]) {
  try { localStorage.setItem('axiom-reviews', JSON.stringify(reviews)); } catch {}
}

export function usePeerReview(studentProgress: any) {
  const [reviews, setReviews] = useState<CodeReview[]>(loadReviews);
  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [view, setView] = useState<'queue' | 'submit' | 'detail'>('queue');

  const save = useCallback((updater: (r: CodeReview[]) => CodeReview[]) => {
    setReviews((prev) => {
      const next = updater(prev);
      saveReviews(next);
      return next;
    });
  }, []);

  // ── Derived Data ─────────────────────────────────────────────────────

  const activeReview = useMemo(
    () => reviews.find((r) => r.id === activeReviewId) || null,
    [reviews, activeReviewId]
  );

  const pendingReviews = useMemo(
    () => reviews.filter((r) => r.status === 'pending'),
    [reviews]
  );

  const myReviews = useMemo(
    () => reviews.filter((r) => r.submitterId === 'current-user'),
    [reviews]
  );

  const reviewsForMe = useMemo(
    () => reviews.filter((r) => r.reviewers.some((rev) => rev.reviewerId === 'current-user' && rev.status === 'assigned')),
    [reviews]
  );

  const myReputation: ReviewerReputation = useMemo(() => {
    const rep = MOCK_REPUTATIONS.find((r) => r.studentId === 'current-user');
    return rep || { studentId: 'current-user', reviewsGiven: 0, helpfulCount: 0, totalXp: 0 };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────

  const submitReview = useCallback((data: { code: string; language: string; topicId: string; description: string }) => {
    const review: CodeReview = {
      id: `review-${Date.now()}`,
      submitterId: 'current-user',
      submitterName: 'You',
      ...data,
      status: 'pending',
      reviewers: [],
      comments: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
      markedHelpfulBy: [],
    };

    const { matched } = matchReviewers(review, MOCK_STUDENTS, {}, MOCK_REPUTATIONS);

    if (matched.length > 0) {
      review.reviewers = matched.map((m: any) => ({
        reviewerId: m.studentId,
        reviewerName: m.studentName,
        reviewerAvatar: '',
        xpReward: m.xpReward,
        status: 'assigned' as const,
      }));
      review.status = 'in-review';
    }

    save((prev) => [...prev, review]);
    setActiveReviewId(review.id);
    setView('detail');
    return review;
  }, [save]);

  const addComment = useCallback((reviewId: string, content: string, line?: number) => {
    const comment: ReviewComment = {
      id: `c-${Date.now()}`,
      reviewId,
      reviewerId: 'current-user',
      reviewerName: 'You',
      line,
      content,
      createdAt: Date.now(),
      isResolved: false,
    };
    save((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, comments: [...r.comments, comment], updatedAt: Date.now() } : r
      )
    );
  }, [save]);

  const completeReview = useCallback((reviewId: string, rating: number, feedback: string) => {
    save((prev) =>
      prev.map((r) => {
        if (r.id !== reviewId) return r;
        const updatedReviewers = r.reviewers.map((rev) =>
          rev.reviewerId === 'current-user' ? { ...rev, status: 'completed' as const, completedAt: Date.now() } : rev
        );
        return {
          ...r,
          reviewers: updatedReviewers,
          overallRating: rating,
          overallFeedback: feedback,
          status: updatedReviewers.every((rev) => rev.status === 'completed') ? 'completed' : r.status,
          updatedAt: Date.now(),
        };
      })
    );
  }, [save]);

  const markHelpful = useCallback((reviewId: string, reviewerId: string) => {
    save((prev) =>
      prev.map((r) =>
        r.id === reviewId && !r.markedHelpfulBy.includes(reviewerId)
          ? { ...r, markedHelpfulBy: [...r.markedHelpfulBy, reviewerId] }
          : r
      )
    );
  }, [save]);

  const selectReview = useCallback((reviewId: string) => {
    setActiveReviewId(reviewId);
    setView('detail');
  }, []);

  const goBack = useCallback(() => {
    setActiveReviewId(null);
    setView('queue');
  }, []);

  return {
    reviews,
    activeReview,
    pendingReviews,
    myReviews,
    reviewsForMe,
    myReputation,
    view,
    activeReviewId,
    submitReview,
    addComment,
    completeReview,
    markHelpful,
    selectReview,
    goBack,
    setView,
  };
}
