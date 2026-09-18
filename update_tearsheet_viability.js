const fs = require('fs');
let code = fs.readFileSync('src/components/documents/TearSheet.jsx', 'utf8');

// 1. Replace the entire scoring logic block (Phase 1)
const oldScoringLogic = `  // Calculate Deal Viability Score
  const getViabilityData = () => {
    let score = 0;
    let creativePts = 0;
    let distressPts = 0;

    // 1. FINANCIAL SPREAD (Max 40 pts)
    const askingPrice = parseFloat(String(formData?.askingPrice || '0').replace(/[^0-9.]/g, ''));
    const mao = masterLead?.financialEngine?.mao || 0;
    if (askingPrice > 0 && mao > 0) {
      if (askingPrice <= mao) score += 40;
      else if (askingPrice <= mao * 1.10) score += 20;
    }

    // 2. DISTRESS & MOTIVATION (Max 25 pts - Non-Stacking)
    const condStr = (String(formData?.kitchenCondition || '') + ' ' + ((formData?.bath1Condition || "") + " " + (formData?.bath2Condition || "")).trim()).toUpperCase();
    const roofStr = String(formData?.sfRoof || '').toUpperCase();
    const plumbingStr = String(formData?.sfPlumbing || '').toUpperCase();
    const elecStr = String(formData?.sfElectrical || '').toUpperCase();
    const hvacStr = String(formData?.sfHVAC || '').toUpperCase();
    const septicStr = String(formData?.septicCondition || '').toUpperCase();
    const flags = formData?.majorRedFlags || [];

    const heavyDistress = 
      condStr.includes('HEAVY REHAB') || 
      roofStr.includes('TEAR-OFF') || 
      plumbingStr.includes('REPIPE') || plumbingStr.includes('ACTIVE LEAKS') ||
      elecStr.includes('REWIRE') || elecStr.includes('KNOWN ISSUES') ||
      flags.length > 0;

    const livableDistress = 
      condStr.includes('DATED') || 
      roofStr.includes('OVERLAY') || 
      hvacStr.includes('UNIT ONLY') || hvacStr.includes('FULL SYSTEM') ||
      plumbingStr.includes('MINOR LEAKS') || plumbingStr.includes('AGING') ||
      elecStr.includes('PANEL UPGRADE') || elecStr.includes('ORIGINAL PANEL') ||
      septicStr.includes('UNKNOWN') || septicStr.includes('NEVER PUMPED') ||
      formData?.plumbingAge === 'Original / 30+' || 
      formData?.electricalAge === 'Original / 30+';
    
    if (heavyDistress) distressPts = 25;
    else if (livableDistress) distressPts = 15;
    score += distressPts;

    // 3. TIMELINE & LOGISTICS (Max 20 pts)
    const time = String(formData?.timelineType || formData?.timeline || '').toUpperCase();
    if (time.includes('ASAP')) score += 20;
    else if (time.includes('STANDARD') || time.includes('30')) score += 10;
    else if (time.includes('POST-EVICTION') || time.includes('60-90 DAYS')) score += 10;

    // 4. CREATIVE POTENTIAL (Max 15 pts)
    const ownership = String(formData?.ownershipProfile || '').toUpperCase();
    const arrears = parseFloat(String(formData?.arrearsAmount || '0').replace(/[^0-9.]/g, ''));
    if (ownership.includes('FREE & CLEAR')) creativePts = 15;
    else if (ownership.includes('EXISTING MORTGAGE') && arrears < 10000) creativePts = 10;
    score += creativePts;

    // 5. PENALTIES
    if (formData?.tenantStatus?.includes('Eviction Needed')) {
      score -= 10;
    }
    if (flags.length > 0) {
      score -= 20;
    }

    return { score: Math.min(Math.max(score, 0), 100), creativePts, distressPts, heavyDistress, livableDistress };
  };

  const { score: dealScore, creativePts, distressPts, heavyDistress, livableDistress } = getViabilityData();
  
  let intelBrief = "";
  if (dealScore >= 80) {
    intelBrief = "HOME RUN: Deep equity spread with high seller distress. Instant assignment potential. Blast to VIP Cash Buyers.";
  } else if (dealScore >= 50) {
    if (creativePts >= 10) intelBrief = "CREATIVE PLAY: Cash spread is tight, but debt structure is prime for a Sub-To or Seller Finance pivot.";
    else intelBrief = "HEAVY LIFT: Major CapEx required. Negotiate asking price down to match repair costs.";
  } else {
    intelBrief = "DEAD LEAD: Turnkey condition with retail expectations. Put on long-term drip campaign.";
  }

  let scoreColor = '#E74C3C'; // 0-49 Red
  if (dealScore >= 80) scoreColor = '#D4AF37'; // 80-100 Neon Green
  else if (dealScore >= 50) scoreColor = '#FFFF00'; // 50-79 Neon Yellow`;

