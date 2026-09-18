'use client';

import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { ShieldAlert, Users, LayoutDashboard } from 'lucide-react';
import { sandboxLogin } from '@/actions/auth';

export default function TestTerminal() {
  const router = useRouter();
  const updateUserRole = useStore((state) => state.updateUserRole);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  
  const handleLogin = async (role) => {
    try {
      const res = await sandboxLogin(role);
      
      if (res.success) {
        updateUserRole(role);
        setCurrentUser(res.user);
        router.push('/dashboard');
      } else {
        alert(res.error || 'Failed to authenticate in sandbox');
      }
    } catch (error) {
      console.error("LOGIN CRASH:", error);
      alert("CRASH: " + error.message);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-10 max-w-md w-full relative z-10 flex flex-col gap-6">
      <div className="text-center mb-6">
        <h1 className="bg-gradient-to-r from-[#D4AF37] via-[#FFF3A3] to-[#B8860B] bg-clip-text text-transparent font-bold text-4xl tracking-wide uppercase mb-2">TEST TERMINAL</h1>
        <p className="text-[#E5C158] text-[10px] uppercase tracking-widest font-extrabold">Sandbox Mode: Select Role</p>
      </div>

      <div className="flex flex-col gap-4">
        {['ADMIN', 'MANAGER', 'CLOSER', 'SETTER'].map((role) => (
          <button 
            key={role}
            onClick={() => handleLogin(role)}
            className="flex items-center gap-4 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[#D4AF37] rounded-xl hover:-translate-y-0.5 transition-all text-left group cursor-pointer"
          >
            <div className="p-3 text-[#D4AF37] bg-[var(--card-bg)] shadow-sm rounded-lg border border-[var(--card-border)]">
              {role === 'SETTER' ? <Users size={24} /> : role === 'CLOSER' ? <ShieldAlert size={24} /> : <LayoutDashboard size={24} />}
            </div>
            <div>
              <h3 className="text-[var(--text-base)] font-bold text-xl tracking-wide uppercase group-hover:text-[#D4AF37] transition-colors">{role}</h3>
              <p className="text-[var(--text-muted)] text-[10px] font-bold uppercase tracking-widest">
                {role === 'SETTER' ? 'Lead Qualification & Triage' : role === 'CLOSER' ? 'Negotiation & Contracting' : role === 'MANAGER' ? 'Analytics & Heatmaps' : 'System Administration'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
