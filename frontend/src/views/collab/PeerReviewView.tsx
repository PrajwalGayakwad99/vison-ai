// ── Peer Review View ──────────────────────────────────────────────────────
// Full UI for peer code review: submission queue, detail view with inline
// comments, overall ratings, and reputation tracking.

import React, { useState } from 'react';
import { usePeerReview } from '../../hooks/usePeerReview';
import { useCurriculum } from '../../hooks/useCurriculum';
import { FileCode, MessageSquare, Star, ArrowLeft, Plus, Check, Eye, ThumbsUp, Users, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Review Queue View ────────────────────────────────────────────────────

function ReviewQueueView() {
  const { progress, activeTopic } = useCurriculum();
  const {
    reviews, pendingReviews, myReviews, reviewsForMe, myReputation,
    selectReview, setView, submitReview,
  } = usePeerReview(progress);

  const [showSubmit, setShowSubmit] = useState(false);
  const [submitCode, setSubmitCode] = useState('');
  const [submitLang, setSubmitLang] = useState('java');
  const [submitTopic, setSubmitTopic] = useState('');
  const [submitDesc, setSubmitDesc] = useState('');

  const tabs = [
    { id: 'queue', label: 'Review Queue', count: pendingReviews.length, icon: FileCode },
    { id: 'assigned', label: 'Assigned to Me', count: reviewsForMe.length, icon: Users },
    { id: 'mine', label: 'My Submissions', count: myReviews.length, icon: Eye },
  ];

  const [activeTab, setActiveTab] = useState<'queue' | 'assigned' | 'mine'>('queue');

  const displayReviews = activeTab === 'queue' ? pendingReviews : activeTab === 'assigned' ? reviewsForMe : myReviews;

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    pending: { bg: 'rgba(251,146,60,0.1)', text: '#FB923C', border: 'rgba(251,146,60,0.2)' },
    'in-review': { bg: 'rgba(167,139,250,0.1)', text: '#A78BFA', border: 'rgba(167,139,250,0.2)' },
    completed: { bg: 'rgba(52,211,153,0.1)', text: '#34D399', border: 'rgba(52,211,153,0.2)' },
  };

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[20px] font-bold text-[#F5F5F7]">Peer Code Review</h1>
            <p className="text-[12px] text-[#8B8A99] mt-0.5">Get feedback from peers who've mastered the same topics.</p>
          </div>
          <button
            onClick={() => setShowSubmit(!showSubmit)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#A78BFA] border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 transition-all"
          >
            <Plus size={13} /> Submit for Review
          </button>
        </div>

        {/* Reputation Card */}
        <div className="flex items-center gap-4 mb-3 px-3 py-2 rounded-xl bg-[#1E1D27] border border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-[11px] text-[#8B8A99]">
            <Award size={12} className="text-[#F59E0B]" />
            <span><strong className="text-[#F5F5F7]">{myReputation.reviewsGiven}</strong> reviews given</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8B8A99]">
            <ThumbsUp size={12} className="text-[#34D399]" />
            <span><strong className="text-[#F5F5F7]">{myReputation.helpfulCount}</strong> marked helpful</span>
          </div>
          <div className="ml-auto text-[11px] text-[#8B8A99]">
            <strong className="text-[#F5F5F7]">{myReputation.totalXp}</strong> review XP
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-semibold transition-all ${
                activeTab === t.id ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'text-[#6B6A78] border border-transparent'
              }`}
            >
              <t.icon size={12} />
              {t.label}
              {t.count > 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-[#8B8A99]">{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Form */}
      <AnimatePresence>
        {showSubmit && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-b border-white/[0.05] bg-[#1E1D27]">
            <div className="px-6 py-4">
              <h3 className="text-[13px] font-bold text-[#F5F5F7] mb-3">Submit Code for Review</h3>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Topic ID (e.g. recursion)" value={submitTopic} onChange={(e) => setSubmitTopic(e.target.value)} className="px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none" />
                <select value={submitLang} onChange={(e) => setSubmitLang(e.target.value)} className="px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none">
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                </select>
                <input placeholder="What do you want reviewed?" value={submitDesc} onChange={(e) => setSubmitDesc(e.target.value)} className="col-span-2 px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none" />
                <textarea placeholder="Paste your code here..." value={submitCode} onChange={(e) => setSubmitCode(e.target.value)} rows={5} className="col-span-2 px-3 py-2 rounded-lg text-[11px] font-mono bg-[#14131A] border border-white/[0.06] text-[#C4C3D0] outline-none resize-none" />
                <button onClick={() => { submitReview({ code: submitCode, language: submitLang, topicId: submitTopic, description: submitDesc }); setShowSubmit(false); }} className="col-span-2 px-4 py-2 rounded-lg text-[11px] font-bold text-white bg-violet-500 hover:bg-violet-600 transition-all">Submit for Review</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review List */}
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
        <div className="flex flex-col gap-3">
          {displayReviews.map((review) => {
            const status = statusColors[review.status] || statusColors.pending;
            return (
              <button
                key={review.id}
                onClick={() => selectReview(review.id)}
                className="w-full text-left p-4 rounded-xl border transition-all hover:bg-white/[0.02]"
                style={{ background: '#1E1D27', borderColor: status.border }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: status.bg }}>
                    <FileCode size={14} style={{ color: status.text }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-[13px] font-bold text-[#F5F5F7] truncate">{review.description.slice(0, 60)}...</h3>
                      <span className="text-[9px] px-2 py-0.5 rounded font-bold shrink-0" style={{ background: status.bg, color: status.text, border: `1px solid ${status.border}` }}>
                        {review.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#6B6A78]">
                      <span>by {review.submitterName}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA]">{review.language}</span>
                      {review.reviewers.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users size={10} />
                          {review.reviewers.length} reviewer{review.reviewers.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {review.comments.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare size={10} />
                          {review.comments.length} comment{review.comments.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
          {displayReviews.length === 0 && (
            <div className="text-center py-12">
              <FileCode size={24} className="text-[#6B6A78]/30 mx-auto mb-3" />
              <p className="text-[13px] text-[#6B6A78]">No reviews in this tab yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Review Detail View ───────────────────────────────────────────────────

function ReviewDetailView() {
  const {
    activeReview, addComment, completeReview, markHelpful, goBack,
  } = usePeerReview(null);
  const [commentText, setCommentText] = useState('');
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [showComplete, setShowComplete] = useState(false);

  if (!activeReview) return null;

  const lines = activeReview.code.split('\n');

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
        <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] transition-all">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-bold text-[#F5F5F7] truncate">{activeReview.description}</h2>
          <p className="text-[11px] text-[#8B8A99]">by {activeReview.submitterName} · {activeReview.language}</p>
        </div>
        <span className={`text-[10px] px-2 py-1 rounded-lg font-bold shrink-0 ${
          activeReview.status === 'completed' ? 'bg-emerald-500/10 text-[#34D399]' : activeReview.status === 'in-review' ? 'bg-violet-500/10 text-[#A78BFA]' : 'bg-orange-500/10 text-[#FB923C]'
        }`}>
          {activeReview.status}
        </span>
      </div>

      {/* Code + Comments */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        {/* Code Block */}
        <div className="px-6 py-4">
          <div className="rounded-xl bg-[#1E1D27] border border-white/[0.04] overflow-hidden">
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const lineComments = activeReview.comments.filter((c) => c.line === lineNum);
              return (
                <div key={i} className="flex group">
                  <button
                    onClick={() => setSelectedLine(selectedLine === lineNum ? null : lineNum)}
                    className={`w-10 shrink-0 text-right pr-3 py-0.5 text-[10px] font-mono transition-colors cursor-pointer ${
                      selectedLine === lineNum ? 'bg-violet-500/10 text-[#A78BFA]' : 'text-[#6B6A78] hover:bg-white/[0.03] hover:text-[#8B8A99]'
                    }`}
                  >
                    {lineNum}
                  </button>
                  <div className="flex-1 py-0.5 pr-4">
                    <code className="text-[12px] font-mono text-[#C4C3D0]">{line || ' '}</code>
                    {/* Inline comments */}
                    {lineComments.map((c) => (
                      <div key={c.id} className="mt-1 ml-2 px-3 py-1.5 rounded-lg bg-violet-500/5 border border-violet-500/10">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] font-bold text-[#A78BFA]">{c.reviewerName}</span>
                          <span className="text-[8px] text-[#6B6A78]">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[11px] text-[#C4C3D0] mt-0.5">{c.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Inline Comment Input */}
        {selectedLine && (
          <div className="px-6 pb-4">
            <div className="p-3 rounded-xl bg-[#1E1D27] border border-violet-500/20">
              <span className="text-[10px] font-bold text-[#A78BFA]">Comment on line {selectedLine}</span>
              <div className="flex gap-2 mt-1">
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && commentText.trim()) { addComment(activeReview.id, commentText.trim(), selectedLine); setCommentText(''); setSelectedLine(null); } }}
                  placeholder="Write your feedback..."
                  className="flex-1 px-3 py-1.5 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] placeholder-[#6B6A78] outline-none"
                />
                <button
                  onClick={() => { if (commentText.trim()) { addComment(activeReview.id, commentText.trim(), selectedLine); setCommentText(''); setSelectedLine(null); } }}
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white bg-violet-500 hover:bg-violet-600 transition-all"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* General Comments */}
        {activeReview.comments.filter((c) => !c.line).length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="text-[12px] font-bold text-[#F5F5F7] mb-3">General Feedback</h3>
            <div className="flex flex-col gap-2">
              {activeReview.comments.filter((c) => !c.line).map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-[#14131A] border border-white/[0.04]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-[#A78BFA]">{c.reviewerName}</span>
                    <span className="text-[9px] text-[#6B6A78]">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[11px] text-[#C4C3D0]">{c.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviewers */}
        {activeReview.reviewers.length > 0 && (
          <div className="px-6 pb-4">
            <h3 className="text-[12px] font-bold text-[#F5F5F7] mb-3">Reviewers</h3>
            <div className="flex flex-col gap-2">
              {activeReview.reviewers.map((rev) => (
                <div key={rev.reviewerId} className="flex items-center justify-between p-3 rounded-lg bg-[#14131A] border border-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-[9px] text-[#A78BFA]">{rev.reviewerName.charAt(0)}</div>
                    <span className="text-[11px] font-bold text-[#F5F5F7]">{rev.reviewerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] px-2 py-0.5 rounded font-bold" style={{
                      background: rev.status === 'completed' ? 'rgba(52,211,153,0.1)' : rev.status === 'assigned' ? 'rgba(167,139,250,0.1)' : 'rgba(107,106,120,0.1)',
                      color: rev.status === 'completed' ? '#34D399' : rev.status === 'assigned' ? '#A78BFA' : '#6B6A78',
                    }}>
                      {rev.status}
                    </span>
                    <span className="text-[9px] text-[#F59E0B]">+{rev.xpReward} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Complete Review Form */}
        {activeReview.reviewers.some((r) => r.reviewerId === 'current-user') && (
          <div className="px-6 pb-6">
            <AnimatePresence>
              {showComplete ? (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="p-4 rounded-xl bg-[#1E1D27] border border-white/[0.06]">
                    <h3 className="text-[13px] font-bold text-[#F5F5F7] mb-3">Submit Your Review</h3>
                    <div className="flex items-center gap-1 mb-3">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button key={n} onClick={() => setRating(n)} className="p-1">
                          <Star size={16} className={n <= rating ? 'text-[#F59E0B] fill-[#F59E0B]' : 'text-[#6B6A78]'} />
                        </button>
                      ))}
                    </div>
                    <textarea placeholder="Overall feedback..." value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} className="w-full mb-3 px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#C4C3D0] outline-none resize-none" />
                    <button onClick={() => { completeReview(activeReview.id, rating, feedback); setShowComplete(false); }} className="px-4 py-2 rounded-lg text-[11px] font-bold text-white bg-violet-500 hover:bg-violet-600 transition-all">Submit Review</button>
                  </div>
                </motion.div>
              ) : (
                <button onClick={() => setShowComplete(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold text-[#34D399] border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all">
                  <Check size={12} /> Complete Review
                </button>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Mark Helpful */}
        {activeReview.reviewers.length > 0 && (
          <div className="px-6 pb-6">
            {activeReview.reviewers.filter((r) => r.status === 'completed').map((rev) => (
              <button
                key={rev.reviewerId}
                onClick={() => markHelpful(activeReview.id, rev.reviewerId)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all mr-2 ${
                  activeReview.markedHelpfulBy.includes(rev.reviewerId)
                    ? 'bg-emerald-500/10 text-[#34D399] border border-emerald-500/20'
                    : 'text-[#6B6A78] border border-white/[0.06] hover:text-[#34D399]'
                }`}
              >
                <ThumbsUp size={11} /> {rev.reviewerName}'s review was helpful
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────

const PeerReviewView: React.FC = () => {
  const { view } = usePeerReview(null);
  return view === 'detail' ? <ReviewDetailView /> : <ReviewQueueView />;
};

export default PeerReviewView;
