const fs = require('fs');
let code = fs.readFileSync('C:/Users/avory/.gemini/antigravity/brain/91dc1a01-e8f5-49ce-8347-2f8ca71c1cad/scratch/CallScript_V3_recovered.jsx', 'utf8');

if (!code.includes('import useStore')) {
   code = code.replace(/import \{ addNoteToContact \} from '\.\.\/\.\.\/services\/ghlService';/, "import { addNoteToContact } from '../../services/ghlService';\nimport useStore from '../../store/useStore';");
   
   const hooks = "\n  const masterLead = useStore(state => state.masterLead);\n  const updatePropertyDetails = useStore(state => state.updatePropertyDetails);\n  const updateTriageCondition = useStore(state => state.updateTriageCondition);\n  const updateFinancialEngine = useStore(state => state.updateFinancialEngine);\n  const updateDisposition = useStore(state => state.updateDisposition);\n";
   
   code = code.replace(/export default function CallScript\(\{ lead, onReturn \}\) \{/, "export default function CallScript({ lead, onReturn }) {" + hooks);
   
   const syncEffect = "\n  // Sync formData with useStore to satisfy V3 Architecture\n  useEffect(() => {\n    updatePropertyDetails({\n      address: lead?.isManual ? formData.manualAddress : lead?.address,\n      beds: formData.beds,\n      baths: formData.baths,\n      sqft: formData.sqft\n    });\n    \n    updateTriageCondition({\n      roof: (formData.roof || []).join(', '),\n      hvac: (formData.hvac || []).join(', '),\n      plumbing: (formData.plumbing || []).join(', '),\n      electrical: (formData.electrical || []).join(', '),\n      kitchen: (formData.cosmeticsKitchen || []).join(', '),\n      bathrooms: (formData.cosmeticsBaths || []).join(', '),\n    });\n\n    updateFinancialEngine({\n      arv: formData.arv || arv,\n    });\n  }, [formData, arv, lead]);\n";
   
   code = code.replace(/const updateForm = \(updates\) => \{\n    setFormData\(prev => \(\{ \.\.\.prev, \.\.\.updates \}\)\);\n  \};/, "const updateForm = (updates) => {\n    setFormData(prev => ({ ...prev, ...updates }));\n  };" + syncEffect);
}

fs.writeFileSync('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src/components/script/CallScript.jsx', code);
console.log('Restored working V2 file with useStore hooks.');
