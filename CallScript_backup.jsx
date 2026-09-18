'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import useStore from '@/store/useStore';
import { FileText, Ban, ShieldAlert, CheckCircle2, Home, Wrench, Clock, DollarSign, PenTool, Mic, MapPin, Database, ChevronDown, ChevronRight, Calculator, AlertTriangle, HeartHandshake, BrainCircuit, ClipboardCheck } from 'lucide-react';
import clsx from 'clsx';
import TearSheet from './TearSheet';
import CashCalculator from '../calculators/CashCalculator';
import CreativeCalculator from '../calculators/CreativeCalculator';
import RepairsCalculator from '../calculators/RepairsCalculator';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

export default function CallScript({ activeLead, onReturn, onFormUpdate }) {
  const { updateTriageCondition, updatePropertyDetails, updateDisposition, masterLead } = useStore();
  const totalMAO = masterLead?.financialEngine?.mao || 0;
  
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
    publicBeds: '',
    publicBaths: '',
    publicSqft: '',
    lotSize: '',
    sfRoof: '',
    roofAge: '',
    sfHVAC: '',
    hvacAge: '',
    sfPlumbing: '',
    sfElectrical: '',
    sfCosmetics: '',
    sfStructuralFlags: '',
    secondaryLiabilities: [],
    hoaMonthlyFee: '',
    solarMonthlyPayment: '',
    septicSewer: '',
    solarSystem: '',
    majorRedFlags: [],
    propertyType: '',
    mfUnits: '',
    mfUnitsData: [],
    mfBuildingConfig: '',
    mfStructureConsistency: '',
    mfYearBuilt: '',
    mfAduOrigin: '',
    mfAduLegality: '',
    mfAduMetering: '',
    mfUnitCount: '',
    mfOccupancy: '',
    mfTotalRents: '',
    mfLeaseStatus: '',
    mfUtilityMetering: '',
    mfOwnerUtilities: [],
    mfUtilityCost: '',
    mfInteriorCondition: '',
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
    cosmeticsKitchen: [],
    cosmeticsBaths: [],
    tenantStatus: [],
    vacantIssues: [],
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

  // Recovered missing state and derived variables
  const [showSummaryReview, setShowSummaryReview] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [showTearSheet, setShowTearSheet] = useState(false);
  
  const leadName = activeLead?.name || 'the owner';
  const dataCompleteness = formData;

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

  useEffect(() => {
    useStore.getState().setCallScriptUpdateForm(updateForm);
  }, []);
  const handleSingleSelect = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const syncToCRM = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing to CRM...');
    await new Promise(r => setTimeout(r, 1500));
    setSyncStatus('Synced Successfully');
    setIsSyncing(false);
    setTimeout(() => setSyncStatus(''), 3000);
  };

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
          publicBeds: data.data.beds?.toString() || '',
          publicBaths: data.data.baths?.toString() || '',
          publicSqft: data.data.sqft?.toString() || '',
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

  // Sync state to parent so right-hand panels (like TearSheet) update live
  useEffect(() => {
    if (onFormUpdate) {
      onFormUpdate(formData);
    }
  }, [formData, onFormUpdate]);

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
      <div id={`pillar-${number}`} className={clsx("mb-6 transition-all duration-300 ease-in-out border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden comic-glass", isActive ? "transform -skew-x-1 neon-glow-cyan" : isCompleted ? "opacity-90 transform skew-x-1" : "opacity-100")}>
        
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
  const { activeSource } = formData;

  const hasOccupancy = !!formData.occupancy;
  const isTenant = formData.occupancy === 'Tenant Occupied';
  const isVacant = formData.occupancy === 'Vacant';
  const isOwner = formData.occupancy === 'Owner Occupied';
  const isTrust = formData.trustProbate === true;
  const isFreeAndClear = formData.freeAndClear === true;
  const wantsCreative = formData.pitchType === 'creative';

  const hasCondition = formData.roof.length > 0 || formData.plumbing.length > 0 || formData.hvac.length > 0;
  const hasTimeline = !!formData.timeline;
  const hasMotivation = formData.painPoints.length > 0;
  const hasPrice = !!formData.askingPrice || !!formData.refusedPrice;
  
  const currentStep = activePillar;
  const handleProceed = (nextStep) => {
    setActivePillar(nextStep);
    setCompletedPillars(prev => [...new Set([...prev, currentStep])]);
  };

  return (
    <>
      <div className="flex h-[calc(100vh-120px)] gap-6 relative z-10">

      <div className="flex-1 overflow-y-auto px-8 lg:px-12 pb-32 hide-scrollbar mt-6">
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
            <div className="grid grid-cols-4 gap-6 relative z-10">
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
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#FFE600] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Property Type (Public Record)</label>
                <select value={formData.expectedPropertyType || 'standard single-family home'} onChange={e => updateForm('expectedPropertyType', e.target.value)} className="w-full bg-black/60 backdrop-blur-md border-2 border-[#FFE600] p-3 text-white font-bangers text-xl tracking-widest focus:border-[#00E5FF] outline-none cursor-pointer">
                  <option value="standard single-family home">Single Family</option>
                  <option value="multi-unit property">Multi-Family</option>
                  <option value="condo or townhome">Condo/Townhome</option>
                  <option value="mobile home">Mobile Home</option>
                  <option value="parcel of land">Land</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bangers tracking-widest text-[#FFE600] uppercase mb-2 block drop-shadow-[1px_1px_0px_#000]">Estimated ARV (Zillow/Redfin)</label>
                <input type="number" value={formData.arv || ''} onChange={e => updateForm('arv', e.target.value)} placeholder="0" className="w-full bg-black/60 backdrop-blur-md border-2 border-[#FFE600] p-3 text-white font-bangers text-xl tracking-widest focus:border-[#00E5FF] outline-none placeholder-gray-400" />
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
                    ? `"Hey, am I speaking with the trustee for the ${formData.manualName}? My name is Avory, a local investor. I was calling about the property over on ${targetAddress}... have the trustees ever considered selling it?"`
                    : formData.manualEntityType === 'LLC'
                    ? `"Hey, am I speaking with the owner of ${formData.manualName}? My name is Avory, a local investor. I was calling about the property over on ${targetAddress}... have you or your partners ever considered selling it?"`
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
                {['No', 'NotOwner'].includes(formData.introResponse) && (
                  <div className="mt-4 p-4 rounded-xl border-l-4 border-black bg-white text-black text-sm leading-relaxed animate-slideIn">
                    "Ah, my apologies! Sounds like our public records must be outdated. But since I have you on the phone... do you happen to own any other real estate that you'd consider selling, or are you currently renting?"
                  </div>
                )}
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (
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
                              ? `"No worries at all, I completely understand. Usually when we buy properties, the exact number we can offer is going to depend heavily on the condition and layout."`
                              : `"Got it, $${Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice}. For us to see if we can make that number work, it's going to depend heavily on the condition and layout."`
                            }
                          </p>
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
                              ? `"No worries at all, I completely understand. Usually when we buy properties, the exact number we can offer is going to depend heavily on the condition and layout."`
                              : `"Got it, $${Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice}. For us to see if we can make that number work, it's going to depend heavily on the condition and layout."`
                            }
                          </p>
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

            {/* PROGRESSION CTA */}
            <div className="mt-6 pt-4 flex justify-center w-full">
              <button 
                onClick={() => {
                  handleProceed(2);
                  setTimeout(() => {
                    document.getElementById('pillar-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 350);
                }}
                className="w-full max-w-lg py-4 bg-[#00FFFF] text-[#000000] uppercase font-black italic text-2xl tracking-widest border-2 border-[#000000] rounded-none shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                PROCEED TO PILLAR 2 &rarr;
              </button>
            </div>
          </div>
        ))}

        {/* PILLAR 2: PROPERTY DYNAMICS & OCCUPANCY */}
        {renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col mb-2 animate-slideIn">
               <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Property Type)</span>
               <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                 {`"So public records are showing this as a ${formData.expectedPropertyType || 'standard single-family home'}. Is that right${(!formData.expectedPropertyType || formData.expectedPropertyType === 'standard single-family home') ? ', or are we looking at a multi-unit or mobile home?' : '?'}"`}
               </div>
            </div>

            <div className="mb-6">
              <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Select Property Type</label>
              <div className="flex flex-wrap gap-2">
                {['Single Family', 'Multi-Family', 'Condo/Townhome', 'Mobile Home', 'Land'].map(type => (
                  <button key={type} onClick={() => updateForm('propertyType', formData.propertyType === type ? '' : type)} className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.propertyType === type ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{type}</button>
                ))}
              </div>
            </div>

            {formData.propertyType && formData.propertyType !== 'Multi-Family' && formData.propertyType !== 'Land' && (
              <>
                {/* 1. DECISION MAKERS */}
                <div className="flex flex-col mb-2 animate-slideIn">
                   <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Decision Makers)</span>
                   <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                     {`"Perfect. And before we get into the house itself, are you the sole owner on title, or is there a spouse or partner we'd need to loop in eventually?"`}
                   </div>
                </div>

                <div className="mb-6 animate-slideIn">
                  <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Decision Makers</label>
                  <div className="flex flex-wrap gap-2">
                    {['Sole Owner', 'Spouse/Partner', 'Trust/Probate/Multiple'].map(dm => (
                      <button key={dm} onClick={() => updateForm('decisionMakers', formData.decisionMakers === dm ? '' : dm)} className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.decisionMakers === dm ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{dm}</button>
                    ))}
                  </div>
                </div>

                {/* 2. PROPERTY SPECS */}
                {formData.decisionMakers && (
                  <>
                    <div className="flex flex-col mb-2 animate-slideIn">
                       <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Property Specs)</span>
                       <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                         {formData.propertyType === 'Single Family' || formData.propertyType === 'Condo/Townhome' ? (
                           (() => {
                             let intro = "So ";
                             if (formData.decisionMakers === 'Sole Owner') intro = "Perfect, keeps things simple. So ";
                             else if (formData.decisionMakers === 'Spouse/Partner' || formData.decisionMakers === 'Trust/Probate/Multiple') intro = "Got it, so we'll just make sure they're looped in on the numbers when the time comes. So ";
                             
                             return `"${intro}on my end I see that it's a ${formData.publicBeds || '{Beds}'} bed, ${formData.publicBaths || '{Baths}'} bath, right around ${formData.publicSqft ? Number(formData.publicSqft).toLocaleString() : '{SqFt}'} square feet. Have you guys added on to it at all${formData.publicBeds && formData.publicBaths && formData.publicSqft ? ", or is this still the current layout?" : "?"}"`;
                           })()
                         ) : formData.propertyType === 'Mobile Home' ? (
                           `"Is that sitting on its own land that you own, or is it in a park where you're paying lot rent? And what's the bed/bath count on the unit itself?"`
                         ) : ""}
                       </div>
                    </div>

                    <div className="mb-6 animate-slideIn flex flex-col gap-4">
                      <div>
                        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Beds</label>
                        <div className="flex flex-wrap gap-2">
                          {['1 Bed', '2 Beds', '3 Beds', '4 Beds', '5+ Beds'].map(bed => (
                            <button key={bed} onClick={() => updateForm('beds', formData.beds === bed ? '' : bed)} className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.beds === bed ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{bed}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Baths</label>
                        <div className="flex flex-wrap gap-2">
                          {['1 Bath', '1.5 Baths', '2 Baths', '2.5 Baths', '3+ Baths'].map(bath => (
                            <button key={bath} onClick={() => updateForm('baths', formData.baths === bath ? '' : bath)} className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.baths === bath ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{bath}</button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                         <div>
                           <label className="text-xs text-gray-800 uppercase block mb-1 font-bold">Sqft</label>
                           <input type="number" value={formData.sqft} onChange={e => updateForm('sqft', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                         </div>
                         <div>
                           <label className="text-xs text-gray-800 uppercase block mb-1 font-bold">Lot Size (Sqft)</label>
                         <input type="number" value={formData.lotSize} onChange={e => updateForm('lotSize', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                         </div>
                      </div>
                    </div>
                  </>
                )}

                {/* 3. OCCUPANCY */}
                {formData.decisionMakers && (
                  <>
                    <div className="flex flex-col mb-2 animate-slideIn">
                       <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Occupancy)</span>
                       <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                         "Sounds good, now are you currently living in the property right now or is it a rental?"
                       </div>
                    </div>

                    <div className="mb-6 animate-slideIn">
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Occupancy Status</label>
                      <div className="flex flex-wrap gap-2">
                        {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                          <button key={occ} onClick={() => updateForm('occupancy', formData.occupancy === occ ? '' : occ)} className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.occupancy === occ ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{occ}</button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {formData.propertyType === 'Land' && (
              <div className="flex flex-col mb-2 animate-slideIn">
                 <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Land Specs)</span>
                 <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                   "Understood. Do you happen to know the exact acreage or lot size? And are there any existing utilities pulled to the property, like water or power?"
                 </div>
              </div>
            )}

            {/* Property Dynamics Inputs */}
            {formData.propertyType === 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Multi-Family Phase 1 & 2)</div>
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                  {formData.mfBuildingConfig === '' && (
                    <span>"Okay, good to know. Since it is a multi-unit, how many units are we talking, and what does the bed/bath mix look like for each? ... And just so I can accurately picture the lot, is this all one single building, or are there multiple structures on the property?"</span>
                  )}
                  {formData.mfBuildingConfig === '1 Single Building' && formData.mfUnitCount === '' && (
                    <span>"Okay, easy enough. Since it's all under one roof, let's just break down the rent roll real quick so I can run my formulas. How many units total are inside the building?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === '' && (
                    <span>"Got it, detached structures. From an underwriting standpoint, I have to account for multiple roofs and foundations. Were all these buildings built around the same time, or were they added on in different decades?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && formData.mfYearBuilt === '' && (
                    <span>"Got it. From an underwriting standpoint, I just have to account for the roofs and foundations. Since they were all built around the same time, what year were they constructed?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'Different Ages/Styles' && formData.mfUnitCount === '' && (
                    <span>"Got it. Since they were built at different times, let's just make sure we track the age for each one as we go through the layout. Roughly how many units are we talking total across all the buildings?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && formData.mfYearBuilt !== '' && formData.mfUnitCount === '' && (
                    <span>"Makes sense. And how many units are we talking total across all the buildings?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && formData.mfAduOrigin === '' && (
                    <span>"Okay, a house with a separate unit. Before we get into the rents, I need to know how that second unit was set up for city zoning. Was that built from the ground up, or is it a garage or interior conversion?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && formData.mfAduOrigin !== '' && formData.mfAduLegality === '' && (
                    <span>"Got it. And do you know for a fact if the city permits were fully pulled and closed out for that, or was it done under the table?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && formData.mfAduLegality !== '' && formData.mfAduMetering === '' && (
                    <span>"I've got that noted. And for utilities, does the ADU have its own address and meters, or is everything shared with the main house?"</span>
                  )}
                  {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && formData.mfAduMetering !== '' && formData.mfUnitCount !== '' && formData.mfUnitsData.some(u => !u.occupancy || (u.occupancy === 'Tenant Occupied' && (!u.leaseType || !u.paymentStatus || !u.rentAmount))) && (
                    <span>"Perfect. So looking at the Main House first, what is the bed and bath count on that one?"</span>
                  )}

                  {formData.mfBuildingConfig !== 'Main House + ADU/Conversion' && formData.mfUnitCount !== '' && formData.mfUnitsData.some(u => !u.occupancy || (u.occupancy === 'Tenant Occupied' && (!u.leaseType || !u.paymentStatus || !u.rentAmount))) && (
                    <span>"Makes sense. And just for my underwriting, what are the current rents looking like across the board? Let's break it down—for the first unit, what is the current rent, and are they on a month-to-month or a yearly lease?"</span>
                  )}
                  {formData.mfUnitCount !== '' && formData.mfUnitsData.every(u => u.occupancy && (u.occupancy !== 'Tenant Occupied' || (u.leaseType && u.paymentStatus && u.rentAmount))) && (
                    <span>"Perfect. Also, are the tenants paying their own utilities, or are you covering water and power?"</span>
                  )}
                  
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px', borderLeft: '4px solid #3b82f6' }}>
                    
                    <div className="mb-6">
                      <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Building Configuration</div>
                      <div className="flex flex-wrap gap-3">
                        {['1 Single Building', 'Multiple Detached Buildings', 'Main House + ADU/Conversion'].map(config => (
                          <button key={config} 
                            className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfBuildingConfig === config ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
                            onClick={() => {
                              setFormData({...formData, mfBuildingConfig: config, mfStructureConsistency: '', mfYearBuilt: '', mfAduOrigin: '', mfAduLegality: '', mfAduMetering: '', mfUnitCount: '', mfUnitsData: []});
                            }}>
                            {config}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && (
                      <div className="mb-6 animate-slideIn">
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Structure Consistency</div>
                        <div className="flex flex-wrap gap-3">
                          {['All Built Same Year', 'Different Ages/Styles'].map(opt => (
                            <button key={opt} 
                              className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfStructureConsistency === opt ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
                              onClick={() => setFormData({...formData, mfStructureConsistency: opt})}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && (
                      <div className="mb-6 animate-slideIn">
                        <label className="text-sm text-gray-400 uppercase block mb-2 font-bold tracking-widest">Estimated Year Built</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 1985" 
                          value={formData.mfYearBuilt} 
                          onChange={e => updateForm('mfYearBuilt', e.target.value)} 
                          className="w-full bg-black border-2 border-white rounded-lg p-3 text-white focus:border-[#00E5FF] focus:outline-none font-bold placeholder-gray-600" 
                        />
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && (
                      <div className="mb-6 animate-slideIn flex flex-col gap-4">
                        <div>
                          <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">ADU Origin</div>
                          <div className="flex flex-wrap gap-3">
                            {['Ground-Up Build', 'Garage Conversion', 'Interior Split/Cut'].map(opt => (
                              <button key={opt} 
                                className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduOrigin === opt ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
                                onClick={() => setFormData({...formData, mfAduOrigin: opt})}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {formData.mfAduOrigin !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">City Permits / Legality</div>
                            <div className="flex flex-wrap gap-3">
                              {['Fully Permitted', 'Unpermitted / Unknown'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduLegality === opt ? 'bg-[#FF0055] text-white border-[#FF0055] shadow-[2px_2px_0px_#FF0055]' : 'bg-black border-white text-white'}`} 
                                  onClick={() => setFormData({...formData, mfAduLegality: opt})}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.mfAduLegality !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Utility Metering</div>
                            <div className="flex flex-wrap gap-3">
                              {['Own Address & Meters', 'Shared with Main House'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduMetering === opt ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
                                  onClick={() => {
                                    setFormData({...formData, mfAduMetering: opt, mfUnitCount: '2 Units', mfUnitsData: [
                                      {yearBuilt: '', layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''},
                                      {yearBuilt: '', layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''}
                                    ]});
                                  }}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {((formData.mfBuildingConfig === '1 Single Building') || (formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency !== '')) && (
                      <div className="mb-6 animate-slideIn">
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Total Units</div>
                        <div className="flex flex-wrap gap-3">
                          {['2 Units', '3 Units', '4 Units'].map(count => (
                            <button key={count} 
                              className={`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-[4px_4px_0px_#fff] skew-x-[-10deg] hover:-translate-y-1 hover:shadow-[6px_6px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUnitCount === count ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[4px_4px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} 
                              onClick={() => {
                                const numUnits = parseInt(count.charAt(0));
                                setFormData({...formData, mfUnitCount: count, mfUnitsData: Array.from({length: numUnits}, () => ({yearBuilt: '', layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''}))});
                              }}>
                              {count}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.mfUnitsData.length > 0 && (
                      <div className="flex flex-col gap-4 mb-6">
                        {formData.mfUnitsData.map((unit, index) => (
                          <div key={index} className="bg-[#111] border-2 border-[#3b82f6] p-4 rounded-lg shadow-[4px_4px_0px_#000]">
                            <div className="text-[#00E5FF] font-bold uppercase tracking-widest mb-3 border-b border-gray-700 pb-2">
                              {formData.mfBuildingConfig === 'Main House + ADU/Conversion' 
                                ? (index === 0 ? 'MAIN HOUSE' : 'ADU / GUEST HOUSE')
                                : `Unit ${String.fromCharCode(65 + index)}`
                              }
                            </div>
                            
                            {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'Different Ages/Styles' && (
                              <div className="mb-4">
                                <label className="text-xs text-gray-400 uppercase block mb-2 font-bold tracking-widest">Year Built</label>
                                <input 
                                  type="number" 
                                  placeholder="e.g. 1950" 
                                  value={unit.yearBuilt || ''} 
                                  onChange={e => {
                                    const newData = [...formData.mfUnitsData]; newData[index].yearBuilt = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} 
                                  className="w-full bg-black border border-gray-600 rounded-lg p-2 text-white focus:border-[#3b82f6] focus:outline-none font-bold placeholder-gray-600 text-sm" 
                                />
                              </div>
                            )}

                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Layout</div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {['Studio', '1 Bed', '2 Bed', '3+ Bed'].map(bed => (
                                  <button key={bed} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBeds === bed ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBeds = bed; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bed}</button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {['1 Bath', '1.5 Bath', '2+ Bath'].map(bath => (
                                  <button key={bath} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBaths === bath ? 'bg-[#3b82f6] text-white border-[#3b82f6]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBaths = bath; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bath}</button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Condition</div>
                              <div className="flex flex-wrap gap-2">
                                {['Turnkey / Updated', 'Dated / Livable', 'Needs Heavy Rehab'].map(cond => (
                                  <button key={cond} className={`px-3 py-1.5 border font-bold text-xs ${unit.condition === cond ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].condition = cond; setFormData({...formData, mfUnitsData: newData});
                                  }}>{cond}</button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Occupancy Status</div>
                              <div className="flex flex-wrap gap-2">
                                {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                                  <button key={occ} className={`px-3 py-1.5 border font-bold text-xs ${unit.occupancy === occ ? 'bg-[#00E676] text-black border-[#00E676]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; 
                                    newData[index].occupancy = occ; 
                                    if(occ !== 'Tenant Occupied') {
                                      newData[index].leaseType = ''; newData[index].paymentStatus = ''; newData[index].rentAmount = '';
                                    }
                                    setFormData({...formData, mfUnitsData: newData});
                                  }}>{occ}</button>
                                ))}
                              </div>
                            </div>

                            {unit.occupancy === 'Tenant Occupied' && (
                              <div className="mt-4 p-3 bg-black border border-gray-800 rounded flex flex-col gap-3">
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Current Rent $</div>
                                  <input type="number" placeholder="e.g. 1500" value={unit.rentAmount} onChange={(e) => {
                                    const newData = [...formData.mfUnitsData]; newData[index].rentAmount = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} className="w-full p-2 bg-[#222] text-white border border-gray-600 font-bold text-sm focus:outline-none focus:border-[#FF0055] transition-all" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Lease Type</div>
                                  <div className="flex gap-2">
                                    {['MTM', 'Annual'].map(lt => (
                                      <button key={lt} className={`flex-1 py-1.5 border font-bold text-xs ${unit.leaseType === lt ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                        const newData = [...formData.mfUnitsData]; newData[index].leaseType = lt; setFormData({...formData, mfUnitsData: newData});
                                      }}>{lt}</button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Payment Status</div>
                                  <div className="flex gap-2">
                                    {['On Time', 'Behind'].map(ps => (
                                      <button key={ps} className={`flex-1 py-1.5 border font-bold text-xs ${unit.paymentStatus === ps ? 'bg-[#FF0055] text-white border-[#FF0055]' : 'bg-transparent text-gray-400 border-gray-600'} transition-all`} onClick={() => {
                                        const newData = [...formData.mfUnitsData]; newData[index].paymentStatus = ps; setFormData({...formData, mfUnitsData: newData});
                                      }}>{ps}</button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>
                        ))}
                      </div>
                    )}

                    {formData.mfUnitsData.length > 0 && formData.mfUnitsData.every(u => u.occupancy && (u.occupancy !== 'Tenant Occupied' || (u.leaseType && u.paymentStatus && u.rentAmount))) && (
                      <div className="mt-4 border-t border-gray-700 pt-4">
                        <div className="text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Utility Metering</div>
                        <div className="flex flex-col gap-4 mb-4">
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUtilityMetering === 'Separately Metered (Tenant Pays All)' ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[2px_2px_0px_#00E5FF]' : 'bg-black border-white text-white'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Separately Metered (Tenant Pays All)', mfOwnerUtilities: [], mfUtilityCost: ''})}>Tenants Pay All</button>
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUtilityMetering === 'Landlord Pays Some/All' ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-black border-white text-white'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Landlord Pays Some/All'})}>Landlord Pays Some/All</button>
                        </div>
                        
                        {formData.mfUtilityMetering === 'Landlord Pays Some/All' && (
                          <div className="mt-4 p-4 bg-black border border-gray-800 rounded-lg">
                            <div className="text-xs text-gray-400 mb-2 uppercase tracking-widest font-bold">Which Utilities?</div>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {['Water', 'Sewer', 'Trash', 'Gas', 'Electric', 'Landscaping'].map(util => (
                                <button key={util} 
                                  className={`px-4 py-1.5 border font-bold text-xs shadow-[2px_2px_0px_#fff] skew-x-[-5deg] ${formData.mfOwnerUtilities.includes(util) ? 'bg-[#FFE600] text-black border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-black border-gray-600 text-gray-300'} transition-all`} 
                                  onClick={() => {
                                    let newUtils = [...formData.mfOwnerUtilities];
                                    if (newUtils.includes(util)) {
                                      newUtils = newUtils.filter(u => u !== util);
                                    } else {
                                      newUtils.push(util);
                                    }
                                    setFormData({...formData, mfOwnerUtilities: newUtils});
                                  }}>
                                  {util}
                                </button>
                              ))}
                            </div>
                            <div>
                              <div className="text-[10px] text-gray-500 mb-1 uppercase tracking-widest font-bold">Est. Monthly Utility Cost $</div>
                              <input type="number" placeholder="e.g. 350" value={formData.mfUtilityCost} onChange={(e) => setFormData({...formData, mfUtilityCost: e.target.value})} className="w-full p-3 bg-[#222] text-white border-2 border-gray-600 font-bold text-sm focus:outline-none focus:border-[#FFE600] transition-all skew-x-[-2deg]" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
                  <button className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.mh55Plus ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")} onClick={() => updateForm('mh55Plus', !formData.mh55Plus)}>55+ Community</button>
                  <button className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.mh433A ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")} onClick={() => updateForm('mh433A', !formData.mh433A)}>433A (Perm Foundation)</button>
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
                      <button key={util} className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", isSelected ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")} onClick={() => {
                        const current = formData.landUtilities || [];
                        updateForm('landUtilities', isSelected ? current.filter(u => u !== util) : [...current, util]);
                      }}>{util}</button>
                    )

                  })}
                </div>
                <div className="flex gap-2">
                  <button className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.landPaved === true ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")} onClick={() => handleSingleSelect('landPaved', true)}>Paved Access</button>
                  <button className={clsx("px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.landPaved === false ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")} onClick={() => handleSingleSelect('landPaved', false)}>Dirt Road Access</button>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up: Tenant */}
            {isTenant && formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Tenant Follow-up)</span>
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                  "And are they currently paying on time? What are they paying in rent right now, and are they on a month-to-month or long-term lease?"
                </div>
                  
                <div className="bg-white border-4 border-black box-border shadow-[8px_8px_0px_#FF00FF] p-6 mb-6 rounded-none mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <input type="text" placeholder="RENT AMOUNT ($)..." value={formData.rentAmount || ''} onChange={(e) => updateForm('rentAmount', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                    <input type="text" placeholder="HOW DO THEY PAY? (ZELLE, CASH)..." value={formData.rentMethod || ''} onChange={(e) => updateForm('rentMethod', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2">
                      <button className={"px-4 py-3 transition-all " + (formData.leaseType === 'M2M' ? "bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} onClick={() => updateForm('leaseType', formData.leaseType === 'M2M' ? '' : 'M2M')}>MONTH-TO-MONTH</button>
                      <button className={"px-4 py-3 transition-all " + (formData.leaseType === 'Lease' ? "bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} onClick={() => updateForm('leaseType', formData.leaseType === 'Lease' ? '' : 'Lease')}>FIXED LEASE</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Paying on Time') ? "bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} 
                        onClick={() => {
                          const current = formData.tenantStatus || [];
                          updateForm('tenantStatus', current.includes('Paying on Time') ? current.filter(x => x !== 'Paying on Time') : [...current, 'Paying on Time']);
                        }}
                      >
                        PAYING ON TIME
                      </button>
                      <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Someone is Behind') ? "bg-[#00FFFF] border-4 border-black rounded-none text-black font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} 
                        onClick={() => {
                          const current = formData.tenantStatus || [];
                          updateForm('tenantStatus', current.includes('Someone is Behind') ? current.filter(x => x !== 'Someone is Behind') : [...current, 'Someone is Behind']);
                        }}
                      >
                        BEHIND ON RENT
                      </button>
                    </div>
                  </div>
                  
                  {(formData.tenantStatus?.includes('Someone is Behind') || formData.tenantStatus?.includes('Eviction Needed')) && (
                    <div className="border-t-4 border-black pt-4 mt-6">
                       <label className="text-black uppercase font-black block mb-2">IF BEHIND ON RENT:</label>
                       <div className="flex flex-wrap gap-4 items-center">
                         <input type="text" placeholder="AMOUNT BEHIND ($)..." value={formData.rentArrears || ''} onChange={(e) => updateForm('rentArrears', e.target.value)} className="bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all w-48" />
                         <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Eviction Needed') ? "bg-[#FF1111] border-4 border-black rounded-none text-white font-black italic shadow-[4px_4px_0px_#000]" : "bg-white border-2 border-black rounded-none text-black font-bold uppercase")} 
                           onClick={() => {
                             const current = formData.tenantStatus || [];
                             updateForm('tenantStatus', current.includes('Eviction Needed') ? current.filter(x => x !== 'Eviction Needed') : [...current, 'Eviction Needed']);
                           }}
                         >
                           EVICTION NEEDED
                         </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            )}


            {/* Dynamic Follow-up: Vacant */}
            {isVacant && formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Vacant Follow-up)</span>
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
                  "Okay, since it's vacant, how long has it been sitting empty? Have you had any issues with squatters or break-ins that we should know about?"
                </div>
                  
                <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <input type="text" placeholder="How long vacant? (e.g., 6 months)..." value={formData.vacantLength} onChange={(e) => setFormData({...formData, vacantLength: e.target.value})} className="modern-input" style={{ width: '100%', marginBottom: '10px' }} />
                  <div className="toggles-row">
                    <button className={`toggle-pill ${formData.vacantIssues.includes('Boarded Up') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Boarded Up')}>Boarded Up</button>
                    <button className={`toggle-pill ${formData.vacantIssues.includes('Squatters') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Squatters')}>Squatters</button>
                    <button className={`toggle-pill ${formData.vacantIssues.includes('Vandalism') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Vandalism')}>Vandalized</button>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up: Trust/Probate */}
            {isTrust && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Trust/Probate Follow-up)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
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
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Man, I don't blame you for wanting to wash your hands of that. Evictions are a nightmare. Since we'd be inheriting that headache... what kind of condition are they leaving the place in?"
  </div>
</div>
            )}
            
            {isTenant && formData.tenantStatus.includes('Paying on Time') && formData.leaseType === 'M2M' && !formData.tenantStatus.includes('Eviction Needed') && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Okay, month-to-month and paying on time. We could probably just inherit them as tenants. With that in mind, what's the actual condition of the property?"
  </div>
</div>
            )}

            {isVacant && formData.propertyType !== 'Multi-Family' && (formData.vacantIssues.includes('Squatters') || formData.vacantIssues.includes('Boarded Up') || formData.vacantIssues.includes('Vandalism')) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Wow, sorry you're dealing with that. We buy properties with those issues all the time so we can definitely take that burden off your hands. Since we can't always get inside right away, what do you remember about the major stuff?"
  </div>
</div>
            )}

            {/* Core Condition Questions */}
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant && formData.tenantStatus.length > 0) || (isVacant && formData.vacantIssues.length > 0)) ? '1.5rem' : '2.5rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Roof & AC)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] rounded-none mb-8">
    
    <div className="text-xl font-black italic text-black leading-relaxed mb-6">
      "Got it. Now, to make sure my repair estimates are dead accurate, I always start with the heavy-ticket items. Let's start with the roof—roughly how many years old is it, and is it holding up alright or needing some major patchwork?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-8">
        <div className="mb-4">
          <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Roof Age</label>
          <div className="flex flex-wrap gap-2">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years'].map(age => (
              <button key={age} onClick={() => updateForm('roofAge', formData.roofAge === age ? '' : age)} className={clsx("px-4 py-2 border-2 border-black text-xs font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.roofAge === age ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{age}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Roof Condition</label>
          <div className="flex flex-wrap gap-2">
            {[{label: 'Roof: Good ($0/sqft)', mult: 0}, {label: 'Roof: Needs Overlay ($4/sqft)', mult: 4}, {label: 'Roof: Full Tear-Off ($8/sqft)', mult: 8}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfRoof === opt.label) { updateForm('sfRoof', ''); updateForm('roofMult', 0); } else { updateForm('sfRoof', opt.label); updateForm('roofMult', opt.mult); } }} className={clsx("px-4 py-2 border-2 border-black text-xs font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.sfRoof === opt.label ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    )}

    <div className="mt-8 pt-6 border-t-2 border-gray-300 text-xl font-black italic text-black leading-relaxed mb-6">
      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <div className="mb-4">
          <label className="text-xs text-gray-800 uppercase font-bold block mb-2">HVAC Age</label>
          <div className="flex flex-wrap gap-2">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years'].map(age => (
              <button key={age} onClick={() => updateForm('hvacAge', formData.hvacAge === age ? '' : age)} className={clsx("px-4 py-2 border-2 border-black text-xs font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.hvacAge === age ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{age}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-800 uppercase font-bold block mb-2">HVAC Status</label>
          <div className="flex flex-wrap gap-2">
            {[{label: 'AC: Good ($0/sqft)', mult: 0}, {label: 'AC: Unit Only ($3/sqft)', mult: 3}, {label: 'AC: Full System + Ducts ($7/sqft)', mult: 7}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfHVAC === opt.label) { updateForm('sfHVAC', ''); updateForm('hvacMult', 0); } else { updateForm('sfHVAC', opt.label); updateForm('hvacMult', opt.mult); } }} className={clsx("px-4 py-2 border-2 border-black text-xs font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.sfHVAC === opt.label ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    )}

  </div>
</div>
            
            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 1 */}
            {showedRoofHVACReaction && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Reaction)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Got it. Don't worry too much about that, we deal with replacing those all the time."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Plumbing & Electrical)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00FF00] rounded-none mb-8">
    <div className="text-black font-black italic text-lg mb-4">
      "Moving down to the guts of the house... do you know roughly how old the plumbing system is? Have you ever had to do a full repipe, or are you still on the original lines?"
    </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6">
        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Plumbing Age</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('plumbingAge', formData.plumbingAge === opt ? '' : opt)} className={clsx("px-4 py-2 transition-all", formData.plumbingAge === opt ? "bg-[#00FFFF] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}>{opt}</button>
          ))}
        </div>

        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Plumbing Condition</label>
        <div className="flex flex-wrap gap-2">
          {[{label: 'Copper/PEX ($0/sqft)', mult: 0}, {label: 'Minor Leaks / Patch ($2/sqft)', mult: 2}, {label: 'Needs Full Repipe ($5/sqft)', mult: 5}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfPlumbing === opt.label) { updateForm('sfPlumbing', ''); updateForm('plumbingMult', 0); } else { updateForm('sfPlumbing', opt.label); updateForm('plumbingMult', opt.mult); } }} className={clsx("px-4 py-2 transition-all", formData.sfPlumbing === opt.label ? "bg-[#00FFFF] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}>{opt.label}</button>
          ))}
        </div>

        <div className="text-black font-bold italic text-md mt-6 mb-2">
          "Got it. And just quickly while we're talking about the plumbing, do you happen to know if the water heater is relatively new, or is it getting up there in age?"
        </div>
        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Water Heater</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {[{label: '0-5 YEARS / GOOD ($0)', flatAdd: 0}, {label: '5-10 YEARS / AGING ($1,000)', flatAdd: 1000}, {label: '10+ YEARS / DEAD ($2,000)', flatAdd: 2000}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfWaterHeater === opt.label) { updateForm('sfWaterHeater', ''); updateForm('waterHeaterMult', 0); } else { updateForm('sfWaterHeater', opt.label); updateForm('waterHeaterMult', opt.flatAdd); } }} className={clsx("px-4 py-2 transition-all", formData.sfWaterHeater === opt.label ? "bg-[#00FFFF] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}

    <div className="border-t-2 border-gray-300 pt-6 mt-6">
      <div className="text-black font-black italic text-lg mb-4">
        "Got it. And what about the electrical system? About how many years ago was the panel or wiring updated, or is that still original too?"
      </div>
    </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Electrical Age</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('electricalAge', formData.electricalAge === opt ? '' : opt)} className={clsx("px-4 py-2 transition-all", formData.electricalAge === opt ? "bg-[#00FFFF] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}>{opt}</button>
          ))}
        </div>

        <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Electrical Condition</label>
        <div className="flex flex-wrap gap-2">
          {[{label: 'Updated System ($0/sqft)', mult: 0}, {label: 'Panel Upgrade Needed ($2/sqft)', mult: 2}, {label: 'Needs Full Rewire ($4/sqft)', mult: 4}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfElectrical === opt.label) { updateForm('sfElectrical', ''); updateForm('electricalMult', 0); } else { updateForm('sfElectrical', opt.label); updateForm('electricalMult', opt.mult); } }} className={clsx("px-4 py-2 transition-all", formData.sfElectrical === opt.label ? "bg-[#00FFFF] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}
  </div>
</div>

            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 2 */}
            {showedPlumbingReaction && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Reaction)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Okay, yeah, we usually end up having to repipe and rewire those older setups anyway, so that's not a deal breaker."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Utilities & Exterior)</span>
              <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFFF00] rounded-none mb-8">
                
                <div className="text-black font-black italic text-lg mb-4">
                  "Got it. And just to check on the exterior infrastructure... is the property tied into city sewer, or do you guys have a private septic tank?"
                </div>
              
                <div className="mb-6">
                  <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Sewer / Septic</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['City Sewer', 'Septic System'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('septicSewer', formData.septicSewer === opt ? '' : opt)} 
                        className={clsx("px-4 py-2 transition-all", formData.septicSewer === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {formData.septicSewer === 'Septic System' && (
                    <div className="mt-4 mb-4">
                      <div className="text-black font-bold italic text-md mt-4 mb-2">
                        "And do you know roughly when the last time it was pumped or inspected was?"
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Recently Pumped', 'Aging (5+ Years)', 'Unknown / Never Pumped'].map(opt => (
                          <button key={opt} onClick={() => updateForm('septicCondition', formData.septicCondition === opt ? '' : opt)} className={clsx("px-4 py-2 transition-all", formData.septicCondition === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-gray-300 pt-6 mt-6">
                    <div className="text-black font-black italic text-lg mb-4">
                      "Okay, noted. And looking up at the roof, do you have any solar panels up there, or is it completely clear?"
                    </div>
                  </div>

                  <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Solar panels</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['No Solar', 'Solar (Owned)', 'Solar (Leased)'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('solarSystem', formData.solarSystem === opt ? '' : opt)} 
                        className={clsx("px-4 py-2 transition-all", formData.solarSystem === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {(formData.solarSystem === 'Solar (Leased)' || formData.solarSystem === 'Solar (Owned)') && (
                    <div className="mb-4">
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Solar Age</label>
                      <div className="flex flex-wrap gap-2">
                        {['Brand New (0-5 Yrs)', 'Mid-Life (5-15 Yrs)', 'Older (15+ Yrs)'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAge', formData.solarAge === opt ? '' : opt)} className={clsx("px-4 py-2 transition-all", formData.solarAge === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.solarSystem === 'Solar (Leased)' && (
                    <div className="mt-4">
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Solar Lease Details</label>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <input type="text" value={formData.solarCompany || ''} onChange={(e) => updateForm('solarCompany', e.target.value)} placeholder="SOLAR COMPANY NAME" className="bg-gray-100 border-2 border-black p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2 sm:col-span-1" />
                        <input type="text" value={formData.solarMonthlyPayment || ''} onChange={(e) => updateForm('solarMonthlyPayment', e.target.value.replace(/[^0-9]/g, ''))} placeholder="MONTHLY PAYMENT $" className="bg-gray-100 border-2 border-black p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2 sm:col-span-1" />
                        <input type="text" value={formData.solarPayoffAmount || ''} onChange={(e) => updateForm('solarPayoffAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="TOTAL PAYOFF BALANCE $" className="bg-gray-100 border-2 border-black p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2" />
                      </div>

                      <div className="text-black font-bold italic text-sm mt-4 mb-2">
                        "Is the lease assumable by a new buyer?"
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Yes (Assumable)', 'No (Must Payoff)', 'Unknown'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAssumable', formData.solarAssumable === opt ? '' : opt)} className={clsx("px-4 py-2 transition-all", formData.solarAssumable === opt ? "bg-[#FFFF00] text-black border-4 border-black font-black italic uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-none text-xs" : "bg-white text-black border-2 border-black font-bold uppercase text-xs")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Cosmetics & Inside)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    {formData.propertyType === 'Multi-Family' ? 
                  "Got it. And as far as the inside of the units go... are the kitchens and bathrooms fairly modern across the board, or are they a bit more dated and in need of some work?" :
                 formData.cosmeticsKitchen.length > 0 && formData.cosmeticsBaths.length > 0 ? "You already gave me a good idea of the kitchen and bath conditions..." :
                 showedPlumbingReaction
                  ? "Okay. As far as the inside goes, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                  : "So it sounds like the major systems are pretty clear... as far as the inside goes, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                }
  </div>
  
  {formData.propertyType !== 'Multi-Family' && (
    <div className="mb-6 animate-slideIn">
      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Interior Condition</label>
      <div className="flex flex-wrap gap-2">
        {[{label: 'Turnkey / Clean ($5/sqft)', mult: 5}, {label: 'Dated / Livable ($20/sqft)', mult: 20}, {label: 'Needs Heavy Rehab ($45/sqft)', mult: 45}].map(opt => (
          <button key={opt.label} onClick={() => { updateForm('sfCosmetics', opt.label); updateForm('cosmeticMult', opt.mult); }} className={clsx("px-4 py-2 border-2 border-black text-xs font-bangers tracking-widest uppercase transition-all transform -skew-x-12", formData.sfCosmetics === opt.label ? "bg-[#00E5FF] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>{opt.label}</button>
        ))}
      </div>
    </div>
  )}
</div>

            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 3 */}
            {(formData.cosmeticsKitchen.includes('Full Gut Needed') || formData.cosmeticsBaths.includes('Full Gut Needed')) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Reaction)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    "Gotcha. Sounds like it needs some pretty heavy cosmetic love. That's right up our alley."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Structure & Risk)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00E5FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
    {formData.highRisk.length > 0 ? "And you mentioned earlier the structural situation, which I have noted..." :
                 formData.propertyType === 'Multi-Family' ? "Makes sense. Before we move on from the property itself, are there any red flags I'd need to know about? Like foundation settling or unpermitted additions?" :
                 "Makes sense. Before we move on from the property itself, any red flags we'd need to know about? Like foundation settling or unpermitted additions?"}
  </div>

  {formData.propertyType !== 'Multi-Family' && (
    <div className="mb-6 animate-slideIn">
      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Structural Red Flags / Unpermitted Work</label>
      
              <div className="mb-6">
                <label className="text-xs text-black uppercase font-black block mb-2">MAJOR RED FLAGS (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {['Foundation / Structural Issues', 'Unpermitted Additions / ADU', 'Mold / Fire / Water Damage', 'City Code Violations / Red Tags', 'Known Liens / Judgments'].map(flag => {
                    const isSelected = formData.majorRedFlags?.includes(flag);
                    return (
                      <button 
                        key={flag}
                        onClick={() => {
                          const current = formData.majorRedFlags || [];
                          updateForm('majorRedFlags', isSelected ? current.filter(f => f !== flag) : [...current, flag]);
                        }} 
                        className={"px-4 py-3 text-xs tracking-wide uppercase transition-all " + (isSelected ? "bg-[#FF1111] text-white font-black italic border-4 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]" : "bg-white text-black font-bold border-2 border-black")}
                      >
                        {flag}
                      </button>
                    )
                  })}
                </div>
                {formData.majorRedFlags && formData.majorRedFlags.length > 0 && (
                  <div className="flex flex-col mt-4">
                    <label className="text-xs text-[#FF1111] uppercase font-black block mb-1">Red Flag Details & Explanations...</label>
                    <input type="text" value={formData.sfStructuralFlags || ''} onChange={(e) => updateForm('sfStructuralFlags', e.target.value)} placeholder="Provide details on selected red flags..." className="w-full bg-red-50 border-2 border-[#FF1111] rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#FF1111] transition-all" />
                  </div>
                )}
              </div>

    </div>
  )}
</div>

            {/* Toggles moved to sidebar */}

            {formData.highRisk.includes('Fire/Water Damage') && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease forwards' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Fire Damage Follow-up)</span>
  <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF0055] text-xl font-black italic text-black leading-relaxed rounded-none mb-8">
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

            {formData.propertyType !== 'Multi-Family' && (
              <div className="mb-6 animate-slideIn" style={{ marginTop: '2rem' }}>
                <label className="text-sm text-gray-800 uppercase font-bold block mb-3 border-b-2 border-black pb-1">Secondary Liabilities</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Active HOA', 'Pool'].map(liability => {
                    const isSelected = formData.secondaryLiabilities?.includes(liability);
                    return (
                      <button key={liability} onClick={() => {
                        const current = formData.secondaryLiabilities || [];
                        updateForm('secondaryLiabilities', isSelected ? current.filter(l => l !== liability) : [...current, liability]);
                      }} className={clsx("px-5 py-2 border-2 border-black text-sm font-bangers tracking-widest uppercase transition-all shadow-[4px_4px_0px_#000] transform -skew-x-12", isSelected ? "bg-[#FF0055] text-white border-black transform -skew-x-2" : "bg-white text-black border-black hover:bg-gray-100")}>{liability}</button>
                    )
                  })}
                </div>
                
                {formData.secondaryLiabilities?.includes('Active HOA') && (
                  <div className="mb-4 animate-slideIn">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">HOA Monthly Fee $</label>
                    <input type="number" placeholder="e.g. 250" value={formData.hoaMonthlyFee} onChange={e => updateForm('hoaMonthlyFee', e.target.value)} className="w-full sm:w-1/2 bg-white border border-black rounded-lg p-3 text-black focus:border-black outline-none font-bold" />
                  </div>
                )}
                
                {formData.secondaryLiabilities?.includes('Solar (Leased)') && (
                  <div className="flex flex-col mt-4 gap-4 mb-4 animate-slideIn">
                    <div>
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Solar Monthly Payment $</label>
                      <input type="text" value={formData.solarMonthlyPayment || ''} onChange={(e) => updateForm('solarMonthlyPayment', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full max-w-sm bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Payoff Amount $</label>
                      <input type="text" value={formData.solarPayoffAmount || ''} onChange={(e) => updateForm('solarPayoffAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full max-w-sm bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Assumable?</label>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => updateForm('solarAssumable', formData.solarAssumable === 'Assumable' ? '' : 'Assumable')} className={"px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12 " + (formData.solarAssumable === 'Assumable' ? "bg-[#FFE600] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>
                          ASSUMABLE
                        </button>
                        <button onClick={() => updateForm('solarAssumable', formData.solarAssumable === 'Not Assumable' ? '' : 'Not Assumable')} className={"px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12 " + (formData.solarAssumable === 'Not Assumable' ? "bg-[#FFE600] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1")}>
                          NOT ASSUMABLE
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <button className="next-step-btn" onClick={() => handleProceed(3)}>
                 Proceed to Motivation & Timeline <ChevronRight size={18} />
              </button>
            )}
          </div>
        ))}

        {/* PILLAR 3: ESCROW TIMELINE & LOGISTICS */}
        {activeSource !== 'Agent Outreach' && renderPillar(3, "Escrow Timeline & Logistics", <Clock size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col mb-2 animate-slideIn">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Timeline / Relocation)</span>
              <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFFF00] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                "Okay, I've got enough here on the condition. Let's just say we do agree on a price that makes sense... our average close time is about 30 to 40 days on average, how does that work for you? What are your guys' relocation plans looking like? Did you have somewhere to go, or is that something you guys have to figure out?"
              </div>
              
              <div className="mb-6">
                <label className="text-xs text-gray-800 uppercase font-bold block mb-2">Target Timeline</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['ASAP (7-14 Days)', 'Standard (30 Days)', 'Needs Time (60+ Days)', 'Concurrent Close'].map(opt => (
                    <button 
                      key={opt}
                      onClick={() => updateForm('timelineType', opt)} 
                      className={clsx(
                        "px-5 py-2 text-sm font-bangers tracking-widest uppercase transition-all transform -skew-x-12", 
                        formData.timelineType === opt 
                          ? "bg-[#FFFF00] text-black border-4 border-black transform -skew-x-2 shadow-[4px_4px_0px_#000] font-black italic" 
                          : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Target Close Date</label>
                    <input type="date" value={formData.targetCloseDate || ''} onChange={(e) => updateForm('targetCloseDate', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  
                  {formData.timelineType === 'Concurrent Close' && (
                     <div className="flex flex-col">
                       <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Concurrent Details</label>
                       <input type="text" placeholder="Concurrent Escrow details..." value={formData.timelineDetails || ''} onChange={(e) => updateForm('timelineDetails', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                     </div>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Relocation Plans</label>
                  <textarea placeholder="Where are they moving? How are they funding it?..." value={formData.relocationPlans || ''} onChange={(e) => updateForm('relocationPlans', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all min-h-[80px] resize-y" />
                </div>
              </div>
            </div>

            {/* PROGRESSION CTA */}
            <div className="mt-6 pt-4 flex justify-center w-full">
              <button 
                onClick={() => {
                  handleProceed(4);
                  setTimeout(() => {
                    document.getElementById('pillar-4')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 350);
                }}
                className="w-full max-w-lg py-4 bg-[#FFFF00] text-[#000000] uppercase font-black italic text-2xl tracking-widest border-2 border-[#000000] rounded-none shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                PROCEED TO PILLAR 4 &rarr;
              </button>
            </div>
          </div>
        ))}

        {/* PILLAR 4: FINANCIALS & DEBT */}
        {activeSource !== 'Agent Outreach' && renderPillar(4, "Financials & Debt", <DollarSign size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col mb-2 animate-slideIn">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition to Financials)</span>
              <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00FF00] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                {formData.askingPrice 
                  ? `"Got it, that timeline definitely sounds workable for us. Now, circling back to that $${Number(formData.askingPrice.toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice} number you mentioned earlier... for us to actually make that work and give you that certainty, we cover all the title and escrow fees so whatever number we agree on is exactly what you walk away with cleanly. But just so I can do the exact math... is the property owned free and clear, or is there an existing mortgage or any liens that need to be paid off at closing?"`
                  : `"Got it, that timeline definitely sounds workable for us. Now, if we can make the numbers work and give you that certainty, we cover all the title and escrow fees, so whatever number we end up at is exactly what you walk away with cleanly. Just so I can do the exact math... is the property owned free and clear, or is there an existing mortgage or any liens that need to be paid off at closing?"`
                }
              </div>
            </div>

            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button 
                  onClick={() => updateForm('freeAndClear', true)}
                  className={clsx(
                    "flex-1 px-5 py-4 text-sm font-bangers tracking-widest uppercase transition-all transform", 
                    formData.freeAndClear === true 
                      ? "bg-[#00FF00] text-black border-4 border-black shadow-[4px_4px_0px_#000] font-black italic" 
                      : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1"
                  )}
                >
                  Property is Free & Clear
                </button>
                <button 
                  onClick={() => updateForm('freeAndClear', false)}
                  className={clsx(
                    "flex-1 px-5 py-4 text-sm font-bangers tracking-widest uppercase transition-all transform", 
                    formData.freeAndClear === false 
                      ? "bg-[#FF1111] text-white border-4 border-black shadow-[4px_4px_0px_#000] font-black italic" 
                      : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1"
                  )}
                >
                  Has Existing Mortgage / Liens
                </button>
              </div>

              {formData.freeAndClear === false && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slideIn">
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">1st Mortgage Balance $</label>
                    <input type="text" value={formData.mortgageBalance || ''} onChange={(e) => updateForm('mortgageBalance', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">2nd Position / HELOC $</label>
                    <input type="text" value={formData.secondPosition || ''} onChange={(e) => updateForm('secondPosition', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-800 uppercase font-bold block mb-1">Additional Liens $</label>
                    <input type="text" value={formData.thirdPosition || ''} onChange={(e) => updateForm('thirdPosition', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-gray-100 border-2 border-black rounded-none p-3 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs text-[#FF1111] uppercase font-black block mb-1">Arrears / Behind Amount $</label>
                    <input type="text" value={formData.arrearsAmount || ''} onChange={(e) => updateForm('arrearsAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-red-100 border-2 border-[#FF1111] rounded-none p-3 text-black uppercase font-black placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#FF1111] transition-all" />
                  </div>
                </div>
              )}
              
              <div className="mt-8 text-center border-t-4 border-black pt-6">
                <span className="uppercase font-black text-sm text-gray-500 block mb-1">Total Est. Debt</span>
                <span className="text-[#FF1111] font-black text-5xl tracking-tighter drop-shadow-md">
                  ${( () => {
                    if (formData.freeAndClear) return '0';
                    const m1 = parseInt(formData.mortgageBalance || 0, 10);
                    const m2 = parseInt(formData.secondPosition || 0, 10);
                    const m3 = parseInt(formData.thirdPosition || 0, 10);
                    const arr = parseInt(formData.arrearsAmount || 0, 10);
                    return (m1 + m2 + m3 + arr).toLocaleString();
                  })() }
                </span>
              </div>
            </div>

            {/* PROGRESSION CTA */}
            <div className="mt-6 pt-4 flex justify-center w-full">
              <button 
                onClick={() => {
                  handleProceed(5);
                  setTimeout(() => {
                    document.getElementById('pillar-5')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }, 350);
                }}
                className="w-full max-w-lg py-4 bg-[#00FF00] text-[#000000] uppercase font-black italic text-2xl tracking-widest border-2 border-[#000000] rounded-none shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
              >
                PROCEED TO PILLAR 5 &rarr;
              </button>
            </div>
          </div>
        ))}

        {/* PILLAR 5: THE OFFER PIVOT */}
        {activeSource !== 'Agent Outreach' && renderPillar(5, "The Offer (Pivot)", <HeartHandshake size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
               <button 
                 className={clsx(
                   "flex-1 p-6 text-xl font-bangers tracking-widest uppercase transition-all transform", 
                   formData.pitchType === 'cash' 
                     ? "bg-[#00FF00] text-black border-4 border-black shadow-[8px_8px_0px_#000] font-black italic -skew-x-2" 
                     : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1 -skew-x-12"
                 )}
                 onClick={() => updateForm('pitchType', 'cash')}
               >
                 CASH OFFER PITCH
               </button>
               <button 
                 className={clsx(
                   "flex-1 p-6 text-xl font-bangers tracking-widest uppercase transition-all transform", 
                   formData.pitchType === 'creative' 
                     ? "bg-[#FF00FF] text-white border-4 border-black shadow-[8px_8px_0px_#000] font-black italic -skew-x-2" 
                     : "bg-white text-black border-2 border-black shadow-none hover:-translate-y-1 -skew-x-12"
                 )}
                 onClick={() => updateForm('pitchType', 'creative')}
               >
                 CREATIVE / SUB-TO PITCH
               </button>
            </div>

            {formData.pitchType === 'creative' ? (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Creative Pivot)</span>
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF00FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                  "Okay, so based on the math, a cash offer is going to be too low for you. BUT, if you're willing to be a little flexible on terms, I can get you much closer to your retail asking price. If we agree on your price, would you be open to letting us take over the existing mortgage payments and paying you out your equity?"
                </div>
              </div>
            ) : (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Voss No-Oriented Question)</span>
                <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF00FF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                  "Okay, I've got my underwriters looking at it. Since we're paying cash, buying it completely as-is, and covering all of your closing costs... we're coming in right around <span className="text-[#00FF00] font-black bg-black px-2 mx-1 border-2 border-black shadow-[2px_2px_0px_#00FF00] transform inline-block skew-x-[-5deg]">${(totalMAO || 0).toLocaleString()}</span>. Would it be a ridiculous idea to consider an offer in that ballpark?"
                </div>
              </div>
            )}
            
            {/* Offer Rebuttals */}
            <div className="mt-8 border-t-4 border-black pt-6">
               <div className="text-black font-black uppercase text-sm mb-4">Offer Rebuttals (Click for rebuttal)</div>
               <div className="flex flex-wrap gap-2 mb-6">
                 <button className={clsx("px-4 py-2 font-black uppercase border-2 border-black transition-all", formData.activeObjection === 'too_low' ? "bg-black text-white shadow-[4px_4px_0px_#FF00FF]" : "bg-white hover:bg-gray-100")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'too_low' ? null : 'too_low')}>
                   "That's too low"
                 </button>
                 <button className={clsx("px-4 py-2 font-black uppercase border-2 border-black transition-all", formData.activeObjection === 'think_about_it' ? "bg-black text-white shadow-[4px_4px_0px_#FF00FF]" : "bg-white hover:bg-gray-100")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'think_about_it' ? null : 'think_about_it')}>
                   "I need to think about it"
                 </button>
                 <button className={clsx("px-4 py-2 font-black uppercase border-2 border-black transition-all", formData.activeObjection === 'other_offers' ? "bg-black text-white shadow-[4px_4px_0px_#FF00FF]" : "bg-white hover:bg-gray-100")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'other_offers' ? null : 'other_offers')}>
                   "I have higher offers"
                 </button>
               </div>

               {formData.activeObjection === 'too_low' && (
                 <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#000] text-xl font-black italic text-black leading-relaxed rounded-none mb-6 animate-slideIn">
                   "I completely understand. If we could get up to your number, we absolutely would. But taking into consideration the cost of the updates, the holding costs, and paying all the closing fees... that's realistically where we need to be to make it make sense. Are we miles apart, or is there a number closer to that where we could shake hands?"
                 </div>
               )}

               {formData.activeObjection === 'think_about_it' && (
                 <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#000] text-xl font-black italic text-black leading-relaxed rounded-none mb-6 animate-slideIn">
                   "Absolutely, taking your time makes total sense. Usually when people need to think about it, there's a specific concern holding them back—is it the price, the timeline, or something else?"
                 </div>
               )}

               {formData.activeObjection === 'other_offers' && (
                 <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#000] text-xl font-black italic text-black leading-relaxed rounded-none mb-6 animate-slideIn">
                   "That's awesome, it sounds like you have some great options. Just be careful with out-of-state buyers who throw out a high number and then ask for massive price drops during inspections. Our offer is completely as-is with zero contingencies. Do their offers waive inspections? If we can guarantee our price, what number would we need to hit to get this locked up right now?"
                 </div>
               )}
            </div>

            {/* Offer Lock In Section */}
            <div className="mt-10 p-6 bg-gray-100 border-8 border-black relative overflow-hidden flex flex-col items-center">
              <div className="absolute inset-0 opacity-10 comic-halftone pointer-events-none"></div>
              <h4 className="m-0 mb-4 text-black text-lg uppercase tracking-widest font-black z-10 text-center">
                Final Negotiated Price
              </h4>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center z-10">
                <div className="relative w-full max-w-md">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00FF00] font-black text-3xl">$</span>
                  <input 
                    type="text" 
                    placeholder="AGREED PRICE" 
                    value={formData.lockedPrice || ''}
                    onChange={(e) => updateForm('lockedPrice', e.target.value.replace(/[^0-9]/g, ''))}
                    disabled={formData.isPriceLocked}
                    className="w-full text-4xl font-black text-[#00FF00] bg-black p-4 pl-12 border-4 border-[#00FF00] text-center focus:outline-none focus:shadow-[0_0_15px_#00FF00] transition-shadow disabled:opacity-90 placeholder-[#004400]"
                  />
                </div>
                
                <button 
                  onClick={() => updateForm('isPriceLocked', !formData.isPriceLocked)}
                  className={clsx(
                    "px-8 py-4 font-black uppercase text-xl border-4 transition-all whitespace-nowrap shadow-[4px_4px_0px_#000]",
                    formData.isPriceLocked 
                      ? "bg-black text-[#FF0055] border-black hover:bg-gray-900" 
                      : "bg-[#00FF00] text-black border-black hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:translate-y-0 active:shadow-none"
                  )}
                >
                  {formData.isPriceLocked ? 'Unlock 🔓' : 'LOCK PRICE 🔒'}
                </button>
              </div>
            </div>

            {formData.isPriceLocked && (
              <div className="mt-6 pt-4 flex justify-center w-full">
                <button 
                  onClick={() => {
                    handleProceed(6);
                    setTimeout(() => {
                      document.getElementById('pillar-6')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 350);
                  }}
                  className="w-full max-w-lg mt-6 bg-[#FF00FF] text-white border-4 border-black p-4 font-black uppercase text-xl transform transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000] active:shadow-none active:translate-y-1 flex justify-center items-center gap-2"
                >
                   Proceed to the Close &rarr;
                </button>
              </div>
            )}
          </div>
        ))}

        {/* PILLAR 6: THE CLOSE & LOGISTICS */}
        {activeSource !== 'Agent Outreach' && renderPillar(6, "The Close & Logistics", <CheckCircle2 size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col mb-2 animate-slideIn">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (The Assumptive Close)</span>
              <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00FFFF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                "Okay perfect, it sounds like we're on the same page. What I'm going to do next is send over our standard, simple 2-page purchase agreement. You can review it, and once you sign it, I'll send it directly to our title company so they can start the process."
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn mt-8">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Logistics Gathering)</span>
              <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00FFFF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                "Just so I can draft this up correctly, what is the exact legal name on the deed that we should use for the contract? And what's the best email address to send the DocuSign to?"
              </div>
              
              <div className="flex flex-col gap-4 mt-2">
                <input type="text" placeholder="Legal Name(s) for Contract..." value={formData.legalName || ''} onChange={(e) => updateForm('legalName', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-4 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                <input type="email" placeholder="Best Email Address..." value={formData.contactEmail || ''} onChange={(e) => updateForm('contactEmail', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-4 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
                <input type="text" placeholder="Current Mailing Address (if different)..." value={formData.mailingAddress || ''} onChange={(e) => updateForm('mailingAddress', e.target.value)} className="w-full bg-gray-100 border-2 border-black rounded-none p-4 text-black uppercase font-bold placeholder-gray-600 focus:outline-none focus:border-4 focus:shadow-[4px_4px_0px_#000] transition-all" />
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn mt-8">
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Final Next Steps)</span>
              <div className="relative bg-white border-4 border-black box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#00FFFF] text-xl font-black italic text-black leading-relaxed rounded-none mb-6">
                "Awesome. I'm typing that up right now and it should hit your inbox in about 5 minutes. I'll shoot you a quick text when I send it. Can you keep an eye out for it and let me know if you have any questions once you look it over?"
              </div>
            </div>
            
            <div className="mt-12">
              <button 
                onClick={generateSummary} 
                className="w-full bg-[#00FF00] text-black border-4 border-black p-6 font-black uppercase text-2xl transform transition-all shadow-[8px_8px_0px_#000] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#000] active:shadow-none active:translate-y-2 flex justify-center items-center gap-4 group"
              >
                PUSH TO DISPO & SEND CONTRACT <ChevronRight size={32} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        ))}
        
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

      {/* RIGHT COLUMN: THE CALCULATOR HUD */}
      <div className="calculator-hud" style={{ height: 'calc(100vh - 120px)', overflowY: 'auto', paddingTop: '40px', paddingBottom: '150px' }}>
        <div className="flex flex-col gap-8">
          <RepairsCalculator 
            formData={formData} 
            updateForm={updateForm} 
            lead={activeLead}
          />
          
          <CashCalculator 
            askingPrice={formData.askingPrice || formData.price} 
            globalArv={formData.arv || 0}
            updateGlobalArv={(val) => updateForm('arv', val)}
          />
          
          <CreativeCalculator 
            globalArv={formData.arv || 0}
            updateGlobalArv={(val) => updateForm('arv', val)}
          />
          
          <div style={{ position: 'relative', marginTop: '20px' }}>
          <button 
            onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}
            style={{ background: '#000', color: '#fff', padding: '12px 25px', borderRadius: '100px', border: '2px solid #d946ef', boxShadow: '6px 6px 0px #d946ef', cursor: 'pointer', outline: 'none', fontSize: '0.9rem', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
          >
            <ShieldAlert size={16} /> DISQUALIFY / STOP
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
      </div>

      {showTearSheet && (
        <TearSheet formData={formData} onClose={() => setShowTearSheet(false)} />
      )}
    </>
  );
}