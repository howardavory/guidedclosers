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

files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    let changed = false;

    // STEP 1: Fix Squished Dialogue & Script Blocks
    const regexDialogue = /className="relative border-l-4 border-transparent focus-within:border-\[[#A-Za-z0-9]+\] focus-within:bg-\[#121212\]\/80 bg-\[#1A1A1A\] box-border max-w-full mr-4 p-6 shadow-sm rounded-xl mb-8 transition-all"/g;
    if (regexDialogue.test(code)) {
        code = code.replace(regexDialogue, 'className="relative border-l-4 border-transparent focus-within:border-[#D4AF37] focus-within:bg-[#121212]/80 bg-[#1A1A1A] w-full p-5 shadow-sm rounded-xl mb-5 transition-all"');
        changed = true;
    }

    // Also fix if it was mb-6 or mb-4
    const regexDialogue2 = /className="relative border-l-4 border-transparent focus-within:border-\[[#A-Za-z0-9]+\] focus-within:bg-\[#121212\]\/80 bg-\[#1A1A1A\] box-border max-w-full mr-4 p-6 shadow-sm rounded-xl mb-[0-9]+ transition-all"/g;
    if (regexDialogue2.test(code)) {
        code = code.replace(regexDialogue2, 'className="relative border-l-4 border-transparent focus-within:border-[#D4AF37] focus-within:bg-[#121212]/80 bg-[#1A1A1A] w-full p-5 shadow-sm rounded-xl mb-5 transition-all"');
        changed = true;
    }
    
    // STEP 2: Standardize Inner Container Gaps & Padding
    // The broken Tenant Occupied and Solar Details container (which I previously overwrote with an input class)
    const badContainerClass = 'w-full bg-[#121212] border border-[#333333] rounded-xl p-3 text-[#FFFFFF] placeholder-[#777777] font-semibold text-base outline-none focus:border-[#E5C158] focus:ring-1 focus:ring-[#E5C158]/30 transition-all';
    // We replace it if it's used as a `div` wrapping sub-content instead of an `input`
    // Wait, regex to match `<div className="badClass">`
    const badDivRegex = new RegExp(`<div className="${badContainerClass.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">`, 'g');
    if (badDivRegex.test(code)) {
        code = code.replace(badDivRegex, '<div className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5">');
        changed = true;
    }

    // Fix other nested dark containers: e.g. bg-[#1A1A1A] border border-[#333333] ... p-4 or p-6 ... mt-4, mb-4, etc.
    // Replace with: bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5
    const darkContainer1 = /className="p-4 bg-\[#1A1A1A\] border border-\[#333333\] rounded-xl mt-4"/g;
    if (darkContainer1.test(code)) {
        code = code.replace(darkContainer1, 'className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5"');
        changed = true;
    }
    const darkContainer2 = /className="p-4 bg-\[#1A1A1A\]\/40 border border-\[#333333\] rounded-xl animate-slideIn"/g;
    if (darkContainer2.test(code)) {
        code = code.replace(darkContainer2, 'className="bg-[#1A1A1A]/40 border border-[#333333] p-5 rounded-xl mb-5 animate-slideIn"');
        changed = true;
    }

    const darkContainer3 = /className="my-4 p-4 bg-\[#1A1A1A\] border border-\[#333333\] rounded-xl flex items-center gap-3"/g;
    if (darkContainer3.test(code)) {
        code = code.replace(darkContainer3, 'className="bg-[#1A1A1A] border border-[#333333] p-5 rounded-xl mb-5 flex items-center gap-3"');
        changed = true;
    }

    // Ensure all inner toggle row groups use flex flex-wrap gap-3 mb-4
    // Typical current classes: "flex flex-wrap gap-2 mb-4", "flex flex-wrap gap-2 mb-2", "flex gap-2 flex-wrap mb-2"
    const gapRegex1 = /className="flex flex-wrap gap-2 mb-[0-9]+"/g;
    if (gapRegex1.test(code)) {
        code = code.replace(gapRegex1, 'className="flex flex-wrap gap-3 mb-4"');
        changed = true;
    }
    const gapRegex2 = /className="flex gap-2 flex-wrap mb-[0-9]+"/g;
    if (gapRegex2.test(code)) {
        code = code.replace(gapRegex2, 'className="flex flex-wrap gap-3 mb-4"');
        changed = true;
    }
    const gapRegex3 = /className="flex flex-wrap gap-2"/g;
    // We should only replace if it's the toggle group, but usually flex-wrap gap-2 is the toggle group.
    if (gapRegex3.test(code)) {
        code = code.replace(gapRegex3, 'className="flex flex-wrap gap-3 mb-4"');
        changed = true;
    }
    // Fix the one that might have become "mb-4 mb-4"
    code = code.replace(/className="flex flex-wrap gap-3 mb-4 mb-[0-9]+"/g, 'className="flex flex-wrap gap-3 mb-4"');

    // STEP 3: Standardize the Grid Layouts
    // Lead Profile main container:
    // currently: "col-span-12 lg:col-span-4 bg-[#0A0A0A] border-r border-[#333333] p-8 flex flex-col gap-8 h-full overflow-y-auto"
    const lpRegex = /p-8 flex flex-col gap-8/g;
    if (lpRegex.test(code)) {
        code = code.replace(lpRegex, 'p-6 md:p-8 flex flex-col gap-6');
        changed = true;
    }

    // grid-cols-2 or grid-cols-3 layouts using gap-4 should be gap-5 or gap-6.
    // Let's replace grid-cols-2 gap-4 with grid-cols-2 gap-6
    const grid2Regex = /grid-cols-2 gap-4/g;
    if (grid2Regex.test(code)) {
        code = code.replace(grid2Regex, 'grid-cols-2 gap-6');
        changed = true;
    }
    const grid3Regex = /grid-cols-3 gap-4/g;
    if (grid3Regex.test(code)) {
        code = code.replace(grid3Regex, 'grid-cols-3 gap-6');
        changed = true;
    }

    // "Ensure standard inputs inside these grids have w-full." -> I already ensured inputs have w-full in the previous step (w-full bg-[#121212]...)
    
    if (changed) {
        fs.writeFileSync(file, code);
        console.log(`Fixed layout spacing in ${file}`);
    }
});
console.log('Layout pass complete.');
