import React, { useState } from 'react';
import { Logo } from './Logo';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [cnic, setCnic] = useState('');
  const [password, setPassword] = useState('');

  const handleDemoCitizen = () => {
    onLogin({ cnic: '12345-6789012-3', role: 'citizen', name: 'Ahmed Khan' });
  };

  const handleDemoOfficer = () => {
    onLogin({ cnic: 'OFFICER-001', role: 'officer', name: 'Officer Sarah' });
  };

  const handleStandardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cnic.includes('OFFICER')) {
      handleDemoOfficer();
    } else {
      handleDemoCitizen();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden font-sans text-slate-900 border-8 border-slate-100">
      {/* Header */}
      <header className="w-full h-20 px-6 md:px-12 flex items-center justify-between border-b border-slate-100 bg-white">
        <Logo withText={true} />
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">System Status</span>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono text-slate-600 uppercase">K8S-Cluster: Healthy</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-row items-center justify-center bg-slate-50 relative">
        {/* Decorative Microservices Visualization (Static) */}
        <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden hidden md:block">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 p-8 w-full h-full">
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">AUTH</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">CORE</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">DBMS</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">REDIS</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">S3-ST</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">API-GW</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">PROM</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">GFNA</div>
            {/* Repeated for effect */}
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">AUTH</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">CORE</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">DBMS</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">REDIS</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">S3-ST</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">API-GW</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">PROM</div>
            <div className="border-2 border-slate-900 rounded-lg p-4 flex flex-col items-center justify-center">GFNA</div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl shadow-slate-200/50 border border-slate-200 p-8 md:p-10 z-10 m-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#002147]">Login to Portal</h2>
            <p className="text-slate-500 text-sm mt-2">Access your digital government profile using your official identification credentials.</p>
          </div>

          <form onSubmit={handleStandardSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">National CNIC Number</label>
              <input
                type="text"
                placeholder="00000-0000000-0"
                className="w-full h-12 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147] transition-all placeholder:text-slate-300"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Secure Password</label>
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full h-12 px-4 border border-slate-200 rounded-lg bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002147] transition-all placeholder:text-slate-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-[#002147] text-white font-bold rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#002147]/20 mt-8"
            >
              Secure Login
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-4">Select Demo Access Mode</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDemoCitizen}
                className="flex items-center justify-center h-12 bg-white border border-[#002147] text-[#002147] text-xs font-bold rounded-lg hover:bg-slate-50 transition-all"
              >
                Public Citizen
              </button>
              <button
                onClick={handleDemoOfficer}
                className="flex items-center justify-center h-12 bg-white border border-[#002147] text-[#002147] text-xs font-bold rounded-lg hover:bg-slate-50 transition-all"
              >
                Government Officer
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary (Dashboard Preview) */}
        <div className="absolute bottom-12 right-12 w-64 bg-slate-900 text-white rounded-lg p-6 flex-col gap-4 shadow-xl z-10 hidden lg:flex">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-400">System Metrics</span>
            <span className="text-[10px] font-mono text-emerald-400">LIVE</span>
          </div>
          <div className="flex justify-between items-end">
            <div className="text-2xl font-mono">99.9%</div>
            <div className="text-[10px] text-slate-500 uppercase pb-1">Uptime</div>
          </div>
          <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-[92%]"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400 uppercase">Active Clusters</span>
              <span className="font-mono">14/14</span>
            </div>
            <div className="flex justify-between text-[10px]">
              <span className="text-slate-400 uppercase">In-Flight Tasks</span>
              <span className="font-mono">1,248</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full h-12 px-6 md:px-12 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 uppercase tracking-widest font-medium bg-white shrink-0">
        <div className="hidden sm:block">Ministry of Information Technology & Telecommunication</div>
        <div className="sm:hidden">&copy; {new Date().getFullYear()} Gov Portal</div>
        <div className="flex gap-4 md:gap-8">
          <a href="#" className="hover:text-[#002147] transition-colors">Security</a>
          <a href="#" className="hover:text-[#002147] transition-colors">Terms</a>
          <a href="#" className="hover:text-[#002147] transition-colors hidden sm:block">Support</a>
        </div>
      </footer>
    </div>
  );
};
