const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach((file) => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('C:/Users/avory/OneDrive/Desktop/AI_Agent_Projects/3_Sales_Workflow_Agent/v3_app/src');

const targetClass = 'w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all';

files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. Remove border-b-2 from wrapper divs for Asking Price
    const regex1 = /<div className="flex items-baseline border-b-2 border-slate-300 focus-within:border-\[E5C158\] transition-colors pb-1 w-48 mt-2">/g;
    code = code.replace(regex1, (match) => {
        changed = true;
        return '<div className="flex items-center gap-2 w-full max-w-xs mt-2">';
    });

    // 2. Remove border-b-2 from Calculators
    const regex2 = /<div className="flex items-baseline border-b-2 border-\[#333333\] focus-within:border-\[E5C158\] transition-colors pb-1\.5 w-full">/g;
    code = code.replace(regex2, (match) => {
        changed = true;
        // In this case, we'll make the div itself the target rounded box!
        return `<div className="${targetClass.replace('w-full', 'w-full flex items-center gap-2')}">`;
    });

    // We also need to fix the input inside that div if it was styled differently, but actually the inputs in calculators are:
    // className="appearance-none bg-transparent text-base text-[#FFFFFF] font-semibold outline-none w-full p-0 m-0"
    // Wait! If I make the DIV the rounded box, it's perfect because the focus-within ring will apply to the div? 
    // Yes! targetClass has focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30. But on a div, `focus:` doesn't trigger unless tabindex is set, we need `focus-within:`.
    // Let's modify targetClass for divs:
    const divTargetClass = 'w-full flex items-center gap-2 bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] font-semibold text-base focus-within:border-[#E5C158] focus-within:ring-1 focus-within:ring-[#E5C158]/30 transition-all';
    
    const regex3 = /<div className="flex justify-between items-center border-b-2 border-solid border-gray-400 py-2 mb-3">/g;
    code = code.replace(regex3, (match) => {
        changed = true;
        return '<div className="flex justify-between items-center w-full mb-3 gap-2">';
    });

    // Let's re-run regex2 with divTargetClass
    code = code.replace(/<div className="w-full bg-\[#121212\] border border-\[#333333\].*?flex items-center gap-2">/g, `<div className="${divTargetClass}">`);

    // We also need to fix any TearSheet inputs that were border-b-2 if they weren't caught
    // TearSheet uses: className="bg-transparent border-b-2 border-[#333333] text-white w-full px-2 py-1 focus:outline-none focus:border-[#00E5FF] transition-colors"
    const regex4 = /className="bg-transparent border-b-2 border-\[#333333\] text-white w-full px-2 py-1 focus:outline-none focus:border-\[#00E5FF\] transition-colors"/g;
    code = code.replace(regex4, (match) => {
        changed = true;
        return `className="${targetClass}"`;
    });

    if (changed) {
        fs.writeFileSync(file, code);
        console.log(`Updated wrapper borders in ${file}`);
    }
});
console.log('Finished updating wrapper borders globally.');
