'use client';

import { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';

const DISTRESS_FLAGS = [
  'Pre-Foreclosure',
  'Tax Delinquent',
  'Vacant',
  'Code Violation',
  'Out of State Owner',
  'Probate',
  'Tired Landlord'
];

export default function ManualLeadModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [selectedFlags, setSelectedFlags] = useState([]);

  if (!isOpen) return null;

  const toggleFlag = (flag) => {
    setSelectedFlags(prev => 
      prev.includes(flag) ? prev.filter(f => f !== flag) : [...prev, flag]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    
    // Split the name cleanly
    const fullName = (formData.get('sellerName') || '').trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || null;

    // Safely parse numbers to avoid NaN crashes
    const rawMotivation = formData.get('motivationScore');
    const rawArv = formData.get('arv');
    const rawAsking = formData.get('askingPrice');

    const payload = {
      firstName,
      lastName,
      phone: formData.get('phone') || null,
      email: formData.get('email') || null,
      motivationScore: rawMotivation ? parseInt(rawMotivation) : 5,
      notes: formData.get('notes') || null,
      address: formData.get('address') || 'Unknown Address',
      city: formData.get('city') || null,
      state: formData.get('state') || null,
      zip: formData.get('zip') || null,
      arv: rawArv ? parseFloat(rawArv) : null,
      askingPrice: rawAsking ? parseFloat(rawAsking) : null,
      distressFlags: selectedFlags,
    };

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        onClose();
        // Optional: Trigger a router.refresh() or state update here to show the new lead
      } else {
        const errorData = await res.json();
        console.error("BACKEND REJECTION:", errorData);
        alert(`🚨 SYSTEM FAILURE 🚨\n\nError: ${errorData.error}\n\nDetails: ${errorData.details}`);
      }
    } catch (err) {
      console.error("NETWORK ERROR:", err);
      alert(`🚨 NETWORK/SERVER ERROR 🚨\n\nIs the local dev server running?`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        
        <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)] bg-black/30">
          <div>
            <h2 className="text-white font-black uppercase tracking-widest text-xl">Add Manual Lead</h2>
            <p className="text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest mt-1">Single Entry Provisioning</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Seller Information */}
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2">Seller Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Seller Name *</label>
                <input required name="sellerName" type="text" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Phone</label>
                <input name="phone" type="tel" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Email</label>
                <input name="email" type="email" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Motivation Score (1-10)</label>
                <input required name="motivationScore" type="range" min="1" max="10" defaultValue="5" className="w-full accent-[#D4AF37]" />
                <div className="flex justify-between text-xs text-gray-500 mt-1"><span>1 (Low)</span><span>10 (High)</span></div>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2">Property Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Property Address *</label>
                <input required name="address" type="text" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">City</label>
                <input name="city" type="text" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">State</label>
                  <input name="state" type="text" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Zip</label>
                  <input name="zip" type="text" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Estimated ARV</label>
                <input name="arv" type="number" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" placeholder="$" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Asking Price</label>
                <input name="askingPrice" type="number" className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" placeholder="$" />
              </div>
            </div>
          </div>

          {/* Distress Flags */}
          <div className="space-y-4">
            <h3 className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2">Distress Flags</h3>
            <div className="flex flex-wrap gap-2">
              {DISTRESS_FLAGS.map(flag => (
                <button
                  type="button"
                  key={flag}
                  onClick={() => toggleFlag(flag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-colors ${
                    selectedFlags.includes(flag) 
                      ? 'bg-red-500/20 border-red-500/50 text-red-400' 
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {flag}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[#D4AF37] font-bold uppercase tracking-widest text-xs border-b border-white/10 pb-2">Internal Notes</h3>
            <textarea name="notes" rows={3} className="w-full bg-black border border-white/10 text-white p-3 rounded-lg focus:border-[#D4AF37] outline-none" placeholder="Add any specific context or follow-up notes..."></textarea>
          </div>

          <div className="pt-6 border-t border-[var(--card-border)] flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-400 uppercase tracking-widest text-xs hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="bg-[#D4AF37] text-black px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#F3E5AB] transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.3)] disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Provision Lead
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
