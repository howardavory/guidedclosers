const fs = require('fs');

// PATCH CASH CALCULATOR
let cash = fs.readFileSync('src/components/calculators/CashCalculator.jsx', 'utf8');

// Replace debt calculation
const oldDebtCalc = `  const isTenant = formData.occupancy === 'Tenant Occupied';
  const baseDebt = financials.totalDebt || (propertyDetails.mortgages && propertyDetails.mortgages.length > 0 ? propertyDetails.mortgages[0].amount : 0) || 0;
  const solarPayoff = parseFloat(solarPayoffAmount) || 0;
  const totalDebt = baseDebt + solarPayoff;
  const parsedAsking = parseFloat(askingPrice?.toString()?.replace(/[^0-9.]/g, '')) || 0;`;

const newDebtCalc = `  const isTenant = formData.occupancy === 'Tenant Occupied';
  const baseDebt = financials.totalDebt || (propertyDetails.mortgages && propertyDetails.mortgages.length > 0 ? propertyDetails.mortgages[0].amount : 0) || 0;
  const arrears = parseFloat(String(formData?.arrearsAmount || '0').replace(/[^0-9.]/g, '')) || 0;
  const solarPayoff = formData.solarAssumable === 'No (Must Payoff)' ? (parseFloat(solarPayoffAmount) || 0) : 0;
  const totalLiens = Object.values(formData.lienAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const totalFines = Object.values(formData.fineAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const absoluteTotalDebt = baseDebt + arrears + solarPayoff + totalLiens + totalFines;
  const totalDebt = absoluteTotalDebt;
  const parsedAsking = parseFloat(askingPrice?.toString()?.replace(/[^0-9.]/g, '')) || 0;`;

cash = cash.replace(oldDebtCalc, newDebtCalc);

// Replace MAO calculation
cash = cash.replace(
  `mao = (arvValue * multiplier) - repairs - (parseFloat(localAssignmentFee) || 0) + holdingCostsAdjustment - fireDamagePenalty;`,
  `mao = (arvValue * multiplier) - repairs - totalLiens - solarPayoff - (parseFloat(localAssignmentFee) || 0) + holdingCostsAdjustment - fireDamagePenalty;`
);

cash = cash.replace(
  `computedAssignmentFee = (arvValue * multiplier) - repairs - lockedPriceNum + holdingCostsAdjustment - fireDamagePenalty;`,
  `computedAssignmentFee = (arvValue * multiplier) - repairs - totalLiens - solarPayoff - lockedPriceNum + holdingCostsAdjustment - fireDamagePenalty;`
);

fs.writeFileSync('src/components/calculators/CashCalculator.jsx', cash);
console.log('CashCalculator updated.');

// PATCH CREATIVE CALCULATOR
let creative = fs.readFileSync('src/components/calculators/CreativeCalculator.jsx', 'utf8');

const oldCreativeVars = `  const repairs = financialEngine.repairs || 0;
  
  const actualArv = globalArv || financialEngine.arv || propertyDetails.zestimate || 0;
  const [mortgageBalance, setMortgageBalance] = useState(150000);`;

const newCreativeVars = `  const repairs = financialEngine.repairs || 0;
  
  const actualArv = globalArv || financialEngine.arv || propertyDetails.zestimate || 0;
  const formData = masterLead?.formData || {};
  const financials = masterLead?.financials || {};
  const baseDebt = financials.totalDebt || (propertyDetails.mortgages && propertyDetails.mortgages.length > 0 ? propertyDetails.mortgages[0].amount : 0) || 0;
  const arrears = parseFloat(String(formData?.arrearsAmount || '0').replace(/[^0-9.]/g, '')) || 0;
  const solarPayoff = formData.solarAssumable === 'No (Must Payoff)' ? (parseFloat(masterLead?.formData?.solarPayoffAmount || 0) || 0) : 0;
  const totalLiens = Object.values(formData.lienAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const totalFines = Object.values(formData.fineAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const absoluteTotalDebt = baseDebt + arrears + solarPayoff + totalLiens + totalFines;

  const [mortgageBalance, setMortgageBalance] = useState(absoluteTotalDebt > 0 ? absoluteTotalDebt : 150000);`;

creative = creative.replace(oldCreativeVars, newCreativeVars);

fs.writeFileSync('src/components/calculators/CreativeCalculator.jsx', creative);
console.log('CreativeCalculator updated.');
