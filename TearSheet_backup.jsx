'use client';

import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle2 } from 'lucide-react';
import clsx from 'clsx';
import useStore from '@/store/useStore';
import { generateContract } from '@/lib/apiUtils';

export default function TearSheet({ onClose, formData: passedFormData, activeLead: passedActiveLead }) {
  const store = useStore();
  const formData = passedFormData || store.formData;
  const masterLead = store.masterLead;
  const activeLead = passedActiveLead || store.activeLead;
  const updateForm = store.updateForm;
  const updatePropertyDetails = store.updatePropertyDetails;
  const [contractDraft, setContractDraft] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculate Deal Viability Score
  const calculateDealScore = () => {
    let score = 0;
    
    const roof = formData?.roof || masterLead?.triageCondition?.roof;
    if (roof && roof.length > 0) score += 15;
    const hvac = formData?.hvac || masterLead?.triageCondition?.hvac;
    if (hvac && hvac.length > 0) score += 10;
    const plumbing = formData?.plumbing || masterLead?.triageCondition?.plumbing;
    if (plumbing && plumbing.length > 0) score += 15;
    const electrical = formData?.electrical || masterLead?.triageCondition?.electrical;
    if (electrical && electrical.length > 0) score += 15;

    let occ = formData?.occupancy || masterLead?.propertyDetails?.occupancy;
    if (formData?.propertyType === 'Multi-Family' && formData?.mfUnitsData) {
      if (formData.mfUnitsData.some(u => u.occupancy === 'Vacant')) {
        occ = 'Vacant';
      } else if (formData.mfUnitsData.some(u => u.occupancy === 'Tenant Occupied')) {
        occ = 'Tenant';
      }
    }
    if (occ === 'Vacant') score += 20; 
    else if (occ === 'Tenant' || occ === 'Tenant Occupied') score += 10;
    else if (occ === 'Squatter' || occ === 'Hostile') score += 25; 

    const time = formData?.timeline || masterLead?.propertyDetails?.timeline;
    if (time && time.toLowerCase().includes('asap')) score += 20;
    else if (time && time.includes('30')) score += 15;
    else if (time && time.includes('month')) score += 10;

    return Math.min(score, 100);
  };

  const dealScore = calculateDealScore();
  
  let scoreColor = '#FF0055'; // Red (Low distress)
  if (dealScore >= 60) scoreColor = '#00E676'; // Green (High distress / good deal)
  else if (dealScore >= 30) scoreColor = '#FFE600'; // Yellow (Medium)

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const draft = generateContract(masterLead);
      setContractDraft(draft);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-black pb-3 px-2">
        <FileText className="text-[#00E5FF]" size={24} />
        <h3 className="font-bangers tracking-widest text-2xl text-black tracking-wide drop-shadow-md">Dispo Tear-Sheet</h3>
      </div>

      {/* FAST FACTS */}
      <div className="bg-[#fffdf0] border-4 border-black p-6 shadow-[8px_8px_0px_#000] shrink-0 relative overflow-visible transform rotate-1 mb-4 mt-2">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/60 border border-gray-300 transform -rotate-2 z-20 backdrop-blur-sm shadow-sm" style={{clipPath: "polygon(0 10%, 100% 0, 95% 100%, 5% 90%)"}}></div>
          <h2 className="font-bangers text-4xl mb-4 tracking-widest text-black transform -skew-x-6 border-b-4 border-black pb-2">FAST FACTS</h2>
          
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Lead Name</p>
              <p className="font-bangers text-2xl tracking-widest text-black">{formData?.manualName || activeLead?.name || 'Unknown'}</p>
            </div>

            {formData?.propertyType !== 'Multi-Family' ? (
              <>
                <div className="bg-purple-900/10 border border-purple-500/20 p-3 rounded-lg grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-1 font-bold">Beds/Baths</p>
                    <div className="flex items-center text-black font-bold gap-1 font-mono">
                      <input type="text" className="w-8 bg-transparent text-center border-b border-purple-500/50 outline-none focus:border-purple-300" placeholder="-" value={formData?.beds || masterLead?.propertyDetails?.beds || ''} onChange={e => { if(store.callScriptUpdateForm) store.callScriptUpdateForm('beds', e.target.value); updatePropertyDetails({ beds: e.target.value }); }} />
                      <span>/</span>
                      <input type="text" className="w-8 bg-transparent text-center border-b border-purple-500/50 outline-none focus:border-purple-300" placeholder="-" value={formData?.baths || masterLead?.propertyDetails?.baths || ''} onChange={e => { if(store.callScriptUpdateForm) store.callScriptUpdateForm('baths', e.target.value); updatePropertyDetails({ baths: e.target.value }); }} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-purple-400 uppercase tracking-widest mb-1 font-bold">SqFt</p>
                    <input type="number" className="w-full bg-transparent text-black font-bold font-mono border-b border-purple-500/50 outline-none focus:border-purple-300" placeholder="Sqft..." value={formData?.sqft || masterLead?.propertyDetails?.sqft || ''} onChange={e => { if(store.callScriptUpdateForm) store.callScriptUpdateForm('sqft', e.target.value); updatePropertyDetails({ sqft: Number(e.target.value) }); }} />
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Occupancy</p>
                  <p className="font-bold text-black">{masterLead?.propertyDetails?.occupancy || 'Unknown'}</p>
                </div>
              </>
            ) : (
              <div className="bg-blue-900/10 border border-blue-500/20 p-3 rounded-lg flex flex-col gap-3">
                <p className="text-[10px] text-blue-600 uppercase tracking-widest mb-1 font-bold">Multi-Family Breakdown</p>
                {formData?.mfUnitsData?.map((unit, idx) => (
                  <div key={idx} className="bg-white p-2 border border-black rounded text-sm shadow-[2px_2px_0px_#000]">
                    <div className="font-bold text-black border-b border-gray-200 mb-1 pb-1">Unit {String.fromCharCode(65 + idx)}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div><span className="text-gray-500 font-bold">Layout:</span> {unit.layoutBeds || '-'} / {unit.layoutBaths || '-'}</div>
                      <div><span className="text-gray-500 font-bold">Status:</span> <span className={unit.occupancy === 'Vacant' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{unit.occupancy || '-'}</span></div>
                      {unit.occupancy === 'Tenant Occupied' && (
                        <>
                          <div><span className="text-gray-500 font-bold">Rent:</span> ${unit.rentAmount || '-'} ({unit.leaseType || '-'})</div>
                          <div><span className="text-gray-500 font-bold">Payment:</span> {unit.paymentStatus || '-'}</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {formData?.mfOwnerUtilities?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Owner-Paid Utilities</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.mfOwnerUtilities.map(util => (
                        <span key={util} className="bg-black text-white text-[10px] px-2 py-0.5 rounded-sm font-bold shadow-[2px_2px_0px_#00E5FF]">{util}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {masterLead?.propertyDetails?.propertyType && (
              <div className="p-3 border border-black rounded-lg">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Property Type</p>
                <p className="font-bold text-[#00E5FF] drop-shadow-[1px_1px_0px_#000]">{masterLead.propertyDetails.propertyType}</p>
              </div>
            )}
            
            
            {/* Deal Fundamentals */}
            <div className="mt-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Deal Fundamentals</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#00FFFF] p-2 border-2 border-black rounded-sm shadow-[2px_2px_0px_#000]">
                  <p className="text-[10px] text-black font-black uppercase mb-1">Motivation</p>
                  <p className="font-black text-sm text-black">{formData?.coreReason || formData?.motivation || 'Unknown'}</p>
                </div>
                <div className="bg-[#00FFFF] p-2 border-2 border-black rounded-sm shadow-[2px_2px_0px_#000]">
                  <p className="text-[10px] text-black font-black uppercase mb-1">Timeline</p>
                  <p className="font-black text-sm text-black">{formData?.timelineType || formData?.timeline || 'Unknown'}</p>
                </div>
                <div className="bg-[#00FFFF] p-2 border-2 border-black rounded-sm shadow-[2px_2px_0px_#000]">
                  <p className="text-[10px] text-black font-black uppercase mb-1">Asking Price</p>
                  <p className="font-black text-sm text-black">{formData?.askingPrice ? `$${Number(formData.askingPrice).toLocaleString()}` : 'TBD'}</p>
                </div>
              </div>
            </div>

            {/* Utilities & Infrastructure */}
            <div className="mt-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Infrastructure & Utilities</p>
              <div className="flex flex-wrap gap-2">
                {formData?.septicSewer && formData.septicSewer !== 'Septic System' && <span className="bg-[#B400FF] text-white text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Sewer: {formData.septicSewer}</span>}
                {formData?.solarSystem === 'No Solar' && <span className="bg-gray-200 text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Solar: None</span>}
              </div>
              
              {formData?.septicSewer === 'Septic System' && (
                <div className="mt-2 p-2 border-2 border-black bg-[#FFFF00] w-full">
                  <div className="font-black italic text-sm text-black uppercase">SEWER: SEPTIC SYSTEM</div>
                  <ul className="text-xs font-black text-black mt-1 space-y-1">
                    <li>• STATUS: <span className="text-black">{formData.septicCondition || 'Unknown'}</span></li>
                  </ul>
                </div>
              )}
              
              {(formData?.solarSystem === 'Solar (Leased)' || formData?.solarSystem === 'Solar (Owned)') && (
                <div className="mt-2 p-2 border-2 border-black bg-[#FFFF00] w-full">
                  <div className="font-black italic text-sm text-black uppercase">SOLAR: {formData.solarSystem}</div>
                  <ul className="text-xs font-black text-black mt-1 space-y-1">
                    <li>• AGE: <span className="text-black">{formData.solarAge || 'Unknown'}</span></li>
                    <li>• COMPANY: <span className="text-black">{formData.solarCompany || 'N/A'}</span></li>
                    <li>• PAYMENT: <span className="text-black">${formData.solarMonthlyPayment || '0'}/mo</span></li>
                    <li>• PAYOFF: <span className="text-[#FF1111]" style={{ textShadow: '1px 1px 0px #fff, -1px -1px 0px #fff, 1px -1px 0px #fff, -1px 1px 0px #fff' }}>${formData.solarPayoffAmount || '0'}</span></li>
                    <li>• ASSUMABLE: <span className="text-black">{formData.solarAssumable || 'Unknown'}</span></li>
                  </ul>
                </div>
              )}
            </div>

            {/* Danger Matrix */}
            {formData?.majorRedFlags && formData.majorRedFlags.length > 0 && (
              <div className="mt-2">
                <p className="text-[10px] text-[#FF1111] uppercase tracking-widest mb-1 font-black">MAJOR RED FLAGS</p>
                <div className="flex flex-wrap gap-1">
                  {formData.majorRedFlags.map((flag, idx) => (
                    <span key={idx} className="bg-[#FF1111] text-white text-xs px-2 py-1 font-black italic rounded-sm shadow-[2px_2px_0px_#000]">{flag}</span>
                  ))}
                </div>
                {formData?.sfStructuralFlags && (
                   <p className="text-xs text-red-600 mt-1 font-bold italic">Details: {formData.sfStructuralFlags}</p>
                )}
              </div>
            )}

            {/* Known Conditions */}
            <div className="mt-2">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Known Conditions</p>
              <div className="flex flex-col">
                {formData?.sfRoof && (
                  <div className="mt-2 p-2 border-2 border-black bg-[#FFA500]">
                    <div className="font-black italic text-sm text-black uppercase">ROOF</div>
                    <ul className="text-xs font-black text-black mt-1 space-y-1">
                      <li>• AGE: <span className="text-black">{formData.roofAge || 'Unknown'}</span></li>
                      <li>• CONDITION: <span className="text-black">{formData.sfRoof}</span></li>
                    </ul>
                  </div>
                )}
                {formData?.sfHVAC && (
                  <div className="mt-2 p-2 border-2 border-black bg-[#00BFFF]">
                    <div className="font-black italic text-sm text-black uppercase">HVAC</div>
                    <ul className="text-xs font-black text-black mt-1 space-y-1">
                      <li>• AGE: <span className="text-black">{formData.hvacAge || 'Unknown'}</span></li>
                      <li>• CONDITION: <span className="text-black">{formData.sfHVAC}</span></li>
                    </ul>
                  </div>
                )}
                {formData?.sfPlumbing && (
                  <div className="mt-2 p-2 border-2 border-black bg-[#00FF00]">
                    <div className="font-black italic text-sm text-black uppercase">PLUMBING</div>
                    <ul className="text-xs font-black text-black mt-1 space-y-1">
                      <li>• AGE: <span className="text-black">{formData.plumbingAge || 'Unknown'}</span></li>
                      <li>• CONDITION: <span className="text-black">{formData.sfPlumbing}</span></li>
                    </ul>
                  </div>
                )}
                {formData?.sfElectrical && (
                  <div className="mt-2 p-2 border-2 border-black bg-[#FF00FF]">
                    <div className="font-black italic text-sm text-black uppercase">ELECTRICAL</div>
                    <ul className="text-xs font-black text-black mt-1 space-y-1">
                      <li>• AGE: <span className="text-black">{formData.electricalAge || 'Unknown'}</span></li>
                      <li>• CONDITION: <span className="text-black">{formData.sfElectrical}</span></li>
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {/* Triage Condition Fallbacks */}
                {!formData?.sfRoof && formData?.roof?.length > 0 && <span className="bg-[#FF0055] text-white text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Roof: {formData.roof.join(', ')}</span>}
                {!formData?.sfHVAC && formData?.hvac?.length > 0 && <span className="bg-[#00E5FF] text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">HVAC: {formData.hvac.join(', ')}</span>}
                {!formData?.sfPlumbing && formData?.plumbing?.length > 0 && <span className="bg-[#FFE600] text-black text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Plumbing: {formData.plumbing.join(', ')}</span>}
                {!formData?.sfElectrical && formData?.electrical?.length > 0 && <span className="bg-[#B400FF] text-white text-xs px-2 py-1 font-bold rounded-sm shadow-[2px_2px_0px_#000]">Electrical: {formData.electrical.join(', ')}</span>}
                
                {(!formData?.sfRoof && !formData?.sfHVAC && !formData?.sfPlumbing && !formData?.sfElectrical && !formData?.roof?.length && !formData?.hvac?.length && !formData?.plumbing?.length && !formData?.electrical?.length) && (
                  <span className="text-sm font-bold text-gray-500">No major issues reported</span>
                )}
              </div>
            </div>
{/* Deal Score */}
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Deal Viability Score</p>
              <div className="flex items-center gap-2">
                <div className="h-3 flex-1 border border-black rounded-full overflow-hidden bg-white shadow-inner">
                  <div className="h-full transition-all duration-500 ease-out" style={{ width: `${dealScore}%`, backgroundColor: scoreColor }}></div>
                </div>
                <span className="text-xs font-bold text-black font-mono">{dealScore}/100</span>
              </div>
            </div>
          </div>
      </div>

        {!contractDraft ? (
          <div className="comic-paper border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden relative transform -rotate-1 mb-6">
            {/* Explosion Header */}
            <div className="bg-[#FFE600] border-b-4 border-black p-8 flex flex-col items-center justify-center relative overflow-hidden comic-halftone">
              <div className="font-bangers text-8xl text-white transform -skew-x-6 z-10 rotate-[-5deg]" style={{textShadow: "6px 6px 0px #FF0055, 10px 10px 0px #000, 15px 15px 0px #00E5FF"}}>BOOM!</div>
              <div className="mt-4 font-bangers text-black uppercase tracking-widest text-xl z-10 bg-[#00E5FF] px-4 py-1 border-4 border-black transform rotate-2 shadow-[4px_4px_0px_#000]">Classified Intel</div>
              {isGenerating && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex items-center justify-center">
                  <Loader2 size={48} className="text-[#FF0055] animate-spin drop-shadow-[0_0_15px_#FF0055]" />
                </div>
              )}
            </div>
  
            <div className="p-8 flex flex-col items-center relative">
              <p className="text-black mb-8 font-bold text-center font-bangers text-3xl tracking-wide leading-relaxed transform -skew-x-2">
                Ready to push to disposition? <br />
                <span className="text-[#FF0055] bg-black px-2 text-white">Smash the button</span> to generate the tear-sheet!
              </p>
  
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className={clsx(
                  "w-full py-4 px-6 font-bangers text-3xl tracking-widest uppercase transition-all border-4 border-black transform -skew-x-2",
                  isGenerating 
                    ? "bg-gray-400 text-gray-700 shadow-[4px_4px_0px_#000]"
                    : "bg-[#FF0055] hover:bg-[#00E5FF] text-white hover:text-black shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] hover:-translate-y-1"
                )}
              >
                {isGenerating ? "GENERATING..." : "GENERATE TEAR-SHEET!"}
              </button>
            </div>
          </div>
        ) : (
        <div className="bg-white p-6 border-4 border-black relative shadow-[6px_6px_0px_#000]">
          <div className="absolute top-4 right-4 flex items-center gap-2 text-[#00E676] font-sans font-black uppercase font-bold uppercase border-b-2 border-[#166534] pb-1">
            <CheckCircle2 size={16} />
            {contractDraft.status}
          </div>

          <h4 className="text-xl font-bangers tracking-widest text-black mb-4">Draft ID: {contractDraft.contractId}</h4>
          
          <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6 font-sans font-black uppercase text-[#27272a]">
            <div>
              <p className="text-xs text-black uppercase font-bold">Property</p>
              <p className="font-bold text-black">{contractDraft.propertyAddress}</p>
            </div>
            <div>
              <p className="text-xs text-black uppercase font-bold">Purchase Price</p>
              <p className="font-bold text-[#00E676] text-xl">${contractDraft.purchasePrice.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-black uppercase font-bold">EMD</p>
              <p className="font-bold text-black">${contractDraft.earnestMoney.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-black uppercase font-bold">Closing Timeline</p>
              <p className="font-bold text-black">{contractDraft.closingDays} Days</p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 border-4 border-black shadow-[4px_4px_0px_#000] transform skew-x-1 font-sans font-black uppercase text-[#27272a]">
            <p className="text-xs text-black font-bold uppercase mb-2">Condition Disclosures</p>
            <ul className="text-sm list-none space-y-2">
              <li className="flex gap-2"><span className="text-black font-bold">Roof:</span> {contractDraft.conditions.roof || 'Not specified'}</li>
              <li className="flex gap-2"><span className="text-black font-bold">HVAC:</span> {contractDraft.conditions.hvac || 'Not specified'}</li>
              <li className="flex gap-2"><span className="text-black font-bold">Plumbing:</span> {contractDraft.conditions.plumbing || 'Not specified'}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
