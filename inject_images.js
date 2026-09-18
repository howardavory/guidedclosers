const fs = require('fs');
let c = fs.readFileSync('src/components/script/CallScript.jsx', 'utf-8');

const injection = `
      <div className="flex h-[calc(100vh-120px)] gap-6 relative z-10">
        {/* MILES MORALES AGENT ART */}
        <img src="/assets/comic/agent.png" alt="Agent" className="absolute bottom-0 -left-32 h-[90%] object-contain pointer-events-none z-[-1] drop-shadow-[8px_8px_0px_rgba(0,0,0,1)] opacity-90" />
        
        {/* COMIC PANELS BACKGROUND */}
        <div className="absolute top-10 right-[400px] w-56 pointer-events-none z-[-1] opacity-60 flex flex-col justify-center">
           <img src="/assets/comic/panels.png" alt="Comic Panels" className="w-full object-contain border-4 border-black shadow-[8px_8px_0px_#000] transform skew-y-2" />
        </div>
`;

c = c.replace(/<div className=\"flex h-\[calc\(100vh-120px\)\] gap-6 relative\">/g, injection);

fs.writeFileSync('src/components/script/CallScript.jsx', c);
