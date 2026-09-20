import { useMemo, useEffect } from 'react';
import useStore from '@/store/useStore';

export function useAutoUnderwriter(formData) {
  const setLiveFormData = useStore(state => state.setLiveFormData);

  return useMemo(() => {
    // 1. Extract Base Metrics
    const sqft = Number(formData.sqft) || Number(formData.publicSqft) || 1500;
    const arv = Number((formData.arv || '').toString().replace(/[^0-9.-]+/g, "")) || 0;
    const wholesaleFee = formData.assignmentFee ? Number(formData.assignmentFee) : 30000; // Base assignment fee of $30,000

    // 2. Extract Dynamic Multipliers from Script Toggles
    const roofCost = (Number(formData.roofMult) || 0) * sqft;
    const hvacCost = (Number(formData.hvacMult) || 0) * sqft;
    const plumbCost = (Number(formData.plumbingMult) || 0) * sqft;
    const elecCost = (Number(formData.electricalMult) || 0) * sqft;
    const waterHeaterCost = Number(formData.waterHeaterMult) || 0;

    // 3. Compute Cosmetic Rehab based on Interior Toggles
    let cosmeticCostSqft = 0;
    if (formData.kitchenCondition?.includes('Needs Update')) cosmeticCostSqft += 15;
    if (formData.kitchenCondition?.includes('Full Gut')) cosmeticCostSqft += 30;
    if (formData.bath1Condition?.includes('Full Gut')) cosmeticCostSqft += 10;
    
    // Add heavy rehab baseline if property is distressed
    if (formData.exteriorCondition?.includes('Heavy Dry Rot')) cosmeticCostSqft += 15;
    
    const totalCosmetic = cosmeticCostSqft * sqft;

    // 4. Calculate Final Rehab & MAO
    const totalRehab = roofCost + hvacCost + plumbCost + elecCost + waterHeaterCost + totalCosmetic;
    
    // MAO Formula: (ARV - 21%) - Repairs - Assignment Fee
    let calculatedMAO = arv > 0 ? (arv * 0.79) - totalRehab - wholesaleFee : 0;
    
    // Floor the MAO to prevent negative offers
    if (calculatedMAO < 0 && arv > 0) calculatedMAO = arv * 0.40; // Absolute fire-sale floor

    // Return the live mathematical state
    return {
      totalRehab,
      calculatedMAO: Math.round(calculatedMAO),
      breakdown: { roofCost, hvacCost, plumbCost, elecCost, totalCosmetic }
    };
  }, [
    formData.sqft, formData.publicSqft, formData.arv, 
    formData.roofMult, formData.hvacMult, formData.plumbingMult, 
    formData.electricalMult, formData.waterHeaterMult,
    formData.kitchenCondition, formData.bath1Condition, formData.exteriorCondition
  ]);
}
