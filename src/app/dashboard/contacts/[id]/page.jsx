'use client';
import { useState } from 'react';
import { ArrowLeft, Phone, Mail, MapPin, Tag, Plus, MessageSquare, PhoneCall } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import CallScript from '@/components/script/CallScript';
import Sidebar from '@/components/dashboard/Sidebar';

export default function ContactDetails({ params }) {
  // In a full implementation, fetch from /api/contacts/${params.id}
  // For UI scaffolding, we are building the structural grid first.
  const [activeLead, setActiveLead] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mockLeadData = {
    id: 'mock-1',
    name: 'John Doe',
    address: '123 Main St, Bakersfield, CA 93301',
    phone: '(555) 123-4567',
    email: 'john.doe@example.com',
    distressMarkers: ['Pre-Foreclosure']
  };

  const handleLaunchScript = () => {
    setActiveLead(mockLeadData);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[var(--bg-base)]">
      
      {/* 2. INJECT GRID LAYOUT */}
      <div className={clsx(
        "relative z-10 min-h-screen w-full text-[var(--text-base)] grid transition-[grid-template-columns] duration-300 ease-in-out", 
        isSidebarOpen ? 'grid-cols-[250px_1fr]' : 'grid-cols-[80px_1fr]'
      )}>
        
        {/* 3. RENDER SIDEBAR */}
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex flex-col h-screen overflow-hidden relative bg-transparent">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/contacts" className="text-gray-500 hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
                Contact Details
              </h1>
            </div>

            {!activeLead && (
              <button 
                onClick={handleLaunchScript}
                className="bg-gradient-to-r from-[var(--brand-primary)] to-[#F3E5AB] text-black font-black uppercase tracking-widest px-6 py-2.5 rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.3)] flex items-center gap-2"
              >
                <PhoneCall size={18} /> Launch Call Script
              </button>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative">
            
            {activeLead ? (
              // 4. FIX SCROLL COLLISION (Changed to flex flex-col)
              <div className="absolute inset-0 flex flex-col">
                <CallScript 
                  activeLead={activeLead} 
                  isSidebarOpen={isSidebarOpen} 
                  onReturn={(dispo) => {
                    if (dispo) console.log('Disposition Saved:', dispo);
                    setActiveLead(null);
                  }} 
                />
              </div>
            ) : (
              <div className="p-6 h-full overflow-y-auto hide-scrollbar">
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 h-full">
                  
                  {/* COLUMN 1: Stewardship (Contact & Property Info) */}
                  <div className="xl:col-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col h-full shadow-2xl overflow-y-auto hide-scrollbar">
                    <div className="p-6 border-b border-white/10">
                      <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] flex items-center justify-center font-black text-2xl border border-[var(--brand-primary)]/30 mb-4">
                        JD
                      </div>
                      <h2 className="text-xl font-bold text-white mb-1">John Doe</h2>
                      <span className="text-[10px] font-bold text-[var(--brand-primary)] uppercase tracking-widest bg-[var(--brand-primary)]/10 px-2 py-1 rounded-md">Distressed Seller</span>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Phone size={16} className="text-gray-500" /> (555) 123-4567
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                          <Mail size={16} className="text-gray-500" /> john.doe@example.com
                        </div>
                        <div className="flex items-start gap-3 text-sm text-gray-300">
                          <MapPin size={16} className="text-gray-500 mt-1 shrink-0" /> 
                          <span>123 Main St<br/>Bakersfield, CA 93301</span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/10">
                        <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><Tag size={12}/> Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded border border-white/20">Pre-Foreclosure</span>
                          <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-1 rounded border border-white/20">High Motivation</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 2: Communication / Activity Feed */}
                  <div className="xl:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20 shrink-0">
                      <h3 className="text-white font-black uppercase tracking-widest text-sm flex items-center gap-2">
                        <MessageSquare size={16} className="text-[#00E5FF]"/> Activity Feed
                      </h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                      {/* Mock Audit Log */}
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                          <Plus size={14} className="text-gray-400" />
                        </div>
                        <div className="flex-1 bg-white/5 border border-white/10 p-4 rounded-xl">
                          <p className="text-xs text-white font-bold mb-1">Opportunity Created</p>
                          <p className="text-xs text-gray-400">Added to Wholesale Pipeline - New Leads</p>
                          <span className="text-[10px] text-gray-600 mt-2 block">Sep 18, 2026 - 10:30 AM</span>
                        </div>
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-black/40 shrink-0">
                      <div className="relative">
                        <input type="text" placeholder="Type a note or message..." className="w-full bg-black/50 border border-white/20 text-white pl-4 pr-12 py-3 rounded-xl focus:border-[var(--brand-primary)] outline-none text-sm" />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--brand-primary)] hover:text-white transition-colors p-2">
                          <MessageSquare size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* COLUMN 3: Transaction (Active Opportunities) */}
                  <div className="xl:col-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col h-full shadow-2xl overflow-y-auto hide-scrollbar">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                      <h3 className="text-white font-black uppercase tracking-widest text-sm">Opportunities (1)</h3>
                      <button className="text-gray-400 hover:text-white transition-colors"><Plus size={16}/></button>
                    </div>
                    <div className="p-4">
                      <div onClick={handleLaunchScript} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[var(--brand-primary)] transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xs font-bold text-white">Wholesale Pipeline</h4>
                          <span className="text-[10px] text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded uppercase tracking-widest font-bold">Open</span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Stage: New Leads</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-black text-[var(--brand-primary)]">$0.00</span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase">Primary</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
