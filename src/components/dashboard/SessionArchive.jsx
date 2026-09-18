'use client';
import React, { useEffect, useState } from 'react';
import { CalendarDays, Flame } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
export default function SessionArchive() {
  const [stats, setStats] = useState({
    totalContacts: 0,
    variablesPulled: 0,
    disqualified: 0,
    voicemails: 0,
    contractsSent: 0,
    dropOffs: {}
  });
  // Poll for live stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);
  const dropOffData = Object.entries(stats.dropOffs || {}).map(([pillar, count]) => ({
    pillar,
    drops: count
  }));
  return (
    <div className="bg-[var(--card-bg)]/40 backdrop-blur-md rounded-2xl border border-white/50 border border-[var(--card-border)] shadow-md mb-4 flex flex-col overflow-hidden flex-1 transition-all duration-300 transition-all hover:scale-[1.01]">
      
      {/* HEADER */}
      <div className="p-4 border-b-4 border-[var(--card-border)] bg-[var(--card-bg)]/60 flex justify-between items-center shadow-md z-10">
        <h3 className="m-0 text-[var(--text-base)] font-semibold tracking-wide text-3xl tracking-widest flex items-center gap-3 drop-shadow-md">
          <CalendarDays size={24} className="text-[#00E5FF]" />
          Session Analytics
        </h3>
        <span className="text-gray-800 bg-[var(--card-bg)]/60 font-semibold tracking-wide text-2xl tracking-widest px-4 py-1 transition-all duration-300 - border border-[var(--card-border)] shadow-md animate-pulse">
          LIVE
        </span>
      </div>
      {/* STATS GRID */}
      <div className="grid grid-cols-3 border-b-4 border-[var(--card-border)] z-0">
        
        <div className="p-4 text-center bg-[var(--card-bg)]/80 border-r-4 border-[var(--card-border)] relative overflow-hidden">
          <div className="text-6xl font-semibold tracking-wide text-[#00E5FF] drop-shadow-[3px_3px_0px_#D4AF37] relative z-10">{stats.variablesPulled}</div>
          <div className="text-lg font-semibold tracking-wide tracking-widest text-[var(--text-base)] mt-1 relative z-10">VARS PULLED</div>
        </div>
        <div className="p-4 text-center bg-[var(--card-bg)]/60 border-r-4 border-[var(--card-border)] relative overflow-hidden">
          <div className="text-6xl font-semibold tracking-wide text-[var(--text-base)] drop-shadow-md relative z-10">{stats.voicemails}</div>
          <div className="text-lg font-semibold tracking-wide tracking-widest text-gray-800 mt-1 relative z-10">VOICEMAILS</div>
        </div>
        <div className="p-4 text-center bg-[var(--card-bg)]/60 relative overflow-hidden">
          <div className="text-6xl font-semibold tracking-wide text-gray-800 drop-shadow-[3px_3px_0px_#D4AF37] relative z-10">{stats.disqualified}</div>
          <div className="text-lg font-semibold tracking-wide tracking-widest text-gray-800 mt-1 relative z-10">DISQUALIFIED</div>
        </div>
      </div>
      {/* HEATMAP */}
      <div className="bg-[var(--card-bg)] border-b-4 border-[var(--card-border)]">
        <h4 className="m-0 p-3 border-b-4 border-[var(--card-border)] bg-[var(--card-bg)]/60 text-gray-800 font-semibold tracking-wide text-xl tracking-widest flex items-center gap-2">
          <Flame size={20} className="text-[#D4AF37]" /> Exhaust Pressure Heatmap
        </h4>
        <div className="w-full h-32 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dropOffData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <XAxis dataKey="pillar" tick={{ fontSize: 14, fill: '#000000', fontFamily: 'Bangers, sans-serif' }} axisLine={{ stroke: '#000', strokeWidth: 4 }} tickLine={false} />
              <YAxis tick={{ fontSize: 14, fill: '#000000', fontFamily: 'Bangers, sans-serif' }} axisLine={{ stroke: '#000', strokeWidth: 4 }} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{ fill: 'rgba(0,229,255,0.2)' }} contentStyle={{ fontSize: '1rem', borderRadius: '0px', padding: '10px', background: '#FFFCE8', border: '4px solid #000', color: '#000000', fontFamily: 'Bangers, sans-serif', boxShadow: '4px 4px 0px #000' }} />
              <Bar dataKey="drops" fill="#00FF66" stroke="#000000" strokeWidth={3} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* LOGS FEED */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 comic-halftone hide-scrollbar bg-[var(--card-bg)]/80 min-h-[150px]">
        {(!stats.logs || stats.logs.length === 0) ? (
          <div className="text-[var(--text-base)] text-center m-auto font-semibold tracking-wide text-3xl tracking-widest bg-[var(--card-bg)]/80 p-6 border border-white transition-all duration-300 - shadow-sm">
            NO HEAT DETECTED... <br/> <span className="text-[#D4AF37]">GET TO WORK!</span>
          </div>
        ) : (
          stats.logs.map((log, idx) => (
            <div key={idx} className={`p-3 bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] shadow-md transition-all duration-300 - relative
              ${log.isSuccess ? 'border-l-8 border-l-[#00FF66]' : log.isDisqualified ? 'border-l-8 border-l-[#D4AF37]' : 'border-l-8 border-l-[#FFE600]'}
            `}>
              <div className="absolute top-2 right-2 bg-[var(--card-bg)]/80 text-[var(--text-base)] font-semibold tracking-wide px-2 py-0.5 text-xs transition-all duration-300 ">{log.time}</div>
              <div className="font-bold text-gray-800 mb-1 font-['Josefin_Sans'] text-sm">{log.target}</div>
              <div className={`flex items-center gap-1.5 mt-1 font-semibold tracking-wide tracking-widest text-lg
                ${log.isSuccess ? 'text-[#00E676]' : log.isDisqualified ? 'text-[#D4AF37]' : 'text-gray-800'}
              `}>
                {log.action}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
