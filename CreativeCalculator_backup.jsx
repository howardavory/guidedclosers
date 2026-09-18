'use client';

import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { BrainCircuit, DollarSign, ChevronDown } from 'lucide-react';

export default function CreativeCalculator({ globalArv, updateGlobalArv }) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isEntryFeeCollapsed, setIsEntryFeeCollapsed] = useState(true);
  const { masterLead } = useStore();
  const financialEngine = masterLead?.financialEngine || {};
  const propertyDetails = masterLead?.propertyDetails || {};

  const repairs = financialEngine.repairs || 0;
  
  const actualArv = globalArv || financialEngine.arv || propertyDetails.zestimate || 0;
  const [mortgageBalance, setMortgageBalance] = useState(150000);
  const [piti, setPiti] = useState(1200);
  const [estRent, setEstRent] = useState(2000);
  const [cashToSeller, setCashToSeller] = useState(5000);
  const [underlyingInterest, setUnderlyingInterest] = useState(3.5);

  const closingCosts = 8000;
  
  const totalEntryFee = cashToSeller + repairs + closingCosts;
  const arvValue = parseFloat(actualArv.toString().replace(/[^0-9.]/g, '')) || 0;
  const entryFeePercentage = arvValue > 0 ? ((totalEntryFee / arvValue) * 100) : 0;
  const monthlyCashFlow = estRent - piti;

  const isGoodEntry = entryFeePercentage <= 20;
  const isGoodCashFlow = monthlyCashFlow >= 250;
  
  const isStrongDeal = isGoodEntry && isGoodCashFlow;
  const isDeadDeal = entryFeePercentage > 25 || monthlyCashFlow <= 100;

  return (
    <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] mb-6 transition-all duration-300 relative font-sans">
      <div 
        className="bg-black flex items-center justify-between cursor-pointer p-4 relative overflow-hidden transition-transform active:scale-[0.98]"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="absolute top-0 bottom-0 right-0 w-3/5 bg-[#A855F7] transform skew-x-[-25deg] origin-bottom translate-x-12"></div>
        
        <div className="flex items-center gap-3 relative z-10">
          <BrainCircuit size={28} color="#FFF" />
          <h3 className="font-bangers text-3xl text-white tracking-widest uppercase italic" style={{ textShadow: '3px 3px 0px #000' }}>Creative Sub-To Calc</h3>
        </div>
        
        <div className="relative z-10">
          <ChevronDown size={32} className={`transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} color="#FFF" />
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-6 flex flex-col gap-6 relative z-10 border-t-4 border-black">
          <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div>
          <label className="text-black font-black uppercase text-sm mb-2 drop-shadow-md block">ARV (Est. Value)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black"><DollarSign size={18} /></span>
            <input 
              type="number" 
              value={arvValue} 
              onChange={e => updateGlobalArv ? updateGlobalArv(e.target.value) : null} 
              className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_#000] pl-8 pr-3 py-3 text-black font-bold text-lg outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#000] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-black font-black uppercase text-sm mb-2 drop-shadow-md block">Existing Mtg Balance</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black"><DollarSign size={18} /></span>
            <input 
              type="number" 
              value={mortgageBalance} 
              onChange={e => setMortgageBalance(Number(e.target.value))} 
              className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_#000] pl-8 pr-3 py-3 text-black font-bold text-lg outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#000] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-black font-black uppercase text-sm mb-2 drop-shadow-md block">Current PITI / Mo</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black"><DollarSign size={18} /></span>
            <input 
              type="number" 
              value={piti} 
              onChange={e => setPiti(Number(e.target.value))} 
              className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_#000] pl-8 pr-3 py-3 text-black font-bold text-lg outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#000] transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-black font-black uppercase text-sm mb-2 drop-shadow-md block">Est. Market Rent</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black"><DollarSign size={18} /></span>
            <input 
              type="number" 
              value={estRent} 
              onChange={e => setEstRent(Number(e.target.value))} 
              className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_#000] pl-8 pr-3 py-3 text-black font-bold text-lg outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#000] transition-all"
            />
          </div>
        </div>
      </div>

      <div className="border-t-4 border-black pt-4 mb-4 relative z-10">
        <div 
          className="bg-[#00FFFF] flex items-center justify-between cursor-pointer p-3 border-4 border-black relative overflow-hidden transition-transform active:scale-[0.98] mb-4"
          onClick={() => setIsEntryFeeCollapsed(!isEntryFeeCollapsed)}
        >
          <h4 className="text-black font-bangers text-2xl tracking-widest uppercase mb-0 drop-shadow-[2px_2px_0px_#fff]">The Entry Fee</h4>
          <ChevronDown size={28} className={`transition-transform duration-300 ${isEntryFeeCollapsed ? '-rotate-90' : 'rotate-0'}`} color="#000" />
        </div>

        {!isEntryFeeCollapsed && (
          <div className="animate-slideIn">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-black font-black uppercase text-sm mb-2 drop-shadow-md block">Cash to Seller</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-black font-black"><DollarSign size={18} /></span>
              <input 
                type="number" 
                value={cashToSeller} 
                onChange={e => setCashToSeller(Number(e.target.value))} 
                className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_#000] pl-8 pr-3 py-3 text-black font-bold text-lg outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#000] transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-black font-black uppercase text-sm mb-2 drop-shadow-md block">Underlying Interest</label>
            <div className="relative">
              <input 
                type="number" 
                step="0.1"
                value={underlyingInterest} 
                onChange={e => setUnderlyingInterest(Number(e.target.value))} 
                className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_#000] pl-4 pr-8 py-3 text-black font-bold text-lg outline-none focus:translate-y-[2px] focus:shadow-[2px_2px_0px_#000] transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-black font-black">%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 border-4 border-dashed border-black bg-gray-100 p-4 transform -rotate-1 relative z-10">
        <div className="flex justify-between text-sm mb-2 font-bold text-gray-800 uppercase">
          <span>Est. Repairs:</span>
          <span>${repairs.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mb-2 font-bold text-gray-800 uppercase">
          <span>Closing Costs:</span>
          <span>${closingCosts.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm mb-2 font-bold text-gray-800 uppercase">
          <span>Entry Fee Percentage:</span>
          <span className={entryFeePercentage > 20 ? "text-[#FF0055]" : "text-[#00E5FF]"}>{entryFeePercentage.toFixed(1)}%</span>
        </div>
        <div className="flex justify-between text-sm mb-4 font-bold text-gray-800 uppercase">
          <span>Monthly Cash Flow:</span>
          <span className={monthlyCashFlow < 250 ? "text-[#FF0055]" : "text-[#00E5FF]"}>${monthlyCashFlow}/mo</span>
        </div>

        <div className="border-t-4 border-black pt-4 mt-2">
          {isStrongDeal ? (
            <div className="bg-[#00E676] border-4 border-black shadow-[4px_4px_0px_#000] p-3 text-center transform scale-105">
              <span className="text-black font-bangers text-3xl tracking-widest" style={{ textShadow: '2px 2px 0px #fff' }}>STRONG DEAL!</span>
            </div>
          ) : isDeadDeal ? (
            <div className="bg-[#FF0055] border-4 border-black shadow-[4px_4px_0px_#000] p-3 text-center transform rotate-2">
              <span className="text-white font-bangers text-3xl tracking-widest" style={{ textShadow: '2px 2px 0px #000' }}>DEAD DEAL</span>
            </div>
          ) : (
            <div className="bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_#000] p-3 text-center">
              <span className="text-black font-bangers text-3xl tracking-widest" style={{ textShadow: '2px 2px 0px #fff' }}>MARGINAL DEAL</span>
            </div>
          )}
          </div>
        </div>
          </div>
        )}
        </div>
        </div>
      )}
    </div>
  );
}
