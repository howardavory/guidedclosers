const fs = require('fs');

let code = fs.readFileSync('src/components/dashboard/Sidebar.jsx', 'utf8');

const calcNavStr = `    { name: 'Calculators', onClick: () => useStore.getState().setActiveGlobalDrawer('calculators'), icon: Calculator },\n`;

if (code.includes(calcNavStr)) {
  code = code.replace(calcNavStr, '');
  fs.writeFileSync('src/components/dashboard/Sidebar.jsx', code);
  console.log("Calculators button removed from Sidebar.jsx");
} else {
  console.log("Calculators button not found in Sidebar.jsx");
}
