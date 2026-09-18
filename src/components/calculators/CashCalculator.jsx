'use client';

import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { Calculator, DollarSign, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

export default function CashCalculator({ askingPrice = 0, globalArv, updateGlobalArv, solarAssumable, solarMonthlyPayment, solarPayoffAmount }) {
  const { masterLead, updateFinancialEngine, liveFormData, callScriptUpdateForm: updateForm } = useStore();
  const propertyDetails = masterLead?.propertyDetails || {};
  const financialEngine = masterLead?.financialEngine || {};
  const financials = masterLead?.financials || {};
  const formData = liveFormData || masterLead?.formData || {};
  const [localArv, setLocalArv] = useState(formData?.arv || '');
  // Initialize with 30000 if no fee is saved yet
  const [localAssignmentFee, setLocalAssignmentFee] = useState(
    formData?.assignmentFee !== undefined && formData?.assignmentFee !== '' 
      ? formData.assignmentFee 
      : 30000
  );

  // Keep local state synced if global state changes externally
  useEffect(() => {
    setLocalArv(formData?.arv || '');
  }, [formData?.arv]);

  // Sync if global state changes, but respect the 30000 baseline
  useEffect(() => {
    if (formData?.assignmentFee !== undefined && formData?.assignmentFee !== '') {
      setLocalAssignmentFee(formData.assignmentFee);
    }
  }, [formData?.assignmentFee]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localArv !== formData?.arv && updateForm) {
        updateForm('arv', localArv);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localArv, formData?.arv, updateForm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localAssignmentFee !== formData?.assignmentFee && updateForm) {
        updateForm('assignmentFee', localAssignmentFee);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [localAssignmentFee, formData?.assignmentFee, updateForm]);

  const isTenant = formData.occupancy === 'Tenant Occupied';
  // ---------------------------------------------------
  // SURGICAL DEBT ROUTING (Live Pillar 4 Keystrokes)
  // ---------------------------------------------------
  const manualFirstMortgage = parseFloat(String(formData?.firstMortgageBalance || '0').replace(/[^0-9.]/g, '')) || 0;
  const manualSecondMortgage = parseFloat(String(formData?.secondMortgageBalance || formData?.helocBalance || '0').replace(/[^0-9.]/g, '')) || 0;
  const apiDebt = financials.totalDebt || (propertyDetails.mortgages && propertyDetails.mortgages.length > 0 ? propertyDetails.mortgages[0].amount : 0) || 0;
  
  // Prioritize live typing. If they type a mortgage, use it. If not, fallback to API.
  const baseDebt = (manualFirstMortgage > 0 || manualSecondMortgage > 0) ? (manualFirstMortgage + manualSecondMortgage) : apiDebt;

  const arrears = parseFloat(String(formData?.arrearsAmount || '0').replace(/[^0-9.]/g, '')) || 0;
  const solarPayoff = formData.solarAssumable === 'No (Must Payoff)' ? (parseFloat(solarPayoffAmount) || 0) : 0;
  const totalLiens = Object.values(formData.lienAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const totalFines = Object.values(formData.fineAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  
  const absoluteTotalDebt = baseDebt + arrears + solarPayoff + totalLiens + totalFines;
  const totalDebt = absoluteTotalDebt;
  // ---------------------------------------------------
  const parsedAsking = parseFloat(askingPrice?.toString()?.replace(/[^0-9.]/g, '')) || 0;

  const actualArv = localArv || globalArv || financialEngine.arv || propertyDetails.zestimate || 0;

  const repairs = financialEngine.repairs || 0;
  
  const evictionPenalty = 15000;

  const parsedSolarPayment = parseFloat(solarMonthlyPayment) || 0;
  let effectiveSolarMonthly = parsedSolarPayment;
  if (solarAssumable === 'Not Assumable') {
    effectiveSolarMonthly = 0;
  }

  const multiplier = 0.79;
  let arvValue = parseFloat(actualArv.toString().replace(/[^0-9.]/g, '')) || 0;
  
  let computedAssignmentFee = parseFloat(localAssignmentFee) || 0;
  let mao = 0;

  let landlordUtilitiesTotal = (parseFloat(formData.utilWater)||0) + (parseFloat(formData.utilSewer)||0) + (parseFloat(formData.utilTrash)||0) + (parseFloat(formData.utilGas)||0) + (parseFloat(formData.utilElectric)||0) + (parseFloat(formData.landlordUtilityCost)||0);
  let section8Total = parseFloat(formData.section8Payment) || 0;
  
  // Apply holding costs adjustment based on inheriting the tenant for an estimated 6 month period
  let holdingCostsAdjustment = isTenant ? ((section8Total - landlordUtilitiesTotal) * 6) : 0;

  let fireDamagePenalty = 0;
  let isTearDown = false;
  if (formData.redFlagFire === 'Cosmetic / Smoke Only') {
     const sqft = parseFloat(propertyDetails.buildingSize || formData.sqft || 1500);
     fireDamagePenalty = sqft * 50;
  } else if (formData.redFlagFire === 'Structural / Framing Damage') {
     isTearDown = true;
  }

  if (formData.isPriceLocked && formData.lockedPrice) {
    const lockedPriceNum = parseFloat(formData.lockedPrice.toString().replace(/[^0-9.]/g, '')) || 0;
    mao = lockedPriceNum;
    computedAssignmentFee = (arvValue * multiplier) - repairs - totalLiens - solarPayoff - lockedPriceNum + holdingCostsAdjustment - fireDamagePenalty;
  } else {
    mao = (arvValue * multiplier) - repairs - totalLiens - solarPayoff - (parseFloat(localAssignmentFee) || 0) + holdingCostsAdjustment - fireDamagePenalty;
  }
  
  if (isTearDown) {
    // 100% ARV penalty (pushing the MAO to Land Value Only). Assume Land Value is 25% of ARV.
    mao = arvValue * 0.25;
  }
  
  const debtExceedsMao = totalDebt > mao && totalDebt > 0;
  const askingExceedsMao = parsedAsking > mao && parsedAsking > 0;
  const isUnderwater = debtExceedsMao || askingExceedsMao;

  useEffect(() => {
    updateFinancialEngine({ arv: arvValue, mao: mao > 0 ? mao : 0, assignmentFee: computedAssignmentFee });
  }, [actualArv, mao, updateFinancialEngine, arvValue, computedAssignmentFee]);

  return (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 p-2 text-xs font-['Josefin_Sans'] w-full">
    
    <div className="flex flex-col gap-2 bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--card-border)] rounded-xl p-3 relative z-10">
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">ARV (After Repair Value)</label>
        <input 
          type="number" 
          value={localArv} 
          onChange={(e) => setLocalArv(e.target.value)} 
          className="w-full bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-lg p-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-sm outline-none focus:border-[#E5C158]"
        />
      </div>
      <div className="flex flex-col flex-1">
        <label className="text-[#E5C158] font-extrabold text-[9px] uppercase tracking-widest block mb-1">
          {formData.isPriceLocked ? 'Locked Assignment Fee' : 'Target Assignment Fee'}
        </label>
        <input 
          type="number" 
          value={formData.isPriceLocked ? computedAssignmentFee : localAssignmentFee} 
          onChange={(e) => !formData.isPriceLocked && setLocalAssignmentFee(e.target.value)} 
          disabled={formData.isPriceLocked}
          className="w-full bg-[var(--card-bg)] shadow-sm border border-[var(--card-border)] rounded-lg p-2 text-[#FFFFFF] placeholder-[#777777] font-semibold text-sm outline-none focus:border-[#E5C158]"
        />
      </div>
    </div>

    <div className="bg-[var(--card-bg)]/90 backdrop-blur-md border border-[var(--card-border)] rounded-xl p-3 relative z-10 flex flex-col justify-end">
      <div className="flex justify-between text-[#FFFFFF] font-bold uppercase mb-1">
        <span>ARV - 21%:</span>
        <span className="text-blue-600">${(arvValue * multiplier).toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-[#FFFFFF] font-bold uppercase mb-1">
        <span>Est. Repairs:</span>
        <span className="text-red-600">-${repairs.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-[#FFFFFF] font-bold uppercase border-b border-[var(--card-border)] pb-2 mb-2">
        <span>{formData.isPriceLocked ? 'Locked Assignment:' : 'Assignment Fee:'}</span>
        <span className={formData.isPriceLocked ? "text-[#D4AF37] font-black" : "text-red-600"}>
          {formData.isPriceLocked ? '' : '-'}${computedAssignmentFee.toLocaleString()}
        </span>
      </div>
      
      {effectiveSolarMonthly > 0 && (
        <div className="flex justify-between items-center w-full gap-2">
          <span className="font-bold text-[#FFFFFF] uppercase">Assumed Solar Lease:</span>
          <span className="font-black text-[#E74C3C]">
             - ${effectiveSolarMonthly.toLocaleString()}/mo
          </span>
        </div>
      )}
    </div>

    <div className="bg-transparent border border-[var(--card-border)] rounded-xl p-3 relative z-10 flex flex-col justify-center">
      {!isTenant ? (
        <>
          <div className="bg-[var(--card-bg)] shadow-sm/80 border border-[var(--card-border)] rounded-lg p-2 flex flex-col justify-center items-center gap-1">
            <span className="text-[10px] font-bold text-[#FFFFFF] uppercase">Max Allowable Offer (MAO)</span>
            <span className="text-xl font-black text-[#E5C158]">${Math.round(mao > 0 ? mao : 0).toLocaleString()}</span>
          </div>
          <div className="flex flex-col items-center justify-center mt-2">
            <span className="text-[10px] font-black text-[#FFFFFF] uppercase">Est. Net to Seller (After Debt)</span>
            <span className={`text-base font-black ${(mao - totalDebt) < 0 ? 'text-red-600' : 'text-[#00FF66]'}`}>
              {(mao - totalDebt) < 0 ? '-' : ''}${Math.abs(Math.round(mao - totalDebt)).toLocaleString()}
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="bg-[var(--card-bg)] shadow-sm/80 border border-[var(--card-border)] rounded-lg p-2 mb-1 flex justify-between items-center">
            <span className="text-[9px] font-bold text-[#FFFFFF] uppercase">MAO - VACANT:</span>
            <span className="text-sm font-bold text-[#FFFFFF]">${Math.round(mao > 0 ? mao : 0).toLocaleString()}</span>
          </div>
          <div className="bg-[var(--card-bg)] shadow-sm/80 border border-[var(--card-border)] rounded-lg p-2 flex justify-between items-center">
            <span className="text-[9px] font-bold text-[#FFFFFF] uppercase">MAO - INHERIT TENANT:</span>
            <span className="text-sm font-bold text-[#FFFFFF]">${Math.round((mao - evictionPenalty) > 0 ? (mao - evictionPenalty) : 0).toLocaleString()}</span>
          </div>
        </>
      )}
    </div>
  </div>
);
}