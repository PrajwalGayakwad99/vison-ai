'use client';

import React, { useState } from 'react';
import {
  Search, ChevronDown, Settings, Bell, Calendar, X,
  Zap, Trophy, Users, ArrowRight, GraduationCap, CheckCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSettingsStore, Theme, FontSize } from '@/store/settingsStore';

// ─── Toggle Switch ──────────────────────────────────────────────────────────
const Toggle: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({ checked, onChange }) => (
  <button
    onClick={() => onChange(!checked)}
    className="w-10 h-5 rounded-full relative p-0.5 transition-all duration-200 shrink-0"
    style={{
      background: checked ? 'linear-gradient(135deg, #8B5CF6, #A78BFA)' : 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.05)',
    }}
  >
    <div
      className="w-4 h-4 rounded-full bg-white shadow-md transition-all duration-200"
      style={{ transform: checked ? 'translateX(19px)' : 'translateX(0px)' }}
    />
  </button>
);

// ─── Mini Select Dropdown ───────────────────────────────────────────────────
const MiniSelect: React.FC<{
  value: string;
  options: string[];
  onChange: (v: string) => void;
}> = ({ value, options, onChange }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[11px] text-[#8B8A99] bg-[#14131A] border border-white/[0.06] rounded-lg px-2 py-1 pr-5 focus:outline-none cursor-pointer"
      >
        {value}
        <ChevronDown size={12} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+4px)] z-50 min-w-[120px] rounded-lg overflow-hidden py-1" style={{ background: '#1E1D27', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => { onChange(opt); setOpen(false); }}
                className="w-full text-left px-3 py-1.5 text-[11px] transition-colors flex items-center justify-between"
                style={{ color: value === opt ? '#A78BFA' : '#8B8A99', background: value === opt ? 'rgba(139,92,246,0.1)' : 'transparent' }}
              >
                {opt}
                {value === opt && <CheckCircle size={12} className="text-[#34D399]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Notification Data ──────────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, title: 'Badge Unlocked!', message: 'You earned the "7-Day Streak" badge.', icon: Trophy, color: '#FB923C', time: '5m ago', unread: true },
  { id: 2, title: 'New Challenge Available', message: 'Daily Challenge: Binary Search — 250 XP', icon: Zap, color: '#8B5CF6', time: '1h ago', unread: true },
  { id: 3, title: 'Study Group Activity', message: '3 new messages in "Recursion Deep-Dive"', icon: Users, color: '#34D399', time: '2h ago', unread: true },
  { id: 4, title: 'Weekly Report Ready', message: 'Your learning analytics are updated.', icon: GraduationCap, color: '#60A5FA', time: '1d ago', unread: false },
];

// ─── User Avatar ────────────────────────────────────────────────────────────
const UserAvatar: React.FC<{ onClick?: () => void }> = ({ onClick }) => (
  <div className="relative cursor-pointer group" onClick={onClick}>
    <div
      className="w-[36px] h-[36px] rounded-full flex items-center justify-center text-[13px] font-bold text-white transition-all duration-150 group-hover:ring-2 group-hover:ring-[#8B5CF6]/40"
      style={{
        background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
        boxShadow: '0 2px 8px rgba(139,92,246,0.4)',
      }}
    >
      R
    </div>
    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#14131A]" style={{ background: '#34D399' }} />
  </div>
);

