import React from "react";
import clsx from "clsx";
const renderPillar = (number, title, icon, content) => {
    const isActive = activePillar === number;
    const isCompleted = completedPillars.includes(number);
    
    return (
      <div className={clsx("mb-6 transition-all duration-300 ease-in-out border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden comic-glass", isActive ? "transform -skew-x-1 neon-glow-cyan" : isCompleted ? "opacity-90 transform skew-x-1" : "opacity-100")}>
        
          <div 
            className={clsx("flex justify-between items-center p-5 cursor-pointer select-none border-b-4 border-black",
              number === 1 ? "bg-[#00E5FF]" : 
              number === 2 ? "bg-[#FFE600]" : 
              number === 3 ? "bg-[#FF0055]" : 
              number === 4 ? "bg-[#00FF66]" : 
              number === 5 ? "bg-[#B400FF]" : "bg-[#FF6A00]"
            )} 
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
              <CheckCircle2 size={16} /> {isCompleted ? "Completed" : "Mark Complete"}
            </button>
            {isActive ? <ChevronDown className="text-gray-800" /> : <ChevronRight className="text-gray-800" />}
          </div>
        </div>
        
        <div className={clsx("grid transition-all duration-300 ease-in-out", isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
          <div className="overflow-hidden">
            <div className="p-6 pt-0 border-t border-black mt-2">
              {content}
            </div>
          </div>
        </div>
      </div>
    );
  };
