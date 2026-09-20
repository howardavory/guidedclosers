'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useStore from '@/store/useStore';
import { FileText, Ban, ShieldAlert, CheckCircle2, Home, Wrench, Clock, DollarSign, PenTool, Mic, MapPin, Database, ChevronDown, ChevronRight, Calculator, AlertTriangle, HeartHandshake, BrainCircuit, ClipboardCheck, X, BarChart2, Check, ChevronUp } from 'lucide-react';
import clsx from 'clsx';
import TearSheet from '../documents/TearSheet';
import CashCalculator from '../calculators/CashCalculator';
import CreativeCalculator from '../calculators/CreativeCalculator';
import SellerFinanceCalculator from '../calculators/SellerFinanceCalculator';
import RepairsCalculator from '../calculators/RepairsCalculator';
import SessionArchive from '../dashboard/SessionArchive';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { getRandomWisdomCard, getRandomWisdomCards } from '@/lib/faithWisdom';
import { useAutoUnderwriter } from '@/hooks/useAutoUnderwriter';
const libraries = ['places'];

// 1. MUST BE DEFINED OUTSIDE CallScript TO PREVENT REACT FLICKERING
const ConditionSection = ({ id, title, isComplete, isOpen, onToggle, children }) => {
  const sectionRef = useRef(null);

  // Safe Auto-scroll logic: Only scroll the specific inner container
  useEffect(() => {
    if (isOpen && sectionRef.current) {
      setTimeout(() => {
        const container = sectionRef.current.closest('.overflow-y-auto');
        if (container) {
          // Calculate distance from top of container, minus 120px to account for the HUD/Padding
          const scrollTarget = sectionRef.current.offsetTop - 120;
          container.scrollTo({ top: scrollTarget, behavior: 'smooth' });
        }
      }, 150);
    }
  }, [isOpen]);

  return (
    <div 
      ref={sectionRef} 
      className={clsx(
        "scroll-mt-32 mb-4 rounded-xl border transition-all duration-300 overflow-hidden",
        isComplete ? "border-[var(--brand-primary)]/70 bg-[var(--card-bg)] shadow-lg" : "border-[var(--card-border)] bg-[var(--card-bg)] shadow-md",
        isOpen ? "shadow-[0_0_20px_rgba(0,0,0,0.9)]" : ""
      )}
    >
      <button
        type="button"
        className="w-full flex items-center justify-between p-4 cursor-pointer bg-transparent"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          <span className={clsx(
            "w-2 h-2 rounded-full shadow-inner transition-colors", 
            isComplete ? "bg-[var(--brand-primary)] shadow-[var(--brand-primary)]" : "bg-gray-600"
          )} />
          <span className={clsx(
            "font-black tracking-widest text-[10px] md:text-xs uppercase transition-colors", 
            isComplete ? "text-[var(--brand-primary)]" : "text-[var(--text-base)]"
          )}>
            {title}
          </span>
        </div>
        <svg 
          className={clsx("w-4 h-4 transition-transform duration-300", isOpen ? "rotate-180" : "", isComplete ? "text-[var(--brand-primary)]" : "text-[var(--text-muted)]")} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 pt-2 border-t border-[var(--card-border)]/50 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

export default function CallScript({ activeLead, onReturn, onFormUpdate, isSidebarOpen }) {
  const activeGlobalDrawer = useStore(state => state.activeGlobalDrawer);
  const [calcTab, setCalcTab] = useState('cash');
  const [currentWisdomCards, setCurrentWisdomCards] = useState(() => getRandomWisdomCards(3));
  const setActiveGlobalDrawer = useStore(state => state.setActiveGlobalDrawer);

  const { updateTriageCondition, updatePropertyDetails, updateDisposition, masterLead } = useStore();
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const autocompleteRef = useRef(null);

  const [activePillar, setActivePillar] = useState(1);
  const [activeConditionSection, setActiveConditionSection] = useState('property');

  const [completedPillars, setCompletedPillars] = useState([]);
  const [activeCalc, setActiveCalc] = useState(null);
  const [isPullingData, setIsPullingData] = useState(false);
  
  
  // Auto-open Playbook for every new lead
  useEffect(() => {
    if (activeLead) {
      setActiveGlobalDrawer('playbook');
    }
  }, [activeLead, setActiveGlobalDrawer]);
  
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

  // Rehydrate on Mount
  useEffect(() => {
    if (activeLead?.scriptData) {
      try {
        const parsed = typeof activeLead.scriptData === 'string' ? JSON.parse(activeLead.scriptData) : activeLead.scriptData;
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (err) {
        console.error('Failed to parse scriptData:', err);
      }
    }
  }, [activeLead?.id, activeLead?.scriptData]);

  // Debounced Auto-Save
  useEffect(() => {
    if (!activeLead?.id) return;

    const autoSaveTimer = setTimeout(async () => {
      try {
        await fetch(`/api/leads/${activeLead.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scriptData: JSON.stringify(formData) })
        });
      } catch (err) {
        console.error('Auto-save failed:', err);
      }
    }, 1500); // 1.5 second debounce

    return () => clearTimeout(autoSaveTimer);
  }, [formData, activeLead?.id]);

  // Recovered missing state and derived variables
  const [showSummaryReview, setShowSummaryReview] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  // Multi-drawer replaces showTearSheet
  
  const leadName = activeLead?.name || 'the owner';
  const dataCompleteness = formData;
  
  // REPLACE STATIC MAO WITH DYNAMIC HOOK
  const { totalRehab, calculatedMAO: totalMAO } = useAutoUnderwriter(formData);

  // AUTO-FETCH CONTEXT ON MOUNT
  const [propertyContext, setPropertyContext] = useState(null);
  
  useEffect(() => {
    const fetchContext = async () => {
      const address = formData.manualAddress || activeLead?.address;
      if (!address) return;
      
      try {
        const res = await fetch(`/api/property/context?address=${encodeURIComponent(address)}`);
        const data = await res.json();
        if (data.success) {
          setPropertyContext(data.data);
          if (!formData.arv) updateForm('arv', data.data.estimatedArv);
        }
      } catch (err) {
        console.error("Context fetch failed", err);
      }
    };
    
    fetchContext();
  }, [activeLead?.address]);
  // 1. Safe parsing of Asking Price
  const parsedAskingPrice = useMemo(() => {
    if (!formData.askingPrice) return 0;
    return Number(formData.askingPrice.toString().replace(/[^0-9.-]+/g,"")) || 0;
  }, [formData.askingPrice]);

  // 2. Consolidated Total Debt Calculation
  const computedTotalDebt = useMemo(() => {
    if (formData.freeAndClear) return 0;
    const m1 = parseInt(formData.mortgageBalance || 0, 10);
    const m2 = parseInt(formData.secondPosition || 0, 10);
    const m3 = parseInt(formData.thirdPosition || 0, 10);
    const arr = parseInt(formData.arrearsAmount || formData.arrears || 0, 10);
    return m1 + m2 + m3 + arr;
  }, [formData.freeAndClear, formData.mortgageBalance, formData.secondPosition, formData.thirdPosition, formData.arrearsAmount, formData.arrears]);

  // 3. Eviction Penalty & Net to Seller
  const evictionPenalty = useMemo(() => {
    return formData.tenantStatus?.includes('Eviction Needed') ? 15000 : 0;
  }, [formData.tenantStatus]);

  const estimatedNetToSeller = useMemo(() => {
    return totalMAO - evictionPenalty - computedTotalDebt;
  }, [totalMAO, evictionPenalty, computedTotalDebt]);

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
  const displayMAO = formData.compConfidence === 'Low' ? (Math.floor(totalMAO * 0.9 / 1000) * 1000) : totalMAO;

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
    const handler = setTimeout(() => {
      useStore.getState().setLiveFormData(formData);
      if (onFormUpdate) {
        onFormUpdate(formData);
      }
    }, 500);
    return () => clearTimeout(handler);
  }, [formData, onFormUpdate]);

  const generateSummary = () => {
    let summary = `--- LEAD SUMMARY ---\n`;
    summary += `Occupancy: ${formData.occupancy || 'Unknown'}\n`;
    summary += `Asking Price: ${formData.refusedPrice ? 'REFUSED TO DISCLOSE' : (formData.askingPrice ? '$'+formData.askingPrice : 'None given')}\n`;
      summary += `\n-- SITUATION & TIMELINE --\n`;
      summary += `Target Timeline: ${formData.timeline || 'Unknown'}\n`;
      summary += `Target Close Date (COE): ${formData.targetCloseDate ? new Date(formData.targetCloseDate + 'T00:00:00').toLocaleDateString('en-US') : 'TBD'}\n`;
      summary += `Relocation Plans: ${formData.relocationPlans || 'None specified'}\n`;

      if (formData.cashToMoveNeeded === 'Yes') {
        const moveOutDate = (formData.targetCloseDate && formData.postCloseDays) 
          ? new Date(new Date(formData.targetCloseDate).getTime() + (formData.postCloseDays * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { timeZone: 'UTC' }) 
          : 'TBD';
        const hbType = formData.holdbackType === '%' ? '%' : '$';
        const hbFmt = hbType === '$' ? `$${formData.holdbackAmount || '0'}` : `${formData.holdbackAmount || '0'}%`;
        
        summary += `\nPOST-POSSESSION CLOSE:\n`;
        summary += `- Days Needed Post-Close: ${formData.postCloseDays || 'unknown'}\n`;
        summary += `- Vacancy / Move-Out Date: ${moveOutDate}\n`;
        summary += `- Escrow Holdback: ${hbFmt}\n`;
      }
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

  const handleRebuttalClick = (objectionKey) => {
    if (!formData.offerSubmittedToStats) {
      fetch('/api/stats', { 
        method: 'POST', 
        body: JSON.stringify({ type: 'OFFER_SUBMITTED', leadName: activeLead?.name || activeLead?.address || 'Manual Lead' }) 
      });
      updateForm('offerSubmittedToStats', true);
    }
    updateForm('activeObjection', formData.activeObjection === objectionKey ? null : objectionKey);
  };

  const viabilityScore = useMemo(() => {
    let score = 0;
    const roof = formData.roof || [];
    const plumbing = formData.plumbing || [];
    const risks = formData.highRisk || [];

    if (roof.includes('Tarped / Full Tear-Off') || roof.includes('Tarped/Failed') || roof.includes('Tarped / Failed')) score += 15;
    if (plumbing.includes('Active Leaks') || plumbing.includes('Full Repipe')) score += 15;
    if (risks.includes('Structural Fire') || formData.fireDamageType === 'Structural') score += 20;
    if (formData.preForeclosure === 'Yes' || formData.situation === 'Pre-Foreclosure' || (formData.painPoints || []).includes('Pre-Foreclosure')) score += 20;
    if (formData.occupancy === 'Squatters' || (formData.painPoints || []).includes('Squatters')) score += 20;
    if (formData.occupancy === 'Vacant') score += 10;
    if (risks.includes('Code Violations') || risks.includes('Liens')) score += 15;

    return Math.min(score, 100);
  }, [formData]);

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
      <div id={`pillar-${number}`} className={clsx("mb-6 transition-all duration-300 ease-in-out bg-[var(--bg-base)] backdrop-blur-md border border-[var(--card-border)] rounded-2xl shadow-2xl p-5 md:p-6 transition-all relative overflow-hidden", isActive ? "shadow-[0_0_20px_rgba(212,175,55,0.2)] border-[var(--brand-primary)]/50" : "")}>
        
        <div className="font-['Josefin_Sans'] flex justify-between items-center p-5 cursor-pointer select-none bg-[var(--card-bg)] border-b border-[var(--card-border)] hover:bg-[var(--card-border)] transition-colors" 
          onClick={() => setActivePillar(isActive ? null : number)}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", isActive ? "bg-[var(--card-bg)] text-[var(--brand-primary)]" : isCompleted ? "bg-green-900/20 text-[var(--brand-primary)]" : "bg-[var(--card-bg)] text-[var(--text-muted)]")}>
              {icon}
            </div>
            {/* Metallic Gold Gradient Title Effect */}
            <h3 className="text-[var(--brand-primary)] font-black text-sm md:text-base tracking-widest uppercase flex items-center gap-2 border-b border-[var(--brand-primary)]/20 pb-3 mb-4">
              Pillar {number} : {title}
            </h3>
          </div>
          
          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={(e) => togglePillarCompletion(e, number)}
              className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer", 
                isCompleted 
                  ? "bg-green-900/30 text-[var(--brand-primary)] border border-green-700/50" 
                  : "bg-[var(--card-bg)] text-[var(--text-base)] border border-[var(--card-border)] hover:border-[var(--brand-primary)]"
              )}
            >
              <CheckCircle2 size={16} /> {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            <div onClick={() => setActivePillar(isActive ? null : number)} className="cursor-pointer text-[var(--text-base)]">
              {isActive ? <ChevronDown /> : <ChevronRight />}
            </div>
          </div>
        </div>
        
        <div className={clsx("grid transition-all duration-300 ease-in-out", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <div className="p-6 pt-4 border-t border-[var(--card-border)]/50">
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

// STRICT PROGRESS HUD LOGIC (BULLETPROOFED DEEP-SCAN)
  const hasValidData = (val) => {
    // 1. Instantly kill null, undefined, false, 0
    if (!val) return false;

    // 2. Interrogate strings for hidden spaces or default garbage words
    if (typeof val === 'string') {
      const trimmed = val.trim().toLowerCase();
      if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined' || trimmed === 'none' || trimmed === 'n/a') return false;
      return true;
    }

    // 3. Interrogate arrays to ensure they don't just contain empty spaces like [" "] or ["None"]
    if (Array.isArray(val)) {
      if (val.length === 0) return false;
      // Deep scan: The array MUST contain at least one string that isn't empty or a garbage word
      return val.some(item => {
        if (typeof item !== 'string') return !!item; // If it's a number/boolean, accept if truthy
        const trimmedItem = item.trim().toLowerCase();
        return trimmedItem !== '' && trimmedItem !== 'none' && trimmedItem !== 'n/a' && trimmedItem !== 'null';
      });
    }

    // 4. Interrogate objects (prevent {} from passing)
    if (typeof val === 'object' && Object.keys(val).length === 0) return false;

    return true;
  };

  // CONDITION must ONLY track Pillar 2 distress variables, NOT beds, baths, sqft, or yearBuilt
  const hasCondition = Boolean(
    hasValidData(formData.sfRoof) || 
    hasValidData(formData.sfHVAC) || 
    hasValidData(formData.sfPlumbing) || 
    hasValidData(formData.sfElectrical) || 
    hasValidData(formData.exteriorCondition) ||
    hasValidData(formData.interiorCondition) ||
    hasValidData(formData.kitchenCondition) ||
    hasValidData(formData.poolCondition) ||
    hasValidData(formData.unpermittedTypes) ||
    hasValidData(formData.majorRedFlags)
  );

  const hasTimeline = Boolean(
    hasValidData(formData.timeline) || 
    hasValidData(formData.targetCloseDate) || 
    hasValidData(formData.timelineType)
  );

  const hasMotivation = Boolean(
    hasValidData(formData.motivationLevel) || 
    hasValidData(formData.painPoints)
  );

  const hasPrice = Boolean(
    (hasValidData(formData.askingPrice) && Number(String(formData.askingPrice).replace(/[^0-9.]/g, '')) > 0) || 
    hasValidData(formData.lockedPrice)
  );
  
  const currentStep = activePillar;
  const handleProceed = (nextStep) => {
    setActivePillar(nextStep);
    setCompletedPillars(prev => [...new Set([...prev, activePillar])]);
  };

  const hasMajorRepairs = 
      (formData.sfRoof || '').toUpperCase().includes('OVERLAY') || 
      (formData.sfRoof || '').toUpperCase().includes('TEAR-OFF') ||
      (formData.hvacStatus || '').toUpperCase().includes('UNIT ONLY') || 
      (formData.hvacStatus || '').toUpperCase().includes('FULL SYSTEM') ||
      (formData.sfPlumbing || '').toUpperCase().includes('MINOR LEAKS') || 
      (formData.sfPlumbing || '').toUpperCase().includes('REPIPE') ||
      (formData.sfElectrical || '').toUpperCase().includes('PANEL UPGRADE') || 
      (formData.sfElectrical || '').toUpperCase().includes('FULL REWIRE');

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const hudElement = mounted ? document.getElementById('hud-portal-target') : null;

  return (
    <>
      {/* 
        Changed from h-[calc(100vh-120px)] to flex-1 min-h-0 w-full 
        to prevent the bottom of the page from being chopped off.
      */}
      <div className="flex flex-col flex-1 min-h-0 w-full overflow-hidden relative z-10 pb-6">
      
        {/* BACKDROP OVERLAY */}
        {activeGlobalDrawer && activeGlobalDrawer !== 'playbook' && (
          <div 
            className="fixed inset-0 z-[9998] bg-[var(--card-bg)]/10"
            onClick={() => setActiveGlobalDrawer(null)}
          />
        )}

        {/* GLOBAL BOTTOM COMMAND CENTER (MULTI-DRAWER) */}
<div 
  className={clsx(
    "fixed bottom-0 z-[99999] h-[48vh] bg-[var(--bg-base)] backdrop-blur-xl border-t-4 border-[var(--brand-primary)] shadow-[0px_-10px_40px_rgba(0,0,0,0.8)] transition-all duration-300 ease-in-out flex flex-col",
    isSidebarOpen ? "left-[250px] w-[calc(100%-250px)]" : "left-[80px] w-[calc(100%-80px)]",
    (activeGlobalDrawer !== null) ? "translate-y-0" : "translate-y-full"
  )}
>
  {/* Header */}
  <div className="flex justify-between items-center bg-[var(--card-bg)] p-4 border-b border-[var(--card-border)] shrink-0">
    <h2 className="font-black tracking-widest text-2xl uppercase" style={{ textShadow: '2px 2px 0px #000' }}>
      
      {activeGlobalDrawer === 'tearsheet' && <span className="text-[var(--brand-primary)] flex items-center gap-3"><FileText size={28} /> DISPOSITION TEAR-SHEET</span>}
      {activeGlobalDrawer === 'analytics' && <span className="text-[#00FF66] flex items-center gap-3"><BarChart2 size={28} /> SESSION ANALYTICS</span>}
      {activeGlobalDrawer === 'playbook' && <span className="text-[var(--brand-primary)] flex items-center gap-3"><FileText size={28} /> SALES PLAYBOOK</span>}
    </h2>
    <button onClick={() => setActiveGlobalDrawer(null)} className="text-[var(--text-muted)] hover:text-[#ef4444] transition-colors p-2 bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] hover:border-[#ef4444] cursor-pointer">
      <X size={24} />
    </button>
  </div>

  {/* Scrollable Content Area */}
  <div className="flex-1 overflow-hidden p-4 bg-transparent custom-scrollbar">
    
    

    {/* PLAYBOOK */}
    {activeGlobalDrawer === 'playbook' && (
      <div className="max-w-6xl mx-auto w-full p-4 h-full flex flex-col text-[var(--text-base)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-black text-[var(--brand-primary)] uppercase tracking-widest flex items-center gap-3">
            <span>📖</span> Faith-Based Wisdom Rotator (100 Principles)
          </h3>
          <button 
            type="button"
            onClick={() => setCurrentWisdomCards(getRandomWisdomCards(3, currentWisdomCards.map(c => c.id)))}
            className="px-4 py-2 bg-[var(--card-bg)] hover:bg-[var(--card-border)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/50 rounded-xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            🔀 Draw Next 3 Principles
          </button>
        </div>

        {/* Featured Active Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-full items-center">
          {currentWisdomCards.map((card) => (
            <div key={card.id} className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/60 rounded-2xl p-3.5 shadow-[0_0_15px_rgba(229,193,88,0.1)] relative overflow-hidden flex flex-col h-full">
              <div className="absolute top-0 right-0 bg-[var(--brand-primary)] text-black font-black text-[9px] px-2 py-1 uppercase tracking-widest rounded-bl-xl">
                Principle #{card.id}
              </div>
              <h4 className="text-sm font-black text-[var(--brand-primary)] uppercase tracking-widest mb-1 pr-16">{card.title}</h4>
              <p className="text-[10px] font-bold text-[var(--text-muted)] tracking-wider mb-2">({card.verse})</p>
              <p className="text-xs italic text-[var(--text-base)] font-medium leading-relaxed mb-4 border-l-2 border-[var(--brand-primary)] pl-3 flex-1">"{card.quote}"</p>
              <div className="mt-auto pt-2 border-t border-[var(--card-border)]">
                <span className="text-[9px] font-black text-[var(--brand-primary)] uppercase tracking-widest block mb-1">Real Estate Application:</span>
                <p className="text-[11px] text-[#D0D0D0] leading-relaxed">{card.application}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* TEAR SHEET: Centered Document View */}
    {activeGlobalDrawer === 'tearsheet' && (
      <div className="max-w-6xl mx-auto w-full h-full overflow-y-auto p-6 custom-scrollbar pb-12">
        <TearSheet formData={formData} activeLead={activeLead} onClose={() => setActiveGlobalDrawer(null)} />
      </div>
    )}

    {/* ANALYTICS: Centered View */}
    {activeGlobalDrawer === 'analytics' && (
      <div className="max-w-6xl mx-auto w-full pb-12">
        <SessionArchive />
      </div>
    )}
  </div>
</div>

        {/* Data-driven completion checks for each HUD pillar */}
        {(() => {
          // HUD mapped strictly to our nuclear-validated booleans, bypassing public records
          const hudProgressPills = [
            { name: 'CONDITION', completed: hasCondition },
            { name: 'TIMELINE', completed: hasTimeline },
            { name: 'MOTIVATION', completed: hasMotivation },
            { name: 'PRICE', completed: hasPrice },
          ];

          return hudElement && createPortal(
            <div className="flex items-center justify-between gap-4 w-full h-full px-2 lg:px-4 min-w-0">
              
              {/* Non-Interactive Progress Indicators */}
              <div className="hidden md:flex items-center gap-1.5 lg:gap-2 overflow-x-auto hide-scrollbar min-w-0 mr-auto py-1">
                <span className="text-[var(--text-muted)] font-black text-[9px] lg:text-[10px] tracking-widest uppercase mr-1 shrink-0">PROGRESS:</span>
                {hudProgressPills.map((pillar) => (
                  <div 
                    key={pillar.name}
                    className={clsx(
                      "shrink-0 px-3 py-1.5 rounded-full font-bold text-[9px] lg:text-xs tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 border",
                      pillar.completed 
                        ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border-[var(--brand-primary)] shadow-[0_0_10px_rgba(229,193,88,0.3)]" 
                        : "bg-[var(--card-bg)] text-[#666666] border-[var(--card-border)]"
                    )}
                  >
                    <span className={clsx(
                      "w-1.5 h-1.5 rounded-full", 
                      pillar.completed ? "bg-[var(--brand-primary)]" : "bg-gray-600"
                    )} />
                    {pillar.name}
                  </div>
                ))}
              </div>
            </div>,
            hudElement
          );
        })()}

      <div className="flex-1 h-full overflow-y-auto px-8 lg:px-12 pb-32 hide-scrollbar w-full pt-4">
        
        {/* RETURN TO DISPATCH */}
        <div className="mb-6 flex">
          <button 
            onClick={() => {
              if (onReturn) onReturn();
            }} 
            className="flex items-center gap-2 px-5 py-2.5 !bg-[var(--card-bg)] !border !border-[var(--card-border)] !shadow-sm hover:!shadow-md rounded-xl !text-[var(--text-base)] font-semibold transition-all mb-6"
          >
            &larr; Return to Dispatch
          </button>
        </div>
          {/* UNIFIED LEAD CONTEXT */}
          <div className="bg-[var(--bg-base)] backdrop-blur-md border border-[var(--card-border)] rounded-2xl shadow-2xl p-5 md:p-6 mb-6 transition-all relative overflow-hidden w-full flex flex-col gap-8">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#8B6508] via-[var(--brand-primary)] to-[#CD7F32]"></div>
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-primary)] to-[#CD7F32]"></div>
            
            {/* 1. LEAD PROFILE */}
            <div>
              <h4 className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">LEAD PROFILE</h4>
              <div className="grid grid-cols-2 gap-6 relative z-10">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Lead Name</label>
                    <span className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]">Local Time: 12:45 PM EST</span>
                  </div>
                  <input type="text" value={formData.manualName || activeLead?.name || ''} onChange={e => updateForm('manualName', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" placeholder="Lead Name..." />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Property Address</label>
                    <button onClick={pullBatchLeadsData} disabled={isPullingData} className="text-xs font-semibold text-[#007BFF] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors cursor-pointer">
                      {isPullingData ? 'Syncing...' : 'Sync Property Data'}
                    </button>
                  </div>
                  <div className="flex gap-3">
                    {isLoaded ? (
                      <Autocomplete onLoad={(auto) => autocompleteRef.current = auto} onPlaceChanged={handlePlaceChanged} className="flex-1">
                        <input type="text" value={formData.manualAddress !== undefined ? formData.manualAddress : (activeLead?.address || '')} onChange={e => updateForm('manualAddress', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" placeholder="Search Google Maps..." />
                      </Autocomplete>
                    ) : (
                      <input type="text" value={formData.manualAddress !== undefined ? formData.manualAddress : (activeLead?.address || '')} onChange={e => updateForm('manualAddress', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" placeholder="123 Main St..." />
                    )}
                  </div>
                </div>
              </div>
              
              {/* NEW: STREET VIEW INJECTION */}
              {propertyContext?.streetViewUrl && (
                <div className="mt-4 w-full h-48 rounded-xl overflow-hidden border border-[var(--card-border)] relative">
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10 flex items-center gap-2">
                    <MapPin size={12} className="text-[#00E5FF]" /> Live Street View
                  </div>
                  <img 
                    src={propertyContext.streetViewUrl} 
                    alt="Property Street View" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <hr className="border-t border-gray-100" />

            {/* 2. DISTRESS / MOTIVATION */}
            <div>
              <div className="flex justify-between items-center">
                <div className="flex gap-2 items-center flex-wrap flex-1">
                  <span className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">DISTRESS / MOTIVATION</span>
                  {[...(activeLead?.distressMarkers || []), ...(formData.distressMarkers || [])].length === 0 && !activeLead && (
                    <span className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]">
                      [PROBATE]
                    </span>
                  )}
                  {[...(activeLead?.distressMarkers || []), ...(formData.distressMarkers || [])].map((marker, idx) => (
                    <span key={idx} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]">
                      [{marker}]
                      {formData.distressMarkers?.includes(marker) && (
                        <button onClick={() => updateForm('distressMarkers', formData.distressMarkers.filter(m => m !== marker))} className="hover:text-red-500 ml-1 cursor-pointer">&times;</button>
                      )}
                    </span>
                  ))}
                  <div className="w-48 ml-2 relative">
                    <select  className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]"
                      onChange={(e) => {
                        if (e.target.value) {
                          const current = formData.distressMarkers || [];
                          if (!current.includes(e.target.value) && !(activeLead?.distressMarkers || []).includes(e.target.value)) {
                            updateForm('distressMarkers', [...current, e.target.value]);
                          }
                          e.target.value = ""; // Reset dropdown
                        }
                      }}
                    >
                      <option value="" className="bg-[var(--card-bg)] text-[var(--text-base)]">+ ADD TAG</option>
                      <option value="Tired Landlord" className="bg-[var(--card-bg)] text-[var(--text-base)]">Tired Landlord</option>
                      <option value="Pre-Foreclosure" className="bg-[var(--card-bg)] text-[var(--text-base)]">Pre-Foreclosure</option>
                      <option value="Divorce" className="bg-[var(--card-bg)] text-[var(--text-base)]">Divorce</option>
                      <option value="Inherited / Probate" className="bg-[var(--card-bg)] text-[var(--text-base)]">Inherited / Probate</option>
                      <option value="Job Relocation" className="bg-[var(--card-bg)] text-[var(--text-base)]">Job Relocation</option>
                      <option value="Financial Distress" className="bg-[var(--card-bg)] text-[var(--text-base)]">Financial Distress</option>
                      <option value="Downsizing" className="bg-[var(--card-bg)] text-[var(--text-base)]">Downsizing</option>
                      <option value="Just Want Cash" className="bg-[var(--card-bg)] text-[var(--text-base)]">Just Want Cash</option>
                      <option value="Tax Delinquent" className="bg-[var(--card-bg)] text-[var(--text-base)]">Tax Delinquent</option>
                    </select>
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <div className="flex gap-4 items-center pl-4 border-l border-[var(--card-border)]">
                  <span className="text-[10px] font-bold text-[var(--text-muted)]  tracking-widest">
                    Last Contacted: <span className="text-[var(--brand-primary)]">{activeLead?.lastContacted || '2023-10-24 (Hung Up)'}</span>
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-muted)]  tracking-widest">
                    Attempts: <span className="text-[var(--brand-primary)]">{activeLead?.contactAttempts || '3'}</span>
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-t border-gray-100" />

            {/* 3. PUBLIC RECORDS SYNC & PROPERTY DATA */}
            <div>
              <h4 className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">PUBLIC RECORDS & DATA</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:flex flex-wrap gap-6 relative z-10 mb-6">
                <div>
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Lead Source</label>
                  <div className="relative w-full">
                    <select value={formData.activeSource} onChange={e => updateForm('activeSource', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]">
                      <option value="In-House" className="bg-[var(--card-bg)] text-[var(--text-base)]">In-House</option>
                      <option value="Bold Street" className="bg-[var(--card-bg)] text-[var(--text-base)]">Bold Street</option>
                      <option value="Self Gen" className="bg-[var(--card-bg)] text-[var(--text-base)]">Self Gen</option>
                      <option value="Agent Outreach" className="bg-[var(--card-bg)] text-[var(--text-base)]">Agent Outreach</option>
                      <option value="PPC" className="bg-[var(--card-bg)] text-[var(--text-base)]">PPC / Web</option>
                    </select>
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">
                    Ownership Profile
                    {formData.entityName && <span className="text-[var(--brand-primary)] ml-2">✓</span>}
                  </label>
                  <div className="relative w-full mb-2">
                    <select value={formData.manualEntityType} onChange={e => { updateForm('manualEntityType', e.target.value); }} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]">
                      <option value="INDIVIDUAL" className="bg-[var(--card-bg)] text-[var(--text-base)]">Individual</option>
                      <option value="TRUST" className="bg-[var(--card-bg)] text-[var(--text-base)]">Trust</option>
                      <option value="LLC" className="bg-[var(--card-bg)] text-[var(--text-base)]">LLC</option>
                    </select>
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                  {formData.manualEntityType !== 'INDIVIDUAL' && (
                    <input type="text" placeholder="Entity Name..." value={formData.entityName || ''} onChange={e => updateForm('entityName', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                  )}
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Property Type</label>
                  <div className="relative w-full">
                    <select value={formData.expectedPropertyType || 'standard single-family home'} onChange={e => { updateForm('expectedPropertyType', e.target.value); }} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]">
                      <option value="standard single-family home" className="bg-[var(--card-bg)] text-[var(--text-base)]">Single Family</option>
                      <option value="multi-unit property" className="bg-[var(--card-bg)] text-[var(--text-base)]">Multi-Family</option>
                      <option value="condo or townhome" className="bg-[var(--card-bg)] text-[var(--text-base)]">Condo/Townhome</option>
                      <option value="mobile home" className="bg-[var(--card-bg)] text-[var(--text-base)]">Mobile Home</option>
                      <option value="parcel of land" className="bg-[var(--card-bg)] text-[var(--text-base)]">Land</option>
                    </select>
                    <svg className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
                <div className="min-w-[120px] flex-1">
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Estimated ARV</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-medium pb-2">$</span>
                      <input type="number" value={formData.arv || ''} onChange={e => { updateForm('arv', e.target.value); }} placeholder="0" className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                    </div>
                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button 
                        className={clsx("bg-gray-100 hover:bg-gray-200 rounded-md text-xs px-3 py-1 font-bold cursor-pointer transition-colors", formData.compConfidence === 'High' ? "ring-2 ring-green-400 text-green-600" : "text-[var(--text-muted)]")} 
                        onClick={() => updateForm('compConfidence', formData.compConfidence === 'High' ? null : 'High')}
                      >
                        HIGH
                      </button>
                      <button 
                        className={clsx("bg-gray-100 hover:bg-gray-200 rounded-md text-xs px-3 py-1 font-bold cursor-pointer transition-colors", formData.compConfidence === 'Low' ? "ring-2 ring-red-400 text-red-600" : "text-[var(--text-muted)]")} 
                        onClick={() => updateForm('compConfidence', formData.compConfidence === 'Low' ? null : 'Low')}
                      >
                        LOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:flex flex-wrap gap-6 relative z-10">
                <div className="flex flex-col gap-1.5 min-w-[140px] flex-1">
                  <label className="text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest">
                    BEDS / BATHS
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        value={formData.beds || ''} 
                        onChange={(e) => updateForm('beds', e.target.value)}
                        className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 pr-8 text-sm font-bold focus:border-[var(--brand-primary)] outline-none text-center" 
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-muted)] font-normal pointer-events-none">Beds</span>
                    </div>
                    <div className="relative flex-1">
                      <input 
                        type="number" 
                        value={formData.baths || ''} 
                        onChange={(e) => updateForm('baths', e.target.value)}
                        className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 pr-8 text-sm font-bold focus:border-[var(--brand-primary)] outline-none text-center" 
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-[var(--text-muted)] font-normal pointer-events-none">Baths</span>
                    </div>
                  </div>
                </div>
                <div className="min-w-[120px] flex-1">
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Property Sqft</label>
                  <input type="number" value={formData.sqft || ''} onChange={e => updateForm('sqft', e.target.value)} placeholder="e.g. 1500" className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                </div>
                <div className="min-w-[120px] flex-1">
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Lot Size ({formData.lotSizeMeasure})</label>
                  <div className="flex gap-3 items-center">
                    <input 
                      type="number" 
                      value={formData.lotSize || ''} 
                      onChange={e => updateForm('lotSize', e.target.value)} 
                      placeholder="0" 
                      className="flex-1 w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" 
                    />
                    <div className="flex bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1 shrink-0">
                      <button 
                        className={clsx("text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer", formData.lotSizeMeasure === 'SQFT' ? "bg-gradient-to-r from-[#CD7F32] via-[var(--brand-primary)] to-[var(--brand-primary)] text-[#000000] shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text-base)]")} 
                        onClick={() => {
                          if (formData.lotSizeMeasure !== 'SQFT') {
                            if (formData.lotSize) {
                              updateForm('lotSize', Math.round(parseFloat(formData.lotSize) * 43560).toString());
                            }
                            updateForm('lotSizeMeasure', 'SQFT');
                          }
                        }}
                      >
                        SQFT
                      </button>
                      <button 
                        className={clsx("text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer", formData.lotSizeMeasure === 'ACRES' ? "bg-gradient-to-r from-[#CD7F32] via-[var(--brand-primary)] to-[var(--brand-primary)] text-[#000000] shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text-base)]")} 
                        onClick={() => {
                          if (formData.lotSizeMeasure !== 'ACRES') {
                            if (formData.lotSize) {
                              const sqft = parseFloat(formData.lotSize);
                              updateForm('lotSize', (sqft / 43560).toFixed(4).replace(/.?0+$/, ''));
                            }
                            updateForm('lotSizeMeasure', 'ACRES');
                          }
                        }}
                      >
                        ACRES
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">
                    Year Built 
                    {formData.yearBuilt && (
                      <span className="ml-2 text-[var(--text-muted)] font-medium">
                        (Age: {new Date().getFullYear() - Number(formData.yearBuilt)} yrs)
                      </span>
                    )}
                  </label>
                  <input type="number" value={formData.yearBuilt || ''} onChange={e => updateForm('yearBuilt', e.target.value)} placeholder="e.g. 1990" className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                </div>
              </div>
            </div>

          </div>
        
        {/* PILLAR 1: OPENER */}
          {/* PILLAR 1: OPENER */}
        {renderPillar(1, "The Opener", <Mic size={20} />, (
          <div className="flex flex-col gap-6">
            <div className="flex gap-4">
              <button className={clsx("", formData.isVoicemail ? "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => updateForm('isVoicemail', !formData.isVoicemail)}>Voicemail Drop</button>
              <button className={clsx("", formData.isHostile ? "bg-red-600 text-[var(--text-base)] border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" : "bg-[var(--card-bg)] text-red-400 border-red-500/30")} onClick={() => {
                        updateForm('isHostile', true);
                        if (onReturn) {
                          updateDisposition('disqualified');
                          onReturn({ type: 'disqualified', reason: 'Hostile', data: formData });
                        }
                      }}>Hostile Response</button>
            </div>
            {formData.isVoicemail && (
              <div className="flex flex-col mb-2 animate-slideIn">
                <span className="text-xs font-medium mb-1 tracking-wider  text-[var(--text-muted)]">Agent (Voicemail Script)</span>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                  {formData.activeSource === 'Agent Outreach' 
                    ? `"Hey ${sellerFirstName}, it's Avory. We're buying cash in Bakersfield and closing quick. If you have off-market inventory or distress deals, call me back."`
                    : `"Hey ${sellerFirstName || 'there'}, Avory here. We're buying in the area and I want to make a cash offer on ${targetAddress}. Give me a call back at 661-387-3890."`
                  }
                </div>
                
                <button 
                  onClick={() => onReturn && onReturn({ type: 'voicemail' })} 
                  className="w-full max-w-md relative h-20 group overflow-hidden border border-[var(--card-border)] shadow-md hover:shadow-md transition-all hover:-translate-y-0.5 bg-[var(--card-bg)] transition-all duration-300  cursor-pointer flex justify-center items-center mt-4"
                >
                  <div className="absolute inset-0 bg-[var(--card-bg)] transition-all duration-300 skew-x-[-30deg] translate-x-1/2 group-hover:translate-x-1/3 transition-transition-all duration-300 duration-500 border-l-4 border-[var(--card-border)] pointer-events-none"></div>
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
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                  {formData.activeSource === 'Agent Outreach' 
                    ? `"Hey ${sellerFirstName}, my name is Avory with Central Valley REI. I'm an investor buying properties cash in your area. I know you're busy, so I'll keep it brief. Do you happen to have any off-market inventory or pocket listings?"`
                    : formData.manualEntityType === 'TRUST'
                    ? `"Hey, am I speaking with the trustee for the ${formData.entityName || '{Entity Name}'}? This is Avory. How are you doing today?"`
                    : formData.manualEntityType === 'LLC'
                    ? `"Hey, am I speaking with the owner of ${formData.entityName || '{Entity Name}'}? This is Avory. How are you doing today?"`
                    : (
                      <span>
                        "Hey {sellerFirstName}, this is Avory. How are you doing today?" <span className="text-[var(--brand-primary)] italic text-base block mt-1 mb-2">(pause, wait for validation)</span>
                      </span>
                    )
                  }
                </div>
              </div>
            )}
            
            {formData.isHostile && (
              <div className="mt-4 p-4 rounded-xl border border-red-600 bg-[var(--card-bg)] text-[var(--text-base)] text-sm leading-relaxed animate-slideIn">
                <span className="text-red-600 font-black italic block mb-2">[HOSTILE RESPONSE]</span>
                "Understood. I'll remove your number. Have a good day."
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5">
                <p className="text-xs font-medium mb-3 text-[var(--text-base)] ">Seller Responses & Pushbacks (Click again to untoggle)</p>
                <div className="flex flex-wrap gap-3 mb-4">
                  <button className={clsx("", formData.introResponse === 'Normal' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => { updateForm('introResponse', formData.introResponse === 'Normal' ? null : 'Normal'); updateForm('activeObjection', null); }}>Normal Response</button>
                  <button className={clsx("", formData.introResponse === 'Who' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => { updateForm('introResponse', formData.introResponse === 'Who' ? null : 'Who'); updateForm('activeObjection', null); }}>"Who is this?"</button>
                  <button className={clsx("", formData.activeObjection === 'how' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => { updateForm('activeObjection', formData.activeObjection === 'how' ? null : 'how'); updateForm('introResponse', null); }}>"How did you get my number?"</button>
                  
                  {/* New Behavioral Toggles */}
                  <button className={clsx("", formData.introResponse === 'Busy' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => { updateForm('introResponse', formData.introResponse === 'Busy' ? null : 'Busy'); updateForm('activeObjection', null); }}>"I'm Busy / Call Later"</button>
                  <button className={clsx("", formData.introResponse === 'Robot' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => { updateForm('introResponse', formData.introResponse === 'Robot' ? null : 'Robot'); updateForm('activeObjection', null); }}>"Are you a robot / scam?"</button>
                  <button className={clsx("", formData.introResponse === 'PrematurePrice' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => { updateForm('introResponse', formData.introResponse === 'PrematurePrice' ? null : 'PrematurePrice'); updateForm('activeObjection', null); }}>"Just tell me your price"</button>

                  <button className={clsx("", formData.introResponse === 'No' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => { updateForm('introResponse', formData.introResponse === 'No' ? null : 'No'); updateForm('activeObjection', null); }}>Wrong Number</button>
                  <button className={clsx("", formData.introResponse === 'NotOwner' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => { updateForm('introResponse', formData.introResponse === 'NotOwner' ? null : 'NotOwner'); updateForm('activeObjection', null); }}>Not the Owner / Sold It</button>
                </div>

                {formData.introResponse === 'Normal' && (
                  <div className="flex flex-col mt-4 animate-slideIn">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                      "I'm a local buyer. I'm calling to see if you have any interest in a cash offer for {targetAddress}?"
                    </div>
                  </div>
                )}
                {formData.introResponse === 'Who' && (
                  <div className="flex flex-col mt-4 animate-slideIn">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                      "My name is Avory. My team is buying in your neighborhood, and I'm calling to see if you're open to a cash offer on {targetAddress}."
                    </div>
                  </div>
                )}
                {formData.activeObjection === 'how' && (
                  <div className="flex flex-col mt-4 animate-slideIn">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                      "I use public records to contact owners directly. I'm calling to see if you'd consider a cash offer on your property."
                    </div>
                  </div>
                )}
                {['No', 'NotOwner'].includes(formData.introResponse) && (
                  <div className="flex flex-col mt-4 animate-slideIn">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                      "Understood. I'll update my records so my team doesn't call again. Before I hang up, do you own any other properties you're looking to sell?"
                    </div>
                  </div>
                )}
                
                {/* New Behavioral Scripts */}
                {formData.introResponse === 'Busy' && (
                  <div className="flex flex-col mt-4 animate-slideIn">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                      "I respect your time, so I'll be brief. Are you open to an offer on {targetAddress}? If not, let me know. If yes, when is a better time to talk?"
                    </div>
                  </div>
                )}
                
                {formData.introResponse === 'Robot' && (
                  <div className="flex flex-col mt-4 animate-slideIn">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                      "(Laugh) I get that. I'm a real person, my name is Avory. I'm calling to make an offer on your property. Are you open to that?"
                    </div>
                  </div>
                )}
                
                {formData.introResponse === 'PrematurePrice' && (
                  <div className="flex flex-col mt-4 animate-slideIn">
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                      "I can absolutely give you a price. But I don't throw out blind numbers without knowing exactly what I'm buying. To start, public records show this as a single-family home—is that accurate, or are we looking at a multi-unit or mobile home?"
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button 
                        onClick={() => {
                          updateForm('fromPrematurePrice', true);
                          setActivePillar(2);
                          setCompletedPillars(prev => [...new Set([...prev, 1])]);
                          setTimeout(() => {
                            document.getElementById('pillar-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }, 350);
                        }}
                        className="px-8 py-3.5 bg-gradient-to-r from-[#CD7F32] via-[var(--brand-primary)] to-[var(--brand-primary)] text-[#000000] font-extrabold rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(229,193,88,0.5)] hover:opacity-95 transition-all cursor-pointer uppercase tracking-wider"
                      >
                        Proceed to Pillar 2 (Condition) &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {!formData.isVoicemail && !formData.isHostile && formData.activeSource !== 'Agent Outreach' && (formData.introResponse || formData.activeObjection) && (
              <div className="flex flex-col mt-4 animate-slideIn">
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5 animate-slideIn">
                  <p className="text-xs font-medium mb-3 text-[var(--text-base)] ">Would they consider an offer?</p>
                  <div className="flex gap-2 flex-wrap">
                    <button className={clsx("", formData.offerResponse === 'Yes' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'Yes' ? null : 'Yes')}>"Yes / Sure"</button>
                    <button className={clsx("", formData.offerResponse === 'Price' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'Price' ? null : 'Price')}>"Depends on the price"</button>
                    <button className={clsx("", formData.offerResponse === 'No' ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => updateForm('offerResponse', formData.offerResponse === 'No' ? null : 'No')}>"No / Not Selling"</button>
                  </div>

                  {formData.offerResponse === 'Yes' && (
                    <div className="flex flex-col mt-4 animate-slideIn">
                      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                        <span className="font-bold">"Great. To save us both time, what number makes sense for you if we pay cash and cover all your closing costs?"</span> <br/><br/>
                        
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5 flex items-center gap-3">
                          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Asking Price:</label>
                          <div className="flex items-center gap-2 w-full max-w-xs mt-2">
                            <span className="text-[var(--text-base)] font-bold mr-1">$</span>
                            <input  type="text" placeholder="Price or leave blank..." className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" value={formData.askingPrice || ''} onChange={e => updateForm('askingPrice', e.target.value)} />
                          </div>
                          <button className={clsx("px-3 text-xs rounded border py-2 transition-colors", formData.refusedPrice ? "bg-red-600 border-red-600 text-[var(--text-base)]" : "border-[var(--card-border)] text-[var(--text-base)] hover:text-[var(--text-base)]")} onClick={() => updateForm('refusedPrice', !formData.refusedPrice)}>Refused Price</button>
                        </div>

                        {formData.askingPrice || formData.refusedPrice ? (
                          <div className="mt-4 pt-4 border-t border-white/50">
                            <p className="mb-4">
                              {formData.refusedPrice 
                                ? <span className="font-bold">"No worries at all, I completely understand. Usually when we buy properties, the exact number we can offer is going to depend heavily on the condition and layout."</span>
                                : <span className="font-bold">"Got it, ${Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice}. For us to see if we can make that number work, it's going to depend heavily on the condition and layout."</span>
                              }
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-white/50">
                            <p className="mb-4 text-gray-300 italic text-sm">Enter a price or click Refused Price to continue...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.offerResponse === 'Price' && (
                    <div className="flex flex-col mt-4 animate-slideIn">
                      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                        <span className="font-bold">"Great. To save us both time, what number makes sense for you if we pay cash and cover all your closing costs?"</span>
                        <div className="mt-3 flex gap-4 items-center">
                          <div className="flex items-center gap-2 w-full max-w-xs mt-2">
                            <span className="text-[var(--text-base)] font-bold mr-1">$</span>
                            <input  type="number" placeholder="Their Asking Price..." className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" value={formData.askingPrice || ''} onChange={e => updateForm('askingPrice', e.target.value)} />
                          </div>
                          <button className={clsx("px-3 py-2 text-xs rounded border transition-colors bg-[var(--card-bg)] mt-2", formData.refusedPrice ? "bg-red-600 border-red-600 text-[var(--text-base)]" : "border-[var(--card-border)] text-[var(--text-base)]")} onClick={() => updateForm('refusedPrice', !formData.refusedPrice)}>Refused Price</button>
                        </div>
                        
                        {formData.askingPrice || formData.refusedPrice ? (
                          <div className="mt-4 pt-4 border-t border-white/50">
                            <p className="mb-4">
                              {formData.refusedPrice 
                                ? <span className="font-bold">"No worries at all, I completely understand. Usually when we buy properties, the exact number we can offer is going to depend heavily on the condition and layout."</span>
                                : <span className="font-bold">"Got it, ${Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")).toLocaleString() || formData.askingPrice}. For us to see if we can make that number work, it's going to depend heavily on the condition and layout."</span>
                              }
                            </p>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-white/50">
                            <p className="mb-4 text-gray-300 italic text-sm">Enter a price or click Refused Price to continue...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.offerResponse === 'No' && (
                    <div className="flex flex-col mt-4 animate-slideIn">
                      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                        <span className="font-bold">"Understood. If anything changes, are you opposed to me keeping your number on file?"</span>
                        <div className="mt-4 pt-4 border-t border-white/50 flex justify-end">
                           <button className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" onClick={() => {
                          if (onReturn) {
                            // Update lead disposition
                            updateDisposition('disqualified');
                            onReturn({ type: 'disqualified', reason: 'Not Selling', data: formData });
                          }
                         }}>Disqualify / End Call</button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PROGRESSION CTA */}
            <div className="mt-6 pt-4 flex justify-center w-full">
              <button
                type="button"
                onClick={() => {
                  updateForm('fromPrematurePrice', false);
                  handleProceed(2);
                  setActiveConditionSection('specs'); // Auto-opens the first accordion
                }}
                className="mt-6 w-full py-4 bg-[var(--card-bg)] hover:bg-[var(--card-border)] text-[var(--brand-primary)] border border-[var(--brand-primary)] shadow-[0_0_15px_rgba(229,193,88,0.2)] hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] font-black tracking-widest text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
              >
                Proceed to Pillar 2 →
              </button>
            </div>
          </div>
        ))}

        {/* PILLAR 2: PROPERTY DYNAMICS & OCCUPANCY */}
        {renderPillar(2, "Property Details & Occupancy", <Home size={20} />, (
          <div className="flex flex-col gap-6">
            
{/* 1. PROPERTY SPECS */}
<ConditionSection 
  id="specs" 
  title="Property Specs" 
  isComplete={Boolean(formData?.propertyType)}
  isOpen={activeConditionSection === 'specs'}
  onToggle={() => setActiveConditionSection(activeConditionSection === 'specs' ? null : 'specs')}
>
<div className="flex flex-col mb-2 animate-slideIn">
               {!formData.fromPrematurePrice && (
                 <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                   <span className="font-bold">
                     {`"Public records show this as a ${formData.expectedPropertyType || 'single-family home'}. Is that accurate?"`}
                   </span>
                 </div>
               )}

                 <div>
                   <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Select Property Type</label>
                   <div className="flex flex-wrap gap-3 mb-4">
                     {['Single Family', 'Multi-Family', 'Condo/Townhome', 'Mobile Home', 'Land'].map(type => (
                       <button key={type} onClick={() => {
                         const newType = formData.propertyType === type ? '' : type;
                         setFormData(prev => {
                           let updates = { propertyType: newType };
                           if (prev.propertyType === 'Multi-Family' && newType !== 'Multi-Family') {
                             updates.mfUnitCount = '';
                             updates.mfUnitsData = [];
                             updates.mfTotalRents = '';
                             updates.mfGrossRent = '';
                           }
                           if (prev.propertyType === 'Land' && newType !== 'Land') {
                             updates.landZoning = '';
                             updates.landUtilities = '';
                           }
                           return { ...prev, ...updates };
                         });
                       }} className={clsx("", formData.propertyType === type ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{type}</button>
                     ))}
                   </div>
                 </div>
            </div>



                   {/* 2. PROPERTY SPECS */}



                    <div className="flex flex-col mb-2 animate-slideIn">
                       <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                         <span className="font-bold">
                           {formData.propertyType === 'Single Family' || formData.propertyType === 'Condo/Townhome' ? (
                             (() => {
                               if (!formData.publicBeds && !formData.publicBaths && !formData.publicSqft && !formData.beds && !formData.baths && !formData.sqft) {
                                 return `"The county records are actually coming up completely blank on my end today. Just so I'm totally accurate, what do you currently have it listed as for beds and baths?"`;
                               }
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
                         </span>
                       </div>
                         <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Beds</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['1 Bed', '2 Beds', '3 Beds', '4 Beds', '5+ Beds'].map(bed => (
                            <button key={bed} onClick={() => updateForm('beds', formData.beds === bed ? '' : bed)} className={clsx("", formData.beds === bed ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{bed}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Baths</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['1 Bath', '1.5 Baths', '2 Baths', '2.5 Baths', '3+ Baths'].map(bath => (
                            <button key={bath} onClick={() => updateForm('baths', formData.baths === bath ? '' : bath)} className={clsx("", formData.baths === bath ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{bath}</button>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mt-2">
                         <div>
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Sqft</label>
                           <input type="number" value={formData.sqft} onChange={e => updateForm('sqft', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                         </div>
                         <div>
                           <div className="flex justify-between items-center mb-1">
                             <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Lot Size ({formData.lotSizeMeasure})</label>
                             <div className="flex bg-gray-200 rounded p-0.5">
                               <button className={clsx("px-2 py-0.5 text-[10px] font-bold  rounded", formData.lotSizeMeasure === 'SQFT' ? "bg-[var(--card-bg)] text-[var(--text-base)] shadow-sm" : "text-[var(--text-muted)]")} onClick={() => updateForm('lotSizeMeasure', 'SQFT')}>SQFT</button>
                               <button className={clsx("px-2 py-0.5 text-[10px] font-bold  rounded", formData.lotSizeMeasure === 'ACRES' ? "bg-[var(--card-bg)] text-[var(--text-base)] shadow-sm" : "text-[var(--text-muted)]")} onClick={() => updateForm('lotSizeMeasure', 'ACRES')}>ACRES</button>
                             </div>
                           </div>
                           <input type="number" value={formData.lotSize} onChange={e => updateForm('lotSize', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                           {formData.lotSize && (
                             <div className="text-[10px] text-[var(--text-muted)] font-medium italic text-right pr-1">
                               {formData.lotSizeMeasure === 'SQFT' ? `(${(Number(formData.lotSize) / 43560).toFixed(2)} acres)` : `(${(Number(formData.lotSize) * 43560).toLocaleString()} sqft)`}
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                           {formData.lotSize && (
                             <div className="text-[10px] text-[var(--text-muted)] font-medium italic text-right pr-1">
                               {formData.lotSizeMeasure === 'SQFT' ? `(${(Number(formData.lotSize) / 43560).toFixed(2)} acres)` : `(${(Number(formData.lotSize) * 43560).toLocaleString()} sqft)`}
                             </div>
                           )}
                    </div>
                  {/* STRICT CONDITIONAL GATE: ONLY SHOW IF LAND IS SELECTED */}
                  {formData.propertyType === 'Land' && (
                    <div className="mt-6 border-t border-[var(--card-border)]/50 pt-6 animate-fadeIn">
                  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                    <span className="font-bold">
                      "Understood. Do you happen to know the exact acreage or lot size? And are there any existing utilities pulled to the property, like water or power?"
                    </span>
                  </div>
                    
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Lot Size / Acreage</label>
                        <div className="flex bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-1 w-max mb-3">
                          <button className={clsx("px-4 py-2 text-xs font-bold rounded-lg transition-all", formData.landSizeMeasure === 'SQFT' ? "bg-gradient-to-r from-[#CD7F32] via-[var(--brand-primary)] to-[var(--brand-primary)] text-[#000000] shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text-base)]")} onClick={() => updateForm('landSizeMeasure', 'SQFT')}>SQFT</button>
                          <button className={clsx("px-4 py-2 text-xs font-bold rounded-lg transition-all", formData.landSizeMeasure === 'ACRES' ? "bg-gradient-to-r from-[#CD7F32] via-[var(--brand-primary)] to-[var(--brand-primary)] text-[#000000] shadow-md" : "text-[var(--text-muted)] hover:text-[var(--text-base)]")} onClick={() => updateForm('landSizeMeasure', 'ACRES')}>ACRES</button>
                        </div>
                        <input 
                          type="number" 
                          value={formData.landSize || ''} 
                          onChange={e => updateForm('landSize', e.target.value)} 
                          className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" 
                          placeholder={formData.landSizeMeasure === 'SQFT' ? "e.g. 43560" : "e.g. 1.5"}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Utilities Access</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['City Water/Sewer', 'Well/Septic', 'No Utilities'].map(opt => (
                            <button 
                              key={opt} 
                              onClick={() => updateForm('landUtilities', formData.landUtilities === opt ? '' : opt)} 
                              className={clsx("px-4 py-2 font-black border-2 border-[var(--card-border)] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5 text-xs ", formData.landUtilities === opt  ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Road Access</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['Paved Road', 'Dirt Road', 'Landlocked / No Legal Access'].map(opt => (
                            <button 
                              key={opt} 
                              onClick={() => updateForm('landAccess', formData.landAccess === opt ? '' : opt)} 
                              className={clsx("px-4 py-2 font-black border-2 border-[var(--card-border)] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5 text-xs ", formData.landAccess === opt  ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Topography</label>
                        <div className="flex flex-wrap gap-3 mb-4">
                          {['Flat / Buildable', 'Sloped', 'Steep / Mountainous'].map(opt => (
                            <button 
                              key={opt} 
                              onClick={() => updateForm('landTopo', formData.landTopo === opt ? '' : opt)} 
                              className={clsx("px-4 py-2 font-black border-2 border-[var(--card-border)] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5 text-xs ", formData.landTopo === opt  ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}


            {/* Property Dynamics Inputs */}
            {formData.propertyType === 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                  <span className="font-bold">
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
                  </span>
                </div>
                  
                  <div style={{ marginTop: '15px', background: 'transparent', padding: '15px', borderRadius: '12px', borderLeft: '4px solid var(--brand-primary)' }}>
                    
                    <div className="mb-6">
                      <div className="text-sm text-[var(--text-muted)] mb-2  tracking-widest font-medium">Building Configuration</div>
                      <div className="flex flex-wrap gap-3">
                        {['1 Single Building', 'Multiple Detached Buildings', 'Main House + ADU/Conversion'].map(config => (
                          <button key={config} 
                            className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-sm' : 'bg-[var(--card-bg)] border-white text-[var(--text-base)]'}`} 
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
                        <div className="text-sm text-[var(--text-muted)] mb-2  tracking-widest font-medium">Structure Consistency</div>
                        <div className="flex flex-wrap gap-3">
                          {['All Built Same Year', 'Different Ages/Styles'].map(opt => (
                            <button key={opt} 
                              className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-sm' : 'bg-[var(--card-bg)] border-white text-[var(--text-base)]'}`} 
                              onClick={() => setFormData({...formData, mfStructureConsistency: opt})}>
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'All Built Same Year' && (
                      <div className="mb-6 animate-slideIn">
                        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Estimated Year Built</label>
                        <input 
                          type="number" 
                          placeholder="e.g. 1985" 
                          value={formData.mfYearBuilt} 
                          onChange={e => updateForm('mfYearBuilt', e.target.value)} 
                          className="w-full bg-[var(--card-bg)] border-2 border-white rounded-lg p-3 text-[var(--text-base)] focus:border-white/50 focus:outline-none font-medium placeholder-gray-600" 
                        />
                      </div>
                    )}

                    {formData.mfBuildingConfig === 'Main House + ADU/Conversion' && (
                      <div className="mb-6 animate-slideIn flex flex-col gap-4">
                        <div>
                          <div className="text-sm text-[var(--text-muted)] mb-2  tracking-widest font-medium">ADU Origin</div>
                          <div className="flex flex-wrap gap-3">
                            {['Ground-Up Build', 'Garage Conversion', 'Interior Split/Cut'].map(opt => (
                              <button key={opt} 
                                className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-sm' : 'bg-[var(--card-bg)] border-white text-[var(--text-base)]'}`} 
                                onClick={() => setFormData({...formData, mfAduOrigin: opt})}>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        {formData.mfAduOrigin !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-[var(--text-muted)] mb-2  tracking-widest font-medium">City Permits / Legality</div>
                            <div className="flex flex-wrap gap-3">
                              {['Fully Permitted', 'Unpermitted / Unknown'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-[2px_2px_0px_#fff]  hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfAduLegality === opt ? 'bg-[var(--card-bg)] text-[var(--text-base)] border-[var(--brand-primary)] shadow-[2px_2px_0px_var(--brand-primary)]' : 'bg-[var(--card-bg)] border-white text-[var(--text-base)]'}`} 
                                  onClick={() => setFormData({...formData, mfAduLegality: opt})}>
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {formData.mfAduLegality !== '' && (
                          <div className="animate-slideIn">
                            <div className="text-sm text-[var(--text-muted)] mb-2  tracking-widest font-medium">Utility Metering</div>
                            <div className="flex flex-wrap gap-3">
                              {['Own Address & Meters', 'Shared with Main House'].map(opt => (
                                <button key={opt} 
                                  className={`px-4 py-2 border-2 font-medium tracking-widest text-xs shadow-sm' : 'bg-[var(--card-bg)] border-white text-[var(--text-base)]'}`} 
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
                        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Total Units</label>
                        <input 
                          type="number" 
                          min="2" 
                          value={formData.mfUnitCount || ''} 
                          onChange={(e) => {
                            const count = parseInt(e.target.value);
                            if (!isNaN(count) && count > 0) {
                              setFormData({
                                ...formData, 
                                mfUnitCount: count, 
                                mfUnitsData: Array.from({length: count <= 4 ? count : 0}, () => ({yearBuilt: '', layoutBeds: '', layoutBaths: '', condition: '', occupancy: '', leaseType: '', paymentStatus: '', rentAmount: ''}))
                              });
                            } else {
                              setFormData({...formData, mfUnitCount: '', mfUnitsData: []});
                            }
                          }}
                          className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]"
                          placeholder="#"
                        />
                      </div>
                    )}

                    {formData.mfUnitCount > 4 && (
                      <div className="mb-6 animate-slideIn border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-md">
                        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                          <span className="font-bold">
                            "Got it, so a fairly sizable operation. Just so I have a baseline for my underwriting, what does the total monthly gross rent look like right now, and roughly what is your current vacancy rate?"
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Total Monthly Gross Rent</label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">$</span>
                              <input 
                                type="number" 
                                placeholder="e.g. 8500" 
                                value={formData.mfGrossRent || ''} 
                                onChange={e => updateForm('mfGrossRent', e.target.value)} 
                                className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Current Vacancy Rate</label>
                            <div className="relative">
                              <input 
                                type="number" 
                                placeholder="e.g. 10" 
                                value={formData.mfVacancyRate || ''} 
                                onChange={e => updateForm('mfVacancyRate', e.target.value)} 
                                className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {formData.mfUnitCount <= 4 && formData.mfUnitsData.length > 0 && (
                      <div className="flex flex-col gap-4 mb-6">
                        {formData.mfUnitsData.map((unit, index) => (
                          <div key={index} className="bg-[#111] border-2 border-[var(--brand-primary)]/50 p-4 rounded-lg shadow-md">
                            <div className="text-[#00E5FF] font-medium  tracking-widest mb-3 border-b border-gray-700 pb-2">
                              {formData.mfBuildingConfig === 'Main House + ADU/Conversion' 
                                ? (index === 0 ? 'MAIN HOUSE' : 'ADU / GUEST HOUSE')
                                : `Unit ${String.fromCharCode(65 + index)}`
                              }
                            </div>
                            
                            {formData.mfBuildingConfig === 'Multiple Detached Buildings' && formData.mfStructureConsistency === 'Different Ages/Styles' && (
                              <div className="mb-4">
                                <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Year Built</label>
                                <input 
                                  type="number" 
                                  placeholder="e.g. 1950" 
                                  value={unit.yearBuilt || ''} 
                                  onChange={e => {
                                    const newData = [...formData.mfUnitsData]; newData[index].yearBuilt = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} 
                                  className="w-full bg-[var(--card-bg)] border border-gray-600 rounded-lg p-2 text-[var(--text-base)] focus:border-[var(--brand-primary)]/50 focus:outline-none font-medium placeholder-gray-600 text-sm" 
                                />
                              </div>
                            )}

                            <div className="mb-4">
                              <div className="text-xs text-[var(--text-muted)] mb-2  tracking-widest font-medium">Layout</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Studio', '1 Bed', '2 Bed', '3+ Bed'].map(bed => (
                                  <button key={bed} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBeds === bed ? 'bg-[#3b82f6] text-[var(--text-base)] border-[var(--brand-primary)]/50' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBeds = bed; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bed}</button>
                                ))}
                              </div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['1 Bath', '1.5 Bath', '2+ Bath'].map(bath => (
                                  <button key={bath} className={`px-3 py-1.5 border font-bold text-xs ${unit.layoutBaths === bath ? 'bg-[#3b82f6] text-[var(--text-base)] border-[var(--brand-primary)]/50' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].layoutBaths = bath; setFormData({...formData, mfUnitsData: newData});
                                  }}>{bath}</button>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <div className="text-xs text-[var(--text-muted)] mb-2  tracking-widest font-medium">Condition</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Turnkey / Updated', 'Dated / Livable', 'Needs Heavy Rehab'].map(cond => (
                                  <button key={cond} className={`px-3 py-1.5 border font-bold text-xs ${unit.condition === cond ? 'bg-[var(--card-bg)] text-[var(--text-base)] border-[var(--brand-primary)]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; newData[index].condition = cond; setFormData({...formData, mfUnitsData: newData});
                                  }}>{cond}</button>
                                ))}
                              </div>
                            </div>

                            <div className="mb-2">
                              <div className="text-xs text-[var(--text-muted)] mb-2  tracking-widest font-medium">Occupancy Status</div>
                              <div className="flex flex-wrap gap-3 mb-4">
                                {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                                  <button key={occ} className={`px-3 py-1.5 border font-bold text-xs ${unit.occupancy === occ ? 'bg-[#00E676] text-[var(--text-base)] border-[#00E676]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                    const newData = [...formData.mfUnitsData]; 
                                    newData[index].occupancy = occ; 
                                    if(occ !== 'Tenant Occupied') {
                                      newData[index].leaseType = ''; newData[index].paymentStatus = ''; newData[index].rentAmount = '';
                                    }
                                    setFormData({...formData, mfUnitsData: newData});
                                  }}>{occ}</button>
                                ))}
                              </div>
        {/* CONDITIONAL VACANT FOLLOW-UP */}
{formData.occupancy === 'Vacant' && (
  <div className="mt-6 border-t border-[var(--card-border)]/50 pt-6 animate-fadeIn">
    
    <div className="mb-4">
      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">How long has it been vacant?</label>
      <input 
        type="text" 
        placeholder="e.g., 6 months..." 
        value={formData.vacantLength || ''} 
        onChange={(e) => updateForm('vacantLength', e.target.value)} 
        className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] outline-none transition-all" 
      />
    </div>

    <div>
      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Vacant Issues (Select all that apply)</label>
      <div className="flex flex-wrap gap-2">
        {['Boarded Up', 'Squatters', 'Vandalized'].map(issue => (
          <button 
            key={issue}
            type="button"
            className={clsx(
              "flex-1 min-w-[100px] rounded-xl px-3 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center",
              (formData.vacantIssues || []).includes(issue) 
                ? "bg-[var(--card-bg)] text-[#ef4444] border border-[#ef4444]/60 shadow-[0_0_12px_rgba(239,68,68,0.2)] font-black" 
                : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444] hover:text-[var(--text-muted)]"
            )}
            onClick={(e) => { e.preventDefault(); handleToggle('vacantIssues', issue); }}
          >
            {issue}
          </button>
        ))}
      </div>
    </div>
    
  </div>
)}
        
                            </div>

                            {unit.occupancy === 'Tenant Occupied' && (
                              <div className="mt-4 p-3 bg-[var(--card-bg)] border border-gray-800 rounded flex flex-col gap-3">
                                <div>
                                  <div className="text-[10px] text-[var(--text-muted)] mb-1  tracking-widest font-medium">Current Rent $</div>
                                  <input type="number" placeholder="e.g. 1500" value={unit.rentAmount} onChange={(e) => {
                                    const newData = [...formData.mfUnitsData]; newData[index].rentAmount = e.target.value; setFormData({...formData, mfUnitsData: newData});
                                  }} className="w-full p-2 bg-[#222] text-[var(--text-base)] border border-gray-600 font-medium text-sm focus:outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/30 transition-all" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-[var(--text-muted)] mb-1  tracking-widest font-medium">Lease Type</div>
                                  <div className="flex gap-2">
                                    {['MTM', 'Annual'].map(lt => (
                                      <button key={lt} className={`flex-1 py-1.5 border font-bold text-xs ${unit.leaseType === lt ? 'bg-[var(--card-bg)] text-[var(--text-base)] border-[var(--brand-primary)]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
                                        const newData = [...formData.mfUnitsData]; newData[index].leaseType = lt; setFormData({...formData, mfUnitsData: newData});
                                      }}>{lt}</button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[10px] text-[var(--text-muted)] mb-1  tracking-widest font-medium">Payment Status</div>
                                  <div className="flex gap-2">
                                    {['On Time', 'Behind'].map(ps => (
                                      <button key={ps} className={`flex-1 py-1.5 border font-bold text-xs ${unit.paymentStatus === ps ? 'bg-[var(--card-bg)] text-[var(--text-base)] border-[var(--brand-primary)]' : 'bg-transparent text-[var(--text-muted)] border-gray-600'} transition-all`} onClick={() => {
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
                        <div className="text-sm text-[var(--text-muted)] mb-2  tracking-widest font-medium">Utility Metering</div>
                        <div className="flex flex-col gap-4 mb-4">
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-sm' : 'bg-[var(--card-bg)] border-white text-[var(--text-base)]'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Separately Metered (Tenant Pays All)', mfOwnerUtilities: [], mfUtilityCost: ''})}>Tenants Pay All</button>
                          <button className={`px-4 py-3 border-2 font-bold tracking-widest text-sm shadow-[2px_2px_0px_#fff] skew-x-[-2deg] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#fff] transition-all duration-200 ease-out transform-gpu ${formData.mfUtilityMetering === 'Landlord Pays Some/All' ? 'bg-[var(--card-bg)] text-[var(--text-base)] border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-[var(--card-bg)] border-white text-[var(--text-base)]'}`} onClick={() => setFormData({...formData, mfUtilityMetering: 'Landlord Pays Some/All'})}>Landlord Pays Some/All</button>
                        </div>
                        
                        {formData.mfUtilityMetering === 'Landlord Pays Some/All' && (
                          <div className="mt-4 p-4 bg-[var(--card-bg)] border border-gray-800 rounded-lg">
                            <div className="text-xs text-[var(--text-muted)] mb-2  tracking-widest font-medium">Which Utilities?</div>
                            <div className="flex flex-wrap gap-3 mb-4">
                              {['Water', 'Sewer', 'Trash', 'Gas', 'Electric', 'Landscaping'].map(util => (
                                <button key={util} 
                                  className={`px-4 py-1.5 border font-medium text-xs shadow-[2px_2px_0px_#fff]  ${formData.mfOwnerUtilities.includes(util) ? 'bg-[var(--card-bg)] text-[var(--text-base)] border-[#FFE600] shadow-[2px_2px_0px_#FFE600]' : 'bg-[var(--card-bg)] border-gray-600 text-gray-300'} transition-all`} 
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
                              <div className="text-[10px] text-[var(--text-muted)] mb-1  tracking-widest font-medium">Est. Monthly Utility Cost $</div>
                              <input type="number" placeholder="e.g. 350" value={formData.mfUtilityCost} onChange={(e) => setFormData({...formData, mfUtilityCost: e.target.value})} className="w-full p-3 bg-[#222] text-[var(--text-base)] border-2 border-gray-600 font-medium text-sm focus:outline-none focus:border-[#FFE600] transition-all skew-x-[-2deg]" />
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
            )}
            
{formData.propertyType === 'Condo/Townhome' && (
              <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl animate-slideIn">
                <p className="text-sm text-[var(--text-base)] mb-2">"Condos are great. Usually, the biggest hurdle for us are the HOA rules. What's the name of the HOA, what's the monthly fee, and do they have any rental restrictions?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="HOA Name..." value={formData.hoaName} onChange={e => updateForm('hoaName', e.target.value)} className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-base)] outline-none" />
                  <input type="text" placeholder="HOA Fee / Mo ($)..." value={formData.hoaFee} onChange={e => updateForm('hoaFee', e.target.value)} className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-base)] outline-none" />
                </div>
                <input type="text" placeholder="Any Rental Restrictions?" value={formData.hoaRestrictions} onChange={e => updateForm('hoaRestrictions', e.target.value)} className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-base)] outline-none" />
              </div>
            )}

            {formData.propertyType === 'Mobile Home' && (
              <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl animate-slideIn">
                <p className="text-sm text-[var(--text-base)] mb-2">"Mobile homes are great. Is it located inside a park, and if so, what's the space rent?"</p>
                <div className="flex gap-2 mb-2">
                  <input type="text" placeholder="Park Name / Location..." value={formData.mhParkName} onChange={e => updateForm('mhParkName', e.target.value)} className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-base)] outline-none" />
                  <input type="text" placeholder="Space Rent / Fee ($)..." value={formData.mhParkFee} onChange={e => updateForm('mhParkFee', e.target.value)} className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-2 text-[var(--text-base)] outline-none" />
                </div>
                <div className="flex gap-2">
                  <button className={clsx("", formData.mh55Plus ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => updateForm('mh55Plus', !formData.mh55Plus)}>55+ Community</button>
                  <button className={clsx("", formData.mh433A ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => updateForm('mh433A', !formData.mh433A)}>433A (Perm Foundation)</button>
                </div>
              </div>
            )}

            {formData.propertyType === 'Land' && (
              <div className="p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl animate-slideIn">
                <p className="text-sm text-[var(--text-base)] mb-2">"Gotcha. For vacant land, the most important things we look at are utilities and zoning. Do you know what it's currently zoned for, and does it have city water and sewer?"</p>
                <input type="text" placeholder="Current Zoning (e.g. R1, Ag)..." value={formData.landZoning} onChange={e => updateForm('landZoning', e.target.value)} className="w-full bg-[var(--card-bg)] backdrop-blur-md backdrop-blur-md border-2 border-white/50 rounded-lg p-2 text-[var(--text-base)] outline-none mb-2 placeholder-gray-400" />
                <div className="flex gap-2 mb-2 flex-wrap">
                  {['Water', 'Sewer', 'Electric', 'Well/Septic'].map(util => {
                    const isSelected = formData.landUtilities?.includes(util);
                    return (
                      <button key={util} className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => {
                        const current = formData.landUtilities || [];
                        updateForm('landUtilities', isSelected ? current.filter(u => u !== util) : [...current, util]);
                      }}>{util}</button>
                    )

                  })}
                </div>
                <div className="flex gap-2">
                  <button className={clsx("", formData.landPaved === true ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => handleSingleSelect('landPaved', true)}>Paved Access</button>
                  <button className={clsx("", formData.landPaved === false ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => handleSingleSelect('landPaved', false)}>Dirt Road Access</button>
                </div>
              </div>
            )}



            



            {/* Dynamic Condition Bridges */}
            
            
            {isTenant && formData.tenantStatus.includes('Paying on Time') && formData.leaseType === 'M2M' && !formData.tenantStatus.includes('Eviction Needed') && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
    "Okay, month-to-month and paying on time. We could probably just inherit them as tenants. With that in mind, what's the actual condition of the property?"
  </div>
</div>
            )}

            {isVacant && formData.propertyType !== 'Multi-Family' && (formData.vacantIssues.includes('Squatters') || formData.vacantIssues.includes('Boarded Up') || formData.vacantIssues.includes('Vandalism')) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2.5rem', animation: 'slideInUp 0.3s ease' }}>
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
    "Wow, sorry you're dealing with that. We buy properties with those issues all the time so we can definitely take that burden off your hands. Since we can't always get inside right away, what do you remember about the major stuff?"
  </div>
</div>
            )}

            {/* Core Condition Questions */}
            </ConditionSection>

{/* 2. OWNERSHIP PROFILE */}
<ConditionSection 
  id="ownership" 
  title="Ownership Profile" 
  isComplete={Boolean(formData?.decisionMakers || formData?.dmCount)}
  isOpen={activeConditionSection === 'ownership'}
  onToggle={() => setActiveConditionSection(activeConditionSection === 'ownership' ? null : 'ownership')}
>

                   {/* 1. DECISION MAKERS */}

                <div className="flex flex-col mb-2 animate-slideIn">
                   <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                     <div className="text-[var(--text-base)] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
                       {`"Perfect. And before we get into the house itself, are you the sole owner on title, or is there a spouse or partner we'd need to loop in eventually?"`}
                     </div>

                     <div>
                       <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Decision Makers</label>
                       <div className="flex flex-wrap gap-3 mb-4">
                         {['Sole Owner', 'Spouse/Partner', 'Trust/Probate/Multiple'].map(dm => (
                           <button key={dm} onClick={() => updateForm('decisionMakers', formData.decisionMakers === dm ? '' : dm)} className={clsx("", formData.decisionMakers === dm ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{dm}</button>
                         ))}
                                     {formData.decisionMakers === 'Trust/Probate/Multiple' && (
                          <div className="mt-4 p-4 border border-[var(--card-border)] bg-[var(--card-bg)] shadow-md relative">
                            <div className="mb-6">
                              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                                <span className="font-bold">"I know that managing a property with multiple family members or partners can be a heavy administrative burden. My goal is to make this as seamless as possible for everyone involved. Just so I can organize the paperwork on my end and make sure everyone's voice is respected, exactly how many decision makers are we coordinating with?"</span>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Total Decision Makers</label>
                              <input 
                                type="number" 
                                min="2" 
                                max="10" 
                                value={formData.dmCount || ''} 
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val > 0) {
                                    updateForm('dmCount', val);
                                    if (!formData.activeDm || formData.activeDm > val) {
                                      updateForm('activeDm', 1);
                                    }
                                  } else {
                                    updateForm('dmCount', '');
                                  }
                                }}
                                className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]"
                                placeholder="#"
                              />
                            </div>

                            {formData.dmCount >= 2 && (
                              <div className="animate-slideIn border-t-4 border-[var(--card-border)] pt-6">
                                <div className="mb-6">
                                  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                                    <span className="font-bold">"Got it, so there are {formData.dmCount} of you. And just so I know who I'm addressing when we eventually get to the title phase, what is the best way to list everyone's relationship to the property? Like siblings, partners, trustees?"</span>
                                  </div>
                                </div>

                                <div className="mb-4">
                                  <div className="flex flex-wrap gap-3 mb-4">
                                    {Array.from({ length: formData.dmCount }).map((_, i) => (
                                      <button 
                                        key={i} 
                                        onClick={() => updateForm('activeDm', i+1)} 
                                        className={clsx("px-4 py-2 font-black border border-[var(--card-border)] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5  text-xs tracking-wider", (formData.activeDm || 1) === i+1  ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                      >
                                        DM {i+1}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5">
                                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Relationship (DM {formData.activeDm || 1})</label>
                                  <div className="flex flex-wrap gap-3 mb-4">
                                    {['Sibling', 'Ex-Spouse', 'Business Partner', 'Heir', 'Parent', 'Child', 'Attorney', 'Trustee', 'Executor'].map(rel => (
                                      <button 
                                        key={rel} 
                                        onClick={() => updateForm(`dmRel_${formData.activeDm || 1}`, formData[`dmRel_${formData.activeDm || 1}`] === rel ? '' : rel)} 
                                        className={clsx("font-black text-xs  px-4 py-2 border-2 border-[var(--card-border)] shadow-md transition-transition-all duration-300 hover:-translate-y-0.5", formData[`dmRel_${formData.activeDm || 1}`] === rel  ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                      >
                                        {rel}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                              <div className="animate-slideIn border-t-4 border-[var(--card-border)] pt-6 mt-6">
                                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                                  <span className="font-bold">"Since it's in a trust or probate, has the probate process officially started yet? And who is acting as the primary Executor or Administrator?"</span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                  <div>
                                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Probate Started?</label>
                                    <div className="flex gap-2">
                                      {['Yes', 'No'].map(opt => (
                                        <button 
                                          key={opt} 
                                          onClick={() => updateForm('probateStarted', formData.probateStarted === (opt === 'Yes') ? null : (opt === 'Yes'))}
                                          className={clsx("flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center ", formData.probateStarted === (opt === 'Yes')  ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Executor / Admin Name</label>
                                    <input 
                                      type="text" 
                                      placeholder="Name..." 
                                      value={formData.executor || ''} 
                                      onChange={e => updateForm('executor', e.target.value)} 
                                      className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                     </div>
                  </div>

                 </div>



</div>
</ConditionSection>
{/* 3. OCCUPANCY STATUS */}
<ConditionSection 
  id="occupancy" 
  title="Occupancy Status" 
  isComplete={Boolean(formData?.occupancyStatus || formData?.occupancy)}
  isOpen={activeConditionSection === 'occupancy'}
  onToggle={() => setActiveConditionSection(activeConditionSection === 'occupancy' ? null : 'occupancy')}>


                   {/* 3. OCCUPANCY */}



                    <div className="flex flex-col mb-2 animate-slideIn">
                       <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                         <span className="font-bold">
                           "Sounds good, now are you currently living in the property right now or is it a rental?"
                         </span>
                       </div>
                         <div>
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Occupancy Status</label>
                           <div className="flex flex-wrap gap-3 mb-4">
                        {['Owner Occupied', 'Tenant Occupied', 'Vacant'].map(occ => (
                          <button key={occ} onClick={() => {
                            const newOcc = formData.occupancy === occ ? '' : occ;
                            setFormData(prev => {
                              let updates = { occupancy: newOcc };
                              if (prev.occupancy === 'Tenant Occupied' && newOcc !== 'Tenant Occupied') {
                                updates.rentAmount = '';
                                updates.leaseType = '';
                                updates.tenantStatus = [];
                                updates.rentArrears = '';
                                updates.section8Status = '';
                              }
                              return { ...prev, ...updates };
                            });
                          }} className={clsx("", formData.occupancy === occ ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{occ}</button>
                        ))}
                      </div>

            {/* Dynamic Follow-up: Vacant */}
            {isVacant && formData.propertyType !== 'Multi-Family' && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '1.5rem', animation: 'slideInUp 0.3s ease' }}>
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                  "Okay, since it's vacant, how long has it been sitting empty? Have you had any issues with squatters or break-ins that we should know about?"
                </div>
                  
                <div style={{ marginTop: '15px', background: 'rgba(255,255,255,0.4)', padding: '15px', borderRadius: '12px' }}>
                  <input type="text" placeholder="How long vacant? (e.g., 6 months)..." value={formData.vacantLength} onChange={(e) => setFormData({...formData, vacantLength: e.target.value})} className="modern-input" style={{ width: '100%', marginBottom: '10px' }} />
                  <div className="toggles-row">
                    <button className={`toggle-pill ${formData.vacantIssues.includes('Boarded Up') ? 'active' : ''}`} onClick={() => handleToggle('vacantIssues', 'Boarded Up')}>Boarded Up</button>
                    <button className={clsx("", formData.vacantIssues.includes('Squatters') ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => handleToggle('vacantIssues', 'Squatters')}>Squatters</button>
                    <button className={clsx("", formData.vacantIssues.includes('Vandalism') ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")} onClick={() => handleToggle('vacantIssues', 'Vandalism')}>Vandalized</button>
                  </div>
                </div>
              </div>
            )}
                            
                            {formData.occupancy === 'Tenant Occupied' && (
                              <div className="w-full flex flex-col gap-6 mt-4">
                                
                                <div className="relative border-l-4 border-transparent focus-within:border-[var(--brand-primary)] focus-within:bg-[var(--card-bg)] bg-[var(--card-bg)] w-full p-5 md:p-8 shadow-sm rounded-xl transition-all">
                                  <span className="font-bold text-[var(--text-base)] text-lg">
                                    "Got it. And just so we are totally respectful of their space, do the tenants know you are considering selling, or is that kept quiet for now? Are they currently paying on time?"
                                  </span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Rent Amount</label>
                                    <div className="relative">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">$</span>
                                      <input 
                                        type="number" 
                                        placeholder="e.g. 1500" 
                                        value={formData.rentAmount || ''} 
                                        onChange={e => updateForm('rentAmount', e.target.value)} 
                                        className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 pl-7 text-[var(--text-base)] placeholder-[#777777] font-semibold text-base outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/30 transition-all"
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Lease Type</label>
                                    <div className="flex flex-wrap gap-2">
                                      {['Month-to-Month', 'Annual'].map(lt => (
                                        <button 
                                          key={lt} 
                                          onClick={() => updateForm('leaseType', formData.leaseType === lt ? '' : lt)} 
                                          className={clsx("", formData.leaseType === lt  ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                        >
                                          {lt}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">How Do They Pay?</label>
                                    <input 
                                      type="text" 
                                      placeholder="e.g. Zelle, Cash, Portal..." 
                                      value={formData.rentMethod || ''} 
                                      onChange={e => updateForm('rentMethod', e.target.value)} 
                                      className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Tenant Relationship</label>
                                    <div className="flex flex-wrap gap-2">
                                      {['Standard Renter', 'Family Member', 'Friend'].map(rel => (
                                        <button 
                                          key={rel} 
                                          onClick={() => updateForm('sfTenantRel', formData.sfTenantRel === rel ? '' : rel)} 
                                          className={clsx("", formData.sfTenantRel === rel  ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                        >
                                          {rel}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Payment Status</label>
                                  <div className="flex flex-wrap gap-2">
                                    <button 
                                      className={clsx("", formData.tenantStatus?.includes('Paying on Time') ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                      onClick={() => {
                                        const current = formData.tenantStatus || [];
                                        updateForm('tenantStatus', current.includes('Paying on Time') ? current.filter(x => x !== 'Paying on Time') : [...current, 'Paying on Time']);
                                      }}
                                    >
                                      Paying on Time
                                    </button>
                                    <button 
                                      className={clsx("", formData.tenantStatus?.includes('Behind on Rent') ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                      onClick={() => {
                                        const current = formData.tenantStatus || [];
                                        updateForm('tenantStatus', current.includes('Behind on Rent') ? current.filter(x => x !== 'Behind on Rent') : [...current, 'Behind on Rent']);
                                      }}
                                    >
                                      Behind on Rent
                                    </button>
                                    <button 
                                      className={clsx("", formData.tenantStatus?.includes('Eviction Needed') ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                      onClick={() => {
                                        const current = formData.tenantStatus || [];
                                        updateForm('tenantStatus', current.includes('Eviction Needed') ? current.filter(x => x !== 'Eviction Needed') : [...current, 'Eviction Needed']);
                                      }}
                                    >
                                      Eviction Needed
                                    </button>
                                  </div>
                                </div>

                                {(formData.tenantStatus?.includes('Behind on Rent') || formData.tenantStatus?.includes('Eviction Needed')) && (
                                  <div className="animate-slideIn">
                                    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Amount Behind</label>
                                    <div className="relative max-w-xs">
                                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">$</span>
                                      <input 
                                        type="number" 
                                        placeholder="0" 
                                        value={formData.rentArrears || ''} 
                                        onChange={(e) => updateForm('rentArrears', e.target.value)} 
                                        className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 pl-7 text-[var(--text-base)] placeholder-[#777777] font-semibold text-base outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/30 transition-all"
                                      />
                                    </div>
                                  </div>
                                )}

                                <div className="border-t border-[var(--card-border)] pt-6 mt-2">
                                  <div className="text-[var(--text-base)] font-medium italic text-lg mb-6">
                                    "Just so we have the full picture on the lease... how much are you currently holding for their security deposit, who is currently paying for the utilities, and is any of that rent being subsidized by Section 8?"
                                  </div>
                                  
                                  <div className="flex flex-col gap-6">
                                    <div>
                                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Security Deposit Held</label>
                                      <div className="relative max-w-xs">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">$</span>
                                        <input 
                                          type="number" 
                                          placeholder="0" 
                                          value={formData.securityDeposit || ''} 
                                          onChange={(e) => updateForm('securityDeposit', e.target.value)} 
                                          className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 pl-7 text-[var(--text-base)] placeholder-[#777777] font-semibold text-base outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/30 transition-all"
                                        />
                                      </div>
                                    </div>

                                    <div>
                                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Utilities Payment</label>
                                      <div className="flex flex-wrap gap-2">
                                        {['Tenant Pays All', 'Landlord Pays Some', 'Landlord Pays All'].map(opt => (
                                          <button 
                                            key={opt} 
                                            onClick={() => updateForm('utilityStatus', formData.utilityStatus === opt ? '' : opt)} 
                                            className={clsx("", formData.utilityStatus === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                      {(formData.utilityStatus === 'Landlord Pays Some' || formData.utilityStatus === 'Landlord Pays All') && (
                                        <div className="mt-3 animate-slideIn">
                                          <div className="relative max-w-xs">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">$</span>
                                            <input 
                                              type="number" 
                                              placeholder="Landlord Cost / Mo" 
                                              value={formData.landlordUtilityCost || ''} 
                                              onChange={(e) => updateForm('landlordUtilityCost', e.target.value.replace(/[^0-9.]/g, ''))} 
                                              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 pl-7 text-[var(--text-base)] placeholder-[#777777] font-semibold text-base outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/30 transition-all"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div>
                                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Section 8 / Subsidies</label>
                                      <div className="flex flex-wrap gap-2">
                                        {['No Section 8', 'Partial Section 8', 'Full Section 8'].map(opt => (
                                          <button 
                                            key={opt} 
                                            onClick={() => updateForm('section8Status', formData.section8Status === opt ? '' : opt)} 
                                            className={clsx("", formData.section8Status === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                                          >
                                            {opt}
                                          </button>
                                        ))}
                                      </div>
                                      {(formData.section8Status === 'Partial Section 8' || formData.section8Status === 'Full Section 8') && (
                                        <div className="mt-3 animate-slideIn">
                                          <div className="relative max-w-xs">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-bold">$</span>
                                            <input 
                                              type="number" 
                                              placeholder="Section 8 Coverage / Mo" 
                                              value={formData.section8Coverage || ''} 
                                              onChange={(e) => updateForm('section8Coverage', e.target.value.replace(/[^0-9.]/g, ''))} 
                                              className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 pl-7 text-[var(--text-base)] placeholder-[#777777] font-semibold text-base outline-none focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/30 transition-all"
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                  </div>





</ConditionSection>

<ConditionSection 
  id="roof" 
  title="Roof System" 
  isComplete={Boolean(formData?.roofAge || formData?.roofCondition)}
  isOpen={activeConditionSection === 'roof'}
  onToggle={() => setActiveConditionSection(activeConditionSection === 'roof' ? null : 'roof')}
>
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: ((isTenant && formData.tenantStatus.length > 0) || (isVacant && formData.vacantIssues.length > 0)) ? '1.5rem' : '2.5rem' }}>
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
    
    <div className="text-[var(--text-base)] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
      "Got it. Now, to make sure my repair estimates are accurate, let's start with the roof—roughly how many years old is it, and is it holding up alright or needing some major patchwork?"
    </div>
  </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-8">
        <div className="mb-4">
          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Roof Age</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years', 'Window Units / No Central'].map(age => (
              <button key={age} onClick={() => updateForm('roofAge', formData.roofAge === age ? '' : age)} className={clsx("", formData.roofAge === age ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{age}</button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Roof Condition</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'Roof: Good ($0/sqft)', mult: 0}, {label: 'Minor Leaks / Needs Overlay', mult: 4}, {label: 'Tarped / Full Tear-Off', mult: 8}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.sfRoof === opt.label) { updateForm('sfRoof', ''); updateForm('roofMult', 0); } else { updateForm('sfRoof', opt.label); updateForm('roofMult', opt.mult); } }} className={clsx("", formData.sfRoof === opt.label ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
</ConditionSection>
            <ConditionSection 
              id="hvac" 
              title="HVAC System" 
              isComplete={Boolean(formData?.hvacAge || formData?.hvacStatus)}
              isOpen={activeConditionSection === 'hvac'}
              onToggle={() => setActiveConditionSection(activeConditionSection === 'hvac' ? null : 'hvac')}
            >
            <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
      "Okay, makes sense. And what about the HVAC system? Do you know about what year the AC was installed, and is it running perfectly as-is?"
    </div>
    
    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <div className="mb-4">
          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">HVAC Age</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {['0-5 Years', '5-10 Years', '10-15 Years', '15+ Years', 'Window Units / No Central'].map(age => (
              <button key={age} onClick={() => updateForm('hvacAge', formData.hvacAge === age ? '' : age)} className={clsx("", formData.hvacAge === age ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{age}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">HVAC Status</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'AC: Good / Working', mult: 0}, {label: 'Needs Servicing', mult: 0}, {label: 'Broken / Failed', mult: 0}].map(opt => (
              <button key={opt.label} onClick={() => { if (formData.hvacStatus === opt.label) { updateForm('hvacStatus', ''); updateForm('hvacMult', 0); } else { updateForm('hvacStatus', opt.label); updateForm('hvacMult', opt.mult); } }} className={clsx("", formData.hvacStatus === opt.label ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt.label}</button>
            ))}
          </div>
        </div>
      </div>
    )}

  {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 1 */}
            {showedRoofHVACReaction && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
    "Got it. Don't worry too much about that, we deal with replacing those all the time."
  </div>
</div>
            )}

            </ConditionSection>
            <ConditionSection 
              id="plumbing" 
              title="Plumbing & Water Heater" 
              isComplete={Boolean(formData?.plumbingAge || formData?.plumbingCondition || formData?.waterHeater)}
              isOpen={activeConditionSection === 'plumbing'}
              onToggle={() => setActiveConditionSection(activeConditionSection === 'plumbing' ? null : 'plumbing')}
            >
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
<div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
<div className="text-[var(--text-base)] font-black italic text-lg mb-8">
"Okay, and for the plumbing, is that original or have you ever had to repipe the house?"
</div>
  </div>

    {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6">
        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Plumbing Age</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('plumbingAge', formData.plumbingAge === opt ? '' : opt)} className={clsx("", formData.plumbingAge === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
          ))}
        </div>

        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Plumbing Condition</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: 'Copper/PEX ($0/sqft)', mult: 0}, {label: 'Active Leaks', mult: 2}, {label: 'Full Repipe', mult: 5}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfPlumbing === opt.label) { updateForm('sfPlumbing', ''); updateForm('plumbingMult', 0); } else { updateForm('sfPlumbing', opt.label); updateForm('plumbingMult', opt.mult); } }} className={clsx("", formData.sfPlumbing === opt.label ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt.label}</button>
          ))}
        </div>

        <div className="text-[var(--text-base)] font-medium italic text-md mt-6 mb-2">
          "While we're talking about the plumbing, do you happen to know if the water heater is relatively new, or is it getting up there in age?"
        </div>
        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Water Heater</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: '0-5 YEARS / GOOD ($0)', flatAdd: 0}, {label: '5-10 YEARS / AGING ($1,000)', flatAdd: 1000}, {label: '10+ YEARS / DEAD ($2,000)', flatAdd: 2000}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfWaterHeater === opt.label) { updateForm('sfWaterHeater', ''); updateForm('waterHeaterMult', 0); } else { updateForm('sfWaterHeater', opt.label); updateForm('waterHeaterMult', opt.flatAdd); } }} className={clsx("", formData.sfWaterHeater === opt.label ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}

    </div>
</ConditionSection>
            <ConditionSection 
              id="electrical" 
              title="Electrical & Utilities" 
              isComplete={Boolean(formData?.electricalAge || formData?.electricalCondition || formData?.sewer || formData?.solar)}
              isOpen={activeConditionSection === 'electrical'}
              onToggle={() => setActiveConditionSection(activeConditionSection === 'electrical' ? null : 'electrical')}
            >
            <div className="flex flex-col mb-2 animate-slideIn">
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
      "Got it. And what about the electrical system? Is that still original or have you ever had to update the panel or the wiring throughout the house?"
  </div>
</div>

    {formData.propertyType !== 'Multi-Family' && (
      <div>
        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Electrical Age</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {['0-5 Years', '5-15 Years', '15-30 Years', 'Original / 30+'].map(opt => (
            <button key={opt} onClick={() => updateForm('electricalAge', formData.electricalAge === opt ? '' : opt)} className={clsx("", formData.electricalAge === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
          ))}
        </div>

        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Electrical Condition</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {[{label: 'Updated System ($0/sqft)', mult: 0}, {label: 'Panel Upgrade', mult: 0}, {label: 'Full Rewire', mult: 0}].map(opt => (
            <button key={opt.label} onClick={() => { if (formData.sfElectrical === opt.label) { updateForm('sfElectrical', ''); updateForm('electricalMult', 0); } else { updateForm('sfElectrical', opt.label); updateForm('electricalMult', opt.mult); } }} className={clsx("", formData.sfElectrical === opt.label ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt.label}</button>
          ))}
        </div>
      </div>
    )}


            {/* Toggles moved to sidebar */}

            {/* Dynamic Reaction 2 */}
            {showedPlumbingReaction && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
    "Okay, yeah, we usually end up having to repipe and rewire those older setups anyway, so that's not a deal breaker."
  </div>
</div>
            )}

            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                
                <div className="text-[var(--text-base)] font-black italic text-lg mb-8">
                  "Is the property on city sewer or are they on a septic system?"
                </div>
              
                <div className="mb-6">
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Sewer / Septic</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['City Sewer', 'Septic System'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('septicSewer', formData.septicSewer === opt ? '' : opt)} 
                        className={clsx("", formData.septicSewer === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {formData.septicSewer === 'Septic System' && (
                    <div className="mt-4 mb-4">
                      <div className="text-[var(--text-base)] font-medium italic text-md mt-4 mb-2">
                        "And do you know roughly when the last time it was pumped or inspected was?"
                      </div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Recently Pumped', 'Aging (5+ Years)', 'Unknown / Never Pumped'].map(opt => (
                          <button key={opt} onClick={() => updateForm('septicCondition', formData.septicCondition === opt ? '' : opt)} className={clsx("", formData.septicCondition === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t-2 border-[var(--card-border)] pt-6 mt-6">
                    <div className="text-[var(--text-base)] font-black italic text-lg mb-8 flex items-center gap-2">
                      <span>"Also, are there any solar panels on the roof?"</span>
                      <div className="relative group inline-block">
                        <button className="text-[10px] bg-[var(--card-bg)] text-[#FFFF00] px-2 py-0.5 rounded font-black  shadow-[2px_2px_0px_#FFFF00] hover:-translate-y-0.5 transition-transform">
                          [?] LEASE VS PPA
                        </button>
                        <div className="absolute left-0 bottom-full mb-2 w-72 bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-3 text-xs text-[var(--text-base)] font-normal not-italic shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          Quick Explainer: A standard LEASE is a fixed monthly payment to rent the equipment. A PPA (Power Purchase Agreement) means the homeowner buys the actual power the panels produce at a set rate, meaning their bill fluctuates depending on the season.
                        </div>
                      </div>
                    </div>
                  </div>

                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Solar panels</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['No Solar', 'Solar (Owned)', 'Solar (Lease)', 'Solar (PPA)'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => updateForm('solarSystem', formData.solarSystem === opt ? '' : opt)} 
                        className={clsx("", formData.solarSystem === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  
                  {(formData.solarSystem && formData.solarSystem !== 'No Solar') && (
                    <div className="mb-4">
                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Solar Age</label>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Brand New (0-5 Yrs)', 'Mid-Life (5-15 Yrs)', 'Older (15+ Yrs)'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAge', formData.solarAge === opt ? '' : opt)} className={clsx("", formData.solarAge === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}

                  {(formData.solarSystem === 'Solar (Lease)' || formData.solarSystem === 'Solar (PPA)') && (
                    <div className="mt-4">
                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Solar Lease Details</label>
                      <div className="grid grid-cols-2 gap-6 mt-4">
                        <input type="text" value={formData.solarCompany || ''} onChange={(e) => updateForm('solarCompany', e.target.value)} placeholder="SOLAR COMPANY NAME" className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                        <input type="text" value={formData.solarMonthlyPayment || ''} onChange={(e) => updateForm('solarMonthlyPayment', e.target.value.replace(/[^0-9]/g, ''))} placeholder="MONTHLY PAYMENT $" className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                        <input type="text" value={formData.solarPayoffAmount || ''} onChange={(e) => updateForm('solarPayoffAmount', e.target.value.replace(/[^0-9]/g, ''))} placeholder="TOTAL PAYOFF BALANCE $" className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                      </div>

                      <div className="text-[var(--text-base)] font-medium italic text-sm mt-4 mb-2 flex items-center gap-2">
                        <span>"Is the contract assumable by a new buyer?"</span>
                        <div className="relative group inline-block">
                          <button className="text-[10px] bg-[var(--card-bg)] text-[#FFFF00] px-2 py-0.5 rounded font-black  shadow-[2px_2px_0px_#FFFF00] hover:-translate-y-0.5 transition-transform">
                            [?] Explain Assumable
                          </button>
                          <div className="absolute left-0 bottom-full mb-2 w-64 bg-[var(--card-bg)] border-2 border-[var(--card-border)] p-3 text-xs text-[var(--text-base)] not-italic font-normal shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            ASSUMABLE: The new buyer takes over the monthly payments. <br/><br/>
                            MUST PAYOFF: The seller must pay off the entire remaining balance at closing from their proceeds.
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Yes (Assumable)', 'No (Must Payoff)', 'Unknown'].map(opt => (
                          <button key={opt} onClick={() => updateForm('solarAssumable', formData.solarAssumable === opt ? '' : opt)} className={clsx("", formData.solarAssumable === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            </ConditionSection>
            <ConditionSection 
              id="interior" 
              title="Interior Condition" 
              isComplete={Boolean(formData?.kitchenCondition && formData?.bath1Condition)}
              isOpen={activeConditionSection === 'interior'}
              onToggle={() => setActiveConditionSection(activeConditionSection === 'interior' ? null : 'interior')}
            >
            <div className="flex flex-col mb-2 animate-slideIn">
<div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
<div className="text-[var(--text-base)] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
{formData.propertyType === 'Multi-Family' ? 
                    "Got it. And as far as the inside of the units go... are the kitchens and bathrooms fairly modern across the board, or are they a bit more dated and in need of some work?" :
                   formData.cosmeticsKitchen.length > 0 && formData.cosmeticsBaths.length > 0 ? "You already gave me a good idea of the kitchen and bath conditions..." :
                   hasMajorRepairs
                    ? "Makes sense. It sounds like the house just needs some TLC, which is totally fine—that's what we do. As for the inside, have you updated the kitchens or the bathrooms, or are those mostly original?"
                    : "So it sounds like the bones of the house are pretty solid... as far as the inside goes, if I walked through the front door today, are the kitchens and bathrooms fairly modern, or a bit more dated?"
                  }
      </div>
  </div>
      </div>
  
  {formData.propertyType !== 'Multi-Family' && (
      <div className="mb-6 animate-slideIn">
        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Kitchen Condition</label>
          <div className="flex flex-wrap gap-3 mb-4">
            {[{label: 'Turnkey / Clean'}, {label: 'Dated / Needs Update'}, {label: 'Full Gut Needed'}].map(opt => (
              <button key={`k-${opt.label}`} onClick={(e) => { e.preventDefault(); updateForm('kitchenCondition', opt.label); }} className={clsx("", formData.kitchenCondition === opt.label ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt.label}</button>
            ))}
          </div>
          
          {(() => {
            const bathsCount = Math.ceil(parseFloat(String(formData.baths || '1').replace(/[^0-9.]/g, '')) || 1);
            
            return Array.from({length: Math.min(2, bathsCount)}).map((_, i) => {
              const fieldName = `bath${i + 1}Condition`;
              return (
                <div key={`bath-${i}`} className="mb-4 animate-slideIn">
                  <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Bath {i + 1} Condition</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {[{label: 'Turnkey / Clean'}, {label: 'Dated / Needs Update'}, {label: 'Full Gut Needed'}].map(opt => (
                      <button 
                        key={`b-${i}-${opt.label}`} 
                        onClick={(e) => { e.preventDefault(); updateForm(fieldName, opt.label); }} 
                        className={clsx("", formData[fieldName] === opt.label ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
      </div>
    )}
</ConditionSection>
{formData.propertyType !== 'Multi-Family' && (
            <ConditionSection 
              id="exterior" 
              title="Exterior & Amenities" 
              isComplete={Boolean(formData?.exteriorCondition || formData?.windows || formData?.pool || formData?.hoa)}
              isOpen={activeConditionSection === 'exterior'}
              onToggle={() => setActiveConditionSection(activeConditionSection === 'exterior' ? null : 'exterior')}
            >
          <div className="flex flex-col mb-2 animate-slideIn">
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
      "And what about the outside of the house? Does the stucco and paint look pretty good, and are the windows the original single-pane or have they been updated?"
  </div>
</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Exterior / Stucco Condition</label>
                <div className="flex flex-col gap-2">
                  {['Good / Minor Wear', 'Needs Paint / Stucco Patch', 'Heavy Dry Rot / Siding Replacement'].map(opt => (
                    <button 
                      key={opt} 
                      onClick={() => updateForm('exteriorCondition', formData.exteriorCondition === opt ? '' : opt)}
                      className={clsx("text-left", formData.exteriorCondition === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Windows</label>
                <div className="flex flex-col gap-2">
                  {['Original Single-Pane', 'Updated Dual-Pane', 'Mixed / Partial Update'].map(opt => (
                    <button 
                      key={opt} 
                      onClick={() => updateForm('windowCondition', formData.windowCondition === opt ? '' : opt)}
                      className={clsx("text-left", formData.windowCondition === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
              {/* Toggles moved to sidebar */}
  
              {/* Dynamic Reaction 3 */}
              {(formData.cosmeticsKitchen.includes('Heavy Rehab') || Object.values(formData.cosmeticsBathsData || {}).some(v => typeof v === 'string' && v.includes('Heavy Rehab'))) && (
              <div className="flex flex-col mb-2 animate-slideIn" style={{ animation: 'slideInUp 0.3s ease forwards' }}>
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
    "Gotcha. Sounds like it needs some pretty heavy cosmetic love. That's right up our alley."
  </div>
</div>
            )}

        {formData.propertyType !== 'Multi-Family' && (
                <div className="flex flex-col mb-2 animate-slideIn">
                  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                    "Perfect. And just for my own records as I'm writing this up, is there a pool in the backyard, and is the property part of an active HOA?"
                  </div>

                  <div className="flex flex-col gap-6">
                    <div>
                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Pool</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has Pool', 'No Pool'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityPool', opt)} className={clsx("", formData.amenityPool === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                      {formData.amenityPool === 'Has Pool' && (
                        <div className="mt-3 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl animate-slideIn">
                          <div className="text-sm text-[var(--text-base)] mb-3 italic">"Is the pool currently full and functioning, or is it empty/green?"</div>
                          <div className="flex flex-wrap gap-2">
                            {['Functioning', 'Needs Repair', 'Needs Demo/Fill'].map(cond => (
                              <button 
                                key={cond} 
                                onClick={() => updateForm('poolCondition', formData.poolCondition === cond ? '' : cond)}
                                className={clsx("text-xs font-bold", formData.poolCondition === cond ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "px-4 py-2 bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[var(--brand-primary)]/50")}
                              >
                                {cond}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">HOA Status</label>
                      <div className="flex flex-wrap gap-3">
                        {['Active HOA', 'No HOA'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityHOA', opt)} className={clsx("", formData.amenityHOA === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                      {formData.amenityHOA === 'Active HOA' && (
                        <div className="mt-3 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl animate-slideIn">
                          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">HOA Monthly Fee $</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 250" 
                            value={formData.hoaMonthlyFee || ''} 
                            onChange={e => updateForm('hoaMonthlyFee', e.target.value)} 
                            className="w-full bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3 text-[var(--text-base)] focus:outline-none focus:border-[var(--brand-primary)] transition-all" 
                          />
                          <div className="mt-3">
                            <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Any Rental Restrictions?</label>
                            <div className="flex flex-wrap gap-2">
                              {['None', 'No Short-Term (AirBnb)', 'No Rentals Allowed', 'Unknown'].map(res => (
                                <button 
                                  key={res} 
                                  onClick={() => updateForm('hoaRentalRestrictions', formData.hoaRentalRestrictions === res ? '' : res)}
                                  className={clsx("text-xs font-bold", formData.hoaRentalRestrictions === res ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "px-4 py-2 bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[var(--brand-primary)]/50")}
                                >
                                  {res}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">RV Parking / Hookups</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has RV Parking', 'No RV Parking'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityRV', opt)} className={clsx("", formData.amenityRV === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5 block">Guest House / Casita</label>
                      <div className="flex flex-wrap gap-3">
                        {['Has Guest House', 'No Guest House'].map(opt => (
                          <button key={opt} onClick={() => updateForm('amenityGuestHouse', opt)} className={clsx("", formData.amenityGuestHouse === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>
                      {formData.amenityGuestHouse === 'Has Guest House' && (
      <div className="mt-4 p-4 border border-[var(--card-border)] bg-[var(--bg-base)] rounded-xl mb-4">
        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Guest House Type</label>
        <div className="flex flex-wrap gap-3 mb-4">
          {['Permitted ADU', 'Unpermitted Conversion', 'Detached Studio/Shed'].map(type => (
            <button key={type} onClick={(e) => { e.preventDefault(); updateForm('guestHouseType', type); }} className={formData.guestHouseType === type ? "flex-1 bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 rounded-xl px-4 py-3 text-[10px] md:text-xs font-black shadow-[0_0_12px_rgba(229,193,88,0.2)]" : "flex-1 bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold"}>{type}</button>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Beds</label>
            <input type="number" value={formData.ghBeds || ''} onChange={(e) => updateForm('ghBeds', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
          </div>
          <div>
            <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Baths</label>
            <input type="number" value={formData.ghBaths || ''} onChange={(e) => updateForm('ghBaths', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
          </div>
          <div>
            <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Sqft</label>
            <input type="number" value={formData.ghSqft || ''} onChange={(e) => updateForm('ghSqft', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
          </div>
        </div>

        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Utilities</label>
        <div className="flex gap-2 mb-4">
          {['Tied to Main', 'Separate Hookups'].map(opt => (
            <button key={'util'+opt} onClick={(e) => { e.preventDefault(); updateForm('ghUtilities', opt); }} className={formData.ghUtilities === opt ? "flex-1 bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black" : "flex-1 bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold"}>{opt}</button>
          ))}
        </div>

        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Sewer</label>
        <div className="flex gap-2">
          {['Tied to Main', 'Separate Septic'].map(opt => (
            <button key={'sewer'+opt} onClick={(e) => { e.preventDefault(); updateForm('ghSewer', opt); }} className={formData.ghSewer === opt ? "flex-1 bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black" : "flex-1 bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold"}>{opt}</button>
          ))}
        </div>
      </div>
    )}
                    </div>
                  </div>
                </div>
            )}
            </ConditionSection>
)}
{formData.propertyType !== 'Multi-Family' && (
            <ConditionSection 
              id="redflags" 
              title="Red Flags & Structure" 
              isComplete={Boolean(formData?.structuralRedFlags?.length > 0)}
              isOpen={activeConditionSection === 'redflags'}
              onToggle={() => setActiveConditionSection(activeConditionSection === 'redflags' ? null : 'redflags')}
            >
            <div className="flex flex-col mb-2 animate-slideIn" style={{ marginTop: '2rem' }}>
  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
    <div className="text-[var(--text-base)] text-[#E2E8F0] font-medium text-lg leading-relaxed font-medium mb-4">
    "Okay, that gives me a great picture of the inside. Last thing before we talk numbers—just to check my standard boxes, have you guys noticed any settling with the foundation, or are there any unpermitted add-ons we'd need to factor in?"
    </div>
  </div>

  {formData.propertyType !== 'Multi-Family' && (
    <div className="mb-6 animate-slideIn">
      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Structural Red Flags / Unpermitted Work</label>
      
              <div className="mb-6">
                <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">MAJOR RED FLAGS (Select all that apply)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {['Foundation / Structural Issues', 'Unpermitted Additions / ADU', 'Fire Damage', 'Water Damage / Mold', 'City Code Violations / Red Tags', 'Known Liens / Judgments'].map(flag => {
                    const isSelected = formData.majorRedFlags?.includes(flag);
                    return (
                      <button 
                        key={flag}
                        onClick={() => {
                          const current = formData.majorRedFlags || [];
                          const nextFlags = isSelected ? current.filter(f => f !== flag) : [...current, flag];
                          setFormData(prev => {
                            let updates = { majorRedFlags: nextFlags };
                            if (isSelected) {
                              if (flag === 'Foundation / Structural Issues') {
                                updates.redFlagFoundation = '';
                                updates.redFlagFoundationDetails = '';
                              } else if (flag === 'Unpermitted Additions / ADU') {
                                updates.redFlagADUDesc = '';
                                updates.redFlagADUSqft = '';
                                updates.redFlagADUType = '';
                              } else if (flag === 'Fire Damage') {
                                updates.redFlagFire = '';
                                updates.redFlagFireDetails = '';
                              } else if (flag === 'Water / Flood Damage') {
                                updates.redFlagWater = '';
                                updates.redFlagWaterStatus = '';
                              } else if (flag === 'City / Code Violations') {
                                updates.redFlagFines = '';
                                updates.redFlagFinesStatus = '';
                              } else if (flag === 'Tax / Mechanic Liens') {
                                updates.redFlagLienType = '';
                                updates.redFlagLienAmount = '';
                              }
                            }
                            return { ...prev, ...updates };
                          });
                        }} 
                        className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                      >
                        {flag}
                      </button>
                    )
                  })}
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  {formData.majorRedFlags?.includes('Foundation / Structural Issues') && (
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5">
                      <div className="text-[var(--text-base)] font-black italic mb-8">"You mentioned the foundation—are we talking about standard hairline cracks, or has there been major sinking and shifting?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Minor Settling / Cracks', 'Major Sinking / Shifting'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFoundation', opt)} className={clsx("", formData.redFlagFoundation === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>

                      {formData.redFlagFoundation === 'Minor Settling / Cracks' && (
                        <div className="mt-4 animate-slideIn">
                          <div className="text-[var(--text-base)] font-black italic mb-8 text-sm">"Got it, so just typical hairline cracks, nothing the city has ever been involved with or required underpinning for?"</div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {['Typical Settling (No Action)', 'Previously Repaired/Underpinned'].map(opt => (
                              <button key={opt} onClick={() => updateForm('redFlagFoundationDetails', opt)} className={clsx("", formData.redFlagFoundationDetails === opt ? "bg-[#FFFF00] rounded-xl border border-[var(--card-border)] text-[var(--text-base)] font-black text-xs  px-3 py-1 cursor-pointer" : "bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] text-gray-600 font-bold text-xs  px-3 py-1 cursor-pointer")}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.redFlagFoundation === 'Major Sinking / Shifting' && (
                        <div className="mt-4 animate-slideIn">
                          <div className="text-[var(--text-base)] font-black italic mb-8 text-sm">"Since it's major shifting, has a structural engineer looked at it, or is the floor visibly slanting?"</div>
                          <div className="flex flex-wrap gap-3 mb-4">
                            {['Engineer Report Available', 'Visible Slant / Unassessed'].map(opt => (
                              <button key={opt} onClick={() => updateForm('redFlagFoundationDetails', opt)} className={clsx("", formData.redFlagFoundationDetails === opt ? "bg-[#FFFF00] rounded-xl border border-[var(--card-border)] text-[var(--text-base)] font-black text-xs  px-3 py-1 cursor-pointer" : "bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] text-gray-600 font-bold text-xs  px-3 py-1 cursor-pointer")}>{opt}</button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Unpermitted Additions / ADU') && (
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5">
                      <div className="text-[var(--text-base)] font-black italic mb-8">"For that unpermitted space, what exactly was added, and roughly how many square feet is it?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Garage Conversion', 'Room Addition', 'Full ADU / Casita', 'Enclosed Patio'].map(opt => {
                          const isSelected = formData.unpermittedTypes?.includes(opt);
                          return (
                            <button 
                              key={opt} 
                              onClick={() => {
                                const current = formData.unpermittedTypes || [];
                                updateForm('unpermittedTypes', isSelected ? current.filter(x => x !== opt) : [...current, opt]);
                              }} 
                              className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                      <div className="flex flex-col gap-3">
                        <input type="number" placeholder="EST. SQFT ADDED" value={formData.redFlagADUSqft || ''} onChange={(e) => updateForm('redFlagADUSqft', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-[var(--text-base)] outline-none focus:border-[var(--brand-primary)]" />
                      </div>
                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Fire Damage') && (
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5">
                      <div className="text-[var(--text-base)] font-black italic mb-8">"With the fire damage, was it mostly cosmetic smoke damage, or did it burn into the structural framing?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Cosmetic / Smoke Only', 'Structural / Framing Damage'].map(opt => (
                          <button key={opt} onClick={() => updateForm('redFlagFire', opt)} className={clsx("", formData.redFlagFire === opt ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}>{opt}</button>
                        ))}
                      </div>

                      {formData.redFlagFire === 'Cosmetic / Smoke Only' && (
                        <div className="flex flex-wrap gap-2 mt-4 animate-slideIn">
                          {['Professionally Mitigated', 'Needs Smoke Remediation / Paint', 'Active Insurance Claim'].map(opt => (
                            <button key={opt} onClick={() => updateForm('redFlagFireDetails', opt)} className={clsx("", formData.redFlagFireDetails === opt ? "bg-[#FFFF00] rounded-xl border border-[var(--card-border)] text-[var(--text-base)] font-black text-xs  px-3 py-1 cursor-pointer" : "bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] text-gray-600 font-bold text-xs  px-3 py-1 cursor-pointer")}>{opt}</button>
                          ))}
                        </div>
                      )}

                      {formData.redFlagFire === 'Structural / Framing Damage' && (
                        <div className="flex flex-wrap gap-2 mt-4 animate-slideIn">
                          {['Red Tagged / Condemned', 'Meters Pulled By City', 'Total Tear Down', 'Active Insurance Claim'].map(opt => (
                            <button key={opt} onClick={() => updateForm('redFlagFireDetails', opt)} className={clsx("", formData.redFlagFireDetails === opt ? "bg-[#FFFF00] rounded-xl border border-[var(--card-border)] text-[var(--text-base)] font-black text-xs  px-3 py-1 cursor-pointer" : "bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] text-gray-600 font-bold text-xs  px-3 py-1 cursor-pointer")}>{opt}</button>
                          ))}
                        </div>
                      )}

                      {formData.redFlagFireDetails === 'Active Insurance Claim' && (
                         <div className="flex flex-col gap-3 mt-4 animate-slideIn border-l-2 border-[var(--brand-primary)] pl-3">
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest">Insurance Claim Status</label>
                           <input type="text" placeholder="e.g. Filed, Adjuster Coming..." value={formData.fireClaimStatus || ''} onChange={(e) => updateForm('fireClaimStatus', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-[var(--text-base)] outline-none focus:border-[var(--brand-primary)] text-xs" />
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2">Expected Payout Amount $</label>
                           <input type="number" placeholder="Amount $" value={formData.fireClaimPayout || ''} onChange={(e) => updateForm('fireClaimPayout', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-[var(--text-base)] outline-none focus:border-[var(--brand-primary)] text-xs" />
                         </div>
                      )}

                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Water Damage / Mold') && (
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5">
                      <div className="text-[var(--text-base)] font-black italic mb-8">"For the water/mold issue—is there still an active leak or standing water, or is it an old leak that has completely dried out?"</div>
                      <div className="flex flex-wrap gap-3">
                        {['Active Leak / Standing Water', 'Dried Out / Past Leak', 'Visible Mold Present', 'Professional Remediation Done', 'Active Insurance Claim'].map(opt => {
                          const isSelected = formData.waterDamageTypes?.includes(opt);
                          return (
                            <button 
                              key={opt} 
                              onClick={() => {
                                const current = formData.waterDamageTypes || [];
                                updateForm('waterDamageTypes', isSelected ? current.filter(x => x !== opt) : [...current, opt]);
                              }} 
                              className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>

                      {formData.waterDamageTypes?.includes('Active Insurance Claim') && (
                         <div className="flex flex-col gap-3 mt-4 animate-slideIn border-l-2 border-[var(--brand-primary)] pl-3">
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest">Insurance Claim Status</label>
                           <input type="text" placeholder="e.g. Filed, Adjuster Coming..." value={formData.waterClaimStatus || ''} onChange={(e) => updateForm('waterClaimStatus', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-[var(--text-base)] outline-none focus:border-[var(--brand-primary)] text-xs" />
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2">Expected Payout Amount $</label>
                           <input type="number" placeholder="Amount $" value={formData.waterClaimPayout || ''} onChange={(e) => updateForm('waterClaimPayout', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-[var(--text-base)] outline-none focus:border-[var(--brand-primary)] text-xs" />
                         </div>
                      )}
                      {formData.waterDamageTypes?.includes('Professional Remediation Done') && (
                         <div className="flex flex-col gap-3 mt-4 animate-slideIn border-l-2 border-[#00E5FF] pl-3">
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest">Who did the work?</label>
                           <input type="text" placeholder="Contractor / Company Name" value={formData.waterRemediationCompany || ''} onChange={(e) => updateForm('waterRemediationCompany', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-3 text-[var(--text-base)] outline-none focus:border-[#00E5FF] text-xs" />
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2">Did they get paid?</label>
                           <div className="flex gap-2">
                             {['Yes', 'No', 'Pending'].map(status => (
                               <button key={status} onClick={() => updateForm('waterRemediationPaid', status)} className={"flex-1 py-2 text-xs font-bold rounded-xl border " + (formData.waterRemediationPaid === status ? "bg-[#00E5FF] text-[#000000] border-[#00E5FF]" : "bg-[var(--card-bg)] text-[var(--text-muted)] border-[var(--card-border)]")}>{status}</button>
                             ))}
                           </div>
                         </div>
                      )}

                    </div>
                  )}

                  {formData.majorRedFlags?.includes('City Code Violations / Red Tags') && (
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5">
                      <div className="text-[var(--text-base)] font-black italic mb-8">"Since the city is involved, do you know if there are any active fines or daily penalties adding up?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Active Fines Accumulating', 'Stop Work Order', 'Red Tagged'].map(opt => {
                          const isSelected = formData.cityViolations?.includes(opt);
                          return (
                            <button 
                              key={opt} 
                              onClick={() => {
                                const current = formData.cityViolations || [];
                                updateForm('cityViolations', isSelected ? current.filter(x => x !== opt) : [...current, opt]);
                              }} 
                              className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                      
                      {formData.cityViolations?.map(type => (
                         <div key={type} className="mb-3 animate-slideIn">
                           <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">{type} - FINE AMOUNT $</label>
                           <input type="number" placeholder="FINE AMOUNT $" value={formData.fineAmounts?.[type] || ''} onChange={(e) => updateForm('fineAmounts', { ...(formData.fineAmounts || {}), [type]: e.target.value })} className="w-full max-w-sm bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-3 font-black text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                         </div>
                      ))}

                    </div>
                  )}

                  {formData.majorRedFlags?.includes('Known Liens / Judgments') && (
                    <div className="bg-[var(--card-bg)] border border-[var(--card-border)] p-5 rounded-xl mb-5">
                      <div className="text-[var(--text-base)] font-black italic mb-8">"I appreciate you being upfront about that. Just so our title team knows what they are looking at when we pull the records, what kind of lien is it, and do you know roughly what the payoff amount is?"</div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        {['Tax Lien (Property/IRS)', 'Mechanic\'s Lien (Contractor)', 'HOA Lien', 'Child Support/Alimony', 'Mortgage Judgment'].map(opt => {
                          const isSelected = formData.lienTypes?.includes(opt);
                          return (
                            <button 
                              key={opt} 
                              onClick={() => {
                                const current = formData.lienTypes || [];
                                updateForm('lienTypes', isSelected ? current.filter(x => x !== opt) : [...current, opt]);
                              }} 
                              className={clsx("", isSelected ? "flex-1 min-w-[120px] bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-black tracking-wider transition-all cursor-pointer text-center" : "flex-1 min-w-[120px] bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider hover:border-[var(--brand-primary)] hover:bg-[var(--card-bg)] hover:text-[var(--text-base)] transition-all cursor-pointer text-center")}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>
                      <input type="number" placeholder="EST. PAYOFF AMOUNT $" value={formData.redFlagLienAmount || ''} onChange={(e) => updateForm('redFlagLienAmount', e.target.value)} className="w-full max-w-sm bg-[var(--card-bg)] rounded-xl border border-[var(--card-border)] p-3 font-black  text-xs shadow-md focus:outline-none focus:translate-y-1 focus:shadow-none transition-all" />
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
</ConditionSection>
)}
  
              {currentStep === 2 && (
              <>
              {/* INLINE REPAIRS ENGINE - EXECUTED DURING CONDITION DISCOVERY */}
              <div className="mt-8 pt-8 border-t border-[var(--card-border)] w-full">
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-[var(--card-bg)] p-2 rounded-lg border border-[var(--card-border)]">
                    <Wrench size={18} className="text-[var(--brand-primary)]" />
                  </span>
                  <div>
                    <h3 className="text-[var(--brand-primary)] font-black tracking-widest text-sm uppercase">Inline Repairs Engine</h3>
                    <p className="text-[var(--text-muted)] text-xs font-bold mt-1">Calculate rehab costs in real-time as the seller details the property condition.</p>
                  </div>
                </div>
                
                <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-4 md:p-6 shadow-inner">
                  <RepairsCalculator formData={formData} updateForm={updateForm} lead={activeLead} />
                </div>
              </div>

              <div className="mt-12 mb-8 flex justify-center">
                  <button 
                    onClick={() => {
                      handleProceed(3);
                      setTimeout(() => {
                        document.getElementById('pillar-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 350);
                    }}
                    className="mt-6 w-full py-4 bg-[var(--card-bg)] hover:bg-[var(--card-border)] text-[var(--brand-primary)] border border-[var(--brand-primary)] shadow-[0_0_15px_rgba(229,193,88,0.2)] hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] font-black tracking-widest text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    Proceed to Pillar 3 →
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {/* PILLAR 3: ESCROW TIMELINE & LOGISTICS */}
        {activeSource !== 'Agent Outreach' && renderPillar(3, "Escrow Timeline & Logistics", <Clock size={20} />, (

          <div className="flex flex-col gap-6 animate-fadeIn">

            {/* SECTION 1: TARGET TIMELINE */}
            <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-5 md:p-6">
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                "Okay, I've got a great picture of the property. Assuming we can come to an agreement on the numbers, how quickly were you looking to get this closed and completely off your hands?"
              </div>
              
              <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-3">Target Timeline</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {['ASAP', '1-3 Months', '3-6 Months', '6+ Months'].map(time => (
                  <button 
                    key={time}
                    type="button"
                    className={clsx(
                      "flex-1 min-w-[100px] rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center",
                      formData.timeline === time 
                        ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] font-black" 
                        : "bg-[var(--card-bg)] shadow-sm text-gray-300 border border-[var(--card-border)] hover:bg-[#1a1a1a] hover:text-[var(--text-base)]"
                    )}
                    onClick={(e) => { e.preventDefault(); handleSingleSelect('timeline', time); }}
                  >
                    {time}
                  </button>
                ))}
              </div>
              
              <div>
                <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Target Close Date</label>
                <div className="flex items-center gap-3 w-full md:w-1/2">
                  <input 
                    type="date" 
                    value={formData.targetCloseDate || ''} 
                    onChange={(e) => handleSingleSelect('targetCloseDate', e.target.value)} 
                    className="flex-1 bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] outline-none" 
                    style={{ colorScheme: 'dark' }}
                  />
                  {formData.targetCloseDate && (
                    <span className="text-[var(--brand-primary)] font-bold text-xs tracking-widest uppercase">
                      {new Date(formData.targetCloseDate + 'T00:00:00').toLocaleDateString('en-US')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: RELOCATION DESTINATION */}
            <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-5 md:p-6">
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                "And where are you guys heading next? Are you staying local here in the area, or are you relocating out of state?"
              </div>
              
              <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-3">Relocation Destination</label>
              <div className="flex gap-2 mb-4">
                <button 
                  type="button"
                  className={clsx(
                    "flex-1 rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center",
                    formData.relocatingOutofState === false 
                      ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] font-black" 
                      : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444] hover:text-[var(--text-muted)]"
                  )}
                  onClick={(e) => { e.preventDefault(); handleSingleSelect('relocatingOutofState', false); }}
                >
                  Staying Local
                </button>
                <button 
                  type="button"
                  className={clsx(
                    "flex-1 rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center",
                    formData.relocatingOutofState === true 
                      ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] font-black" 
                      : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444] hover:text-[var(--text-muted)]"
                  )}
                  onClick={(e) => { e.preventDefault(); handleSingleSelect('relocatingOutofState', true); }}
                >
                  Out of State
                </button>
              </div>

              <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Relocation Plans / Details</label>
              <textarea 
                placeholder="Where are they moving? Have they found a place yet?..." 
                value={formData.relocationPlans || ''} 
                onChange={(e) => updateForm('relocationPlans', e.target.value)} 
                className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] outline-none min-h-[80px]" 
              />
            </div>

            {/* SECTION 3: CASH TO MOVE / POST-POSSESSION */}
            <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-5 md:p-6">
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                "Got it. One thing we run into a lot is sellers needing the funds from the sale to actually pay for their move or put a deposit on their next place. Is that the case for you, or do you have the move covered?"
              </div>
              
              <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-3">Needs Funds From Close to Move?</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  className={clsx(
                    "flex-1 rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center",
                    formData.cashToMoveNeeded === 'Yes' 
                      ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] font-black" 
                      : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444]"
                  )}
                  onClick={(e) => { e.preventDefault(); handleSingleSelect('cashToMoveNeeded', 'Yes'); }}
                >
                  Yes - Needs Funds First
                </button>
                <button 
                  type="button"
                  className={clsx(
                    "flex-1 rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center",
                    formData.cashToMoveNeeded === 'No' 
                      ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)] font-black" 
                      : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444]"
                  )}
                  onClick={(e) => { e.preventDefault(); handleSingleSelect('cashToMoveNeeded', 'No'); }}
                >
                  No - Has Move Covered
                </button>
              </div>

              {/* CONDITIONAL POST-POSSESSION LOGIC */}
              {formData.cashToMoveNeeded === 'Yes' && (
                <div className="mt-6 border-t border-[var(--card-border)]/50 pt-6 animate-fadeIn">
                  <div className="bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">
                    "That's completely fine, we do this all the time. What we would do is a <strong>Post-Possession Close</strong>. We officially close escrow so you get a large chunk of your cash upfront. You then have 1 to 4 weeks to move out. We leave a small 'holdback' in escrow, and once you're fully moved out and we do a final walkthrough, the rest of the funds are released to you. <br/><br/>How many days would you need after closing to make the move?"
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Days Needed Post-Close</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 14" 
                        value={formData.postCloseDays || ''} 
                        onChange={(e) => updateForm('postCloseDays', e.target.value)} 
                        className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] outline-none" 
                      />
                      {formData.targetCloseDate && formData.postCloseDays && (
                        <div className="mt-2 text-[10px] text-[var(--brand-primary)] font-bold tracking-widest uppercase">
                          Move-Out Date: {new Date(new Date(formData.targetCloseDate).getTime() + (formData.postCloseDays * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { timeZone: 'UTC' })}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Escrow Holdback</label>
                      <div className="flex gap-2">
                        {/* $ / % Toggle Group */}
                        <div className="flex rounded-xl overflow-hidden border border-[var(--card-border)] shrink-0">
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); updateForm('holdbackType', '$'); }}
                            className={clsx(
                              "px-4 py-3 text-xs md:text-sm font-black transition-all",
                              (!formData.holdbackType || formData.holdbackType === '$') 
                                ? "bg-[var(--card-bg)] text-[var(--brand-primary)] shadow-[inset_0_0_10px_rgba(229,193,88,0.2)]" 
                                : "bg-[var(--bg-base)] text-[var(--text-muted)] hover:bg-[#111111]"
                            )}
                          >
                            $
                          </button>
                          <button 
                            type="button"
                            onClick={(e) => { e.preventDefault(); updateForm('holdbackType', '%'); }}
                            className={clsx(
                              "px-4 py-3 text-xs md:text-sm font-black transition-all border-l border-[var(--card-border)]",
                              formData.holdbackType === '%' 
                                ? "bg-[var(--card-bg)] text-[var(--brand-primary)] shadow-[inset_0_0_10px_rgba(229,193,88,0.2)]" 
                                : "bg-[var(--bg-base)] text-[var(--text-muted)] hover:bg-[#111111]"
                            )}
                          >
                            %
                          </button>
                        </div>
                        {/* Number Input */}
                        <input 
                          type="number" 
                          placeholder="Amount..." 
                          value={formData.holdbackAmount || ''} 
                          onChange={(e) => updateForm('holdbackAmount', e.target.value)} 
                          className="flex-1 bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {currentStep === 3 && (
              <button 
                type="button"
                className="mt-6 w-full py-4 bg-[var(--card-bg)] hover:bg-[var(--card-border)] text-[var(--brand-primary)] border border-[var(--brand-primary)] shadow-[0_0_15px_rgba(229,193,88,0.2)] hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] font-black tracking-widest text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                onClick={() => handleProceed(4)}
              >
                Proceed to Pillar 4 →
              </button>
            )}
          </div>
        ))}

        {/* PILLAR 4: FINANCIALS & DEBT */}
        {activeSource !== 'Agent Outreach' && renderPillar(4, "Financials & Debt", <DollarSign size={20} />, (
<div className="flex flex-col gap-6 animate-fadeIn">
  <div className="bg-[var(--bg-base)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
    "Got it. Because you are considering an offer like this, my underwriting team always asks me to check—is there currently a mortgage on the property, or is it totally paid off?"
  </div>

  <div className="flex gap-2">
    <button type="button" className={clsx("flex-1 rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center", formData.freeAndClear ? "bg-[var(--card-bg)] text-[#10b981] border border-[#10b981]/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]" : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444]")} onClick={(e) => { e.preventDefault(); updateForm('freeAndClear', true); }}>Property is Free & Clear</button>
    <button type="button" className={clsx("flex-1 rounded-xl px-4 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center", formData.freeAndClear === false ? "bg-[var(--card-bg)] text-[var(--brand-primary)] border border-[var(--brand-primary)]/60 shadow-[0_0_12px_rgba(229,193,88,0.2)]" : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444]")} onClick={(e) => { e.preventDefault(); updateForm('freeAndClear', false); }}>Has Mortgage / Liens</button>
  </div>

  {!formData.freeAndClear && (
    <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">1st Mortgage Balance</label>
        <input type="text" placeholder="$0" value={formData.mortgageBalance || ''} onChange={(e) => updateForm('mortgageBalance', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
      </div>
      <div>
        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Monthly Payment (PITI)</label>
        <input type="text" placeholder="$0" value={formData.mortgagePITI || ''} onChange={(e) => updateForm('mortgagePITI', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
      </div>
      <div>
        <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">2nd Position / HELOC</label>
        <input type="text" placeholder="$0" value={formData.secondPosition || ''} onChange={(e) => updateForm('secondPosition', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
      </div>
      <div>
        <label className="block text-[#ef4444] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Arrears / Behind Amount</label>
        <input type="text" placeholder="$0" value={formData.arrearsAmount || ''} onChange={(e) => updateForm('arrearsAmount', e.target.value)} className="w-full bg-[#1A0505]/80 text-[var(--text-base)] border border-[#ef4444]/30 rounded-xl p-3 focus:border-[#ef4444] outline-none" />
      </div>
      <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        <div>
          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Underlying Interest Rate (%)</label>
          <input type="text" placeholder="e.g. 3.5%" value={formData.underlyingInterestRate || ''} onChange={(e) => updateForm('underlyingInterestRate', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
        </div>
        <div>
          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Loan Term / Maturity Date</label>
          <input type="text" placeholder="e.g. 2045" value={formData.loanTerm || ''} onChange={(e) => updateForm('loanTerm', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
        </div>
        <div>
          <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-1.5">Cash Needed in Pocket</label>
          <input type="text" placeholder="$0 (Down Pmt)" value={formData.cashNeededToWalk || ''} onChange={(e) => updateForm('cashNeededToWalk', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 focus:border-[var(--brand-primary)] outline-none" />
        </div>
      </div>
    </div>
  )}

  <div className="flex gap-4 mt-2">
    <div className="flex-1 bg-[#1A1005] border border-[#f59e0b]/30 rounded-xl p-4 text-center">
      <div className="text-[10px] text-[#f59e0b] font-bold tracking-widest uppercase mb-1">Total Est. Debt</div>
      <div className="text-xl font-black text-[#f59e0b]">${(Number((formData.mortgageBalance||'').toString().replace(/[^0-9.-]+/g,"")) || 0) + (Number((formData.secondPosition||'').toString().replace(/[^0-9.-]+/g,"")) || 0) + (Number((formData.arrearsAmount||'').toString().replace(/[^0-9.-]+/g,"")) || 0)}</div>
    </div>
    <div className="flex-1 bg-[#051A10] border border-[#10b981]/30 rounded-xl p-4 text-center">
      <div className="text-[10px] text-[#10b981] font-bold tracking-widest uppercase mb-1">Est. Net To Seller (Off Asking)</div>
      <div className="text-xl font-black text-[#10b981]">${(Number((formData.askingPrice||'').toString().replace(/[^0-9.-]+/g,"")) || 0) - ((Number((formData.mortgageBalance||'').toString().replace(/[^0-9.-]+/g,"")) || 0) + (Number((formData.secondPosition||'').toString().replace(/[^0-9.-]+/g,"")) || 0) + (Number((formData.arrearsAmount||'').toString().replace(/[^0-9.-]+/g,"")) || 0))}</div>
    </div>
  </div>

  <button 
    type="button"
    className="mt-6 w-full py-4 bg-[var(--card-bg)] hover:bg-[var(--card-border)] text-[var(--brand-primary)] border border-[var(--brand-primary)] shadow-[0_0_15px_rgba(229,193,88,0.2)] hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] font-black tracking-widest text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
    onClick={() => handleProceed(5)}
  >
    Proceed to Pillar 5 →
  </button>
</div>
        ))}

        {/* PILLAR 5: THE OFFER PIVOT */}
        {activeSource !== 'Agent Outreach' && renderPillar(5, "The Offer (Pivot)", <HeartHandshake size={20} />, (
<div className="flex flex-col gap-6 animate-fadeIn">
  {(() => {
  const parsedAsking = Number((formData.askingPrice || '').toString().replace(/[^0-9.-]+/g, "")) || 0;
  const mao = masterLead?.financialEngine?.mao || formData.calculatedCashMAO || 0;
  const pt = formData.pitchType || 'cash';

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {['cash', 'subto', 'sellerfinance', 'hybrid'].map(type => {
          const labels = {
            'cash': 'Cash Offer',
            'subto': 'Sub-To (Debt)',
            'sellerfinance': 'Seller Finance',
            'hybrid': 'Hybrid (Both)'
          };
          const isActive = pt === type;
          return (
            <button 
              key={type}
              type="button" 
              className={clsx(
                "rounded-xl px-2 py-3 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center", 
                isActive ? "bg-[var(--card-bg)] text-[#10b981] border border-[#10b981]/60 shadow-[0_0_12px_rgba(16,185,129,0.2)] font-black" : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444]"
              )} 
              onClick={(e) => { e.preventDefault(); handleSingleSelect('pitchType', type); }}
            >
              {labels[type]}
            </button>
          )
        })}
      </div>

      {pt === 'cash' ? (
        parsedAsking > 0 && mao >= parsedAsking ? (
          <div className="bg-[var(--bg-base)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
            "Great news. I've got my underwriters looking at it, and because your asking price of <strong>${parsedAsking.toLocaleString()}</strong> works with our formulas, we can actually accept that number. We pay cash, buy it completely as-is, and cover all of your closing costs. Does that sound like a deal we can move forward with today?"
          </div>
        ) : (
          <div className="bg-[var(--bg-base)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
            "Since we are paying cash and covering 100% of closing costs, we are coming in right around <strong>${mao.toLocaleString()}</strong>. Would it be a ridiculous idea to consider an offer in that ballpark?"
          </div>
        )
      ) : pt === 'subto' ? (
        <div className="flex flex-col gap-4">
          <div className="bg-[#051A10]/60 border-l-2 border-[#10b981] p-4 rounded-r-xl text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
            "So a cash offer is too low. If you're open to terms, we can get you retail price. Here is how it works: We give you a down payment in cash, we officially take over your monthly payments, we catch up any arrears, and we handle all maintenance. The loan stays in your name temporarily while we pay it down."
          </div>
          <button type="button" onClick={(e) => { e.preventDefault(); updateForm('showBenefits', !formData.showBenefits); }} className="w-full bg-[var(--card-bg)] border border-[#10b981]/30 text-[#10b981] py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#10b981]/10 transition-colors">
            {formData.showBenefits ? 'Hide Secondary Benefits' : 'Show Secondary Benefits'}
          </button>
          {formData.showBenefits && (
            <div className="bg-[var(--bg-base)] border border-[var(--card-border)] p-4 rounded-xl text-[var(--text-muted)] text-xs md:text-sm leading-relaxed shadow-inner">
              "The benefits to you: 1. It boosts your credit score because we make on-time payments. 2. It avoids foreclosure. 3. If we ever default, the deed reverts back to you—meaning you get the house back in better condition, AND you keep all the cash we gave you and the payments we made."
            </div>
          )}
        </div>
      ) : pt === 'sellerfinance' ? (
        <div className="bg-[#051A10]/60 border-l-2 border-[#10b981] p-4 rounded-r-xl text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
            "Since you own it free and clear, a cash offer might mean taking a huge discount. If you're open to being the bank, we can pay you close to retail. You'll act as the lender, and we'll make monthly payments directly to you with interest. You get a steady mailbox income without any of the landlord headaches."
        </div>
      ) : (
        <div className="bg-[#051A10]/60 border-l-2 border-[#10b981] p-4 rounded-r-xl text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-inner">
            "A hybrid offer bridges the gap. We take over your existing loan payments, and for the remaining equity you have in the home, we'll set up a seller carry-back note. So you get some cash now, your debt is covered, and you get monthly payments on the rest of your equity."
        </div>
      )}
    </>
  );
})()}

  {/* Rebuttals Section */}
  <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-5 mt-4">
    <label className="block text-[var(--text-muted)] font-bold text-[10px] md:text-xs uppercase tracking-widest mb-3">Objection Handling</label>
    <div className="flex flex-wrap gap-2 mb-4">
      {(() => {
        const isCash = !formData.pitchType || formData.pitchType === 'cash';
        const objList = isCash 
          ? ['Too Low', 'Not Open to Terms', 'Need to Think About It'] 
          : ["I don't want my name on the loan", 'What if you stop paying?', 'Need to Think About It'];
        
        return objList.map(obj => (
          <button key={obj} type="button" className={clsx("flex-1 min-w-[120px] rounded-xl px-3 py-2 text-[10px] md:text-xs font-bold tracking-wider transition-all cursor-pointer text-center", formData.activeObjection === obj ? "bg-[var(--card-bg)] text-[#FF66CC] border border-[#FF66CC]/60" : "bg-[var(--card-bg)]/50 text-[var(--text-muted)] border border-[var(--card-border)] hover:border-[#444444]")} onClick={(e) => { e.preventDefault(); updateForm('activeObjection', formData.activeObjection === obj ? null : obj); }}>{obj}</button>
        ));
      })()}
    </div>

    {formData.activeObjection === 'Too Low' && <div className="text-[var(--text-base)] text-sm italic border-l-2 border-[#FF66CC] pl-3 py-1">"I completely understand. It's a cash offer, which means we take all the risk and pay all fees. If you absolutely need retail pricing, we *have* to look at a creative terms offer. Which is more important right now: cashing out completely, or getting the absolute highest price?"</div>}
    {formData.activeObjection === 'Not Open to Terms' && <div className="text-[var(--text-base)] text-sm italic border-l-2 border-[#FF66CC] pl-3 py-1">"Makes perfect sense, some folks just want a clean break. If cash is the absolute only option, then our cash number is exactly where we have to be. Are we completely dead in the water at that number?"</div>}
    {formData.activeObjection === "I don't want my name on the loan" && <div className="text-[var(--text-base)] text-sm italic border-l-2 border-[#FF66CC] pl-3 py-1">"I completely understand. The reality is, the loan stays in your name, but the deed transfers to us. This means we are legally bound to pay it, and if we ever missed a payment, the property transfers back to you, plus you keep our down payment."</div>}
    {formData.activeObjection === 'What if you stop paying?' && <div className="text-[var(--text-base)] text-sm italic border-l-2 border-[#FF66CC] pl-3 py-1">"We use a 3rd party servicing company. We don't pay you directly; we pay the servicer, and they pay the bank. If we stop paying, the deed reverts directly back to you in better condition."</div>}
    {formData.activeObjection === 'Need to Think About It' && <div className="text-[var(--text-base)] text-sm italic border-l-2 border-[#FF66CC] pl-3 py-1">"Absolutely, take your time. Usually when sellers need to think about it, there's a specific concern—is it the price, the timeline, or something else holding you back?"</div>}
  </div>

  {/* INLINE OFFER UNDERWRITING - EXECUTED DURING PIVOT */}
<div className="mt-8 pt-8 border-t border-[var(--card-border)] w-full mb-8">
  <div className="flex items-center gap-3 mb-6">
    <span className="bg-[var(--card-bg)] p-2 rounded-lg border border-[var(--card-border)]">
      <Calculator size={18} className="text-[var(--brand-primary)]" />
    </span>
    <div>
      <h3 className="text-[var(--brand-primary)] font-black tracking-widest text-sm uppercase">Live Offer Underwriting</h3>
      <p className="text-[var(--text-muted)] text-xs font-bold mt-1">Determine MAO and Creative viability before dropping the anchor price.</p>
    </div>
  </div>

  {/* The container below MUST be flex-col so each calculator stretches 100% horizontally */}
  <div className="flex flex-col gap-8 w-full">
    
    {/* CALCULATOR 1: CASH OFFER */}
    <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-4 shadow-inner flex flex-col w-full">
      <h4 className="text-[var(--text-base)] font-black tracking-widest text-[11px] uppercase border-b border-[var(--card-border)] pb-2 mb-3">1. Cash Offer</h4>
      <CashCalculator 
        askingPrice={formData.askingPrice || formData.price} 
        globalArv={formData.arv || 0} 
        updateGlobalArv={(val) => updateForm('arv', val)} 
        solarAssumable={formData.solarAssumable} 
        solarMonthlyPayment={formData.solarMonthlyPayment} 
        isEviction={formData.tenantStatus?.includes('Eviction Needed')} 
      />
    </div>

    {/* CALCULATOR 2: SUBJECT-TO (DEBT) */}
    <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-4 shadow-inner flex flex-col w-full">
      <h4 className="text-[var(--text-base)] font-black tracking-widest text-[11px] uppercase border-b border-[var(--card-border)] pb-2 mb-3">2. Subject-To (Existing Debt)</h4>
      <CreativeCalculator 
        globalArv={formData.arv || 0} 
        updateGlobalArv={(val) => updateForm('arv', val)} 
        solarAssumable={formData.solarAssumable} 
        solarMonthlyPayment={formData.solarMonthlyPayment} 
      />
    </div>

    {/* CALCULATOR 3: SELLER FINANCE */}
    <div className="bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl p-4 shadow-inner flex flex-col w-full">
      <h4 className="text-[var(--text-base)] font-black tracking-widest text-[11px] uppercase border-b border-[var(--card-border)] pb-2 mb-3">3. Seller Finance (New Debt)</h4>
      <SellerFinanceCalculator />
    </div>

  </div>
</div>

  {/* Final Negotiated Price */}
  <div className={clsx("mt-4 p-5 rounded-xl border transition-all", formData.isPriceLocked ? "bg-[#051A10]/40 border-[#10b981]/40" : "bg-[var(--card-bg)] border-[var(--card-border)]")}>
    <label className={clsx("block font-bold text-[10px] md:text-xs uppercase tracking-widest mb-2", formData.isPriceLocked ? "text-[#10b981]" : "text-[var(--brand-primary)]")}>Final Negotiated Price</label>
    <div className="flex gap-4">
      <div className="relative flex-1">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-black">$</span>
        <input type="text" disabled={formData.isPriceLocked} value={formData.lockedPrice || ''} onChange={(e) => updateForm('lockedPrice', e.target.value)} className={clsx("w-full bg-[var(--bg-base)] border rounded-xl p-4 pl-8 text-lg font-black outline-none transition-all", formData.isPriceLocked ? "border-[#10b981]/50 text-[#10b981]" : "border-[var(--card-border)] text-[var(--text-base)] focus:border-[var(--brand-primary)]")} />
      </div>
      <button type="button" onClick={(e) => { e.preventDefault(); updateForm('isPriceLocked', !formData.isPriceLocked); }} className={clsx("px-6 rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg", formData.isPriceLocked ? "bg-transparent border border-[#ef4444]/50 text-[#ef4444]" : "bg-[#10b981] border border-[#10b981] text-black hover:bg-[#059669]")}>{formData.isPriceLocked ? 'Unlock' : 'Lock Price 🔒'}</button>
    </div>
  </div>

  <button 
    type="button"
    className="mt-6 w-full py-4 bg-[var(--card-bg)] hover:bg-[var(--card-border)] text-[var(--brand-primary)] border border-[var(--brand-primary)] shadow-[0_0_15px_rgba(229,193,88,0.2)] hover:shadow-[0_0_25px_rgba(229,193,88,0.4)] font-black tracking-widest text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
    onClick={() => handleProceed(6)}
  >
    Proceed to Pillar 6 →
  </button>
</div>
        ))}

        {activeSource !== 'Agent Outreach' && renderPillar(6, "The Close & Logistics", <CheckCircle2 size={20} />, (
          <div className="flex flex-col gap-6">

            <div className="flex flex-col mb-2 animate-slideIn bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl">


                "Okay perfect, it sounds like we're on the same page. What I'm going to do next is send over our standard, simple 2-page purchase agreement. You can review it, and once you sign it, I'll send it directly to our title company so they can start the process."

            </div>

            <div className="flex flex-col mb-2 animate-slideIn bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl mt-2">


                "Just so I can draft this up correctly, what is the exact legal name on the deed that we should use for the contract? And what's the best email address to send the DocuSign to?"

              
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[10px] uppercase tracking-widest mb-2">Legal Name</label>
                  <input type="text" placeholder="Legal Name(s) for Contract..." value={formData.legalName || ''} onChange={(e) => updateForm('legalName', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[10px] uppercase tracking-widest mb-2">Contact Email</label>
                  <input type="email" placeholder="Best Email Address..." value={formData.contactEmail || ''} onChange={(e) => updateForm('contactEmail', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[10px] uppercase tracking-widest mb-2">Mailing Address</label>
                  <input type="text" placeholder="Current Mailing Address (if different)..." value={formData.mailingAddress || ''} onChange={(e) => updateForm('mailingAddress', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-[var(--brand-primary)] font-extrabold text-[10px] uppercase tracking-widest mb-2">Routing Info (Wire/ACH/Check)</label>
                  <input type="text" placeholder="Routing or Disbursement Instructions..." value={formData.routingInfo || ''} onChange={(e) => updateForm('routingInfo', e.target.value)} className="w-full bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--card-border)] rounded-xl p-3 md:p-3.5 text-xs md:text-sm focus:border-[var(--brand-primary)] focus:ring-1 focus:ring-[var(--brand-primary)]/50 transition-all outline-none placeholder-[#444444]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col mb-2 animate-slideIn bg-[var(--card-bg)] border border-[var(--card-border)] border-l-4 border-l-[var(--brand-primary)] p-4 rounded-r-xl mb-5 text-[var(--text-base)] font-medium italic text-sm md:text-base leading-relaxed shadow-2xl mt-2">


                "Awesome. I'm typing that up right now and it should hit your inbox in about 5 minutes. I'll shoot you a quick text when I send it. Can you keep an eye out for it and let me know if you have any questions once you look it over?"

            </div>
            
            <div className="mt-8 mb-8">
              <button 
                onClick={() => {
                  generateSummary();
                  if (onReturn) onReturn({ 
                    type: 'contract_sent', 
                    assignmentFee: masterLead?.financialEngine?.assignmentFee || 30000, 
                    details: formData 
                  });
                }} 
                className="w-full py-3.5 my-4 bg-gradient-to-r from-[#CD7F32] via-[var(--brand-primary)] to-[var(--brand-primary)] text-[#000000] font-extrabold text-center rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(229,193,88,0.5)] hover:opacity-95 transition-all cursor-pointer uppercase tracking-wider flex justify-center items-center gap-4 group"
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
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--)', fontSize: '0.9rem', color: 'var(--text-soft)', marginBottom: '1.5rem' }}>
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
                            onClick={() => setActiveGlobalDrawer('tearsheet')}
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

      {/* RIGHT COLUMN MOVED TO TOP HORIZONTAL HUD */}
      </div>
    </>
  );
}