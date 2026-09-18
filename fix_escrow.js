const fs = require('fs');

const filePath = "src/components/script/CallScript.jsx";
let c = fs.readFileSync(filePath, "utf-8");

const oldText = `<div className="grid grid-cols-2 gap-2">
                    <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'Not Selling' })} className="py-2.5 px-4 text-center font-bangers text-xl tracking-widest text-white bg-[#FF0055] border-4 border-black hover:bg-white hover:text-black transition-colors hover:shadow-[4px_4px_0px_#000]">Not Selling</button>
                    <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'DNC' })} className="py-2.5 px-4 text-center font-bangers text-xl tracking-widest text-white bg-[#FF0055] border-4 border-black hover:bg-white hover:text-black transition-colors hover:shadow-[4px_4px_0px_#000]">DNC</button>
                    <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'Hostile' })} className="py-2.5 px-4 text-center font-bangers text-xl tracking-widest text-white bg-[#FF0055] border-4 border-black hover:bg-white hover:text-black transition-colors hover:shadow-[4px_4px_0px_#000] col-span-2">Hostile / Angry</button>
                  </div>`;

const newText = `<div className="grid grid-cols-2 gap-2">
                    <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'Not Selling' })} className="py-2.5 px-4 text-center font-bangers text-xl tracking-widest text-white bg-[#FF0055] border-4 border-black hover:bg-white hover:text-black transition-colors hover:shadow-[4px_4px_0px_#000]">Not Selling</button>
                    <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'DNC' })} className="py-2.5 px-4 text-center font-bangers text-xl tracking-widest text-white bg-[#FF0055] border-4 border-black hover:bg-white hover:text-black transition-colors hover:shadow-[4px_4px_0px_#000]">DNC</button>
                    <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'Hostile' })} className="py-2.5 px-4 text-center font-bangers text-xl tracking-widest text-white bg-[#FF0055] border-4 border-black hover:bg-white hover:text-black transition-colors hover:shadow-[4px_4px_0px_#000]">Hostile</button>
                    <button onClick={() => onReturn && onReturn({ type: 'disqualified', reason: 'In Escrow' })} className="py-2.5 px-4 text-center font-bangers text-xl tracking-widest text-white bg-[#FF0055] border-4 border-black hover:bg-white hover:text-black transition-colors hover:shadow-[4px_4px_0px_#000]">In Escrow</button>
                  </div>`;

c = c.replace(oldText, newText);

fs.writeFileSync(filePath, c);
console.log("Updated disqualify menu");
