const fs = require('fs');

const filePath = "src/app/dashboard/page.jsx";
let c = fs.readFileSync(filePath, "utf-8");

const replacement = `<header className="px-8 py-4 flex justify-between items-center border-b-[6px] border-[#00E5FF] bg-black shrink-0 shadow-[0_8px_0px_rgba(0,229,255,0.3)] relative z-10 comic-halftone">
          <div className="flex-shrink-0 relative transform -skew-x-6">
            <h1 className="comic-title text-6xl drop-shadow-[2px_2px_0px_#FF0055]">Triage Terminal <span className="text-[#00E5FF] text-4xl ml-2 drop-shadow-[2px_2px_0px_#000]">v3</span></h1>
            <p className="text-black font-bangers text-xl tracking-widest mt-1 bg-[#FFE600] inline-block px-3 py-1 border-4 border-black shadow-[4px_4px_0px_#FF0055] transform skew-x-3">Role: <span className="text-[#FF0055]">{userRole}</span></p>
          </div>
          
          {/* GAMIFIED KPI BAR (Spider-Verse Comic Theme) */}
          <div className="flex-1 max-w-2xl mx-8 flex items-center justify-center gap-6">
            <div className="flex flex-col items-center p-3 border-4 border-black bg-black shadow-[6px_6px_0px_#00E5FF] transform skew-x-3 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-8 h-full bg-[#00E5FF] opacity-20 transform -skew-x-12"></div>
              <span className="text-sm font-bangers text-[#00E5FF] uppercase tracking-widest mb-2 drop-shadow-[1px_1px_0px_#000] relative z-10">Session Combo</span>
              <div className="flex gap-2 relative z-10">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={\`w-6 h-6 border-2 border-black transform -rotate-3 \${i < streak ? 'bg-[#FF0055] shadow-[2px_2px_0px_#00E5FF]' : 'bg-gray-800'}\`}></div>
                ))}
              </div>
            </div>
            <div className="flex gap-6 p-3 border-4 border-black bg-black shadow-[8px_8px_0px_#FFE600] transform -skew-x-2 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-full bg-[#FFE600] opacity-10 transform -skew-x-12"></div>
               <div className="text-center px-6 border-r-4 border-black relative z-10">
                 <div className="text-sm font-bangers text-[#FFE600] uppercase tracking-widest drop-shadow-[1px_1px_0px_#000]">Leads Hit</div>
                 <div className="text-5xl font-bangers text-white drop-shadow-[3px_3px_0px_#00E5FF]">{dashboardStats?.totalContacts || 0}</div>
               </div>
               <div className="text-center px-6 border-r-4 border-black relative z-10">
                 <div className="text-sm font-bangers text-[#FFE600] uppercase tracking-widest drop-shadow-[1px_1px_0px_#000]">Contracts</div>
                 <div className="text-5xl font-bangers text-white drop-shadow-[3px_3px_0px_#FF0055]">{dashboardStats?.contractsSent || 0}</div>
               </div>
               <div className="text-center px-6 relative z-10">
                 <div className="text-sm font-bangers text-[#FFE600] uppercase tracking-widest drop-shadow-[1px_1px_0px_#000]">Multiplier</div>
                 <div className="text-5xl font-bangers text-[#00FF66] drop-shadow-[3px_3px_0px_#000]">{comboMultiplier.toFixed(1)}x</div>
               </div>
            </div>
          </div>
  
          <button 
            onClick={() => {
              useStore.setState({ userRole: null });
              router.push('/login');
            }}
            className="flex-shrink-0 px-8 py-3 border-4 border-black bg-[#FF0055] hover:bg-[#00E5FF] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#000] transition-all text-2xl font-bangers text-white uppercase tracking-widest shadow-[6px_6px_0px_#000] transform rotate-2"
          >
            Logout
          </button>
        </header>`;

c = c.replace(/<header className="px-8 py-4 flex justify-between items-center border-b-\[6px\] border-black bg-white shrink-0[\s\S]*?<\/header>/, replacement);

fs.writeFileSync(filePath, c);
console.log("Header successfully updated!");
