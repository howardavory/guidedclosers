'use client';

import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { Calculator, DollarSign, ChevronDown } from 'lucide-react';

export default function CashCalculator({ askingPrice = 0, globalArv, updateGlobalArv }) {
  const { masterLead, updateFinancialEngine } = useStore();
  const propertyDetails = masterLead?.propertyDetails || {};
  const financialEngine = masterLead?.financialEngine || {};
  const financials = masterLead?.financials || {};
  const [isCollapsed, setIsCollapsed] = useState(true);

  const totalDebt = financials.totalDebt || (propertyDetails.mortgages && propertyDetails.mortgages.length > 0 ? propertyDetails.mortgages[0].amount : 0) || 0;
  const parsedAsking = parseFloat(askingPrice?.toString()?.replace(/[^0-9.]/g, '')) || 0;

  const [assignmentFee, setAssignmentFee] = useState(35000);

  const actualArv = globalArv || financialEngine.arv || propertyDetails.zestimate || 0;

  const repairs = financialEngine.repairs || 0;

  // Formula: MAO = ARV - 21% - Repairs - Assignment Fee
  // Which is: MAO = (ARV * 0.79) - Repairs - Assignment Fee
  const multiplier = 0.79;
  let arvValue = parseFloat(actualArv.toString().replace(/[^0-9.]/g, '')) || 0;
  
  let mao = (arvValue * multiplier) - repairs - assignmentFee;
  
  const debtExceedsMao = totalDebt > mao && totalDebt > 0;
  const askingExceedsMao = parsedAsking > mao && parsedAsking > 0;
  const isUnderwater = debtExceedsMao || askingExceedsMao;

  useEffect(() => {
    updateFinancialEngine({ arv: arvValue, mao: mao > 0 ? mao : 0 });
  }, [actualArv, mao, updateFinancialEngine, arvValue]);

  return (
    <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] mb-6 transition-all duration-300 relative font-sans">
      <div 
        className="bg-black flex items-center justify-between cursor-pointer p-4 relative overflow-hidden transition-transform active:scale-[0.98]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="absolute top-0 bottom-0 right-0 w-3/5 bg-[#FACC15] transform skew-x-[-25deg] origin-bottom translate-x-12"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <Calculator size={28} color="#FFF" />
          <h3 className="font-bangers text-3xl text-white tracking-widest uppercase italic" style={{ textShadow: '3px 3px 0px #000' }}>Cash Offer Calculator</h3>
        </div>
        
        <div className="relative z-10">
          <ChevronDown size={32} className={`transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} color="#FFF" />
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6 flex flex-col gap-6 relative z-10 border-t-4 border-black">
          <div className="grid grid-cols-2 gap-6 relative z-10">
        <div className="flex flex-col">
          <label className="text-black font-black uppercase text-sm mb-2 drop-shadow-md">ARV (After Repair Value)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black"><DollarSign size={18} /></span>
            <input 
              type="number" 
              value={actualArv} 
              onChange={e => updateGlobalArv ? updateGlobalArv(e.target.value) : null} 
              className="w-full bg-white border-2 border-black border-b-4 border-r-4 shadow-[2px_2px_0px_#000] p-3 pl-8 text-black font-black text-lg focus:bg-yellow-100 focus:outline-none transition-colors"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <label className="text-black font-black uppercase text-sm mb-2 drop-shadow-md">Assignment Fee</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black"><DollarSign size={18} /></span>
            <input 
              type="number" 
              value={assignmentFee} 
              onChange={e => setAssignmentFee(Number(e.target.value))} 
              className="w-full bg-white border-2 border-black border-b-4 border-r-4 shadow-[2px_2px_0px_#000] p-3 pl-8 text-black font-black text-lg focus:bg-yellow-100 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-100 border-2 border-black border-dashed mb-6 relative z-10">
        <div className="flex justify-between text-black font-bold uppercase mb-2">
          <span>ARV - 21%:</span>
          <span className="text-blue-600">${(arvValue * multiplier).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-black font-bold uppercase mb-2">
          <span>Est. Repairs:</span>
          <span className="text-red-600">-${repairs.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-black font-bold uppercase border-b-2 border-black pb-3 mb-3">
          <span>Assignment Fee:</span>
          <span className="text-red-600">-${assignmentFee.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between items-center bg-black text-white p-3 border-2 border-black shadow-[4px_4px_0px_#facc15] -rotate-1">
          <span className="text-xl font-bangers tracking-wide uppercase text-yellow-400">Max Allowable Offer (MAO):</span>
          <span className={`text-3xl font-black ${isUnderwater ? 'text-red-500' : 'text-green-400'}`}>
            ${Math.round(mao > 0 ? mao : 0).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between items-center mt-3 px-2">
          <span className="text-sm font-black text-black uppercase">Est. Net to Seller (After Debt):</span>
          <span className={`text-xl font-black ${(mao - totalDebt) < 0 ? 'text-red-600' : 'text-green-600'}`}>
            {(mao - totalDebt) < 0 ? '-' : ''}${Math.abs(Math.round(mao - totalDebt)).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Debt Validation & Pivot Check styled as a Comic Impact Panel */}
      {(totalDebt > 0 || parsedAsking > 0) && (
        <div className={`mt-6 p-6 border-8 border-black flex justify-between items-center relative overflow-hidden transform ${isUnderwater ? 'bg-[#111111] text-white neon-glow-red animate-pulse skew-x-2' : 'bg-[#00E676] text-black shadow-[6px_6px_0px_#000] -skew-x-2'}`}>
          <div className="absolute inset-0 opacity-20 comic-halftone"></div>
          <div className="relative z-10">
            <div className="text-xs uppercase tracking-widest font-black mb-1 opacity-90 drop-shadow-md">Lead Constraints</div>
            {totalDebt > 0 && <div className="text-lg font-black tracking-tight">Debt: ${totalDebt.toLocaleString()}</div>}
            {parsedAsking > 0 && <div className="text-lg font-black tracking-tight">Asking: ${parsedAsking.toLocaleString()}</div>}
          </div>
          
          <div className="relative z-10 text-right flex flex-col items-end">
            {isUnderwater ? (
              <>
                <div className="font-bangers text-4xl text-[#FF0055] uppercase tracking-widest transform -skew-x-6" style={{ textShadow: '3px 3px 0px #000' }}>
                   {debtExceedsMao ? 'DEBT EXCEEDS MAO!' : 'ASKING EXCEEDS MAO!'}
                </div>
                <div className="bg-[#FF0055] text-white font-black text-sm uppercase px-3 py-1 mt-2 border-2 border-black transform skew-x-3">
                   MUST PIVOT TO CREATIVE!
                </div>
              </>
            ) : (
              <>
                <div className="font-bangers text-3xl uppercase tracking-widest text-black" style={{ textShadow: '2px 2px 0px #FFF' }}>
                   MAO CLEARS TARGETS!
                </div>
                <div className="font-black text-sm uppercase bg-black text-green-400 px-2 py-1 inline-block mt-1 transform skew-x-[-10deg]">
                  CASH OFFER IS VIABLE!
                </div>
              </>
            )}
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}
