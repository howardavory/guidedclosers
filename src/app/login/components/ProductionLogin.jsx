'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { ShieldAlert, Users, LayoutDashboard, KeyRound } from 'lucide-react';
import { productionLogin, verify2FA } from '@/actions/auth';

export default function ProductionLogin() {
  const router = useRouter();
  const updateUserRole = useStore((state) => state.updateUserRole);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const [needs2FA, setNeeds2FA] = useState(false);
  const [userIdFor2FA, setUserIdFor2FA] = useState(null);
  const [code2FA, setCode2FA] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await productionLogin(email, password);
      
      if (res.require2FA) {
        setNeeds2FA(true);
        setUserIdFor2FA(res.userId);
        return;
      }
      
      if (res.success) {
        updateUserRole(res.user.role);
        setCurrentUser(res.user);
        router.push('/dashboard');
      } else {
        setError(res.error || 'Login failed');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await verify2FA(userIdFor2FA, code2FA);
      if (res.success) {
        updateUserRole(res.user.role);
        setCurrentUser(res.user);
        router.push('/dashboard');
      } else {
        setError(res.error || 'Invalid 2FA code');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-gray-800 shadow-2xl rounded-2xl p-10 max-w-md w-full relative z-10 flex flex-col gap-6">
      <div className="text-center mb-6">
        <h1 className="text-white font-bold text-3xl tracking-wide uppercase mb-2">System Login</h1>
        <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Authorized Personnel Only</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {!needs2FA ? (
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Email</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm p-4 rounded-lg mt-4 hover:bg-[#F3E5AB] transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound size={16} /> Authenticate
          </button>
        </form>
      ) : (
        <form onSubmit={handle2FASubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">2FA Code</label>
            <input 
              type="text"
              value={code2FA}
              onChange={(e) => setCode2FA(e.target.value)}
              placeholder="000000"
              className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
              maxLength={6}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm p-4 rounded-lg mt-4 hover:bg-[#F3E5AB] transition-colors"
          >
            Verify
          </button>
        </form>
      )}
    </div>
  );
}
