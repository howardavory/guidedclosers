'use client';

import { useState } from 'react';
import { X, ChevronRight, Lock, Loader2 } from 'lucide-react';

export default function OnboardingFlow({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    revenue: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    // STUB: This routes to the API that creates a Stripe Checkout Session
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const { url } = await response.json();
      if (url) {
        window.location.href = url; // Redirect to Stripe
      }
    } catch (err) {
      console.error(err);
      alert('Error initiating checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-2xl rounded-2xl w-full max-w-md relative overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-[var(--card-border)] bg-black/30">
          <h2 className="text-white font-bold tracking-widest uppercase text-sm">
            Step {step} of 3
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-gray-900">
          <div 
            className="h-full bg-[#D4AF37] transition-all duration-300 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="p-8">
          {step === 1 && (
            <div className="animate-in slide-in-from-right-4 fade-in">
              <h3 className="text-2xl font-bold text-white mb-2">What is your agency name?</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6">This will be used to provision your isolated workspace.</p>
              <input 
                type="text"
                autoFocus
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                placeholder="Acme Sales Group"
                className="w-full bg-black border border-[var(--card-border)] text-white p-4 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-lg"
              />
              <button 
                onClick={handleNext}
                disabled={!formData.businessName}
                className="w-full mt-6 bg-white text-black font-bold p-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                Continue <ChevronRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in slide-in-from-right-4 fade-in">
              <h3 className="text-2xl font-bold text-white mb-2">Current Monthly Revenue?</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6">We tailor the initial data models based on your scale.</p>
              <div className="space-y-3">
                {['$0 - $10k', '$10k - $50k', '$50k - $250k', '$250k+'].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setFormData({...formData, revenue: range});
                      handleNext();
                    }}
                    className={`w-full p-4 rounded-xl border text-left font-bold transition-all ${
                      formData.revenue === range 
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' 
                        : 'border-[var(--card-border)] bg-black text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in slide-in-from-right-4 fade-in">
              <h3 className="text-2xl font-bold text-white mb-2">Where should we send access?</h3>
              <p className="text-[var(--text-muted)] text-sm mb-6">You will be provisioned as the Root Administrator.</p>
              
              <div className="mb-6">
                <input 
                  type="email"
                  autoFocus
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="admin@agency.com"
                  className="w-full bg-black border border-[var(--card-border)] text-white p-4 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-lg"
                />
              </div>

              <div className="bg-[#1E1E1E] p-4 rounded-xl border border-[var(--card-border)] mb-6 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">Workspace License</div>
                  <div className="text-[var(--text-muted)] text-xs">Billed Monthly</div>
                </div>
                <div className="text-[#D4AF37] font-black text-xl">$1,500</div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={!formData.email || isLoading}
                className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest p-4 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F3E5AB] transition-colors shadow-[0_0_20px_rgba(212,175,55,0.3)]"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Lock size={18} />}
                {isLoading ? 'Encrypting...' : 'Secure Checkout'}
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold">
                <Lock size={10} /> Secured by Stripe
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
