import React from 'react';
import { Award, Clock, Repeat, Compass, Activity } from 'lucide-react';

export const WorkoutStats = ({
  reps = 0,
  postureScore = 100,
  stage = 'READY',
  currentAngle = 0,
  duration = '00:00',
  correctReps = 0,
  incorrectReps = 0,
}) => {
  const getScoreColor = (score) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getStageBadge = (stg) => {
    switch (stg) {
      case 'DOWN':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'UP':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Rep Count */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Rep Count</span>
          <Repeat className="w-4 h-4 text-cyan-400" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="text-4xl font-extrabold font-['Outfit'] text-white tracking-tight">{reps}</span>
          <div className="text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold">{correctReps}✓</span> /{' '}
            <span className="text-rose-400 font-semibold">{incorrectReps}⚠</span>
          </div>
        </div>
      </div>

      {/* Posture Score */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Posture Score</span>
          <Award className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-4xl font-extrabold font-['Outfit'] text-white tracking-tight">
            {postureScore}%
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(postureScore)}`}>
            {postureScore >= 85 ? 'Excellent' : postureScore >= 70 ? 'Good' : 'Correction'}
          </span>
        </div>
      </div>

      {/* Stage & Angle */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Stage & Angle</span>
          <Compass className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className={`px-3 py-1 rounded-lg text-sm font-bold border ${getStageBadge(stage)}`}>
            {stage}
          </span>
          <span className="text-xl font-bold font-['Outfit'] text-slate-200">
            {currentAngle > 0 ? `${currentAngle}°` : '--'}
          </span>
        </div>
      </div>

      {/* Workout Duration */}
      <div className="p-4 rounded-2xl glass-card border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Workout Duration</span>
          <Clock className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2">
          <span className="text-4xl font-extrabold font-['Outfit'] text-purple-300 tracking-tight">
            {duration}
          </span>
        </div>
      </div>
    </div>
  );
};
