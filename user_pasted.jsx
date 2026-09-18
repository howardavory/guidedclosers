import React, { useState, useEffect, useRef } from 'react';
import './CallScript.css';
import RehabCalculator from './RehabCalculator';
import CreativeCalculator from './CreativeCalculator';
import TearSheet from './TearSheet';
import { Mic, BrainCircuit, HeartHandshake, ShieldAlert, Crosshair, ChevronRight, CheckCircle2, ClipboardCheck, FileText } from 'lucide-react';
import { addNoteToContact } from '../services/ghlService';

export default function CallScript({ lead, onReturn }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTearSheet, setShowTearSheet] = useState(false);
  const scrollRef = useRef(null);
  const addressInputRef = useRef(null);

  useEffect(() => {
    if (lead?.isManual && window.google && window.google.maps && window.google.maps.places && addressInputRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'us' },
      });

      const listener = autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.formatted_address) {
          setFormData(prev => ({ ...prev, manualAddress: place.formatted_address }));
        }
      });
      
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }
  }, [lead?.isManual]);

  const [dataCompleteness, setDataCompleteness] = useState({

    hasOccupancy: false,
    hasCondition: false,
    hasTimeline: false,
    hasMotivation: false
  });

  const contactId = lead?.contactId;

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [showDisqualifyMenu, setShowDisqualifyMenu] = useState(false);
  const [arv, setArv] = useState('');

  const [formData, setFormData] = useState({
    manualSource: 'In-House',
    manualEntityType: 'Individual',
    introResponse: null,
    askingPrice: '',
    refusedPrice: false,
    noPushback: false,
    isHostile: false,
    isVoicemail: false,
    occupancy: null,
    decisionMakers: null,
    beds: '',
    baths: '',
    sqft: '',
    lotSize: '',
    propertyType: null,
    roof: [],
    hvac: [],
    plumbing: [],
    electrical: [],
    cosmeticsKitchen: [],
    cosmeticsBaths: [],
    highRisk: [],
    fireMeterPulled: null,
    fireRedTagged: null,
    fireFullDemo: null,
    fireNotes: '',
    rentAmount: '',
    rentArrears: '',
    rentMethod: '',
    tenantStatus: [],
    leaseType: null,
    vacantLength: '',
    vacantIssues: [],
    trustProbate: false,
    trustHeadcount: 1,
    executor: '',
    probateStarted: null,
    timelineDetails: '',
    painPoints: [],
    lockedPrice: '',
    isPriceLocked: false,
    freeAndClear: false,
    mortgageBalance: '',
    secondPosition: '',
    thirdPosition: '',
    fourthPosition: '',
    arrearsAmount: '',
    pitchType: 'cash',
    notes: '',
    mfUnits: '',
    mfConfig: '',
    hoaName: '',
    hoaFee: '',
    hoaRestrictions: '',
    mhParkName: '',
    mhParkFee: '',
    mh55Plus: null,
    mh433A: null,
    landZoning: '',
    landUtilities: [],
    landPaved: null,
    nepqResponse: null,
    nepqFollowUp: null,
    stoppedEarly: false,
    stopReason: '',
    abandonmentPillar: null,
    financials: { estimatedRepairs: 15000 },
    creativeTerms: {
      existingDebt: 0,
      underlyingInterest: 0,
      sellerCashRequired: 0,
      estimatedPiti: 0,
      totalEntryFee: 0
    }
  });

  const updateForm = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Load from local storage
  useEffect(() => {
    if (!contactId && !lead?.isManual) return;
    const cacheKey = `call_script_${contactId || formData.manualName}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.currentStep) setCurrentStep(parsed.currentStep);
        if (parsed.dataCompleteness) setDataCompleteness(parsed.dataCompleteness);
        if (parsed.arv) setArv(parsed.arv);
      } catch (e) {
        console.error("Failed to parse cached script state");
      }
    }
  }, [contactId, lead?.isManual]);

  // Save to local storage
  useEffect(() => {
    if (!contactId && !lead?.isManual) return;
    const cacheKey = `call_script_${contactId || formData.manualName}`;
    const timeoutId = setTimeout(() => {
      localStorage.setItem(cacheKey, JSON.stringify({
        formData,
        currentStep,
        dataCompleteness,
        arv
      }));
    }, 500); // debounce save
    return () => clearTimeout(timeoutId);
  }, [formData, currentStep, dataCompleteness, arv, contactId, lead?.isManual]);

  const leadName = (lead?.isManual ? formData.manualName : lead?.name) || "[Seller Name]";
  const propertyAddress = (lead?.isManual ? formData.manualAddress : lead?.address) || "[Property Address]";
  const activeSource = lead?.isManual ? formData.manualSource : lead?.source;
  const activeEntityType = lead?.isManual ? formData.manualEntityType : lead?.entityType;

  const [activeObjection, setActiveObjection] = useState(null);

  const handleToggle = (field, value) => {
    if (['roof', 'hvac', 'plumbing', 'electrical', 'cosmeticsKitchen', 'cosmeticsBaths', 'highRisk'].includes(field)) {
      setDataCompleteness(prev => ({ ...prev, hasCondition: true }));
    }
    if (field === 'painPoints') {
      setDataCompleteness(prev => ({ ...prev, hasMotivation: true }));
    }
    setFormData(prev => {
      const arr = prev[field] || [];
      if (arr.includes(value)) {

        return { ...prev, [field]: arr.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSingleSelect = (field, value) => {
    if (field === 'occupancy') setDataCompleteness(prev => ({ ...prev, hasOccupancy: true }));
    setFormData(prev => ({
      ...prev,
      [field]: prev[field] === value ? null : value
    }));
  };

  const [showSummaryReview, setShowSummaryReview] = useState(false);

  const generateSummary = () => {
    let summary = `--- LEAD SUMMARY ---\n`;
    summary += `Beds/Baths/Sqft: ${formData.beds || '?'} bed / ${formData.baths || '?'} bath / ${formData.sqft || '?'} sqft\n`;
    summary += `Occupancy: ${formData.occupancy || 'Unknown'}\n`;
    summary += `Asking Price: ${formData.refusedPrice ? 'REFUSED TO DISCLOSE' : (formData.askingPrice ? '$'+formData.askingPrice : 'None given')}\n`;
    
    if (formData.occupancy === 'Tenant') {
        summary += `Lease Type: ${formData.leaseType || 'Unknown'} | Status: ${formData.tenantStatus.join(', ')}\n`;
        summary += `Rent: $${formData.rentAmount} (${formData.rentMethod}) | Arrears: $${formData.rentArrears}\n`;
    } else if (formData.occupancy === 'Vacant') {
        summary += `Vacant For: ${formData.vacantLength || '?'} | Issues: ${formData.vacantIssues.join(', ')}\n`;
    }
    
    summary += `\n-- CONDITION --\n`;
    summary += `Roof: ${formData.roof.length ? formData.roof.join(', ') : '?'}\n`;
    summary += `HVAC: ${formData.hvac.length ? formData.hvac.join(', ') : '?'}\n`;
    summary += `Plumbing: ${formData.plumbing.length ? formData.plumbing.join(', ') : '?'}\n`;
    summary += `Electrical: ${formData.electrical.length ? formData.electrical.join(', ') : '?'}\n`;
    summary += `Cosmetics: Kitchen (${formData.cosmeticsKitchen.join(', ')}), Baths (${formData.cosmeticsBaths.join(', ')})\n`;
    
    summary += `\n-- PROPERTY SPECIFICS --\n`;
    if (formData.propertyType === 'Multi-Family') {
        summary += `Multi-Family: ${formData.mfUnits} units | Config: ${formData.mfConfig}\n`;
    } else if (formData.propertyType === 'Condo/Townhome') {
        summary += `HOA: ${formData.hoaName} ($${formData.hoaFee}/mo) | Restrictions: ${formData.hoaRestrictions}\n`;
    } else if (formData.propertyType === 'Mobile Home') {
        summary += `Park: ${formData.mhParkName} ($${formData.mhParkFee}/mo) | 55+: ${formData.mh55Plus ? 'Yes' : 'No'} | 433A (Perm Found): ${formData.mh433A ? 'Yes' : 'No'}\n`;
    } else if (formData.propertyType === 'Land') {
        summary += `Zoning: ${formData.landZoning} | Utilities: ${formData.landUtilities.join(', ')} | Paved: ${formData.landPaved ? 'Yes' : 'No'}\n`;
    }

    summary += `\n-- SITUATION --\n`;
    summary += `Tags: ${formData.painPoints.join(', ')}\n`;
    if (formData.trustProbate) {
        summary += `Trust/Probate: Executor = ${formData.executor || '?'}, Heirs = ${formData.trustHeadcount}, Probate Started = ${formData.probateStarted === true ? 'Yes' : (formData.probateStarted === false ? 'No' : '?')}\n`;
    }
    if (formData.timelineDetails) summary += `Timeline Notes: ${formData.timelineDetails}\n`;
    if (formData.nepqResponse) summary += `NEPQ Backup Plan: ${formData.nepqResponse}\n`;
    if (formData.stoppedEarly) summary += `\n[!] CALL STOPPED EARLY: ${formData.stopReason}\n`;
    
    if (formData.highRisk.includes('Fire/Water Damage')) {
        summary += `\n-- FIRE DAMAGE DETAILS --\n`;
        summary += `Meter Pulled: ${formData.fireMeterPulled === true ? 'Yes' : (formData.fireMeterPulled === false ? 'No' : '?')}\n`;
        summary += `Red-Tagged: ${formData.fireRedTagged === true ? 'Yes' : (formData.fireRedTagged === false ? 'No' : '?')}\n`;
        summary += `Full Demo: ${formData.fireFullDemo === true ? 'Yes' : (formData.fireFullDemo === false ? 'No' : '?')}\n`;
        if (formData.fireNotes) summary += `Fire Notes: ${formData.fireNotes}\n`;
    }
    
    summary += `\n-- FINANCIALS --\n`;
    summary += `Free & Clear: ${formData.freeAndClear ? 'Yes' : 'No'}\n`;
    if (!formData.freeAndClear && formData.mortgageBalance) {
        summary += `Mortgage 1: $${formData.mortgageBalance}\n`;
    }
    
    // AI NEXT STEPS STRATEGY
    summary += `\n\n--- AI NEXT STEPS STRATEGY ---\n`;
    
    // Check constraints
    const m1 = Number((formData.mortgageBalance || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
    const m2 = Number((formData.secondPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
    const m3 = Number((formData.thirdPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
    const m4 = Number((formData.fourthPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
    const arr = Number((formData.arrearsAmount || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
    const totalDebt = formData.freeAndClear ? 0 : (m1 + m2 + m3 + m4 + arr);
    const askingPrice = Number((formData.askingPrice || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
    
    const isUnderwater = totalDebt > 0 || askingPrice > 0; // Simplified for note generation
    
    if (formData.pitchType === 'creative' || isUnderwater) {
      summary += `▶ **STRATEGY:** High probability of Creative Finance. The seller has high debt or high asking price constraints. Next step is to structure a Subject-To or Seller Finance offer. Send the creative proposal and verify the exact mortgage terms (PITI, interest rate).\n`;
    } else {
      summary += `▶ **STRATEGY:** Cash offer is viable. Focus on closing the cash transaction.\n`;
    }

    if (formData.occupancy === 'Vacant') {
      summary += `▶ **URGENCY:** Property is vacant. Push for a fast close to alleviate their holding costs.\n`;
    }
    if (formData.trustProbate) {
      summary += `▶ **LOGISTICS:** Probate/Trust deal. Verify who the executor is and request contact info for the probate attorney to confirm timeline.\n`;
    }
    if (formData.painPoints.includes('Financial Hardship') || formData.painPoints.includes('Pre-Foreclosure')) {
      summary += `▶ **SITUATION:** Pre-Foreclosure / Hardship. Time is of the essence. Fast-track title search and get authorization to speak to their lender immediately.\n`;
    }

    if (activeSource === 'Agent Outreach') {
      summary = `--- AGENT OUTREACH SUMMARY ---\n`;
      summary += `Agent Has Deal: ${formData.introResponse === 'HasDeal' ? 'Yes' : 'No'}\n`;
      if (formData.introResponse === 'HasDeal') {
        summary += `\n-- POCKET LISTING DETAILS --\n`;
        summary += `Address: ${formData.agentDealAddress || 'None provided'}\n`;
        summary += `Specs: ${formData.agentDealBeds || '?'} bed / ${formData.agentDealBaths || '?'} bath / ${formData.agentDealSqft || '?'} sqft\n`;
        summary += `Asking Price / Target: ${formData.agentDealPrice || 'None provided'}\n`;
        summary += `Condition: ${formData.agentDealCondition || 'None provided'}\n`;
      }
      if (formData.agentNotes) {
        summary += `\n-- GENERAL NOTES --\n`;
        summary += `${formData.agentNotes}\n`;
      }
      
      setFormData(prev => ({ ...prev, notes: summary }));
      return; // Skip the rest of the seller summary generation for agents!
    }

    setFormData(prev => ({ ...prev, notes: summary }));
    setShowSummaryReview(true);
  };

  const syncToCRM = async () => {
    if (lead?.isManual) {
      setIsSyncing(true);
      setSyncStatus('Saving Manual Lead PDF locally...');
      try {
        const res = await fetch('/api/save-local-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lead: {
              ...lead,
              name: formData.manualName || lead.name,
              phone: formData.manualPhone || lead.phone,
              email: formData.manualEmail || lead.email,
              address: formData.manualAddress || lead.address,
              city: formData.manualCity || lead.city,
              state: formData.manualState || lead.state,
              postalCode: formData.manualPostalCode || lead.postalCode,
            },
            formData: formData,
            summary: formData.notes
          })
        });
        const data = await res.json();
        setIsSyncing(false);
        if (data.success) {
          setSyncStatus('Successfully saved PDF to Downloads/BoldStreet lead notes!');
        } else {
          setSyncStatus('Failed to save local PDF: ' + data.error);
        }
      } catch (err) {
        setIsSyncing(false);
        setSyncStatus('Network error while saving local PDF.');
      }
      return;
    }

    if (contactId) {
      setIsSyncing(true);
      setSyncStatus('Syncing to CRM...');
      
      const customFields = {
        Zestimate: arv ? arv.toString() : '',
        Bedrooms: formData.beds,
        Bathrooms: formData.baths,
        SquareFeet: formData.sqft,
        LotSize: formData.lotSize,
        PropertyType: formData.propertyType,
        ReasonForSelling: formData.painPoints.join(', '),
        OccupancyStatus: formData.occupancy,
        MortgageOnProperty: formData.freeAndClear ? 'No' : 'Yes',
        MortgageAmount: formData.mortgageBalance
      };

      const success = await addNoteToContact(contactId, formData.notes, customFields);
      setIsSyncing(false);
      if (success) {
        setSyncStatus('Successfully synced Notes and Custom Fields to CRM!');
      } else {
        setSyncStatus('Failed to sync to CRM.');
      }
    } else {
      setSyncStatus('No Contact ID available. Sandbox Mode: Simulated success!');
    }
  };

  const handleProceed = (step) => {
    setCurrentStep(step);
    setTimeout(() => {
      document.getElementById(`pillar-${step}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Auto-proceed to Pillar 5 after they select an NEPQ consequence
  useEffect(() => {
    if (formData.nepqFollowUp && currentStep === 4) {
      const timer = setTimeout(() => {
        handleProceed(5);
      }, 3500); // Wait 3.5 seconds to let them read the transition before scrolling
      return () => clearTimeout(timer);
    }
  }, [formData.nepqFollowUp, currentStep]);

  // Pre-calculated logic
  const isOwner = formData.occupancy === 'Owner';
  const isTenant = formData.occupancy === 'Tenant';
  const isVacant = formData.occupancy === 'Vacant';
  const isTrust = formData.trustProbate === true;
  const isFreeAndClear = formData.freeAndClear === true;
  const wantsCreative = formData.pitchType === 'creative';
  
  const showedRoofHVACReaction = (formData.roof || []).includes('Active Leaks/Damage') || (formData.roof || []).includes('Tarped/Failed') || (formData.hvac || []).includes('Window Units/None');
  const showedPlumbingReaction = (formData.electrical || []).includes('Knob & Tube') || (formData.plumbing || []).includes('Original/Galvanized') || (formData.plumbing || []).includes('Known Leaks');

  const m1 = Number((formData.mortgageBalance || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const m2 = Number((formData.secondPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;

  const m3 = Number((formData.thirdPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const m4 = Number((formData.fourthPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const arr = Number((formData.arrearsAmount || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const totalDebt = isFreeAndClear ? 0 : (m1 + m2 + m3 + m4 + arr);

  return (
    <>
      {/* FLOATING PILL HUD */}
      <div style={{ position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', gap: '10px' }}>
        <div style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', letterSpacing: '1px', background: dataCompleteness.hasOccupancy ? 'var(--accent-success)' : 'var(--bg-card-soft)', border: dataCompleteness.hasOccupancy ? '1px solid var(--accent-success)' : '1px solid var(--accent-alert)', color: dataCompleteness.hasOccupancy ? '#000' : 'var(--accent-alert)', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'all 0.3s' }}>OCCUPANCY</div>
        <div style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', letterSpacing: '1px', background: dataCompleteness.hasCondition ? 'var(--accent-success)' : 'var(--bg-card-soft)', border: dataCompleteness.hasCondition ? '1px solid var(--accent-success)' : '1px solid var(--accent-alert)', color: dataCompleteness.hasCondition ? '#000' : 'var(--accent-alert)', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'all 0.3s' }}>CONDITION</div>
        <div style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', letterSpacing: '1px', background: dataCompleteness.hasTimeline ? 'var(--accent-success)' : 'var(--bg-card-soft)', border: dataCompleteness.hasTimeline ? '1px solid var(--accent-success)' : '1px solid var(--accent-alert)', color: dataCompleteness.hasTimeline ? '#000' : 'var(--accent-alert)', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'all 0.3s' }}>TIMELINE</div>
        <div style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '0.65rem', letterSpacing: '1px', background: dataCompleteness.hasMotivation ? 'var(--accent-success)' : 'var(--bg-card-soft)', border: dataCompleteness.hasMotivation ? '1px solid var(--accent-success)' : '1px solid var(--accent-alert)', color: dataCompleteness.hasMotivation ? '#000' : 'var(--accent-alert)', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'all 0.3s' }}>MOTIVATION</div>
      </div>

      <div className="script-layout" style={{ paddingTop: '50px', paddingBottom: '90px' }}>
        {/* LEFT SIDEBAR: FAST FACTS */}
        <div className="left-sidebar" style={{ position: 'sticky', top: '60px', maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-soft)', textTransform: 'uppercase', display: 'block' }}>Zestimate</label>
            <input type="text" className="data-input" value={arv || ''} onChange={(e) => setArv(e.target.value)} placeholder="$450,000" style={{ width: '100%', fontSize: '1rem', fontWeight: 'bold', padding: '6px' }} />
          </div>

          <div style={{ background: 'var(--bg-card-soft)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '8px', fontSize: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '4px' }}>LIVE DATA</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-soft)', textTransform: 'uppercase' }}>Phone Source</label>
                <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{lead?.phone || 'Unknown'} <span style={{ color: '#10b981', fontSize: '0.6rem' }}>✓</span></div>
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-soft)', textTransform: 'uppercase' }}>Ownership Profile</label>
                <select 
                  className="data-input" 
                  value={activeEntityType}
                  onChange={(e) => setFormData({...formData, manualEntityType: e.target.value})}
                  style={{ width: '100%', padding: '6px', fontSize: '0.75rem' }}
                >
                  <option value="INDIVIDUAL">👤 Individual Owner</option>
                  <option value="TRUST">🏛️ Trust</option>
                  <option value="LLC">🏢 Business Entity (LLC)</option>
                </select>
              </div>
            </div>
          </div>

          {/* RECENT MESSAGES */}
          <div style={{ background: 'var(--bg-card-soft)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginTop: '10px' }}>
            <details>
              <summary style={{ color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', outline: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>RECENT MESSAGES ({lead?.conversationHistory?.length || 0})</span>
              </summary>
              <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                {lead?.conversationHistory?.length > 0 ? lead.conversationHistory.map((msg, i) => (
                  <div key={i} style={{ background: msg.direction === 'inbound' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(139, 92, 246, 0.1)', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', borderLeft: msg.direction === 'inbound' ? '3px solid #10b981' : '3px solid var(--accent-primary)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-soft)', marginBottom: '4px', textTransform: 'uppercase' }}>{msg.direction === 'inbound' ? 'Lead' : 'Agent'} - {new Date(msg.dateAdded).toLocaleDateString()}</div>
                    <div style={{ color: 'var(--text-dark)' }}>{msg.body || (msg.activity && msg.activity.title) || 'Attachment / Call'}</div>
                  </div>
                )) : (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-soft)', fontStyle: 'italic' }}>No recent messages found.</div>
                )}
              </div>
            </details>
          </div>
        </div>

      {/* MIDDLE COLUMN: THE SCRIPT STREAM */}
      <div className="script-stream" ref={scrollRef} style={{ height: 'calc(100vh - 120px)', overflowY: 'auto', paddingRight: '20px', paddingBottom: '300px' }}>
        
        {/* MANUAL LEAD ENTRY FORM */}
        {lead?.isManual && (
          <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px dashed var(--accent-primary)', padding: '20px', borderRadius: '12px', marginBottom: '2rem' }}>
            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '15px' }}>⚠️ MANUAL SUBMISSION DETAILS</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '5px', display: 'block' }}>Lead Name</label>
                <input type="text" className="data-input" value={formData.manualName || ''} onChange={(e) => setFormData({...formData, manualName: e.target.value})} placeholder="e.g. John Doe" style={{ width: '100%', padding: '10px' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '5px', display: 'block' }}>Property Address</label>
                <input type="text" ref={addressInputRef} className="data-input" value={formData.manualAddress || ''} onChange={(e) => setFormData({...formData, manualAddress: e.target.value})} placeholder="e.g. 123 Main St" style={{ width: '100%', padding: '10px' }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '5px', display: 'block' }}>Lead Source</label>
                <select className="data-input" value={formData.manualSource || 'In-House'} onChange={(e) => setFormData({...formData, manualSource: e.target.value})} style={{ width: '100%', padding: '10px' }}>
                  <option value="In-House">In-House</option>
                  <option value="Bold Street">Bold Street</option>
                  <option value="Self Gen">Self Gen</option>
                  <option value="Agent Outreach">Agent Outreach</option>
                  <option value="PPC">PPC / Web</option>
                  <option value="Referral">Referral</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-soft)', marginBottom: '5px', display: 'block' }}>Ownership Profile</label>
                <select className="data-input" value={formData.manualEntityType || 'INDIVIDUAL'} onChange={(e) => setFormData({...formData, manualEntityType: e.target.value})} style={{ width: '100%', padding: '10px' }}>
                  <option value="INDIVIDUAL">👤 Individual Owner</option>
                  <option value="TRUST">🏛️ Trust</option>
                  <option value="LLC">🏢 Business Entity (LLC)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* PILLAR 1: INTRODUCTION & PERMISSION */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
            <Mic size={20} />
            <h3 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>Pillar 1: The Opener</h3>
          </div>

          {/* Voicemail Toggle */}
          <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
            <button 
              className={`toggle-pill ${formData.isVoicemail ? 'active' : ''}`} 
              style={{ 
                background: formData.isVoicemail ? 'var(--accent-primary)' : 'rgba(139, 92, 246, 0.1)', 
                color: formData.isVoicemail ? '#fff' : 'var(--accent-primary)', 
                border: '1px solid rgba(139, 92, 246, 0.3)',
                boxShadow: formData.isVoicemail ? '0 0 15px rgba(139, 92, 246, 0.5)' : 'none',
                fontWeight: 'bold'
              }} 
              onClick={() => setFormData({...formData, isVoicemail: !formData.isVoicemail})}
            >
              <Mic size={16} style={{ marginRight: '6px' }} /> Voicemail Script
            </button>
          </div>

          {(() => {
            const firstName = leadName.split(' ')[0];
            
            let voicemailOpener = `"Hey ${activeEntityType === 'TRUST' || activeEntityType === 'LLC' ? 'there' : firstName}, my name is Avory. I'm a local investor and I was calling about the property over on ${propertyAddress}. We are actually looking to buy another property in the neighborhood right now and I just wanted to see if you were thinking about selling it. I actually had a quick question about the property that I was hoping you could help me out with. Give me a call back when you get a second. My number is [Your Number]... again that's [Your Number]. Talk to you soon."`;
            
            let directOpener = `"Hey ${firstName}. This is Avory, local investor here in Bakersfield just trying to reach the owner of ${propertyAddress}. Is this the right number for them?"`;
            
            if (activeSource === 'Agent Outreach') {
              directOpener = `"Hey ${firstName}, my name is Avory with Central Valley REI. I'm an investor buying properties cash in your area. I know you're busy, so I'll keep it brief. Do you happen to have any off-market inventory or pocket listings?"`;
              voicemailOpener = `"Hey ${firstName}, this is Avory. I'm with a local investment company here in Bakersfield and we're looking for our next project. We buy cash and close quick. If you've got any hard-to-move inventory, pocket listings, or distress deals that could use an offer, give me a call back. Talk soon."`;
            } else if (activeEntityType === 'TRUST') {
              directOpener = `"Hey, am I speaking with the trustee for the ${leadName}? My name is Avory, a local investor. I was calling about the property over on ${propertyAddress}... have the trustees ever considered selling it?"`;
            } else if (activeEntityType === 'LLC') {
              directOpener = `"Hey, am I speaking with the owner of ${leadName}? My name is Avory, a local investor. I was calling about the property over on ${propertyAddress}... have you or your partners ever considered selling it?"`;
            }

            return (
              <>
                {formData.isVoicemail && (
                  <div className="bubble-row agent" style={{ animation: 'slideInUp 0.3s ease forwards', marginBottom: '1.5rem' }}>
                    <div className="bubble-label" style={{ color: 'var(--accent-primary)' }}>Agent (Voicemail Drop)</div>
                    <div className="bubble" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
                      {voicemailOpener}
                    </div>
                  </div>
                )}
                
                <div className="bubble-row agent">
                  <div className="bubble-label">Agent (Direct Opener)</div>
                  <div className="bubble">
                    {directOpener}
                  </div>
                </div>
              </>
            );
          })()}

          {/* Hostile Toggle */}
          <div style={{ marginTop: '1rem', marginBottom: '1rem', display: 'flex' }}>
            <button 
              className={`toggle-pill ${formData.isHostile ? 'active' : ''}`} 
              style={{ 
                background: formData.isHostile ? 'var(--accent-secondary)' : 'rgba(244, 63, 94, 0.1)', 
                color: formData.isHostile ? '#fff' : 'var(--accent-secondary)', 
                border: '1px solid rgba(244, 63, 94, 0.3)',
                boxShadow: formData.isHostile ? '0 0 15px rgba(244, 63, 94, 0.5)' : 'none',
                fontWeight: 'bold'
              }} 
              onClick={() => setFormData({...formData, isHostile: !formData.isHostile})}
            >
              <ShieldAlert size={16} style={{ marginRight: '6px' }} /> Hostile / Angry Response
            </button>
          </div>

          {formData.isHostile && (
            <div className="bubble-row agent" style={{ animation: 'slideInUp 0.3s ease forwards', marginBottom: '1.5rem' }}>
              <div className="bubble-label" style={{ color: 'var(--accent-secondary)' }}>Agent (Hostile Rebuttal)</div>
              <div className="bubble" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
                "Whoa, okay, I completely understand... I'm just a local investor, I can take you off our list right now if you want, no worries at all."
              </div>
            </div>
          )}
          
          {/* GLOBAL SITUATIONAL PIVOT MODULE */}
          {formData.painPoints.length > 0 && (
            <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)', animation: 'slideInUp 0.3s ease' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#ef4444', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} /> Active Situational Pivots
              </h4>
              
              {formData.painPoints.includes('Pre-Foreclosure') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Pre-Foreclosure)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "Got it, so it sounds like timing is pretty critical here. Have they given you a hard auction date yet, or are we just trying to get ahead of the notices?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Tired Landlord') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Tired Landlord)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "I don't blame you, dealing with tenants can be a massive headache. Are they currently on a lease, or are you having to go through the eviction process right now?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Squatters') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Squatters)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "Oh wow, I'm sorry you're dealing with that. Have you already started the formal eviction process, or are you hoping we just buy it as-is and take over the headache for you?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Tax Delinquent') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Tax Delinquent)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "Gotcha. With the back taxes, has the county given you a deadline before it goes to a tax deed sale, or do we still have a little breathing room?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Code Violations') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Code Violations)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "Understood. With the city involved, are they actively hitting you with daily fines right now?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Inherited') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Inherited / Probate)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "I'm sorry for your loss. Just so I know how our title team needs to handle it, has the property fully passed through probate, or are you still working with an attorney?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Relocating') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Relocating / Downsizing)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "Since you're moving, are you going to need a post-possession agreement to stay in the house for a few weeks after we close so you have time to pack?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Divorce') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Divorce)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "I understand. Just to make sure we don't hit any snags with title, are you both on the same page about selling, or is that still being worked out?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Out of State') && (
                <div className="bubble-row agent" style={{ marginBottom: '1rem' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Out of State Owner)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "Since you're out of state, we can just send a mobile notary to your house for closing. Out of curiosity, when was the last time you actually laid eyes on the inside of the property?"
                  </div>
                </div>
              )}
              {formData.painPoints.includes('Liquidating') && (
                <div className="bubble-row agent" style={{ marginBottom: '0' }}>
                  <div className="bubble-label" style={{ color: '#ef4444' }}>Agent (Cashing Out Asset)</div>
                  <div className="bubble" style={{ borderLeftColor: '#ef4444' }}>
                    "Since you're just looking to liquidate, are you doing a 1031 exchange into another asset, or just taking the cash?"
                  </div>
                </div>
              )}
            </div>
          )}

          {/* B2B AGENT OUTREACH SCRIPT */}
          {activeSource === 'Agent Outreach' && (
            <div style={{ marginTop: '2rem', animation: 'fadeIn 0.4s ease' }}>
              <h3 style={{ color: '#a855f7', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>B2B Outreach Flow</h3>
              
              <div className="bubble-row agent" style={{ marginBottom: '1.5rem' }}>
                <div className="bubble-label" style={{ color: '#a855f7' }}>Agent (The Ask - Stale Listings & Referrals)</div>
                <div className="bubble" style={{ borderLeftColor: '#a855f7' }}>
                  "Just wanted to check in and see if you have any pocket listings right now, or maybe a listing that's just sitting because it needs way too much work for a regular retail buyer?"
                </div>
              </div>

              <div className="bubble-row agent" style={{ marginBottom: '1.5rem' }}>
                <div className="bubble-label" style={{ color: '#a855f7' }}>Agent (The Referral Guarantee)</div>
                <div className="bubble" style={{ borderLeftColor: '#a855f7' }}>
                  "They buy cash, but more importantly, I always make sure you get your referral fee so you aren't leaving any money on the table. Got anything on your radar that might make sense for a quick cash exit?"
                </div>
              </div>

              <div className="objections-section" style={{ marginTop: '1.5rem', background: 'rgba(168, 85, 247, 0.05)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                 <div className="bubble-label" style={{ marginBottom: '10px', color: '#a855f7' }}>Agent Pushbacks (Click for rebuttal)</div>
                 <div className="toggles-row">
                   <button className={`toggle-pill ${formData.introResponse === 'HasDeal' ? 'active' : ''}`} onClick={() => handleSingleSelect('introResponse', 'HasDeal')} style={formData.introResponse === 'HasDeal' ? {background:'#a855f7', color:'white', borderColor:'#a855f7'} : {}}>
                     "Yes, I have a deal"
                   </button>
                   <button className={`toggle-pill ${formData.introResponse === 'NoDeal' ? 'active' : ''}`} onClick={() => handleSingleSelect('introResponse', 'NoDeal')} style={formData.introResponse === 'NoDeal' ? {background:'#a855f7', color:'white', borderColor:'#a855f7'} : {}}>
                     "I don't have anything right now"
                   </button>
                 </div>

                 {formData.introResponse === 'HasDeal' && (
                   <div className="bubble-row agent" style={{ marginTop: '1rem', animation: 'slideInUp 0.3s ease forwards' }}>
                     <div className="bubble-label" style={{ color: '#a855f7' }}>Rebuttal (Has Deal)</div>
                     <div className="bubble" style={{ borderLeftColor: '#a855f7' }}>
                       "Awesome! What kind of property is it, and what are the details?"
                       
                       <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                         <div style={{ padding: '15px', background: 'var(--bg-card-soft)', borderRadius: '12px', borderLeft: '4px solid #a855f7' }}>
                           <h4 style={{ margin: '0 0 10px 0', fontSize: '0.8rem', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '1px' }}>Pocket Listing Details</h4>
                           
                           <input type="text" placeholder="Subject Property Address..." className="modern-input" style={{ width: '100%', marginBottom: '10px' }} value={formData.agentDealAddress || ''} onChange={(e) => setFormData({...formData, agentDealAddress: e.target.value})} />
                           
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                             <input type="number" placeholder="Beds..." className="modern-input" value={formData.agentDealBeds || ''} onChange={(e) => setFormData({...formData, agentDealBeds: e.target.value})} />
                             <input type="number" placeholder="Baths..." className="modern-input" value={formData.agentDealBaths || ''} onChange={(e) => setFormData({...formData, agentDealBaths: e.target.value})} />
                             <input type="number" placeholder="Sqft..." className="modern-input" value={formData.agentDealSqft || ''} onChange={(e) => setFormData({...formData, agentDealSqft: e.target.value})} />
                           </div>
                           
                           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                             <input type="text" placeholder="Asking Price / Target..." className="modern-input" value={formData.agentDealPrice || ''} onChange={(e) => setFormData({...formData, agentDealPrice: e.target.value})} />
                             <input type="text" placeholder="Condition / Repairs Needed..." className="modern-input" value={formData.agentDealCondition || ''} onChange={(e) => setFormData({...formData, agentDealCondition: e.target.value})} />
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}

                 {formData.introResponse === 'NoDeal' && (
                   <div className="bubble-row agent" style={{ marginTop: '1rem', animation: 'slideInUp 0.3s ease forwards' }}>
                     <div className="bubble-label" style={{ color: '#a855f7' }}>Rebuttal (The Push-Off)</div>
                     <div className="bubble" style={{ borderLeftColor: '#a855f7' }}>
                       "Totally get it, but I'll go ahead and text you over my contact info, please save it and if anything comes up please keep me in mind. Thanks."
                     </div>
                   </div>
                 )}

                 {/* General Notes for Agent Interaction */}
                 <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                    <textarea 
                      placeholder="Any additional notes from this agent conversation..." 
                      className="modern-input" 
                      style={{ width: '100%', minHeight: '80px', padding: '15px', resize: 'vertical' }}
                      value={formData.agentNotes || ''}
                      onChange={(e) => setFormData({...formData, agentNotes: e.target.value})}
                    />
                 </div>
              </div>
              
              <button 
                onClick={generateSummary} 
                disabled={isSyncing}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  width: '100%', 
                  padding: '15px', 
                  background: isSyncing ? '#475569' : '#a855f7', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  borderRadius: '12px', 
                  fontSize: '1.1rem', 
                  cursor: isSyncing ? 'not-allowed' : 'pointer', 
                  marginTop: '2rem',
                  transition: 'transform 0.2s' 
                }}
              >
                <ClipboardCheck size={20} /> Review Agent Data
              </button>
              
              {formData.notes && activeSource === 'Agent Outreach' && (
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', marginTop: '1rem' }}>
                  <h4 style={{ color: '#a855f7', marginBottom: '1rem', borderBottom: '1px solid rgba(168, 85, 247, 0.2)', paddingBottom: '0.5rem' }}>Review Agent Data</h4>
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
                    <ClipboardCheck size={20} /> {isSyncing ? 'Pushing to GHL...' : 'Confirm & Log Interaction'}
                  </button>
                  {syncStatus && (
                    <>
                      <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: syncStatus.includes('Success') || syncStatus.includes('Simulated') ? '#10b981' : (syncStatus.includes('Failed') ? '#ef4444' : '#cbd5e1'), fontWeight: '600' }}>
                        {syncStatus}
                      </div>
                      {(syncStatus.includes('Success') || syncStatus.includes('Simulated')) && (
                        <button 
                          onClick={() => onReturn && onReturn({ type: 'success', v
