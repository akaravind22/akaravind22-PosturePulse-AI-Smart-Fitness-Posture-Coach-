import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  Play,
  Camera,
  Compass,
  CheckCircle2,
  TrendingUp,
  Award,
  Zap,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { DisclaimerBanner } from '../components/DisclaimerModal';

export const Home = () => {
  const features = [
    {
      title: 'AI Pose Detection',
      desc: 'Browser-based MediaPipe vision model tracks 13+ key body joints in real-time without uploading raw video.',
      icon: Camera,
      color: 'text-cyan-400 bg-cyan-500/10',
    },
    {
      title: 'Real-Time Form Feedback',
      desc: 'Instant corrective feedback alerts for joint angles, squat depth, and spinal alignment during reps.',
      icon: Sparkles,
      color: 'text-emerald-400 bg-emerald-500/10',
    },
    {
      title: 'Automatic Rep Counting',
      desc: 'Smart state machines calculate joint angle trajectories to count complete reps with zero manual tapping.',
      icon: Zap,
      color: 'text-amber-400 bg-amber-500/10',
    },
    {
      title: 'Posture Score (0–100%)',
      desc: 'Form degradation scoring penalizes improper joint angles to encourage precision and safe technique.',
      icon: Award,
      color: 'text-purple-400 bg-purple-500/10',
    },
    {
      title: 'Workout History Log',
      desc: 'Persistent backend storage saves exercise durations, rep counts, and form corrections in MySQL.',
      icon: Activity,
      color: 'text-blue-400 bg-blue-500/10',
    },
    {
      title: 'Progress Analytics',
      desc: 'Interactive Recharts dashboard visualizes form score evolution over time and workout volume breakdown.',
      icon: TrendingUp,
      color: 'text-rose-400 bg-rose-500/10',
    },
  ];

  const steps = [
    { step: '01', title: 'Choose Exercise', desc: 'Select from Squat, Bicep Curl, Lunge, or Push-Up.' },
    { step: '02', title: 'Start Camera', desc: 'Enable WebRTC browser camera feed in one click.' },
    { step: '03', title: 'AI Analyzes Posture', desc: 'MediaPipe tracks joint angles and body skeleton live.' },
    { step: '04', title: 'Receive Instant Feedback', desc: 'Get live visual alerts to correct depth and alignment.' },
    { step: '05', title: 'Track Progress', desc: 'Review post-workout summaries and MySQL saved statistics.' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col justify-between">
      <div>
        {/* Hero Section */}
        <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden border-b border-slate-800/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(6,182,212,0.15),transparent_50%)] pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
              <Activity className="w-3.5 h-3.5" /> iQOO HACKATHON 2026 • HEALTHTECH TRACK
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-['Outfit'] tracking-tight max-w-4xl mx-auto leading-none">
              POSTUREPULSE <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">AI</span>
            </h1>

            <p className="mt-4 text-xl sm:text-2xl font-bold font-['Outfit'] text-slate-200">
              "Your AI-Powered Fitness & Posture Coach"
            </p>

            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Train smarter at home with real-time browser computer vision. Automatic rep counting, joint angle tracking, and instant exercise form feedback without expensive personal trainers.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-slate-950" /> Start Training Now
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-card border border-slate-700 text-slate-200 font-semibold text-base hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                How It Works <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <p className="mt-6 text-xs text-slate-500 font-medium">
              "Move Better. Train Smarter. Powered by AI."
            </p>
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-['Outfit'] text-white">
              Smart Computer Vision Features
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Designed for seamless home fitness analysis using edge computer vision in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-cyan-500/40 transition-all hover:translate-y-[-4px] group"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-slate-900/40 border-t border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest">Simple 5-Step Workflow</span>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Outfit'] text-white mt-1">
                How PosturePulse AI Works
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {steps.map((st, i) => (
                <div key={i} className="p-5 rounded-2xl glass-card border border-slate-800 text-center flex flex-col items-center">
                  <span className="w-10 h-10 rounded-full bg-cyan-500/10 text-cyan-400 font-extrabold font-['Outfit'] text-sm flex items-center justify-center border border-cyan-500/30 mb-3">
                    {st.step}
                  </span>
                  <h4 className="text-sm font-bold text-white font-['Outfit']">{st.title}</h4>
                  <p className="mt-1 text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
};
