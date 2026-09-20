'use client';

import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import useStore from '@/store/useStore';
import { generateContract } from '@/lib/apiUtils';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PurchaseAgreementPDF from './PurchaseAgreementPDF';
import AssignmentAgreementPDF from './AssignmentAgreementPDF';

export default function TearSheet({ onClose, formData: passedFormData, activeLead: passedActiveLead }) {
  const store = useStore();
  const formData = passedFormData || store.formData;
  const masterLead = store.masterLead;
  const activeLead = passedActiveLead || store.activeLead;
  const updateForm = store.updateForm;
  const updatePropertyDetails = store.updatePropertyDetails;
  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tearSheetText, setTearSheetText] = useState("");
  const [copied, setCopied] = useState(false);
  const [assigneeName, setAssigneeName] = useState('');
  const [assignedPrice, setAssignedPrice] = useState(Number(formData?.lockedPrice || formData?.askingPrice || 0) + (masterLead?.financialEngine?.assignmentFee || 30000));
  const [assigneeEmd, setAssigneeEmd] = useState(5000);
  const [titleCompany, setTitleCompany] = useState('');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  // Dynamic Viability Scoring Engine
  const financialEngine = masterLead?.financialEngine || {};
  
  const calculateViability = () => {
    let score = 10; // Base score
    
    // 1. Motivation (+ up to 30 points)
    if (formData.motivationLevel === 'High' || formData.painPoints?.length >= 2) score += 30;
    else if (formData.motivationLevel === 'Medium' || formData.painPoints?.length === 1) score += 15;

    // 2. Timeline (+ up to 20 points)
    if (formData.timeline === 'ASAP' || formData.timelineType === 'Urgent') score += 20;
    else if (formData.timeline === '1-3 Months') score += 10;

    // 3. Condition / Distress (+ up to 20 points)
    const repairs = financialEngine?.repairs || 0;
    const arv = parseFloat(String(formData.arv).replace(/[^0-9.]/g, '')) || 0;
    if (arv > 0) {
      const repairRatio = repairs / arv;
      if (repairRatio > 0.15) score += 20; // Heavy distress = good for wholesale
      else if (repairRatio > 0.05) score += 10;
    }

    // 4. Financials / Equity (+ up to 20 points)
    const askingPrice = parseFloat(String(formData.askingPrice).replace(/[^0-9.]/g, '')) || 0;
    const mao = financialEngine?.mao || 0;
    if (askingPrice > 0 && mao > 0) {
      if (askingPrice <= mao) score += 20; // Asking at or below MAO is a golden lead
      else if (askingPrice <= (mao * 1.15)) score += 10; // Within negotiation range
    } else if (formData.freeAndClear) {
      score += 15; // Free and clear is highly viable for creative
    }

    return Math.min(100, score);
  };

  const viabilityScore = calculateViability();

  const getViabilityStatus = (score) => {
    if (score >= 75) return { 
      text: "HOT LEAD: DEEP EQUITY OR HIGH MOTIVATION. PUSH FOR IMMEDIATE CLOSE OR ASSIGNMENT.", 
      color: "bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/50" 
    };
    if (score >= 45) return { 
      text: "NURTURE LEAD: MARGINAL EQUITY OR TIMELINE. REQUIRES HEAVY FOLLOW-UP OR CREATIVE PIVOT.", 
      color: "bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border-[var(--brand-primary)]/50" 
    };
    return { 
      text: "DEAD LEAD: TURNKEY CONDITION WITH RETAIL EXPECTATIONS. PUT ON LONG-TERM DRIP CAMPAIGN.", 
      color: "bg-red-500/20 text-red-500 border-red-500/50" 
    };
  };

  const viabilityConfig = getViabilityStatus(viabilityScore);

  const generateTearSheetText = () => {
    const address = formData?.manualAddress || activeLead?.address || 'Unknown';
    const name = formData?.manualName || activeLead?.name || 'Unknown';
    
    // Multi-family vs Single-family stats
    let bedsBaths = `${formData?.beds || '-'} / ${formData?.baths || '-'}`;
    let sfDetails = `• SqFt: ${formData?.sqft || '-'}
• Lot Size: ${formData?.lotSize ? `${formData.lotSize} ${formData.lotSizeUnit === 'ACRES' ? 'Acres' : 'SqFt'}` : '-'}`;
    
    if (formData?.propertyType === 'Multi-Family' && formData?.mfUnitsData?.length > 0) {
      bedsBaths = formData.mfUnitsData.map((u, i) => `Unit ${String.fromCharCode(65 + i)}: ${u.layoutBeds || '-'} / ${u.layoutBaths || '-'}`).join(', ');
      sfDetails = `• Units: ${formData.mfUnitsData.length}
• Owner Paid Utilities: ${formData?.mfOwnerUtilities?.length > 0 ? formData.mfOwnerUtilities.join(', ') : 'None'}`;
    }

    const activeAmenities = [formData?.amenityPool, formData?.amenityHOA, formData?.amenityRV, formData?.amenityGuestHouse].filter(a => a && a !== 'No Pool' && a !== 'No HOA' && a !== 'No RV Parking' && a !== 'No Guest House').join(', ');

    return `🔥 DISPO TEAR-SHEET 🔥
    
👤 Lead: ${name}
📍 Address: ${address}

📊 FAST FACTS
• Property Type: ${formData?.expectedPropertyType || masterLead?.propertyDetails?.propertyType || 'Single Family'}
• Beds/Baths: ${bedsBaths}
${sfDetails}
• Occupancy: ${formData?.occupancy || masterLead?.propertyDetails?.occupancy || 'Unknown'} ${formData?.tenantStatus?.length ? `(${formData.tenantStatus.join(', ')})` : ''}

💰 DEAL FUNDAMENTALS
• Asking Price: ${formData?.askingPrice ? `$${Number(formData.askingPrice).toLocaleString()}` : 'TBD'}
• Estimated ARV: ${formData?.arv ? `$${Number(formData.arv).toLocaleString()}` : 'Unknown'}
• Motivation: ${formData?.painPoints?.length > 0 ? formData.painPoints.join(', ') : 'Unknown'}
• Timeline: ${formData?.timelineType || 'Unknown'} ${formData?.targetClosingDate ? `(Target: ${formData.targetClosingDate})` : ''}

🛠️ CONDITION & UTILITIES
• Roof: ${formData?.sfRoof || formData?.roofAge || 'Unknown'}
• HVAC: ${formData?.sfHVAC || formData?.hvacAge || 'Unknown'}
• Plumbing: ${formData?.sfPlumbing || formData?.plumbingAge || 'Unknown'}
• Electrical: ${formData?.sfElectrical || formData?.electricalAge || 'Unknown'}
${formData?.propertyType !== 'Multi-Family' ? `• Kitchen: ${formData?.kitchenCondition || 'Unknown'}
• Bathrooms: ${(formData?.bath1Condition || formData?.bath2Condition) ? [formData?.bath1Condition, formData?.bath2Condition].filter(Boolean).join(", ") : "Unknown"}` : ''}
${formData?.solarSystem ? `• Solar: ${formData.solarSystem} ${formData.solarSystem.includes('Lease') ? `($${formData.solarMonthlyPayment || 0}/mo)` : ''}` : ''}

🚨 RISK & VALUE INDICATORS
• Red Flags: ${formData?.majorRedFlags?.length > 0 ? formData.majorRedFlags.join(', ') : 'None'}
• Amenities: ${activeAmenities || 'None'}

📈 Viability Score: ${viabilityScore}/100
📝 Intel: ${viabilityConfig.text}
`;
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setTearSheetText(generateTearSheetText());
      setShowModal(true);
      setIsGenerating(false);
    }, 800);
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(tearSheetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="font-['Josefin_Sans'] flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-[var(--card-border)] pb-3 px-2">
        <FileText className="text-[#00E5FF]" size={24} />
        <h3 className="font-semibold tracking-wide tracking-widest text-2xl text-[var(--text-base)] tracking-wide drop-shadow-md">Dispo Tear-Sheet</h3>
      </div>

      {/* FAST FACTS */}
      <div className="bg-[var(--bg-base)]/60 border border-[var(--card-border)] shadow-sm rounded-xl p-5 mb-6 shrink-0 relative transition-all duration-300">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
            {/* COLUMN 1: FAST FACTS & VIABILITY */}
            <div className="flex flex-col gap-6">
              <div className="">
                <h3 className="text-[var(--text-muted)] font-black text-xs tracking-widest uppercase mb-3 flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                  FAST FACTS
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Lead & Occupancy */}
                  <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] rounded-xl p-3 shadow-inner">
                    <label className="text-[var(--text-muted)] font-bold text-[9px] uppercase tracking-widest block mb-1">Lead Name</label>
                    <div className="text-[var(--text-base)] font-bold text-xs truncate">{formData.manualName || activeLead?.name || 'Unknown'}</div>
                  </div>
                  <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] rounded-xl p-3 shadow-inner">
                    <label className="text-[var(--text-muted)] font-bold text-[9px] uppercase tracking-widest block mb-1">Occupancy</label>
                    <div className="text-[var(--brand-primary)] font-bold text-xs">{formData.occupancy || 'Unknown'}</div>
                  </div>

                  {/* Layout Metrics */}
                  <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] rounded-xl p-3 shadow-inner">
                    <label className="text-[var(--text-muted)] font-bold text-[9px] uppercase tracking-widest block mb-1">Beds / Baths</label>
                    <div className="text-[var(--text-base)] font-bold text-xs">
                      {formData.beds || '-'} Bed / {formData.baths || '-'} Bath
                    </div>
                  </div>
                  <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] rounded-xl p-3 shadow-inner">
                    <label className="text-[var(--text-muted)] font-bold text-[9px] uppercase tracking-widest block mb-1">Livable SqFt</label>
                    <div className="text-[var(--text-base)] font-bold text-xs">{formData.sqft || 'Unknown'} SqFt</div>
                  </div>

                  {/* Property Details */}
                  <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] rounded-xl p-3 shadow-inner">
                    <label className="text-[var(--text-muted)] font-bold text-[9px] uppercase tracking-widest block mb-1">Lot Size</label>
                    <div className="text-[var(--text-base)] font-bold text-xs">{formData.lotSize || 'Unknown'}</div>
                  </div>
                  <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] rounded-xl p-3 shadow-inner">
                    <label className="text-[var(--text-muted)] font-bold text-[9px] uppercase tracking-widest block mb-1">Year Built (Age)</label>
                    <div className="text-[var(--text-base)] font-bold text-xs">
                      {formData.yearBuilt || 'Unknown'} 
                      <span className="text-[var(--text-muted)] font-normal ml-1">
                        {formData.yearBuilt ? `(${new Date().getFullYear() - formData.yearBuilt} yrs)` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deal Score */}
