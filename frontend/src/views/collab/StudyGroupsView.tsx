// ─── Study Groups View ─────────────────────────────────────────────────────
// Full UI for the Study Groups feature: group browsing, detail view with chat,
// solutions board, and member roster.

import React, { useState, useRef, useEffect } from 'react';
import { useCurriculum } from '../../hooks/useCurriculum';
import { useStudyGroups } from '../../hooks/useStudyGroups';
import { Users, MessageSquare, Code2, Plus, Search, ArrowLeft, Send, Copy, Lock, Globe, Star, UserPlus, UserMinus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Group List View ───────────────────────────────────────────────────────

function GroupListView() {
  const { progress, activeTopic } = useCurriculum();
  const {
    groups, activeGroupMessages, activeGroupSolutions, activeGroup,
    recommendedGroups, searchQuery, setSearchQuery,
    selectGroup, goBack, createGroup, joinGroup,
  } = useStudyGroups(progress, activeTopic);

  const [showCreate, setShowCreate] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupTopic, setNewGroupTopic] = useState('');
  const [newGroupMax, setNewGroupMax] = useState(6);
  const [newGroupVisibility, setNewGroupVisibility] = useState<'public' | 'private'>('public');

  if (activeGroup) return <GroupDetailView />;

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/[0.05] shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-[20px] font-bold text-[#F5F5F7]">Study Groups</h1>
            <p className="text-[12px] text-[#8B8A99] mt-0.5">Collaborate with peers at your level.</p>
          </div>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-bold text-[#A78BFA] border border-violet-500/20 bg-violet-500/5 hover:bg-violet-500/10 transition-all"
          >
            <Plus size={13} /> Create Group
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6A78]" />
          <input
            type="text"
            placeholder="Search groups by name, topic, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-[12px] bg-[#1E1D27] border border-white/[0.06] text-[#F5F5F7] placeholder-[#6B6A78] outline-none focus:border-violet-500/30"
          />
        </div>

        {/* Recommendations */}
        {recommendedGroups.groups.length > 0 && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-violet-500/5 border border-violet-500/10">
            <div className="flex items-center gap-1.5 mb-1">
              <Star size={11} className="text-[#A78BFA]" />
              <span className="text-[10px] font-bold text-[#A78BFA]">Recommended for you</span>
            </div>
            <p className="text-[10px] text-[#8B8A99]">{recommendedGroups.reason}</p>
          </div>
        )}
      </div>

      {/* Create Group Form */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/[0.05] bg-[#1E1D27]"
          >
            <div className="px-6 py-4">
              <h3 className="text-[13px] font-bold text-[#F5F5F7] mb-3">Create New Group</h3>
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Group name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} className="col-span-2 px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none" />
                <input placeholder="Topic focus (e.g. recursion)" value={newGroupTopic} onChange={(e) => setNewGroupTopic(e.target.value)} className="px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none" />
                <input placeholder="Max members" type="number" value={newGroupMax} onChange={(e) => setNewGroupMax(Number(e.target.value))} className="px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none" />
                <select value={newGroupVisibility} onChange={(e) => setNewGroupVisibility(e.target.value as any)} className="px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
                <button onClick={() => { createGroup({ name: newGroupName, description: newGroupDesc, topicFocus: newGroupTopic, maxMembers: newGroupMax, visibility: newGroupVisibility }); setShowCreate(false); }} className="px-4 py-2 rounded-lg text-[11px] font-bold text-white bg-violet-500 hover:bg-violet-600 transition-all">Create</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Groups Grid */}
      <div className="flex-1 overflow-y-auto p-6" style={{ minHeight: 0 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {groups.map((group) => {
            const memberCount = group.members.length;
            const isFull = memberCount >= group.maxMembers;
            const isJoined = group.members.some((m) => m.studentId === 'current-user');

            return (
              <button
                key={group.id}
                onClick={() => selectGroup(group.id)}
                className="w-full text-left p-5 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: '#1E1D27',
                  borderColor: isJoined ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.06)',
                  opacity: isFull && !isJoined ? 0.5 : 1,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {group.visibility === 'private' ? (
                      <Lock size={12} className="text-[#FB923C]" />
                    ) : (
                      <Globe size={12} className="text-[#34D399]" />
                    )}
                    <h3 className="text-[14px] font-bold text-[#F5F5F7]">{group.name}</h3>
                  </div>
                  {isJoined && (
                    <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/20 font-bold">JOINED</span>
                  )}
                </div>
                <p className="text-[11px] text-[#8B8A99] mb-3 line-clamp-2">{group.description}</p>

                <div className="flex items-center justify-between text-[10px] text-[#6B6A78] mb-2">
                  <span className="flex items-center gap-1"><Users size={10} /> {memberCount}/{group.maxMembers}</span>
                  <span>Score: {group.activityScore}</span>
                </div>

                {/* Member avatars */}
                <div className="flex -space-x-2 mb-3">
                  {group.members.slice(0, 4).map((m, i) => (
                    <div key={m.studentId} className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-[#1E1D27]" style={{ background: `hsl(${(i * 60) % 360}, 60%, 50%)` }}>
                      {m.name.charAt(0)}
                    </div>
                  ))}
                  {memberCount > 4 && (
                    <div className="w-6 h-6 rounded-full bg-[#14131A] flex items-center justify-center text-[8px] text-[#6B6A78] border-2 border-[#1E1D27]">
                      +{memberCount - 4}
                    </div>
                  )}
                </div>

                {/* Topic pills */}
                <div className="flex flex-wrap gap-1">
                  {group.topicsCovered.slice(0, 3).map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA] border border-violet-500/15">{t}</span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Group Detail View ─────────────────────────────────────────────────────

function GroupDetailView() {
  const { progress, activeTopic } = useCurriculum();
  const {
    activeGroup, activeGroupMessages, activeGroupSolutions,
    sendMessage, postSolution, goBack, joinGroup,
  } = useStudyGroups(progress, activeTopic);
  const [tab, setTab] = useState<'chat' | 'solutions' | 'members'>('chat');
  const [messageInput, setMessageInput] = useState('');
  const [solutionTitle, setSolutionTitle] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [showSolutionForm, setShowSolutionForm] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  if (!activeGroup) return null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeGroupMessages.length]);

  const tabs = [
    { id: 'chat' as const, icon: MessageSquare, label: `Chat (${activeGroupMessages.length})` },
    { id: 'solutions' as const, icon: Code2, label: `Solutions (${activeGroupSolutions.length})` },
    { id: 'members' as const, icon: Users, label: `Members (${activeGroup.members.length})` },
  ];

  return (
    <div className="flex flex-col h-full" style={{ minWidth: 0 }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.05] shrink-0">
        <button onClick={goBack} className="p-1.5 rounded-lg text-[#6B6A78] hover:text-[#A78BFA] transition-all">
          <ArrowLeft size={16} />
        </button>
        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-bold text-[#F5F5F7]">{activeGroup.name}</h2>
          <p className="text-[11px] text-[#8B8A99]">{activeGroup.description}</p>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] px-2 py-0.5 rounded-lg bg-violet-500/10 text-[#A78BFA] border border-violet-500/20 font-bold">
            {activeGroup.members.length}/{activeGroup.maxMembers} members
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-6 py-2 border-b border-white/[0.03] shrink-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
              tab === t.id ? 'bg-violet-500/10 text-[#A78BFA]' : 'text-[#6B6A78] hover:text-[#8B8A99]'
            }`}
          >
            <t.icon size={12} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
        {/* Chat Tab */}
        {tab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-4">
              {activeGroupMessages.map((msg) => (
                <div key={msg.id} className="mb-4">
                  <div className="flex items-start gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{ background: '#8B5CF620', color: '#A78BFA' }}>
                      {msg.studentName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-[#F5F5F7]">{msg.studentName}</span>
                        <span className="text-[9px] text-[#6B6A78]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {msg.type === 'code' && (
                          <span className="text-[8px] px-1 py-0.5 rounded bg-emerald-500/10 text-[#34D399] font-bold">CODE</span>
                        )}
                      </div>
                      <div className="mt-1 text-[12px] text-[#C4C3D0] whitespace-pre-wrap leading-relaxed">{msg.content}</div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Message Input */}
            <div className="px-4 py-3 border-t border-white/[0.05] shrink-0">
              <div className="flex gap-2">
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && messageInput.trim()) { sendMessage(activeGroup.id, messageInput.trim(), messageInput.includes('```') ? 'code' : 'text'); setMessageInput(''); } }}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 rounded-xl text-[12px] bg-[#1E1D27] border border-white/[0.06] text-[#F5F5F7] placeholder-[#6B6A78] outline-none focus:border-violet-500/30"
                />
                <button
                  onClick={() => { if (messageInput.trim()) { sendMessage(activeGroup.id, messageInput.trim(), 'text'); setMessageInput(''); } }}
                  className="px-3 py-2 rounded-xl bg-violet-500 text-white hover:bg-violet-600 transition-all"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Solutions Tab */}
        {tab === 'solutions' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-bold text-[#F5F5F7]">Shared Solutions</span>
              <button onClick={() => setShowSolutionForm(!showSolutionForm)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-[#34D399] border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all">
                <Code2 size={11} /> Share Solution
              </button>
            </div>

            <AnimatePresence>
              {showSolutionForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                  <div className="p-3 rounded-xl bg-[#1E1D27] border border-white/[0.06]">
                    <input placeholder="Solution title" value={solutionTitle} onChange={(e) => setSolutionTitle(e.target.value)} className="w-full mb-2 px-3 py-2 rounded-lg text-[11px] bg-[#14131A] border border-white/[0.06] text-[#F5F5F7] outline-none" />
                    <textarea placeholder="Paste your code here..." value={solutionCode} onChange={(e) => setSolutionCode(e.target.value)} rows={6} className="w-full mb-2 px-3 py-2 rounded-lg text-[11px] font-mono bg-[#14131A] border border-white/[0.06] text-[#C4C3D0] outline-none resize-none" />
                    <button onClick={() => { postSolution(activeGroup.id, { title: solutionTitle, code: solutionCode, language: 'java', topicId: activeGroup.topicFocus }); setShowSolutionForm(false); setSolutionTitle(''); setSolutionCode(''); }} className="px-4 py-1.5 rounded-lg text-[10px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 transition-all">Post Solution</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-3">
              {activeGroupSolutions.map((sol) => (
                <div key={sol.id} className="p-4 rounded-xl bg-[#14131A] border border-white/[0.04]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Code2 size={12} className="text-[#34D399]" />
                      <h4 className="text-[13px] font-bold text-[#F5F5F7]">{sol.title}</h4>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/10 text-[#A78BFA]">{sol.language}</span>
                  </div>
                  <pre className="text-[11px] font-mono text-[#C4C3D0] bg-[#1E1D27] p-3 rounded-lg overflow-x-auto mb-2">{sol.code}</pre>
                  <div className="flex items-center justify-between text-[10px] text-[#6B6A78]">
                    <span>by {sol.studentName}</span>
                    <span className="flex items-center gap-1"><Star size={10} /> {sol.upvotes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Members Tab */}
        {tab === 'members' && (
          <div className="p-4">
            <div className="flex flex-col gap-3">
              {activeGroup.members.map((member) => (
                <div key={member.studentId} className="flex items-center gap-3 p-3 rounded-xl bg-[#14131A] border border-white/[0.04]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold" style={{ background: '#8B5CF620', color: '#A78BFA' }}>
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-bold text-[#F5F5F7]">{member.name}</span>
                      {member.role === 'creator' && (
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/10 text-[#F59E0B] font-bold">CREATOR</span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#6B6A78]">{member.xpEarned} XP earned</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Invite code */}
            <div className="mt-4 p-3 rounded-xl bg-[#1E1D27] border border-white/[0.06]">
              <span className="text-[10px] font-bold text-[#6B6A78] uppercase tracking-wider">Invite Code</span>
              <div className="flex items-center gap-2 mt-1">
                <code className="text-[14px] font-mono font-bold text-[#A78BFA]">{activeGroup.inviteCode}</code>
                <button className="p-1 rounded hover:bg-white/[0.05] transition-all" title="Copy invite code">
                  <Copy size={12} className="text-[#6B6A78]" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────

const StudyGroupsView: React.FC = () => {
  return <GroupListView />;
};

export default StudyGroupsView;
