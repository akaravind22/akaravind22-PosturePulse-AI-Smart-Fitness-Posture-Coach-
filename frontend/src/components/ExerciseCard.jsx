import React, { useState } from 'react';
import { Play, Info, Flame, Target, ChevronRight, X } from 'lucide-react';

export const ExerciseCard = ({ exercise, onStartWorkout }) => {
  const [showModal, setShowModal] = useState(false);

  const getDifficultyColor = (diff) => {
    switch (diff?.toLowerCase()) {
      case 'beginner':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'intermediate':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'advanced':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
    }
  };

  const getExerciseInstructions = (name) => {
    switch (name?.toLowerCase()) {
      case 'squat':
        return [
          'Stand facing or angled toward the camera with your full body visible.',
          'Keep feet shoulder-width apart and toes slightly turned outward.',
          'Initiate movement by sending hips back and bending knees.',
          'Lower until thighs are parallel to ground (knee angle ~90°-100°).',
          'Keep your chest up and back straight; avoid excessive forward lean.',
          'Drive through heels to return to standing position.'
        ];
      case 'bicep curl':
        return [
          'Stand upright facing the camera with arms by your sides.',
          'Keep upper arms stationary and elbows tucked close to torso.',
          'Curl weights or hands toward shoulders until biceps are fully contracted.',
          'Pause at peak squeeze (elbow angle < 50°).',
          'Slowly lower back down to full arm extension (elbow angle > 150°).'
        ];
      case 'lunge':
        return [
          'Step forward with one leg while keeping torso upright.',
          'Lower hips until front knee is bent at 90 degrees.',
          'Ensure front knee remains aligned directly over ankle.',
          'Keep back knee slightly off ground and core engaged.',
          'Push off front heel to return to starting position.'
        ];
      case 'push-up':
        return [
          'Position camera sideways or angled to capture your side profile plank.',
          'Place hands shoulder-width apart on the ground with body in straight line.',
          'Lower chest toward ground until elbows bend past 90 degrees.',
          'Avoid letting hips sag down or arching back excessively.',
          'Push firmly through palm heels back to starting plank.'
        ];
      default:
        return ['Ensure full body visibility in camera frame.', 'Maintain controlled motion and steady rhythm.'];
    }
  };

  return (
    <>
      <div className="rounded-2xl glass-card border border-slate-800 p-6 flex flex-col justify-between hover:border-cyan-500/40 transition-all hover:shadow-xl hover:shadow-cyan-500/5 group">
        <div>
          {/* Header Badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(exercise.difficulty)}`}>
              {exercise.difficulty || 'Beginner'}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              {exercise.muscle_group || 'General'}
            </span>
          </div>

          {/* Exercise Title & Description */}
          <h3 className="text-xl font-bold font-['Outfit'] text-white group-hover:text-cyan-400 transition-colors">
            {exercise.exercise_name}
          </h3>
          <p className="mt-2 text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {exercise.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-800/60">
          <button
            onClick={() => onStartWorkout(exercise)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm hover:opacity-95 shadow-md shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            Start Workout
          </button>
          <button
            onClick={() => setShowModal(true)}
            title="View Exercise Guide"
            className="p-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl glass-panel border border-slate-700 p-6 relative shadow-2xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-['Outfit'] text-white">
                  {exercise.exercise_name} Guide
                </h3>
                <span className="text-xs text-cyan-400 font-medium">PosturePulse AI Camera Checklist</span>
              </div>
            </div>

            <div className="space-y-3 my-4">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Step-by-Step Instructions</h4>
              <ul className="space-y-2">
                {getExerciseInstructions(exercise.exercise_name).map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  onStartWorkout(exercise);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400"
              >
                Start Camera <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
