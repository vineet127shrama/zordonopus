import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  
  // Project-related data for the moving 3D box
  const projectModules = [
    { label: 'WORKFLOW_ENGINE', title: 'Ranger Dispatch', desc: 'Auto-assignment system based on skill.', icon: '⚡', color: 'bg-blue-600' },
    { label: 'SLA_MONITOR', title: 'Response Timers', desc: 'Real-time resolution and fix tracking.', icon: '⏱️', color: 'bg-red-500' },
    { label: 'ANALYTICS_HUB', title: 'Command Stats', desc: 'Role-based visual data for Zordon.', icon: '📊', color: 'bg-green-500' },
    { label: 'ASSET_RECOVERY', title: 'Facility Fixes', desc: 'Managing engine leaks & sensor glitches.', icon: '🛡️', color: 'bg-purple-600' }
  ];

  // Logic to rotate project modules in the box
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % projectModules.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [projectModules.length]);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans selection:bg-blue-100 overflow-x-hidden">
      
      {/* 🌐 High-Impact Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b-2 border-slate-100">
        <div className="max-w-[1500px] mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-16">
            <h1 onClick={() => navigate('/')} className="text-3xl font-[1000] tracking-tighter text-blue-700 cursor-pointer">
              ZORDON<span className="text-slate-900 font-black uppercase tracking-tighter">Ops</span>
            </h1>
            <div className="hidden lg:flex items-center gap-12 text-[16px] font-black uppercase tracking-tight text-slate-700">
              <a href="/" className="hover:text-blue-600 transition uppercase tracking-widest">Home</a>
              
              {/* Features Dropdown */}
              <div className="relative group py-8 cursor-pointer">
                <button className="flex items-center gap-1.5 hover:text-blue-600 transition uppercase tracking-widest">Features</button>
                <div className="absolute top-[96px] -left-10 w-80 bg-white border-2 border-slate-100 shadow-2xl rounded-2xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-left">
                   <div className="space-y-6">
                      <div>
                         <h4 className="text-blue-600 text-xs font-[1000] tracking-widest uppercase">System Analytics</h4>
                         <p className="text-slate-500 text-sm normal-case font-medium mt-1">Real-time tracking for the Command Center.</p>
                      </div>
                      <div>
                         <h4 className="text-blue-600 text-xs font-[1000] tracking-widest uppercase">Engineer Dispatch</h4>
                         <p className="text-slate-500 text-sm normal-case font-medium mt-1">Automatic assignment system for fix operations.</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* How It Works Dropdown */}
              <div className="relative group py-8 cursor-pointer">
                <button className="flex items-center gap-1.5 hover:text-blue-600 transition uppercase tracking-widest">How It Works</button>
                <div className="absolute top-[96px] -left-10 w-80 bg-white border-2 border-slate-100 shadow-2xl rounded-2xl p-8 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-left">
                  <p className="text-slate-400 text-[10px] font-bold tracking-widest mb-4 uppercase">Operational Flow</p>
                  <ul className="space-y-4 normal-case tracking-normal">
                    <li className="flex gap-3"><span className="font-bold text-blue-600">01.</span> Log System Malfunction</li>
                    <li className="flex gap-3"><span className="font-bold text-blue-600">02.</span> SLA Timer Initialization</li>
                    <li className="flex gap-3"><span className="font-bold text-blue-600">03.</span> Unit Deployment & Resolution</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={() => navigate('/login')} 
              className="text-[15px] font-black text-slate-800 hover:text-blue-700 tracking-tight uppercase tracking-widest"
            >
              LOGIN
            </button>
            <button 
              onClick={() => navigate('/signup')} 
              className="bg-blue-700 hover:bg-blue-800 text-white text-[14px] font-black tracking-widest py-4 px-10 rounded-2xl shadow-2xl shadow-blue-200 transition-all active:scale-95 uppercase"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Section */}
      <main className="relative pt-52 pb-24">
        <div className="max-w-[1500px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          <div className="space-y-10 text-left">
            <div className="inline-block px-5 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-black tracking-[0.2em] uppercase border border-blue-100">
              ⚡ v1.0 Operational Infrastructure
            </div>
            <h2 className="text-7xl md:text-8xl font-[1000] tracking-tighter text-slate-900 leading-[0.9] drop-shadow-sm">
              The Command <br/> 
              <span className="text-blue-700 font-black italic text-nowrap text-[65px] md:text-8xl">Center Hub.</span>
            </h2>
            <p className="text-2xl text-slate-500 max-w-lg leading-relaxed font-medium">
              Multi-role facility management for aging Zord systems, engineering fixes, and real-time status updates.
            </p>
            <div className="pt-6 flex gap-6">
              <button 
                onClick={() => navigate('/signup')} 
                className="bg-slate-900 text-white font-black py-5 px-12 rounded-2xl shadow-2xl hover:bg-slate-800 transition-all hover:-translate-y-1 uppercase tracking-widest"
              >
                Initialize Ops
              </button>
              <button className="border-2 border-slate-200 font-black py-5 px-12 rounded-2xl hover:bg-slate-50 transition-all text-slate-800 uppercase tracking-widest">
                View Demo
              </button>
            </div>
          </div>

          {/* 🧊 Interactive 3D Live Feed Box */}
          <div className="relative flex justify-center">
            {/* Perspective Background Layer */}
            <div className="absolute top-10 left-10 w-full h-full bg-blue-600/5 rounded-[3rem] -rotate-6 scale-95 blur-sm border border-blue-100"></div>

            <div className="relative w-full max-w-lg aspect-[4/3] bg-white rounded-[2.5rem] shadow-[0_80px_100px_-40px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden transform perspective-[1500px] lg:rotate-y-[-20deg] rotate-x-[8deg] group hover:rotate-0 transition-all duration-1000">
               
               {/* UI Top Bar */}
               <div className="bg-slate-50 h-14 flex items-center px-8 border-b border-slate-100">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <div className="mx-auto text-[9px] font-mono text-slate-400 font-black tracking-[0.3em] uppercase">Facility_System_v1.0</div>
               </div>

               {/* Smooth Moving Content System */}
               <div className="p-10 h-full flex flex-col relative overflow-hidden">
                  <div className="mb-10 text-left">
                    <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase mb-1">Active Modules</p>
                    <div className="h-1 bg-blue-100 rounded-full w-12"></div>
                  </div>

                  <div className="flex-1 relative">
                    {projectModules.map((module, index) => (
                      <div 
                        key={index}
                        className={`absolute w-full flex flex-col gap-6 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                          activeTab === index 
                            ? 'opacity-100 scale-100 blur-0 translate-y-0 rotate-0' 
                            : 'opacity-0 scale-90 blur-md translate-y-12 -rotate-2 pointer-events-none'
                        }`}
                      >
                         <div className="flex items-center gap-6 text-left">
                            <div className={`${module.color} h-16 w-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-current/20`}>
                               {module.icon}
                            </div>
                            <div className="space-y-1">
                               <p className="text-[10px] font-mono font-black text-slate-400 tracking-widest">{module.label}</p>
                               <h3 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{module.title}</h3>
                            </div>
                         </div>
                         <p className="text-slate-500 font-medium text-lg border-l-4 border-blue-100 pl-4 py-2 italic text-left">{module.desc}</p>
                         
                         {/* Mock UI Progress Bar */}
                         <div className="flex gap-2">
                           <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                             <div className={`h-full ${module.color} animate-pulse`} style={{ width: '70%' }}></div>
                           </div>
                           <div className="h-2 w-12 bg-slate-100 rounded-full"></div>
                         </div>
                      </div>
                    ))}
                  </div>

                  {/* Modern Overlay Decor */}
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
               </div>
            </div>
            
            {/* Ambient Background Glow */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]"></div>
          </div>

        </div>
      </main>
    </div>
  );
};
export default Landing;