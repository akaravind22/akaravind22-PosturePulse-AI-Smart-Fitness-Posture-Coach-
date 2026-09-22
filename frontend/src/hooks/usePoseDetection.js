import { useState, useEffect, useRef } from 'react';

/**
 * Handles WebRTC Webcam initialization, MediaPipe Pose tracking loop,
 * skeleton drawing onto HTML5 Canvas, and camera permission handling.
 */
export const usePoseDetection = (exerciseType, isWorkoutActive, onLandmarksDetected) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const poseInstanceRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const streamRef = useRef(null);

  // Initialize MediaPipe Pose
  useEffect(() => {
    let isMounted = true;

    const initMediaPipe = async () => {
      try {
        if (window.Pose) {
          const pose = new window.Pose({
            locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
          });

          pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5,
          });

          pose.onResults((results) => {
            if (!isMounted) return;
            drawPoseResults(results);
            if (results.poseLandmarks && onLandmarksDetected) {
              onLandmarksDetected(results.poseLandmarks);
            }
          });

          poseInstanceRef.current = pose;
          if (isMounted) setModelLoaded(true);
        } else {
          // Fallback timer if MediaPipe script is loading from CDN
          setTimeout(initMediaPipe, 300);
        }
      } catch (err) {
        console.error('MediaPipe initialization error:', err);
        if (isMounted) setCameraError('Failed to initialize AI Pose Detection model');
      }
    };

    initMediaPipe();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam access is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraActive(true);
          startProcessingLoop();
        };
      }
    } catch (err) {
      console.error('Webcam access error:', err);
      let errorMsg = 'Could not access webcam.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in your browser.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'No camera device detected on your system.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Camera is currently in use by another application.';
      }
      setCameraError(errorMsg);
      setCameraActive(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  // Frame processing loop
  const startProcessingLoop = () => {
    const processFrame = async () => {
      if (
        videoRef.current &&
        videoRef.current.readyState >= 2 &&
        poseInstanceRef.current &&
        isWorkoutActive
      ) {
        try {
          await poseInstanceRef.current.send({ image: videoRef.current });
        } catch (e) {
          // ignore transient frame send errors
        }
      }
      if (streamRef.current) {
        animationFrameIdRef.current = requestAnimationFrame(processFrame);
      }
    };
    processFrame();
  };

  // Draw Pose Skeleton Overlay on Canvas
  const drawPoseResults = (results) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.poseLandmarks) {
      const landmarks = results.poseLandmarks;

      // Draw Key Connections (Skeleton Lines)
      const connections = [
        [11, 12], [11, 13], [13, 15], [12, 14], [14, 16], // Upper body & arms
        [11, 23], [12, 24], [23, 24],                    // Torso
        [23, 25], [25, 27], [24, 26], [26, 28]           // Legs
      ];

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#06b6d4'; // Cyan neon line

      connections.forEach(([i, j]) => {
        const ptA = landmarks[i];
        const ptB = landmarks[j];
        if (ptA && ptB && ptA.visibility > 0.4 && ptB.visibility > 0.4) {
          ctx.beginPath();
          ctx.moveTo(ptA.x * canvas.width, ptA.y * canvas.height);
          ctx.lineTo(ptB.x * canvas.width, ptB.y * canvas.height);
          ctx.stroke();
        }
      });

      // Draw Key Landmark Joints (Dots)
      landmarks.forEach((pt, idx) => {
        if (pt && pt.visibility > 0.4) {
          ctx.beginPath();
          ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 6, 0, 2 * Math.PI);

          // Highlight primary exercise joints
          if ([11, 12, 13, 14, 23, 24, 25, 26].includes(idx)) {
            ctx.fillStyle = '#10b981'; // Green accent for core joints
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = '#38bdf8';
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      });
    }

    ctx.restore();
  };

  return {
    videoRef,
    canvasRef,
    cameraActive,
    cameraError,
    modelLoaded,
    startCamera,
    stopCamera,
  };
};
