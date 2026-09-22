import React from 'react';
import { Camera, CameraOff, RefreshCw, Eye, AlertTriangle, ShieldCheck } from 'lucide-react';

export const CameraView = ({
  videoRef,
  canvasRef,
  cameraActive,
  cameraError,
  modelLoaded,
  onStartCamera,
  onStopCamera,
}) => {
  return (
    <div className="relative w-full aspect-video max-h-[520px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl flex items-center justify-center group">
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        muted
        className={`w-full h-full object-cover transform -scale-x-100 ${
          cameraActive ? 'block' : 'hidden'
        }`}
      />

      {/* Canvas Skeleton Overlay */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 w-full h-full pointer-events-none transform -scale-x-100 ${
          cameraActive ? 'block' : 'hidden'
        }`}
      />

      {/* Status Badges Overlay */}
      {cameraActive && (
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs text-cyan-400 font-semibold shadow-lg">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            MediaPipe Pose Tracking Active
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs text-emerald-400 font-medium shadow-lg">
            <ShieldCheck className="w-3.5 h-3.5" /> Camera On
          </div>
        </div>
      )}

      {/* Camera Idle or Disabled State */}
      {!cameraActive && !cameraError && (
        <div className="flex flex-col items-center justify-center p-6 text-center z-10 space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Camera className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-white font-['Outfit']">Camera Feed Ready</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Click Start Workout to enable your camera for real-time MediaPipe AI posture analysis.
            </p>
          </div>
          <button
            onClick={onStartCamera}
            disabled={!modelLoaded}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all disabled:opacity-50"
          >
            {modelLoaded ? (
              <>
                <Camera className="w-4 h-4" /> Start Camera
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Loading AI Model...
              </>
            )}
          </button>
        </div>
      )}

      {/* Camera Permission / Device Error State */}
      {cameraError && (
        <div className="flex flex-col items-center justify-center p-6 text-center z-10 space-y-3 bg-slate-950/95 max-w-md rounded-xl border border-rose-500/30">
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-rose-400 font-['Outfit']">Camera Access Issue</h4>
          <p className="text-xs text-slate-300 leading-relaxed">{cameraError}</p>
          <div className="pt-2 flex gap-3">
            <button
              onClick={onStartCamera}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold hover:bg-rose-500/30"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Retry Camera
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
