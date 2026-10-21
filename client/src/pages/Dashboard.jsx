import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 🟢 NEW: SLA Timer Component
const SLATimer = ({ deadline, status }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (status === 'Resolved') {
      setTimeLeft("COMPLETED");
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(deadline).getTime() - now;

      if (distance < 0) {
        setTimeLeft("BREACHED ⚠️");
        clearInterval(timer);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, status]);

  return (
    <div className={`px-2 py-1 rounded border flex flex-col items-center min-w-[85px] ${
      timeLeft === "BREACHED ⚠️" ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-50 border-slate-200 text-slate-500"
    }`}>
      <span className="text-[7px] font-black uppercase tracking-tighter">SLA_REMAINING</span>
      <span className="text-[9px] font-black font-mono tracking-tight">{timeLeft}</span>
    </div>
  );
};

// ─── Sub-components Update ────────────────────────────────────────

const SidebarLink = ({ icon, label, active, count, countColor }) => (
  <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${active ? 'bg-slate-900 text-white font-bold shadow-lg shadow-slate-200' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-bold'}`}>
    <span className="text-base">{icon}</span>
    <span className="text-[11px] uppercase tracking-tight flex-1">{label}</span>
    {count !== undefined && <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${countColor === 'red' ? 'bg-red-600 text-white' : 'bg-amber-500 text-white'}`}>{count}</span>}
  </div>
);

const StatCard = ({ label, value, sub, accentColor, subColor, icon }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden shadow-sm">
    <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ background: accentColor }} />
    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{label}</p>
    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{value}</h4>
    <p className="text-[10px] mt-2 flex items-center gap-1 font-black uppercase italic" style={{ color: subColor }}><span>{icon}</span> {sub}</p>
  </div>
);

const PriorityBadge = ({ priority }) => {
  const map = { Critical: 'bg-red-600 text-white', High: 'bg-slate-900 text-white', Medium: 'bg-blue-600 text-white', Low: 'bg-slate-100 text-slate-900 border border-slate-200' };
  return <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md ${map[priority]}`}>{priority}</span>;
};

const SlaBadge = ({ status }) => {
  const map = { 'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200', 'In Progress': 'bg-amber-100 text-amber-700 border-amber-200', 'Open': 'bg-blue-50 text-blue-700 border-blue-200' };
  return <span className={`text-[9px] px-2.5 py-1 rounded-md font-black uppercase tracking-wider border ${map[status]}`}>{status === 'In Progress' ? 'Fixing' : status}</span>;
};

const TicketRow = ({ ticket, onAssign, onResolve, userRole }) => {
  const isAdmin = userRole === 'Admin';
  const isEngineer = userRole === 'Engineer';

  return (
    <div className="flex items-center gap-4 px-4 py-4 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all group">
      <PriorityBadge priority={ticket.priority} />
      <div className="flex-1 min-w-0">
        <span className="text-[13px] text-slate-900 font-bold block truncate group-hover:text-blue-600">{ticket.title}</span>
        <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter italic">By: {ticket.reportedBy} | Assigned: {ticket.assignedTo}</p>
      </div>
      
      <div className="flex items-center gap-4 shrink-0">
        {/* 🟢 Timer integrated here */}
        <SLATimer deadline={ticket.deadline} status={ticket.status} />
        <SlaBadge status={ticket.status} />

        {isAdmin && ticket.status === 'Open' && (
           <button onClick={(e) => { e.stopPropagation(); onAssign(ticket._id); }} className="bg-blue-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-all shadow-lg">Assign Fix</button>
        )}

        {isEngineer && ticket.status === 'In Progress' && (
          <button onClick={(e) => { e.stopPropagation(); onResolve(ticket._id); }} className="bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-all shadow-lg">Resolve Fix</button>
        )}
      </div>
    </div>
  );
};

const DonutChart = ({ open, inProgress, resolved }) => {
  const total = open + inProgress + resolved;
  const r = 46;
  const circ = 2 * Math.PI * r;
  const openDash = total === 0 ? 0 : (open / total) * circ;
  const progDash = total === 0 ? 0 : (inProgress / total) * circ;
  const resDash = total === 0 ? 0 : (resolved / total) * circ;
  let offset = 0;
  const segments = [[openDash, '#2563EB', offset], [progDash, '#F59E0B', (offset += openDash)], [resDash, '#10B981', (offset += progDash)]];

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#F8FAFC" strokeWidth="16" />
          {segments.map(([dash, color, off], i) => (
            <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="16" strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-off} transform="rotate(-90 60 60)" />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-black text-slate-900 tracking-tighter">{total}</span><span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Total</span></div>
      </div>
      <div className="w-full space-y-3">
        {[{ color: 'bg-blue-600', label: 'OPEN_INCIDENTS', val: open }, { color: 'bg-amber-500', label: 'IN_REPAIR', val: inProgress }, { color: 'bg-emerald-500', label: 'COMPLETED', val: resolved }].map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-wider"><span className={`w-2 h-2 rounded-sm ${item.color}`} /><span className="flex-1">{item.label}</span><span className="text-slate-900 font-bold">{item.val}</span></div>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Medium' });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!loggedInUser || !token) {
      navigate('/login');
    } else {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      fetchTickets(parsedUser);
    }
  }, [navigate]);

  const fetchTickets = async (currUser) => {
    try {
      const res = await axios.get('http://localhost:5001/api/issues');
      let data = res.data.data;
      if (currUser.role === 'Ranger') { data = data.filter(t => t.reportedBy === currUser.name); } 
      else if (currUser.role === 'Engineer') { data = data.filter(t => t.assignedTo === currUser.name); }
      setTickets(data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/api/issues/create', { ...formData, reportedBy: user.name });
      setIsModalOpen(false);
      fetchTickets(user);
    } catch (err) { alert("❌ SYSTEM_ERROR"); } 
    finally { setLoading(false); }
  };

  const handleAssign = async (ticketId) => {
    const engName = prompt("Deploy Engineer:");
    if (!engName) return;
    try {
      await axios.put(`http://localhost:5001/api/issues/assign/${ticketId}`, { engineerName: engName });
      fetchTickets(user);
    } catch (err) { alert("❌ ASSIGN_FAILED"); }
  };

  const handleResolve = async (ticketId) => {
    if (!window.confirm("Confirm system repair completed?")) return;
    try {
      await axios.put(`http://localhost:5001/api/issues/resolve/${ticketId}`);
      fetchTickets(user);
    } catch (err) { alert("❌ RESOLVE_FAILED"); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  if (!user) return <div className="h-screen bg-slate-950 flex items-center justify-center text-blue-500 font-black italic tracking-widest animate-pulse">INIT_HUB_LINK...</div>;

  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900 p-3 relative">
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] border border-slate-200 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-900 uppercase italic tracking-tight">Raise New Incident</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 font-bold text-2xl">×</button>
            </div>
            <form className="p-8 space-y-5" onSubmit={handleCreateIssue}>
              <div className="space-y-1 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">System Subject</label><input type="text" placeholder="e.g. Teleport Pad Misfire" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm" onChange={(e) => setFormData({...formData, title: e.target.value})} required /></div>
              <div className="space-y-1 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Severity</label><select className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm appearance-none" onChange={(e) => setFormData({...formData, priority: e.target.value})}><option value="Low">LOW_PRIORITY</option><option value="Medium">MEDIUM_STABILITY</option><option value="High">HIGH_CRITICAL</option><option value="Critical">ULTRA_EMERGENCY</option></select></div>
              <div className="space-y-1 text-left"><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Diagnostic Details</label><textarea placeholder="Describe the malfunction..." className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-sm min-h-[100px]" onChange={(e) => setFormData({...formData, description: e.target.value})} required /></div>
              <button type="submit" disabled={loading} className={`w-full bg-slate-900 text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-lg hover:bg-blue-600 transition-all ${loading ? 'opacity-50' : ''}`}>{loading ? 'LOGGING_INCIDENT...' : 'Deploy Fix Request'}</button>
            </form>
          </div>
        </div>
      )}

      <aside className="w-60 shrink-0 bg-[#0F172A] rounded-[2.5rem] flex flex-col shadow-2xl border border-slate-800">
        <div className="px-8 py-10 flex items-center gap-4"><div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 text-white text-xl font-black italic">Z</div><div><p className="text-[12px] font-black text-white uppercase italic tracking-tighter">Command Hub</p><p className="text-[9px] text-blue-500 font-bold uppercase tracking-widest">{user.role} Unit</p></div></div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto"><p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 pb-3">Facility Functions</p><SidebarLink icon="📊" label="Control Center" active /><SidebarLink icon="🎫" label="Incident Stream" count={tickets.length} countColor="red" /><SidebarLink icon="⚡" label="Raise Alert" /><p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-4 pb-3 pt-6">Resources</p><SidebarLink icon="🔧" label="Engineering" /><SidebarLink icon="⏱️" label="SLA Tracker" count="2" countColor="amber" /><SidebarLink icon="📈" label="Analytics" /></nav>
        <div className="p-4 mt-auto"><div className="bg-slate-800/50 rounded-[2rem] px-4 py-4 border border-slate-700/50 flex items-center gap-3"><div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-black shadow-inner">{user.name.charAt(0).toUpperCase()}</div><div className="flex-1 min-w-0"><p className="text-[11px] font-black text-white truncate uppercase italic">{user.name}</p><p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Level Access</p></div><button onClick={handleLogout} className="text-slate-500 hover:text-red-400 text-lg">🚪</button></div></div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden ml-4">
        <header className="h-20 bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-white px-10 flex items-center justify-between shrink-0 shadow-sm mb-4"><div><h1 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-none">{user.role}_Console</h1><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{today}</p></div>{(user.role === 'Admin' || user.role === 'Ranger') && (<button onClick={() => setIsModalOpen(true)} className="bg-slate-900 text-white px-8 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 shadow-xl transition-all">+ New Incident</button>)}</header>
        <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-6">
          <div className="grid grid-cols-4 gap-5">
            <StatCard label="Pending" value={tickets.filter(t => t.status === 'Open').length} sub="Active Queue" accentColor="#2563EB" subColor="#2563EB" icon="!" />
            <StatCard label="In_Repair" value={tickets.filter(t => t.status === 'In Progress').length} sub="Resources deployed" accentColor="#F59E0B" subColor="#B45309" icon="⚙" />
            <StatCard label="Completed" value={tickets.filter(t => t.status === 'Resolved').length} sub="System optimized" accentColor="#10B981" subColor="#15803D" icon="✓" />
            <StatCard label="SLA_Status" value={tickets.filter(t => t.priority === 'Critical' && t.status === 'Open').length} sub="High Attention" accentColor="#EF4444" subColor="#B91C1C" icon="⚠" />
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8 px-2">{user.role === 'Admin' ? 'Global Incident Stream' : user.role === 'Engineer' ? 'Assigned Tasks' : 'Personal Reports'}</h2>
              <div className="space-y-2">
                {tickets.length > 0 ? (tickets.map((t) => <TicketRow key={t._id} ticket={t} onAssign={handleAssign} onResolve={handleResolve} userRole={user.role} />)) : (<p className="text-center py-10 font-bold text-slate-300 italic uppercase tracking-widest">No active logs detected.</p>)}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Sector Load Profile</h2>
              <DonutChart open={tickets.filter(t => t.status === 'Open').length} inProgress={tickets.filter(t => t.status === 'In Progress').length} resolved={tickets.filter(t => t.status === 'Resolved').length} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;