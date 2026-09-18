'use client';
import { X, FileText } from 'lucide-react';
import useStore from '@/store/useStore';
import TearSheet from '@/components/documents/TearSheet';

export default function TearSheetDrawer({ isOpen, onClose }) {
  const formData = useStore(state => state.liveFormData);
  const activeLead = useStore(state => state.masterLead); // or whichever is the active lead

  return (
        <div className={`fixed top-0 right-0 w-[450px] bg-[var(--card-bg)]/95 backdrop-blur-xl border-l border-[var(--card-border)] text-[var(--text-base)] shadow-[-10px_0_30px_rgba(0,0,0,0.8)] h-full overflow-y-auto hide-scrollbar z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      {/* Wrapper replaced by Anodized theme */}
      <div className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b border-[var(--card-border)] pb-2">
          <h2 className="text-xl font-bold text-[#FFFFFF] uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#00E5FF]" /> Tear-Sheet
          </h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[#FFFFFF] transition-colors p-2 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar">
          {Object.keys(formData || {}).length > 0 ? (
            <TearSheet formData={formData} activeLead={activeLead} onClose={onClose} />
          ) : (
            <div className="text-[var(--text-muted)] italic mt-4">No active lead selected. Select a lead from the pipeline to generate a tear-sheet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