const newScoringLogic = `  // Dynamic Viability Scoring Engine
  const financialEngine = masterLead?.financialEngine || {};
  
  const calculateViability = () => {
    let score = 10; // Base score
    
    // 1. Motivation (+ up to 30 points)
    if (formData.motivationLevel === 'High' || formData.painPoints?.length >= 2) score += 30;
    else if (formData.motivationLevel === 'Medium' || formData.painPoints?.length === 1) score += 15;

    // 2. Timeline (+ up to 20 points)
    if (formData.timeline === 'ASAP' || formData.timelineType === 'Urgent') score += 20;
    else if (formData.timeline === '1-3 Months') score += 10;

    // 3. Condition / Distress (+ up to 20 points)
    const repairs = financialEngine?.repairs || 0;
    const arv = parseFloat(String(formData.arv).replace(/[^0-9.]/g, '')) || 0;
    if (arv > 0) {
      const repairRatio = repairs / arv;
      if (repairRatio > 0.15) score += 20; // Heavy distress = good for wholesale
      else if (repairRatio > 0.05) score += 10;
    }

    // 4. Financials / Equity (+ up to 20 points)
    const askingPrice = parseFloat(String(formData.askingPrice).replace(/[^0-9.]/g, '')) || 0;
    const mao = financialEngine?.mao || 0;
    if (askingPrice > 0 && mao > 0) {
      if (askingPrice <= mao) score += 20; // Asking at or below MAO is a golden lead
      else if (askingPrice <= (mao * 1.15)) score += 10; // Within negotiation range
    } else if (formData.freeAndClear) {
      score += 15; // Free and clear is highly viable for creative
    }

    return Math.min(100, score);
  };

  const viabilityScore = calculateViability();

  const getViabilityStatus = (score) => {
    if (score >= 75) return { 
      text: "HOT LEAD: DEEP EQUITY OR HIGH MOTIVATION. PUSH FOR IMMEDIATE CLOSE OR ASSIGNMENT.", 
      color: "bg-[#00FF66]/20 text-[#00FF66] border-[#00FF66]/50" 
    };
    if (score >= 45) return { 
      text: "NURTURE LEAD: MARGINAL EQUITY OR TIMELINE. REQUIRES HEAVY FOLLOW-UP OR CREATIVE PIVOT.", 
      color: "bg-[#E5C158]/20 text-[#E5C158] border-[#E5C158]/50" 
    };
    return { 
      text: "DEAD LEAD: TURNKEY CONDITION WITH RETAIL EXPECTATIONS. PUT ON LONG-TERM DRIP CAMPAIGN.", 
      color: "bg-red-500/20 text-red-500 border-red-500/50" 
    };
  };

  const viabilityConfig = getViabilityStatus(viabilityScore);`;

// 2. Replace the UI rendering block (Phase 2)
const oldUIBlock = `              {/* Deal Score */}
              <div>
                <p className="text-[10px] text-[#F5F5F5] font-bold uppercase tracking-widest mb-1 font-bold">Deal Viability Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-3 flex-1 border border-[#333333] rounded-full overflow-hidden bg-gradient-to-br from-[#1E1E1E] via-[#111111] to-[#080808] border border-[#D4AF37]/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_15px_35px_rgba(0,0,0,0.9)] rounded-2xl p-6 text-[#F5F5F5] shadow-inner">
                    <div className="h-full transition-all duration-500 ease-out" style={{ width: \`\${dealScore}%\`, backgroundColor: scoreColor }}></div>
                  </div>
                  <span className={\`text-xs font-bold font-mono px-1 rounded-xl \${dealScore < 50 ? 'bg-[#E74C3C] text-white' : (dealScore >= 80 ? 'bg-[#D4AF37] text-[#F5F5F5]' : 'bg-[#121212] text-[#F5F5F5]')}\`}>\${dealScore}/100</span>
                </div>
                {intelBrief && (
                  <p className="text-sm font-black italic uppercase mt-2 text-[#F5F5F5] leading-tight border-l-4 border-[#333333] pl-2">
                    {intelBrief}
                  </p>
                )}
              </div>`;

const newUIBlock = `              {/* Deal Score */}
<div className="border border-[#333333] rounded-xl p-4 bg-[#0A0A0F]/50 flex flex-col gap-3">
  <h4 className="text-[10px] font-black text-[#A0A0A0] uppercase tracking-widest">Deal Viability Score</h4>
  
  <div className="flex items-center justify-between">
    <div className="flex-1 bg-[#1A1A1A] h-3 rounded-full overflow-hidden border border-[#333333]">
      <div 
        className="h-full transition-all duration-1000 ease-out"
        style={{ 
          width: \`\${viabilityScore}%\`,
          backgroundColor: viabilityScore >= 75 ? '#00FF66' : viabilityScore >= 45 ? '#E5C158' : '#ef4444'
        }}
      />
    </div>
    <span className={clsx(
      "ml-4 font-black text-xs px-2 py-1 rounded-md border",
      viabilityConfig.color
    )}>
      {viabilityScore}/100
    </span>
  </div>

  <p className={clsx("text-xs font-bold italic tracking-wide mt-2", viabilityConfig.color.replace('bg-', '').replace('/20', ''))}>
    {viabilityConfig.text}
  </p>
</div>`;

// 3. Fix the generateTearSheetText references
let updatedCode = code.replace(oldScoringLogic, newScoringLogic);
updatedCode = updatedCode.replace(oldUIBlock, newUIBlock);
updatedCode = updatedCode.replace(`📈 Viability Score: \${dealScore}/100`, `📈 Viability Score: \${viabilityScore}/100`);
updatedCode = updatedCode.replace(`📝 Intel: \${intelBrief}`, `📝 Intel: \${viabilityConfig.text}`);

fs.writeFileSync('src/components/documents/TearSheet.jsx', updatedCode);
console.log('TearSheet.jsx viability engine updated.');
