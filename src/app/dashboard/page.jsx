'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import useStore from '@/store/useStore';
import ManagerDashboard from '@/components/dashboard/ManagerDashboard';
import Pipeline from '@/components/dashboard/Pipeline';
import CallScript from '@/components/script/CallScript';
import Sidebar from '@/components/dashboard/Sidebar';
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
          <header className="flex items-center justify-between w-full pb-4 mb-6 border-b border-[var(--brand-primary)]/20 px-6 shrink-0 z-10 mt-6">
              {/* Clean, unconstrained portal target spanning 100% width */}
              <div id="hud-portal-target" className="w-full flex items-center justify-between gap-4 min-w-0">
                
                {!activeLead && (
                  <>
                    <div className="flex flex-col items-center justify-center px-6 py-2 /70 backdrop-blur-md rounded-2xl shadow-sm border border-white/40">
                      <span className="text-[10px] font-semibold text-[var(--text-muted)]  tracking-widest mb-0.5">Leads Triaged</span>
                      <span className="text-2xl font-bold text-gray-800">{dashboardStats?.totalContacts || 0}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-6 py-2 /70 backdrop-blur-md rounded-2xl shadow-sm border border-white/40">
                      <span className="text-[10px] font-semibold text-[var(--text-muted)]  tracking-widest mb-0.5">Offers Submitted</span>
                      <span className="text-2xl font-bold text-gray-800">{dashboardStats?.offersSubmitted || 0}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-6 py-2 /70 backdrop-blur-md rounded-2xl shadow-sm border border-white/40">
                      <span className="text-[10px] font-semibold text-[var(--text-muted)]  tracking-widest mb-0.5">Contracts Sent</span>
                      <span className="text-2xl font-bold text-gray-800">{dashboardStats?.contractsSent || 0}</span>
                    </div>
                    <div className="flex flex-col items-center justify-center px-6 py-2 /70 backdrop-blur-md rounded-2xl shadow-sm border border-white/40">
                      <span className="text-[10px] font-semibold text-[var(--text-muted)]  tracking-widest mb-0.5">Projected Fees</span>
                      <span className="text-2xl font-bold text-[var(--brand-primary)]">${(dashboardStats?.projectedFees || 0).toLocaleString()}</span>
                    </div>
                  </>
                )}
              </div>
          </header>

          <div className="flex-1 overflow-y-auto px-6 hide-scrollbar relative">
            {!activeLead ? (
              <Pipeline onLeadSelect={(lead) => setActiveLead(lead)} />
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
