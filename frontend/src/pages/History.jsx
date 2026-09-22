import React, { useState, useEffect } from 'react';
import { workoutService } from '../services/workoutService';
import { History as HistoryIcon, Dumbbell, Calendar, Clock, Award, Filter, RefreshCw } from 'lucide-react';

export const History = () => {
  const [workouts, setWorkouts] = useState([
    {
      workout_id: 1,
      exercise_name: 'Squat',
      muscle_group: 'Legs / Lower Body',
      duration_seconds: 145,
      total_reps: 20,
      correct_reps: 18,
      incorrect_reps: 2,
      posture_score: 91,
      workout_date: '2026-09-22T10:00:00Z',
    },
    {
      workout_id: 2,
      exercise_name: 'Bicep Curl',
      muscle_group: 'Arms',
      duration_seconds: 110,
      total_reps: 18,
      correct_reps: 16,
      incorrect_reps: 2,
      posture_score: 88,
      workout_date: '2026-09-21T15:30:00Z',
    },
  ]);

  const [filterExercise, setFilterExercise] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await workoutService.getWorkouts();
        if (res.success && res.workouts) {
          setWorkouts(res.workouts);
        }
      } catch (err) {
        console.warn('Using default history list:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const filteredWorkouts = workouts.filter((w) => {
    if (filterExercise === 'All') return true;
    return w.exercise_name?.toLowerCase() === filterExercise.toLowerCase();
  });

  const formatDuration = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <HistoryIcon className="w-3.5 h-3.5" /> MYSQL WORKOUT DATABASE LOGS
          </div>
          <h1 className="text-3xl font-extrabold font-['Outfit'] text-white mt-1">Workout History</h1>
        </div>

        {/* Exercise Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterExercise}
            onChange={(e) => setFilterExercise(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-cyan-500"
          >
            <option value="All">All Exercises</option>
            <option value="Squat">Squat</option>
            <option value="Bicep Curl">Bicep Curl</option>
            <option value="Lunge">Lunge</option>
            <option value="Push-Up">Push-Up</option>
          </select>
        </div>
      </div>

      {/* History Table / Card List */}
      <div className="space-y-4">
        {filteredWorkouts.length === 0 ? (
          <div className="p-12 text-center glass-card rounded-2xl border border-slate-800 space-y-3">
            <Dumbbell className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white font-['Outfit']">No Saved Workouts Found</h3>
            <p className="text-xs text-slate-400">Complete an AI camera workout session to start logging history.</p>
          </div>
        ) : (
          filteredWorkouts.map((wk) => (
            <div
              key={wk.workout_id}
              className="p-5 rounded-2xl glass-card border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 font-extrabold font-['Outfit'] text-lg flex items-center justify-center border border-cyan-500/20">
                  {wk.exercise_name?.charAt(0) || 'E'}
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-white">{wk.exercise_name}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                      {new Date(wk.workout_date).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {formatDuration(wk.duration_seconds)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800/80 justify-between md:justify-end">
                <div className="text-left md:text-right">
                  <span className="block text-sm font-bold text-white font-['Outfit']">{wk.total_reps} reps</span>
                  <span className="text-[10px] text-slate-400">
                    <strong className="text-emerald-400">{wk.correct_reps}✓</strong> / <strong className="text-rose-400">{wk.incorrect_reps}⚠</strong>
                  </span>
                </div>

                <div className="text-right pl-4 border-l border-slate-800">
                  <span className="block text-xl font-extrabold font-['Outfit'] text-emerald-400">
                    {Math.round(wk.posture_score)}%
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Form Score</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
