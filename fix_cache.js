const fs = require('fs');
const filePath = "src/components/dashboard/Pipeline.jsx";
let c = fs.readFileSync(filePath, "utf-8");

c = c.replace(/sessionStorage\.getItem/g, 'localStorage.getItem');
c = c.replace(/sessionStorage\.setItem/g, 'localStorage.setItem');
c = c.replace(/sessionStorage\.removeItem/g, 'localStorage.removeItem');

// Also increase cache time from 5 minutes to something much longer like 1 hour or 24 hours, or just keep it 5 minutes?
// Let's keep it 5 mins, or maybe change to 30 mins so it doesn't sync so often?
// The user said "its not saving and has to sync every single time". This implies closing the browser or tab and opening it forces a sync. Changing to `localStorage` fixes the tab persistence.
// Let's increase cache duration to 60 minutes just in case.
c = c.replace(/5 \* 60 \* 1000/, '60 * 60 * 1000');

fs.writeFileSync(filePath, c);
console.log("Updated Pipeline.jsx caching to localStorage and 60 minutes");
