import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, LayoutDashboard } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center px-4 text-center">
      <div className="space-y-6 max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
          <Activity className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black font-['Outfit'] text-white">404</h1>
        <h2 className="text-xl font-bold font-['Outfit'] text-slate-200">Page Not Found</h2>
        <p className="text-sm text-slate-400">
          The fitness page or camera route you requested does not exist.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <LayoutDashboard className="w-4 h-4" /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
};
