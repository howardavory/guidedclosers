const fs = require('fs');

const filePath = "src/app/dashboard/page.jsx";
let c = fs.readFileSync(filePath, "utf-8");

// Replace fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'CONTACT' }) });
// wait, `activeLead` is passed as `lead` to onLeadSelect
c = c.replace(
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'CONTACT' }) });`,
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'CONTACT', leadName: lead?.name || lead?.address }) });`
);

// Replace voicemail
c = c.replace(
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'VOICEMAIL' }) });`,
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'VOICEMAIL', leadName: activeLead?.name || activeLead?.address }) });`
);

// Replace disqualified
c = c.replace(
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'DISQUALIFY' }) });`,
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'DISQUALIFY', leadName: activeLead?.name || activeLead?.address }) });`
);

// Replace drop_off
c = c.replace(
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'DROP_OFF', pillar: event.pillar }) });`,
  `fetch('/api/stats', { method: 'POST', body: JSON.stringify({ type: 'DROP_OFF', pillar: event.pillar, leadName: activeLead?.name || activeLead?.address }) });`
);

// WAIT! What about VARIABLES_PULLED and CONTRACT_SENT?
// Let's check if they exist in page.jsx.
fs.writeFileSync(filePath, c);
console.log("Updated page.jsx to send leadName to stats API");
