'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayCircle, ShieldCheck, Zap, BarChart, CheckCircle2, MessageSquare, ArrowRight, FileText } from 'lucide-react';
import OnboardingFlow from '@/components/OnboardingFlow';

const Toasts = () => {
  const [activeToast, setActiveToast] = useState(0);
  const messages = [
    "🔥 Contract Signed in Dallas, TX",
    "⚡ New Lead Triaged: Highly Qualified",
    "💰 $15k Deal Closed in Miami, FL"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveToast((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 max-w-7xl mx-auto hidden md:block">
      {messages.map((msg, idx) => (
        <div
          key={idx}
          className={`absolute transition-all duration-1000 ease-in-out bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs font-bold tracking-wider text-white shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center gap-2
            ${idx === 0 ? 'top-[20%] left-[5%]' : idx === 1 ? 'top-[40%] right-[5%]' : 'top-[65%] left-[10%]'}
            ${activeToast === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
          `}
        >
          {idx === 1 ? <Zap size={14} className="text-[#D4AF37]" /> : <CheckCircle2 size={14} className="text-green-400" />}
          {msg}
        </div>
      ))}
    </div>
  );
};

export default function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-[var(--text-base)] relative overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
      
      {/* CINEMATIC AMBIENT LIGHTING */}
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#D4AF37]/10 blur-[150px] pointer-events-none mix-blend-screen z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[150px] pointer-events-none mix-blend-screen z-0" />
      <div className="fixed top-[40%] left-[50%] -translate-x-1/2 w-[60vw] h-[20vw] rounded-[100%] bg-white/5 blur-[120px] pointer-events-none mix-blend-screen z-0" />

      {/* ANIMATED BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-[#D4AF37]/10 to-transparent rounded-full blur-3xl opacity-50 animate-pulse pointer-events-none" />

      {/* GLOBAL NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050505]/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-[#D4AF37]" size={24} />
          <span className="font-bold text-lg tracking-widest uppercase text-white">Family Legacy</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-gray-400 hover:text-white font-bold text-sm tracking-wide uppercase transition-colors">
            Sign In
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group relative overflow-hidden bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm px-6 py-2.5 rounded-lg transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="relative z-10">Get Started</span>
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10">
        <Toasts />
        
        {/* Authority Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] animate-pulse"></span>
          <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest">The AI-Powered Real Estate Integration Hub</span>
        </div>
        
        {/* Direct, Concrete Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] max-w-5xl text-white">
          The Central Command Hub For <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB]">Direct-To-Seller Acquisitions.</span>
        </h1>
        
        {/* Outcome-Driven Subcopy */}
        <p className="text-gray-400 text-lg md:text-xl max-w-3xl mb-10 leading-relaxed mx-auto">
          Stop fighting with scattered software. Family Legacy is the unified house for your entire real estate stack—seamlessly integrating GoHighLevel, DocuSign, and your data providers alongside our proprietary dynamic scripts and inline rehab calculators.
        </p>

        {/* Dual CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 w-full sm:w-auto">
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="w-full sm:w-auto bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(212,175,55,0.3)]"
          >
            Start 14-Day Free Trial
          </button>
          <button className="w-full sm:w-auto bg-black/50 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
            <PlayCircle size={20} /> Watch Demo
          </button>
        </div>

        {/* INTEGRATION ECOSYSTEM BANNER */}
        <div className="flex flex-col items-center justify-center gap-5 mb-24 w-full border-y border-white/5 py-8 bg-black/20 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none" />
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Orchestrating Your Favorite Tools in One Dashboard</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500 relative z-10">
            {/* Text placeholders acting as temporary logos */}
            <span className="font-black text-xl tracking-tighter text-white">GO<span className="text-blue-500">HIGHLEVEL</span></span>
            <span className="font-black text-xl tracking-tighter text-white">BATCH<span className="text-red-500">LEADS</span></span>
            <span className="font-black text-xl tracking-tighter text-white">PROP<span className="text-green-500">STREAM</span></span>
            <span className="font-black text-xl tracking-tighter text-white">DOCU<span className="text-yellow-500">SIGN</span></span>
            <span className="font-black text-xl tracking-tighter text-white">ZAPIER</span>
          </div>
        </div>

        {/* 3D FLOATING MOCKUP HERO */}
        <div 
          className="w-full max-w-5xl aspect-[16/9] bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(212,175,55,0.15)] relative flex items-center justify-center group mb-32 cursor-pointer transform md:-rotate-x-12 md:rotate-y-6 md:scale-105 transition-transform duration-700 hover:rotate-0 hover:scale-100 perspective-[2000px]"
          style={{ transformStyle: 'preserve-3d', transform: 'perspective(2000px) rotateX(5deg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none rounded-3xl" />
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 rounded-3xl" alt="Platform Dashboard Preview" />
          
          <div className="absolute inset-0 rounded-3xl border border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none z-20" />
          
          <div className="z-30 group-hover:scale-110 transition-transform duration-500 flex flex-col items-center">
            <PlayCircle className="text-white w-24 h-24 mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.5)]" />
            <span className="text-white font-bold tracking-widest uppercase text-sm bg-black/50 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">Take The Tour</span>
          </div>
        </div>

        {/* SOCIAL PROOF METRICS BAR */}
        <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 py-20 border-y border-white/5 mb-32 relative bg-black/20 backdrop-blur-sm shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/5 to-transparent pointer-events-none" />
          
          <div className="flex flex-col items-center justify-center relative z-10 group">
            <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-2 drop-shadow-lg transform group-hover:scale-105 transition-transform">10k+</span>
            <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] uppercase tracking-widest text-center">AI Calls Handled</span>
          </div>
          <div className="flex flex-col items-center justify-center relative z-10 group">
            <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#F3E5AB] to-[#D4AF37] mb-2 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)] transform group-hover:scale-105 transition-transform">$42M</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Deals Underwritten</span>
          </div>
          <div className="flex flex-col items-center justify-center relative z-10 group">
            <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-2 drop-shadow-lg transform group-hover:scale-105 transition-transform">94%</span>
            <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] uppercase tracking-widest text-center">Drip Response Rate</span>
          </div>
          <div className="flex flex-col items-center justify-center relative z-10 group">
            <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 mb-2 drop-shadow-lg transform group-hover:scale-105 transition-transform">0</span>
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Lost to Inaction</span>
          </div>
        </div>

        {/* CORE PHILOSOPHY SECTION */}
        <div className="w-full max-w-4xl mx-auto text-center mb-32">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-6">Built for Stewardship, Not Just Extraction.</h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Standard software treats sellers like numbers on a board. We built Family Legacy Investment Group to operate differently. Our automated drips provide genuine exit strategies to distressed homeowners. Our 1:1 Tearsheets provide cash buyers with unmanipulated, flawless data. Radical integrity is baked into the code.
          </p>
        </div>

        {/* THE ARSENAL SECTION */}
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-32 mb-32 text-left">
          
          {/* Feature 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="text-[#D4AF37] mb-4 bg-black/60 w-14 h-14 rounded-xl flex items-center justify-center border border-white/5 shadow-inner"><MessageSquare /></div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Dynamic Objection Handling</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Never freeze on a call again. Stop paying massive wholesale assignment fees. By going direct-to-seller, when a prospect says <em>"I need to talk to my spouse,"</em> the system instantly feeds you the psychological framework to overcome the objection and keep the deal alive. Keep the $15k assignment fee in your pocket.
              </p>
            </div>
            <div className="flex-1 w-full bg-[#111111]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(229,193,88,0.15)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#D4AF37]/10 blur-3xl" />
              <div className="bg-black/60 border border-white/5 rounded-xl p-4 mb-4">
                <p className="text-xs text-red-400 font-bold uppercase tracking-widest mb-1">Seller Objection</p>
                <p className="text-white font-medium">"I need to think about it."</p>
              </div>
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl p-4">
                <p className="text-xs text-[#D4AF37] font-bold uppercase tracking-widest mb-1">Your Rebuttal</p>
                <p className="text-gray-200">"I completely understand. Usually when someone needs to think about it, it comes down to price or timing. Which one is it for you?"</p>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1">
              <div className="text-[#D4AF37] mb-4 bg-black/60 w-14 h-14 rounded-xl flex items-center justify-center border border-white/5 shadow-inner"><Zap /></div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">Relentless AI Follow-Up</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                80% of deals are closed in the follow-up. While you sleep, the engine runs 365-day automated SMS and email drips, warming up cold leads until they are begging to sign. Stop letting $20k deals slip through the cracks.
              </p>
            </div>
            <div className="flex-1 w-full bg-[#111111]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(229,193,88,0.15)] relative overflow-hidden">
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-3xl" />
              <div className="space-y-4 relative z-10">
                {[
                  { day: 'Day 1', type: 'SMS', msg: 'Checking in on the property...' },
                  { day: 'Day 7', type: 'Email', msg: 'Are you still looking to sell?' },
                  { day: 'Day 30', type: 'SMS', msg: 'We just bought a house in your area...' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 bg-black/60 border border-white/5 rounded-xl p-3">
                    <div className="bg-gray-800 text-gray-300 text-xs font-bold px-2 py-1 rounded">{item.day}</div>
                    <div className={`text-xs font-bold ${item.type === 'SMS' ? 'text-green-400' : 'text-blue-400'}`}>{item.type}</div>
                    <div className="text-gray-400 text-sm truncate">{item.msg}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="text-[#D4AF37] mb-4 bg-black/60 w-14 h-14 rounded-xl flex items-center justify-center border border-white/5 shadow-inner"><FileText /></div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">One-Click Contract Generation</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Don't fumble with PDFs while the seller gets cold feet. Push one button, and the system pulls the property data, generates the assignment agreement, and fires off the DocuSign immediately. Speed to contract is speed to cash.
              </p>
            </div>
            <div className="flex-1 w-full bg-[#111111]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_32px_0_rgba(229,193,88,0.15)] relative overflow-hidden flex items-center justify-center min-h-[250px]">
              <div className="absolute inset-0 bg-gradient-to-br from-black/80 to-transparent z-0" />
              <button className="relative z-10 bg-[#D4AF37] text-black font-black uppercase tracking-widest px-8 py-4 rounded-xl shadow-[0_0_30px_rgba(212,175,55,0.4)] flex items-center gap-3 transform transition-transform hover:scale-105">
                <FileText /> Generate DocuSign
              </button>
            </div>
          </div>

        </div>

        {/* THE ECOSYSTEM GRID */}
        <div className="w-full max-w-6xl mx-auto mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">Your All-In-One Acquisition Ecosystem</h2>
            <p className="text-gray-400">Cancel your other subscriptions. Everything you need to close direct-to-seller is here.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Unified Deal CRM', desc: 'Manage your entire pipeline with drag-and-drop precision.' },
              { title: 'Live Script Engine', desc: 'Chris Voss style rebuttals fed to you in real-time.' },
              { title: 'Auto-Underwriter', desc: 'Instant ARV & MAO calculations based on live comps.' },
              { title: '1-Click Skip Tracing', desc: 'Pull owner phone numbers and emails instantly.' },
              { title: 'DocuSign Integration', desc: 'Generate and send assignment contracts instantly.' },
              { title: 'Buyer Tearsheets', desc: 'Generate 1:1 unmanipulated PDF dispo packets.' },
              { title: '365-Day AI SMS', desc: 'Never drop a follow-up with intelligent automation.' },
              { title: 'Multi-Channel Inbox', desc: 'Centralize texts, emails, and calls in one view.' }
            ].map((feature, i) => (
              <div key={i} className="relative bg-[#111111]/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-[0_20px_40px_-15px_rgba(212,175,55,0.2)] group overflow-hidden cursor-pointer">
                {/* Internal Card Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CheckCircle2 className="text-[#D4AF37] mb-6 opacity-60 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110" size={28} />
                <h4 className="text-white font-black text-lg mb-2 relative z-10">{feature.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed relative z-10">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* COST OF INACTION ANCHOR */}
        <div className="w-full max-w-4xl mx-auto mb-24 p-8 border-l-4 border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-transparent text-left rounded-r-2xl">
          <p className="text-xl md:text-2xl text-white font-medium leading-relaxed">
            "One blown objection costs you a <span className="text-[#D4AF37] font-bold">$15,000</span> assignment fee. One forgotten follow-up costs you a <span className="text-[#D4AF37] font-bold">$20,000</span> wholesale deal. You aren't paying for software; <span className="font-bold underline decoration-[#D4AF37]">you are paying to never lose a deal to your own lack of experience again.</span>"
          </p>
        </div>

        {/* 3-TIER PRICING TABLE */}
        <div className="w-full max-w-7xl mx-auto grid md:grid-cols-3 gap-8 items-center mb-10">
          
          {/* TIER 1: STARTER */}
          <div className="bg-[#111]/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-left shadow-lg">
            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Starter</h3>
            <div className="text-white text-xs font-semibold mb-6">Best for Beginners</div>
            <div className="text-4xl font-black text-white mb-8">$250<span className="text-lg text-gray-500 font-bold tracking-normal"> / mo</span></div>
            
            <ul className="space-y-4 mb-8">
              {['Deal Pipeline CRM', 'Core Sales Scripts', 'Basic Email Follow-up'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold text-gray-300">
                  <CheckCircle2 className="text-[#D4AF37] shrink-0 mt-0.5" size={16} /> {item}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm p-4 rounded-xl hover:bg-white/10 transition-colors">
              Get Started
            </button>
          </div>

          {/* TIER 2: CLOSER (Highlighted) */}
          <div className="bg-gradient-to-br from-[#1E1E1E] to-black border border-[#D4AF37] p-10 rounded-3xl text-left shadow-[0_0_40px_rgba(212,175,55,0.2)] relative transform md:scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#D4AF37] text-black px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase shadow-[0_0_15px_rgba(212,175,55,0.4)]">
              Most Popular
            </div>
            <h3 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-2">Closer</h3>
            <div className="text-gray-400 text-xs font-semibold mb-6">Best for Flippers & Agents</div>
            <div className="text-5xl font-black text-white mb-8">$750<span className="text-xl text-gray-500 font-bold tracking-normal"> / mo</span></div>
            
            <ul className="space-y-4 mb-10">
              {['Advanced Objection Handling', '365-Day AI SMS/Email Drips', 'One-Click DocuSign Generation'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold text-gray-200">
                  <div className="bg-[#D4AF37]/20 p-0.5 rounded-full shrink-0 mt-0.5"><CheckCircle2 className="text-[#D4AF37]" size={16} /></div>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(true)} className="group relative overflow-hidden w-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-black font-black uppercase tracking-widest text-sm p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(212,175,55,0.3)] flex justify-center items-center gap-2">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite]" />
              <span className="relative z-10">Claim Your Workspace</span> <ArrowRight size={16} className="relative z-10" />
            </button>
          </div>

          {/* TIER 3: ENTERPRISE */}
          <div className="bg-[#111]/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl text-left shadow-lg">
            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-2">Enterprise</h3>
            <div className="text-white text-xs font-semibold mb-6">Best for Scaling Teams</div>
            <div className="text-4xl font-black text-white mb-8">$1,500<span className="text-lg text-gray-500 font-bold tracking-normal"> / mo</span></div>
            
            <ul className="space-y-4 mb-8">
              {['Unlimited User Seats', 'API Integrations', 'Custom Webhooks', 'Priority Support'].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm font-semibold text-gray-300">
                  <CheckCircle2 className="text-[#D4AF37] shrink-0 mt-0.5" size={16} /> {item}
                </li>
              ))}
            </ul>
            <button onClick={() => setIsModalOpen(true)} className="w-full bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest text-sm p-4 rounded-xl hover:bg-white/10 transition-colors">
              Contact Sales
            </button>
          </div>

        </div>

      </main>

      {/* MULTI-STEP ONBOARDING MODAL */}
      <OnboardingFlow isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      {/* SHIMMER KEYFRAMES */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
}
