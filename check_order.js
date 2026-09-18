const fs = require('fs');
const p2 = fs.readFileSync('pillar2_original.jsx', 'utf8');
const matches = Array.from(p2.matchAll(/\"(Got it\. Now, to make sure my repair estimates|Okay, makes sense\. And what about the HVAC|Okay, and for the plumbing|Got it\. And what about the electrical|Got it\. And as far as the inside|And what about the outside|Okay, that gives me a great picture)/g));
console.log(matches.map(m => m[1]));