// ─── Period Dropdown ────────────────────────────────────────────────────────
const PeriodDropdown: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const options = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly'];

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium text-[#C4C3D0] transition-all duration-150 hover:text-[#F5F5F7]" style={{ background: open ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${open ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.07)'}` }}>
        <Calendar size={13} strokeWidth={2} className="text-[#8B5CF6]" />
        {value}
        <ChevronDown size={13} strokeWidth={2} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+6px)] z-20 min-w-[140px] rounded-2xl overflow-hidden py-1.5" style={{ background: '#1E1D27', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
            {options.map((opt) => (
              <button key={opt} onClick={() => { onChange(opt); setOpen(false); }} className="w-full text-left px-3.5 py-2 text-[13px] font-medium transition-colors flex items-center justify-between" style={{ color: value === opt ? '#A78BFA' : '#8B8A99', background: value === opt ? 'rgba(139,92,246,0.1)' : 'transparent' }}>
                {opt}
                {value === opt && <CheckCircle size={13} className="text-[#34D399]" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Notification Bell ──────────────────────────────────────────────────────
const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <div className="relative">
      <button className="icon-btn relative" onClick={() => setOpen(!open)} style={{ background: open ? 'rgba(139,92,246,0.1)' : undefined, border: open ? '1px solid rgba(139,92,246,0.3)' : undefined }}>
        <Bell size={16} strokeWidth={1.75} />
        {unreadCount > 0 && <span className="badge-pulse absolute -top-0.5 -right-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1" style={{ background: 'linear-gradient(135deg, #8B5CF6, #A78BFA)', boxShadow: '0 2px 6px rgba(139,92,246,0.5)' }}>{unreadCount}</span>}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-80 rounded-2xl overflow-hidden" style={{ background: '#1E1D27', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
              <h3 className="text-[13px] font-bold text-[#F5F5F7]">Notifications</h3>
              {unreadCount > 0 && <button onClick={markAllRead} className="text-[10px] text-[#A78BFA] hover:text-[#C4B5FD] font-semibold">Mark all read</button>}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <button key={notif.id} className="w-full text-left px-4 py-3 flex gap-3 transition-colors hover:bg-white/[0.03] border-b border-white/[0.03] last:border-0" onClick={() => setNotifications((prev) => prev.map((n) => n.id === notif.id ? { ...n, unread: false } : n))}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${notif.color}15`, border: `1px solid ${notif.color}25` }}>
                      <Icon size={14} style={{ color: notif.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-semibold text-[#F5F5F7]">{notif.title}</span>
                        {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />}
                      </div>
                      <p className="text-[11px] text-[#8B8A99] mt-0.5 truncate">{notif.message}</p>
                      <span className="text-[9px] text-[#6B6A78] mt-1">{notif.time}</span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="px-4 py-2.5 border-t border-white/[0.05]">
              <button className="w-full text-[11px] text-[#A78BFA] font-semibold text-center hover:text-[#C4B5FD] py-1">View All →</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Settings Panel ────────────────────────────────────────────────────────
const SettingsPanel: React.FC = () => {
  const [open, setOpen] = useState(false);

  // Settings store values
  const theme = useSettingsStore((s) => s.theme);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const animations = useSettingsStore((s) => s.animations);
  const pushNotifications = useSettingsStore((s) => s.pushNotifications);
  const emailDigest = useSettingsStore((s) => s.emailDigest);
  const challengeReminders = useSettingsStore((s) => s.challengeReminders);
  const defaultLanguage = useSettingsStore((s) => s.defaultLanguage);

  // Actions
  const setTheme = useSettingsStore((s) => s.setTheme);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const setAnimations = useSettingsStore((s) => s.setAnimations);
  const setPushNotifications = useSettingsStore((s) => s.setPushNotifications);
  const setEmailDigest = useSettingsStore((s) => s.setEmailDigest);
  const setChallengeReminders = useSettingsStore((s) => s.setChallengeReminders);
  const setDefaultLanguage = useSettingsStore((s) => s.setDefaultLanguage);

  const themeLabels: Record<Theme, string> = { dark: 'Dark', light: 'Light', system: 'System' };
  const fontSizeLabels: Record<FontSize, string> = { small: 'Small', medium: 'Medium', large: 'Large' };
  const langLabels: Record<string, string> = { python: 'Python', javascript: 'JavaScript', cpp: 'C++', java: 'Java', typescript: 'TypeScript', go: 'Go', rust: 'Rust' };

  const handlePushToggle = async (enabled: boolean) => {
    const result = await setPushNotifications(enabled);
    if (!result && enabled) {
      // Show toast notification
      alert('Browser notifications blocked. Enable in browser settings.');
    }
  };

  return (
    <div className="relative">
      <button className="icon-btn" onClick={() => setOpen(!open)} style={{ background: open ? 'rgba(139,92,246,0.1)' : undefined, border: open ? '1px solid rgba(139,92,246,0.3)' : undefined }}>
        <Settings size={16} strokeWidth={1.75} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-80 rounded-2xl overflow-hidden" style={{ background: '#1E1D27', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
              <h3 className="text-[14px] font-bold text-[#F5F5F7]">Settings</h3>
              <button onClick={() => setOpen(false)} className="text-[#6B6A78] hover:text-[#F5F5F7] transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="max-h-[480px] overflow-y-auto p-4">
              {/* Appearance */}
              <div className="mb-5">
                <p className="text-[9px] font-bold text-[#6B6A78] uppercase tracking-wider mb-3">Appearance</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#C4C3D0]">Theme</span>
                    <MiniSelect value={themeLabels[theme]} options={['Dark', 'Light', 'System']} onChange={(v) => setTheme(v.toLowerCase() as Theme)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#C4C3D0]">Font Size</span>
                    <MiniSelect value={fontSizeLabels[fontSize]} options={['Small', 'Medium', 'Large']} onChange={(v) => setFontSize(v.toLowerCase() as FontSize)} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#C4C3D0]">Animations</span>
                    <Toggle checked={animations} onChange={setAnimations} />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="mb-5">
                <p className="text-[9px] font-bold text-[#6B6A78] uppercase tracking-wider mb-3">Notifications</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#C4C3D0]">Push Notifications</span>
                    <Toggle checked={pushNotifications} onChange={handlePushToggle} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#C4C3D0]">Email Digest</span>
                    <Toggle checked={emailDigest} onChange={setEmailDigest} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#C4C3D0]">Challenge Reminders</span>
                    <Toggle checked={challengeReminders} onChange={setChallengeReminders} />
                  </div>
                </div>
              </div>

              {/* Learning */}
              <div>
                <p className="text-[9px] font-bold text-[#6B6A78] uppercase tracking-wider mb-3">Learning</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#C4C3D0]">Default Language</span>
                    <MiniSelect
                      value={langLabels[defaultLanguage] || 'Python'}
                      options={['Python', 'JavaScript', 'TypeScript', 'C++', 'Java', 'Go', 'Rust']}
                      onChange={(v) => {
                        const map: Record<string, string> = { Python: 'python', JavaScript: 'javascript', TypeScript: 'typescript', 'C++': 'cpp', Java: 'java', Go: 'go', Rust: 'rust' };
                        setDefaultLanguage(map[v] || 'python');
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Search Dropdown ────────────────────────────────────────────────────────
const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const router = useRouter();

  const suggestions = [
    { label: 'Recursion Basics', route: '/curriculum', icon: GraduationCap, color: '#8B5CF6' },
    { label: 'Binary Search', route: '/curriculum', icon: Search, color: '#34D399' },
    { label: 'Data Structures', route: '/curriculum', icon: GraduationCap, color: '#60A5FA' },
    { label: 'Dynamic Programming', route: '/curriculum', icon: GraduationCap, color: '#FB923C' },
    { label: 'Fibonacci Challenge', route: '/challenges', icon: Trophy, color: '#A78BFA' },
    { label: 'Study Groups', route: '/study-groups', icon: Users, color: '#EC4899' },
  ].filter((s) => s.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="relative flex-1 max-w-[360px]">
      <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 200)} placeholder="Search courses, topics, challenges…" className="pill-input w-full pl-4 pr-10 py-2" style={{ borderColor: focused ? 'rgba(139,92,246,0.4)' : undefined, boxShadow: focused ? '0 0 0 3px rgba(139,92,246,0.1)' : undefined }} />
      <Search size={15} strokeWidth={2} className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: query ? '#A78BFA' : '#6B6A78' }} />
      {focused && query.length > 0 && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full rounded-2xl overflow-hidden" style={{ background: '#1E1D27', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          {suggestions.length > 0 ? suggestions.map((s) => (
            <button key={s.label} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors" onClick={() => { router.push(s.route); setQuery(''); }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${s.color}15` }}><s.icon size={13} style={{ color: s.color }} /></div>
              <span className="text-[12px] text-[#C4C3D0] flex-1">{s.label}</span>
              <ArrowRight size={12} className="text-[#6B6A78]" />
            </button>
          )) : <div className="px-4 py-6 text-center"><p className="text-[12px] text-[#6B6A78]">No results for "{query}"</p></div>}
        </div>
      )}
      {focused && !query && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-20 w-full rounded-2xl overflow-hidden px-4 py-3" style={{ background: '#1E1D27', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
          <p className="text-[9px] font-bold text-[#6B6A78] uppercase tracking-wider mb-2">Quick Access</p>
          {['Dashboard', 'Workspace', 'Curriculum', 'Gamification'].map((label) => {
            const routeMap: Record<string, string> = { Dashboard: '/', Workspace: '/workspace', Curriculum: '/curriculum', Gamification: '/gamification' };
            return <button key={label} className="w-full text-left text-[12px] text-[#8B8A99] hover:text-[#F5F5F7] py-1.5 transition-colors" onClick={() => { router.push(routeMap[label]); setQuery(''); }}>{label}</button>;
          })}
        </div>
      )}
    </div>
  );
};

// ─── TopBar Component ──────────────────────────────────────────────────────
interface TopBarProps {
  onProfileClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onProfileClick }) => {
  const [period, setPeriod] = useState('Monthly');

  return (
    <header className="flex items-center gap-4 px-6 flex-shrink-0" style={{ height: '64px', borderBottom: '1px solid rgba(255,255,255,0.05)', background: '#14131A' }}>
      <SearchBar />
      <div className="flex-1" />
      <div className="flex items-center gap-2.5 flex-shrink-0">
        <PeriodDropdown value={period} onChange={setPeriod} />
        <SettingsPanel />
        <NotificationBell />
        <div className="w-px h-6" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <UserAvatar onClick={onProfileClick} />
      </div>
    </header>
  );
};

export default TopBar;
