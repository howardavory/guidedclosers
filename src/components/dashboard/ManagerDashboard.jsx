'use client';

/* eslint-disable react/no-unstable-nested-components */
import React, { useState, useEffect } from 'react';
/* eslint-disable react/no-unstable-nested-components */
import useStore from '@/store/useStore';
/* eslint-disable react/no-unstable-nested-components */
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
/* eslint-disable react/no-unstable-nested-components */
import { ShieldAlert, Users, Calendar, Filter } from 'lucide-react';

export default function ManagerDashboard() {
  const { sessionLogs } = useStore();
  const [repFilter, setRepFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('7D');
  const [stats, setStats] = useState({
    totalContacts: 0,
    variablesPulled: 0,
    disqualified: 0,
    voicemails: 0,
    contractsSent: 0,
    dropOffs: {}
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch manager stats:', err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const colorMap = {
    'Intro': '#3b82f6',
    'Occupancy': '#8b5cf6',
    'Condition': '#ef4444',
    'Timeline': '#f59e0b',
    'Financials': '#ec4899',
    'Contracting': '#22c55e'
  };

  const heatmapData = Object.entries(stats.dropOffs || {}).map(([name, value]) => ({
    name,
    value,
    color: colorMap[name] || '#94a3b8'
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-transparent border border-[var(--card-border)] p-3 rounded-lg shadow-xl">
          <p className="text-[var(--text-base)] font-bold text-sm mb-1">{label}</p>
          <p className="text-accent-alert text-xs font-bold uppercase tracking-wider">
            {payload[0].value} Drop-Offs
          </p>
        </div>
      );
    }
    return null;
  };

  const criticalBottleneck = Object.entries(stats.dropOffs || {}).reduce((a, b) => (b[1] > a[1] ? b : a), ['None', 0])[0];

  return (
    <div className="h-screen bg-transparent text-[var(--text-base)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-wide text-[var(--text-base)] tracking-wide mb-2">Executive Analytics</h1>
            <p className="text-[var(--text-base)] text-sm">Objection Heatmapping & Conversion Tracking</p>
          </div>

          <div className="flex gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-base)]">
                <Users size={16} />
              </div>
              <select 
                value={repFilter} 
                onChange={(e) => setRepFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-transparent border border-[var(--card-border)] rounded-lg text-[var(--text-base)] text-sm outline-none focus:border-[var(--card-border)] appearance-none cursor-pointer"
              >
                <option value="All" className="bg-[var(--card-bg)] text-[var(--text-base)]">All Sales Reps</option>
                <option value="RepA" className="bg-[var(--card-bg)] text-[var(--text-base)]">John Doe</option>
                <option value="RepB" className="bg-[var(--card-bg)] text-[var(--text-base)]">Jane Smith</option>
              </select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[var(--text-base)]">
                <Calendar size={16} />
              </div>
              <select 
                value={dateFilter} 
                onChange={(e) => setDateFilter(e.target.value)}
                className="pl-10 pr-8 py-2 bg-transparent border border-[var(--card-border)] rounded-lg text-[var(--text-base)] text-sm outline-none focus:border-[var(--card-border)] appearance-none cursor-pointer"
              >
                <option value="Today" className="bg-[var(--card-bg)] text-[var(--text-base)]">Today</option>
                <option value="7D" className="bg-[var(--card-bg)] text-[var(--text-base)]">Last 7 Days</option>
                <option value="30D" className="bg-[var(--card-bg)] text-[var(--text-base)]">Last 30 Days</option>
                <option value="YTD" className="bg-[var(--card-bg)] text-[var(--text-base)]">Year to Date</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="text-[var(--text-base)] text-xs uppercase tracking-wider mb-2">Total Contacts</h4>
            <div className="text-3xl font-bold text-gradient">{stats.totalContacts}</div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="text-[var(--text-base)] text-xs uppercase tracking-wider mb-2">Contracts Sent</h4>
            <div className="text-3xl font-bold text-gradient-accent">{stats.contractsSent}</div>
          </div>
          <div className="glass-card p-6 rounded-2xl">
            <h4 className="text-[var(--text-base)] text-xs uppercase tracking-wider mb-2">Critical Bottleneck</h4>
            <div className="text-xl font-bold text-accent-alert mt-1 flex items-center gap-2">
              <ShieldAlert size={20} />
              {criticalBottleneck}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl mb-8">
          <h3 className="text-lg font-bold text-gradient mb-6">Pillar Drop-Off Heatmap</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={heatmapData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#a1a1aa" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {heatmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
