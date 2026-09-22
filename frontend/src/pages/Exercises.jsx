import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutService } from '../services/workoutService';
import { ExerciseCard } from '../components/ExerciseCard';
import { Dumbbell, Sparkles } from 'lucide-react';

export const Exercises = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([
    {
      exercise_id: 1,
      exercise_name: 'Squat',
      description: 'Lower body exercise focusing on controlled knee and hip movement.',
      difficulty: 'Beginner',
      muscle_group: 'Legs / Lower Body',
    },
    {
      exercise_id: 2,
      exercise_name: 'Bicep Curl',
      description: 'Upper body exercise focusing on elbow flexion and biceps isolation.',
      difficulty: 'Beginner',
      muscle_group: 'Arms',
    },
    {
      exercise_id: 3,
      exercise_name: 'Lunge',
      description: 'Lower body movement focusing on leg strength, quad control, and balance.',
      difficulty: 'Intermediate',
      muscle_group: 'Legs / Lower Body',
    },
    {
      exercise_id: 4,
      exercise_name: 'Push-Up',
      description: 'Bodyweight exercise focusing on chest, shoulder, core, and arm stability.',
      difficulty: 'Intermediate',
      muscle_group: 'Chest / Arms',
    },
  ]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await workoutService.getExercises();
        if (res.success && res.exercises && res.exercises.length > 0) {
          setExercises(res.exercises);
        }
      } catch (err) {
        console.warn('Using default exercises:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const handleStartWorkout = (exercise) => {
    navigate(`/workout?exercise=${exercise.exercise_id}`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
          <Dumbbell className="w-3.5 h-3.5" /> AI Pose Estimation Library
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-white">
          Supported Core Exercises
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Select an exercise below to initialize real-time MediaPipe computer vision landmark analysis and rep tracking.
        </p>
      </div>

      {/* Grid of Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {exercises.map((ex) => (
          <ExerciseCard key={ex.exercise_id} exercise={ex} onStartWorkout={handleStartWorkout} />
        ))}
      </div>
    </div>
  );
};
