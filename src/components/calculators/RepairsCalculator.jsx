'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Wrench, List } from 'lucide-react';
import useStore from '@/store/useStore';

export default function RepairsCalculator({ formData = {} }) {
  const [localSqft, setLocalSqft] = useState(1500);

  // Sync with Pillar 2 SqFt if it exists, but allow manual override
  useEffect(() => {
    const parsedSqft = parseFloat(String(formData.sqft).replace(/[^0-9.]/g, ''));
    if (parsedSqft > 0 && !isNaN(parsedSqft)) {
      setLocalSqft(parsedSqft);
    }
  }, [formData.sqft]);

  // The engine now returns BOTH the total integer and a detailed breakdown array
  const { total: calculatedTotalRepairs, breakdown } = useMemo(() => {
    let total = 0;
    let breakdownList = [];
    const sqft = Number(localSqft) || 0;
    
    const bathsCount = Math.max(1, Math.ceil(parseFloat(String(formData.baths || '1').replace(/[^0-9.]/g, '')) || 1));

    const hasCondition = (field, value) => {
      if (!formData[field]) return false;
      if (Array.isArray(formData[field])) return formData[field].includes(value);
      return formData[field] === value;
    };

    const addCost = (category, cost) => {
      if (cost > 0) {
        total += cost;
        breakdownList.push({ category, cost });
      }
    };

    // 1. ROOF
    if (hasCondition('sfRoof', 'Minor Leaks / Needs Overlay')) addCost('Roof (Overlay)', sqft * 4);
    if (hasCondition('sfRoof', 'Tarped / Full Tear-Off')) addCost('Roof (Tear-Off)', sqft * 8);

    // 2. HVAC
    if (hasCondition('hvacAge', 'Window Units / No Central')) addCost('HVAC (No Central)', 8000 + (sqft * 5));
    if (hasCondition('sfHVAC', 'Needs Servicing')) addCost('HVAC (Servicing)', 1500);
    if (hasCondition('sfHVAC', 'Broken / Failed')) addCost('HVAC (Failed)', 8000);

    // 3. PLUMBING
    if (hasCondition('sfPlumbing', 'Active Leaks')) addCost('Plumbing (Active Leaks)', 2500);
    if (hasCondition('sfPlumbing', 'Full Repipe')) addCost('Plumbing (Full Repipe)', sqft * 5);

    // 4. WATER HEATER
    if (hasCondition('sfWaterHeater', '5-10 YEARS / AGING ($1,000)')) addCost('Water Heater (Aging)', 1000);
    if (hasCondition('sfWaterHeater', '10+ YEARS / DEAD ($2,000)')) addCost('Water Heater (Dead)', 2000);

    // 5. ELECTRICAL
    if (hasCondition('sfElectrical', 'Panel Upgrade')) addCost('Electrical (Panel Upgrade)', 3500);
    if (hasCondition('sfElectrical', 'Full Rewire')) addCost('Electrical (Full Rewire)', sqft * 5);

    // 6. EXTERIOR & WINDOWS
    if (hasCondition('exteriorCondition', 'Needs Paint / Stucco Patch')) addCost('Exterior (Paint)', 3500);
    if (hasCondition('exteriorCondition', 'Heavy Dry Rot / Siding Replacement')) addCost('Exterior (Heavy Rot)', 8500);
    if (hasCondition('windowCondition', 'Original Single-Pane')) addCost('Windows (Single-Pane)', 5000);

    // 7. WET SPACES (Kitchen + Dynamic Baths)
    if (hasCondition('kitchenCondition', 'Dated / Needs Update')) addCost('Kitchen (Update)', 5000);
    if (hasCondition('kitchenCondition', 'Full Gut Needed')) addCost('Kitchen (Full Gut)', 15000);

    for (let i = 1; i <= bathsCount; i++) {
      if (hasCondition(`bath${i}Condition`, 'Dated / Needs Update')) addCost(`Bath ${i} (Update)`, 2500);
      if (hasCondition(`bath${i}Condition`, 'Full Gut Needed')) addCost(`Bath ${i} (Full Gut)`, 7500);
    }

    // 8. POOL
    if (hasCondition('poolCondition', 'Needs Repair')) addCost('Pool (Repair)', 8500);
    if (hasCondition('poolCondition', 'Needs Demo/Fill')) addCost('Pool (Demo/Fill)', 12500);

    // 9. FIRE DAMAGE
    if (hasCondition('redFlagFire', 'Cosmetic / Smoke Only')) addCost('Fire (Cosmetic/Smoke)', sqft * 45);
    if (hasCondition('redFlagFire', 'Structural / Framing Damage')) addCost('Fire (Structural)', sqft * 100);

    // 10. UNPERMITTED SPACES
    const unpermittedCount = Array.isArray(formData.unpermittedTypes) ? formData.unpermittedTypes.length : 0;
    if (unpermittedCount > 0) addCost(`${unpermittedCount}x Unpermitted Space(s)`, unpermittedCount * 8500);

    return { total, breakdown: breakdownList };
  }, [formData, localSqft]);

  // Sync the total back to global state so Cash/Creative MAO can pull it seamlessly
  useEffect(() => {
    useStore.getState().updateFinancialEngine({ repairs: calculatedTotalRepairs });
  }, [calculatedTotalRepairs]);

  return (
    <div className="flex flex-col h-full animate-fadeIn">
      {/* Horizontal Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[35vh] items-start">
        
        {/* Left Column: Control Panel & Dynamic Breakdown */}
        <div className="bg-[var(--bg-base)]/80 border border-[var(--card-border)] rounded-xl p-5 shadow-inner flex flex-col h-full overflow-hidden">
          <div className="flex items-center gap-3 mb-4 border-b border-[var(--card-border)] pb-3 shrink-0">
            <Wrench className="text-[#E5C158]" size={18} />
            <h3 className="text-[var(--text-base)] font-black text-xs uppercase tracking-widest">Rehab & Repairs Engine</h3>
          </div>

          <div className="shrink-0 mb-4">
            <label className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-widest mb-2 block">
              Square Footage (Auto-Synced or Override)
            </label>
            <div className="flex items-center gap-3 bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-xl px-4 py-2 transition-all">
              <input 
                type="number" 
                value={localSqft}
                onChange={(e) => setLocalSqft(e.target.value)}
                className="w-full bg-transparent text-[var(--text-base)] font-black text-xl outline-none"
              />
              <span className="text-[var(--text-muted)] font-bold text-xs uppercase tracking-widest">SQFT</span>
            </div>
          </div>
          
          {/* Dynamic Ledger Breakdown */}
          <div className="flex-1 overflow-y-auto custom-scrollbar bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 border-b border-[var(--card-border)] pb-2 sticky top-0 bg-[var(--card-bg)] z-10">
              <List size={12} className="text-[#E5C158]" />
              <span className="text-[var(--text-base)] font-bold text-[10px] uppercase tracking-widest">Line-Item Breakdown</span>
            </div>
            {breakdown.length === 0 ? (
              <div className="text-[#555555] text-[10px] italic font-semibold pt-2">No major repairs identified in Pillar 2.</div>
            ) : (
              <ul className="space-y-1.5 pt-1">
                {breakdown.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-center text-[10px] border-b border-[#1A1A1A] pb-1 last:border-0">
                    <span className="text-[var(--text-muted)] uppercase font-bold tracking-wider">{item.category}</span>
                    <span className="text-[#E5C158] font-black">${item.cost.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Total Output Display */}
        <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-xl p-8 flex flex-col items-center justify-center text-center h-full">
          <h3 className="text-[#E5C158] font-black text-xs uppercase tracking-widest mb-4 drop-shadow-md">
            Total Estimated Rehab
          </h3>
          <div className="text-5xl lg:text-6xl font-black text-[var(--text-base)] tracking-tighter mb-4" style={{ textShadow: '0 4px 20px rgba(229,193,88,0.2)' }}>
            ${calculatedTotalRepairs.toLocaleString()}
          </div>
          <div className="flex items-center gap-2 bg-[var(--bg-base)]/60 px-5 py-2.5 rounded-lg border border-[var(--card-border)]">
            <span className="text-[var(--text-muted)] font-bold text-[10px] uppercase tracking-widest">Cost Per SqFt:</span>
            <span className="text-[#E5C158] font-black text-sm">${localSqft > 0 ? Math.round(calculatedTotalRepairs / localSqft).toLocaleString() : 0}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
