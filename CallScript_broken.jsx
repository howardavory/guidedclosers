'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import useStore from '@/store/useStore';
import { Ban, ShieldAlert, CheckCircle2, Home, Wrench, Clock, DollarSign, PenTool, Mic, MapPin, Database, ChevronDown, ChevronRight, Calculator, AlertTriangle, HeartHandshake, BrainCircuit, ClipboardCheck, FileText } from 'lucide-react';
import clsx from 'clsx';
import CashCalculator from '../calculators/CashCalculator';
import CreativeCalculator from '../calculators/CreativeCalculator';
import RepairsCalculator from '../calculators/RepairsCalculator';
import RehabCalculator from './RehabCalculator';
import TearSheet from './TearSheet';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

export default function CallScript({ activeLead, onReturn }) {
  const lead = activeLead;
  const { updateTriageCondition, updatePropertyDetails, updateDisposition } = useStore();
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const autocompleteRef = useRef(null);

  const [activePillar, setActivePillar] = useState(1);
  const currentStep = activePillar;
  const handleProceed = (step) => setActivePillar(step);

  useEffect(() => {
    if (activePillar) {
      setTimeout(() => {
        const element = document.getElementById(`pillar-${activePillar}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 350); // wait for collapse/expand transitions
    }
  }, [activePillar]);
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
    rentArrears: '',
    rentMethod: '',
    tenantStatus: [],
    leaseType: '',
    vacantLength: '',
    vacantIssues: [],
    decisionMakers: null,
    trustProbate: false,
    executor: '',
    trustHeadcount: '',
    probateStarted: false,
    // Timeline
    timeline: '',
    timelineType: '',
    timelineDetails: '',
    targetCloseDate: '',
    postCloseDays: '',
    relocationPlans: '',
    painPoints: [],
    // Property Special
    landZoning: '',
    landUtilities: [],
    landPaved: '',
    hoaName: '',
    hoaFee: '',
    hoaRestrictions: '',
    mhParkName: '',
    mhParkFee: '',
    mh55Plus: '',
    mh433A: '',
    mfUnitCount: '',
    mfUnitsData: [], mfUtilityMetering: '', mfOwnerUtilities: [], mfUtilityCost: '', mfBuildingConfig: '', mfInteriorCondition: '',
    vacantReason: '',
    // Condition
    roof: [],
    hvac: [],
    plumbing: [],
    electrical: [],
    cosmetics: [],
    cosmeticsKitchen: [],
    cosmeticsBaths: [],
    fireDamage: false,
    fireFullDemo: false,
    fireMeterPulled: false,
    fireRedTagged: false,
    fireNotes: '',
    highRisk: [],
    // Financials
    freeAndClear: false,
    mortgageBalance: '',
    secondPosition: '',
    thirdPosition: '',
    fourthPosition: '',
    arrears: '',
    arrearsAmount: '',
    summaryNotes: '',
    notes: '',
    pitchType: '',
    // Objections & Close
    thinkAboutItReason: '',
    thinkAboutItOther: '',
    lockedPrice: '',
    isPriceLocked: false,
    legalName: '',
    email: '',
    mailingAddress: ''
  });

  const activeSource = formData.activeSource;
  const [showDisqualifyMenu, setShowDisqualifyMenu] = useState(false);
  const [recentMessages, setRecentMessages] = useState([]);
  const [activeObjection, setActiveObjection] = useState(null);
  
  const [showTearSheet, setShowTearSheet] = useState(false);
  const [showSummaryReview, setShowSummaryReview] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleSingleSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: prev[field] === value ? null : value }));
  };

  const syncToCRM = async () => {
    setIsSyncing(true);
    setSyncStatus('Syncing to CRM...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('Simulated Success: Synced to CRM!');
    }, 1500);
  };

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
            onClick={() => setShowDisqualifyMenu(!showDisqualifyMenu)}
            className="w-full bg-[#FF1111] border-4 border-black rounded-none py-4 px-6 text-white font-black italic uppercase flex justify-center items-center gap-2"
            style={{ 
              boxShadow: '6px 6px 0px 0px rgba(0,0,0,1)', 
              cursor: 'pointer', 
              outline: 'none',
              transform: 'translate(0px, 0px)',
              transition: 'all 0.1s ease'
            }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translate(6px, 6px)'; e.currentTarget.style.boxShadow = '0px 0px 0px 0px rgba(0,0,0,1)'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translate(0px, 0px)'; e.currentTarget.style.boxShadow = '6px 6px 0px 0px rgba(0,0,0,1)'; }}
          >
            <Ban size={24} color="#FFFFFF" strokeWidth={3} />
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