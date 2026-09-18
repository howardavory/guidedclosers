'use client';

import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { Search, Plus, Loader2, RefreshCw } from 'lucide-react';

export default function Pipeline({ onLeadSelect }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState([]);
  const [pipelineStages, setPipelineStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads(forceRefresh = false) {
    // Check Cache First
    if (!forceRefresh) {
      const cached = localStorage.getItem('ghl_pipeline_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 60 * 60 * 1000) { // 5 minutes
          setLeads(parsed.data);
          if (parsed.stages) setPipelineStages(parsed.stages);
          setIsLoading(false);
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/ghl');
      const data = await res.json();
      if (data.success) {
        setLeads(data.data);
        if (data.stages) setPipelineStages(data.stages);
        try {
          localStorage.setItem('ghl_pipeline_cache', JSON.stringify({
            timestamp: Date.now(),
            data: data.data,
            stages: data.stages || []
          }));
        } catch (storageErr) {
          console.error("Failed to save to localStorage (possibly full):", storageErr);
        }
      } else {
        console.error("GHL API Error:", data.error);
      }
    } catch(e) {
      console.error("Failed to fetch leads", e);
    }
    setIsLoading(false);
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-transparent  overflow-hidden relative">
      
      {/* Header & Search */}
      <div className="p-4 border-b border-[var(--card-border)] pb-4 flex justify-between items-center bg-transparent">
        <h2 className="text-xl font-semibold tracking-wide tracking-widest text-[var(--text-base)] tracking-wide">Triage Queue</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-base)] text-xs font-bold font-['Josefin_Sans'] uppercase" size={16} />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-sm text-[var(--text-base)] focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/30 outline-none w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => fetchLeads(true)}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl hover:border-[var(--brand-primary)]/50 hover:text-[var(--text-base)] transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} /> Sync
          </button>
          <button 
            onClick={() => onLeadSelect({ isManual: true, name: '', address: '' })}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-primary)] to-[var(--brand-primary)] text-[#000000] font-extrabold border-none rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_15px_rgba(229,193,88,0.5)] hover:opacity-95 transition-all cursor-pointer"
          >
            <Plus size={16} /> Manual
          </button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto p-4 flex gap-4">
        {isLoading ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--text-base)] text-xs font-bold font-['Josefin_Sans'] uppercase">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p>Syncing Live CRM Data from GoHighLevel...</p>
          </div>
        ) : (
          pipelineStages.map(stage => (
            <div key={stage.id} className="min-w-[320px] max-w-[320px] flex flex-col bg-gradient-to-br from-[var(--card-bg)] via-[var(--bg-base)] to-[var(--bg-base)] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl mb-4 p-3 transition-all duration-300">
              <div className="flex justify-between items-center mb-4 p-2 bg-transparent border-b border-[var(--card-border)] pb-3">
                <h3 className="text-[var(--brand-primary)] font-extrabold text-[10px] uppercase tracking-widest">{stage.name}</h3>
                <span className="bg-[var(--card-bg)] border border-[var(--card-border)] px-3 py-1 rounded-md text-xs font-bold text-[var(--brand-primary)]">
                  {filteredLeads.filter(l => l.stageId === stage.id).length}
                </span>
              </div>
              
              <div className="flex flex-col gap-3 overflow-y-auto hide-scrollbar pb-2">
                {filteredLeads.filter(l => l.stageId === stage.id).map(lead => (
                <div 
                  key={lead.id}
                  onClick={() => onLeadSelect(lead)}
                  className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 cursor-pointer hover:border-[var(--brand-primary)]/50 hover:bg-[var(--card-bg)] hover:-translate-y-0.5 transition-all shadow-sm group"
                >
                  <p className="font-bold text-[var(--text-base)] text-md mb-1 group-hover:text-[var(--brand-primary)] transition-colors">{lead.name}</p>
                  <p className="text-[10px] text-[var(--text-base)] uppercase tracking-wider mb-2 truncate">{lead.address}</p>
                  <p className="text-xs font-mono font-bold text-[var(--brand-primary)]">{lead.phone}</p>
                </div>
              ))}
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  );
}



