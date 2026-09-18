const fs = require('fs');
let code = fs.readFileSync('src/components/script/CallScript.jsx', 'utf8');

const target = 'const [activePillar, setActivePillar] = useState(1);';
const insertion = `const [activePillar, setActivePillar] = useState(1);
  const [activeConditionSection, setActiveConditionSection] = useState('property');

  const ConditionSection = ({ id, title, isComplete, children }) => {
    const isActive = activeConditionSection === id;
    
    return (
      <div className="mb-4">
        <button 
          onClick={() => setActiveConditionSection(isActive ? '' : id)}
          className={clsx(
            "w-full flex items-center justify-between p-4 rounded-xl transition-all font-bold text-sm md:text-base border border-[#333333]",
            isActive ? "bg-[#1A1A1A] text-[#E5C158] border-[#E5C158]/50 shadow-[0_0_15px_rgba(229,193,88,0.15)]" : (isComplete ? "bg-[#121212] text-[#A0A0A0]" : "bg-[#0A0A0F] text-[#777777] hover:bg-[#111111]")
          )}
        >
          <div className="flex items-center gap-3">
            {isComplete && <Check size={16} className="text-[#E5C158]" />}
            {title}
          </div>
          {isActive ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        
        {isActive && (
          <div className="mt-4 p-5 bg-[#0F0F0F] rounded-xl border border-[#222222] animate-slideIn">
            {children}
          </div>
        )}
      </div>
    );
  };`;

code = code.replace(target, insertion);
fs.writeFileSync('src/components/script/CallScript.jsx', code);
