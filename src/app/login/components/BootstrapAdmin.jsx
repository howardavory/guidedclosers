'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store/useStore';
import { KeyRound, ShieldCheck } from 'lucide-react';
import { bootstrapAdmin } from '@/actions/auth';

export default function BootstrapAdmin() {
  const router = useRouter();
  const updateUserRole = useStore((state) => state.updateUserRole);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await bootstrapAdmin(formData.email, formData.username, formData.password, formData.firstName, formData.lastName);
      
      if (res.success) {
        updateUserRole(res.user.role);
        setCurrentUser(res.user);
        router.push('/dashboard');
      } else {
        setError(res.error || 'Failed to create workspace owner.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl rounded-2xl p-10 max-w-md w-full relative z-10 flex flex-col gap-6">
      <div className="text-center mb-6">
        <ShieldCheck className="w-12 h-12 mx-auto mb-4 text-[#D4AF37]" />
        <h1 className="text-[var(--text-base)] font-bold text-2xl tracking-wide uppercase mb-2">Create Workspace Owner</h1>
        <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest font-semibold">Initialize Root Administrator</p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">First Name</label>
            <input 
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-[var(--bg-base)] border border-[var(--card-border)] text-[var(--text-base)] p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <div className="w-1/2">
            <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">Last Name</label>
            <input 
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-[var(--bg-base)] border border-[var(--card-border)] text-[var(--text-base)] p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">Email</label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-[var(--bg-base)] border border-[var(--card-border)] text-[var(--text-base)] p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">Username</label>
          <input 
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            maxLength={15}
            className="w-full bg-[var(--bg-base)] border border-[var(--card-border)] text-[var(--text-base)] p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">Password</label>
          <input 
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-[var(--bg-base)] border border-[var(--card-border)] text-[var(--text-base)] p-3 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors"
            required
            minLength={5}
            maxLength={17}
          />
        </div>
        
        <button 
          type="submit"
          className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm p-4 rounded-lg mt-4 hover:bg-[#F3E5AB] transition-colors flex items-center justify-center gap-2"
        >
          <KeyRound size={16} /> Bootstrap Admin
        </button>
      </form>
    </div>
  );
}
