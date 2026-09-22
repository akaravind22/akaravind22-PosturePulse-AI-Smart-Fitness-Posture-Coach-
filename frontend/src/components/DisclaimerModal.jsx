import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

export const DisclaimerBanner = () => {
  return (
    <div className="bg-slate-900/90 border-t border-b border-slate-800 py-3 px-4 text-center">
      <div className="max-w-5xl mx-auto flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>
          <strong className="text-slate-200">HealthTech Notice:</strong> PosturePulse AI provides fitness & wellness exercise posture guidance only. It is not intended for medical diagnosis, injury treatment, or medical advice.
        </span>
      </div>
    </div>
  );
};
