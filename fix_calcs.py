import os

file_path = "src/components/script/CallScript.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    c = f.read()

# 1. REPAIRS
old_repairs = """            {/* REPAIRS CALCULATOR */}
            <div className="comic-glass border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0">
              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setActiveCalc(activeCalc === 'repairs' ? null : 'repairs')}>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Wrench size={18} className="text-red-600" />
                  Repairs Calculator
                </div>
                {activeCalc === 'repairs' ? <ChevronDown size={18} className="text-gray-800" /> : <ChevronRight size={18} className="text-gray-800" />}
              </div>"""

new_repairs = """            {/* REPAIRS CALCULATOR */}
            <div className="bg-black border-4 border-black shadow-[8px_8px_0px_#FF0055] hover:shadow-[12px_12px_0px_#FF0055] transition-all overflow-hidden flex-shrink-0 relative group transform -rotate-1 mb-2">
              <div className="absolute top-0 bottom-0 left-[-10%] w-[50%] bg-[#FF0055] transform skew-x-[25deg] origin-bottom border-r-4 border-black group-hover:w-[60%] transition-all duration-300 pointer-events-none"></div>
              <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'repairs' ? null : 'repairs')}>
                <div className="flex items-center gap-3 text-white font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#000]">
                  <Wrench size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />
                  REPAIRS
                </div>
                {activeCalc === 'repairs' ? <ChevronDown size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" /> : <ChevronRight size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" />}
              </div>"""

# 2. CASH
old_cash = """            {/* CASH CALCULATOR */}
            <div className="comic-glass border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0">
              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setActiveCalc(activeCalc === 'cash' ? null : 'cash')}>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Calculator size={18} className="text-green-600" />
                  Cash Exit Calculator
                </div>
                {activeCalc === 'cash' ? <ChevronDown size={18} className="text-gray-800" /> : <ChevronRight size={18} className="text-gray-800" />}
              </div>"""

new_cash = """            {/* CASH CALCULATOR */}
            <div className="bg-black border-4 border-black shadow-[8px_8px_0px_#00FF66] hover:shadow-[12px_12px_0px_#00FF66] transition-all overflow-hidden flex-shrink-0 relative group transform rotate-1 mb-2">
              <div className="absolute top-0 bottom-0 right-[-10%] w-[50%] bg-[#00FF66] transform skew-x-[-25deg] origin-bottom border-l-4 border-black group-hover:w-[60%] transition-all duration-300 pointer-events-none"></div>
              <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'cash' ? null : 'cash')}>
                <div className="flex items-center gap-3 text-white font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#000]">
                  <Calculator size={28} className="text-[#00FF66] drop-shadow-[1px_1px_0px_#000]" />
                  CASH EXIT
                </div>
                {activeCalc === 'cash' ? <ChevronDown size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" /> : <ChevronRight size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />}
              </div>"""

# 3. CREATIVE
old_creative = """            {/* CREATIVE CALCULATOR */}
            <div className="comic-glass border-4 border-black shadow-[4px_4px_0px_#000] overflow-hidden flex-shrink-0">
              <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors" onClick={() => setActiveCalc(activeCalc === 'creative' ? null : 'creative')}>
                <div className="flex items-center gap-2 text-black font-bold">
                  <Calculator size={18} className="text-accent-secondary" />
                  Creative / SubTo Calculator
                </div>
                {activeCalc === 'creative' ? <ChevronDown size={18} className="text-gray-800" /> : <ChevronRight size={18} className="text-gray-800" />}
              </div>"""

new_creative = """            {/* CREATIVE CALCULATOR */}
            <div className="bg-black border-4 border-black shadow-[8px_8px_0px_#00E5FF] hover:shadow-[12px_12px_0px_#00E5FF] transition-all overflow-hidden flex-shrink-0 relative group transform -rotate-1 mb-2">
              <div className="absolute top-0 bottom-0 left-[-10%] w-[60%] bg-[#00E5FF] transform skew-x-[25deg] origin-bottom border-r-4 border-black group-hover:w-[70%] transition-all duration-300 pointer-events-none"></div>
              <div className="p-5 flex justify-between items-center cursor-pointer relative z-10" onClick={() => setActiveCalc(activeCalc === 'creative' ? null : 'creative')}>
                <div className="flex items-center gap-3 text-black font-bangers text-3xl tracking-widest drop-shadow-[2px_2px_0px_#fff]">
                  <Calculator size={28} className="text-black drop-shadow-[1px_1px_0px_#fff]" />
                  CREATIVE / SUBTO
                </div>
                {activeCalc === 'creative' ? <ChevronDown size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" /> : <ChevronRight size={28} className="text-white drop-shadow-[2px_2px_0px_#000]" />}
              </div>"""

c = c.replace(old_repairs, new_repairs)
c = c.replace(old_cash, new_cash)
c = c.replace(old_creative, new_creative)

# 4. VOICEMAIL
old_voicemail = """              <button 
                onClick={() => onReturn && onReturn({ type: 'voicemail' })} 
                className="w-full relative h-20 group overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] transition-all hover:-translate-y-1 bg-black comic-halftone transform rotate-1 cursor-pointer flex justify-center items-center"
              >
                <div className="absolute inset-0 bg-[#B400FF] transform skew-x-[-30deg] translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-500 border-l-4 border-black pointer-events-none"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Mic size={24} className="text-white drop-shadow-[2px_2px_0px_#000]" />
                  <span className="font-bangers text-4xl text-white tracking-widest drop-shadow-[3px_3px_0px_#000] group-hover:scale-110 transition-transform">
                    LEFT VOICEMAIL
                  </span>
                </div>
              </button>"""

new_voicemail = """              <button 
                onClick={() => onReturn && onReturn({ type: 'voicemail' })} 
                className="w-full relative h-20 group overflow-hidden border-4 border-black shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000] transition-all hover:-translate-y-1 bg-black transform rotate-1 cursor-pointer flex justify-center items-center"
              >
                <div className="absolute inset-0 bg-[#B400FF] transform skew-x-[-30deg] translate-x-1/2 group-hover:translate-x-1/3 transition-transform duration-500 border-l-4 border-black pointer-events-none"></div>
                <div className="relative z-10 flex items-center gap-3">
                  <Mic size={24} className="text-white drop-shadow-[2px_2px_0px_#000]" />
                  <span className="font-bangers text-4xl text-white tracking-widest drop-shadow-[3px_3px_0px_#000] group-hover:scale-110 transition-transform">
                    LEFT VOICEMAIL
                  </span>
                </div>
              </button>"""
c = c.replace(old_voicemail, new_voicemail)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(c)

# FIX SESSION ANALYTICS VARS PULLED
sa_path = "src/components/dashboard/SessionArchive.jsx"
with open(sa_path, "r", encoding="utf-8") as f:
    sa = f.read()

old_vars_pulled = """<div className="p-4 text-center bg-black border-r-4 border-black relative overflow-hidden comic-halftone">"""
new_vars_pulled = """<div className="p-4 text-center bg-black border-r-4 border-black relative overflow-hidden">"""
sa = sa.replace(old_vars_pulled, new_vars_pulled)

with open(sa_path, "w", encoding="utf-8") as f:
    f.write(sa)

print("Calculators, Voicemail dots, and Session Analytics dots removed!")
