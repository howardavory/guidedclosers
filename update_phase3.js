const fs = require('fs');
const content = `
'use client';

import React, { useEffect, useMemo } from 'react';
import useStore from '@/store/useStore';
import { Hammer } from 'lucide-react';
import clsx from 'clsx';

export default function RepairsCalculator({ formData = {} }) {
  const { updateFinancialEngine } = useStore();

  const sqft = Number(formData.sqft) || 0;
  
  const calculatedTotalRepairs = useMemo(() => {
    let repairs = 0;
    
    // HVAC
    const sfHVAC = String(formData.sfHVAC || '');
    const hvacAge = String(formData.hvacAge || '');
    if (sfHVAC.includes('Needs Servicing')) {
      repairs += 1500;
    } else if (sfHVAC.includes('Broken / Failed')) {
      repairs += 8000;
    } else if (hvacAge === 'Window Units') {
      repairs += 8000 + (sqft * 5);
    }
    
    // Electrical
    const sfElectrical = String(formData.sfElectrical || '');
    if (sfElectrical.includes('Panel Upgrade')) {
      repairs += 3500;
    } else if (sfElectrical.includes('Full Rewire')) {
      repairs += sqft * 5;
    }
    
    // Plumbing
    const sfPlumbing = String(formData.sfPlumbing || '');
    if (sfPlumbing.includes('Active Leaks')) {
      repairs += 2500;
    } else if (sfPlumbing.includes('Full Repipe')) {
      repairs += sqft * 5;
    }
    
    // Water Heater
    const sfWaterHeater = String(formData.sfWaterHeater || '');
    if (sfWaterHeater.includes('5-10 YEARS')) {
      repairs += 1000;
    } else if (sfWaterHeater.includes('10+ YEARS')) {
      repairs += 2000;
    }
    
    // Exterior
    const extCondition = String(formData.exteriorCondition || '');
    if (extCondition.includes('Needs Paint/Stucco')) {
      repairs += 3500;
    } else if (extCondition.includes('Heavy Rot')) {
      repairs += 8500;
    }
    
    const winCondition = String(formData.windowCondition || '');
    if (winCondition.includes('Single Pane')) {
      repairs += 5000;
    }
    
    // Wet Spaces
    const kitchenCondition = String(formData.kitchenCondition || formData.cosmeticsKitchen || '');
    if (kitchenCondition.includes('Dated')) {
      repairs += 2500;
    } else if (kitchenCondition.includes('Gut')) {
      repairs += 7500;
    }
    
    // Baths loop
    const bathsCount = Number(formData.baths ? formData.baths.replace(/[^0-9.]/g, '') : 0);
    const bathData = formData.cosmeticsBathsData || {};
    // We check both the exact \`bath[i]Condition\` string if it exists or use \`cosmeticsBathsData\`
    for (let i = 1; i <= Math.ceil(bathsCount || 0); i++) {
      const bathCond = String(formData[\`bath\${i}Condition\`] || bathData[i-1] || '');
      if (bathCond.includes('Dated')) {
        repairs += 2500;
      } else if (bathCond.includes('Gut')) {
        repairs += 7500;
      }
    }
    // Also cover fallback if baths count isn't specified but data exists
    if (!bathsCount && Object.keys(bathData).length > 0) {
      Object.values(bathData).forEach(bathCond => {
        const cond = String(bathCond);
        if (cond.includes('Dated')) {
          repairs += 2500;
        } else if (cond.includes('Gut')) {
          repairs += 7500;
        }
      });
    }
    
    // Fire Damage
    const redFlagFire = String(formData.redFlagFire || '');
    if (redFlagFire.includes('Cosmetic / Smoke Only')) {
      repairs += (sqft * 45);
    } else if (redFlagFire.includes('Structural / Framing Damage')) {
      repairs += (sqft * 100);
    }
    
    // Unpermitted Spaces
    const unpermittedTypes = formData.unpermittedTypes || [];
    repairs += (unpermittedTypes.length * 8500);
    
    return repairs;
  }, [formData, sqft]);

  const totalRepairs = calculatedTotalRepairs;

  useEffect(() => {
    updateFinancialEngine({ repairs: totalRepairs });
  }, [totalRepairs, updateFinancialEngine]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-2 font-['Josefin_Sans'] text-xs">
      {/* SQFT & Summary Box */}
      <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_5px_15px_rgba(0,0,0,0.9)] rounded-xl p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 border-b border-[#333333] pb-2 mb-1">
          <Hammer size={16} className="text-[#FFFFFF]" />
          <h3 className="text-sm font-bold text-[#FFFFFF] tracking-tight">Repairs Engine</h3>
        </div>
        <div>
          <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Property SQFT</label>
          <div className="text-[#FFFFFF] font-bold text-sm">{sqft.toLocaleString()}</div>
        </div>
        <div>
          <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">System Method</label>
          <div className="text-[#FFFFFF] font-bold text-sm">Omniscient Mode</div>
        </div>
      </div>

      {/* Breakdown Box (simplified for space) */}
      <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_5px_15px_rgba(0,0,0,0.9)] rounded-xl p-3 flex flex-col justify-center">
        <div className="text-[10px] font-bold text-[#E5C158] uppercase mb-1 border-b border-[#333333] pb-1">Cost Breakdown Applied</div>
        <div className="text-xs font-bold text-[#FFFFFF] mt-1">
          Calculations synced directly from Pillar 2 inputs (HVAC, Electrical, Plumbing, Exterior, Cosmetics, Fire & Permitting).
        </div>
      </div>

      {/* Total Box */}
      <div className="bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_5px_15px_rgba(0,0,0,0.9)] rounded-xl p-3 flex flex-col justify-center items-center text-center">
        <span className="text-[10px] font-bold text-[#E5C158] uppercase tracking-widest mb-1">Total Repairs</span>
        <span className="text-2xl font-black text-[#FFFFFF]">
          \${totalRepairs.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/calculators/RepairsCalculator.jsx', content);
console.log('RepairsCalculator.jsx rewritten.');
