'use client';

import { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Phone, Mail, MapPin, X, Loader2, DollarSign, Activity, Plus, Upload, FileDown } from 'lucide-react';
import ManualLeadModal from './ManualLeadModal';
import CSVImportModal from './CSVImportModal';
import { pdf } from '@react-pdf/renderer';
import { TearsheetTemplate } from '../../utils/pdf/TearsheetTemplate';
import { ContractTemplate } from '../../utils/pdf/ContractTemplate';

const COLUMNS = [
  { id: 'NEW', title: 'New Leads', color: 'bg-blue-500/10 border-blue-500/30 text-blue-400' },
  { id: 'CONTACTED', title: 'Contacted', color: 'bg-purple-500/10 border-purple-500/30 text-purple-400' },
  { id: 'APPOINTMENT', title: 'Appointments', color: 'bg-orange-500/10 border-orange-500/30 text-orange-400' },
  { id: 'OFFER_SENT', title: 'Offers Out', color: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' },
  { id: 'UNDER_CONTRACT', title: 'Under Contract', color: 'bg-green-500/10 border-green-500/30 text-green-400' },
  { id: 'CLOSED', title: 'Dispositions', color: 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]' },
];

function SortableItem({ lead, onClick }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl mb-3 shadow-sm hover:border-[#D4AF37] transition-colors flex flex-col overflow-hidden group"
    >
      {/* 1. THE DRAG HANDLE ZONE (Swallows Drags) */}
      <div 
        {...attributes} 
        {...listeners} 
        className="w-full h-6 bg-white/5 hover:bg-white/10 cursor-grab active:cursor-grabbing flex items-center justify-center transition-colors"
      >
        {/* Minimalist Grip Line */}
        <div className="w-8 h-1 bg-white/20 rounded-full group-hover:bg-[#D4AF37]/50 transition-colors"></div>
      </div>

      {/* 2. THE CLICKABLE BODY ZONE (Opens the Drawer) */}
      <div 
        onClick={() => onClick(lead)} 
        className="p-4 cursor-pointer"
      >
        <h3 className="font-bold text-sm text-white mb-1 truncate">{lead.property?.address || 'Unknown Address'}</h3>
        <p className="text-xs text-[var(--text-muted)] mb-3">{lead.contact?.firstName} {lead.contact?.lastName}</p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-1 flex-wrap">
            {lead.motivationScore >= 8 && <span className="bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-bold">HOT</span>}
            {lead.property?.arv && <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] px-2 py-0.5 rounded-full font-bold">ARV</span>}
          </div>
          <div className="text-[10px] text-gray-500 font-medium">
            {new Date(lead.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function Column({ col, leads, onCardClick }) {
  const colorClass = col.color || 'bg-gray-500/10 border-gray-500/30 text-gray-400';
  const colorParts = colorClass.split(' ');
  const bgClass = colorParts[0] || 'bg-gray-500/10';
  const textClass = colorParts[2] || 'text-gray-400';

  return (
    <div className="flex flex-col min-w-[300px] w-[300px] shrink-0 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl h-full flex-1">
      <div className={`p-4 border-b border-[var(--card-border)] rounded-t-2xl flex items-center justify-between ${bgClass}`}>
        <h2 className={`font-bold tracking-widest uppercase text-xs ${textClass}`}>{col.name}</h2>
        <span className="bg-black/50 text-white text-xs px-2 py-1 rounded-full font-bold border border-white/10">{leads.length}</span>
      </div>
      <div className="p-3 overflow-y-auto flex-1 custom-scrollbar">
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map(lead => (
            <SortableItem key={lead.id} lead={lead} onClick={onCardClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default function NativePipeline({ onLeadSelect }) {
  const [leads, setLeads] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    fetchPipelineData();
    fetchLeads();
  }, []);

  const fetchPipelineData = async () => {
    try {
      const response = await fetch('/api/pipelines');
      if (response.ok) {
        const data = await response.json();
        // Assume data[0] is the primary pipeline
        if (data && data.length > 0 && data[0].stages) {
          setStages(data[0].stages);
        }
      }
    } catch (err) {
      console.error('Failed to fetch pipelines', err);
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/leads');
      if (res.ok) {
        const data = await res.json();
        setLeads(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch leads', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeLead = leads.find(l => l.id === active.id);
    const overLead = leads.find(l => l.id === over.id);
    
    let newStageId = null;
    if (stages.find(c => c.id === over.id)) {
      newStageId = over.id;
    } else if (overLead) {
      newStageId = overLead.stageId;
    }

    if (newStageId && activeLead.stageId !== newStageId) {
      setLeads(prev => prev.map(l => l.id === active.id ? { ...l, stageId: newStageId } : l));
      try {
        await fetch(`/api/leads/${active.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stageId: newStageId })
        });
      } catch (err) {
        console.error('Failed to update lead stage', err);
        fetchLeads();
      }
    }
  };

  const handleGeneratePDF = async (type) => {
    if (!selectedLead) return;
    
    const Template = type === 'tearsheet' ? TearsheetTemplate : ContractTemplate;
    const fileName = type === 'tearsheet' 
      ? `Tearsheet_${selectedLead.property?.address || 'Lead'}.pdf` 
      : `Assignment_${selectedLead.property?.address || 'Lead'}.pdf`;

    const blob = await pdf(<Template data={selectedLead} />).toBlob();
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/ /g, '_');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleUpdateLead = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      notes: formData.get('notes'),
      arv: formData.get('arv'),
      status: formData.get('status')
    };

    try {
      const res = await fetch(`/api/leads/${selectedLead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
        setSelectedLead(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-transparent">
        <Loader2 className="animate-spin text-[#D4AF37]" size={40} />
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent overflow-hidden flex flex-col p-2">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-wide uppercase">Wholesale CRM Pipeline</h1>
          <p className="text-[var(--text-muted)] text-sm font-semibold tracking-widest uppercase">Drag and drop deals to advance stages</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsCsvModalOpen(true)}
            className="bg-[var(--card-bg)] text-white border border-[var(--card-border)] font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-lg hover:border-[#D4AF37] transition-colors flex items-center gap-2"
          >
            <Upload size={16} /> Upload CSV
          </button>
          <button 
            onClick={() => setIsManualModalOpen(true)}
            className="bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-lg hover:bg-[#F3E5AB] transition-colors shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2"
          >
            <Plus size={16} /> Manual Lead
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4 h-full custom-scrollbar">
          {stages.map(col => {
            const columnLeads = leads.filter(l => l.stageId === col.id);
            return (
              <Column 
                key={col.id} 
                col={col} 
                leads={columnLeads} 
                onCardClick={setSelectedLead} 
              />
            );
          })}
        </div>
        <DragOverlay>
          {activeId ? (
            <SortableItem lead={leads.find(l => l.id === activeId)} onClick={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* LEAD INSPECTION DRAWER */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[var(--bg-base)] border-l border-[var(--card-border)] w-full max-w-lg h-full shadow-2xl flex flex-col animate-in slide-in-from-right-full duration-300">
            
            <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between bg-[var(--card-bg)]">
              <h2 className="font-black text-xl text-white uppercase tracking-widest">Lead Inspection</h2>
              <button onClick={() => setSelectedLead(null)} className="text-gray-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Property Details */}
              <div>
                <div className="flex items-center gap-2 text-[#D4AF37] mb-3">
                  <MapPin size={18} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Property Data</h3>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl space-y-4 shadow-inner">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Address</div>
                    <div className="text-white font-medium">{selectedLead.property?.address}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Asking Price</div>
                      <div className="text-white font-medium">${selectedLead.property?.askingPrice?.toLocaleString() || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">ARV</div>
                      <div className="text-[#D4AF37] font-bold">${selectedLead.property?.arv?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seller Contact */}
              <div>
                <div className="flex items-center gap-2 text-blue-400 mb-3">
                  <Activity size={18} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Seller Profile</h3>
                </div>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl space-y-4 shadow-inner">
                  <div>
                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Name</div>
                    <div className="text-white font-medium">{selectedLead.contact?.firstName} {selectedLead.contact?.lastName}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Phone size={10} /> Phone</div>
                      <div className="text-white font-medium">{selectedLead.contact?.phone || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Mail size={10} /> Email</div>
                      <div className="text-white font-medium truncate">{selectedLead.contact?.email || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Engine */}
              <div>
                <div className="flex items-center gap-2 text-[#00E5FF] mb-3">
                  <FileDown size={18} />
                  <h3 className="font-bold uppercase tracking-widest text-sm">Document Engine</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button 
                    onClick={(e) => { e.preventDefault(); handleGeneratePDF('tearsheet'); }}
                    className="flex items-center justify-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/50 font-bold uppercase tracking-widest p-3 rounded-xl hover:bg-[#D4AF37]/20 transition-colors shadow-lg text-xs"
                  >
                    <FileDown size={14} /> Generate Tearsheet
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); handleGeneratePDF('contract'); }}
                    className="flex items-center justify-center gap-2 bg-white/10 text-white border border-white/30 font-bold uppercase tracking-widest p-3 rounded-xl hover:bg-white/20 transition-colors shadow-lg text-xs"
                  >
                    <FileDown size={14} /> Generate Contract
                  </button>
                </div>
              </div>

              {/* Update Form */}
              <form onSubmit={handleUpdateLead} className="space-y-6">
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Deal Stage</label>
                  <select name="stageId" defaultValue={selectedLead.stageId} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]">
                    {stages.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Update ARV (After Repair Value)</label>
                  <input type="number" name="arv" defaultValue={selectedLead.property?.arv} className="w-full bg-black border border-[var(--card-border)] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]" placeholder="e.g. 250000" />
                </div>

                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Internal Notes</label>
                  <textarea name="notes" defaultValue={selectedLead.notes} rows={4} className="w-full bg-black border border-[var(--card-border)] text-white p-3 rounded-xl focus:outline-none focus:border-[#D4AF37]" placeholder="Add follow-up notes here..." />
                </div>

                <div className="border-t border-[var(--card-border)] pt-6">
                  <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest p-4 rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
            
          </div>
        </div>
      )}

      {isManualModalOpen && <ManualLeadModal isOpen={isManualModalOpen} onClose={() => { setIsManualModalOpen(false); fetchLeads(); }} />}
      {isCsvModalOpen && <CSVImportModal isOpen={isCsvModalOpen} onClose={() => { setIsCsvModalOpen(false); fetchLeads(); }} />}
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}} />
    </div>
  );
}
