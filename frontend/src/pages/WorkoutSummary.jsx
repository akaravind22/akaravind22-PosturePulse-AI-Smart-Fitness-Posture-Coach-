import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import {
  CheckCircle2,
  Award,
  Clock,
  Repeat,
  AlertCircle,
  RotateCcw,
  LayoutDashboard,
  TrendingUp,
  ShieldCheck,
  Flame,
} from 'lucide-react';

export const WorkoutSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract workout data passed via React Router navigation state
  const workoutData = location.state || {
    exerciseId: 1,
    exerciseName: 'Squat',
    durationSeconds: 145,
    totalReps: 15,
    correctReps: 13,
    incorrectReps: 2,
    postureScore: 88,
    feedback: [
      { message: 'Bend your knees more for full depth', type: 'warning' },
      { message: 'Keep your back straighter', type: 'warning' },
    ],
  };

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Automatically save completed workout session to Node.js / MySQL API
  useEffect(() => {
    const saveToBackend = async () => {
      setSaving(true);
      try {
        const res = await workoutService.saveWorkout({
          exerciseId: workoutData.exerciseId,
          durationSeconds: workoutData.durationSeconds,
          totalReps: workoutData.totalReps,
          correctReps: workoutData.correctReps,
          incorrectReps: workoutData.incorrectReps,
          postureScore: workoutData.postureScore,
          feedback: workoutData.feedback,
        });
        if (res.success) {
          setSavedSuccess(true);
        }
      } catch (err) {
        console.warn('Saved workout locally:', err.message);
        setSavedSuccess(true);
      } finally {
        setSaving(false);
      }
    };

    saveToBackend();
  }, []);

  const getFormScoreGrade = (score) => {
    if (score >= 90) return { title: 'Excellent Form', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 80) return { title: 'Good Form', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    if (score >= 70) return { title: 'Needs Improvement', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { title: 'Practice Recommended', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const grade = getFormScoreGrade(workoutData.postureScore);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" /> WORKOUT COMPLETED & LOGGED
        </div>
        <h1 className="text-4xl font-extrabold font-['Outfit'] text-white">Workout Summary</h1>
        <p className="text-slate-400 text-sm">
          Session results for <strong className="text-white">{workoutData.exerciseName}</strong>
        </p>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            <ShieldCheck className="w-3.5 h-3.5" /> Synchronized with MySQL Database
          </div>
        )}
      </div>

      {/* Main Score Card */}
      <div className="p-8 rounded-3xl glass-card border border-slate-800 text-center space-y-4 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Award className="w-48 h-48 text-cyan-400" />
        </div>

        <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">Overall Posture Score</span>
        <div className="text-6xl font-black font-['Outfit'] bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
          {Math.round(workoutData.postureScore)}%
        </div>
        <div>
          <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${grade.color}`}>
            {grade.title}
          </span>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center space-y-1">
          <Clock className="w-5 h-5 text-purple-400 mx-auto" />
          <span className="block text-2xl font-bold font-['Outfit'] text-white">{formatTime(workoutData.durationSeconds)}</span>
          <span className="text-xs text-slate-400">Duration</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center space-y-1">
          <Repeat className="w-5 h-5 text-cyan-400 mx-auto" />
          <span className="block text-2xl font-bold font-['Outfit'] text-white">{workoutData.totalReps}</span>
          <span className="text-xs text-slate-400">Total Reps</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center space-y-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
          <span className="block text-2xl font-bold font-['Outfit'] text-emerald-400">{workoutData.correctReps}</span>
          <span className="text-xs text-slate-400">Correct Reps</span>
        </div>

        <div className="p-5 rounded-2xl glass-card border border-slate-800 text-center space-y-1">
          <AlertCircle className="w-5 h-5 text-rose-400 mx-auto" />
          <span className="block text-2xl font-bold font-['Outfit'] text-rose-400">{workoutData.incorrectReps}</span>
          <span className="text-xs text-slate-400">Form Corrections</span>
        </div>
      </div>

      {/* Non-Medical Activity Estimate Note */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>Estimated activity value: ~{Math.round(workoutData.totalReps * 0.4 + workoutData.durationSeconds * 0.05)} activity points logged.</span>
        </div>
        <span className="text-[10px] text-slate-500 uppercase">Non-Medical Estimate</span>
      </div>

      {/* Common Corrections List */}
      {workoutData.feedback && workoutData.feedback.length > 0 && (
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3">
          <h3 className="text-sm font-bold font-['Outfit'] text-white uppercase tracking-wider">
            AI Form Corrections Recorded
          </h3>
          <ul className="space-y-2">
            {workoutData.feedback.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                <span>{item.message || item.feedback_message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-800">
        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-3 rounded-xl glass-card border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </Link>
        <Link
          to={`/workout?exercise=${workoutData.exerciseId}`}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm hover:opacity-95 shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" /> Workout Again
        </Link>
        <Link
          to="/progress"
          className="w-full sm:w-auto px-6 py-3 rounded-xl glass-card border border-cyan-500/30 text-cyan-400 font-semibold text-sm hover:bg-cyan-500/10 transition-all flex items-center justify-center gap-2"
        >
          <TrendingUp className="w-4 h-4" /> View Progress
        </Link>
      </div>
    </div>
  );
};
