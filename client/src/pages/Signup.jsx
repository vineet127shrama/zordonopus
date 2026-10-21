import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const navigate = useNavigate();
    const [isOn, setIsOn] = useState(false); 
    const [isPulling, setIsPulling] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ranger' // Default set to ranger
    });

    const [adminKey, setAdminKey] = useState('');
    const secretKey = "ZORDON-2026"; 

    const handlePull = () => {
        setIsPulling(true);
        setTimeout(() => {
            setIsPulling(false);
            setIsOn(!isOn);
        }, 300);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Backend compatibility ke liye Role Capitalize kar rahe hain
        const formattedRole = formData.role.charAt(0).toUpperCase() + formData.role.slice(1);

        if (formData.role === 'admin' && adminKey !== secretKey) {
            alert("❌ Master Override Failed: Invalid Authorization Key");
            return;
        }

        try {
            setLoading(true);
            // 🟢 FIXED: '/signup' ko badal kar '/register' kar diya hai
            const res = await axios.post('http://localhost:5001/api/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formattedRole
            });

            if (res.data.success || res.status === 201) {
                alert(`✅ ${formattedRole} Unit Deployed Successfully!`);
                navigate('/login');
            }
        } catch (err) {
            console.error("Deployment Error:", err.response?.data || err.message);
            alert(err.response?.data?.message || err.response?.data?.msg || '🚨 Mission Aborted: System Conflict');
        } finally {
            setLoading(false);
        }
    };

    // Role-based color switching logic
    const getThemeColor = () => {
        if (formData.role === 'admin') return 'purple';
        if (formData.role === 'engineer') return 'emerald'; 
        return 'blue';
    };

    const theme = getThemeColor();

    return (
        <div className={`min-h-screen flex items-center justify-center transition-all duration-1000 font-sans relative overflow-hidden ${isOn ? 'bg-slate-50' : 'bg-[#0f172a]'}`}>
            
            {/* 🖥️ GIANT BACKGROUND TEXT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none overflow-hidden">
                <h1 className={`text-[15vw] font-black tracking-tighter uppercase leading-none transition-all duration-1000 ${isOn ? 'text-slate-200/50 scale-110 blur-sm' : 'text-white/5 scale-100 blur-none'}`}>
                    {isOn ? 'Operational' : 'System'}
                </h1>
                <h1 className={`text-[15vw] font-black tracking-tighter uppercase leading-none transition-all duration-1000 ${isOn ? 'text-blue-200/30 scale-110 blur-sm' : 'text-white/5 scale-100 blur-none'}`}>
                    {isOn ? 'Command' : 'Offline'}
                </h1>
            </div>

            {/* 🧵 THE INTERACTIVE LAMP THREAD */}
            <div className="absolute right-16 top-0 z-50 flex flex-col items-center text-center">
                <div className={`w-1 transition-all duration-500 origin-top rounded-full ${isOn ? `bg-${theme}-600 shadow-[0_0_15px_rgba(0,0,0,0.2)]` : 'bg-slate-700'} ${isPulling ? 'h-[400px]' : 'h-72'}`}></div>
                <div 
                    onMouseDown={handlePull} 
                    className={`w-12 h-12 rounded-2xl cursor-pointer flex items-center justify-center shadow-2xl transform transition-all duration-300 border-2 ${isOn ? 'bg-white border-slate-100 text-slate-900 rotate-180' : 'bg-slate-800 border-slate-700 text-slate-500'} ${isPulling ? 'translate-y-24 scale-90' : 'hover:scale-110 active:scale-95'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7-7-7"></path></svg>
                </div>
                <p className={`mt-6 text-[11px] font-black tracking-[0.3em] uppercase rotate-90 origin-center ${isOn ? 'text-slate-900' : 'text-slate-500'}`}>{isOn ? 'CLOSE_PORTAL' : 'INITIALIZE_UNITS'}</p>
            </div>

            {/* 🚪 ENROLLMENT CARD */}
            <div className={`relative z-10 w-full max-w-5xl bg-white p-12 md:p-16 rounded-[3.5rem] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isOn ? 'scale-100 opacity-100 translate-y-0 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.15)] border-2 border-slate-50' : 'scale-90 opacity-0 translate-y-32 blur-2xl pointer-events-none'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8 text-center md:text-left">
                        <div>
                            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black mb-8 shadow-xl transition-colors duration-500 bg-slate-900`}>Z</div>
                            <h2 className="text-5xl font-[1000] text-slate-900 tracking-tighter leading-tight uppercase">Unit <br/><span className={`text-${theme}-600 italic`}>Enrollment</span></h2>
                            <p className="text-slate-500 text-base font-medium leading-relaxed mt-6 italic">"Rangers report the glitches. Engineers provide the fixes."</p>
                        </div>
                        <div className={`p-6 border rounded-[2rem] space-y-2 transition-colors bg-slate-50 border-slate-100`}>
                            <p className={`text-[10px] font-black tracking-widest uppercase underline underline-offset-4 text-slate-900`}>Security Status</p>
                            <p className="text-[12px] text-slate-600 leading-tight font-bold">Level 4 Encryption active. Role-based access will be strictly enforced.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter Identity" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-semibold" />
                        </div>

                        {/* 🛠️ ROLE SELECTION DROPDOWN */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unit Classification</label>
                            <div className="relative">
                                <select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-bold text-slate-900 cursor-pointer appearance-none"
                                >
                                    <option value="ranger">FIELD RANGER (Report Issues)</option>
                                    <option value="engineer">OPS ENGINEER (Resolve Issues)</option>
                                    <option value="admin">SYSTEM ADMIN (Full Control)</option>
                                </select>
                                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {formData.role === 'admin' && (
                            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-500">
                                <label className="text-[10px] font-black text-purple-600 uppercase tracking-widest ml-1">Authorization Key</label>
                                <input type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} placeholder="ZORDON-XXXX" className="w-full px-6 py-4 bg-purple-50 border-2 border-purple-200 rounded-2xl focus:outline-none focus:border-purple-600 focus:bg-white transition-all font-semibold text-center" />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="mnnit@zordon.ops" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-semibold" />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="••••••••" className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-slate-900 focus:bg-white transition-all font-semibold" />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading || (formData.role === 'admin' && adminKey !== secretKey)} 
                            className={`w-full py-5 rounded-2xl uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 mt-4 font-black text-white ${loading || (formData.role === 'admin' && adminKey !== secretKey) ? 'bg-slate-300 cursor-not-allowed' : 'bg-slate-900 hover:bg-black'}`}
                        >
                            {loading ? 'Processing...' : `Initialize Deployment`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;