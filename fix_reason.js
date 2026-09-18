const fs = require('fs');

// 1. Update page.jsx
const pagePath = "src/app/dashboard/page.jsx";
let pageCode = fs.readFileSync(pagePath, "utf-8");

pageCode = pageCode.replace(
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'DISQUALIFY', leadName: activeLead?.name || activeLead?.address }) });`,
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'DISQUALIFY', leadName: activeLead?.name || activeLead?.address, reason: event.reason }) });`
);

fs.writeFileSync(pagePath, pageCode);

// 2. Update route.js
const routePath = "src/app/api/stats/route.js";
let routeCode = fs.readFileSync(routePath, "utf-8");

routeCode = routeCode.replace(
  `stats.logs.unshift({ time, action: 'Disqualified', target: event.leadName || 'Lead', isDisqualified: true });`,
  `stats.logs.unshift({ time, action: \`Disqualified\${event.reason ? ' - ' + event.reason : ''}\`, target: event.leadName || 'Lead', isDisqualified: true });`
);

fs.writeFileSync(routePath, routeCode);

console.log("Updated page.jsx and route.js to support disqualify reasons");
