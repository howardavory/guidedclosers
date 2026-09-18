import React, { useState, useEffect } from 'react';
import { Calculator, Sparkles, DollarSign } from 'lucide-react';

export default function RehabCalculator({ formData = {}, lead = null }) {
  const [sqft, setSqft] = useState(1500);
  const [costPerSqft, setCostPerSqft] = useState(40);
  const [severityEstimate, setSeverityEstimate] = useState(0);

  const [arv, setArv] = useState(300000);
  const [assignmentFee, setAssignmentFee] = useState(30000);

  const isJVSplit = lead?.source === 'Agent Outreach' || (lead?.tags && lead.tags.some(tag => tag.toLowerCase().includes('agent outreach')));

  useEffect(() => {
    if (formData.sqft && !isNaN(Number(formData.sqft))) {
      setSqft(Number(formData.sqft));
    }
  }, [formData.sqft]);

  const calculatedTotalRepairs = useMemo(() => {
    let total = 0;
    const sqft = Number(formData.sqft) || 0;
    const baths = Number(formData.baths) || 0;

    // SAFE CHECKER: Works whether the state is a string or an array
    const hasCondition = (field, value) => {
      if (!formData[field]) return false;
      if (Array.isArray(formData[field])) return formData[field].includes(value);
      return formData[field] === value;
    };

    // Roof
    if (hasCondition('roof', 'Minor Leaks / Needs Overlay')) total += (sqft * 4);
    if (hasCondition('roof', 'Tarped / Full Tear-Off')) total += (sqft * 8);

    // HVAC
    if (hasCondition('hvacAge', 'Window Units / No Central')) total += (8000 + (sqft * 5));
    else if (hasCondition('hvacStatus', 'Broken / Failed')) total += 8000;
    else if (hasCondition('hvacStatus', 'Needs Servicing')) total += 1500;

    // Plumbing
    if (hasCondition('plumbing', 'Active Leaks')) total += 2500;
    if (hasCondition('plumbing', 'Full Repipe')) total += (sqft * 5);

    // Electrical
    if (hasCondition('electrical', 'Panel Upgrade')) total += 3500;
    if (hasCondition('electrical', 'Full Rewire')) total += (sqft * 5);

    // Kitchen
    if (hasCondition('kitchenCondition', 'Dated / Needs Update')) total += 5000;
    if (hasCondition('kitchenCondition', 'Full Gut Needed')) total += 15000;

    // Baths
    // Bath 1
    if (hasCondition('bath1Condition', 'Dated / Needs Update')) total += 2500;
    if (hasCondition('bath1Condition', 'Full Gut Needed')) total += 7500;

    // Bath 2
    if (hasCondition('bath2Condition', 'Dated / Needs Update')) total += 2500;
    if (hasCondition('bath2Condition', 'Full Gut Needed')) total += 7500;

    // Pool
    if (hasCondition('poolCondition', 'Needs Repair')) total += 8500;
    if (hasCondition('poolCondition', 'Needs Demo/Fill')) total += 12500;

    // Fire
    if (hasCondition('fireDamageType', 'Cosmetic')) total += (sqft * 35);
    if (hasCondition('fireDamageType', 'Structural')) total += (sqft * 100);

    return total;
  }, [formData]);

  useEffect(() => {
    setSeverityEstimate(calculatedTotalRepairs);
    if (sqft > 0) {
      setCostPerSqft(Math.round(calculatedTotalRepairs / sqft));
    }
  }, [calculatedTotalRepairs, sqft]);

  // DEBT CALCULATIONS
  const m1 = Number((formData.mortgageBalance || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const m2 = Number((formData.secondPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const m3 = Number((formData.thirdPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const m4 = Number((formData.fourthPosition || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const arr = Number((formData.arrearsAmount || '').toString().replace(/[^0-9.-]+/g,"")) || 0;
  const totalDebt = formData.freeAndClear ? 0 : (m1 + m2 + m3 + m4 + arr);

  // ASKING PRICE CALCULATIONS
  const askingPrice = Number((formData.askingPrice || '').toString().replace(/[^0-9.-]+/g,"")) || 0;

  const [exitStrategy, setExitStrategy] = useState('wholesale');
  const [holdingDurationDays, setHoldingDurationDays] = useState(90);
  const [capitalSource, setCapitalSource] = useState('Hard Money');

  const getMultiplier = () => {
    if (exitStrategy === 'wholesale') return 0.79;
    if (exitStrategy === 'flip') return 0.70;
    if (exitStrategy === 'novation') return 0.85;
    return 0.79;
  };

  const multiplier = getMultiplier();

  // MAO CALCULATION
  let interestRate = 0;
  if (capitalSource === 'Hard Money') interestRate = 0.12;
  if (capitalSource === 'Institutional') interestRate = 0.08;
  if (capitalSource === 'Cash') interestRate = 0;

  const totalCapitalRequired = arv * multiplier + calculatedTotalRepairs;
  const holdingCosts = totalCapitalRequired * interestRate * (holdingDurationDays / 365);

  let mao = arv * multiplier - calculatedTotalRepairs - holdingCosts;
  if (exitStrategy === 'wholesale') {
    mao -= assignmentFee;
  }
  
  const debtExceedsMao = totalDebt > mao && totalDebt > 0;
  const askingExceedsMao = askingPrice > mao && askingPrice > 0;
  const isUnderwater = debtExceedsMao || askingExceedsMao;

  const getSliderColor = (cost) => {
    if (cost <= 25) return `hsl(120, 80%, 45%)`;
    if (cost >= 55) return `hsl(0, 80%, 45%)`;
    // Transition between 25 and 55 (range of 30)
    const ratio = (cost - 25) / 30;
    const hue = 120 - (ratio * 120);
    return `hsl(${hue}, 80%, 45%)`;
  };

  const getCategoryName = (cost) => {
    if (cost < 25) return 'Turnkey / Light';
    if (cost < 55) return 'Medium Rehab';
    if (cost < 85) return 'Heavy Rehab';
    if (cost < 115) return 'Extreme / Gut';
    return 'Fire Damage';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">

      <style dangerouslySetInnerHTML={{ __html: `
        .neo-slider {
          -webkit-appearance: none;
          width: 100%;
          background: #333333;
          height: 6px;
          outline: none;
          margin-top: 10px;
          margin-bottom: 10px;
        }
        .neo-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #000000;
          border: 2px solid #D4AF37;
          cursor: pointer;
          border-radius: 0px;
        }
        .neo-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #000000;
          border: 2px solid #D4AF37;
          cursor: pointer;
          border-radius: 0px;
        }
      ` }} />
  
      
      {/* ENGINE A: SEVERITY ESTIMATOR */}
      <div className="calc-card bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/80/90 border border-[#d946ef] p-8 shadow-sm relative mb-0 skew-x-[-1deg] text-[var(--text-base)]">
      
        {/* Header */}
        <div className="pb-4 mb-0 border-b-2 border-solid border-[#D4AF37]/40">
          <h3 className="text-2xl font-black italic uppercase tracking-wider text-[var(--text-base)]">[DAMAGE ASSESSMENT ENGINE]</h3>
        </div>

        <div className="flex flex-row items-start gap-6 w-full">
        
          {/* Quick SqFt Estimate (Engine A) */}
          <div className="flex items-center gap-3 mb-0 pb-3 border-b border-gray-700">
            <div className="bg-orange-500/15 p-2 rounded-full">
              <Calculator size={20} className="text-orange-400" />
            </div>
            <h4 className="m-0 text-lg font-bold text-gray-300">Quick SqFt Estimate</h4>
          </div>
        
          <div className="flex gap-4 mb-0 items-center">
            <span className="text-sm font-bold text-[var(--text-muted)] uppercase">Est. Square Footage:</span>
            <div className="smart-input-container w-36">
              <Calculator size={14} className="smart-input-icon" />
              <input 
                type="number" 
                value={sqft}
                onChange={(e) => setSqft(Number(e.target.value))}
                className="border-2 border-white rounded-none bg-[#111111] p-2 text-[var(--text-base)] w-full no-spinner outline-none"
              />
            </div>
          </div>

          <div className="mb-0">
            <div className="px-2">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold uppercase" style={{ color: getSliderColor(costPerSqft) }}>
                  {getCategoryName(costPerSqft)}
                </span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="150" 
                step="5" 
                value={costPerSqft} 
                onChange={(e) => setCostPerSqft(Number(e.target.value))} 
                className="w-full cursor-pointer h-1.5 rounded"
                style={{ accentColor: getSliderColor(costPerSqft) }}
              />
            </div>
          
            <div className="text-center mt-4 font-black text-[1.8rem] flex items-baseline justify-center gap-1" style={{ color: getSliderColor(costPerSqft) }}>
              ${costPerSqft} <span className="text-sm font-bold text-[var(--text-muted)]">/ sqft</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t-2 border-solid border-[#D4AF37]/40">
            <span className="text-sm font-bold text-[var(--text-muted)]">Severity Total:</span>
            <span className="text-4xl font-black text-[#D4AF37]">${severityEstimate.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* ENGINE C: MAO CALCULATOR */}
      <div className="calc-card bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/80 border border-[#FF00FF] rounded-none p-8 relative mb-10 text-[var(--text-base)] shadow-[8px_8px_0px_0px_#FF00FF]">
        
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isUnderwater ? 'bg-red-500/15' : 'bg-emerald-500/15'}`}>
              <Calculator size={20} color={isUnderwater ? "#ef4444" : "#10b981"} />
            </div>
            <h4 className="m-0 text-lg font-bold text-[var(--text-base)]">Cash Offer MAO</h4>
          </div>
        </div>

        <div className="flex gap-2 mb-0 bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[var(--text-base)]/5 p-1 rounded-lg">
          <button 
            onClick={() => setExitStrategy('wholesale')}
            className={`flex-1 p-2 rounded border-none font-bold cursor-pointer transition-all ${exitStrategy === 'wholesale' ? 'bg-gray-800 text-[var(--text-base)]' : 'text-[var(--text-muted)] bg-transparent'}`}
          >Wholesale</button>
          <button 
            onClick={() => setExitStrategy('flip')}
            className={`flex-1 p-2 rounded border-none font-bold cursor-pointer transition-all ${exitStrategy === 'flip' ? 'bg-gray-800 text-[var(--text-base)]' : 'text-[var(--text-muted)] bg-transparent'}`}
          >Fix & Flip</button>
          <button 
            onClick={() => setExitStrategy('novation')}
            className={`flex-1 p-2 rounded border-none font-bold cursor-pointer transition-all ${exitStrategy === 'novation' ? 'bg-gray-800 text-[var(--text-base)]' : 'text-[var(--text-muted)] bg-transparent'}`}
          >Novation</button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-0">
          <div>
            <span className="text-sm font-bold text-[var(--text-muted)] mb-1.5 block">Holding Duration:</span>
            <select value={holdingDurationDays} onChange={(e) => setHoldingDurationDays(Number(e.target.value))} className="border-2 border-white rounded-none bg-[#111111] p-2 text-[var(--text-base)] w-full outline-none">
              <option value={30} className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">30 Days</option>
              <option value={90} className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">90 Days</option>
              <option value={180} className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">180 Days</option>
              <option value={270} className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">270 Days</option>
            </select>
          </div>
          <div>
            <span className="text-sm font-bold text-[var(--text-muted)] mb-1.5 block">Capital Source:</span>
            <select value={capitalSource} onChange={(e) => setCapitalSource(e.target.value)} className="border-2 border-white rounded-none bg-[#111111] p-2 text-[var(--text-base)] w-full outline-none">
              <option value="Hard Money" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Hard Money @ 12%</option>
              <option value="Institutional" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Institutional @ 8%</option>
              <option value="Cash" className="bg-[var(--card-bg)] shadow-sm text-[#FFFFFF]">Cash @ 0%</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Zestimate / ARV:</span>
            <div className="smart-input-container" style={{ width: '100%' }}>
              <DollarSign size={14} className="smart-input-icon" />
              <input type="number" value={arv} onChange={(e) => setArv(Number(e.target.value))} className="smart-input" />
            </div>
          </div>
          {exitStrategy === 'wholesale' && (
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-soft)', fontWeight: '600', marginBottom: '6px', display: 'block' }}>Assignment Fee:</span>
              <div className="smart-input-container" style={{ width: '100%' }}>
                <DollarSign size={14} className="smart-input-icon" />
                <input type="number" value={assignmentFee} onChange={(e) => setAssignmentFee(Number(e.target.value))} className="smart-input" />
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>ARV - {multiplier * 100}%:</span>
          <span style={{ fontWeight: '600', color: 'var(--text-dark)' }}>${(arv * multiplier).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>- Est. Repairs (Quick SqFt):</span>
          <span style={{ fontWeight: '600', color: 'var(--accent-secondary)' }}>-${severityEstimate.toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>- Holding Costs ({holdingDurationDays} Days):</span>
          <span style={{ fontWeight: '600', color: 'var(--accent-secondary)' }}>-${Math.round(holdingCosts).toLocaleString()}</span>
        </div>
        {exitStrategy === 'wholesale' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <span style={{ color: 'var(--text-soft)', fontSize: '0.9rem' }}>- Assignment Fee:</span>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontWeight: '600', color: 'var(--accent-secondary)' }}>-${assignmentFee.toLocaleString()}</span>
              {isJVSplit && (
                <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: 'bold', marginTop: '2px' }}>
                  (50% JV Split: Your Take ${(assignmentFee / 2).toLocaleString()})
                </div>
              )}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-dark)', fontSize: '1rem', fontWeight: '700' }}>Max Allowable Offer:</span>
          <span style={{ fontSize: '2.5rem', fontWeight: '900', color: isUnderwater ? '#ef4444' : '#10b981', textShadow: isUnderwater ? '0 4px 12px rgba(239, 68, 68, 0.4)' : '0 4px 12px rgba(16, 185, 129, 0.4)' }}>${mao.toLocaleString()}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
          <span style={{ color: 'var(--text-dark)', fontSize: '1rem', fontWeight: '700' }}>Est. Net to Seller:</span>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: (mao - totalDebt) < 0 ? '#ef4444' : '#10b981' }}>{(mao - totalDebt) < 0 ? '-' : ''}${Math.abs(mao - totalDebt).toLocaleString()}</span>
        </div>
        
        {/* Debt Validation & Pivot Check */}
        {(totalDebt > 0 || askingPrice > 0) && (
          <div style={{ 
            padding: '1rem', 
            borderRadius: '0px', 
            background: isUnderwater ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
            border: isUnderwater ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)',
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-soft)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>Lead Constraints</div>
              {totalDebt > 0 && <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-dark)' }}>Debt: ${totalDebt.toLocaleString()}</div>}
              {askingPrice > 0 && <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-dark)' }}>Asking: ${askingPrice.toLocaleString()}</div>}
            </div>
            
            {isUnderwater ? (
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '0.9rem' }}>
                   {debtExceedsMao ? '⚠️ DEBT EXCEEDS MAO' : '⚠️ ASKING EXCEEDS MAO'}
                </div>
                <div style={{ color: '#dc2626', fontSize: '0.8rem', fontWeight: '600' }}>MUST PIVOT TO CREATIVE OFFER</div>
              </div>
            ) : (
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>✓ MAO CLEARS TARGETS</div>
                <div style={{ color: '#059669', fontSize: '0.8rem', fontWeight: '600' }}>CASH OFFER IS VIABLE</div>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
