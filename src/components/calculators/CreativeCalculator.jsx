'use client';

import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { BrainCircuit, DollarSign } from 'lucide-react';
import clsx from 'clsx';

export default function CreativeCalculator({ globalArv, updateGlobalArv, solarAssumable, solarMonthlyPayment }) {
  const { masterLead } = useStore();
  const financialEngine = masterLead?.financialEngine || {};
  const propertyDetails = masterLead?.propertyDetails || {};

  const repairs = financialEngine.repairs || 0;
  
  const actualArv = globalArv || financialEngine.arv || propertyDetails.zestimate || 0;
  const formData = masterLead?.formData || {};
  const financials = masterLead?.financials || {};
  const baseDebt = financials.totalDebt || (propertyDetails.mortgages && propertyDetails.mortgages.length > 0 ? propertyDetails.mortgages[0].amount : 0) || 0;
  const arrears = parseFloat(String(formData?.arrearsAmount || '0').replace(/[^0-9.]/g, '')) || 0;
  const solarPayoff = formData.solarAssumable === 'No (Must Payoff)' ? (parseFloat(masterLead?.formData?.solarPayoffAmount || 0) || 0) : 0;
  const totalLiens = Object.values(formData.lienAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const totalFines = Object.values(formData.fineAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const absoluteTotalDebt = baseDebt + arrears + solarPayoff + totalLiens + totalFines;

  const [mortgageBalance, setMortgageBalance] = useState(absoluteTotalDebt > 0 ? absoluteTotalDebt : 150000);
  const [piti, setPiti] = useState(1200);
  const [estRent, setEstRent] = useState(2000);
  const [cashToSeller, setCashToSeller] = useState(5000);
  const [underlyingInterest, setUnderlyingInterest] = useState(3.5);

  const closingCosts = 8000;
  
  const parsedSolarPayment = parseFloat(solarMonthlyPayment) || 0;
  let effectiveSolarMonthly = parsedSolarPayment;
  if (solarAssumable === 'Not Assumable') {
    effectiveSolarMonthly = 0;
  }
  
  const totalEntryFee = cashToSeller + repairs + closingCosts;
  const arvValue = parseFloat(actualArv.toString().replace(/[^0-9.]/g, '')) || 0;
  const entryFeePercentage = arvValue > 0 ? ((totalEntryFee / arvValue) * 100) : 0;
  
  const grossMonthlyCashFlow = estRent - piti;
  const monthlyCashFlow = estRent - piti - effectiveSolarMonthly; // This is the net

  const isGoodEntry = entryFeePercentage <= 20;
  const isGoodCashFlow = monthlyCashFlow >= 250;
  
  const isStrongDeal = isGoodEntry && isGoodCashFlow;
  const isDeadDeal = entryFeePercentage > 25 || monthlyCashFlow <= 100;

  return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-2 text-xs font-['Josefin_Sans'] w-full">
    
    <div className="flex flex-col gap-2 bg-[var(--card-bg)]/90 border border-[var(--card-border)] rounded-xl p-3">
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">ARV (Est. Value)</label>
        <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
          <span className="text-[#FFFFFF] font-bold mr-1">$</span>
          <input type="number" value={arvValue} onChange={e => updateGlobalArv ? updateGlobalArv(e.target.value) : {}} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Total Debt</label>
        <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
          <span className="text-[#FFFFFF] font-bold mr-1">$</span>
          <input type="number" value={mortgageBalance} onChange={e => setMortgageBalance(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Interest Rate (%)</label>
        <div className="w-full flex items-center justify-between gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
          <input type="number" step="0.1" value={underlyingInterest} onChange={e => setUnderlyingInterest(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
          <span className="text-[#FFFFFF] font-bold">%</span>
        </div>
      </div>
    </div>

    <div className="flex flex-col gap-2 bg-[var(--card-bg)]/90 border border-[var(--card-border)] rounded-xl p-3">
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Monthly PITI</label>
        <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
          <span className="text-[#FFFFFF] font-bold mr-1">$</span>
          <input 
            type="number" 
            value={piti} 
            onChange={e => setPiti(Number(e.target.value))} 
            className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0"
          />
        </div>
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Est. Rent</label>
        <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
          <span className="text-[#FFFFFF] font-bold mr-1">$</span>
          <input 
            type="number" 
            value={estRent} 
            onChange={e => setEstRent(Number(e.target.value))} 
            className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0"
          />
        </div>
      </div>
    </div>

    <div className="bg-transparent border border-[var(--card-border)] rounded-xl p-3 relative z-10 flex flex-col justify-center">
      <div className="flex justify-between text-[#FFFFFF] font-bold uppercase mb-1">
        <span className="text-[10px]">Cash to Seller:</span>
        <span className="text-red-600">${cashToSeller.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-[#FFFFFF] font-bold uppercase mb-1">
        <span className="text-[10px]">Est. Repairs:</span>
        <span className="text-red-600">-${repairs.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-[#FFFFFF] font-bold uppercase border-b border-[var(--card-border)] pb-2 mb-2">
        <span className="text-[10px]">Closing/Fees:</span>
        <span className="text-red-600">-${closingCosts.toLocaleString()}</span>
      </div>

      <div className="bg-[var(--card-bg)] shadow-sm/80 border border-[var(--card-border)] rounded-lg p-2 flex flex-col gap-1">
        <div className="flex justify-between items-center w-full">
          <span className="text-[9px] font-bold text-[#FFFFFF] uppercase">Total Entry Fee:</span>
          <span className="text-sm font-bold text-[#E74C3C]">${totalEntryFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center w-full">
          <span className="text-[9px] font-bold text-[#FFFFFF] uppercase">Monthly Cashflow:</span>
          <span className={`text-sm font-bold ${monthlyCashFlow > 0 ? 'text-[#00E676]' : 'text-[#E74C3C]'}`}>
            ${monthlyCashFlow.toLocaleString()}/mo
          </span>
        </div>
      </div>
    </div>

  </div>
);
}