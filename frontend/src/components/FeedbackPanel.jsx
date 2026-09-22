import React from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles } from 'lucide-react';

export const FeedbackPanel = ({ feedbackMessage, feedbackType = 'info' }) => {
  const getStyle = (type) => {
    switch (type) {
      case 'positive':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 shadow-emerald-500/10',
          iconBg: 'bg-emerald-500/20 text-emerald-400',
          Icon: CheckCircle2,
          badge: 'Form Match',
        };
      case 'warning':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-amber-500/10',
          iconBg: 'bg-amber-500/20 text-amber-400',
          Icon: AlertCircle,
          badge: 'Posture Correction',
        };
      default:
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-cyan-500/10',
          iconBg: 'bg-cyan-500/20 text-cyan-400',
          Icon: Info,
          badge: 'Camera Guidance',
        };
    }
  };

  const style = getStyle(feedbackType);
  const Icon = style.Icon;

  return (
    <div
      className={`p-4 rounded-2xl border backdrop-blur-md transition-all shadow-lg flex items-center justify-between gap-4 ${style.bg}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${style.iconBg} flex-shrink-0`}>
          <Icon className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase font-bold tracking-wider opacity-80">
              AI Real-Time Feedback
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900/60 border border-current opacity-90">
              {style.badge}
            </span>
          </div>
          <p className="text-sm font-semibold mt-0.5 font-['Plus_Jakarta_Sans']">
            {feedbackMessage || 'Position your body in the webcam frame to begin.'}
          </p>
        </div>
      </div>
      <Sparkles className="w-5 h-5 opacity-40 flex-shrink-0" />
    </div>
  );
};
