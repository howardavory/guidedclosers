'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import useStore from '@/store/useStore';
import { ShieldAlert, CheckCircle2, Home, Wrench, Clock, DollarSign, PenTool, Mic, MapPin, Database, ChevronDown, ChevronRight, Calculator, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';
import CashCalculator from '../calculators/CashCalculator';
import CreativeCalculator from '../calculators/CreativeCalculator';
import RepairsCalculator from '../calculators/RepairsCalculator';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

export default function CallScript({ activeLead, onReturn }) {
  const { updateTriageCondition, updatePropertyDetails, updateDisposition } = useStore();
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const autocompleteRef = useRef(null);

  const [activePillar, setActivePillar] = useState(1);
  const [completedPillars, setCompletedPillars] = useState([]);
  const [activeCalc, setActiveCalc] = useState(null);
  const [isPullingData, setIsPullingData] = useState(false);
  
  const [formData, setFormData] = useState({
    manualName: '',
    manualAddress: '',
    // Opener
    activeSource: 'In-House',
    manualEntityType: 'INDIVIDUAL',
    introResponse: null,
    isVoicemail: false,
    isHostile: false,
    noPushback: false,
    activeObjection: null,
    offerResponse: null,
    askingPrice: '',
    refusedPrice: false,
    // Property Details (Pillar 2)
    beds: '',
    baths: '',
    sqft: '',
    propertyType: '',
    mfUnits: '',
    hoaName: '',
    hoaFee: '',
    mhParkName: '',
    mhParkFee: '',
    landZoning: '',
    // Occupancy
    occupancy: '',
    rentAmount: '',
    vacantLength: '',
    decisionMakers: null,
    trustProbate: false,
    // Condition
    roof: [],
    hvac: [],
    plumbing: [],
    electrical: [],
    cosmetics: [],
    fireDamage: false,
    highRisk: [],
    // Timeline
    timeline: '',
    painPoints: [],
    // Financials
    freeAndClear: false,
    mortgageBalance: '',
    arrears: '',
    summaryNotes: '',
    // Objections & Close
    thinkAboutItReason: '',
    thinkAboutItOther: '',
    lockedPrice: '',
    isPriceLocked: false,
    legalName: '',
    email: '',
    mailingAddress: ''
  });

  const [showDisqualifyMenu, setShowDisqualifyMenu] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const [activeObjection, setActiveObjection] = useState(null);

  useEffect(() => {
    if (activeLead?.contactId) {
      fetch(`/api/ghl/messages?contactId=${activeLead.contactId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.messages) {
            setRecentMessages(data.messages);
          }
        })
        .catch(err => console.error('Failed to fetch messages:', err));
    }
  }, [activeLead]);

  const updateForm = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleToggle = (field, value) => {
    setFormData(prev => {
      const arr = prev[field] || [];
      return { ...prev, [field]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  };

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.formatted_address) {
        updateForm('manualAddress', place.formatted_address);
      }
    }
  };

  const pullBatchLeadsData = async () => {
    const addressToPull = formData.manualAddress || activeLead?.address;
    if (!addressToPull) return alert("Please enter an address first.");
    
    setIsPullingData(true);
    try {
      const res = await fetch('/api/batchleads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addressToPull })
      });
      const data = await res.json();
      console.log("[DEBUG] API Response from /api/batchleads:", data);
      if (data.success && data.data) {
        setFormData(prev => ({
          ...prev,
          mortgageBalance: data.data.mortgageBalance?.toString() || '',
          beds: data.data.beds?.toString() || '',
          baths: data.data.baths?.toString() || '',
          sqft: data.data.sqft?.toString() || '',
        }));
        updatePropertyDetails({
          beds: data.data.beds,
          baths: data.data.baths,
          sqft: data.data.sqft,
          arv: data.data.estimatedValue
        });
        alert(`Property Data Found!\nEstimated Value: $${data.data.estimatedValue}\nBeds/Baths: ${data.data.beds}/${data.data.baths}\nSqft: ${data.data.sqft}`);
      }
    } catch(e) {
      alert("Error pulling property data.");
    }
    setIsPullingData(false);
  };

  useEffect(() => {
    if (activeLead && activeLead.address) {
      updateForm('manualAddress', activeLead.address);
      if (!formData.beds) {
        pullBatchLeadsData();
      }
    }
  }, [activeLead]);

  const generateSummary = () => {
    let summary = `--- LEAD SUMMARY ---\n`;
    summary += `Occupancy: ${formData.occupancy || 'Unknown'}\n`;
    summary += `Asking Price: ${formData.refusedPrice ? 'REFUSED TO DISCLOSE' : (formData.askingPrice ? '$'+formData.askingPrice : 'None given')}\n`;
    summary += `\n-- SITUATION & TIMELINE --\n`;
    summary += `Tags: ${formData.painPoints.join(', ')}\n`;
    summary += `Timeline Notes: ${formData.timeline}\n`;
    summary += `\n-- FINANCIALS --\n`;
    summary += `Free & Clear: ${formData.freeAndClear ? 'Yes' : 'No'}\n`;
    if (!formData.freeAndClear) summary += `Mortgage Balance: $${formData.mortgageBalance} | Arrears: $${formData.arrears}\n`;

    const m1 = Number((formData.mortgageBalance || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
    const arr = Number((formData.arrears || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
    const totalDebt = formData.freeAndClear ? 0 : (m1 + arr);
    
    summary += `\n\n--- AI NEXT STEPS STRATEGY ---\n`;
    if (totalDebt > 0 || formData.painPoints.includes('Pre-Foreclosure')) {
      summary += `▶ STRATEGY: High probability of Creative Finance. The seller has debt or distress constraints. Next step is to structure a Subject-To offer.\n`;
    } else {
      summary += `▶ STRATEGY: Cash offer is viable. Focus on closing the cash transaction.\n`;
    }

    updateForm('summaryNotes', summary);
  };

  const riskScore = useMemo(() => {
    let score = 0;
    if (formData.roof.includes('Tarped / Failed')) score += 10;
    if (formData.plumbing.includes('Active Leaks')) score += 15;
    if (formData.fireDamage) score += 40;
    if (formData.painPoints.includes('Pre-Foreclosure')) score += 20;
    if (formData.painPoints.includes('Squatters')) score += 15;
    return Math.min(score, 100);
  }, [formData.roof, formData.plumbing, formData.fireDamage, formData.painPoints]);

  const showedRoofHVACReaction = useMemo(() => formData.roof.length > 0 || formData.hvac.length > 0, [formData.roof, formData.hvac]);
  const showedPlumbingReaction = useMemo(() => formData.plumbing.length > 0 || formData.electrical.length > 0, [formData.plumbing, formData.electrical]);

  const togglePillarCompletion = (e, number) => {
    e.stopPropagation();
    setCompletedPillars(prev => prev.includes(number) ? prev.filter(p => p !== number) : [...prev, number]);
  };

  const renderPillar = (number, title, icon, content) => {
    const isActive = activePillar === number;
    const isCompleted = completedPillars.includes(number);
    
    return (
      <div className={clsx("mb-6 transition-all duration-300 ease-in-out border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden comic-glass", isActive ? "transform -skew-x-1 neon-glow-cyan" : isCompleted ? "opacity-90 transform skew-x-1" : "opacity-100")}>
  const renderPillar = (number, title, icon, content) => {
    const isActive = activePillar === number;
    const isCompleted = completedPillars.includes(number);
    
    return (
      <div className={clsx("mb-6 transition-all duration-300 ease-in-out border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden comic-glass", isActive ? "transform -skew-x-1 neon-glow-cyan" : isCompleted ? "opacity-90 transform skew-x-1" : "opacity-100")}>
        
          <div 
            className={clsx("flex justify-between items-center p-5 cursor-pointer select-none border-b-4 border-black",
              number === 1 ? "bg-[#00E5FF]" : 
              number === 2 ? "bg-[#FFE600]" : 
              number === 3 ? "bg-[#FF0055]" : 
              number === 4 ? "bg-[#00FF66]" : 
              number === 5 ? "bg-[#B400FF]" : "bg-[#FF6A00]"
            )} 
            onClick={() => setActivePillar(isActive ? null : number)}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", isActive ? "bg-[#00E5FF] text-[#00E5FF]" : isCompleted ? "bg-accent-success/20 text-green-600" : "bg-white text-gray-800")}>
              {icon}
            </div>
            <h3 className={clsx("font-bangers text-xl tracking-wide", isActive ? "text-black" : "text-gray-800")}>Pillar {number}: {title}</h3>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => togglePillarCompletion(e, number)}
              className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all", isCompleted ? "bg-accent-success/20 text-green-600 border border-accent-success/50" : "bg-white text-gray-800 border border-black hover:text-black")}
            >
              <CheckCircle2 size={16} /> {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            {isActive ? <ChevronDown className="text-gray-800" /> : <ChevronRight className="text-gray-800" />}
          </div>
        </div>
        
        <div className={clsx("grid transition-all duration-300 ease-in-out", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <div className="p-6 pt-0 border-t border-black mt-2">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const sellerFirstName = (formData.manualName || activeLead?.name || 'there').split(' ')[0];
  const targetAddress = formData.manualAddress || activeLead?.address || 'the property';

  const hasOccupancy = !!formData.occupancy;
  const hasCondition = formData.roof.length > 0 || formData.plumbing.length > 0 || formData.hvac.length > 0;
  const hasTimeline = !!formData.timeline;
  const hasMotivation = formData.painPoints.length > 0;

  return (
        <div 
          className={clsx("flex justify-between items-center p-5 cursor-pointer select-none border-b-4 border-black",
            number === 1 ? "bg-[#00E5FF]" : 
            number === 2 ? "bg-[#FFE600]" : 
            number === 3 ? "bg-[#FF0055]" : 
            number === 4 ? "bg-[#00FF66]" : 
            number === 5 ? "bg-[#B400FF]" : "bg-[#FF6A00]"
          )} 
          onClick={() => setActivePillar(isActive ? null : number)}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", isActive ? "bg-[#00E5FF] text-[#00E5FF]" : isCompleted ? "bg-accent-success/20 text-green-600" : "bg-white text-gray-800")}>
              {icon}
            </div>
            <h3 className={clsx("font-bangers text-xl tracking-wide", isActive ? "text-black" : "text-gray-800")}>Pillar {number}: {title}</h3>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => togglePillarCompletion(e, number)}
              className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all", isCompleted ? "bg-accent-success/20 text-green-600 border border-accent-success/50" : "bg-white text-gray-800 border border-black hover:text-black")}
            >
              <CheckCircle2 size={16} /> {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            {isActive ? <ChevronDown className="text-gray-800" /> : <ChevronRight className="text-gray-800" />}
          </div>
        </div>
        
        <div className={clsx("grid transition-all duration-300 ease-in-out", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <div className="p-6 pt-0 border-t border-black mt-2">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  };
  const sellerFirstName = (formData.manualName || activeLead?.name || 'there').split(' ')[0];
  const targetAddress = formData.manualAddress || activeLead?.address || 'the property';
  const hasOccupancy = !!formData.occupancy;
  const hasCondition = formData.roof.length > 0 || formData.plumbing.length > 0 || formData.hvac.length > 0;
  const hasTimeline = !!formData.timeline;
  const hasMotivation = formData.painPoints.length > 0;
  return (
    
      <div className="flex h-[calc(100vh-120px)] gap-6 relative z-10">

      {/* FLOATING HUD (Premium UI) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex gap-3 pointer-events-none">
        <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg backdrop-blur-md", hasOccupancy ? "bg-accent-success/90 text-black shadow-green-900/50" : "bg-white/50 text-gray-800 border border-black")}>OCCUPANCY</div>
        <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg backdrop-blur-md", hasCondition ? "bg-accent-success/90 text-black shadow-green-900/50" : "bg-white/50 text-gray-800 border border-black")}>CONDITION</div>
        <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg backdrop-blur-md", hasTimeline ? "bg-accent-success/90 text-black shadow-green-900/50" : "bg-white/50 text-gray-800 border border-black")}>TIMELINE</div>
        <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg backdrop-blur-md", hasMotivation ? "bg-accent-success/90 text-black shadow-green-900/50" : "bg-white/50 text-gray-800 border border-black")}>MOTIVATION</div>
      </div>

      {/* FLOATING HUD (Premium UI) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 flex gap-3 pointer-events-none">
        <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg backdrop-blur-md", hasOccupancy ? "bg-accent-success/90 text-black shadow-green-900/50" : "bg-white/50 text-gray-800 border border-black")}>OCCUPANCY</div>
        <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg backdrop-blur-md", hasCondition ? "bg-accent-success/90 text-black shadow-green-900/50" : "bg-white/50 text-gray-800 border border-black")}>CONDITION</div>
        <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg backdrop-blur-md", hasTimeline ? "bg-accent-success/90 text-black shadow-green-900/50" : "bg-white/50 text-gray-800 border border-black")}>TIMELINE</div>
        <div className={clsx("px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all shadow-lg backdrop-blur-md", hasMotivation ? "bg-accent-success/90 text-black shadow-green-900/50" : "bg-white/50 text-gray-800 border border-black")}>MOTIVATION</div>
      </div>
      <div className="flex-1 overflow-y-auto pr-4 pb-32 hide-scrollbar mt-10">
<button 
          onClick={() => {
            if (onReturn) onReturn();
          }} 
          className="mb-6 flex items-center gap-2 px-6 py-2 bg-black border-4 border-black text-white hover:text-[#FFE600] hover:bg-[#FF0055] transition-all font-bangers text-xl tracking-widest shadow-[4px_4px_0px_#00E5FF] transform -skew-x-2"
        >
          &larr; Return to Dispatch
        </button>
          {/* LEAD CONTEXT (Always Visible) */}
          <div className="mb-6 p-5 bg-black border-4 border-black shadow-[8px_8px_0px_#FFE600] transform skew-x-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-full bg-[#FFE600] opacity-10 transform skew-x-12"></div>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#FFE600] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Lead Source</label>
                <select value={formData.activeSource} onChange={e => updateForm('activeSource', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#FFE600] p-3 text-white font-bangers text-xl tracking-widest focus:border-[#00E5FF] outline-none cursor-pointer">
                  <option value="In-House">In-House</option>
                  <option value="Bold Street">Bold Street</option>
                  <option value="Self Gen">Self Gen</option>
                  <option value="Agent Outreach">Agent Outreach</option>
                  <option value="PPC">PPC / Web</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#FFE600] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Ownership Profile</label>
                <select value={formData.manualEntityType} onChange={e => updateForm('manualEntityType', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#FFE600] p-3 text-white font-bangers text-xl tracking-widest focus:border-[#00E5FF] outline-none cursor-pointer">
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="TRUST">Trust</option>
                  <option value="LLC">LLC</option>
                </select>
              </div>
            </div>
          </div>
        {activeLead?.isManual && (
          <div className="mb-6 p-6 bg-black border-4 border-black shadow-[8px_8px_0px_#00E5FF] transform -skew-x-1 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-full bg-[#00E5FF] opacity-10 transform -skew-x-12"></div>
            <h4 className="text-[#00E5FF] font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#000] mb-4 flex items-center gap-3 relative z-10"><MapPin size={24} className="text-[#FF0055]" /> MANUAL SUBMISSION DETAILS</h4>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#00E5FF] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Lead Name</label>
                <input type="text" value={formData.manualName} onChange={e => updateForm('manualName', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#00E5FF] p-3 text-white font-bold focus:border-[#FF0055] outline-none placeholder-gray-600" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#00E5FF] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Property Address</label>
                <div className="flex gap-3">
                  {isLoaded ? (
                    <Autocomplete onLoad={(auto) => autocompleteRef.current = auto} onPlaceChanged={handlePlaceChanged} className="flex-1">
                      <input type="text" value={formData.manualAddress} onChange={e => updateForm('manualAddress', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#00E5FF] p-3 text-white font-bold focus:border-[#FF0055] outline-none placeholder-gray-600" placeholder="Search Google Maps..." />
                    </Autocomplete>
                  ) : (
                    <input type="text" value={formData.manualAddress} onChange={e => updateForm('manualAddress', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#00E5FF] p-3 text-white font-bold focus:border-[#FF0055] outline-none placeholder-gray-600" placeholder="123 Main St..." />
                  )}
                  <button onClick={pullBatchLeadsData} disabled={isPullingData} className="px-6 bg-[#00E5FF] text-black border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] font-bangers tracking-widest text-xl hover:bg-[#FF0055] hover:text-white transition-all flex items-center justify-center transform skew-x-2">
                    {isPullingData ? '...' : <Database size={20} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
                {/* PILLAR 1: OPENER */}
          {/* PILLAR 1: OPENER */}
        {renderPillar(1, "The Opener", <Mic size={20} />, (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <button className={clsx("px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2", formData.isVoicemail ? "bg-purple-600 text-black border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-white text-purple-400 border-purple-500/30")} onClick={() => updateForm('isVoicemail', !formData.isVoicemail)}>Voicemail Drop</button>
              <button className={clsx("px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2", formData.isHostile ? "bg-red-600 text-black border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "bg-white text-red-400 border-red-500/30")} onClick={() => updateForm('isHostile', !formData.isHostile)}>Hostile Response</button>
            </div>
            {formData.isVoicemail && (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-purple-400">Agent (Voicemail Script)</span>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.activeSource === 'Agent Outreach' 
                    ? `"Hey ${sellerFirstName}, this is Avory. I'm with a local investment company here in Bakersfield and we're looking for our next project. We buy cash and close quick. If you've got any hard-to-move inventory, pocket listings, or distress deals that could use an offer, give me a call back. Talk soon."`
                    : `"Hey ${sellerFirstName || 'there'}, my name is Avory. I'm a local investor just calling about the property over on ${targetAddress}. We're actually looking to buy another one in the area and just wanted to see if you've considered selling and would be open to our cash offer. Please give me a call if you are interested. My number is 661-387-3890. Thank you and I look forward to speaking with you."`
                  }
                </div>
                
                <button 
                  onClick={() => onReturn && onReturn({ type: 'voicemail' })} 
                  className="w-full max-w-md relative h-20 group overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] transition-all hover:-translate-y-1 bg-black transform rotate-1 cursor-pointer flex justify-center items-center mt-4"
                >
                  <div className="absolute inset-0 bg-[#B400FF] transform skew-x-[-30deg] translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-500 border-l-4 border-black pointer-events-none"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <Mic size={24} className="text-white drop-shadow-[2px_2px_0px_#000]" />
                    <span className="font-bangers text-3xl text-white tracking-widest drop-shadow-[3px_3px_0px_#000] group-hover:scale-110 transition-transform">
                      LOG VOICEMAIL & RETURN
                    </span>
                  </div>
                </button>
              </div>
            )}
            
                                    {!formData.isVoicemail && !formData.isHostile && (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Direct Opener)</span>
                <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.activeSource === 'Agent Outreach' 
                    ? `"Hey ${sellerFirstName}, my name is Avory with Central Valley REI. I'm an investor buying properties cash in your area. I know you're busy, so I'll keep it brief. Do you happen to have any off-market inventory or pocket listings?"`
                    : formData.manualEntityType === 'TRUST'
                    ? `"Hey, am I speaking with the trustee for the ${leadName}? My name is Avory, a local investor. I was calling about the property over on ${targetAddress}... have the trustees ever considered selling it?"`
                    : formData.manualEntityType === 'LLC'
                    ? `"Hey, am I speaking with the owner of ${leadName}? My name is Avory, a local investor. I was calling about the property over on ${targetAddress}... have you or your partners ever considered selling it?"`
                                        : (
                      <span>
                        "Hey {sellerFirstName}, how are you doing today?..." <span className="text-[#FF0055] italic text-base block mt-1 mb-2">(pause, wait for validation)</span>
                        "My name is Avory, a local investor. I was just giving you a call about {targetAddress} to see if you've considered selling and are open to a cash offer?"
                      </span>
                    )
                  }
                </div>
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (
              <div className="p-4 bg-white border border-black rounded-xl mt-4">
                <p className="text-xs font-bold mb-3 text-gray-800 uppercase">Seller Responses & Pushbacks (Click again to untoggle)</p>
                <div className="flex gap-2 flex-wrap mb-2">
                  <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.introResponse === 'Who' ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "text-gray-800 border-black hover:text-black")} onClick={() => { updateForm('introResponse', formData.introResponse === 'Who' ? null : 'Who'); updateForm('activeObjection', null); }}>"Who is this?"</button>
                  <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.activeObjection === 'how' ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "text-gray-800 border-black hover:text-black")} onClick={() => { updateForm('activeObjection', formData.activeObjection === 'how' ? null : 'how'); updateForm('introResponse', null); }}>"How did you get my number?"</button>
                  <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.introResponse === 'No' ? "bg-[#FF0055] text-white border-black neon-glow-red transform -skew-x-2" : "text-gray-800 border-black hover:text-black")} onClick={() => { updateForm('introResponse', formData.introResponse === 'No' ? null : 'No'); updateForm('activeObjection', null); }}>Wrong Number</button>
                  <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.introResponse === 'NotOwner' ? "bg-[#FF0055] text-white border-black neon-glow-red transform -skew-x-2" : "text-gray-800 border-black hover:text-black")} onClick={() => { updateForm('introResponse', formData.introResponse === 'NotOwner' ? null : 'NotOwner'); updateForm('activeObjection', null); }}>Not the Owner / Sold It</button>
                </div>

                {formData.introResponse === 'Who' && (
                  <div className="mt-4 p-4 rounded-xl border-l-4 border-black bg-white text-black text-sm leading-relaxed animate-slideIn">
                    "Hey, my name is Avory, I'm a local investor. We're actually looking for another property in the neighborhood right now. I was just calling to see if you'd even be open to a cash offer on your property over on {targetAddress}, or if you're holding onto it?"
                  </div>
                )}
                {formData.activeObjection === 'how' && (
                  <div className="mt-4 p-4 rounded-xl border-l-4 border-black bg-white text-black text-sm leading-relaxed animate-slideIn">
                    "I use a public records system that pairs properties with phone numbers. Since we're buying in your neighborhood, I took a shot in the dark to see if you'd be open to an offer."
                  </div>
                )}
                {formData.introResponse === 'No' && (
                  <div className="mt-4 p-4 rounded-xl border-l-4 border-red-500 bg-white text-black text-sm leading-relaxed animate-slideIn">
                    "Ah, my apologies! Sounds like our public records must be outdated. But since I have you on the phone... do you happen to own any other real estate that you'd consider selling, or are you currently renting?"
                  </div>
                )}
                {formData.introResponse === 'NotOwner' && (
                  <div className="mt-4 p-4 rounded-xl border-l-4 border-red-500 bg-white text-black text-sm leading-relaxed animate-slideIn">
                    "Ah, my apologies! Well, since I have you on the phone... do you happen to own any other real estate that you might consider selling, or are you currently renting?"
                  </div>
                )}
              </div>
            )}
            
            {!['No', 'NotOwner'].includes(formData.introResponse) && !formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (
              <div className="flex flex-col mt-4 animate-slideIn">
                <div className="p-4 bg-white/40 border border-black rounded-xl animate-slideIn">
                  <p className="text-xs font-bold mb-3 text-gray-800 uppercase">Would they consider an offer?</p>
                  <div className="flex gap-2 flex-wrap">
                    <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.offerResponse === 'Yes' ? "bg-accent-success text-black border-accent-success" : "text-black border-black hover:bg-white/10")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'Yes' ? null : 'Yes')}>"Yes / Sure"</button>
                    <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.offerResponse === 'Price' ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "text-gray-800 border-black hover:text-black")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'Price' ? null : 'Price')}>"Depends on the price"</button>
                    <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.offerResponse === 'No' ? "bg-[#FF0055] text-white border-black neon-glow-red transform -skew-x-2" : "text-gray-800 border-black hover:text-black")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'No' ? null : 'No')}>"No / Not Selling"</button>
                  </div>

                  {formData.offerResponse === 'Yes' && (
                    <div className="mt-4 p-4 rounded-xl border-l-4 border-accent-success bg-white text-black text-sm leading-relaxed animate-slideIn">
                      "Awesome! Just to make sure we're on the same page, do you know exactly what you'd be looking to get for it, or are you just open to seeing what I can do?" <br/><br/>
                      
                      <div className="my-4 p-4 bg-white border border-black rounded-xl flex items-center gap-3">
                        <label className="text-xs uppercase text-gray-800 font-bold">Asking Price:</label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800">$</span>
                          <input type="text" placeholder="Price or leave blank..." className="w-full bg-white border border-black rounded-lg p-2 pl-7 text-black focus:border-accent-success outline-none" value={formData.askingPrice || ''} onChange={e => updateForm('askingPrice', e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setActivePillar(2); setCompletedPillars(prev => [...new Set([...prev, 1])]); } }} />
                        </div>
                        <button className={clsx("px-3 text-xs rounded border py-2 transition-colors", formData.refusedPrice ? "bg-red-600 border-red-600 text-black" : "border-black text-gray-800 hover:text-black")} onClick={() => updateForm('refusedPrice', !formData.refusedPrice)}>Refused Price</button>
                      </div>

                      {formData.askingPrice || formData.refusedPrice ? (
                        <div className="mt-4 pt-4 border-t border-black">
                          <p className="mb-4">
                            {formData.refusedPrice 
                              ? `"No worries at all, I completely understand. Usually when we buy properties, the exact number we can offer is going to depend heavily on the condition and layout. I just need to verify some basic facts about the property."`
                              : `"Got it, $${Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice}. For us to see if we can make that number work, it's going to depend heavily on the condition and layout. I just need to verify some basic facts about the property."`
                            }
                          </p>
                          <div className="flex justify-end">
                             <button className="px-4 py-2 bg-accent-secondary hover:bg-purple-600 transition-colors text-black rounded-lg font-bold text-sm" onClick={() => { setActivePillar(2); setCompletedPillars(prev => [...new Set([...prev, 1])]); }}>Proceed to Pillar 2 (Property) &rarr;</button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-black">
                          <p className="mb-4 text-gray-800 italic">Enter a price or click Refused Price to continue...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.offerResponse === 'Price' && (
                    <div className="mt-4 p-4 rounded-xl border-l-4 border-black bg-white text-black text-sm leading-relaxed animate-slideIn">
                      "I hear you. The right price is everything. Usually when people say that, they already have a number in mind. What would make sense for you if we paid cash and covered all your closing costs?"
                      <div className="mt-3 flex gap-2">
                        <input type="number" placeholder="Their Asking Price..." className="p-2 rounded bg-white border border-black flex-1 text-black outline-none" value={formData.askingPrice} onChange={e => updateForm('askingPrice', e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setActivePillar(2); setCompletedPillars(prev => [...new Set([...prev, 1])]); } }} />
                        <button className={clsx("px-3 text-xs rounded border transition-colors", formData.refusedPrice ? "bg-red-600 border-red-600 text-black" : "border-black text-gray-800")} onClick={() => updateForm('refusedPrice', !formData.refusedPrice)}>Refused Price</button>
                      </div>
                      
                      {formData.askingPrice || formData.refusedPrice ? (
                        <div className="mt-4 pt-4 border-t border-black">
                          <p className="mb-4">
                            {formData.refusedPrice 
                              ? `"No worries at all, I completely understand. Usually when we buy properties, the exact number we can offer is going to depend heavily on the condition and layout. I just need to verify some basic facts about the property."`
                              : `"Got it, $${Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice}. For us to see if we can make that number work, it's going to depend heavily on the condition and layout. I just need to verify some basic facts about the property."`
                            }
                          </p>
                          <div className="flex justify-end">
                             <button className="px-4 py-2 bg-accent-secondary hover:bg-purple-600 transition-colors text-black rounded-lg font-bold text-sm" onClick={() => { setActivePillar(2); setCompletedPillars(prev => [...new Set([...prev, 1])]); }}>Proceed to Pillar 2 (Property) &rarr;</button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-black">
                          <p className="mb-4 text-gray-800 italic">Enter a price or click Refused Price to continue...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.offerResponse === 'No' && (
                    <div className="mt-4 p-4 rounded-xl border-l-4 border-red-500 bg-white text-black text-sm leading-relaxed animate-slideIn">
                      "I completely understand. It sounds like this is a long-term hold for you. If anything ever changes, would you be opposed to me keeping your number on file just in case?"
                      <div className="mt-4 pt-4 border-t border-black flex justify-end">
                         <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-black rounded-lg font-bold text-sm" onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'Not Selling' })}>Disqualify / End Call</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* PILLAR 2: PROPERTY DYNAMICS & OCCUPANCY */}
        {renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col mb-2">
               <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent</span>
               <div className="relative bg-black/60 backdrop-blur-md border-4 border-[#00E5FF] p-6 shadow-[6px_6px_0px_#000] text-xl font-bold text-white leading-relaxed rounded-2xl rounded-tl-none mb-6">
                 {formData.beds && formData.baths && formData.sqft 
                   ? `"My records show this is a ${formData.beds} bed, ${formData.baths} bath, and roughly ${Number(formData.sqft).toLocaleString()} square feet. Is that correct, or have you guys added on to it at all?"`
                   : `"Just to make sure I have the basic facts down... what is the current bedroom and bathroom count, and roughly how many square feet is it?"`
                 }
               </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               <div>
                 <label className="text-xs text-gray-800 uppercase block mb-1">Beds</label>
                 <input type="number" value={formData.beds} onChange={e => updateForm('beds', e.target.value)} className="w-full bg-white border border-black rounded-lg p-3 text-black focus:border-black outline-none" />
               </div>
               <div>
                 <label className="text-xs text-gray-800 uppercase block mb-1">Baths</label>
                 <input type="number" value={formData.baths} onChange={e => updateForm('baths', e.target.value)} className="w-full bg-white border border-black rounded-lg p-3 text-black focus:border-black outline-none" />
               </div>
               <div>
                 <label className="text-xs text-gray-800 uppercase block mb-1">Sqft</label>
                 <input type="number" value={formData.sqft} onChange={e => updateForm('sqft', e.target.value)} className="w-full bg-white border border-black rounded-lg p-3 text-black focus:border-black outline-none" />
               </div>
            </div>

            <div>
              <label className="text-xs text-gray-800 uppercase block mb-2">Property Type</label>
              <div className="flex flex-wrap gap-2">
                {['Single Family', 'Multi-Family', 'Condo/Townhome', 'Mobile Home', 'Land'].map(type => (
                  <button key={type} onClick={() => updateForm('propertyType', formData.propertyType === type ? '' : type)} className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.propertyType === type ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "bg-black/60 text-white border-[#00E5FF] hover:bg-white/20")}>{type}</button>
                ))}
              </div>
            </div>

            {/* Property Dynamics Inputs */}
            {formData.propertyType === 'Multi-Family' && (
              <div className="p-4 bg-white border border-black rounded-xl animate-slideIn">
                <p className="text-sm text-black mb-2">"We love buying multi-family properties. How many units is it, and what's the bed and bath configuration?"</p>
                <div className="flex gap-2">
                  <input type="number" placeholder="Number of Units..." value={formData.mfUnits} onChange={e => updateForm('mfUnits', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                  <input type="text" placeholder="Config (e.g. 4 units - 2b/1b)..." value={formData.mfConfig} onChange={e => updateForm('mfConfig', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                </div>
              </div>
            )}

            {formData.propertyType === 'Condo/Townhome' && (
              <div className="p-4 bg-white border border-black rounded-xl animate-slideIn">
                <p className="text-sm text-black mb-2">"Condos are great. Usually, the biggest hurdle for us are the HOA rules. What's the name of the HOA, what's the monthly fee, and do they have any rental restrictions?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="HOA Name..." value={formData.hoaName} onChange={e => updateForm('hoaName', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                  <input type="text" placeholder="HOA Fee / Mo ($)..." value={formData.hoaFee} onChange={e => updateForm('hoaFee', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                </div>
                <input type="text" placeholder="Any Rental Restrictions?" value={formData.hoaRestrictions} onChange={e => updateForm('hoaRestrictions', e.target.value)} className="w-full bg-white border border-black rounded-lg p-2 text-black outline-none" />
              </div>
            )}

            {formData.propertyType === 'Mobile Home' && (
              <div className="p-4 bg-white border border-black rounded-xl animate-slideIn">
                <p className="text-sm text-black mb-2">"Mobile homes are great. Is it located inside a park, and if so, what's the space rent?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Park Name / Location..." value={formData.mhParkName} onChange={e => updateForm('mhParkName', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                  <input type="text" placeholder="Space Rent / Fee ($)..." value={formData.mhParkFee} onChange={e => updateForm('mhParkFee', e.target.value)} className="flex-1 bg-white border border-black rounded-lg p-2 text-black outline-none" />
                </div>
                <div className="flex gap-2">
                  <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.mh55Plus ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "bg-black/60 text-white border-[#00E5FF] hover:bg-white/20")} onClick={() => updateForm('mh55Plus', !formData.mh55Plus)}>55+ Community</button>
                  <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.mh433A ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "bg-black/60 text-white border-[#00E5FF] hover:bg-white/20")} onClick={() => updateForm('mh433A', !formData.mh433A)}>433A (Perm Foundation)</button>
                </div>
              </div>
            )}

            {formData.propertyType === 'Land' && (
              <div className="p-4 bg-white border border-black rounded-xl animate-slideIn">
                <p className="text-sm text-black mb-2">"Gotcha. For vacant land, the most important things we look at are utilities and zoning. Do you know what it's currently zoned for, and does it have city water and sewer?"</p>
                <input type="text" placeholder="Current Zoning (e.g. R1, Ag)..." value={formData.landZoning} onChange={e => updateForm('landZoning', e.target.value)} className="w-full bg-black/40 backdrop-blur-md border-2 border-[#00E5FF] rounded-lg p-2 text-white outline-none mb-2 placeholder-gray-400" />
                <div className="flex gap-2 mb-2 flex-wrap">
                  {['Water', 'Sewer', 'Electric', 'Well/Septic'].map(util => {
                    const isSelected = formData.landUtilities?.includes(util);
                    return (
                      <button key={util} className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", isSelected ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "bg-black/60 text-white border-[#00E5FF] hover:bg-white/20")} onClick={() => {
                        const current = formData.landUtilities || [];
                        updateForm('landUtilities', isSelected ? current.filter(u => u !== util) : [...current, util]);
                      }}>{util}</button>
                    )

                  })}
                </div>
                <div className="flex gap-2">
                  <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.landPaved === true ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "bg-black/60 text-white border-[#00E5FF] hover:bg-white/20")} onClick={() => handleSingleSelect('landPaved', true)}>Paved Access</button>
                  <button className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all hover:-translate-y-1 shadow-[4px_4px_0px_#000] transform -skew-x-12", formData.landPaved === false ? "bg-[#00E5FF] text-black border-black neon-glow-cyan transform -skew-x-2" : "bg-black/60 text-white border-[#00E5FF] hover:bg-white/20")} onClick={() => handleSingleSelect('landPaved', false)}>Dirt Road Access</button>
                </div>
              </div>
            )}

{/* Dynamic Follow-up: Tenant */}
            {isTenant && (
              <div className="bubble-row agent" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bubble-label">Agent (Tenant Follow-up)</div>
                <div className="bubble">
                  "And are they currently paying on time? What are they paying in rent right now, and are they on a month-to-month or long-term lease?"
                  
                  <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <input type="text" placeholder="Rent Amount ($)..." value={formData.rentAmount} onChange={(e) => setFormData({...formData, rentAmount: e.target.value})} className="modern-input" />
                      <input type="text" placeholder="How do they pay? (Zelle, Cash)..." value={formData.rentMethod} onChange={(e) => setFormData({...formData, rentMethod: e.target.value})} className="modern-input" />
                    </div>
                    <div className="toggles-row" style={{ marginBottom: '10px' }}>
                      <button className={`toggle-pill ${formData.leaseType === 'M2M' ? 'active' : ''}`} onClick={() => handleSingleSelect('leaseType', 'M2M')}>Month-to-Month</button>
                      <button className={`toggle-pill ${formData.leaseType === 'Lease' ? 'active' : ''}`} onClick={() => handleSingleSelect('leaseType', 'Lease')}>Fixed Lease</button>
                      <button className={`toggle-pill ${formData.tenantStatus.includes('Paying on Time') ? 'active' : ''}`} onClick={() => handleToggle('tenantStatus', 'Paying on Time')}>Paying on Time</button>
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '10px', marginTop: '10px' }}>
                       <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>If Behind on Rent:</label>
                       <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                         <input type="text" placeholder="Amount Behind ($)..." value={formData.rentArrears} onChange={(e) => setFormData({...formData, rentArrears: e.target.value})} className="modern-input" style={{ width: '150px' }} />
                         <button className={`toggle-pill ${formData.tenantStatus.includes('Eviction Needed') ? 'active' : ''}`} onClick={() => handleToggle('tenantStatus', 'Eviction Needed')} style={{ background: formData.tenantStatus.includes('Eviction Needed') ? '#ef4444' : '', color: formData.tenantStatus.includes('Eviction Needed') ? 'white' : '' }}>Eviction Needed</button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up: Vacant */}
            {isVacant && (
              <div className="bubble-row agent" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bubble-label">Agent (Vacant Follow-up)</div>
                <div className="bubble">
                  "Okay, since it's vacant, how long has it been sitting empty? Have you had any issues with squatters or break-ins that we should know about?"
                  
                  <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                    <input type="text" placeholder="How long vacant? (e.g., 6 months)..." value={formData.vacantLength} onChange={(e) => setFormData({...formData, vacantLength: e.target.value})} className="modern-input" style={{ width: '100%', marginBottom: '10px' }} />
                    <div className="toggles-row">
                      <button className={`toggle-pill ${formData.vacantIssues.includes('Boarded Up') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Boarded Up')}>Boarded Up</button>
                      <button className={`toggle-pill ${formData.vacantIssues.includes('Squatters') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Squatters')}>Squatters</button>
                      <button className={`toggle-pill ${formData.vacantIssues.includes('Vandalism') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Vandalism')}>Vandalized</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up: Trust/Probate */}
            {isTrust && (
              <div className="bubble-row agent" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bubble-label">Agent (Trust/Probate Follow-up)</div>
                <div className="bubble">
                  "Since it's in a trust or probate, has the probate process officially started yet? And how many heirs or decision makers are involved? Does everyone agree on selling?"
                  
                  <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                       <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Probate Started?</label>
                       <button className={`toggle-pill ${formData.probateStarted === true ? 'active' : ''}`} onClick={() => handleSingleSelect('probateStarted', true)}>Yes</button>
                       <button className={`toggle-pill ${formData.probateStarted === false ? 'active' : ''}`} onClick={() => handleSingleSelect('probateStarted', false)}>No</button>
                    </div>
                    <input type="text" placeholder="Who is the Executor/Admin?" value={formData.executor} onChange={(e) => setFormData({...formData, executor: e.target.value})} className="modern-input" style={{ width: '100%', marginBottom: '10px' }} />
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                       <label style={{ fontSize: '0.9rem' }}>Total Heirs/Decision Makers:</label>
                       <input type="number" min="1" value={formData.trustHeadcount} onChange={(e) => setFormData({...formData, trustHeadcount: e.target.value})} className="modern-input" style={{ width: '80px' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Condition Bridges */}
            {isTenant && formData.tenantStatus.includes('Eviction Needed') && (
              <div className="bubble-row agent" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bubble-label">Agent (Transition)</div>
                <div className="bubble">
                  "Man, I don't blame you for wanting to wash your hands of that. Evictions are a nightmare. Since we'd be inheriting that headache... what kind of condition are they leaving the place in?"
                </div>
              </div>
            )}
            
            {isTenant && formData.tenantStatus.includes('Paying on Time') && formData.leaseType === 'M2M' && !formData.tenantStatus.includes('Eviction Needed') && (
              <div className="bubble-row agent" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bubble-label">Agent (Transition)</div>
                <div className="bubble">
                  "Okay, month-to-month and paying on time. We could probably just inherit them as tenants. With that in mind, what's the actual condition of the property?"
                </div>
              </div>
            )}

            {isVacant && (formData.vacantIssues.includes('Squatters') || formData.vacantIssues.includes('Boarded Up') || formData.vacantIssues.includes('Vandalism')) && (
              <div className="bubble-row agent" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bubble-label">Agent (Transition)</div>
                <div className="bubble">
                  "Wow, sorry you're dealing with that. We buy properties with those issues all the time so we can definitely take that burden off your hands. Since we can't always get inside right away, what do you remember about the major stuff?"
                </div>
              </div>
            )}

            {/* Core Condition Questions */}
            <div className="bubble-row agent" style={{ marginTop: ((isTenant && formData.tenantStatus.length > 0) || (isVacant && formData.vacantIssues.length > 0)) ? '1.5rem' : '2.5rem' }}>
              <div className="bubble-label">Agent (Roof & AC)</div>
              <div className="bubble">
                {formData.roof.length > 0 && formData.hvac.length > 0 ? "You mentioned earlier the condition of the roof and AC, which helps a lot." : 
                 formData.roof.length > 0 ? "You mentioned the roof earlier, but what about the AC? Has that been replaced anytime recently?" :
                 formData.hvac.length > 0 ? "You mentioned the AC earlier, but what about the roof? Has that been replaced anytime recently?" :
                 ((isTenant && formData.tenantStatus.includes('Eviction Needed')) || (isTenant && formData.tenantStatus.includes('Paying on Time') && formData.leaseType === 'M2M') || (isVacant && formData.vacantIssues.length > 0)) ? 
                  "Typically our biggest expenses are the roof and the AC. Have those been replaced anytime recently?" : 
                  "Typically the biggest expenses for us are the roof and the AC. Have those been replaced anytime recently?"}
              </div>
            </div>
            
            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 1 */}
            {showedRoofHVACReaction && (
              <div className="bubble-row agent" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
                <div className="bubble-label">Agent (Reaction)</div>
                <div className="bubble">
                  "Got it. Don't worry too much about that, we deal with replacing those all the time."
                </div>
              </div>
            )}

            <div className="bubble-row agent" style={{ marginTop: '2rem' }}>
              <div className="bubble-label">Agent (Plumbing & Electrical)</div>
              <div className="bubble">
                {formData.plumbing.length > 0 && formData.electrical.length > 0 ? "You also mentioned the plumbing and electrical situation earlier..." :
                 formData.plumbing.length > 0 ? "You mentioned the plumbing earlier... what about the electrical, is the panel updated?" :
                 formData.electrical.length > 0 ? "You mentioned the electrical earlier... what about the plumbing, any recent updates there?" :
                 showedRoofHVACReaction 
                  ? "Okay, what about the plumbing and electrical... any recent updates there?"
                  : "Got it. What about the plumbing and electrical... any recent updates there?"
                }
              </div>
            </div>

            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 2 */}
            {showedPlumbingReaction && (
              <div className="bubble-row agent" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
                <div className="bubble-label">Agent (Reaction)</div>
                <div className="bubble">
                  "Okay, yeah, we usually end up having to repipe and rewire those older setups anyway, so that's not a deal breaker."
                </div>
              </div>
            )}

            <div className="bubble-row agent" style={{ marginTop: '2rem' }}>
              <div className="bubble-label">Agent (Cosmetics & Inside)</div>
              <div className="bubble">
                {formData.cosmeticsKitchen.length > 0 && formData.cosmeticsBaths.length > 0 ? "You already gave me a good idea of the kitchen and bath conditions..." :
                 showedPlumbingReaction
                  ? "Okay. As far as the inside goes, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                  : "So it sounds like the major systems are pretty clear... as far as the inside goes, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                }
              </div>
            </div>

            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 3 */}
            {(formData.cosmeticsKitchen.includes('Full Gut Needed') || formData.cosmeticsBaths.includes('Full Gut Needed')) && (
              <div className="bubble-row agent" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
                <div className="bubble-label">Agent (Reaction)</div>
                <div className="bubble">
                  "Gotcha. Sounds like it needs some pretty heavy cosmetic love. That's right up our alley."
                </div>
              </div>
            )}

            <div className="bubble-row agent" style={{ marginTop: '2rem' }}>
              <div className="bubble-label">Agent (Structure & Risk)</div>
              <div className="bubble">
                {formData.highRisk.length > 0 ? "And you mentioned earlier the structural situation, which I have noted..." :
                 "Makes sense. Before we move on from the property itself, any red flags we'd need to know about? Like foundation settling or unpermitted additions?"}
              </div>
            </div>

            {/* Toggles moved to sidebar */}

            {formData.highRisk.includes('Fire/Water Damage') && (
              <div className="bubble-row agent" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease forwards' }}>
                <div className="bubble-label">Agent (Fire Damage Follow-up)</div>
                <div className="bubble">
                  "Oof, okay. With fire damage, the scope can get pretty crazy. Do you know if the city has pulled the meter or red-tagged the property? And are we talking a full teardown down to the studs, or is it mostly just roof and smoke damage?"
                  
                  <div style={{ marginTop: '15px', background: 'rgba(239, 68, 68, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                       <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                         <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Meter Pulled?</label>
                         <button className={`toggle-pill ${formData.fireMeterPulled === true ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSingleSelect('fireMeterPulled', true)}>Yes</button>
                         <button className={`toggle-pill ${formData.fireMeterPulled === false ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSingleSelect('fireMeterPulled', false)}>No</button>
                       </div>
                       <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                         <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Red-Tagged?</label>
                         <button className={`toggle-pill ${formData.fireRedTagged === true ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSingleSelect('fireRedTagged', true)}>Yes</button>
                         <button className={`toggle-pill ${formData.fireRedTagged === false ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSingleSelect('fireRedTagged', false)}>No</button>
                       </div>
                       <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                         <label style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Full Demo?</label>
                         <button className={`toggle-pill ${formData.fireFullDemo === true ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSingleSelect('fireFullDemo', true)}>Yes</button>
                         <button className={`toggle-pill ${formData.fireFullDemo === false ? 'active' : ''}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSingleSelect('fireFullDemo', false)}>No</button>
                       </div>
                    </div>
                    <input type="text" placeholder="Additional fire damage notes..." value={formData.fireNotes} onChange={(e) => setFormData({...formData, fireNotes: e.target.value})} className="modern-input" style={{ width: '100%', borderColor: 'rgba(239, 68, 68, 0.3)' }} />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <button className="next-step-btn" onClick={() => handleProceed(3)}>
                 Proceed to Motivation & Timeline <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}

        {/* PILLAR 3: MOTIVATION & TIMELINE */}
        {activeSource !== 'Agent Outreach' && (
          <div id="pillar-3" style={{ 
            marginBottom: '2rem', 
            opacity: currentStep >= 3 ? 1 : 0.3,
            pointerEvents: currentStep >= 3 ? 'auto' : 'none',
            filter: currentStep >= 3 ? 'none' : 'grayscale(80%)',
            transition: 'all 0.5s ease',
            animation: 'slideInUp 0.4s ease forwards' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#a855f7' }}>
              <HeartHandshake size={20} />
              <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Pillar 3: Escrow Timeline & Logistics</h3>
            </div>

            <div className="bubble-row agent">
              <div className="bubble-label">Agent (Timeline / Relocation)</div>
              <div className="bubble">
                "Okay, I've got enough here on the condition. Let's just say we do agree on a price that makes sense... our average close time is about 30 to 40 days on average, how does that work for you? What are your guys' relocation plans looking like? Did you have somewhere to go, or is that something you guys have to figure out?"
              </div>
              <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                <div className="toggles-row" style={{ marginBottom: '15px' }}>
                  <button className={`toggle-pill ${formData.timelineType === 'Vacant at Close' ? 'active' : ''}`} onClick={() => handleSingleSelect('timelineType', 'Vacant at Close')}>Vacant at Close</button>
                  <button className={`toggle-pill ${formData.timelineType === 'Close in Place' ? 'active' : ''}`} onClick={() => handleSingleSelect('timelineType', 'Close in Place')}>Close with them in place</button>
                  <button className={`toggle-pill ${formData.timelineType === 'Concurrent Close' ? 'active' : ''}`} onClick={() => handleSingleSelect('timelineType', 'Concurrent Close')}>Concurrent Close</button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginLeft: '4px' }}>Target Close Date</label>
                    <input type="date" value={formData.targetCloseDate || ''} onChange={(e) => setFormData({...formData, targetCloseDate: e.target.value})} className="modern-input" />
                  </div>
                  
                  {formData.timelineType === 'Close in Place' && (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-end' }}>
                       <input type="number" placeholder="Days to move out post-close..." value={formData.postCloseDays} onChange={(e) => setFormData({...formData, postCloseDays: e.target.value})} className="modern-input" />
                     </div>
                  )}
                  {formData.timelineType === 'Concurrent Close' && (
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'flex-end' }}>
                       <input type="text" placeholder="Concurrent Escrow details..." value={formData.timelineDetails} onChange={(e) => setFormData({...formData, timelineDetails: e.target.value})} className="modern-input" />
                     </div>
                  )}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <textarea placeholder="Relocation Plans (Where are they moving? How are they funding it?)..." value={formData.relocationPlans || ''} onChange={(e) => setFormData({...formData, relocationPlans: e.target.value})} className="modern-input" style={{ width: '100%', minHeight: '60px', resize: 'vertical' }} />
                </div>
              </div>
            </div>

            {currentStep === 3 && (
              <button className="next-step-btn" onClick={() => handleProceed(4)}>
                Proceed to Financials <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}

        {/* PILLAR 4: FINANCIALS & DEBT */}
        {activeSource !== 'Agent Outreach' && (
          <div id="pillar-4" style={{ 
            marginBottom: '2rem', 
            opacity: currentStep >= 4 ? 1 : 0.3,
            pointerEvents: currentStep >= 4 ? 'auto' : 'none',
            filter: currentStep >= 4 ? 'none' : 'grayscale(80%)',
            transition: 'all 0.5s ease',
            animation: 'slideInUp 0.4s ease forwards' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#f59e0b' }}>
              <ShieldAlert size={20} />
              <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Pillar 4: Financials & Debt</h3>
            </div>

            <div className="bubble-row agent">
              <div className="bubble-label">Agent (Transition to Financials)</div>
              <div className="bubble">
                {formData.askingPrice 
                  ? `"Got it, that timeline definitely sounds workable for us. Now, circling back to that $${Number(formData.askingPrice.toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice} number you mentioned earlier... for us to actually make that work and give you that certainty, we cover all the title and escrow fees so whatever number we agree on is exactly what you walk away with cleanly. But just so I can do the exact math... is the property owned free and clear, or is there an existing mortgage or any liens that need to be paid off at closing?"`
                  : `"Got it, that timeline definitely sounds workable for us. Now, if we can make the numbers work and give you that certainty, we cover all the title and escrow fees, so whatever number we end up at is exactly what you walk away with cleanly. Just so I can do the exact math... is the property owned free and clear, or is there an existing mortgage or any liens that need to be paid off at closing?"`
                }
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.02)', padding: '1.5rem', borderRadius: '12px', marginTop: '1.5rem', border: '1px solid rgba(0,0,0,0.1)' }}>
              
              <div style={{ marginBottom: '1rem' }}>
                <button 
                  className={`toggle-pill ${formData.freeAndClear ? 'active' : ''}`} 
                  style={formData.freeAndClear ? {background: '#10b981', borderColor: '#10b981', color: '#fff'} : {}}
                  onClick={() => setFormData({...formData, freeAndClear: !formData.freeAndClear})}
                >
                  Property is Free & Clear (No Debt)
                </button>
              </div>

              {!formData.freeAndClear && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', animation: 'slideInUp 0.3s ease' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>1st Mortgage Balance:</label>
                    <input type="text" value={formData.mortgageBalance} onChange={(e) => setFormData({...formData, mortgageBalance: e.target.value})} placeholder="$0" className="modern-input" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>2nd Position (HELOC/Lien):</label>
                    <input type="text" value={formData.secondPosition} onChange={(e) => setFormData({...formData, secondPosition: e.target.value})} placeholder="$0" className="modern-input" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>3rd Position:</label>
                    <input type="text" value={formData.thirdPosition} onChange={(e) => setFormData({...formData, thirdPosition: e.target.value})} placeholder="$0" className="modern-input" style={{ width: '100%' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#666', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>4th Position:</label>
                    <input type="text" value={formData.fourthPosition} onChange={(e) => setFormData({...formData, fourthPosition: e.target.value})} placeholder="$0" className="modern-input" style={{ width: '100%' }} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ fontSize: '0.8rem', color: '#ef4444', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Arrears / Behind Amount (Pre-Foreclosure):</label>
                    <input type="text" value={formData.arrearsAmount} onChange={(e) => setFormData({...formData, arrearsAmount: e.target.value})} placeholder="$0" className="modern-input" style={{ width: '100%', background: 'rgba(239, 68, 68, 0.05)' }} />
                  </div>
                </div>
              )}
              
              <div style={{ marginTop: '1.5rem', fontSize: '1.1rem', color: '#f59e0b', fontWeight: 'bold', padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', textAlign: 'center' }}>
                Total Est. Debt to Clear: ${totalDebt.toLocaleString()}
              </div>

              {currentStep === 4 && (
                <button className="next-step-btn" onClick={() => handleProceed(5)}>
                   Proceed to the Offer <ChevronRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* PILLAR 5: THE OFFER PIVOT */}
        {activeSource !== 'Agent Outreach' && (
          <div id="pillar-5" style={{ 
            marginBottom: '2rem', 
            opacity: currentStep >= 5 ? 1 : 0.3,
            pointerEvents: currentStep >= 5 ? 'auto' : 'none',
            filter: currentStep >= 5 ? 'none' : 'grayscale(80%)',
            transition: 'all 0.5s ease',
            animation: 'slideInUp 0.4s ease forwards' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#10b981' }}>
              <BrainCircuit size={20} />
              <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Pillar 5: The Offer (Pivot)</h3>
            </div>

            <div className="toggles-row" style={{ marginBottom: '1.5rem' }}>
               <button className={`toggle-pill ${formData.pitchType === 'cash' ? 'active' : ''}`} onClick={() => setFormData({...formData, pitchType: 'cash'})}>Cash Offer Pitch</button>
               <button className={`toggle-pill ${formData.pitchType === 'creative' ? 'active' : ''}`} style={formData.pitchType === 'creative' ? {background:'#f59e0b', borderColor:'#f59e0b', color:'#fff'} : {}} onClick={() => setFormData({...formData, pitchType: 'creative'})}>Creative / SubTo Pitch</button>
            </div>

            {wantsCreative ? (
              <div className="bubble-row agent" style={{ animation: 'slideInUp 0.3s ease' }}>
                <div className="bubble-label">Agent (Creative Pivot)</div>
                <div className="bubble">
                  "Okay, so based on the math, a cash offer is going to be too low for you. BUT, if you're willing to be a little flexible on terms, I can get you much closer to your retail asking price. If we agree on your price, would you be open to letting us take over the existing mortgage payments and paying you out your equity?"
                </div>
              </div>
            ) : (
              <div className="bubble-row agent" style={{ animation: 'slideInUp 0.3s ease' }}>
                <div className="bubble-label">Agent (Voss No-Oriented Question)</div>
                <div className="bubble">
                  "Okay, I've got my underwriters looking at it. Since we're paying cash, buying it completely as-is, and covering all of your closing costs... we're coming in right around <strong>[SEE HUD FOR MAO]</strong>. Would it be a ridiculous idea to consider an offer in that ballpark?"
                </div>
              </div>
            )}
            
            {/* Offer Rebuttals */}
            <div className="objections-section" style={{ marginTop: '2rem' }}>
               <div className="bubble-label" style={{ marginBottom: '10px' }}>Offer Rebuttals (Click for rebuttal)</div>
               <div className="toggles-row">
                 <button className={`toggle-pill ${activeObjection === 'too_low' ? 'active' : ''}`} onClick={() => setActiveObjection(activeObjection === 'too_low' ? null : 'too_low')}>
                   "That's too low"
                 </button>
                 <button className={`toggle-pill ${activeObjection === 'think_about_it' ? 'active' : ''}`} onClick={() => setActiveObjection(activeObjection === 'think_about_it' ? null : 'think_about_it')}>
                   "I need to think about it"
                 </button>
                 <button className={`toggle-pill ${activeObjection === 'other_offers' ? 'active' : ''}`} onClick={() => setActiveObjection(activeObjection === 'other_offers' ? null : 'other_offers')}>
                   "I have higher offers"
                 </button>
               </div>

               {activeObjection === 'too_low' && (
                 <div className="bubble-row agent" style={{ marginTop: '1rem', animation: 'slideInUp 0.3s ease forwards' }}>
                   <div className="bubble-label">Rebuttal (Price Anchor)</div>
                   <div className="bubble">
                     "I completely understand. If we could get up to your number, we absolutely would. But taking into consideration the cost of the updates, the holding costs, and paying all the closing fees... that's realistically where we need to be to make it make sense. Are we miles apart, or is there a number closer to that where we could shake hands?"
                   </div>
                 </div>
               )}

               {activeObjection === 'think_about_it' && (
                 <div className="bubble-row agent" style={{ marginTop: '1rem', animation: 'slideInUp 0.3s ease forwards' }}>
                   <div className="bubble-label">Rebuttal (Time Kills Deals)</div>
                   <div className="bubble">
                     "Absolutely, taking your time makes total sense. Usually when people need to think about it, there's a specific concern holding them back—is it the price, the timeline, or something else?"
                     <div className="toggles-row" style={{ marginTop: '15px' }}>
                       <button className={`toggle-pill ${formData.thinkAboutItReason === 'Price' ? 'active' : ''}`} onClick={() => handleSingleSelect('thinkAboutItReason', 'Price')}>Price</button>
                       <button className={`toggle-pill ${formData.thinkAboutItReason === 'Timeline' ? 'active' : ''}`} onClick={() => handleSingleSelect('thinkAboutItReason', 'Timeline')}>Timeline</button>
                       <button className={`toggle-pill ${formData.thinkAboutItReason === 'Other' ? 'active' : ''}`} onClick={() => handleSingleSelect('thinkAboutItReason', 'Other')}>Something Else</button>
                     </div>
                     {formData.thinkAboutItReason === 'Price' && <div style={{ marginTop: '10px', color: '#10b981', fontWeight: 'bold' }}>"Got it. So if we were able to come up on price a little bit, is this something you'd be ready to move forward with today?"</div>}
                     {formData.thinkAboutItReason === 'Timeline' && <div style={{ marginTop: '10px', color: '#10b981', fontWeight: 'bold' }}>"Got it. So if we were able to give you as much time as you needed to move out, is this something you'd be ready to move forward with today?"</div>}
                     {formData.thinkAboutItReason === 'Other' && <div style={{ marginTop: '10px' }}><input type="text" placeholder="What is holding them back?..." className="modern-input" value={formData.thinkAboutItOther || ''} onChange={(e) => setFormData({...formData, thinkAboutItOther: e.target.value})} style={{ width: '100%' }} /></div>}
                   </div>
                 </div>
               )}

               {activeObjection === 'other_offers' && (
                 <div className="bubble-row agent" style={{ marginTop: '1rem', animation: 'slideInUp 0.3s ease forwards' }}>
                   <div className="bubble-label">Rebuttal (Offer Comparison)</div>
                   <div className="bubble">
                     "That's awesome, it sounds like you have some great options. Just be careful with out-of-state buyers who throw out a high number and then ask for massive price drops during inspections. Our offer is completely as-is with zero contingencies. Do their offers waive inspections? If we can guarantee our price, what number would we need to hit to get this locked up right now?"
                   </div>
                 </div>
               )}
            </div>

            {/* Offer Lock In Section */}
            <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: formData.isPriceLocked ? 'rgba(16, 185, 129, 0.05)' : 'rgba(139, 92, 246, 0.05)', borderRadius: '16px', border: formData.isPriceLocked ? '1px solid rgba(16, 185, 129, 0.2)' : '1px dashed rgba(139, 92, 246, 0.3)', transition: 'all 0.3s ease' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: formData.isPriceLocked ? '#10b981' : '#8b5cf6', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} /> {formData.isPriceLocked ? 'Offer Accepted & Locked' : 'Final Negotiated Price'}
              </h4>
              
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>$</div>
                  <input 
                    type="text" 
                    placeholder="Agreed upon price..." 
                    value={formData.lockedPrice}
                    onChange={(e) => setFormData({...formData, lockedPrice: e.target.value})}
                    disabled={formData.isPriceLocked}
                    style={{ 
                      width: '100%', 
                      padding: '15px 15px 15px 35px', 
                      borderRadius: '12px', 
                      border: '1px solid var(--border-subtle)', 
                      fontSize: '1.2rem', 
                      fontWeight: '800',
                      background: formData.isPriceLocked ? 'transparent' : '#fff',
                      color: formData.isPriceLocked ? '#10b981' : 'var(--text-dark)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  />
                </div>
                
                <button 
                  onClick={() => setFormData({...formData, isPriceLocked: !formData.isPriceLocked})}
                  style={{
                    padding: '15px 25px',
                    borderRadius: '12px',
                    background: formData.isPriceLocked ? 'transparent' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: formData.isPriceLocked ? '#ef4444' : '#fff',
                    border: formData.isPriceLocked ? '1px solid rgba(239, 68, 68, 0.3)' : 'none',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: formData.isPriceLocked ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {formData.isPriceLocked ? 'Unlock' : 'Lock Price 🔒'}
                </button>
              </div>
            </div>

            {currentStep === 5 && formData.isPriceLocked && (
              <button className="next-step-btn" onClick={() => handleProceed(6)} style={{ marginTop: '1.5rem', animation: 'fadeIn 0.4s ease' }}>
                 Proceed to the Close <ChevronRight size={18} />
              </button>
            )}
          </div>
        )}

        {/* PILLAR 6: THE CLOSE & CONTRACTING */}
        {activeSource !== 'Agent Outreach' && (
          <div id="pillar-6" style={{ 
            marginBottom: '2rem', 
            opacity: currentStep >= 6 ? 1 : 0.3,
            pointerEvents: currentStep >= 6 ? 'auto' : 'none',
            filter: currentStep >= 6 ? 'none' : 'grayscale(80%)',
            transition: 'all 0.5s ease',
            animation: 'slideInUp 0.4s ease forwards' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#8b5cf6' }}>
              <CheckCircle2 size={20} />
              <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Pillar 6: The Close & Logistics</h3>
            </div>

            <div className="bubble-row agent">
              <div className="bubble-label">Agent (The Assumptive Close)</div>
              <div className="bubble">
                "Okay perfect, it sounds like we're on the same page. What I'm going to do next is send over our standard, simple 2-page purchase agreement. You can review it, and once you sign it, I'll send it directly to our title company so they can start the process."
              </div>
            </div>

            <div className="bubble-row agent" style={{ marginTop: '2rem' }}>
              <div className="bubble-label">Agent (Logistics Gathering)</div>
              <div className="bubble">
                "Just so I can draft this up correctly, what is the exact legal name on the deed that we should use for the contract? And what's the best email address to send the DocuSign to?"
              </div>
              
              <div style={{ marginTop: '15px', background: 'rgba(139, 92, 246, 0.05)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <input type="text" placeholder="Legal Name(s) for Contract..." className="modern-input" />
                  <input type="email" placeholder="Best Email Address..." className="modern-input" />
                  <input type="text" placeholder="Current Mailing Address (if different)..." className="modern-input" />
                </div>
              </div>
            </div>

            <div className="bubble-row agent" style={{ marginTop: '2rem' }}>
              <div className="bubble-label">Agent (Final Next Steps)</div>
              <div className="bubble">
                "Awesome. I'm typing that up right now and it should hit your inbox in about 5 minutes. I'll shoot you a quick text when I send it. Can you keep an eye out for it and let me know if you have any questions once you look it over?"
              </div>
            </div>
            
            {/* Completion state */}
            <div style={{ marginTop: '3rem', textAlign: 'center', animation: 'fadeIn 1s ease', background: 'var(--spatial-glass)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--spatial-border)' }}>
              <CheckCircle2 size={48} color="var(--accent-primary)" style={{ margin: '0 auto', marginBottom: '10px' }} />
              <h3 style={{ margin: 0, marginBottom: '20px', fontFamily: 'var(--font-walter)' }}>Call Script Completed</h3>
              
              {!showSummaryReview ? (
                <button 
                  onClick={generateSummary} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px', 
                    width: '100%', 
                    padding: '15px', 
                    background: 'var(--accent-primary)', 
                    color: 'white', 
                    fontWeight: 'bold', 
                    borderRadius: '12px', 
                    fontSize: '1.1rem', 
                    cursor: 'pointer', 
                    transition: 'transform 0.2s' 
                  }}
                >
                  <ClipboardCheck size={20} /> Review CRM Summary
                </button>
              ) : (
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Review Data</h4>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-sans)', fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '1.5rem' }}>
                    {formData.notes}
                  </pre>
                  
                  <button 
                    onClick={syncToCRM} 
                    disabled={isSyncing}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      width: '100%', 
                      padding: '15px', 
                      background: isSyncing ? '#475569' : '#10b981', 
                      color: 'white', 
                      fontWeight: 'bold',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      cursor: isSyncing ? 'not-allowed' : 'pointer',
                      transition: 'transform 0.2s'
                    }}
                  >
                  </button>
                  {syncStatus && (
                    <>
                      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: syncStatus.includes('Success') || syncStatus.includes('Simulated') ? '#10b981' : (syncStatus.includes('Failed') ? '#ef4444' : '#cbd5e1'), fontWeight: '600' }}>
                        {syncStatus}
                      </div>
                      {(syncStatus.includes('Success') || syncStatus.includes('Simulated')) && (
                        <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                          <button 
                            onClick={() => setShowTearSheet(true)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '15px', background: 'var(--accent-primary)', border: 'none', color: '#fff', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
                          >
                             <FileText size={18} /> Move to Dispo (Tear-Sheet)
                          </button>
                          <button 
                            onClick={() => onReturn && onReturn({ type: 'success', variablesExtracted: Object.values(dataCompleteness).filter(Boolean).length + 4, details: formData })}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '15px', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', color: 'var(--text-dark)', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s ease' }}
                          >
                             Return to Triage Terminal
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
      </div>

      {/* RIGHT COLUMN: THE CALCULATOR HUD */}
      <div className="calculator-hud" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem', paddingBottom: '150px' }}>
        <RehabCalculator 
          formData={formData} 
          updateForm={updateForm} 
          lead={lead}
        />
        
        <CreativeCalculator 
          formData={formData} 
          updateForm={updateForm} 
        />
        
        <div style={{ position: 'relative', marginTop: '20px' }}>
          <button 
            onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}
            style={{ background: 'var(--bg-card-soft)', color: 'var(--text-soft)', padding: '12px 25px', borderRadius: '100px', border: '1px solid var(--border-subtle)', cursor: 'pointer', outline: 'none', fontSize: '0.9rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <ShieldAlert size={16} />
            DISQUALIFY / STOP
          </button>
          
          {showDisqualifyMenu && (
            <div style={{ position: 'absolute', bottom: 'calc(100% + 15px)', left: '50%', transform: 'translateX(-50%)', background: 'var(--bg-card-soft)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', width: '220px', zIndex: 1001 }}>
              <button className="dropdown-item" onClick={() => onReturn && onReturn({ type: 'stop', droppedAtPillar: currentStep, details: { ...formData, abandonmentPillar: currentStep } })}>Stop / End Call</button>
              <button className="dropdown-item" onClick={() => onReturn && onReturn({ type: 'pull_away', droppedAtPillar: currentStep, details: { ...formData, abandonmentPillar: currentStep } })}>Pull Away (Follow Up)</button>
              <button className="dropdown-item" onClick={() => onReturn && onReturn({ type: 'disqualified', droppedAtPillar: currentStep, reason: 'Not Selling', details: { ...formData, abandonmentPillar: currentStep } })}>Not Selling</button>
              <button className="dropdown-item" onClick={() => onReturn && onReturn({ type: 'disqualified', droppedAtPillar: currentStep, reason: 'DNC', details: { ...formData, abandonmentPillar: currentStep } })}>DNC</button>
              <button className="dropdown-item" onClick={() => onReturn && onReturn({ type: 'disqualified', droppedAtPillar: currentStep, reason: 'Hostile', details: { ...formData, abandonmentPillar: currentStep } })}>Hostile</button>
            </div>
          )}
        </div>
        
        <button 
          onClick={() => {
            if (onReturn) onReturn({ type: 'voicemail', details: formData });
          }}
          style={{ background: 'var(--bg-surface)', color: 'var(--text-dark)', fontWeight: 'bold', padding: '12px 25px', borderRadius: '100px', border: '1px solid var(--border-subtle)', cursor: 'pointer', outline: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', width: '100%', justifyContent: 'center' }}
        >
          <Mic size={16} /> LEFT VOICEMAIL
        </button>
      </div>
      </div>

      {showTearSheet && (
        <TearSheet formData={formData} onClose={() => setShowTearSheet(false)} />
      )}
    </>
  );
}
