// ─── Collaboration & Social Learning View ──────────────────────────────────
// Main hub for Study Groups, Peer Review, Community Forum, and Live Collaboration.
// Integrates with the existing curriculum and AI tutor systems.

import React, { useState } from 'react';
import { useStudyGroups } from '../../hooks/useStudyGroups';
import { usePeerReview } from '../../hooks/usePeerReview';
import { useForum } from '../../hooks/useForum';
import { useAiModeration } from '../../hooks/useAiModeration';
import { useCurriculum } from '../../hooks/useCurriculum';
import { useLiveCollab } from '../../hooks/useLiveCollab';
import { DIFFICULTY_CONFIG, STATUS_CONFIG } from '../../data/curriculumData';
import { Users, Code2, MessageSquare, GitBranch, Send, Search, ChevronRight, Lock, Check, ThumbsUp, MessageCircle, Star, Sparkles, Flag, AlertTriangle, Eye, Plus, ArrowLeft, Clock, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Code Snippet Component ────────────────────────────────────────────────

function CodeSnippet({ code, language, readOnly = true }: { code: string; language: string; readOnly?: boolean }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/[0.04]">
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#14131A] border-b border-white/[0.03]">
        <span className="text-[10px] font-mono text-[#6B6A78] uppercase">{language}</span>
        {readOnly && <span className="text-[9px] text-[#6B6A78]">Read-only</span>}
      </div>
      <pre className="p-3 text-[11px] font-mono text-[#C4C3D0] bg-[#1E1D27] overflow-x-auto max-h-[200px]">
        {code}
      </pre>
    </div>
  );
}

// ── Study Groups View ─────────────────────────────────────────────────────

