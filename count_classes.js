const fs = require('fs');
const content = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');
const regex = /className="([^"]+)"/g;
const classCounts = {};
let match;
while((match = regex.exec(content)) !== null) {
  const classes = match[1];
  classCounts[classes] = (classCounts[classes] || 0) + 1;
}
const sorted = Object.entries(classCounts).sort((a,b) => b[1] - a[1]).slice(0, 30);
console.log(sorted);
