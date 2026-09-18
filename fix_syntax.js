const fs = require('fs');
let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');
const search = `            <button 
              onClick={(e) => togglePillarCompletion(e, number)}
              className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all", isCompleted ? "bg-accent-success/20 text-green-600 border border-accent-success/50" : "bg-white text-gray-800 border border-black hover:text-black")}
            onClick={() => setActivePillar(isActive ? null : number)}
        >
          <div className="flex items-center gap-3">
            <div className={clsx("p-2 rounded-lg", isActive ? "bg-[#00E5FF] text-[#00E5FF]" : isCompleted ? "bg-accent-success/20 text-green-600" : "bg-white text-gray-800")}>
              {icon}
            </div>
            <h3 className={clsx("font-bangers text-xl tracking-wide", isActive ? "text-black" : "text-gray-800")}>Pillar {number}: {title}</h3>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => togglePillarCompletion(e, number)}
              className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all", isCompleted ? "bg-accent-success/20 text-green-600 border border-accent-success/50" : "bg-white text-gray-800 border border-black hover:text-black")}
            >
              <CheckCircle2 size={16} /> {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            {isActive ? <ChevronDown className="text-gray-800" /> : <ChevronRight className="text-gray-800" />}
          </div>`;

const replacement = `            <button 
              onClick={(e) => togglePillarCompletion(e, number)}
              className={clsx("flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all", isCompleted ? "bg-accent-success/20 text-green-600 border border-accent-success/50" : "bg-white text-gray-800 border border-black hover:text-black")}
            >
              <CheckCircle2 size={16} /> {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            {isActive ? <ChevronDown className="text-gray-800" /> : <ChevronRight className="text-gray-800" />}
          </div>
        </div>`;

c = c.replace(search, replacement);
fs.writeFileSync('src/components/script/CallScript.jsx', c);