<div className="border border-[var(--card-border)] rounded-xl p-4 bg-[var(--bg-base)]/50 flex flex-col gap-3">
  <h4 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Deal Viability Score</h4>
  
  <div className="flex items-center justify-between">
    <div className="flex-1 bg-[var(--card-bg)] h-3 rounded-full overflow-hidden border border-[var(--card-border)]">
      <div 
        className="h-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${viabilityScore}%`,
          backgroundColor: viabilityScore >= 75 ? '#00FF66' : viabilityScore >= 45 ? 'var(--brand-primary)' : '#ef4444'
        }}
      />
    </div>
    <span className={clsx(
      "ml-4 font-black text-xs px-2 py-1 rounded-md border",
      viabilityConfig.color
    )}>
      {viabilityScore}/100
    </span>
  </div>

  <p className={clsx("text-xs font-bold italic tracking-wide mt-2", viabilityConfig.color.replace('bg-', '').replace('/20', ''))}>
    {viabilityConfig.text}
  </p>
</div>
            </div>

            {/* COLUMN 2: DEAL FUNDAMENTALS & UTILITIES */}
            <div className="flex flex-col gap-6">
              <div className="">
                <h2 className="bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-primary)] bg-clip-text text-transparent font-bold text-sm tracking-widest uppercase mb-4 border-b border-[var(--card-border)] pb-2">DEAL FUNDAMENTALS</h2>
                <div className="flex flex-col gap-3">
                  <div className="bg-[#0A0A0A] border border-[var(--card-border)] rounded-xl p-3 flex flex-col">
                    <p className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mb-1">MOTIVATION</p>
                    <p className="text-sm font-semibold text-[var(--text-base)] font-bold">{formData?.painPoints?.length > 0 ? formData.painPoints.join(', ') : 'Unknown'}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[var(--card-border)] rounded-xl p-3 flex flex-col">
                    <p className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mb-1">TIMELINE</p>
                    <p className="text-sm font-semibold text-[var(--text-base)] font-bold">{formData?.timelineType || formData?.timeline || 'Unknown'}</p>
                  </div>
                  <div className="bg-[#0A0A0A] border border-[var(--card-border)] rounded-xl p-3 flex flex-col">
                    <p className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mb-1">ASKING PRICE</p>
                    <p className="text-sm font-semibold text-[var(--text-base)] font-bold">{formData?.askingPrice ? `$${Number(formData.askingPrice).toLocaleString()}` : 'TBD'}</p>
                  </div>
                </div>
              </div>

              {/* INFRASTRUCTURE & UTILITIES */}
              <div className="">
                <h3 className="text-[var(--text-muted)] font-black text-xs tracking-widest uppercase mb-3 flex items-center gap-2 border-b border-[var(--card-border)] pb-2">
                  INFRASTRUCTURE & UTILITIES
                </h3>
                <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] border-l-2 border-l-[var(--brand-primary)] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)]">
                  <ul className="flex flex-col gap-2">
                    <li className="text-[var(--text-base)] text-xs flex flex-col md:flex-row md:items-start gap-1 md:gap-2">
                      <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider md:w-24 shrink-0">• SOLAR:</span> 
                      <span className="flex-1">{formData.solarSystem || 'None'}</span>
                    </li>
                    <li className="text-[var(--text-base)] text-xs flex flex-col md:flex-row md:items-start gap-1 md:gap-2 pt-2 border-t border-[var(--card-border)]">
                      <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider md:w-24 shrink-0">• SEWER/SEPTIC:</span> 
                      <span className="flex-1">
                        {formData.septicSewer || 'Unknown'} 
                        {/* Ensure status displays cleanly without a weird box if it's a septic system */}
                        {formData.septicSewer === 'Septic System' && formData.septicCondition ? ` — (Status: ${formData.septicCondition})` : ''}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COLUMN 3/4: KNOWN CONDITIONS & RED FLAGS */}
            <div className="lg:col-span-1 xl:col-span-2 flex flex-col gap-6">
              <div className="">
                <h2 className="bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-primary)] bg-clip-text text-transparent font-bold text-sm tracking-widest uppercase mb-4 border-b border-[var(--card-border)] pb-2">KNOWN CONDITIONS & RED FLAGS</h2>
                
                {/* Major Red Flags & Amenities */}
                {(formData?.majorRedFlags?.length > 0 || [formData?.amenityPool, formData?.amenityHOA, formData?.amenityRV, formData?.amenityGuestHouse].some(a => a && !a.startsWith('No '))) && (
                  <div className="mb-4 border border-[var(--card-border)] bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)] p-3 shadow-md">
                     <p className="text-[10px] text-[var(--text-base)] uppercase tracking-widest mb-2 font-black">Risk & Value Indicators</p>
                     <div className="flex flex-wrap gap-3 mb-2">
                       {formData?.majorRedFlags?.map(flag => (
                         <span key={flag} className="bg-[#E74C3C] text-[var(--text-base)] text-xs px-2 py-1 font-black rounded-xl uppercase tracking-wider shadow-md">⚠️ {flag}</span>
                       ))}
                       {[formData?.amenityPool, formData?.amenityHOA, formData?.amenityRV, formData?.amenityGuestHouse]
                         .filter(a => a && !a.startsWith('No '))
                         .map(amenity => (
                           <span key={amenity} className="bg-[var(--card-bg)] border border-[var(--brand-primary)]/50 text-[var(--brand-primary)] text-[10px] px-2 py-1 font-black rounded-xl uppercase tracking-wider shadow-md">⭐ {amenity}</span>
                       ))}
                     </div>
                     {formData?.majorRedFlags && formData.majorRedFlags.length > 0 && (
                        <div>
                          <p className="text-xs text-[#E74C3C] mt-1 font-bold italic">Details: {formData.sfStructuralFlags || "Requires inspection."}</p>
                        </div>
                     )}
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                  {formData?.sfRoof && (
                    <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] border-l-2 border-l-[var(--brand-primary)] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[var(--brand-primary)] font-black text-[10px] tracking-widest uppercase mb-2">ROOF</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• AGE:</span> 
                          <span className="flex-1">{formData.roofAge || 'Unknown'}</span>
                        </li>
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.sfRoof}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.sfHVAC && (
                    <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] border-l-2 border-l-[var(--brand-primary)] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[var(--brand-primary)] font-black text-[10px] tracking-widest uppercase mb-2">HVAC</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• AGE:</span> 
                          <span className="flex-1">{formData.hvacAge || 'Unknown'}</span>
                        </li>
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.sfHVAC}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.sfPlumbing && (
                    <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] border-l-2 border-l-[var(--brand-primary)] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[var(--brand-primary)] font-black text-[10px] tracking-widest uppercase mb-2">PLUMBING</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• AGE:</span> 
                          <span className="flex-1">{formData.plumbingAge || 'Unknown'}</span>
                        </li>
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.sfPlumbing}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.sfElectrical && (
                    <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] border-l-2 border-l-[var(--brand-primary)] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[var(--brand-primary)] font-black text-[10px] tracking-widest uppercase mb-2">ELECTRICAL</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• AGE:</span> 
                          <span className="flex-1">{formData.electricalAge || 'Unknown'}</span>
                        </li>
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.sfElectrical}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.kitchenCondition && (
                    <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] border-l-2 border-l-[var(--brand-primary)] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[var(--brand-primary)] font-black text-[10px] tracking-widest uppercase mb-2">KITCHEN</h4>
                      <ul className="flex flex-col gap-1.5">
                        <li className="text-[var(--text-base)] text-xs flex items-start gap-2">
                          <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• CONDITION:</span> 
                          <span className="flex-1">{formData.kitchenCondition}</span>
                        </li>
                      </ul>
                    </div>
                  )}
                  
                  {formData?.cosmeticsBathsData && Object.keys(formData.cosmeticsBathsData).length > 0 && (
                    <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] border-l-2 border-l-[var(--brand-primary)] rounded-xl p-4 shadow-[0_4px_15px_rgba(0,0,0,0.5)] transition-all hover:bg-[#111111]">
                      <h4 className="text-[var(--brand-primary)] font-black text-[10px] tracking-widest uppercase mb-2">BATHROOMS</h4>
                      <ul className="flex flex-col gap-1.5">
                        {Object.entries(formData.cosmeticsBathsData).map(([i, cond]) => (
                          <li key={i} className="text-[var(--text-base)] text-xs flex items-start gap-2">
                            <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-wider mt-0.5">• BATH {parseInt(i)+1}:</span> 
                            <span className="flex-1">{cond}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {/* Triage Condition Fallbacks */}
                  {!formData?.sfRoof && formData?.roof?.length > 0 && <span className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/60 text-[var(--text-base)] text-xs px-2 py-1 font-bold rounded-xl shadow-md">Roof: {formData.roof.join(', ')}</span>}
                  {!formData?.sfHVAC && formData?.hvac?.length > 0 && <span className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/60 text-[var(--text-base)] text-xs px-2 py-1 font-bold rounded-xl shadow-md">HVAC: {formData.hvac.join(', ')}</span>}
                  {!formData?.sfPlumbing && formData?.plumbing?.length > 0 && <span className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/60 text-[var(--text-base)] text-xs px-2 py-1 font-bold rounded-xl shadow-md">Plumbing: {formData.plumbing.join(', ')}</span>}
                  {!formData?.sfElectrical && formData?.electrical?.length > 0 && <span className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/60 text-[var(--text-base)] text-xs px-2 py-1 font-bold rounded-xl shadow-md">Electrical: {formData.electrical.join(', ')}</span>}
                  
                  {(!formData?.sfRoof && !formData?.sfHVAC && !formData?.sfPlumbing && !formData?.sfElectrical && !formData?.roof?.length && !formData?.hvac?.length && !formData?.plumbing?.length && !formData?.electrical?.length) && (
                    <span className="text-sm font-bold text-[var(--text-base)] font-bold">No major issues reported</span>
                  )}
                </div>
              </div>
            </div>
          </div>

      </div>

        <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/80 backdrop-blur-md border border-[var(--card-border)] shadow-sm rounded-xl p-5 mb-6 overflow-hidden relative transition-all duration-300">
          <div className="flex flex-col items-center relative">
            <h2 className="bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-secondary)] to-[var(--brand-primary)] bg-clip-text text-transparent font-bold text-sm tracking-widest uppercase mb-4 border-b border-[var(--card-border)] pb-2">
              Push to Disposition
            </h2>
  
            {isGenerating && (
              <div className="absolute inset-0 bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/80/50 backdrop-blur-sm z-20 flex items-center justify-center">
                <Loader2 size={32} className="text-[var(--brand-primary)] animate-spin" />
              </div>
            )}
            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className={clsx(
                "w-full py-3.5 bg-gradient-to-r from-[#CD7F32] via-[var(--brand-primary)] to-[var(--brand-primary)] text-[#000000] font-extrabold text-center rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_0_20px_rgba(229,193,88,0.5)] hover:opacity-95 transition-all cursor-pointer uppercase tracking-wider",
                isGenerating && "opacity-70 cursor-not-allowed"
              )}
            >
              {isGenerating ? "GENERATING..." : "GENERATE TEAR-SHEET!"}
            </button>
          </div>
        </div>

      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/80/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)] border-8 border-[var(--card-border)] shadow-sm w-full max-w-3xl max-h-[90vh] flex flex-col transition-all duration-300 - relative">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[var(--brand-primary)]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/80 text-[var(--text-base)] p-4 flex justify-between items-center border-b-4 border-[var(--card-border)] shrink-0">
              <h2 className="font-semibold tracking-wide text-3xl tracking-widest flex items-center gap-2">
                <FileText className="text-[#FFE600]" size={28} />
                TEAR-SHEET READY
              </h2>
              <button 
                onClick={() => setShowModal(false)}
                className="text-[var(--text-base)] hover:text-[var(--brand-primary)] font-black text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-[var(--card-bg)]">
              <textarea readOnly
                value={tearSheetText}
                className="w-full min-h-[400px] h-[60vh] bg-[#0A0A0A] border border-[var(--card-border)] rounded-xl p-5 text-[#00E5FF] font-mono text-sm leading-relaxed outline-none resize-none custom-scrollbar cursor-default pointer-events-none"
              />
            </div>
            
            {/* Modal Footer (Document Hub) */}
            <div className="p-6 bg-[var(--card-bg)] border-t-4 border-[var(--card-border)] shrink-0 flex flex-wrap justify-end items-center gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 font-bold tracking-widest uppercase transition-all bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl text-[var(--text-base)] hover:bg-[#111]"
              >
                CLOSE
              </button>

              <button 
                onClick={handleCopy}
                className="px-4 py-2 font-bold tracking-widest uppercase transition-all bg-[var(--bg-base)] border border-[var(--card-border)] rounded-xl text-[var(--text-base)] hover:bg-[#111] flex items-center gap-2"
              >
                {copied ? <CheckCircle2 size={16} /> : "📋 COPY TEAR-SHEET"}
              </button>

              <PDFDownloadLink
                document={<PurchaseAgreementPDF formData={formData} />}
                fileName={`PSA_${(formData.legalName || 'Contract').replace(/\s+/g, '_')}.pdf`}
                className="px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-black text-sm tracking-widest uppercase rounded-xl shadow-lg hover:scale-105 transition-transform"
                onClick={async () => {
                   await fetch('/api/documents/save', {
                     method: 'POST', body: JSON.stringify({ contactId: activeLead?.contactId, type: 'PSA', title: `PSA_${(formData.legalName || 'Contract').replace(/\s+/g, '_')}.pdf`, payload: JSON.stringify(formData) })
                   });
                }}
              >
                {({ loading }) => loading ? 'GENERATING...' : '⬇ ACQUISITION (PSA)'}
              </PDFDownloadLink>

              <button
                onClick={() => setShowAssignmentModal(true)}
                className="px-6 py-2 bg-gradient-to-r from-[#10b981] to-[#059669] text-black font-black text-sm tracking-widest uppercase rounded-xl shadow-lg hover:scale-105 transition-transform"
              >
                ⬇ DISPO (ASSIGNMENT)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Input Modal */}
      {showAssignmentModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#111] border border-[var(--brand-primary)] shadow-2xl rounded-2xl p-6 w-full max-w-lg flex flex-col gap-4">
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Assignment Details</h2>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">End Buyer Name (Assignee)</label>
              <input type="text" value={assigneeName} onChange={e => setAssigneeName(e.target.value)} className="bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Assigned Purchase Price</label>
              <input type="number" value={assignedPrice} onChange={e => setAssignedPrice(e.target.value)} className="bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Assignee EMD</label>
              <input type="number" value={assigneeEmd} onChange={e => setAssigneeEmd(e.target.value)} className="bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400 uppercase">Title/Escrow Company</label>
              <input type="text" value={titleCompany} onChange={e => setTitleCompany(e.target.value)} className="bg-black/50 border border-white/20 rounded p-2 text-white" />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowAssignmentModal(false)} className="px-4 py-2 bg-gray-800 text-white font-bold rounded">CANCEL</button>
              <PDFDownloadLink
                document={<AssignmentAgreementPDF formData={{ ...formData, endBuyerName: assigneeName, endBuyerEmd: assigneeEmd, titleCompany: titleCompany }} assignmentFee={assignedPrice - Number(formData?.lockedPrice || formData?.askingPrice || 0)} />}
                fileName={`ASSIGNMENT_${assigneeName || 'Contract'}.pdf`}
                className="px-6 py-2 bg-[#10b981] text-black font-black uppercase rounded shadow-lg hover:scale-105 transition-transform"
                onClick={async () => {
                   await fetch('/api/documents/save', {
                     method: 'POST', body: JSON.stringify({ contactId: activeLead?.contactId, type: 'ASSIGNMENT', title: `ASSIGNMENT_${assigneeName || 'Contract'}.pdf`, payload: JSON.stringify({...formData, assigneeName, assignedPrice, assigneeEmd, titleCompany}) })
                   });
                   setShowAssignmentModal(false);
                }}
              >
                {({ loading }) => loading ? 'GENERATING...' : 'DOWNLOAD ASSIGNMENT PDF'}
              </PDFDownloadLink>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
