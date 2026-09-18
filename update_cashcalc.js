const fs = require('fs');

let cashCalc = fs.readFileSync('src/components/calculators/CashCalculator.jsx', 'utf8');

// The exact string to find
const oldUseState = `  const [localAssignmentFee, setLocalAssignmentFee] = useState(formData?.assignmentFee || '');`;
const newUseState = `  // Initialize with 30000 if no fee is saved yet
  const [localAssignmentFee, setLocalAssignmentFee] = useState(
    formData?.assignmentFee !== undefined && formData?.assignmentFee !== '' 
      ? formData.assignmentFee 
      : 30000
  );`;

const oldUseEffect = `  useEffect(() => {
    setLocalAssignmentFee(formData?.assignmentFee || '');
  }, [formData?.assignmentFee]);`;
  
const newUseEffect = `  // Sync if global state changes, but respect the 30000 baseline
  useEffect(() => {
    if (formData?.assignmentFee !== undefined && formData?.assignmentFee !== '') {
      setLocalAssignmentFee(formData.assignmentFee);
    }
  }, [formData?.assignmentFee]);`;

cashCalc = cashCalc.replace(oldUseState, newUseState);
cashCalc = cashCalc.replace(oldUseEffect, newUseEffect);

fs.writeFileSync('src/components/calculators/CashCalculator.jsx', cashCalc);
console.log('CashCalculator.jsx updated with $30k baseline.');
