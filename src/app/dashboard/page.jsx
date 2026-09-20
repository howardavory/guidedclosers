'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import useStore from '@/store/useStore';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import Sidebar from '@/components/dashboard/Sidebar';
import NativePipeline from '@/components/dashboard/NativePipeline';
import CallScript from '@/components/script/CallScript';
export default function DashboardPage() {
  const router = useRouter();
  // ---------------------------------------------------
  // ENTERPRISE STATE & AUTHENTICATION
  // ---------------------------------------------------
  const { currentUser } = useStore();
  const theme = currentUser?.preferences?.theme || 'dark';
  const userRole = currentUser?.role; // Aliased to prevent ReferenceErrors later in the component
  
  const [activeLead, setActiveLead] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const liveFormData = useStore(state => state.liveFormData);

  // 4 Pillars Progress HUD Logic
  const hasCondition = !!liveFormData?.sfRoof || !!liveFormData?.sfPlumbing || !!liveFormData?.sfHVAC || liveFormData?.majorRedFlags?.length > 0;
  const hasTimeline = !!liveFormData?.timeline || !!liveFormData?.timelineType;
  const hasMotivation = liveFormData?.painPoints?.length > 0 || !!liveFormData?.motivationLevel;
  const hasPrice = !!liveFormData?.askingPrice || !!liveFormData?.refusedPrice;

  // The Enterprise Auth Guard
  useEffect(() => {
    // If there is no user profile or role, bounce them to login
    if (!currentUser || !currentUser.role) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    // Fetch live stats for Gamified KPI Engagement (Type 5 Personality)
    const fetchKPIs = async () => {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) setDashboardStats(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchKPIs();
    const interval = setInterval(fetchKPIs, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!userRole) return null;


  if (userRole === 'Manager') {
    return (
      <div className="min-h-screen w-full relative overflow-hidden bg-[var(--bg-base)]">
        
        {/* LAYER 1: The Reflective Metal Core (Conic gradient creates the shiny, sweeping anisotropic metal look) */}
        <div className="absolute inset-0 z-0 opacity-70 mix-blend-screen pointer-events-none bg-[conic-gradient(from_110deg_at_50%_50%,_#000000_0%,_var(--card-bg)_10%,_var(--brand-secondary)_22%,_var(--bg-base)_35%,_#000000_50%,_#12100b_60%,_var(--brand-primary)_75%,_var(--bg-base)_90%,_#000000_100%)]"></div>
        
        {/* LAYER 2: The Pearlescent Color Shift (Organic diagonal light bleeding over the metal) */}
        <div className="absolute inset-0 z-0 opacity-50 mix-blend-color-dodge pointer-events-none bg-[linear-gradient(135deg,_transparent_15%,_rgba(229,193,88,0.3)_35%,_transparent_55%,_rgba(192,192,192,0.3)_80%,_transparent_100%)] blur-[2px]"></div>

        {/* LAYER 3: Deep Anodized Edge Glows (Brings the deep black/slate base to life) */}
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[radial-gradient(circle,_var(--brand-primary)_0%,_transparent_60%)] opacity-[0.06] blur-[60px] pointer-events-none z-0"></div>
        <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-[radial-gradient(circle,_var(--brand-secondary)_0%,_transparent_60%)] opacity-[0.06] blur-[80px] pointer-events-none z-0"></div>

        {/* LAYER 4: The Physical Vignette (Darkens the corners to make it look like a physical curved screen) */}
        <div className="absolute inset-0 z-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none"></div>

        {/* FOREGROUND: Existing App Grid */}
        <div className={`relative z-10 min-h-screen w-full text-[var(--text-base)] grid transition-[grid-template-columns] duration-300 ease-in-out ${isSidebarOpen ? 'grid-cols-[250px_1fr]' : 'grid-cols-[80px_1fr]'}`}>
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <main className="flex-1 overflow-hidden bg-transparent">
            <ManagerDashboard />
          </main>
          </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[var(--bg-base)]">
      
      {/* LAYER 1: The Reflective Core (Adapts to Theme) */}
      <div 
        className="absolute inset-0 z-0 opacity-40 mix-blend-multiply pointer-events-none transition-opacity duration-300"
        style={{
          backgroundImage: `conic-gradient(from 110deg at 50% 50%, transparent 0%, var(--card-bg) 15%, var(--brand-secondary) 30%, var(--bg-base) 50%, var(--brand-primary) 80%, transparent 100%)`
        }}
      ></div>
      
      {/* LAYER 2: The Pearlescent Color Shift (Organic diagonal light bleeding over the metal) */}
      <div 
        className="absolute inset-0 z-0 opacity-50 mix-blend-color-dodge pointer-events-none blur-[2px]"
        style={{
          backgroundImage: `linear-gradient(135deg, transparent 15%, var(--brand-primary) 35%, transparent 55%, var(--brand-secondary) 80%, transparent 100%)`
        }}
      ></div>

      {/* LAYER 3: Deep Anodized Edge Glows (Brings the deep black/slate base to life) */}
      <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] bg-[radial-gradient(circle,_var(--brand-primary)_0%,_transparent_60%)] opacity-[0.06] blur-[60px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-[radial-gradient(circle,_var(--brand-secondary)_0%,_transparent_60%)] opacity-[0.06] blur-[80px] pointer-events-none z-0"></div>

      {/* LAYER 4: The Physical Vignette (Darkens the corners to make it look like a physical curved screen) */}
      <div className="absolute inset-0 z-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] pointer-events-none"></div>

      {/* FOREGROUND: Existing App Grid */}
      <div className={clsx(
        "relative z-10 min-h-screen w-full text-[var(--text-base)] grid transition-[grid-template-columns] duration-300 ease-in-out", 
        isSidebarOpen ? 'grid-cols-[250px_1fr]' : 'grid-cols-[80px_1fr]', 
        `theme-${theme}`
      )}>
        <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex flex-col h-screen overflow-hidden relative bg-transparent">
          {/* Main Scrollable Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 hide-scrollbar relative space-y-8">
            
            {!activeLead ? (
              <>
                {/* 1. COMMAND CENTER (Tasks + KPIs) */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  
                  {/* LEFT: Tasks Ledger (xl:col-span-2) */}
                  <div className="xl:col-span-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl flex flex-col h-[400px] shadow-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                      <div className="flex items-center gap-3">
                        <h3 className="text-white font-black uppercase tracking-widest text-sm">Tasks Ledger</h3>
                        <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold px-2 py-0.5 rounded-full">8 Pending</span>
                      </div>
                      <div className="flex gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <button className="hover:text-white transition-colors">Pending</button>
                        <span className="text-white/20">|</span>
                        <button className="text-red-400 hover:text-red-300 transition-colors">Overdue</button>
                      </div>
                    </div>
                    
                    {/* Task List (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                      {/* MOCK TASK ITEM */}
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-start gap-4 p-3 hover:bg-white/5 rounded-xl transition-colors border-b border-white/5 last:border-0 group cursor-pointer">
                          <input type="checkbox" className="mt-1 w-4 h-4 accent-[#D4AF37] bg-black border-white/20 rounded cursor-pointer" />
                          <div className="flex-1">
                            <h4 className="text-white text-sm font-bold">Cold One Page Cash Offer Follow Up</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-400/10 px-2 py-0.5 rounded-md">Overdue - 1/5/2026</span>
                              <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Assignee: Unassigned</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: KPI Matrix */}
                  <div className="xl:col-span-1 grid grid-cols-2 gap-4 h-[400px] overflow-y-auto hide-scrollbar">
                    
                    {/* KPI Card Template */}
                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-center hover:border-[#D4AF37]/50 transition-colors group">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Unread Convos</span>
                      <span className="text-2xl font-black text-white">{dashboardStats?.unreadConvos || 0}</span>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-center hover:border-[#D4AF37]/50 transition-colors group">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Total Call Time</span>
                      <span className="text-2xl font-black text-[#D4AF37]">{dashboardStats?.totalCallTime || '0m 0s'}</span>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-center hover:border-[#D4AF37]/50 transition-colors group">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Total Calls Placed</span>
                      <span className="text-2xl font-black text-white">{dashboardStats?.totalCallsPlaced || 0}</span>
                    </div>

                    <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-center hover:border-[#D4AF37]/50 transition-colors group">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Appointments</span>
                      <span className="text-2xl font-black text-white">{dashboardStats?.appointments || 0}</span>
                    </div>
                    
                    <div className="col-span-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex flex-col justify-center hover:border-[#D4AF37]/50 transition-colors group">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 group-hover:text-white transition-colors">Avg Call Duration</span>
                      <span className="text-2xl font-black text-white">{dashboardStats?.avgCallDuration || '0s'}</span>
                      <span className="text-[10px] text-[#D4AF37] mt-1">Avory Howard</span>
                    </div>

                  </div>
                </div>

                {/* 2. THE PIPELINE */}
                <div className="pt-4">
                   <div className="flex items-center gap-2 mb-4">
                     <h2 className="text-white font-black uppercase tracking-widest text-lg">Active Pipeline</h2>
                     <div className="h-px bg-white/10 flex-1 ml-4"></div>
                   </div>
                   <NativePipeline onLeadSelect={(lead) => setActiveLead(lead)} />
                </div>
              </>
            ) : (
              <CallScript activeLead={activeLead} isSidebarOpen={isSidebarOpen} onReturn={(dispo) => {
                if (dispo) console.log('Disposition:', dispo);
                setActiveLead(null);
              }} />
            )}
          </div>
        </main>

        </div>
    </div>
  );
}
