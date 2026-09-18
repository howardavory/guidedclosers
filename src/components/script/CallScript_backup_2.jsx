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
    entityName: '',
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
    yearBuilt: '',
    lotSize: '',
    lotSizeMeasure: 'SQFT',
    sfRoof: '',
    roofAge: '',
    sfHVAC: '',
    hvacAge: '',
    sfPlumbing: '',
    sfElectrical: '',
    sfCosmetics: '',
    sfStructuralFlags: '',
    amenityPool: '',
    amenityHOA: '',
    amenityRV: '',
    amenityGuestHouse: '',
    secondaryLiabilities: [],
    hoaMonthlyFee: '',
    solarMonthlyPayment: '',
    septicSewer: '',
    solarSystem: '',
    majorRedFlags: [],
    redFlagFoundation: '',
    redFlagFoundationDetails: '',
    redFlagADUDesc: '',
    redFlagADUSqft: '',
    redFlagADUType: '',
    redFlagFire: '',
    redFlagFireDetails: '',
    redFlagWater: '',
    redFlagWaterStatus: '',
    redFlagFines: '',
    redFlagFinesStatus: '',
    redFlagLienType: '',
    redFlagLienAmount: '',
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
      <div id={`pillar-${number}`} className={clsx("mb-6 transition-all duration-300 ease-in-out border border-[var(--card-border)] shadow-md overflow-hidden bg-[var(--card-bg)]/80 backdrop-blur-lg bg-none", isActive ? "transition-all duration-300 - neon-glow-cyan" : isCompleted ? "opacity-90 transition-all duration-300 " : "opacity-100")}>
        
          <div 
            className={clsx("flex justify-between items-center p-5 cursor-pointer select-none border-b-4 border-[var(--card-border)]",
              number === 1 ? "bg-[var(--card-bg)]/60" : 
              number === 2 ? "bg-[var(--card-bg)]/60" : 
              number === 3 ? "bg-[var(--card-bg)]/60" : 
              number === 4 ? "bg-[var(--card-bg)]/60" : 
              number === 5 ? "bg-[var(--card-bg)]/60" : "bg-[var(--card-bg)]/60"
            )} 
            onClick={() => setActivePillar(isActive ? null : number)}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", isActive ? "bg-[var(--card-bg)]/60 text-[#00E5FF]" : isCompleted ? "bg-accent-success/20 text-green-600" : "bg-[var(--card-bg)] text-gray-800")}>
              {icon}
            </div>
            <h3 className={clsx("font-semibold tracking-wide text-xl tracking-wide", isActive ? "text-gray-800" : "text-gray-800")}>Pillar {number}: {title}</h3>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => togglePillarCompletion(e, number)}
              className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all", isCompleted ? "bg-accent-success/20 text-green-600 border border-accent-success/50" : "bg-[var(--card-bg)] text-gray-800 border border-[var(--card-border)] hover:text-gray-800")}
            >
              <CheckCircle2 size={16} /> {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            {isActive ? <ChevronDown className="text-gray-800" /> : <ChevronRight className="text-gray-800" />}
          </div>
        </div>
        
        <div className={clsx("grid transition-all duration-300 ease-in-out", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <div className="p-6 pt-0 border-t border-[var(--card-border)] mt-2">
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
  const isTrust = formData.decisionMakers === 'Trust/Probate/Multiple';
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

  const hasMajorRepairs = 
      (formData.sfRoof || '').toUpperCase().includes('OVERLAY') || 
      (formData.sfRoof || '').toUpperCase().includes('TEAR-OFF') ||
      (formData.sfHVAC || '').toUpperCase().includes('UNIT ONLY') || 
      (formData.sfHVAC || '').toUpperCase().includes('FULL SYSTEM') ||
      (formData.sfPlumbing || '').toUpperCase().includes('MINOR LEAKS') || 
      (formData.sfPlumbing || '').toUpperCase().includes('REPIPE') ||
      (formData.sfElectrical || '').toUpperCase().includes('PANEL UPGRADE') || 
      (formData.sfElectrical || '').toUpperCase().includes('FULL REWIRE');

  return (
    <>
      <div className="flex h-[calc(100vh-120px)] overflow-hidden gap-6 relative z-10">

      <div className="flex-1 h-full overflow-y-auto px-8 lg:px-12 pb-32 hide-scrollbar mt-6">
<button 
          onClick={() => {
            if (onReturn) onReturn();
          }} 
          className="mb-6 flex items-center gap-2 px-6 py-2 bg-[var(--card-bg)]/80 border border-[var(--card-border)] text-[var(--text-base)] hover:text-[#FFE600] hover:bg-[var(--card-bg)]/60 transition-all font-semibold tracking-wide text-xl tracking-widest shadow-sm transition-all duration-300 -"
        >
          &larr; Return to Dispatch
        </button>
          {/* LEAD CONTEXT (Always Visible) */}
          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-full bg-blue-500/5 blur-3xl"></div>
            <div className="grid grid-cols-4 gap-6 relative z-10">
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Lead Source</label>
                <select value={formData.activeSource} onChange={e => updateForm('activeSource', e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-[var(--text-base)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                  <option value="In-House" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">In-House</option>
                  <option value="Bold Street" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Bold Street</option>
                  <option value="Self Gen" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Self Gen</option>
                  <option value="Agent Outreach" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Agent Outreach</option>
                  <option value="PPC" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">PPC / Web</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Ownership Profile</label>
                <select value={formData.manualEntityType} onChange={e => { updateForm('manualEntityType', e.target.value); if (activePillar !== 1) setActivePillar(1); }} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-[var(--text-base)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer mb-2">
                  <option value="INDIVIDUAL" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Individual</option>
                  <option value="TRUST" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Trust</option>
                  <option value="LLC" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">LLC</option>
                </select>
                {formData.manualEntityType !== 'INDIVIDUAL' && (
                  <input type="text" placeholder="Entity Name..." value={formData.entityName || ''} onChange={e => updateForm('entityName', e.target.value)} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-[var(--text-base)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-500" />
                )}
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Property Type (Public Record)</label>
                <select value={formData.expectedPropertyType || 'standard single-family home'} onChange={e => { updateForm('expectedPropertyType', e.target.value); if (activePillar !== 1) setActivePillar(1); }} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-[var(--text-base)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all cursor-pointer">
                  <option value="standard single-family home" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Single Family</option>
                  <option value="multi-unit property" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Multi-Family</option>
                  <option value="condo or townhome" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Condo/Townhome</option>
                  <option value="mobile home" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Mobile Home</option>
                  <option value="parcel of land" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Land</option>
                </select>
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Estimated ARV (Zillow/Redfin)</label>
                <input type="number" value={formData.arv || ''} onChange={e => { updateForm('arv', e.target.value); if (activePillar !== 1) setActivePillar(1); }} placeholder="0" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-[var(--text-base)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-500" />
              </div>
            </div>
          </div>

          <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/50 border border-indigo-900/50 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-full bg-[var(--card-bg)]/60 opacity-10 transition-all duration-300 -"></div>
            <h4 className="text-indigo-400 font-bold text-lg uppercase tracking-wider mb-4 flex items-center gap-3 relative z-10"><Database size={24} className="text-[#00E5FF]" /> PUBLIC RECORDS SYNC</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Property Sqft</label>
                <input type="number" value={formData.sqft || ''} onChange={e => updateForm('sqft', e.target.value)} placeholder="e.g. 1500" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-[var(--text-base)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-500" />
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Lot Size ({formData.lotSizeMeasure})</label>
                <div className="flex gap-2">
                  <input type="number" value={formData.lotSize || ''} onChange={e => updateForm('lotSize', e.target.value)} placeholder="0" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-[var(--text-base)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-500" />
                  <div className="flex flex-col gap-1 w-16">
                    <button className={clsx("flex-1 text-[10px] font-bold uppercase", formData.lotSizeMeasure === 'SQFT' ? "bg-[var(--card-bg)]/60 text-gray-800" : "bg-[var(--card-bg)]/80 text-[#FFE600] border border-[#FFE600]")} onClick={() => updateForm('lotSizeMeasure', 'SQFT')}>SQFT</button>
                    <button className={clsx("flex-1 text-[10px] font-bold uppercase", formData.lotSizeMeasure === 'ACRES' ? "bg-[var(--card-bg)]/60 text-gray-800" : "bg-[var(--card-bg)]/80 text-[#FFE600] border border-[#FFE600]")} onClick={() => updateForm('lotSizeMeasure', 'ACRES')}>ACRES</button>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">
                  Year Built 
                  {formData.yearBuilt && (
                    <span className="ml-2 bg-[var(--card-bg)]/60 text-gray-800 px-2 py-0.5 text-xs font-bold rounded-sm shadow-md">
                      (Age: {new Date().getFullYear() - Number(formData.yearBuilt)} yrs)
                    </span>
                  )}
                </label>
                <input type="number" value={formData.yearBuilt || ''} onChange={e => updateForm('yearBuilt', e.target.value)} placeholder="e.g. 1990" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg p-3 text-[var(--text-base)] text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder-slate-500" />
              </div>
            </div>
          </div>
        {activeLead?.isManual && (
          <div className="mb-6 p-6 bg-[var(--card-bg)]/80 border border-[var(--card-border)] shadow-sm transition-all duration-300 - relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-full bg-[var(--card-bg)]/60 opacity-10 transition-all duration-300 -"></div>
            <h4 className="text-[#00E5FF] font-semibold tracking-wide text-3xl tracking-widest drop-shadow-md mb-4 flex items-center gap-3 relative z-10"><MapPin size={24} className="text-[#D4AF37]" /> MANUAL SUBMISSION DETAILS</h4>
            <div className="grid grid-cols-2 gap-6 relative z-10">
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Lead Name</label>
                <input type="text" value={formData.manualName} onChange={e => updateForm('manualName', e.target.value)} className="w-full bg-[var(--card-bg)]/50 backdrop-blur-md backdrop-blur-md border-2 border-white/50 p-3 text-[var(--text-base)] font-bold focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 outline-none placeholder-gray-600" placeholder="John Doe" />
              </div>
              <div>
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Property Address</label>
                <div className="flex gap-3">
                  {isLoaded ? (
                    <Autocomplete onLoad={(auto) => autocompleteRef.current = auto} onPlaceChanged={handlePlaceChanged} className="flex-1">
                      <input type="text" value={formData.manualAddress} onChange={e => updateForm('manualAddress', e.target.value)} className="w-full bg-[var(--card-bg)]/50 backdrop-blur-md backdrop-blur-md border-2 border-white/50 p-3 text-[var(--text-base)] font-bold focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 outline-none placeholder-gray-600" placeholder="Search Google Maps..." />
                    </Autocomplete>
                  ) : (
                    <input type="text" value={formData.manualAddress} onChange={e => updateForm('manualAddress', e.target.value)} className="w-full bg-[var(--card-bg)]/50 backdrop-blur-md backdrop-blur-md border-2 border-white/50 p-3 text-[var(--text-base)] font-bold focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 outline-none placeholder-gray-600" placeholder="123 Main St..." />
                  )}
                  <button onClick={pullBatchLeadsData} disabled={isPullingData} className="px-6 bg-[var(--card-bg)]/60 text-gray-800 border-2 border-[var(--card-border)] shadow-md hover:shadow-md font-semibold tracking-wide tracking-widest text-xl hover:bg-[var(--card-bg)]/60 hover:text-[var(--text-base)] transition-all flex items-center justify-center transition-all duration-300 ">
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
              <button className={clsx("px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2", formData.isVoicemail ? "bg-purple-600 text-gray-800 border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)]" : "bg-[var(--card-bg)] text-[var(--text-muted)] border-purple-500/30")} onClick={() => updateForm('isVoicemail', !formData.isVoicemail)}>Voicemail Drop</button>
              <button className={clsx("px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2", formData.isHostile ? "bg-red-600 text-gray-800 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "bg-[var(--card-bg)] text-red-400 border-red-500/30")} onClick={() => {
                        updateForm('isHostile', true);
                        if (onReturn) {
                          updateDisposition('disqualified');
                          onReturn({ type: 'disqualified', reason: 'Hostile', data: formData });
                        }
                      }}>Hostile Response</button>
            </div>
            {formData.isVoicemail && (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[var(--text-muted)]">Agent (Voicemail Script)</span>
                <div className="relative bg-[var(--card-bg)]/50 backdrop-blur-md backdrop-blur-md border border-white/50 p-6 shadow-md text-xl font-bold text-[var(--text-base)] leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.activeSource === 'Agent Outreach' 
                    ? `"Hey ${sellerFirstName}, this is Avory. I'm with a local investment company here in Bakersfield and we're looking for our next project. We buy cash and close quick. If you've got any hard-to-move inventory, pocket listings, or distress deals that could use an offer, give me a call back. Talk soon."`
                    : `"Hey ${sellerFirstName || 'there'}, my name is Avory. I'm a local investor just calling about the property over on ${targetAddress}. We're actually looking to buy another one in the area and just wanted to see if you've considered selling and would be open to our cash offer. Please give me a call if you are interested. My number is 661-387-3890. Thank you and I look forward to speaking with you."`
                  }
                </div>
                
                <button 
                  onClick={() => onReturn && onReturn({ type: 'voicemail' })} 
                  className="w-full max-w-md relative h-20 group overflow-hidden border border-[var(--card-border)] shadow-md hover:shadow-md transition-all hover:-translate-y-0.5 bg-[var(--card-bg)]/80 transition-all duration-300  cursor-pointer flex justify-center items-center mt-4"
                >
                  <div className="absolute inset-0 bg-[var(--card-bg)]/60 transition-all duration-300 skew-x-[-30deg] translate-x-1/2 group-hover:translate-x-1/3 transition-transition-all duration-300 duration-500 border-l-4 border-[var(--card-border)] pointer-events-none"></div>
                  <div className="relative z-10 flex items-center gap-3">
                    <Mic size={24} className="text-[var(--text-base)] drop-shadow-md" />
                    <span className="font-semibold tracking-wide text-3xl text-[var(--text-base)] tracking-widest drop-shadow-md group-hover:scale-110 transition-transform">
                      LOG VOICEMAIL & RETURN
                    </span>
                  </div>
                </button>
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Direct Opener)</span>
                <div className="relative bg-[var(--card-bg)]/50 backdrop-blur-md backdrop-blur-md border border-white/50 p-6 shadow-md text-xl font-bold text-[var(--text-base)] leading-relaxed rounded-2xl rounded-tl-none mb-6">
                  {formData.activeSource === 'Agent Outreach' 
                    ? `"Hey ${sellerFirstName}, my name is Avory with Central Valley REI. I'm an investor buying properties cash in your area. I know you're busy, so I'll keep it brief. Do you happen to have any off-market inventory or pocket listings?"`
                    : formData.manualEntityType === 'TRUST'
                    ? `"Hey, am I speaking with the trustee for the ${formData.entityName || '{Entity Name}'}? My name is Avory, a local investor. I was calling about the property over on ${targetAddress}... have the trustees ever considered selling it?"`
                    : formData.manualEntityType === 'LLC'
                    ? `"Hey, am I speaking with the owner of ${formData.entityName || '{Entity Name}'}? My name is Avory, a local investor. I was calling about the property over on ${targetAddress}... have you or your partners ever considered selling it?"`
                    : (
                      <span>
                        "Hey {sellerFirstName}, how are you doing today?..." <span className="text-[#D4AF37] italic text-base block mt-1 mb-2">(pause, wait for validation)</span>
                        "My name is Avory, a local investor. I was just giving you a call about {targetAddress} to see if you've considered selling and are open to a cash offer?"
                      </span>
                    )
                  }
                </div>
              </div>
            )}
            
            {formData.isHostile && (
              <div className="mt-4 p-4 rounded-xl border border-red-600 bg-[var(--card-bg)] text-gray-800 text-sm leading-relaxed animate-slideIn">
                <span className="text-red-600 font-black italic block mb-2">[HOSTILE RESPONSE]</span>
                "Whoa, my bad, I didn't mean to catch you off guard. We'll go ahead and take you off our list. Have a good day."
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (
              <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl mt-4">
                <p className="text-xs font-bold mb-3 text-gray-800 uppercase">Seller Responses & Pushbacks (Click again to untoggle)</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <button className={clsx("px-5 py-2 border-2 border-[var(--card-border)] text-sm font-semibold tracking-wide tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-md transition-all duration-300 -", formData.introResponse === 'Who' ? "bg-[var(--card-bg)]/60 text-gray-800 border-[var(--card-border)] neon-glow-cyan transition-all duration-300 -" : "text-gray-800 border-[var(--card-border)] hover:text-gray-800")} onClick={() => { updateForm('introResponse', formData.introResponse === 'Who' ? null : 'Who'); updateForm('activeObjection', null); }}>"Who is this?"</button>
                  <button className={clsx("px-5 py-2 border-2 border-[var(--card-border)] text-sm font-semibold tracking-wide tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-md transition-all duration-300 -", formData.activeObjection === 'how' ? "bg-[var(--card-bg)]/60 text-gray-800 border-[var(--card-border)] neon-glow-cyan transition-all duration-300 -" : "text-gray-800 border-[var(--card-border)] hover:text-gray-800")} onClick={() => { updateForm('activeObjection', formData.activeObjection === 'how' ? null : 'how'); updateForm('introResponse', null); }}>"How did you get my number?"</button>
                  <button className={clsx("px-5 py-2 border-2 border-[var(--card-border)] text-sm font-semibold tracking-wide tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-md transition-all duration-300 -", formData.introResponse === 'No' ? "bg-[var(--card-bg)]/60 text-[var(--text-base)] border-[var(--card-border)] neon-glow-red transition-all duration-300 -" : "text-gray-800 border-[var(--card-border)] hover:text-gray-800")} onClick={() => { updateForm('introResponse', formData.introResponse === 'No' ? null : 'No'); updateForm('activeObjection', null); }}>Wrong Number</button>
                  <button className={clsx("px-5 py-2 border-2 border-[var(--card-border)] text-sm font-semibold tracking-wide tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-md transition-all duration-300 -", formData.introResponse === 'NotOwner' ? "bg-[var(--card-bg)]/60 text-[var(--text-base)] border-[var(--card-border)] neon-glow-red transition-all duration-300 -" : "text-gray-800 border-[var(--card-border)] hover:text-gray-800")} onClick={() => { updateForm('introResponse', formData.introResponse === 'NotOwner' ? null : 'NotOwner'); updateForm('activeObjection', null); }}>Not the Owner / Sold It</button>
                </div>

                {formData.introResponse === 'Who' && (
                  <div className="mt-4 p-4 rounded-xl border-l-4 border-[var(--card-border)] bg-[var(--card-bg)] text-gray-800 text-sm leading-relaxed animate-slideIn">
                    "Hey, my name is Avory, I'm a local investor. We're actually looking for another property in the neighborhood right now. I was just calling to see if you'd even be open to a cash offer on your property over on {targetAddress}, or if you're holding onto it?"
                  </div>
                )}
                {formData.activeObjection === 'how' && (
                  <div className="mt-4 p-4 rounded-xl border-l-4 border-[var(--card-border)] bg-[var(--card-bg)] text-gray-800 text-sm leading-relaxed animate-slideIn">
                    "I use a public records system that pairs properties with phone numbers. Since we're buying in your neighborhood, I took a shot in the dark to see if you'd be open to an offer."
                  </div>
                )}
                {['No', 'NotOwner'].includes(formData.introResponse) && (
                  <div className="mt-4 p-4 rounded-xl border-l-4 border-[var(--card-border)] bg-[var(--card-bg)] text-gray-800 text-sm leading-relaxed animate-slideIn">
                    "Ah, my apologies! Sounds like our public records must be outdated. But since I have you on the phone... do you happen to own any other real estate that you'd consider selling, or are you currently renting?"
                  </div>
                )}
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (
              <div className="flex flex-col mt-4 animate-slideIn">
                <div className="p-4 bg-[var(--card-bg)]/40 border border-[var(--card-border)] rounded-xl animate-slideIn">
                  <p className="text-xs font-bold mb-3 text-gray-800 uppercase">Would they consider an offer?</p>
                  <div className="flex gap-2 flex-wrap">
                    <button className={clsx("px-5 py-2 border-2 border-[var(--card-border)] text-sm font-semibold tracking-wide tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-md transition-all duration-300 -", formData.offerResponse === 'Yes' ? "bg-accent-success text-gray-800 border-accent-success" : "text-gray-800 border-[var(--card-border)] hover:bg-[var(--card-bg)]/10")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'Yes' ? null : 'Yes')}>"Yes / Sure"</button>
                    <button className={clsx("px-5 py-2 border-2 border-[var(--card-border)] text-sm font-semibold tracking-wide tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-md transition-all duration-300 -", formData.offerResponse === 'Price' ? "bg-[var(--card-bg)]/60 text-gray-800 border-[var(--card-border)] neon-glow-cyan transition-all duration-300 -" : "text-gray-800 border-[var(--card-border)] hover:text-gray-800")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'Price' ? null : 'Price')}>"Depends on the price"</button>
                    <button className={clsx("px-5 py-2 border-2 border-[var(--card-border)] text-sm font-semibold tracking-wide tracking-widest uppercase transition-all hover:-translate-y-0.5 shadow-md transition-all duration-300 -", formData.offerResponse === 'No' ? "bg-[var(--card-bg)]/60 text-[var(--text-base)] border-[var(--card-border)] neon-glow-red transition-all duration-300 -" : "text-gray-800 border-[var(--card-border)] hover:text-gray-800")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'No' ? null : 'No')}>"No / Not Selling"</button>
                  </div>

                  {formData.offerResponse === 'Yes' && (
                    <div className="mt-4 p-4 rounded-xl border-l-4 border-accent-success bg-[var(--card-bg)] text-gray-800 text-sm leading-relaxed animate-slideIn">
                      "Awesome! Just to make sure we're on the same page, do you know exactly what you'd be looking to get for it, or are you just open to seeing what I can do?" <br/><br/>
                      
                      <div className="my-4 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl flex items-center gap-3">
                        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Asking Price:</label>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-800">$</span>
                          <input type="text" placeholder="Price or leave blank..." className="w-full bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all" value={formData.askingPrice || ''} onChange={e => updateForm('askingPrice', e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setActivePillar(2); setCompletedPillars(prev => [...new Set([...prev, 1])]); } }} />
                        </div>
                        <button className={clsx("px-3 text-xs rounded border py-2 transition-colors", formData.refusedPrice ? "bg-red-600 border-red-600 text-gray-800" : "border-[var(--card-border)] text-gray-800 hover:text-gray-800")} onClick={() => updateForm('refusedPrice', !formData.refusedPrice)}>Refused Price</button>
                      </div>

                      {formData.askingPrice || formData.refusedPrice ? (
                        <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                          <p className="mb-4">
                            {formData.refusedPrice 
                              ? `"No worries at all, I completely understand. Usually when we buy properties, the exact number we can offer is going to depend heavily on the condition and layout."`
                              : `"Got it, $${Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice}. For us to see if we can make that number work, it's going to depend heavily on the condition and layout."`
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                          <p className="mb-4 text-gray-800 italic">Enter a price or click Refused Price to continue...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.offerResponse === 'Price' && (
                    <div className="mt-4 p-4 rounded-xl border-l-4 border-[var(--card-border)] bg-[var(--card-bg)] text-gray-800 text-sm leading-relaxed animate-slideIn">
                      "I hear you. The right price is everything. Usually when people say that, they already have a number in mind. What would make sense for you if we paid cash and covered all your closing costs?"
                      <div className="mt-3 flex gap-2">
                        <input type="number" placeholder="Their Asking Price..." className="w-full bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all" value={formData.askingPrice} onChange={e => updateForm('askingPrice', e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { setActivePillar(2); setCompletedPillars(prev => [...new Set([...prev, 1])]); } }} />
                        <button className={clsx("px-3 text-xs rounded border transition-colors", formData.refusedPrice ? "bg-red-600 border-red-600 text-gray-800" : "border-[var(--card-border)] text-gray-800")} onClick={() => updateForm('refusedPrice', !formData.refusedPrice)}>Refused Price</button>
                      </div>
                      
                      {formData.askingPrice || formData.refusedPrice ? (
                        <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                          <p className="mb-4">
                            {formData.refusedPrice 
                              ? `"No worries at all, I completely understand. Usually when we buy properties, the exact number we can offer is going to depend heavily on the condition and layout."`
                              : `"Got it, $${Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice}. For us to see if we can make that number work, it's going to depend heavily on the condition and layout."`
                            }
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4 pt-4 border-t border-[var(--card-border)]">
                          <p className="mb-4 text-gray-800 italic">Enter a price or click Refused Price to continue...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.offerResponse === 'No' && (
                    <div className="mt-4 p-4 rounded-xl border-l-4 border-red-500 bg-[var(--card-bg)] text-gray-800 text-sm leading-relaxed animate-slideIn">
                      "I completely understand. It sounds like this is a long-term hold for you. If anything ever changes, would you be opposed to me keeping your number on file just in case?"
                      <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex justify-end">
                         <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-gray-800 rounded-lg font-bold text-sm" onClick={() => {
                          if (onReturn) {
                            // Update lead disposition
                            updateDisposition('disqualified');
                            onReturn({ type: 'disqualified', reason: 'Not Selling', data: formData });
                          }
                        }}>Disqualify / End Call</button>
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
                className="w-full py-3.5 my-4 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-[#000000] font-extrabold text-center rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(229,193,88,0.5)] hover:opacity-95 transition-all cursor-pointer uppercase tracking-wider">
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
               <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-sm rounded-none mb-8">
                 <div className="text-xl font-black italic text-gray-800 leading-relaxed mb-6">
                   {`"So public records are showing this as a ${formData.expectedPropertyType || 'standard single-family home'}. Is that right${(!formData.expectedPropertyType || formData.expectedPropertyType === 'standard single-family home') ? ', or are we looking at a multi-unit or mobile home?' : '?'}"`}
                 </div>

                 <div>
                   <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Select Property Type</label>
                   <div className="flex flex-wrap gap-3 mb-4">
                     {['Single Family', 'Multi-Family', 'Condo/Townhome', 'Mobile Home', 'Land'].map(type => (
                       <button key={type} onClick={() => updateForm('propertyType', formData.propertyType === type ? '' : type)} className={clsx("", formData.propertyType === type ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{type}</button>
                     ))}
                   </div>
                 </div>
               </div>
            </div>

            {formData.propertyType && formData.propertyType !== 'Multi-Family' && formData.propertyType !== 'Land' && (
              <>
                {/* 1. DECISION MAKERS */}
                <div className="flex flex-col mb-2 animate-slideIn">
                   <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Decision Makers)</span>
                   <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] rounded-none mb-8">
                     <div className="text-xl font-black italic text-gray-800 leading-relaxed mb-6">
                       {`"Perfect. And before we get into the house itself, are you the sole owner on title, or is there a spouse or partner we'd need to loop in eventually?"`}
                     </div>

                     <div>
                       <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Decision Makers</label>
                       <div className="flex flex-wrap gap-3 mb-4">
                         {['Sole Owner', 'Spouse/Partner', 'Trust/Probate/Multiple'].map(dm => (
                           <button key={dm} onClick={() => updateForm('decisionMakers', formData.decisionMakers === dm ? '' : dm)} className={clsx("", formData.decisionMakers === dm ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{dm}</button>
                         ))}
                       </div>
                       {formData.decisionMakers === 'Trust/Probate/Multiple' && (
                         <div className="mt-4 p-4 border-2 border-[var(--card-border)] bg-gray-100 shadow-inner">
                           <div className="mb-4">
                             <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Decision Makers</label>
                             <div className="flex flex-wrap gap-3 mb-4">
                               {Array.from({ length: formData.dmCount || 2 }).map((_, i) => (
                                 <button 
                                   key={i} 
                                   onClick={() => updateForm('activeDm', i+1)} 
                                   className={clsx("px-4 py-2 font-black border-2 border-[var(--card-border)] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5", (formData.activeDm || 1) === i+1 ? "bg-[var(--card-bg)]/60 text-gray-800" : "bg-[var(--card-bg)] text-gray-800")}
                                 >
                                   DM {i+1}
                                 </button>
                               ))}
                               {(formData.dmCount || 2) < 10 && (
                                 <button 
                                   onClick={() => { const nextCount = (formData.dmCount || 2) + 1; updateForm('dmCount', nextCount); updateForm('activeDm', nextCount); }} 
                                   className="px-4 py-2 font-black bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] shadow-md hover:bg-gray-200 transition-transition-all duration-300 hover:-translate-y-0.5"
                                 >
                                   +
                                 </button>
                               )}
                             </div>
                           </div>
                           <div>
                             <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Relationship (DM {formData.activeDm || 1})</label>
                             <div className="flex flex-wrap gap-3 mb-4">
                               {['Sibling', 'Ex-Spouse', 'Business Partner', 'Heir', 'Parent', 'Child', 'Attorney', 'Trustee'].map(rel => (
                                 <button 
                                   key={rel} 
                                   onClick={() => updateForm(`dmRel_${formData.activeDm || 1}`, formData[`dmRel_${formData.activeDm || 1}`] === rel ? '' : rel)} 
                                   className={clsx("", formData[`dmRel_${formData.activeDm || 1}`] === rel ? "bg-[var(--card-bg)]/60 text-[var(--text-base)] border-2 border-[var(--card-border)] font-black text-xs uppercase px-3 py-1 shadow-md" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-3 py-1 shadow-md")}
                                 >
                                   {rel}
                                 </button>
                               ))}
                             </div>
                           </div>
                         </div>
                       )}
                     </div>
                    </div>
                  </div>

                {/* 2. PROPERTY SPECS */}
                {formData.decisionMakers && (
                  <>
                    <div className="flex flex-col mb-2 animate-slideIn">
                       <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Property Specs)</span>
                       <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] rounded-none mb-8">
                         <div className="text-xl font-black italic text-gray-800 leading-relaxed mb-6">
                           {formData.propertyType === 'Single Family' || formData.propertyType === 'Condo/Townhome' ? (
                             (() => {
                               let intro = "So ";
                               if (formData.decisionMakers === 'Sole Owner') intro = "Perfect, keeps things simple. So ";
                               else if (formData.decisionMakers === 'Spouse/Partner' || formData.decisionMakers === 'Trust/Probate/Multiple') intro = "Got it, so we'll just make sure they're looped in on the numbers when the time comes. So ";
                               
                               const displayBeds = formData.beds ? formData.beds.replace(/[^0-9+]/g, '') : formData.publicBeds || '{Beds}';
                               const displayBaths = formData.baths ? formData.baths.replace(/[^0-9.+]/g, '') : formData.publicBaths || '{Baths}';
                               const displaySqft = formData.sqft ? Number(formData.sqft).toLocaleString() : formData.publicSqft ? Number(formData.publicSqft).toLocaleString() : '{SqFt}';

                               return `"${intro}on my end I see that it's a ${displayBeds} bed, ${displayBaths} bath, right around ${displaySqft} square feet. Have you guys added on to it at all${displayBeds !== '{Beds}' && displayBaths !== '{Baths}' && displaySqft !== '{SqFt}' ? ", or is this still the current layout?" : "?"}"`;
                             })()
                           ) : formData.propertyType === 'Mobile Home' ? (
                             `"Is that sitting on its own land that you own, or is it in a park where you're paying lot rent? And what's the bed/bath count on the unit itself?"`
                           ) : ""}
                         </div>
                         <div className="flex flex-col gap-4">
                      <div>
                        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Beds</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['1 Bed', '2 Beds', '3 Beds', '4 Beds', '5+ Beds'].map(bed => (
                            <button key={bed} onClick={() => updateForm('beds', formData.beds === bed ? '' : bed)} className={clsx("", formData.beds === bed ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{bed}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Baths</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['1 Bath', '1.5 Baths', '2 Baths', '2.5 Baths', '3+ Baths'].map(bath => (
                            <button key={bath} onClick={() => updateForm('baths', formData.baths === bath ? '' : bath)} className={clsx("", formData.baths === bath ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{bath}</button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mt-2">
                         <div>
                           <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Sqft</label>
                           <input type="number" value={formData.sqft} onChange={e => updateForm('sqft', e.target.value)} className="w-full bg-gray-100 border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-md transition-all" />
                         </div>
                         <div>
                           <div className="flex justify-between items-center mb-1">
                             <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Lot Size ({formData.lotSizeMeasure})</label>
                             <div className="flex bg-gray-200 rounded p-0.5">
                               <button className={clsx("px-2 py-0.5 text-[10px] font-bold uppercase rounded", formData.lotSizeMeasure === 'SQFT' ? "bg-[var(--card-bg)]/80 text-[var(--text-base)] shadow-sm" : "text-[var(--text-muted)]")} onClick={() => updateForm('lotSizeMeasure', 'SQFT')}>SQFT</button>
                               <button className={clsx("px-2 py-0.5 text-[10px] font-bold uppercase rounded", formData.lotSizeMeasure === 'ACRES' ? "bg-[var(--card-bg)]/80 text-[var(--text-base)] shadow-sm" : "text-[var(--text-muted)]")} onClick={() => updateForm('lotSizeMeasure', 'ACRES')}>ACRES</button>
                             </div>
                           </div>
                           <input type="number" value={formData.lotSize} onChange={e => updateForm('lotSize', e.target.value)} className="w-full bg-gray-100 border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-md transition-all mb-1" />
                           {formData.lotSize && (
                             <div className="text-[10px] text-[var(--text-muted)] font-bold italic text-right pr-1">
                               {formData.lotSizeMeasure === 'SQFT' ? `(${(Number(formData.lotSize) / 43560).toFixed(2)} acres)` : `(${(Number(formData.lotSize) * 43560).toLocaleString()} sqft)`}
                             </div>
                           )}
                         </div>
                      </div>
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
                       <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-sm rounded-none mb-8">
                         <div className="text-xl font-black italic text-gray-800 leading-relaxed mb-6">
                           "Sounds good, now are you currently living in the property right now or is it a rental?"
                         </div>
                         <div>
                           <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Occupancy Status</label>
                           <div className="flex flex-wrap gap-3 mb-4">
                        {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                          <button key={occ} onClick={() => updateForm('occupancy', formData.occupancy === occ ? '' : occ)} className={clsx("", formData.occupancy === occ ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{occ}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
              </>
            )}

            {formData.propertyType === 'Land' && (
              <div className="flex flex-col mb-2 animate-slideIn">
                 <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Land Specs)</span>
                 <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
                   "Understood. Do you happen to know the exact acreage or lot size? And are there any existing utilities pulled to the property, like water or power?"
                 </div>
              </div>
            )}

            {/* Property Dynamics Inputs */}
            {formData.propertyType === 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Multi-Family Phase 1 & 2)</div>
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
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
                      <div className="text-sm text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Building Configuration</div>
                      <div className="flex flex-wrap gap-3">
                        {['1 Single Building', 'Multiple Detached Buildings', 'Main House + ADU/Conversion'].map(config => (
                          <button key={config} 
                            className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-sm' : 'bg-[var(--card-bg)]/80 border-white text-[var(--text-base)]'}`} 
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
                        <div className="text-sm text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Structure Consistency</div>
                        <div className="flex flex-wrap gap-3">
                          {['All Built Same Year', 'Different Ages/Styles'].map(opt => (
                            <button key={opt} 
                              className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-sm' : 'bg-[var(--card-bg)]/80 border-white text-[var(--text-base)]'}`} 
                              onClick={() => setFormData({...formData, mfStructureConsistency: opt})}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && (
                      <div className="mb-6 animate-slideIn">
                        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Estimated Year Built</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 1985" 
                          value={formData.mfYearBuilt} 
                          onChange={e => updateForm('mfYearBuilt', e.target.value)} 
                          className="w-full bg-[var(--card-bg)]/80 border-2 border-white rounded-lg p-3 text-[var(--text-base)] focus:border-white/50 focus:outline-none font-bold placeholder-gray-600" 
                        />
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && (
                      <div className="mb-6 animate-slideIn flex flex-col gap-4">
                        <div>
                          <div className="text-sm text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">ADU Origin</div>
                          <div className="flex flex-wrap gap-3">
                            {['Ground-Up Build', 'Garage Conversion', 'Interior Split/Cut'].map(opt => (
                              <button key={opt} 
                                className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-sm' : 'bg-[var(--card-bg)]/80 border-white text-[var(--text-base)]'}`} 
                                onClick={() => setFormData({...formData, mfAduOrigin: opt})}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {formData.mfAduOrigin !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">City Permits / Legality</div>
                            <div className="flex flex-wrap gap-3">
                              {['Fully Permitted', 'Unpermitted / Unknown'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-[2px_2px_0px_#fff]  hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduLegality === opt ? 'bg-[var(--card-bg)]/60 text-[var(--text-base)] border-[#D4AF37] shadow-[2px_2px_0px_#D4AF37]' : 'bg-[var(--card-bg)]/80 border-white text-[var(--text-base)]'}`} 
                                  onClick={() => setFormData({...formData, mfAduLegality: opt})}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.mfAduLegality !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Utility Metering</div>
                            <div className="flex flex-wrap gap-3">
                              {['Own Address & Meters', 'Shared with Main House'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-bold tracking-widest text-xs shadow-sm' : 'bg-[var(--card-bg)]/80 border-white text-[var(--text-base)]'}`} 
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
                        <div className="text-sm text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Total Units</div>
                        <div className="flex flex-wrap gap-3">
                          {['2 Units', '3 Units', '4 Units'].map(count => (
                            <button key={count} 
                              className={`px-5 py-2.5 border-2 font-bold tracking-widest text-sm shadow-sm' : 'bg-[var(--card-bg)]/80 border-white text-[var(--text-base)]'}`} 
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
                          <div key={index} className="bg-[#111] border-2 border-[#3b82f6] p-4 rounded-lg shadow-md">
                            <div className="text-[#00E5FF] font-bold uppercase tracking-widest mb-3 border-b border-gray-700 pb-2">
                              {formData.mfBuildingConfig === 'Main House + ADU/Conversion' 
                                ? (index === 0 ? 'MAIN HOUSE' : 'ADU / GUEST HOUSE')
                                : `Unit ${String.fromCharCode(65 + index)}`
                              }
                            </div>
                            
                            {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'Different Ages/Styles' && (
                              <div className="mb-4">
                                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Year Built</label>
                                <input 
                                  type="number" 
                                  placeholder="e.g. 1950" 
                                  value={unit.yearBuilt || ''} 
                                  onChange={e => {
                                    const newData = [...formData.mfUnitsData]; newData[index].yearBuilt = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} 
                                  className="w-full bg-[var(--card-bg)]/80 border border-gray-600 rounded-lg p-2 text-[var(--text-base)] focus:border-[#3b82f6] focus:outline-none font-bold placeholder-gray-600 text-sm" 
                                />
                              </div>
                            )}

                            <div className="mb-4">
                              <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Layout</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Studio', '1 Bed', '2 Bed', '3+ Bed'].map(bed => (
                                  <button key={bed} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBeds === bed ? 'bg-[#3b82f6] text-[var(--text-base)] border-[#3b82f6]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBeds = bed; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bed}</button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['1 Bath', '1.5 Bath', '2+ Bath'].map(bath => (
                                  <button key={bath} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBaths === bath ? 'bg-[#3b82f6] text-[var(--text-base)] border-[#3b82f6]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBaths = bath; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bath}</button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Condition</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Turnkey / Updated', 'Dated / Livable', 'Needs Heavy Rehab'].map(cond => (
                                  <button key={cond} className={`px-3 py-1.5 border font-bold text-xs ${unit.condition === cond ? 'bg-[var(--card-bg)]/60 text-[var(--text-base)] border-[#D4AF37]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].condition = cond; setFormData({...formData, mfUnitsData: newData});
                                  }}>{cond}</button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Occupancy Status</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                                  <button key={occ} className={`px-3 py-1.5 border font-bold text-xs ${unit.occupancy === occ ? 'bg-[#00E676] text-gray-800 border-[#00E676]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
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
                              <div className="mt-4 p-3 bg-[var(--card-bg)]/80 border border-gray-800 rounded flex flex-col gap-3">
                                <div>
                                  <div className="text-[10px] text-[var(--text-muted)] mb-1 uppercase tracking-widest font-bold">Current Rent $</div>
                                  <input type="number" placeholder="e.g. 1500" value={unit.rentAmount} onChange={(e) => {
                                    const newData = [...formData.mfUnitsData]; newData[index].rentAmount = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} className="w-full p-2 bg-[#222] text-[var(--text-base)] border border-gray-600 font-bold text-sm focus:outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-[var(--text-muted)] mb-1 uppercase tracking-widest font-bold">Lease Type</div>
                                  <div className="flex gap-2">
                                    {['MTM', 'Annual'].map(lt => (
                                      <button key={lt} className={`flex-1 py-1.5 border font-bold text-xs ${unit.leaseType === lt ? 'bg-[var(--card-bg)]/60 text-[var(--text-base)] border-[#D4AF37]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                        const newData = [...formData.mfUnitsData]; newData[index].leaseType = lt; setFormData({...formData, mfUnitsData: newData});
                                      }}>{lt}</button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-[var(--text-muted)] mb-1 uppercase tracking-widest font-bold">Payment Status</div>
                                  <div className="flex gap-2">
                                    {['On Time', 'Behind'].map(ps => (
                                      <button key={ps} className={`flex-1 py-1.5 border font-bold text-xs ${unit.paymentStatus === ps ? 'bg-[var(--card-bg)]/60 text-[var(--text-base)] border-[#D4AF37]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
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
                        <div className="text-sm text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Utility Metering</div>
                        <div className="flex flex-col gap-4 mb-4">
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-sm' : 'bg-[var(--card-bg)]/80 border-white text-[var(--text-base)]'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Separately Metered (Tenant Pays All)', mfOwnerUtilities: [], mfUtilityCost: ''})}>Tenants Pay All</button>
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUtilityMetering === 'Landlord Pays Some/All' ? 'bg-[var(--card-bg)]/60 text-gray-800 border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-[var(--card-bg)]/80 border-white text-[var(--text-base)]'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Landlord Pays Some/All'})}>Landlord Pays Some/All</button>
                        </div>
                        
                        {formData.mfUtilityMetering === 'Landlord Pays Some/All' && (
                          <div className="mt-4 p-4 bg-[var(--card-bg)]/80 border border-gray-800 rounded-lg">
                            <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-widest font-bold">Which Utilities?</div>
                            <div className="flex flex-wrap gap-3 mb-4">
                              {['Water', 'Sewer', 'Trash', 'Gas', 'Electric', 'Landscaping'].map(util => (
                                <button key={util} 
                                  className={`px-4 py-1.5 border font-bold text-xs shadow-[2px_2px_0px_#fff]  ${formData.mfOwnerUtilities.includes(util) ? 'bg-[var(--card-bg)]/60 text-gray-800 border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-[var(--card-bg)]/80 border-gray-600 text-gray-300'} transition-all`} 
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
                              <div className="text-[10px] text-[var(--text-muted)] mb-1 uppercase tracking-widest font-bold">Est. Monthly Utility Cost $</div>
                              <input type="number" placeholder="e.g. 350" value={formData.mfUtilityCost} onChange={(e) => setFormData({...formData, mfUtilityCost: e.target.value})} className="w-full p-3 bg-[#222] text-[var(--text-base)] border-2 border-gray-600 font-bold text-sm focus:outline-none focus:border-[#FFE600] transition-all skew-x-[-2deg]" />
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
              <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl animate-slideIn">
                <p className="text-sm text-gray-800 mb-2">"Condos are great. Usually, the biggest hurdle for us are the HOA rules. What's the name of the HOA, what's the monthly fee, and do they have any rental restrictions?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="HOA Name..." value={formData.hoaName} onChange={e => updateForm('hoaName', e.target.value)} className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-gray-800 outline-none" />
                  <input type="text" placeholder="HOA Fee / Mo ($)..." value={formData.hoaFee} onChange={e => updateForm('hoaFee', e.target.value)} className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-gray-800 outline-none" />
                </div>
                <input type="text" placeholder="Any Rental Restrictions?" value={formData.hoaRestrictions} onChange={e => updateForm('hoaRestrictions', e.target.value)} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-gray-800 outline-none" />
              </div>
            )}

            {formData.propertyType === 'Mobile Home' && (
              <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl animate-slideIn">
                <p className="text-sm text-gray-800 mb-2">"Mobile homes are great. Is it located inside a park, and if so, what's the space rent?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Park Name / Location..." value={formData.mhParkName} onChange={e => updateForm('mhParkName', e.target.value)} className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-gray-800 outline-none" />
                  <input type="text" placeholder="Space Rent / Fee ($)..." value={formData.mhParkFee} onChange={e => updateForm('mhParkFee', e.target.value)} className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-gray-800 outline-none" />
                </div>
                <div className="flex gap-2">
                  <button className={clsx("", formData.mh55Plus ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('mh55Plus', !formData.mh55Plus)}>55+ Community</button>
                  <button className={clsx("", formData.mh433A ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('mh433A', !formData.mh433A)}>433A (Perm Foundation)</button>
                </div>
              </div>
            )}

            {formData.propertyType === 'Land' && (
              <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl animate-slideIn">
                <p className="text-sm text-gray-800 mb-2">"Gotcha. For vacant land, the most important things we look at are utilities and zoning. Do you know what it's currently zoned for, and does it have city water and sewer?"</p>
                <input type="text" placeholder="Current Zoning (e.g. R1, Ag)..." value={formData.landZoning} onChange={e => updateForm('landZoning', e.target.value)} className="w-full bg-[var(--card-bg)]/30 backdrop-blur-md backdrop-blur-md border-2 border-white/50 rounded-lg p-2 text-[var(--text-base)] outline-none mb-2 placeholder-gray-400" />
                <div className="flex gap-2 mb-2 flex-wrap">
                  {['Water', 'Sewer', 'Electric', 'Well/Septic'].map(util => {
                    const isSelected = formData.landUtilities?.includes(util);
                    return (
                      <button key={util} className={clsx("", isSelected ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => {
                        const current = formData.landUtilities || [];
                        updateForm('landUtilities', isSelected ? current.filter(u => u !== util) : [...current, util]);
                      }}>{util}</button>
                    )

                  })}
                </div>
                <div className="flex gap-2">
                  <button className={clsx("", formData.landPaved === true ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => handleSingleSelect('landPaved', true)}>Paved Access</button>
                  <button className={clsx("", formData.landPaved === false ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => handleSingleSelect('landPaved', false)}>Dirt Road Access</button>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up: Tenant */}
            {isTenant && formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Tenant Follow-up)</span>
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-sm text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
                  "And are they currently paying on time? What are they paying in rent right now, and are they on a month-to-month or long-term lease?"
                </div>
                  
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] box-border shadow-[8px_8px_0px_#FF00FF] p-6 mb-6 rounded-none mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <input type="text" placeholder="RENT AMOUNT ($)..." value={formData.rentAmount || ''} onChange={(e) => updateForm('rentAmount', e.target.value)} className="bg-gray-100 border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-md transition-all" />
                    <input type="text" placeholder="HOW DO THEY PAY? (ZELLE, CASH)..." value={formData.rentMethod || ''} onChange={(e) => updateForm('rentMethod', e.target.value)} className="bg-gray-100 border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-md transition-all" />
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <button className={clsx("", formData.leaseType === 'M2M' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('leaseType', formData.leaseType === 'M2M' ? '' : 'M2M')}>MONTH-TO-MONTH</button>
                      <button className={clsx("", formData.leaseType === 'Lease' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('leaseType', formData.leaseType === 'Lease' ? '' : 'Lease')}>FIXED LEASE</button>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 mb-4">
                      <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Paying on Time') ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] border border-[var(--card-border)] rounded-none text-gray-800 font-black italic shadow-md" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none text-gray-800 font-bold uppercase")} 
                        onClick={() => {
                          const current = formData.tenantStatus || [];
                          updateForm('tenantStatus', current.includes('Paying on Time') ? current.filter(x => x !== 'Paying on Time') : [...current, 'Paying on Time']);
                        }}
                      >
                        PAYING ON TIME
                      </button>
                      <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Someone is Behind') ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] border border-[var(--card-border)] rounded-none text-gray-800 font-black italic shadow-md" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none text-gray-800 font-bold uppercase")} 
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
                    <div className="border-t-4 border-[var(--card-border)] pt-4 mt-6">
                       <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">IF BEHIND ON RENT:</label>
                       <div className="flex flex-wrap gap-4 items-center">
                         <input type="text" placeholder="AMOUNT BEHIND ($)..." value={formData.rentArrears || ''} onChange={(e) => updateForm('rentArrears', e.target.value)} className="bg-gray-100 border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-md transition-all w-48" />
                         <button className={"px-4 py-3 transition-all " + (formData.tenantStatus?.includes('Eviction Needed') ? "bg-[#E74C3C] border border-[var(--card-border)] rounded-none text-[var(--text-base)] font-black italic shadow-md" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none text-gray-800 font-bold uppercase")} 
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

                  {/* NEW OCCUPANCY DATA EXPANSION */}
                    <div className="border-t-4 border-[var(--card-border)] pt-4 mt-6">
                      <div className="text-gray-800 font-bold italic text-md mb-4">
                        "Just so we have the full picture on the lease... how much are you currently holding for their security deposit, who is currently paying for the utilities, and is any of that rent being subsidized by Section 8?"
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <div>
                          <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">SECURITY DEPOSIT</label>
                          <input type="text" placeholder="DEPOSIT HELD ($)..." value={formData.securityDeposit || ''} onChange={(e) => updateForm('securityDeposit', e.target.value)} className="bg-gray-100 border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-md transition-all w-full max-w-xs" />
                        </div>
  
                        <div>
                          <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">UTILITIES</label>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {['TENANT PAYS ALL', 'LANDLORD PAYS W/S/T', 'LANDLORD PAYS ALL'].map(opt => (
                              <button key={opt} onClick={() => updateForm('utilityStatus', formData.utilityStatus === opt ? '' : opt)} className={opt === formData.utilityStatus ? "px-4 py-3 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] border border-[var(--card-border)] rounded-none text-gray-800 font-black italic shadow-md transition-all" : "px-4 py-3 bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none text-gray-800 font-bold uppercase transition-all"}>{opt}</button>
                            ))}
                          </div>
                          {(formData.utilityStatus === 'LANDLORD PAYS W/S/T' || formData.utilityStatus === 'LANDLORD PAYS ALL') && (
                            <div className="mt-2 animate-slideIn">
                              <input type="text" placeholder="Landlord Cost / Mo ($)..." value={formData.landlordUtilityCost || ''} onChange={(e) => updateForm('landlordUtilityCost', e.target.value.replace(/[^0-9.]/g, ''))} className="bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-2 text-gray-800 uppercase font-bold placeholder-gray-500 focus:outline-none focus:border focus:shadow-md transition-all w-full max-w-xs" />
                            </div>
                          )}
                        </div>
  
                        <div>
                          <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">SUBSIDIES</label>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {['NO SECTION 8', 'PARTIAL SECTION 8', 'FULL SECTION 8'].map(opt => (
                              <button key={opt} onClick={() => updateForm('section8Status', formData.section8Status === opt ? '' : opt)} className={opt === formData.section8Status ? "px-4 py-3 bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] border border-[var(--card-border)] rounded-none text-gray-800 font-black italic shadow-md transition-all" : "px-4 py-3 bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none text-gray-800 font-bold uppercase transition-all"}>{opt}</button>
                            ))}
                          </div>
                          {(formData.section8Status === 'PARTIAL SECTION 8' || formData.section8Status === 'FULL SECTION 8') && (
                            <div className="mt-2 animate-slideIn">
                              <input type="text" placeholder="Section 8 Coverage / Mo ($)..." value={formData.section8Coverage || ''} onChange={(e) => updateForm('section8Coverage', e.target.value.replace(/[^0-9.]/g, ''))} className="bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-2 text-gray-800 uppercase font-bold placeholder-gray-500 focus:outline-none focus:border focus:shadow-md transition-all w-full max-w-xs" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}


            {/* Dynamic Follow-up: Vacant */}
            {isVacant && formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Vacant Follow-up)</span>
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
                  "Okay, since it's vacant, how long has it been sitting empty? Have you had any issues with squatters or break-ins that we should know about?"
                </div>
                  
                <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <input type="text" placeholder="How long vacant? (e.g., 6 months)..." value={formData.vacantLength} onChange={(e) => setFormData({...formData, vacantLength: e.target.value})} className="modern-input" style={{ width: '100%', marginBottom: '10px' }} />
                  <div className="toggles-row">
                    <button className={`toggle-pill ${formData.vacantIssues.includes('Boarded Up') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Boarded Up')}>Boarded Up</button>
                    <button className={clsx("", formData.vacantIssues.includes('Squatters') ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => handleToggle('vacantIssues', 'Squatters')}>Squatters</button>
                    <button className={clsx("", formData.vacantIssues.includes('Vandalism') ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => handleToggle('vacantIssues', 'Vandalism')}>Vandalized</button>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Follow-up: Trust/Probate */}
            {isTrust && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Trust/Probate Follow-up)</span>
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
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
            
            
            {isTenant && formData.tenantStatus.includes('Paying on Time') && formData.leaseType === 'M2M' && !formData.tenantStatus.includes('Eviction Needed') && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition)</span>
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
    "Okay, month-to-month and paying on time. We could probably just inherit them as tenants. With that in mind, what's the actual condition of the property?"
  </div>
</div>
            )}

            {isVacant && formData.propertyType !== 'Multi-Family' && (formData.vacantIssues.includes('Squatters') || formData.vacantIssues.includes('Boarded Up') || formData.vacantIssues.includes('Vandalism')) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition)</span>
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
    "Wow, sorry you're dealing with that. We buy properties with those issues all the time so we can definitely take that burden off your hands. Since we can't always get inside right away, what do you remember about the major stuff?"
  </div>
</div>
            )}

            {/* Core Condition Questions */}
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant && formData.tenantStatus.length > 0) || (isVacant && formData.vacantIssues.length > 0)) ? '1.5rem' : '2.5rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Roof & AC)</span>
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-sm rounded-none mb-8">
    
    <div className="text-xl font-black italic text-gray-800 leading-relaxed mb-6">
      "Got it. Now, to make sure my repair estimates are accurate, let's start with the roof—roughly how many years old is it, and is it holding up alright or needing some major patchwork?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-8">
        <div className="mb-4">
          <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Roof Age</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years'].map(age => (
              <button key={age} onClick={() => updateForm('roofAge', formData.roofAge === age ? '' : age)} className={clsx("", formData.roofAge === age ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{age}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Roof Condition</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'Roof: Good ($0/sqft)', mult: 0}, {label: 'Roof: Needs Overlay ($4/sqft)', mult: 4}, {label: 'Roof: Full Tear-Off ($8/sqft)', mult: 8}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfRoof === opt.label) { updateForm('sfRoof', ''); updateForm('roofMult', 0); } else { updateForm('sfRoof', opt.label); updateForm('roofMult', opt.mult); } }} className={clsx("", formData.sfRoof === opt.label ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    )}

    <div className="mt-8 pt-6 border-t-2 border-[var(--card-border)] text-xl font-black italic text-gray-800 leading-relaxed mb-6">
      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <div className="mb-4">
          <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">HVAC Age</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years'].map(age => (
              <button key={age} onClick={() => updateForm('hvacAge', formData.hvacAge === age ? '' : age)} className={clsx("", formData.hvacAge === age ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{age}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">HVAC Status</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'AC: Good ($0/sqft)', mult: 0}, {label: 'AC: Condenser Unit Only ($6.5k)', mult: 0}, {label: 'AC: Full System + Ducts ($7/SQFT)', mult: 0}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfHVAC === opt.label) { updateForm('sfHVAC', ''); updateForm('hvacMult', 0); } else { updateForm('sfHVAC', opt.label); updateForm('hvacMult', opt.mult); } }} className={clsx("", formData.sfHVAC === opt.label ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
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
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
    "Got it. Don't worry too much about that, we deal with replacing those all the time."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Plumbing & Electrical)</span>
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] rounded-none mb-8">
    <div className="text-gray-800 font-black italic text-lg mb-4">
      "Okay, and for the plumbing, is that original or have you ever had to repipe the house?"
    </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6">
        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Plumbing Age</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('plumbingAge', formData.plumbingAge === opt ? '' : opt)} className={clsx("", formData.plumbingAge === opt ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
          ))}
        </div>

        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Plumbing Condition</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: 'Copper/PEX ($0/sqft)', mult: 0}, {label: 'Minor Leaks / Patch ($2/sqft)', mult: 2}, {label: 'Needs Full Repipe ($5/sqft)', mult: 5}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfPlumbing === opt.label) { updateForm('sfPlumbing', ''); updateForm('plumbingMult', 0); } else { updateForm('sfPlumbing', opt.label); updateForm('plumbingMult', opt.mult); } }} className={clsx("", formData.sfPlumbing === opt.label ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
          ))}
        </div>

        <div className="text-gray-800 font-bold italic text-md mt-6 mb-2">
          "While we're talking about the plumbing, do you happen to know if the water heater is relatively new, or is it getting up there in age?"
        </div>
        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Water Heater</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: '0-5 YEARS / GOOD ($0)', flatAdd: 0}, {label: '5-10 YEARS / AGING ($1,000)', flatAdd: 1000}, {label: '10+ YEARS / DEAD ($2,000)', flatAdd: 2000}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfWaterHeater === opt.label) { updateForm('sfWaterHeater', ''); updateForm('waterHeaterMult', 0); } else { updateForm('sfWaterHeater', opt.label); updateForm('waterHeaterMult', opt.flatAdd); } }} className={clsx("", formData.sfWaterHeater === opt.label ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}

    <div className="border-t-2 border-[var(--card-border)] pt-6 mt-6">
      <div className="text-gray-800 font-black italic text-lg mb-4">
        "Got it. And what about the electrical system? Is that still original or have you ever had to update the panel or the wiring throughout the house?"
      </div>
    </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Electrical Age</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('electricalAge', formData.electricalAge === opt ? '' : opt)} className={clsx("", formData.electricalAge === opt ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
          ))}
        </div>

        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Electrical Condition</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: 'Updated System ($0/sqft)', mult: 0}, {label: 'Panel Upgrade Needed ($3k)', mult: 0}, {label: 'Needs Full Rewire ($5/SQFT + Panel)', mult: 0}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfElectrical === opt.label) { updateForm('sfElectrical', ''); updateForm('electricalMult', 0); } else { updateForm('sfElectrical', opt.label); updateForm('electricalMult', opt.mult); } }} className={clsx("", formData.sfElectrical === opt.label ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
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
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-sm text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
    "Okay, yeah, we usually end up having to repipe and rewire those older setups anyway, so that's not a deal breaker."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
              <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Utilities & Exterior)</span>
              <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFFF00] rounded-none mb-8">
                
                <div className="text-gray-800 font-black italic text-lg mb-4">
                  "Is the property on city sewer or are they on a septic system?"
                </div>
              
                <div className="mb-6">
                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Sewer / Septic</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['City Sewer', 'Septic System'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('septicSewer', formData.septicSewer === opt ? '' : opt)} 
                        className={clsx("", formData.septicSewer === opt ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {formData.septicSewer === 'Septic System' && (
                    <div className="mt-4 mb-4">
                      <div className="text-gray-800 font-bold italic text-md mt-4 mb-2">
                        "And do you know roughly when the last time it was pumped or inspected was?"
                      </div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Recently Pumped', 'Aging (5+ Years)', 'Unknown / Never Pumped'].map(opt => (
                          <button key={opt} onClick={() => updateForm('septicCondition', formData.septicCondition === opt ? '' : opt)} className={clsx("", formData.septicCondition === opt ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-[var(--card-border)] pt-6 mt-6">
                    <div className="text-gray-800 font-black italic text-lg mb-4 flex items-center gap-2">
                      <span>"Also, are there any solar panels on the roof?"</span>
                      <div className="relative group inline-block">
                        <button className="text-[10px] bg-[var(--card-bg)]/80 text-[#FFFF00] px-2 py-0.5 rounded font-black uppercase shadow-[2px_2px_0px_#FFFF00] hover:-translate-y-0.5 transition-transform">
                          [?] LEASE VS PPA
                        </button>
                        <div className="absolute left-0 bottom-full mb-2 w-72 bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-3 text-xs text-gray-800 font-normal not-italic shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          <strong>Quick Explainer:</strong> A standard LEASE is a fixed monthly payment to rent the equipment. A PPA (Power Purchase Agreement) means the homeowner buys the actual power the panels produce at a set rate, meaning their bill fluctuates depending on the season.
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Solar panels</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['No Solar', 'Solar (Owned)', 'Solar (Lease)', 'Solar (PPA)'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('solarSystem', formData.solarSystem === opt ? '' : opt)} 
                        className={clsx("", formData.solarSystem === opt ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {(formData.solarSystem && formData.solarSystem !== 'No Solar') && (
                    <div className="mb-4">
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Solar Age</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Brand New (0-5 Yrs)', 'Mid-Life (5-15 Yrs)', 'Older (15+ Yrs)'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAge', formData.solarAge === opt ? '' : opt)} className={clsx("", formData.solarAge === opt ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(formData.solarSystem === 'Solar (Lease)' || formData.solarSystem === 'Solar (PPA)') && (
                    <div className="mt-4">
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Solar Lease Details</label>
                      <div className="grid grid-cols-2 gap-6 mt-4">
                        <input type="text" value={formData.solarCompany || ''} onChange={(e) => updateForm('solarCompany', e.target.value)} placeholder="SOLAR COMPANY NAME" className="bg-gray-100 border-2 border-[var(--card-border)] p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2 sm:col-span-1" />
                        <input type="text" value={formData.solarMonthlyPayment || ''} onChange={(e) => updateForm('solarMonthlyPayment', e.target.value.replace(/[^0-9]/g, ''))} placeholder="MONTHLY PAYMENT $" className="bg-gray-100 border-2 border-[var(--card-border)] p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2 sm:col-span-1" />
                        <input type="text" value={formData.solarPayoffAmount || ''} onChange={(e) => updateForm('solarPayoffAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="TOTAL PAYOFF BALANCE $" className="bg-gray-100 border-2 border-[var(--card-border)] p-3 text-gray-800 uppercase font-bold placeholder-gray-600 focus:outline-none focus:border focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all col-span-2" />
                      </div>

                      <div className="text-gray-800 font-bold italic text-sm mt-4 mb-2 flex items-center gap-2">
                        <span>"Is the contract assumable by a new buyer?"</span>
                        <div className="relative group inline-block">
                          <button className="text-[10px] bg-[var(--card-bg)]/80 text-[#FFFF00] px-2 py-0.5 rounded font-black uppercase shadow-[2px_2px_0px_#FFFF00] hover:-translate-y-0.5 transition-transform">
                            [?] Explain Assumable
                          </button>
                          <div className="absolute left-0 bottom-full mb-2 w-64 bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-3 text-xs text-gray-800 not-italic font-normal shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            <strong>ASSUMABLE:</strong> The new buyer takes over the monthly payments. <br/><br/>
                            <strong>MUST PAYOFF:</strong> The seller must pay off the entire remaining balance at closing from their proceeds.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Yes (Assumable)', 'No (Must Payoff)', 'Unknown'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAssumable', formData.solarAssumable === opt ? '' : opt)} className={clsx("", formData.solarAssumable === opt ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Cosmetics & Inside)</span>
    <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] rounded-none mb-8">
      <div className="text-xl font-black italic text-gray-800 leading-relaxed mb-6">
      {formData.propertyType === 'Multi-Family' ? 
                    "Got it. And as far as the inside of the units go... are the kitchens and bathrooms fairly modern across the board, or are they a bit more dated and in need of some work?" :
                   formData.cosmeticsKitchen.length > 0 && formData.cosmeticsBaths.length > 0 ? "You already gave me a good idea of the kitchen and bath conditions..." :
                   hasMajorRepairs
                    ? "Makes sense. It sounds like the house just needs some TLC, which is totally fine—that's what we do. As for the inside, have you updated the kitchens or the bathrooms, or are those mostly original?"
                    : "So it sounds like the bones of the house are pretty solid... as far as the inside goes, if I walked through the front door today, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                  }
      </div>
  
  {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6 animate-slideIn">
        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Kitchen Condition</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'Turnkey / Clean'}, {label: 'Dated / Livable'}, {label: 'Needs Heavy Rehab'}].map(opt => (
              <button key={`k-${opt.label}`} onClick={() => { updateForm('cosmeticsKitchen', opt.label); }} className={clsx("", formData.cosmeticsKitchen === opt.label ? "bg-[var(--card-bg)]/60 border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
            ))}
          </div>
          
          {(() => {
            const bathsCount = Math.ceil(parseFloat(String(formData.baths || '1').replace(/[^0-9.]/g, '')) || 1);
            const bathData = formData.cosmeticsBathsData || {};
            
            return Array.from({length: bathsCount}).map((_, i) => (
              <div key={`bath-${i}`} className="mb-4 animate-slideIn">
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Bath {i + 1} Condition</label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {[{label: 'Turnkey / Clean'}, {label: 'Dated / Livable'}, {label: 'Needs Heavy Rehab'}].map(opt => (
                    <button key={`b-${i}-${opt.label}`} onClick={() => { 
                      const newData = {...bathData, [i]: opt.label};
                      updateForm('cosmeticsBathsData', newData); 
                    }} className={clsx("", bathData[i] === opt.label ? "bg-[var(--card-bg)]/60 border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt.label}</button>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
  </div>
</div>
  
              {/* Toggles moved to sidebar */}
  
              {/* Dynamic Reaction 3 */}
              {(formData.cosmeticsKitchen.includes('Heavy Rehab') || Object.values(formData.cosmeticsBathsData || {}).some(v => typeof v === 'string' && v.includes('Heavy Rehab'))) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Reaction)</span>
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFE600] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-8">
    "Gotcha. Sounds like it needs some pretty heavy cosmetic love. That's right up our alley."
  </div>
</div>
            )}

        {formData.propertyType !== 'Multi-Family' && (
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-sm rounded-none mb-8 mt-12">
                  <div className="absolute top-0 left-0 bg-[var(--card-bg)]/80 text-[var(--text-base)] font-semibold tracking-wide tracking-widest px-4 py-1 uppercase text-sm -translate-y-1/2 translate-x-4 border-2 border-white shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    AGENT (AMENITIES & HOA)
                  </div>
                  
                  <div className="text-gray-800 font-black italic text-lg mb-6 leading-tight">
                    "Perfect. And just for my own records as I'm writing this up, is there a pool in the backyard, and is the property part of an active HOA?"
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Pool</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has Pool', 'No Pool'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityPool', opt)} className={clsx("", formData.amenityPool === opt ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">HOA Status</label>
                      <div className="flex flex-wrap gap-3">
                        {['Active HOA', 'No HOA'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityHOA', opt)} className={clsx("", formData.amenityHOA === opt ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    {formData.amenityHOA === 'Active HOA' && (
                      <div className="animate-slideIn">
                        <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">HOA Monthly Fee $</label>
                        <input type="number" placeholder="e.g. 250" value={formData.hoaMonthlyFee || ''} onChange={e => updateForm('hoaMonthlyFee', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-none p-3 text-gray-800 focus:outline-none focus:shadow-md font-black uppercase transition-all" />
                      </div>
                    )}

                    <div>
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">RV Parking / Hookups</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has RV Parking', 'No RV Parking'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityRV', opt)} className={clsx("", formData.amenityRV === opt ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Guest House / Casita</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has Guest House', 'No Guest House'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityGuestHouse', opt)} className={clsx("", formData.amenityGuestHouse === opt ? "bg-[var(--card-bg)]/60 text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Structure & Risk)</span>
  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-sm rounded-none mb-8">
    <div className="text-xl font-black italic text-gray-800 leading-relaxed mb-6">
    "Okay, that gives me a great picture of the inside. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in?"
    </div>

  {formData.propertyType !== 'Multi-Family' && (
    <div className="mb-6 animate-slideIn">
      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Structural Red Flags / Unpermitted Work</label>
      
              <div className="mb-6">
                <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">MAJOR RED FLAGS (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {['Foundation / Structural Issues', 'Unpermitted Additions / ADU', 'Fire Damage', 'Water Damage / Mold', 'City Code Violations / Red Tags', 'Known Liens / Judgments'].map(flag => {
                    const isSelected = formData.majorRedFlags?.includes(flag);
                    return (
                      <button 
                        key={flag}
                        onClick={() => {
                          const current = formData.majorRedFlags || [];
                          updateForm('majorRedFlags', isSelected ? current.filter(f => f !== flag) : [...current, flag]);
                        }} 
                        className={clsx("", isSelected ? "bg-[#E74C3C] border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}
                      >
                        {flag}
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  {formData.majorRedFlags?.includes('Foundation / Structural Issues') && (
                    <div className="bg-red-50 p-4 border border-[#E74C3C] animate-slideIn">
                      <div className="text-gray-800 font-black italic mb-3">"You mentioned the foundation—are we talking about standard hairline cracks, or has there been major sinking and shifting?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Minor Settling / Cracks', 'Major Sinking / Shifting'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFoundation', opt)} className={clsx("", formData.redFlagFoundation === opt ? "bg-[#E74C3C] border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>

                      {formData.redFlagFoundation === 'Minor Settling / Cracks' && (
                        <div className="mt-4 animate-slideIn">
                          <div className="text-gray-800 font-bold italic mb-2 text-sm">"Got it, so just typical hairline cracks, nothing the city has ever been involved with or required underpinning for?"</div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {['Typical Settling (No Action)', 'Previously Repaired/Underpinned'].map(opt => (
                              <button key={opt} onClick={() => updateForm('redFlagFoundationDetails', opt)} className={clsx("", formData.redFlagFoundationDetails === opt ? "bg-[#FFFF00] border-2 border-[var(--card-border)] text-gray-800 font-bold text-xs uppercase px-3 py-1 cursor-pointer" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-600 font-bold text-xs uppercase px-3 py-1 cursor-pointer")}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.redFlagFoundation === 'Major Sinking / Shifting' && (
                        <div className="mt-4 animate-slideIn">
                          <div className="text-gray-800 font-bold italic mb-2 text-sm">"Since it's major shifting, has a structural engineer looked at it, or is the floor visibly slanting?"</div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {['Engineer Report Available', 'Visible Slant / Unassessed'].map(opt => (
                              <button key={opt} onClick={() => updateForm('redFlagFoundationDetails', opt)} className={clsx("", formData.redFlagFoundationDetails === opt ? "bg-[#FFFF00] border-2 border-[var(--card-border)] text-gray-800 font-bold text-xs uppercase px-3 py-1 cursor-pointer" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-600 font-bold text-xs uppercase px-3 py-1 cursor-pointer")}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Unpermitted Additions / ADU') && (
                    <div className="bg-red-50 p-4 border border-[#E74C3C] animate-slideIn">
                      <div className="text-gray-800 font-black italic mb-3">"For that unpermitted space, what exactly was added, and roughly how many square feet is it?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Garage Conversion', 'Room Addition', 'Full ADU / Casita', 'Enclosed Patio'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagADUType', opt)} className={clsx("", formData.redFlagADUType === opt ? "bg-[#E74C3C] border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3">
                        <input type="number" placeholder="EST. SQFT ADDED" value={formData.redFlagADUSqft || ''} onChange={(e) => updateForm('redFlagADUSqft', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-3 font-black uppercase text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Fire Damage') && (
                    <div className="bg-red-50 p-4 border border-[#E74C3C] animate-slideIn">
                      <div className="text-gray-800 font-black italic mb-3">"With the fire damage, was it mostly cosmetic smoke damage, or did it burn into the structural framing?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Cosmetic / Smoke Only', 'Structural / Framing Damage'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFire', opt)} className={clsx("", formData.redFlagFire === opt ? "bg-[#E74C3C] border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>

                      {formData.redFlagFire === 'Cosmetic / Smoke Only' && (
                        <div className="flex flex-wrap gap-2 mt-4 animate-slideIn">
                          {['Professionally Mitigated', 'Needs Smoke Remediation / Paint', 'Active Insurance Claim'].map(opt => (
                            <button key={opt} onClick={() => updateForm('redFlagFireDetails', opt)} className={clsx("", formData.redFlagFireDetails === opt ? "bg-[#FFFF00] border-2 border-[var(--card-border)] text-gray-800 font-bold text-xs uppercase px-3 py-1 cursor-pointer" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-600 font-bold text-xs uppercase px-3 py-1 cursor-pointer")}>{opt}</button>
                          ))}
                        </div>
                      )}

                      {formData.redFlagFire === 'Structural / Framing Damage' && (
                        <div className="flex flex-wrap gap-2 mt-4 animate-slideIn">
                          {['Red Tagged / Condemned', 'Meters Pulled By City', 'Total Tear Down', 'Active Insurance Claim'].map(opt => (
                            <button key={opt} onClick={() => updateForm('redFlagFireDetails', opt)} className={clsx("", formData.redFlagFireDetails === opt ? "bg-[#FFFF00] border-2 border-[var(--card-border)] text-gray-800 font-bold text-xs uppercase px-3 py-1 cursor-pointer" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-600 font-bold text-xs uppercase px-3 py-1 cursor-pointer")}>{opt}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Water Damage / Mold') && (
                    <div className="bg-red-50 p-4 border border-[#E74C3C] animate-slideIn">
                      <div className="text-gray-800 font-black italic mb-3">"For the water/mold issue—is there still an active leak or standing water, or is it an old leak that has completely dried out?"</div>
                      <div className="flex flex-wrap gap-3">
                        {['Active Leak / Standing Water', 'Dried Out / Past Leak', 'Visible Mold Present', 'Professional Remediation Done', 'Active Insurance Claim'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagWaterStatus', opt)} className={clsx("", formData.redFlagWaterStatus === opt ? "bg-[#E74C3C] border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('City Code Violations / Red Tags') && (
                    <div className="bg-red-50 p-4 border border-[#E74C3C] animate-slideIn">
                      <div className="text-gray-800 font-black italic mb-3">"Since the city is involved, do you know if there are any active fines or daily penalties adding up?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Active Fines Accumulating', 'Stop Work Order', 'Red Tagged'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFinesStatus', opt)} className={clsx("", formData.redFlagFinesStatus === opt ? "bg-[#E74C3C] border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                      <input type="number" placeholder="CURRENT FINE AMOUNT $" value={formData.redFlagFines || ''} onChange={(e) => updateForm('redFlagFines', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-3 font-black uppercase text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Known Liens / Judgments') && (
                    <div className="bg-red-50 p-4 border border-[#E74C3C] animate-slideIn">
                      <div className="text-gray-800 font-black italic mb-3">"I appreciate you being upfront about that. Just so our title team knows what they are looking at when we pull the records, what kind of lien is it, and do you know roughly what the payoff amount is?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Tax Lien (Property/IRS)', 'Mechanic\'s Lien (Contractor)', 'HOA Lien', 'Child Support/Alimony', 'Mortgage Judgment'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagLienType', opt)} className={clsx("", formData.redFlagLienType === opt ? "bg-[#E74C3C] border border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")}>{opt}</button>
                        ))}
                      </div>
                      <input type="number" placeholder="EST. PAYOFF AMOUNT $" value={formData.redFlagLienAmount || ''} onChange={(e) => updateForm('redFlagLienAmount', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-3 font-black uppercase text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

                  </div>
                </div>
              )}
  
              {currentStep === 2 && (
              <div className="mt-12 mb-8 flex justify-center">
                  <button 
                    onClick={() => {
                      handleProceed(3);
                      setTimeout(() => {
                        document.getElementById('pillar-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 350);
                    }}
                    className="w-full max-w-lg py-4 bg-[#FF00FF] text-[#000000] uppercase font-black italic text-2xl tracking-widest border-2 border-[#000000] rounded-none shadow-md hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
                  >
                    PROCEED TO PILLAR 3 &rarr;
                  </button>
                </div>
            )}
          </div>
        ))}

        {/* PILLAR 3: ESCROW TIMELINE & LOGISTICS */}
        {activeSource !== 'Agent Outreach' && renderPillar(3, "Escrow Timeline & Logistics", <Clock size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="bg-[#fffdf0] border border-[var(--card-border)] p-6 shadow-md relative mt-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[var(--card-bg)]/60 border border-[var(--card-border)] transition-all duration-300 - z-20 backdrop-blur-sm shadow-sm" style={{clipPath: "polygon(0 10%, 100% 0, 95% 100%, 5% 90%)"}}></div>
              
              {/* TIMELINE */}
              <div className="flex flex-col mb-8 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Timeline)</span>
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFFF00] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6">
                  {formData.tenantStatus?.includes('Eviction Needed') 
                    ? "Okay, I've got enough here on the condition. Since we are factoring in you handling the eviction, we'll need to build in enough time for the legal notice period and the court process. We usually set escrow for 60 to 90 days to give you a safe buffer. How does that sound?"
                    : "Okay, assuming we can make the numbers work, what does your ideal timeline look like? Are you looking to move ASAP, or do you need a minute to figure things out?"}
                </div>
                
                <div className="mb-2">
                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Target Timeline</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {(formData.tenantStatus?.includes('Eviction Needed') 
                      ? ['POST-EVICTION (60-90 DAYS)', 'EXTENDED EVICTION (90+ DAYS)']
                      : ['ASAP (7-14 DAYS)', 'STANDARD (30 DAYS)', 'NEEDS TIME (60+ DAYS)', 'CONCURRENT CLOSE']
                    ).map(opt => (
                      <button 
                        key={opt}
                        onClick={() => {
                          updateForm('timelineType', opt);
                          let daysToAdd = 0;
                          if (opt.includes('14 DAYS')) daysToAdd = 14;
                          else if (opt.includes('30 DAYS')) daysToAdd = 30;
                          else if (opt.includes('60+ DAYS') || opt.includes('60-90 DAYS')) daysToAdd = 60;
                          else if (opt.includes('90+ DAYS')) daysToAdd = 90;

                          if (daysToAdd > 0) {
                            const targetDate = new Date();
                            targetDate.setDate(targetDate.getDate() + daysToAdd);
                            updateForm('targetClosingDate', targetDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
                          } else {
                            updateForm('targetClosingDate', 'TBD');
                          }
                        }} 
                        className={clsx(
                          "px-5 py-2 text-sm font-semibold tracking-wide tracking-widest uppercase transition-all transition-all duration-300 -", 
                          formData.timelineType === opt 
                            ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] transition-all duration-300 - shadow-md font-black italic" 
                            : "bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] shadow-none hover:-translate-y-0.5"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {formData.targetClosingDate && formData.targetClosingDate !== 'TBD' && formData.timelineType !== 'CONCURRENT CLOSE' && (
                    <div className="mt-2 mb-4 p-3 bg-[var(--card-bg)] border border-[var(--card-border)] inline-block font-black uppercase text-lg shadow-sm animate-slideIn">
                      Calculated Target Date: <span className="text-[#D4AF37] ml-2">{formData.targetClosingDate}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RELOCATION */}
              <div className="flex flex-col mb-8 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Relocation)</span>
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFFF00] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6">
                  "And where are you guys heading next? Are you staying local or leaving state?"
                </div>
                
                <div className="mb-2">
                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Relocation Destination</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['Staying Local', 'Out of State'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('relocationType', opt)} 
                        className={clsx(
                          "px-5 py-2 text-sm font-semibold tracking-wide tracking-widest uppercase transition-all transition-all duration-300 -", 
                          formData.relocationType === opt 
                            ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] transition-all duration-300 - shadow-md font-black italic" 
                            : "bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] shadow-none hover:-translate-y-0.5"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {formData.relocationType && (
                    <input 
                      type="text" 
                      placeholder="Destination City/State..." 
                      value={formData.relocationDestination || ''} 
                      onChange={(e) => updateForm('relocationDestination', e.target.value)} 
                      className="w-full max-w-md bg-[var(--card-bg)] border border-[var(--card-border)] p-3 text-gray-800 font-bold uppercase outline-none focus:border-white/50 shadow-md" 
                    />
                  )}
                </div>
              </div>

              {/* EARLY FUNDS */}
              <div className="flex flex-col animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Cash to Move / Post-Possession)</span>
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FFFF00] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6">
                  "Got it. So just to clarify, we don't actually release funds early. Generally, how our process works if you need cash to move is we close while you're still in the property. This releases partial funds to you immediately, we give you time to move out, and the rest stays in escrow until the property is vacant. Would you need to stay in the property after closing to get cash to move?"
                </div>
                
                <div className="mb-2">
                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Post-Possession / Cash to Move</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['Needs Cash to Move', 'Does Not Need'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('earlyRelease', opt)} 
                        className={clsx(
                          "px-5 py-2 text-sm font-semibold tracking-wide tracking-widest uppercase transition-all transition-all duration-300 -", 
                          formData.earlyRelease === opt 
                            ? "bg-[#FFFF00] text-gray-800 border border-[var(--card-border)] transition-all duration-300 - shadow-md font-black italic" 
                            : "bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] shadow-none hover:-translate-y-0.5"
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {formData.earlyRelease === 'Needs Cash to Move' && (
                    <div className="mt-4 p-4 border-2 border-[var(--card-border)] bg-gray-100 shadow-inner animate-slideIn">
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Time Needed After Close</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['1 Week', '2 Weeks', 'Need Further Approval'].map(time => (
                          <button 
                            key={time}
                            onClick={() => updateForm('postPossessionTime', formData.postPossessionTime === time ? '' : time)} 
                            className={clsx(
                              "px-4 py-2 text-xs font-black uppercase transition-all shadow-md", 
                              formData.postPossessionTime === time 
                                ? "bg-[var(--card-bg)]/60 text-[var(--text-base)] border-2 border-[var(--card-border)]" 
                                : "bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] hover:-translate-y-0.5"
                            )}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
                className="w-full max-w-lg py-4 bg-[#FFFF00] text-[#000000] uppercase font-black italic text-2xl tracking-widest border border-[#000000] rounded-none shadow-md hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
              >
                PROCEED TO PILLAR 4 &rarr;
              </button>
            </div>
          </div>
        ))}

        {/* PILLAR 4: FINANCIALS & DEBT */}
        {activeSource !== 'Agent Outreach' && renderPillar(4, "Financials & Debt", <DollarSign size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="bg-[#fffdf0] border border-[var(--card-border)] p-6 shadow-md relative mt-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[var(--card-bg)]/60 border border-[var(--card-border)] transition-all duration-300 - z-20 backdrop-blur-sm shadow-sm" style={{clipPath: "polygon(0 10%, 100% 0, 95% 100%, 5% 90%)"}}></div>

              <div className="flex flex-col mb-6 animate-slideIn">
                <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Transition to Financials)</span>
                <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6">
                  {formData.askingPrice 
                    ? `"Perfect. Now, circling back to that $${Number(formData.askingPrice.toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice} number you mentioned earlier... to make sure this actually puts what you need in your pocket, is the property owned free and clear, or is there an existing mortgage we're paying off at closing?"`
                    : `"Perfect. Now, if we can make the numbers work and give you that certainty, we cover all the title and escrow fees, so whatever number we end up at is exactly what you walk away with cleanly. Just so I can do the exact math... is the property owned free and clear, or is there an existing mortgage or any liens that need to be paid off at closing?"`
                  }
                </div>
              </div>

              <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <button 
                    onClick={() => updateForm('freeAndClear', true)}
                    className={clsx(
                      "flex-1 px-5 py-4 text-sm font-semibold tracking-wide tracking-widest uppercase transition-all transform", 
                      formData.freeAndClear === true 
                        ? "bg-[#D4AF37] text-gray-800 border border-[var(--card-border)] shadow-md font-black italic -" 
                        : "bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] shadow-none hover:-translate-y-0.5 -"
                    )}
                  >
                    Property is Free & Clear
                  </button>
                  <button 
                    onClick={() => updateForm('freeAndClear', false)}
                    className={clsx(
                      "flex-1 px-5 py-4 text-sm font-semibold tracking-wide tracking-widest uppercase transition-all transform", 
                      formData.freeAndClear === false 
                        ? "bg-[#E74C3C] text-[var(--text-base)] border border-[var(--card-border)] shadow-md font-black italic -" 
                        : "bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] shadow-none hover:-translate-y-0.5 -"
                    )}
                  >
                    Has Existing Mortgage / Liens
                  </button>
                </div>

                {formData.freeAndClear === false && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideIn mb-6">
                    <div className="flex flex-col">
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">1st Mortgage Balance $</label>
                      <input type="text" value={formData.mortgageBalance || ''} onChange={(e) => updateForm('mortgageBalance', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">2nd Position / HELOC $</label>
                      <input type="text" value={formData.secondPosition || ''} onChange={(e) => updateForm('secondPosition', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Additional Liens $</label>
                      <input type="text" value={formData.thirdPosition || ''} onChange={(e) => updateForm('thirdPosition', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-3 text-gray-800 uppercase font-bold placeholder-gray-400 focus:outline-none focus:border-white/50 focus:shadow-md transition-all" />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Arrears / Behind Amount $</label>
                      <input type="text" value={formData.arrearsAmount || ''} onChange={(e) => updateForm('arrearsAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="0" className="w-full bg-red-50 border-2 border-[#E74C3C] rounded-none p-3 text-gray-800 uppercase font-black placeholder-gray-400 focus:outline-none focus:border focus:shadow-[4px_4px_0px_#E74C3C] transition-all" />
                    </div>
                  </div>
                )}
                
                {(() => {
                  const m1 = parseInt(formData.mortgageBalance || 0, 10);
                  const m2 = parseInt(formData.secondPosition || 0, 10);
                  const m3 = parseInt(formData.thirdPosition || 0, 10);
                  const arr = parseInt(formData.arrearsAmount || 0, 10);
                  const totalDebt = formData.freeAndClear ? 0 : (m1 + m2 + m3 + arr);
                  const evictionPenalty = formData.tenantStatus?.includes('Eviction Needed') ? 15000 : 0;
                  const estimatedNetToSeller = totalMAO - evictionPenalty - totalDebt;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 shadow-md text-center">
                        <span className="uppercase font-black text-sm text-[var(--text-muted)] block mb-1">Total Est. Debt</span>
                        <span className="text-[#E74C3C] font-black text-4xl tracking-tighter drop-shadow-sm">
                          ${totalDebt.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-4 shadow-sm text-center transition-all duration-300 ">
                        <span className="uppercase font-black text-sm text-[#00E5FF] drop-shadow-md block mb-1">Net To Seller (Cash Offer)</span>
                        <span className={clsx("font-black text-4xl tracking-tighter drop-shadow-sm", estimatedNetToSeller < 0 ? "text-[#E74C3C]" : "text-[#D4AF37]")}>
                          {estimatedNetToSeller < 0 ? '-' : ''}${Math.abs(estimatedNetToSeller).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })()}

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
                className="w-full max-w-lg py-4 bg-[#D4AF37] text-[#000000] uppercase font-black italic text-2xl tracking-widest border border-[#000000] rounded-none shadow-md hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3"
              >
                PROCEED TO PILLAR 5 &rarr;
              </button>
            </div>
          </div>
        ))}

        {/* PILLAR 5: THE OFFER PIVOT */}
        {activeSource !== 'Agent Outreach' && renderPillar(5, "The Offer (Pivot)", <HeartHandshake size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col sm:flex-row gap-4 mb-2">
               <button 
                 className={clsx(
                   "flex-1 p-6 text-xl font-semibold tracking-wide tracking-widest uppercase transition-all transform", 
                   formData.pitchType === 'cash' 
                     ? "bg-[#D4AF37] text-gray-800 border border-[var(--card-border)] shadow-md font-black italic -" 
                     : "bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] shadow-none hover:-translate-y-0.5 -"
                 )}
                 onClick={() => updateForm('pitchType', 'cash')}
               >
                 CASH OFFER PITCH
               </button>
               <button 
                 className={clsx(
                   "flex-1 p-6 text-xl font-semibold tracking-wide tracking-widest uppercase transition-all transform", 
                   formData.pitchType === 'creative' 
                     ? "bg-[#FF00FF] text-[var(--text-base)] border border-[var(--card-border)] shadow-md font-black italic -" 
                     : "bg-[var(--card-bg)] text-gray-800 border-2 border-[var(--card-border)] shadow-none hover:-translate-y-0.5 -"
                 )}
                 onClick={() => updateForm('pitchType', 'creative')}
               >
                 CREATIVE / SUB-TO PITCH
               </button>
            </div>

            <div className="bg-[#fffdf0] border border-[var(--card-border)] p-6 shadow-md relative mt-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-[var(--card-bg)]/60 border border-[var(--card-border)] transition-all duration-300 - z-20 backdrop-blur-sm shadow-sm" style={{clipPath: "polygon(0 10%, 100% 0, 95% 100%, 5% 90%)"}}></div>

              {formData.pitchType === 'creative' ? (
                <div className="flex flex-col mb-2 animate-slideIn">
                  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (Creative Pivot)</span>
                  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#FF00FF] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6">
                    "Okay, so based on the math, a cash offer is going to be too low for you. BUT, if you're willing to be a little flexible on terms, I can get you much closer to your retail asking price. If we agree on your price, would you be open to letting us take over the existing mortgage payments and paying you out your equity?"
                  </div>
                </div>
              ) : (
                <div className="flex flex-col mb-2 animate-slideIn">
                  <span className="text-xs font-bold mb-1 tracking-wider uppercase text-[#00E5FF]">Agent (The Pitch)</span>
                  <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-[8px_8px_0px_#D4AF37] text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6">
                    "Okay, based on the math... Since we're paying cash, buying it completely as-is, and covering all of your closing costs... we're coming in right around <span className="text-[#D4AF37] font-black bg-[var(--card-bg)]/80 px-2 mx-1 border-2 border-[var(--card-border)] shadow-[2px_2px_0px_#D4AF37] transition-all duration-300 inline-block ">${(totalMAO || 0).toLocaleString()}</span>. Would it be a ridiculous idea to consider an offer in that ballpark?"
                  </div>
                </div>
              )}
              
              {/* Offer Rebuttals */}
              <div className="mt-8 border-t-4 border-[var(--card-border)] pt-6">
                 <div className="text-gray-800 font-black uppercase text-sm mb-4">Offer Rebuttals</div>
                 <div className="flex flex-wrap gap-3 mb-4">
                   <button className={clsx("", formData.activeObjection === 'too_low' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'too_low' ? null : 'too_low')}>
                     "That's too low"
                   </button>
                   <button className={clsx("", formData.activeObjection === 'think_about_it' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'think_about_it' ? null : 'think_about_it')}>
                     "I need to think about it"
                   </button>
                   <button className={clsx("", formData.activeObjection === 'other_offers' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'other_offers' ? null : 'other_offers')}>
                     "I have higher offers"
                   </button>
                   <button className={clsx("", formData.activeObjection === 'spouse' ? "bg-gradient-to-r from-[#CD7F32] via-[#E5C158] to-[#B8860B] text-gray-800 border border-[var(--card-border)] font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform" : "bg-[var(--card-bg)] border-2 border-[var(--card-border)] text-gray-800 font-black text-xs uppercase px-4 py-2 cursor-pointer shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform")} onClick={() => updateForm('activeObjection', formData.activeObjection === 'spouse' ? null : 'spouse')}>
                     "Need to talk to spouse"
                   </button>
                 </div>

                 {formData.activeObjection === 'too_low' && (
                   <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-md text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6 animate-slideIn">
                     {formData.askingPrice && Number(formData.askingPrice.toString().replace(/[^0-9.-]+/g,"")) > totalMAO ? (
                       `"I completely understand. You wanted $${Number(formData.askingPrice.toString().replace(/[^0-9.-]+/g,"")).toLocaleString()} and we're at $${totalMAO.toLocaleString()}. If we could get up to your number, we absolutely would. But taking into consideration the cost of the updates, the holding costs, and paying all the closing fees... that's realistically where we need to be to make it make sense. Are we miles apart, or is there a number closer to that where we could shake hands?"`
                     ) : (
                       `"I completely understand. If we could get up to your number, we absolutely would. But taking into consideration the cost of the updates, the holding costs, and paying all the closing fees... that's realistically where we need to be to make it make sense. Are we miles apart, or is there a number closer to that where we could shake hands?"`
                     )}
                   </div>
                 )}

                 {formData.activeObjection === 'think_about_it' && (
                   <div className="mb-6 animate-slideIn">
                     <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-md text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-4">
                       "Absolutely, taking your time makes total sense. Usually when people need to think about it, there's a specific concern holding them back—is it the price, the timeline, or something else?"
                     </div>
                     <div className="flex flex-col bg-gray-100 border-2 border-[var(--card-border)] p-4">
                       <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Primary Concern</label>
                       <div className="flex flex-wrap gap-3 mb-4">
                         {['Price', 'Timeline', 'Something Else'].map(concern => (
                           <button 
                             key={concern}
                             onClick={() => updateForm('thinkAboutItConcern', concern)}
                             className={clsx(
                               "px-4 py-2 text-sm font-black uppercase transition-all border-2 border-[var(--card-border)]",
                               formData.thinkAboutItConcern === concern ? "bg-[var(--card-bg)]/60 text-[var(--text-base)] shadow-md" : "bg-[var(--card-bg)] text-gray-800 hover:-translate-y-0.5"
                             )}
                           >
                             {concern}
                           </button>
                         ))}
                       </div>
                       {formData.thinkAboutItConcern === 'Something Else' && (
                         <input 
                           type="text" 
                           placeholder="What is the concern?..." 
                           value={formData.otherConcern || ''}
                           onChange={(e) => updateForm('otherConcern', e.target.value)}
                           className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-2 text-gray-800 uppercase font-bold outline-none focus:border-white/50"
                         />
                       )}
                     </div>
                   </div>
                 )}

                 {formData.activeObjection === 'other_offers' && (
                   <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-md text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6 animate-slideIn">
                     "That's awesome, it sounds like you have some great options. Just be careful with out-of-state buyers who throw out a high number and then ask for massive price drops during inspections. Our offer is completely as-is with zero contingencies. Do their offers waive inspections? If we can guarantee our price, what number would we need to hit to get this locked up right now?"
                   </div>
                 )}

                 {formData.activeObjection === 'spouse' && (
                   <div className="relative bg-[var(--card-bg)] border border-[var(--card-border)] box-border max-w-full mr-4 p-6 shadow-md text-xl font-black italic text-gray-800 leading-relaxed rounded-none mb-6 animate-slideIn">
                     "Of course, I wouldn't expect you to make a decision without talking to them. Usually when I talk to spouses, they have a lot of the same questions. Since I have you on the phone now, what do you think their biggest concern is going to be? Is there a time later today we can get all three of us on a quick 5-minute call so I can answer their questions directly?"
                   </div>
                 )}
              </div>

              {/* Offer Lock In Section */}
              <div className="mt-10 p-6 bg-gray-100 border-8 border-[var(--card-border)] relative overflow-hidden flex flex-col items-center">
                <div className="absolute inset-0 opacity-10 comic-halftone pointer-events-none"></div>
                <h4 className="m-0 mb-4 text-gray-800 text-lg uppercase tracking-widest font-black z-10 text-center">
                  Final Negotiated Price
                </h4>
                
                {(() => {
                  const lockedPriceNum = parseInt(formData.lockedPrice || 0, 10);
                  const marginThreshold = totalMAO * 0.90; // 10% buffer
                  const isMarginTight = lockedPriceNum > marginThreshold;

                  return (
                    <div className="flex flex-col w-full items-center z-10">
                      {isMarginTight && lockedPriceNum > 0 && (
                        <div className="mb-4 bg-[#D4AF37] text-gray-800 border border-[var(--card-border)] px-4 py-2 font-black uppercase text-sm animate-pulse shadow-md flex items-center gap-2">
                          <span>⚠️</span> MARGIN WARNING: Ensure Assignment Fee Buffer is Maintained!
                        </div>
                      )}
                      
                      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center items-center">
                        <div className="relative w-full max-w-md">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] font-black text-3xl">$</span>
                          <input 
                            type="text" 
                            placeholder="AGREED PRICE" 
                            value={formData.lockedPrice || ''}
                            onChange={(e) => updateForm('lockedPrice', e.target.value.replace(/[^0-9]/g, ''))}
                            disabled={formData.isPriceLocked}
                            className="w-full text-4xl font-black text-[#D4AF37] bg-[var(--card-bg)]/80 p-4 pl-12 border border-[#D4AF37] text-center focus:outline-none focus:shadow-[0_0_15px_#D4AF37] transition-shadow disabled:opacity-90 placeholder-[#004400]"
                          />
                        </div>
                        
                        <button 
                          onClick={() => updateForm('isPriceLocked', !formData.isPriceLocked)}
                          className={clsx(
                            "px-8 py-4 font-black uppercase text-xl border transition-all whitespace-nowrap shadow-md",
                            formData.isPriceLocked 
                              ? "bg-[var(--card-bg)]/80 text-[#D4AF37] border-[var(--card-border)] hover:bg-gray-900" 
                              : "bg-[#D4AF37] text-gray-800 border-[var(--card-border)] hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-none"
                          )}
                        >
                          {formData.isPriceLocked ? 'Unlock 🔓' : 'LOCK PRICE 🔒'}
                        </button>
                      </div>
                    </div>
                  );
                })()}
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
                  className="w-full max-w-lg mt-6 bg-[#FF00FF] text-gray-800 border border-[var(--card-border)] p-4 font-black italic uppercase text-2xl tracking-widest transition-all duration-300 transition-all hover:-translate-y-0.5 hover:shadow-md active:shadow-none active:translate-y-1 flex justify-center items-center gap-2"
                >
                   PROCEED TO PILLAR 6 &rarr;
                </button>
              </div>
            )}
          </div>
        ))}

        {activeSource !== 'Agent Outreach' && renderPillar(6, "The Close & Logistics", <CheckCircle2 size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col mb-2 animate-slideIn bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-md">
              <span className="text-sm font-black mb-2 tracking-wider uppercase text-gray-800 bg-yellow-400 inline-block px-2 py-1 border-2 border-[var(--card-border)] - w-max shadow-md">The Assumptive Close</span>
              <div className="relative text-xl font-black italic text-gray-800 leading-relaxed mt-2">
                "Okay perfect, it sounds like we're on the same page. What I'm going to do next is send over our standard, simple 2-page purchase agreement. You can review it, and once you sign it, I'll send it directly to our title company so they can start the process."
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-md mt-2">
              <span className="text-sm font-black mb-2 tracking-wider uppercase text-gray-800 bg-yellow-400 inline-block px-2 py-1 border-2 border-[var(--card-border)] - w-max shadow-md">Logistics Gathering</span>
              <div className="relative text-xl font-black italic text-gray-800 leading-relaxed mt-2 mb-6">
                "Just so I can draft this up correctly, what is the exact legal name on the deed that we should use for the contract? And what's the best email address to send the DocuSign to?"
              </div>
              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Legal Name</label>
                  <input type="text" placeholder="Legal Name(s) for Contract..." value={formData.legalName || ''} onChange={(e) => updateForm('legalName', e.target.value)} className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-4 text-gray-800 uppercase font-bold placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-md transition-all" />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Contact Email</label>
                  <input type="email" placeholder="Best Email Address..." value={formData.contactEmail || ''} onChange={(e) => updateForm('contactEmail', e.target.value)} className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-4 text-gray-800 uppercase font-bold placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-md transition-all" />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Mailing Address</label>
                  <input type="text" placeholder="Current Mailing Address (if different)..." value={formData.mailingAddress || ''} onChange={(e) => updateForm('mailingAddress', e.target.value)} className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-4 text-gray-800 uppercase font-bold placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-md transition-all" />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-gray-700 font-semibold text-xs uppercase tracking-wider block mb-1">Routing Info (Wire/ACH/Check)</label>
                  <input type="text" placeholder="Routing or Disbursement Instructions..." value={formData.routingInfo || ''} onChange={(e) => updateForm('routingInfo', e.target.value)} className="w-full bg-[var(--card-bg)] border-2 border-[var(--card-border)] rounded-none p-4 text-gray-800 uppercase font-bold placeholder-gray-400 focus:outline-none focus:bg-yellow-50 focus:shadow-md transition-all" />
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn bg-[var(--card-bg)] border border-[var(--card-border)] p-6 shadow-md mt-2">
              <span className="text-sm font-black mb-2 tracking-wider uppercase text-gray-800 bg-yellow-400 inline-block px-2 py-1 border-2 border-[var(--card-border)] - w-max shadow-md">Final Next Steps</span>
              <div className="relative text-xl font-black italic text-gray-800 leading-relaxed mt-2">
                "Awesome. I'm typing that up right now and it should hit your inbox in about 5 minutes. I'll shoot you a quick text when I send it. Can you keep an eye out for it and let me know if you have any questions once you look it over?"
              </div>
            </div>
            
            <div className="mt-8 mb-8">
              <button 
                onClick={generateSummary} 
                className="w-full bg-[#D4AF37] text-gray-800 border border-[var(--card-border)] p-6 font-black uppercase text-2xl transition-all duration-300 transition-all shadow-md hover:-translate-y-0.5 hover:shadow-md active:shadow-none active:translate-y-2 flex justify-center items-center gap-4 group"
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
                    transition: 'transition-all duration-300 0.2s' 
                  }}
                >
                  <ClipboardCheck size={20} /> Review CRM Summary
                </button>
              ) : (
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                  <h4 style={{ color: 'var(--accent-primary)', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Review Data</h4>
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-['Josefin_Sans'])', fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '1.5rem' }}>
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
                      transition: 'transition-all duration-300 0.2s'
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
      <div className="calculator-hud shrink-0 w-[450px] h-full overflow-y-auto" style={{ paddingTop: '40px', paddingBottom: '150px' }}>
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
          
          <div className="bg-[var(--card-bg)] border border-[var(--card-border)] shadow-md transition-all duration-300 relative font-['Josefin_Sans']">
            <div 
              className="bg-[var(--card-bg)]/80 flex items-center justify-between cursor-pointer p-4 relative overflow-hidden transition-transition-all duration-300 active:scale-[0.98]"
              onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}
            >
              <div className="absolute top-0 bottom-0 right-0 w-3/5 bg-[var(--card-bg)]/60 transition-all duration-300 skew-x-[-25deg] origin-bottom translate-x-12"></div>
              <div className="flex items-center gap-3 relative z-10">
                <ShieldAlert size={28} color="#FFF" />
                <h3 className="font-semibold tracking-wide text-3xl text-[var(--text-base)] tracking-widest uppercase italic" style={{ textShadow: '3px 3px 0px #000' }}>DISQUALIFY / STOP</h3>
              </div>
            </div>
          </div>
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
        

        </div>
      </div>

      {showTearSheet && (
        <TearSheet formData={formData} onClose={() => setShowTearSheet(false)} />
      )}
    </>
  );
}