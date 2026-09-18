'use client';
import { X, Calculator } from 'lucide-react';
import useStore from '@/store/useStore';
import RepairsCalculator from '@/components/calculators/RepairsCalculator';
import CashCalculator from '@/components/calculators/CashCalculator';
import CreativeCalculator from '@/components/calculators/CreativeCalculator';

export default function CalculatorDrawer({ isOpen, onClose }) {
  const masterLead = useStore(state => state.masterLead);
  const formData = useStore(state => state.liveFormData);
  const updateForm = useStore(state => state.callScriptUpdateForm);

  return (
    <div className={`fixed top-0 right-0 h-screen w-[450px] bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.1)] border-l border-white/60 z-[1000] transform transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-[var(--card-border)] pb-4">
          <h2 className="text-xl font-bold text-[#FFFFFF] uppercase tracking-widest flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#00E5FF]" /> Calculators
          </h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[#FFFFFF] transition-colors p-2 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 space-y-6 text-sm text-gray-700">
          {updateForm ? (
            <>
              <RepairsCalculator formData={formData} updateForm={updateForm} />
              <CashCalculator 
                askingPrice={formData.askingPrice || formData.price} 
                globalArv={formData.arv || 0} 
                updateGlobalArv={(val) => updateForm('arv', val)} 
                solarAssumable={formData.solarAssumable} 
                solarMonthlyPayment={formData.solarMonthlyPayment} 
                isEviction={formData.tenantStatus?.includes('Eviction Needed')} 
              />
              <CreativeCalculator 
                globalArv={formData.arv || 0} 
                updateGlobalArv={(val) => updateForm('arv', val)} 
                solarAssumable={formData.solarAssumable} 
                solarMonthlyPayment={formData.solarMonthlyPayment} 
              />
            </>
          ) : (
            <div className="text-[var(--text-muted)] italic">No active lead selected. Select a lead from the pipeline to use calculators.</div>
          )}
        </div>
      </div>
    </div>
  );
}
