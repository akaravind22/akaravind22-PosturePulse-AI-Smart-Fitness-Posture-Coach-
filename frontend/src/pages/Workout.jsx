import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { useWorkoutTimer } from '../hooks/useWorkoutTimer';
import { analyzeSquat } from '../utils/squatAnalyzer';
import { analyzeBicepCurl } from '../utils/bicepCurlAnalyzer';
import { analyzeLunge } from '../utils/lungeAnalyzer';
import { analyzePushup } from '../utils/pushupAnalyzer';
import { CameraView } from '../components/CameraView';
import { WorkoutStats } from '../components/WorkoutStats';
import { FeedbackPanel } from '../components/FeedbackPanel';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Activity,
  Dumbbell,
  ShieldAlert,
} from 'lucide-react';

export const Workout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const exerciseId = parseInt(searchParams.get('exercise') || '1');

  // Exercise details mapping
  const exerciseNames = { 1: 'Squat', 2: 'Bicep Curl', 3: 'Lunge', 4: 'Push-Up' };
  const currentExerciseName = exerciseNames[exerciseId] || 'Squat';

  // Live Workout State
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [analyzerState, setAnalyzerState] = useState({
    stage: 'READY',
    reps: 0,
    correctReps: 0,
    incorrectReps: 0,
    postureScore: 100,
    feedbackMessage: 'Click Start Workout to begin pose analysis.',
    feedbackType: 'info',
    currentAngle: 0,
  });

  // Log of feedback items collected during workout for backend saving
  const feedbackHistoryRef = useRef([]);

  // Timer Hook
  const { seconds, formattedTime, isActive, isPaused, start: startTimer, pause: pauseTimer, resume: resumeTimer, reset: resetTimer } = useWorkoutTimer();

  // Process landmarks callback
  const handleLandmarks = useCallback(
    (landmarks) => {
      if (!isWorkoutActive || isPaused) return;

      setAnalyzerState((prevState) => {
        let nextState;
        switch (exerciseId) {
          case 1:
            nextState = analyzeSquat(landmarks, prevState);
            break;
          case 2:
            nextState = analyzeBicepCurl(landmarks, prevState);
            break;
          case 3:
            nextState = analyzeLunge(landmarks, prevState);
            break;
          case 4:
            nextState = analyzePushup(landmarks, prevState);
            break;
          default:
            nextState = analyzeSquat(landmarks, prevState);
            break;
        }

        // Record warning feedback if triggered
        if (nextState.feedbackMessage && nextState.feedbackType !== 'info') {
          const exists = feedbackHistoryRef.current.some(
            (fb) => fb.message === nextState.feedbackMessage
          );
          if (!exists) {
            feedbackHistoryRef.current.push({
              message: nextState.feedbackMessage,
              type: nextState.feedbackType,
            });
          }
        }

        return nextState;
      });
    },
    [exerciseId, isWorkoutActive, isPaused]
  );

  // Pose Detection Hook
  const {
    videoRef,
    canvasRef,
    cameraActive,
    cameraError,
    modelLoaded,
    startCamera,
    stopCamera,
  } = usePoseDetection(currentExerciseName, isWorkoutActive, handleLandmarks);

  // Start Workout Handler
  const handleStartWorkout = async () => {
    setIsWorkoutActive(true);
    feedbackHistoryRef.current = [];
    setAnalyzerState({
      stage: 'READY',
      reps: 0,
      correctReps: 0,
      incorrectReps: 0,
      postureScore: 100,
      feedbackMessage: 'Position your full body in camera frame.',
      feedbackType: 'info',
      currentAngle: 0,
    });
    startTimer();
    await startCamera();
  };

  // Pause / Resume Handler
  const handleTogglePause = () => {
    if (isPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
  };

  // End Workout Handler
  const handleEndWorkout = () => {
    stopCamera();
    const finalData = {
      exerciseId,
      exerciseName: currentExerciseName,
      durationSeconds: seconds,
      totalReps: analyzerState.reps,
      correctReps: analyzerState.correctReps,
      incorrectReps: analyzerState.incorrectReps,
      postureScore: analyzerState.postureScore,
      feedback: feedbackHistoryRef.current,
    };

    navigate('/workout-summary', { state: finalData });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" /> LIVE POSE ANALYSIS SCREEN
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-['Outfit'] text-white mt-1">
            Exercise: <span className="text-cyan-400">{currentExerciseName}</span>
          </h1>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center gap-3">
          {!isWorkoutActive ? (
            <button
              onClick={handleStartWorkout}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all"
            >
              <Play className="w-4 h-4 fill-slate-950" /> Start Workout
            </button>
          ) : (
            <>
              <button
                onClick={handleTogglePause}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition-all"
              >
                {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
              <button
                onClick={handleEndWorkout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-sm hover:bg-rose-500/30 transition-all shadow-md"
              >
                <Square className="w-4 h-4 fill-rose-300" /> End Workout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid: Camera Video View & Workout Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Webcam Video Box */}
        <div className="lg:col-span-2 space-y-4">
          <CameraView
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraActive={cameraActive}
            cameraError={cameraError}
            modelLoaded={modelLoaded}
            onStartCamera={handleStartWorkout}
            onStopCamera={stopCamera}
          />

          {/* AI Real-time Feedback Banner */}
          <FeedbackPanel
            feedbackMessage={analyzerState.feedbackMessage}
            feedbackType={analyzerState.feedbackType}
          />
        </div>

        {/* Side Workout HUD Metrics */}
        <div className="space-y-6">
          <WorkoutStats
            reps={analyzerState.reps}
            postureScore={analyzerState.postureScore}
            stage={analyzerState.stage}
            currentAngle={analyzerState.currentAngle}
            duration={formattedTime}
            correctReps={analyzerState.correctReps}
            incorrectReps={analyzerState.incorrectReps}
          />

          {/* Exercise Form Tips Panel */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold font-['Outfit'] text-white uppercase tracking-wider">
              {currentExerciseName} Technique Checklist
            </h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>Keep full body within camera frame boundaries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>Perform smooth, controlled repetitions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>Follow the real-time AI visual posture corrections above.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
