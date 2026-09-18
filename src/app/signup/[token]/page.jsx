'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { verifyInviteToken } from '@/actions/auth';
import { KeyRound, CheckCircle } from 'lucide-react';

export default function SignupPage({ params }) {
  // In Next.js 15+, params is a Promise that needs to be unwrapped with React.use() in Client Components
  const resolvedParams = use(params);
  const token = resolvedParams.token;
  const router = useRouter();
  
  const [status, setStatus] = useState('verifying');
  const [inviteDetails, setInviteDetails] = useState(null);
  
  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setStatus('invalid');
        return;
      }
      
      const res = await verifyInviteToken(token);
      if (res.success) {
        setInviteDetails({ email: res.email, role: res.role });
        setStatus('valid');
      } else {
        setStatus('invalid');
      }
    }
    
    checkToken();
  }, [token]);

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
        <div className="text-white text-center">Verifying Cryptographic Token...</div>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-red-500 font-bold text-2xl mb-2">ACCESS DENIED</h1>
          <p className="text-gray-400 text-sm">The invite token is invalid, expired, or has already been used.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-gray-800 shadow-2xl rounded-2xl p-10 max-w-md w-full relative z-10 flex flex-col gap-6">
        <div className="text-center mb-2">
          <CheckCircle className="text-green-500 w-12 h-12 mx-auto mb-4" />
          <h1 className="text-white font-bold text-2xl tracking-wide uppercase mb-2">Token Verified</h1>
          <p className="text-gray-400 text-sm">Account provisioning authorized for <span className="font-bold text-[#D4AF37]">{inviteDetails.email}</span></p>
          <div className="mt-2 inline-block bg-gray-900 border border-gray-700 px-3 py-1 rounded-full text-xs text-gray-300 font-bold tracking-widest uppercase">
            Locked Role: {inviteDetails.role}
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); alert('Account provisioned (mock). Redirecting...'); router.push('/login'); }}>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">First Name</label>
            <input 
              type="text"
              className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Last Name</label>
            <input 
              type="text"
              className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Set Password</label>
            <input 
              type="password"
              className="w-full bg-black border border-gray-800 text-white p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
              minLength={8}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm p-4 rounded-lg mt-4 hover:bg-[#F3E5AB] transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound size={16} /> Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
