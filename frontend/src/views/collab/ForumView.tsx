// ─── Community Forum View ──────────────────────────────────────────────────
// Full forum UI: categories, threads, replies, upvotes, accepted answers,
// search/sort, and AI tutor replies.

import React, { useState } from 'react';
import { useForum } from '../../hooks/useForum';
import { MessageSquare, ArrowUp, Check, Search, Filter, ArrowLeft, Tag, Clock, Trophy, Bot, Sparkles, Code2, Plus, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Thread List View ──────────────────────────────────────────────────────

function ThreadListView() {
  const {
    categories, threads, sortBy, searchQuery, filterTopicId,
    setSortBy, setSearchQuery, setFilterTopicId,
    selectThread, createThread,
  } = useForum();

  const [showNewThread, setShowNewThread] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('cat-1');

  const sortOptions: { id: 'recent' | 'upvoted' | 'unanswered'; label: string }[] = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'upvoted', label: 'Most Upvoted' },
    { id: 'unanswered', label: 'Unanswered' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[20px] font-bold text-[#F5F5F7]">Community Forum</h1>
            <p className="text-[12px] text-[#8B8A99] mt-0.5">Ask questions, share knowledge, and learn together.</p>
          </div>
          <button
            onClick={() => setShowNewThread(!showNewThread)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#A78BFA] border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 transition-all"
          >
            <Plus size={13} /> New Thread
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          <button
            onClick={() => setFilterTopicId(null)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
              !filterTopicId ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'bg-[#1E1D27] text-[#6B6A78] border border-white/[0.06]'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterTopicId(cat.topicId || null)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold shrink-0 transition-all flex items-center gap-1 ${
                filterTopicId === cat.topicId ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'bg-[#1E1D27] text-[#6B6A78] border border-white/[0.06]'
              }`}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search + Sort */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6A78]" />
            <input
              type="text"
              placeholder="Search threads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-[11px] bg-[#1E1D27] border border-white/[0.06] text-[#F5F5F7] placeholder-[#6B6A78] outline-none focus:border-violet-500/30"
            />
          </div>
          <div className="flex gap-1">
            {sortOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSortBy(opt.id)}
                className={`px-2.5 py-2 rounded-xl text-[10px] font-bold transition-all ${
                  sortBy === opt.id ? 'bg-violet-500/10 text-[#A78BFA] border border-violet-500/20' : 'text-[#6B6A78] border border-transparent hover:text-[#8B8A99]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* New Thread Form */}
        <AnimatePresence>
          {showNewThread && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3">
              <div className="p-4 rounded-xl bg-[#1E1D27] border border-white/[0.06]">
                <h3 className="text-[13px] font-bold text-[#F5F5F7] mb-3">Create New Thread</h3>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none">
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <input placeholder="Thread title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none" />
                <textarea placeholder="What's your question? Be specific and show what you've tried..." value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={4} className="w-full mb-2 px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#C4C3D0] outline-none resize-none" />
                <button onClick={() => { createThread({ categoryId: newCategory, topicId: '', title: newTitle, content: newContent, tags: [] }); setShowNewThread(false); setNewTitle(''); setNewContent(''); }} className="px-4 py-2 rounded-lg text-[11px] font-bold text-white bg-violet-500 hover:bg-violet-600 transition-all">Post Thread</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: 0 }}>
        <div className="flex flex-col gap-3">
          {threads.map((thread) => {
            const category = categories.find((c) => c.id === thread.categoryId);
            return (
              <button
                key={thread.id}
                onClick={() => selectThread(thread.id)}
                className="w-full text-left p-4 rounded-xl border transition-all hover:bg-white/[0.02]"
                style={{ background: '#1E1D27', borderColor: thread.status === 'answered' ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-start gap-3">
                  {/* Upvote column */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <ArrowUp size={14} className="text-[#6B6A78] hover:text-[#A78BFA] transition-colors" />
                    <span className="text-[13px] font-bold text-[#F5F5F7]">{thread.upvotes}</span>
                    <MessageSquare size={12} className="text-[#6B6A78]" />
                    <span className="text-[10px] text-[#6B6A78]">{thread.replyCount}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {thread.status === 'answered' && <Check size={12} className="text-[#34D399]" />}
                      {thread.isAiModerated && thread.moderationFlag && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-500/10 text-[#F87171] font-bold uppercase">FLAGGED</span>
                      )}
                      <h3 className={`text-[13px] font-bold truncate ${thread.status === 'answered' ? 'text-[#F5F5F7]' : 'text-[#C4C3D0]'}`}>
                        {thread.title}
                      </h3>
                    </div>
                    <p className="text-[11px] text-[#8B8A99] line-clamp-2 mb-2">{thread.content.slice(0, 150)}...</p>
                    <div className="flex items-center gap-3 text-[10px] text-[#6B6A78]">
                      <span className="flex items-center gap-1">
                        <span className="w-4 h-4 rounded-full bg-violet-500/20 flex items-center justify-center text-[8px] text-[#A78BFA]">{thread.authorName.charAt(0)}</span>
                        {thread.authorName}
                      </span>
                      {category && (
                        <span className="flex items-center gap-1">
                          <Tag size={10} />
                          {category.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Thread Detail View ────────────────────────────────────────────────────

function ThreadDetailView() {
  const {
    activeThread, activeThreadReplies,
    addReply, upvoteThread, upvoteReply, acceptAnswer, goBack,
  } = useForum();
  const [replyContent, setReplyContent] = useState('');

  if (!activeThread) return null;

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
        <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] transition-all">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {activeThread.status === 'answered' && <Check size={13} className="text-[#34D399]" />}
            <h2 className="text-[16px] font-bold text-[#F5F5F7] truncate">{activeThread.title}</h2>
          </div>
          <p className="text-[11px] text-[#8B8A99] mt-0.5">
            Asked by {activeThread.authorName} · {activeThread.upvotes} upvotes · {activeThread.replyCount} replies
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        {/* Original Post */}
        <div className="px-6 py-4 border-b border-white/[0.03]">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button onClick={() => upvoteThread(activeThread.id)} className="p-1 rounded hover:bg-white/[0.05] transition-all">
                <ArrowUp size={16} className="text-[#6B6A78] hover:text-[#A78BFA]" />
              </button>
              <span className="text-[16px] font-bold text-[#F5F5F7]">{activeThread.upvotes}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-[#C4C3D0] whitespace-pre-wrap leading-relaxed mb-3">{activeThread.content}</div>
              {activeThread.codeSnippet && (
                <pre className="text-[11px] font-mono text-[#C4C3D0] bg-[#1E1D27] p-3 rounded-lg overflow-x-auto border border-white/[0.03] mb-3">{activeThread.codeSnippet.code}</pre>
              )}
              <div className="flex flex-wrap gap-1">
                {activeThread.tags.map((tag) => (
                  <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/15">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="px-6 py-4">
          <h3 className="text-[13px] font-bold text-[#F5F5F7] mb-4">
            {activeThreadReplies.length} {activeThreadReplies.length === 1 ? 'Reply' : 'Replies'}
          </h3>
          <div className="flex flex-col gap-4">
            {activeThreadReplies.map((reply) => (
              <div
                key={reply.id}
                className="p-4 rounded-xl border"
                style={{
                  background: reply.isAcceptedAnswer ? 'rgba(52,211,153,0.03)' : '#14131A',
                  borderColor: reply.isAcceptedAnswer ? 'rgba(52,211,153,0.2)' : 'rgba(255,255,255,0.04)',
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Upvote + accept column */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <button onClick={() => upvoteReply(activeThread.id, reply.id)} className="p-1 rounded hover:bg-white/[0.05] transition-all">
                      <ArrowUp size={14} className="text-[#6B6A78] hover:text-[#A78BFA]" />
                    </button>
                    <span className="text-[13px] font-bold text-[#F5F5F7]">{reply.upvotes}</span>
                    {activeThread.authorId === 'current-user' && !reply.isAcceptedAnswer && (
                      <button onClick={() => acceptAnswer(activeThread.id, reply.id)} className="p-1 rounded hover:bg-emerald-500/10 transition-all" title="Accept as answer">
                        <Check size={12} className="text-[#6B6A78] hover:text-[#34D399]" />
                      </button>
                    )}
                    {reply.isAcceptedAnswer && <Check size={14} className="text-[#34D399]" />}
                  </div>

                  {/* Reply content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center text-[8px] text-[#A78BFA]">{reply.authorName.charAt(0)}</span>
                      <span className="text-[11px] font-bold text-[#F5F5F7]">{reply.authorName}</span>
                      {reply.isAiGenerated && (
                        <span className="flex items-center gap-1 text-[8px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/20 font-bold">
                          <Bot size={9} /> AI TUTOR
                        </span>
                      )}
                      {reply.isAcceptedAnswer && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#34D399] font-bold">ACCEPTED</span>
                      )}
                      <span className="text-[9px] text-[#6B6A78] ml-auto">{new Date(reply.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="text-[12px] text-[#C4C3D0] whitespace-pre-wrap leading-relaxed mb-2">{reply.content}</div>
                    {reply.codeSnippet && (
                      <pre className="text-[11px] font-mono text-[#C4C3D0] bg-[#1E1D27] p-3 rounded-lg overflow-x-auto border border-white/[0.03]">{reply.codeSnippet.code}</pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reply Input */}
        <div className="px-6 py-4 border-t border-white/[0.05] shrink-0">
          <div className="flex gap-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply... (use ``` for code blocks)"
              rows={3}
              className="flex-1 px-3 py-2 rounded-xl text-[12px] bg-[#1E1D27] border border-white/[0.06] text-[#F5F5F7] placeholder-[#6B6A78] outline-none focus:border-violet-500/30 resize-none"
            />
            <button
              onClick={() => { if (replyContent.trim()) { addReply(activeThread.id, replyContent.trim()); setReplyContent(''); } }}
              className="self-end px-4 py-2 rounded-xl bg-violet-500 text-white text-[11px] font-bold hover:bg-violet-600 transition-all"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────

const ForumView: React.FC = () => {
  const { view } = useForum();
  return view === 'thread' ? <ThreadDetailView /> : <ThreadListView />;
};

export default ForumView;
