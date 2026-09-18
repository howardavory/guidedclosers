'use client';
import React, { useState } from 'react';

export default function SellerFinanceCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(250000);
  const [downPayment, setDownPayment] = useState(25000);
  const [interestRate, setInterestRate] = useState(4.0);
  const [amortYears, setAmortYears] = useState(30);
  const [estRent, setEstRent] = useState(2200);
  const [taxesAndIns, setTaxesAndIns] = useState(300);

  const principal = purchasePrice - downPayment;
  
  // Standard Amortization Math
  let monthlyPI = 0;
  if (principal > 0 && amortYears > 0) {
    if (interestRate === 0) {
      monthlyPI = principal / (amortYears * 12);
    } else {
      const r = (interestRate / 100) / 12;
      const n = amortYears * 12;
      monthlyPI = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  const totalPITI = monthlyPI + taxesAndIns;
  const monthlyCashFlow = estRent - totalPITI;
  const closingCosts = 3000;
  const totalEntryFee = downPayment + closingCosts;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-2 text-xs font-['Josefin_Sans'] w-full">
      
      {/* Column 1: The Note */}
      <div className="flex flex-col gap-2 bg-[var(--card-bg)]/90 border border-[var(--card-border)] rounded-xl p-3">
        <div className="flex flex-col flex-1">
          <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Purchase Price</label>
          <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
            <span className="text-[#FFFFFF] font-bold mr-1">$</span>
            <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Down Payment</label>
          <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
            <span className="text-[#FFFFFF] font-bold mr-1">$</span>
            <input type="number" value={downPayment} onChange={e => setDownPayment(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Interest Rate (%)</label>
          <div className="w-full flex items-center justify-between gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
            <input type="number" step="0.1" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
            <span className="text-[#FFFFFF] font-bold">%</span>
          </div>
        </div>
      </div>

      {/* Column 2: Terms & Income */}
      <div className="flex flex-col gap-2 bg-[var(--card-bg)]/90 border border-[var(--card-border)] rounded-xl p-3">
        <div className="flex flex-col flex-1">
          <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Amortization (Years)</label>
          <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
            <input type="number" value={amortYears} onChange={e => setAmortYears(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0 text-center" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Est. Taxes & Ins /mo</label>
          <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
            <span className="text-[#FFFFFF] font-bold mr-1">$</span>
            <input type="number" value={taxesAndIns} onChange={e => setTaxesAndIns(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">Est. Rent</label>
          <div className="w-full flex items-center gap-2 bg-[var(--bg-base)]/80 border border-[var(--card-border)] focus-within:border-[#E5C158] rounded-lg p-2 text-[#FFFFFF] font-semibold transition-all">
            <span className="text-[#FFFFFF] font-bold mr-1">$</span>
            <input type="number" value={estRent} onChange={e => setEstRent(Number(e.target.value))} className="appearance-none bg-transparent text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0" />
          </div>
        </div>
      </div>

      {/* Column 3: Outputs */}
      <div className="bg-transparent border border-[var(--card-border)] rounded-xl p-3 relative z-10 flex flex-col justify-center">
        <div className="flex justify-between text-[#FFFFFF] font-bold uppercase mb-1">
          <span className="text-[10px]">Principal Financed:</span>
          <span className="text-gray-300">${principal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[#FFFFFF] font-bold uppercase mb-1">
          <span className="text-[10px]">Monthly P&I:</span>
          <span className="text-gray-300">${monthlyPI.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
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
            <span className="text-[9px] font-bold text-[#FFFFFF] uppercase">Net Cashflow:</span>
            <span className={`text-sm font-bold ${monthlyCashFlow > 0 ? 'text-[#00E676]' : 'text-[#E74C3C]'}`}>
              ${monthlyCashFlow.toLocaleString(undefined, {maximumFractionDigits:0})}/mo
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
