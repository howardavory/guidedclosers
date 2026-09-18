const fs = require('fs');

let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const targetStr = `<div className="grid grid-cols-1 xl:grid-cols-3 gap-6">`;
const replacementStr = `{/* The container below MUST be flex-col so each calculator stretches 100% horizontally */}
  <div className="flex flex-col gap-8 w-full">`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  
  // also add w-full to the inner divs
  const innerTarget1 = `<div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">1. Cash Offer</h4>`;
  const innerReplace1 = `<div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col w-full">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">1. Cash Offer</h4>`;
      
  const innerTarget2 = `<div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">2. Subject-To (Existing Debt)</h4>`;
  const innerReplace2 = `<div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col w-full">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">2. Subject-To (Existing Debt)</h4>`;

  const innerTarget3 = `<div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">3. Seller Finance (New Debt)</h4>`;
  const innerReplace3 = `<div className="bg-[#0A0A0F]/50 border border-[#222222] rounded-xl p-4 shadow-inner flex flex-col w-full">
      <h4 className="text-[#FFFFFF] font-black tracking-widest text-[11px] uppercase border-b border-[#333333] pb-2 mb-3">3. Seller Finance (New Debt)</h4>`;
      
  code = code.replace(innerTarget1, innerReplace1);
  code = code.replace(innerTarget2, innerReplace2);
  code = code.replace(innerTarget3, innerReplace3);
  
  fs.writeFileSync('src/components/script/CallScript.jsx', code);
  console.log("Replaced grid-cols with flex-col layout in Pillar 5.");
} else {
  console.log("Could not find target layout string to replace.");
}
