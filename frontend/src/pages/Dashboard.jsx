import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { workoutService } from '../services/workoutService';
import { generateCoachRecommendations } from '../utils/recommendations';
import { StatCard } from '../components/StatCard';
import {
  Activity,
  Dumbbell,
  Award,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalWorkouts: 12,
    totalReps: 326,
    averageFormScore: 86,
    totalDurationSeconds: 16500, // ~4h 35m
    recentWorkouts: [
      { workout_id: 1, exercise_name: 'Squat', total_reps: 20, posture_score: 91, workout_date: '2026-09-22T10:00:00Z' },
      { workout_id: 2, exercise_name: 'Bicep Curl', total_reps: 18, posture_score: 88, workout_date: '2026-09-21T15:30:00Z' },
    ],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await workoutService.getStatsSummary();
        if (res.success && res.stats) {
          setStats(res.stats);
        }
      } catch (err) {
        console.warn('Using default dashboard metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDuration = (totalSecs) => {
    const hours = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  const coachInfo = generateCoachRecommendations(stats);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Hero Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-emerald-950/60 border border-cyan-500/20 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> PosturePulse AI Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-white">
            Hello, {user?.name || 'Athlete'} 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-300">
            Ready for today's AI-guided camera workout session? Choose an exercise and train with precision form.
          </p>
        </div>

        <div className="z-10">
          <Link
            to="/workout?exercise=1"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-extrabold text-base shadow-xl shadow-cyan-500/25 hover:scale-[1.03] transition-all"
          >
            <Play className="w-5 h-5 fill-slate-950" /> Start Quick Workout
          </Link>
        </div>
      </div>

      {/* Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Workouts"
          value={stats.totalWorkouts}
          subtext="Completed sessions"
          icon={Dumbbell}
          color="cyan"
        />
        <StatCard
          title="Total Reps"
          value={stats.totalReps}
          subtext="Tracked repetitions"
          icon={Activity}
          color="green"
        />
        <StatCard
          title="Average Form"
          value={`${stats.averageFormScore}%`}
          subtext="Biomechanics score"
          icon={Award}
          color="amber"
        />
        <StatCard
          title="Workout Time"
          value={formatDuration(stats.totalDurationSeconds)}
          subtext="Cumulative duration"
          icon={Clock}
          color="purple"
        />
      </div>

      {/* AI Fitness Coach Guidance Card */}
      <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-['Outfit'] text-white">AI Coach Insights</h3>
              <p className="text-xs text-slate-400">Rule-based personalized recommendations</p>
            </div>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 font-semibold uppercase">
            Rule Engine
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coachInfo.insights.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl border text-sm ${
                item.type === 'positive'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : item.type === 'warning'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
              }`}
            >
              <h4 className="font-bold font-['Outfit'] mb-1">{item.title}</h4>
              <p className="text-xs opacity-90 leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 italic pt-2 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>{coachInfo.disclaimer}</span>
        </div>
      </div>

      {/* Two Column Layout: Recent Workouts & Quick Start Exercises */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Workouts */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold font-['Outfit'] text-white">Recent Activity</h3>
            <Link to="/history" className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1">
              View All History <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats.recentWorkouts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No recent workouts recorded yet. Start your first session!
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentWorkouts.map((wk, idx) => (
                <div
                  key={wk.workout_id || idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                      {wk.exercise_name?.charAt(0) || 'E'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-['Outfit']">{wk.exercise_name}</h4>
                      <p className="text-xs text-slate-400">
                        {new Date(wk.workout_date).toLocaleDateString()} • {wk.total_reps} reps completed
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-bold text-emerald-400 font-['Outfit']">
                      {Math.round(wk.posture_score)}%
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Form Score</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Launch Exercises */}
        <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold font-['Outfit'] text-white border-b border-slate-800 pb-4">
            Select Core Exercise
          </h3>
          <div className="space-y-3">
            {[
              { id: 1, name: 'Squat', muscle: 'Legs / Lower Body', diff: 'Beginner' },
              { id: 2, name: 'Bicep Curl', muscle: 'Arms', diff: 'Beginner' },
              { id: 3, name: 'Lunge', muscle: 'Legs / Lower Body', diff: 'Intermediate' },
              { id: 4, name: 'Push-Up', muscle: 'Chest / Arms', diff: 'Intermediate' },
            ].map((ex) => (
              <button
                key={ex.id}
                onClick={() => navigate(`/workout?exercise=${ex.id}`)}
                className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left flex items-center justify-between group transition-all"
              >
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 font-['Outfit']">
                    {ex.name}
                  </h4>
                  <span className="text-xs text-slate-400">{ex.muscle}</span>
                </div>
                <Play className="w-4 h-4 text-cyan-400 opacity-80 group-hover:scale-110 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