function StudyGroupsView() {
  const { progress, nextRecommendedTopic } = useCurriculum();
  const {
    groups, activeGroup, activeGroupMessages, activeGroupSolutions,
    recommendedGroups, activeGroupId, searchQuery, setSearchQuery,
    createGroup, joinGroup, leaveGroup, sendMessage, postSolution, selectGroup, goBack,
  } = useStudyGroups(progress, nextRecommendedTopic);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupTopic, setNewGroupTopic] = useState('');
  const [newGroupMsg, setNewGroupMsg] = useState('');

  if (activeGroup) {
    return (
      <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
          <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-bold text-[#F5F5F7]">{activeGroup.name}</h2>
            <p className="text-[11px] text-[#8B8A99]">{activeGroup.members.length}/{activeGroup.maxMembers} members · {activeGroup.visibility}</p>
          </div>
          {activeGroup.members.some((m) => m.studentId === 'current-user') ? (
            <button onClick={() => leaveGroup(activeGroup.id)} className="text-[10px] text-[#F87171] hover:text-[#FCA5A5] transition-colors px-3 py-1.5 rounded-lg border border-red-500/20">
              Leave
            </button>
          ) : (
            <button onClick={() => joinGroup(activeGroup.id)} className="text-[10px] font-bold text-[#34D399] px-3 py-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all">
              Join Group
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-2 border-b border-white/[0.03] shrink-0">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-violet-500/10 text-[#A78BFA] border border-violet-500/20">
            <MessageSquare size={12} /> Chat
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#6B6A78]">
            <Code2 size={12} /> Solutions ({activeGroupSolutions.length})
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-[#6B6A78]">
            <Users size={12} /> Members ({activeGroup.members.length})
          </span>
        </div>

        {/* Chat */}
        <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
          {activeGroupMessages.map((msg) => (
            <div key={msg.id} className="flex gap-2.5 mb-3">
              <span className="text-[16px] shrink-0 mt-0.5">{msg.studentAvatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#F5F5F7]">{msg.studentName}</span>
                  <span className="text-[9px] text-[#6B6A78]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                {msg.type === 'code' ? (
                  <div className="mt-1">
                    <CodeSnippet code={msg.content} language="python" />
                  </div>
                ) : (
                  <p className="text-[12px] text-[#C4C3D0] mt-0.5 leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="px-4 py-3 border-t border-white/[0.05] shrink-0 flex gap-2">
          <input
            value={newGroupMsg}
            onChange={(e) => setNewGroupMsg(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && newGroupMsg.trim()) { sendMessage(activeGroup.id, newGroupMsg.trim()); setNewGroupMsg(''); } }}
            placeholder="Type a message..."
            className="flex-1 bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7]"
          />
          <button
            onClick={() => { if (newGroupMsg.trim()) { sendMessage(activeGroup.id, newGroupMsg.trim()); setNewGroupMsg(''); } }}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
          >
            <Send size={13} fill="white" />
          </button>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
          <button onClick={() => setShowCreateForm(false)} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-[16px] font-bold text-[#F5F5F7]">Create Study Group</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
          <div className="max-w-md mx-auto flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#8B8A99] uppercase tracking-wider">Group Name</label>
              <input value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} placeholder="e.g. DSA Fundamentals" className="w-full mt-1 bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8B8A99] uppercase tracking-wider">Description</label>
              <input value={newGroupDesc} onChange={(e) => setNewGroupDesc(e.target.value)} placeholder="What's this group about?" className="w-full mt-1 bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8B8A99] uppercase tracking-wider">Topic Focus</label>
              <input value={newGroupTopic} onChange={(e) => setNewGroupTopic(e.target.value)} placeholder="e.g. recursion-basics" className="w-full mt-1 bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7]" />
            </div>
            <button
              onClick={() => {
                if (newGroupName && newGroupTopic) {
                  createGroup({ name: newGroupName, description: newGroupDesc, topicFocus: newGroupTopic, maxMembers: 8, visibility: 'public' });
                  setShowCreateForm(false);
                }
              }}
              className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-white active:scale-95"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}
            >
              Create Group
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-[#A78BFA]" />
            <h2 className="text-[16px] font-bold text-[#F5F5F7]">Study Groups</h2>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-white active:scale-95"
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}
          >
            <Plus size={12} /> Create Group
          </button>
        </div>

        {/* Recommendations */}
        {recommendedGroups.groups.length > 0 && (
          <div className="p-3 rounded-xl border border-violet-500/20 bg-violet-500/5 mb-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles size={12} className="text-[#A78BFA]" />
              <span className="text-[11px] font-bold text-[#A78BFA]">Recommended for you</span>
            </div>
            <p className="text-[10px] text-[#8B8A99]">{recommendedGroups.reason}</p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6A78]" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups by name, topic, or description..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/[0.05] bg-[#14131A] text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7] placeholder-[#6B6A78]"
          />
        </div>
      </div>

      {/* Group List */}
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
        <div className="flex flex-col gap-3">
          {groups.map((group) => {
            const isMember = group.members.some((m) => m.studentId === 'current-user');
            const isFull = group.members.length >= group.maxMembers;

            return (
              <button
                key={group.id}
                onClick={() => selectGroup(group.id)}
                className="w-full text-left p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: '#1E1D27',
                  borderColor: isMember ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)',
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-[14px] font-bold text-[#F5F5F7]">{group.name}</h3>
                    <p className="text-[11px] text-[#8B8A99] mt-0.5">{group.description}</p>
                  </div>
                  {group.visibility === 'private' && <Lock size={12} className="text-[#6B6A78] shrink-0" />}
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#6B6A78]">
                  <div className="flex items-center gap-3">
                    <span>{group.members.length}/{group.maxMembers} members</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> Active {Math.round((Date.now() - group.lastActive) / 3600000)}h ago</span>
                  </div>
                  <span className="flex items-center gap-1"><TrendingUp size={10} /> Score: {group.activityScore}</span>
                </div>

                {isMember && <span className="mt-2 inline-block text-[9px] px-2 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/20 font-bold">Member</span>}
                {isFull && !isMember && <span className="mt-2 inline-block text-[9px] px-2 py-0.5 rounded bg-red-500/10 text-[#F87171] border border-red-500/20 font-bold">Full</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Peer Review View ──────────────────────────────────────────────────────

function PeerReviewView() {
  const { progress } = useCurriculum();
  const {
    reviews, activeReview, pendingReviews, myReviews, reviewsForMe, myReputation,
    view, activeReviewId, submitReview, addComment, completeReview, markHelpful,
    selectReview, goBack, setView,
  } = usePeerReview(progress);

  const [submitCode, setSubmitCode] = useState('');
  const [submitLang, setSubmitLang] = useState('python');
  const [submitTopic, setSubmitTopic] = useState('');
  const [submitDesc, setSubmitDesc] = useState('');
  const [commentText, setCommentText] = useState('');
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  if (view === 'detail' && activeReview) {
    const isReviewer = activeReview.reviewers.some((r) => r.reviewerId === 'current-user');
    const isSubmitter = activeReview.submitterId === 'current-user';
    const reviewerAssignment = activeReview.reviewers.find((r) => r.reviewerId === 'current-user');

    return (
      <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
          <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-bold text-[#F5F5F7]">Code Review</h2>
            <p className="text-[11px] text-[#8B8A99]">by {activeReview.submitterName}</p>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${
            activeReview.status === 'completed' ? 'bg-emerald-500/10 text-[#34D399] border border-emerald-500/20' :
            activeReview.status === 'in-review' ? 'bg-amber-500/10 text-[#F59E0B] border border-amber-500/20' :
            'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20'
          }`}>
            {activeReview.status}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
          {/* Code */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">{activeReview.language} Code</span>
            <CodeSnippet code={activeReview.code} language={activeReview.language} />
          </div>

          {/* Description */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-1 block">Request</span>
            <p className="text-[12px] text-[#C4C3D0]">{activeReview.description}</p>
          </div>

          {/* Reviewers */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">Reviewers</span>
            <div className="flex gap-2">
              {activeReview.reviewers.map((r) => (
                <div key={r.reviewerId} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.04] bg-[#14131A]">
                  <span className="text-[14px]">{r.reviewerAvatar}</span>
                  <span className="text-[11px] text-[#F5F5F7]">{r.reviewerName}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${r.status === 'completed' ? 'bg-emerald-500/10 text-[#34D399]' : 'bg-amber-500/10 text-[#F59E0B]'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">Comments ({activeReview.comments.length})</span>
            <div className="flex flex-col gap-2">
              {activeReview.comments.map((c) => (
                <div key={c.id} className="p-3 rounded-xl border border-white/[0.04] bg-[#14131A]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#A78BFA]">{c.reviewerName}</span>
                    {c.line && <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA]">Line {c.line}</span>}
                    <span className="text-[9px] text-[#6B6A78] ml-auto">{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[12px] text-[#C4C3D0]">{c.content}</p>
                  {isSubmitter && !activeReview.markedHelpfulBy.includes(c.reviewerId) && (
                    <button onClick={() => markHelpful(activeReview.id, c.reviewerId)} className="mt-2 text-[10px] text-[#34D399] hover:text-[#6EE7B7] transition-colors flex items-center gap-1">
                      <ThumbsUp size={10} /> Mark as helpful (+XP for reviewer)
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add comment (for reviewers) */}
          {isReviewer && reviewerAssignment?.status === 'assigned' && (
            <div className="mb-4 p-4 rounded-xl border border-white/[0.04] bg-[#14131A]">
              <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">Add Inline Comment</span>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Click a line number to comment on specific code, or write general feedback..."
                className="w-full bg-[#1E1D27] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7] resize-none h-20"
              />
              <button
                onClick={() => { if (commentText.trim()) { addComment(activeReview.id, commentText.trim()); setCommentText(''); } }}
                className="mt-2 px-3 py-1.5 rounded-lg text-[11px] font-bold text-[#A78BFA] border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 transition-all"
              >
                Add Comment
              </button>
            </div>
          )}

          {/* Complete review (for reviewers) */}
          {isReviewer && reviewerAssignment?.status === 'assigned' && (
            <div className="p-4 rounded-xl border border-white/[0.04] bg-[#14131A]">
              <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">Submit Review</span>
              <div className="flex gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setRating(n)} className={`w-8 h-8 rounded-lg text-[14px] transition-all ${n <= rating ? 'text-[#F59E0B]' : 'text-[#6B6A78]'}`}>
                    <Star size={16} fill={n <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Overall feedback for the submitter..."
                className="w-full bg-[#1E1D27] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7] resize-none h-16 mb-2"
              />
              <button
                onClick={() => { if (rating && feedback) { completeReview(activeReview.id, rating, feedback); goBack(); } }}
                className="px-4 py-2 rounded-xl text-[11px] font-bold text-white active:scale-95"
                style={{ background: 'linear-gradient(135deg, #34D399 0%, #6EE7B7 100%)' }}
              >
                Submit Review (+{reviewerAssignment.xpReward} XP)
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'submit') {
    return (
      <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
          <button onClick={() => setView('queue')} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
            <ArrowLeft size={16} />
          </button>
          <h2 className="text-[16px] font-bold text-[#F5F5F7]">Submit for Peer Review</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#8B8A99] uppercase tracking-wider">Topic</label>
              <input value={submitTopic} onChange={(e) => setSubmitTopic(e.target.value)} placeholder="e.g. recursion-basics" className="w-full mt-1 bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8B8A99] uppercase tracking-wider">Language</label>
              <select value={submitLang} onChange={(e) => setSubmitLang(e.target.value)} className="w-full mt-1 bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7]">
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8B8A99] uppercase tracking-wider">Code</label>
              <textarea value={submitCode} onChange={(e) => setSubmitCode(e.target.value)} placeholder="Paste your code here..." className="w-full mt-1 bg-[#1E1D27] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-violet-500/30 text-[#F5F5F7] resize-none h-40" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#8B8A99] uppercase tracking-wider">What do you want reviewed?</label>
              <input value={submitDesc} onChange={(e) => setSubmitDesc(e.target.value)} placeholder="e.g. Is this solution optimal? Any edge cases I'm missing?" className="w-full mt-1 bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7]" />
            </div>
            <button
              onClick={() => {
                if (submitCode && submitTopic && submitDesc) {
                  submitReview({ code: submitCode, language: submitLang, topicId: submitTopic, description: submitDesc });
                }
              }}
              className="px-4 py-2.5 rounded-xl text-[12px] font-bold text-white active:scale-95"
              style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)', boxShadow: '0 4px 12px rgba(139,92,246,0.3)' }}
            >
              Submit for Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      <div className="px-6 py-4 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GitBranch size={16} className="text-[#EC4899]" />
            <h2 className="text-[16px] font-bold text-[#F5F5F7]">Peer Code Review</h2>
          </div>
          <button
            onClick={() => setView('submit')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-white active:scale-95"
            style={{ background: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)', boxShadow: '0 4px 12px rgba(236,72,153,0.3)' }}
          >
            <Plus size={12} /> Submit Code
          </button>
        </div>

        {/* Reputation card */}
        <div className="p-3 rounded-xl border border-white/[0.04] bg-[#1E1D27] flex items-center gap-4">
          <div>
            <span className="text-[10px] text-[#6B6A78] uppercase tracking-wider">Your Reputation</span>
            <div className="text-[18px] font-bold text-[#F59E0B]">{myReputation.totalXp} XP</div>
          </div>
          <div className="flex gap-4 text-[11px]">
            <span className="text-[#8B8A99]">Reviews given: <strong className="text-[#F5F5F7]">{myReputation.reviewsGiven}</strong></span>
            <span className="text-[#8B8A99]">Helpful: <strong className="text-[#34D399]">{myReputation.helpfulCount}</strong></span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
        {/* Reviews for me */}
        {reviewsForMe.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">Reviews to Complete</span>
            {reviewsForMe.map((r) => (
              <button key={r.id} onClick={() => selectReview(r.id)} className="w-full text-left p-3 rounded-xl border border-white/[0.04] bg-[#1E1D27] mb-2 hover:border-violet-500/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#F5F5F7]">Review for {r.submitterName}'s code</span>
                  <span className="text-[10px] text-[#F59E0B]">+{r.reviewers.find((rev) => rev.reviewerId === 'current-user')?.xpReward || 0} XP</span>
                </div>
                <p className="text-[11px] text-[#8B8A99] mt-1 truncate">{r.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Pending reviews */}
        {pendingReviews.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">Pending Reviews</span>
            {pendingReviews.map((r) => (
              <div key={r.id} className="p-3 rounded-xl border border-white/[0.04] bg-[#14131A] mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#F5F5F7]">{r.submitterName}'s code</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-violet-500/10 text-[#A78BFA]">Awaiting reviewers</span>
                </div>
                <p className="text-[11px] text-[#8B8A99] mt-1">{r.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* My submissions */}
        {myReviews.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2 block">My Submissions</span>
            {myReviews.map((r) => (
              <button key={r.id} onClick={() => selectReview(r.id)} className="w-full text-left p-3 rounded-xl border border-white/[0.04] bg-[#1E1D27] mb-2 hover:border-violet-500/20 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#F5F5F7]">{r.language} · {r.topicId}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                    r.status === 'completed' ? 'bg-emerald-500/10 text-[#34D399]' :
                    r.status === 'in-review' ? 'bg-amber-500/10 text-[#F59E0B]' :
                    'bg-violet-500/10 text-[#A78BFA]'
                  }`}>
                    {r.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#8B8A99] mt-1 truncate">{r.description}</p>
                {r.comments.length > 0 && <span className="text-[10px] text-[#6B6A78] mt-1">{r.comments.length} comment{r.comments.length > 1 ? 's' : ''}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Community Forum View ──────────────────────────────────────────────────

function CommunityForumView() {
  const {
    categories, threads, allThreads, activeThread, activeThreadReplies,
    similarThreads, unansweredThreads, sortBy, searchQuery, filterTopicId,
    view, activeThreadId, setSortBy, setSearchQuery, setFilterTopicId,
    createThread, addReply, upvoteThread, upvoteReply, acceptAnswer,
    selectThread, goBack,
  } = useForum();

  const { findSimilar, moderatePost, generateAiTutorReply, getUnansweredThreadsNeedingAi, flags } = useAiModeration(allThreads, {});

  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newReply, setNewReply] = useState('');

  if (view === 'thread' && activeThread) {
    return (
      <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
          <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] hover:bg-white/[0.03] transition-all">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-[16px] font-bold text-[#F5F5F7] truncate">{activeThread.title}</h2>
            <p className="text-[11px] text-[#8B8A99]">by {activeThread.authorName} · {new Date(activeThread.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${
              activeThread.status === 'answered' ? 'bg-emerald-500/10 text-[#34D399]' :
              activeThread.status === 'locked' ? 'bg-red-500/10 text-[#F87171]' :
              'bg-violet-500/10 text-[#A78BFA]'
            }`}>
              {activeThread.status}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
          {/* Original Post */}
          <div className="mb-6 p-4 rounded-2xl border border-white/[0.06] bg-[#1E1D27]">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <button onClick={() => upvoteThread(activeThread.id)} className={`p-1.5 rounded-lg transition-all ${activeThread.upvotedBy.includes('current-user') ? 'text-[#A78BFA] bg-violet-500/10' : 'text-[#6B6A78] hover:text-[#A78BFA]'}`}>
                  <ThumbsUp size={14} fill={activeThread.upvotedBy.includes('current-user') ? 'currentColor' : 'none'} />
                </button>
                <span className="text-[14px] font-bold text-[#F5F5F7]">{activeThread.upvotes}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[12px] font-bold text-[#F5F5F7]">{activeThread.authorName}</span>
                  {activeThread.tags.map((tag) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/20">{tag}</span>
                  ))}
                </div>
                <p className="text-[13px] text-[#C4C3D0] leading-relaxed whitespace-pre-wrap">{activeThread.content}</p>
                {activeThread.codeSnippet && (
                  <div className="mt-3">
                    <CodeSnippet code={activeThread.codeSnippet.code} language={activeThread.codeSnippet.language} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Similar threads suggestion */}
          {similarThreads.length > 0 && (
            <div className="mb-4 p-3 rounded-xl border border-violet-500/20 bg-violet-500/5">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-[#A78BFA]" />
                <span className="text-[11px] font-bold text-[#A78BFA]">Similar discussions</span>
              </div>
              {similarThreads.map((t) => (
                <button key={t.id} onClick={() => selectThread(t.id)} className="flex items-center justify-between w-full text-left py-1.5 px-2 rounded-lg hover:bg-white/[0.03] transition-all">
                  <span className="text-[11px] text-[#C4C3D0]">{t.title}</span>
                  <span className="text-[9px] text-[#34D399]">{t.status === 'answered' ? '✓ Answered' : `${t.replyCount} replies`}</span>
                </button>
              ))}
            </div>
          )}

          {/* Replies */}
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider mb-3 block">{activeThreadReplies.length} Replies</span>
            {activeThreadReplies.map((reply) => (
              <div key={reply.id} className={`mb-3 p-4 rounded-2xl border ${reply.isAcceptedAnswer ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-white/[0.04] bg-[#1E1D27]'}`}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button onClick={() => upvoteReply(activeThread.id, reply.id)} className={`p-1.5 rounded-lg transition-all ${reply.upvotedBy.includes('current-user') ? 'text-[#A78BFA] bg-violet-500/10' : 'text-[#6B6A78] hover:text-[#A78BFA]'}`}>
                      <ThumbsUp size={14} fill={reply.upvotedBy.includes('current-user') ? 'currentColor' : 'none'} />
                    </button>
                    <span className="text-[12px] font-bold text-[#F5F5F7]">{reply.upvotes}</span>
                    {reply.isAcceptedAnswer && <Check size={14} className="text-[#34D399]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold text-[#F5F5F7]">{reply.authorName}</span>
                      {reply.isAiGenerated && <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/20 font-bold">AI Tutor</span>}
                      {reply.isAcceptedAnswer && <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#34D399] border border-emerald-500/20 font-bold">Accepted Answer</span>}
                      <span className="text-[9px] text-[#6B6A78] ml-auto">{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[12px] text-[#C4C3D0] leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                    {reply.codeSnippet && <div className="mt-2"><CodeSnippet code={reply.codeSnippet.code} language={reply.codeSnippet.language} /></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reply Input */}
          <div className="p-4 rounded-xl border border-white/[0.04] bg-[#1E1D27]">
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Write your reply..."
              className="w-full bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7] resize-none h-24 mb-2"
            />
            <div className="flex items-center justify-between">
              <button className="text-[10px] text-[#6B6A78] hover:text-[#A78BFA] transition-colors flex items-center gap-1">
                <Code2 size={12} /> Add code snippet
              </button>
              <button
                onClick={() => { if (newReply.trim()) { addReply(activeThread.id, newReply.trim()); setNewReply(''); } }}
                className="px-4 py-2 rounded-xl text-[11px] font-bold text-white active:scale-95"
                style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' }}
              >
                Post Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      <div className="px-6 py-4 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-[#34D399]" />
            <h2 className="text-[16px] font-bold text-[#F5F5F7]">Community Forum</h2>
          </div>
          <span className="text-[10px] text-[#6B6A78]">{unansweredThreads} unanswered</span>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          <button onClick={() => setFilterTopicId(null)} className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all ${!filterTopicId ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'text-[#6B6A78] border border-transparent hover:bg-white/[0.03]'}`}>
            All
          </button>
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setFilterTopicId(cat.topicId)} className={`px-3 py-1.5 rounded-lg text-[10.5px] font-semibold whitespace-nowrap transition-all ${filterTopicId === cat.topicId ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'text-[#6B6A78] border border-transparent hover:bg-white/[0.03]'}`}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6A78]" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search threads..." className="w-full pl-9 pr-3 py-2 rounded-xl border border-white/[0.05] bg-[#14131A] text-[12px] focus:outline-none focus:border-violet-500/30 text-[#F5F5F7] placeholder-[#6B6A78]" />
          </div>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="bg-[#14131A] border border-white/[0.05] rounded-xl px-3 py-2 text-[11px] text-[#8B8A99] focus:outline-none focus:border-violet-500/30">
            <option value="recent">Most Recent</option>
            <option value="upvoted">Most Upvoted</option>
            <option value="unanswered">Unanswered</option>
          </select>
        </div>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
        <div className="flex flex-col gap-2">
          {threads.map((thread) => (
            <button key={thread.id} onClick={() => selectThread(thread.id)} className="w-full text-left p-4 rounded-2xl border border-white/[0.04] bg-[#1E1D27] hover:border-violet-500/20 transition-all">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
                  <span className="text-[14px] font-bold text-[#A78BFA]">{thread.upvotes}</span>
                  <span className="text-[8px] text-[#6B6A78]">votes</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-[13px] font-bold text-[#F5F5F7] truncate">{thread.title}</h3>
                    {thread.status === 'answered' && <Check size={12} className="text-[#34D399] shrink-0" />}
                  </div>
                  <p className="text-[11px] text-[#8B8A99] truncate">{thread.content}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px] text-[#6B6A78]">
                    <span>{thread.authorName}</span>
                    <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><MessageCircle size={10} /> {thread.replyCount}</span>
                    {thread.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] text-[9px]">{tag}</span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={14} className="text-[#6B6A78] shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Collaboration View ───────────────────────────────────────────────

const CollaborationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'review' | 'forum'>('groups');

  const tabs: { id: 'groups' | 'review' | 'forum'; icon: React.ElementType; label: string }[] = [
    { id: 'groups', icon: Users, label: 'Study Groups' },
    { id: 'review', icon: GitBranch, label: 'Peer Review' },
    { id: 'forum', icon: MessageSquare, label: 'Community' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#14131A]" style={{ minWidth: 0 }}>
      {/* Tab Bar */}
      <div className="flex gap-1 px-6 py-3 border-b border-white/[0.05] shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20'
                : 'text-[#6B6A78] hover:text-[#8B8A99] border border-transparent'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        <AnimatePresence mode="wait">
          {activeTab === 'groups' && <StudyGroupsView key="groups" />}
          {activeTab === 'review' && <PeerReviewView key="review" />}
          {activeTab === 'forum' && <CommunityForumView key="forum" />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CollaborationView;
