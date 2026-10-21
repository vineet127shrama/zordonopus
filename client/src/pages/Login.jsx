import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [isOn, setIsOn] = useState(false); 
    const [isPulling, setIsPulling] = useState(false);
    const [loading, setLoading] = useState(false); 

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

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
        setLoading(true);

        try {
            console.log("Authenticating Unit...", formData.email);
            
            // 📡 Backend Request - Port 5001
            const res = await axios.post('http://localhost:5001/api/auth/login', formData);
            
            // ✅ Successful Response
            if (res.data.success) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));

                alert(`🚀 Access Granted: Welcome back, ${res.data.user.name}!`);
                
                // 🛰️ Navigating to Dashboard
                navigate('/dashboard'); 
            }
        } catch (err) {
            // ❌ FIXED: Backend se aane wale 'message' property ko catch kiya hai
            const errorMsg = err.response?.data?.message || err.response?.data?.msg || '❌ Access Denied: Connection Conflict';
            console.error("Auth Error Trace:", err.response?.data || err.message);
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center transition-all duration-1000 font-sans relative overflow-hidden ${isOn ? 'bg-slate-50' : 'bg-[#1e293b]'}`}>
            
            {/* 🧵 THE INTERACTIVE LAMP THREAD */}
            <div className="absolute right-16 top-0 z-50 flex flex-col items-center text-center">
                <div className={`w-1 transition-all duration-500 origin-top rounded-full ${isOn ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-slate-600'} ${isPulling ? 'h-[400px]' : 'h-72'}`}></div>
                
                <div 
                    onMouseDown={handlePull}
                    className={`w-12 h-12 rounded-2xl cursor-pointer flex items-center justify-center shadow-2xl transform transition-all duration-300 border-2 ${isOn ? 'bg-white border-blue-100 text-blue-600 rotate-180' : 'bg-slate-800 border-slate-700 text-slate-400'} ${isPulling ? 'translate-y-24 scale-90' : 'hover:scale-110 active:scale-95'}`}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7-7-7"></path>
                    </svg>
                </div>
                <p className={`mt-6 text-[11px] font-black tracking-[0.3em] uppercase rotate-90 origin-center ${isOn ? 'text-blue-600' : 'text-slate-500'}`}>
                    {isOn ? 'Deactivate' : 'Initialize_Power'}
                </p>
            </div>

            {/* 💡 THE SYSTEM GLOW */}
            {isOn && (
                <>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-100/50 rounded-full blur-[180px] animate-pulse text-center"></div>
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `radial-gradient(#1e293b 2px, transparent 2px)`, backgroundSize: '30px 30px' }}></div>
                </>
            )}

            {/* 🚪 ENHANCED LOGIN WINDOW */}
            <div className={`
                relative z-10 w-full max-w-2xl bg-white p-12 md:p-16 rounded-[3rem] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]
                ${isOn 
                    ? 'scale-100 opacity-100 translate-y-0 shadow-[0_80px_150px_-30px_rgba(0,0,0,0.15)] border-2 border-slate-100' 
                    : 'scale-90 opacity-0 translate-y-32 blur-2xl pointer-events-none'
                }
            `}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 border-b md:border-b-0 md:border-r border-slate-100 pb-8 md:pb-0 md:pr-12 text-left">
                        <div className="h-14 w-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-200 font-black">Z</div>
                        <h2 className="text-4xl font-[1000] text-slate-900 tracking-tighter leading-none uppercase">
                            CENTRAL <br/>
                            <span className="text-blue-600">COMMAND</span>
                        </h2>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                            Access the ZordonOps portal to resolve critical malfunctions.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access ID</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                required
                                placeholder="mnnit_ranger@ops" 
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                            />
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Encryption Key</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                required
                                placeholder="••••••••" 
                                className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-50 rounded-2xl focus:outline-none focus:border-blue-600 focus:bg-white transition-all font-semibold"
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`w-full bg-slate-900 hover:bg-blue-700 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-[11px] shadow-2xl transition-all hover:-translate-y-1 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Verifying...' : 'Authorize Access'}
                        </button>
                    </form>
                </div>

                <div className="mt-12 pt-8 border-t border-slate-50 flex justify-between items-center">
                    <span onClick={() => navigate('/signup')} className="text-[10px] font-black text-slate-400 hover:text-blue-600 cursor-pointer transition-colors uppercase tracking-widest">
                        New Unit? Enroll here
                    </span>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Encrypted Connection</p>
                </div>
            </div>

            {!isOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-10 text-center">
                    <h1 className="text-white font-black text-[12vw] tracking-tighter uppercase leading-none">System</h1>
                    <h1 className="text-white font-black text-[12vw] tracking-tighter uppercase leading-none">Offline</h1>
                </div>
            )}
        </div>
    );
};

export default Login;