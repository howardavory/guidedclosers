const fs = require('fs');

let code = fs.readFileSync('src/components/calculators/CashCalculator.jsx', 'utf8');

const targetBlock = `  const baseDebt = financials.totalDebt || (propertyDetails.mortgages && propertyDetails.mortgages.length > 0 ? propertyDetails.mortgages[0].amount : 0) || 0;
  const arrears = parseFloat(String(formData?.arrearsAmount || '0').replace(/[^0-9.]/g, '')) || 0;
  const solarPayoff = formData.solarAssumable === 'No (Must Payoff)' ? (parseFloat(solarPayoffAmount) || 0) : 0;
  const totalLiens = Object.values(formData.lienAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const totalFines = Object.values(formData.fineAmounts || {}).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const absoluteTotalDebt = baseDebt + arrears + solarPayoff + totalLiens + totalFines;
  const totalDebt = absoluteTotalDebt;`;

const newBlock = `  // ---------------------------------------------------
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
  // ---------------------------------------------------`;

if (code.includes(targetBlock)) {
  code = code.replace(targetBlock, newBlock);
  fs.writeFileSync('src/components/calculators/CashCalculator.jsx', code);
  console.log("CashCalculator debt routing updated.");
} else {
  console.log("Could not find target block in CashCalculator.jsx.");
}
