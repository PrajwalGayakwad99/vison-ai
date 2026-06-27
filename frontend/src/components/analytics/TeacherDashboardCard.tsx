import React, { useState } from 'react';
import Card from '../ui/Card';
import { ShieldAlert, Lock, Search, Filter } from 'lucide-react';
import type { StudentSummary } from '../../types';

const MOCK_ROSTER: StudentSummary[] = [
  {
    id: 's1',
    name: 'Rahul Malhotra',
    progress: 94,
    lastActive: '5 mins ago',
    status: 'on_track',
  },
  {
    id: 's2',
    name: 'Sarah Jenkins',
    progress: 68,
    lastActive: '2 hours ago',
    status: 'attention',
  },
  {
    id: 's3',
    name: 'Alex Kincaid',
    progress: 41,
    lastActive: '1 day ago',
    status: 'falling_behind',
  },
  {
    id: 's4',
    name: 'Michael S. (You)',
    progress: 82,
    lastActive: 'Just now',
    status: 'on_track',
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  on_track: { label: 'On Track', color: '#34D399', dot: 'bg-[#34D399]' },
  attention: { label: 'Needs Attention', color: '#FB923C', dot: 'bg-[#FB923C]' },
  falling_behind: { label: 'Falling Behind', color: '#F87171', dot: 'bg-[#F87171]' },
};

const TeacherDashboardCard: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'on_track' | 'attention' | 'falling_behind'>('all');

  const filteredRoster = MOCK_ROSTER.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || s.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <Card
      icon={<ShieldAlert size={15} strokeWidth={2} />}
      title="Mentor View / Instructor Dashboard"
      showViewAll={false}
      showRefresh={false}
    >
      <div className="mt-4 flex flex-col gap-5">
        {/* Role-gated warning banner */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <div className="flex items-center gap-2 text-[12px] text-[#FBBF24]">
            <Lock size={12} />
            <span>Role-Gated Dashboard &bull; Visible to Instructors and Mentors only</span>
          </div>
          <span className="text-[10px] text-[#6B6A78] font-bold uppercase tracking-wider">Access Approved</span>
        </div>

        {/* Toolbar: Search and Filter select */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-[280px]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student roster..."
              className="pill-input w-full pl-9 pr-4 py-1.5 text-[12px]"
            />
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B6A78]"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/[0.06] bg-[#14131A] text-[12px] font-medium text-[#8B8A99] w-full sm:w-auto justify-end sm:justify-start">
            <Filter size={12} className="text-[#6B6A78]" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-transparent text-[#C4C3D0] focus:outline-none cursor-pointer pr-1 text-[12px]"
            >
              <option value="all" className="bg-[#1E1D27] text-[#C4C3D0]">Filter: All Statuses</option>
              <option value="on_track" className="bg-[#1E1D27] text-[#C4C3D0]">Filter: On Track</option>
              <option value="attention" className="bg-[#1E1D27] text-[#C4C3D0]">Filter: Needs Attention</option>
              <option value="falling_behind" className="bg-[#1E1D27] text-[#C4C3D0]">Filter: Falling Behind</option>
            </select>
          </div>
        </div>

        {/* Dense Table Roster */}
        <div className="overflow-x-auto rounded-xl border border-white/[0.05] bg-[#14131A]/60">
          <table className="w-full text-left border-collapse text-[12.5px]">
            <thead>
              <tr className="border-b border-white/[0.05] text-[#6B6A78] uppercase font-bold tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">Student Name</th>
                <th className="p-3.5">Curriculum Progress</th>
                <th className="p-3.5">Last Active</th>
                <th className="p-3.5 pr-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filteredRoster.length > 0 ? (
                filteredRoster.map((student) => {
                  const cfg = STATUS_CONFIG[student.status];
                  return (
                    <tr key={student.id} className="hover:bg-white/[0.015] transition-colors">
                      {/* Avatar + Name */}
                      <td className="p-3.5 pl-5 flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center text-[10.5px] font-bold text-white uppercase shadow-sm">
                          {student.name.charAt(0)}
                        </div>
                        <span className="font-semibold text-[#F5F5F7]">{student.name}</span>
                      </td>

                      {/* Progress Bar */}
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-28 h-1.5 bg-white/[0.04] rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]"
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11.5px] text-[#8B8A99]">{student.progress}%</span>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="p-3.5 text-[#8B8A99] font-medium">{student.lastActive}</td>

                      {/* Status dot */}
                      <td className="p-3.5 pr-5 text-right">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/[0.04] bg-[#14131A] text-[11px] font-semibold" style={{ color: cfg.color }}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-[#6B6A78] font-medium">
                    No matching students found in this roster.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default TeacherDashboardCard;
