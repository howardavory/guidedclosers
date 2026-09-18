const fs = require('fs');
const path = require('path');

const targetArtifact = 'C:/Users/avory/.gemini/antigravity/brain/ecb85b87-153c-4728-acb3-bb0342c794ac/Code_Architecture_Audit.md';

const basePath = 'C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src';

const filesToExtract = [
    { label: '1. Authentication & Routing (Auth_RoleSelection.js / login)', path: 'app/login/page.js' },
    { label: '2. Global Styles (globals.css)', path: 'app/globals.css' },
    { label: '3. The Global State Engine (useStore.js)', path: 'store/useStore.js' },
    { label: '4. Dashboard & CRM (Dashboard_Triage.jsx)', path: 'app/dashboard/page.jsx' },
    { label: '4. Dashboard & CRM (ManagerDashboard.jsx)', path: 'components/dashboard/ManagerDashboard.jsx' },
    { label: '4. Dashboard & CRM (Pipeline.jsx)', path: 'components/dashboard/Pipeline.jsx' },
    { label: '5. & 6. Lead Profile & Script Pillars (CallScript.jsx)', path: 'components/script/CallScript.jsx' },
    { label: '7. Financial Engines (CashCalculator.jsx)', path: 'components/calculators/CashCalculator.jsx' },
    { label: '7. Financial Engines (CreativeCalculator.jsx)', path: 'components/calculators/CreativeCalculator.jsx' },
    { label: '7. Financial Engines (RepairsCalculator.jsx)', path: 'components/calculators/RepairsCalculator.jsx' },
    { label: '8. Disposition (TearSheet.jsx - Script)', path: 'components/script/TearSheet.jsx' },
    { label: '8. Disposition (TearSheet.jsx - Documents)', path: 'components/documents/TearSheet.jsx' }
];

let output = '# Code Architecture Audit\n\n';
output += 'As requested, here is the total, end-to-end extraction of the current codebase modules to audit logic, state management, and styling. Note that the monolithic `CallScript.jsx` inherently encompasses the requested Lead Profile wrapper and all 6 Pillars.\n\n';

for (const file of filesToExtract) {
    const fullPath = path.join(basePath, file.path);
    output += `## ${file.label}\n\n`;
    if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const ext = path.extname(fullPath).substring(1);
        output += '```' + ext + '\n' + content + '\n```\n\n';
    } else {
        output += `> [!WARNING]\n> File not found at expected path: ${fullPath}\n\n`;
    }
}

fs.writeFileSync(targetArtifact, output);
console.log('Artifact generated successfully.');
