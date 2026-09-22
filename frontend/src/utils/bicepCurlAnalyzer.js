import { calculateAngle } from './calculateAngle';

/**
 * MediaPipe Pose Landmark Indices:
 * 11: left_shoulder, 12: right_shoulder
 * 13: left_elbow, 14: right_elbow
 * 15: left_wrist, 16: right_wrist
 * 23: left_hip, 24: right_hip
 */

export const analyzeBicepCurl = (landmarks, state) => {
  let {
    stage = 'DOWN',
    reps = 0,
    correctReps = 0,
    incorrectReps = 0,
    postureScore = 100,
    maxFlexionAngle = 180,
    hasReachedPeak = false,
  } = state;

  const leftVis = (landmarks[11].visibility + landmarks[13].visibility + landmarks[15].visibility) / 3;
  const rightVis = (landmarks[12].visibility + landmarks[14].visibility + landmarks[16].visibility) / 3;

  const isLeft = leftVis >= rightVis;
  const shoulder = isLeft ? landmarks[11] : landmarks[12];
  const elbow = isLeft ? landmarks[13] : landmarks[14];
  const wrist = isLeft ? landmarks[15] : landmarks[16];
  const hip = isLeft ? landmarks[23] : landmarks[24];

  const avgVis = (shoulder.visibility + elbow.visibility + wrist.visibility) / 3;

  if (avgVis < 0.4) {
    return {
      stage,
      reps,
      correctReps,
      incorrectReps,
      postureScore,
      feedbackMessage: 'Make sure your arm and upper body are visible',
      feedbackType: 'info',
      currentAngle: 0,
    };
  }

  // Calculate primary elbow joint angle
  const elbowAngle = calculateAngle(shoulder, elbow, wrist);

  // Check elbow flare / stability (distance between elbow and hip in X axis)
  const elbowSway = Math.abs(elbow.x - hip.x);

  let feedbackMessage = 'Curl with controlled speed';
  let feedbackType = 'info';
  let repIncremented = false;

  // Stage state machine for Bicep Curl (DOWN -> UP -> DOWN)
  if (elbowAngle > 150) {
    if (stage === 'UP' && hasReachedPeak) {
      // Completed full cycle
      reps += 1;
      repIncremented = true;
      stage = 'DOWN';

      if (maxFlexionAngle <= 55) {
        correctReps += 1;
        feedbackMessage = 'Good curl! Full range of motion';
        feedbackType = 'positive';
      } else {
        incorrectReps += 1;
        postureScore = Math.max(0, postureScore - 4);
        feedbackMessage = 'Curl higher for complete bicep contraction';
        feedbackType = 'warning';
      }

      hasReachedPeak = false;
      maxFlexionAngle = 180;
    } else {
      stage = 'DOWN';
      feedbackMessage = 'Arms fully extended - start curl';
      feedbackType = 'info';
    }
  } else if (elbowAngle < 50) {
    stage = 'UP';
    hasReachedPeak = true;
    maxFlexionAngle = Math.min(maxFlexionAngle, elbowAngle);
    feedbackMessage = 'Great peak contraction! Squeeze biceps';
    feedbackType = 'positive';
  } else if (stage === 'DOWN' && elbowAngle < 120) {
    stage = 'ASCENDING';
    maxFlexionAngle = Math.min(maxFlexionAngle, elbowAngle);

    if (elbowSway > 0.18) {
      postureScore = Math.max(0, postureScore - 0.2);
      feedbackMessage = 'Keep your elbow stable by your side';
      feedbackType = 'warning';
    } else {
      feedbackMessage = 'Continue lifting upward';
      feedbackType = 'info';
    }
  }

  return {
    stage,
    reps,
    correctReps,
    incorrectReps,
    postureScore: Math.round(postureScore),
    feedbackMessage,
    feedbackType,
    currentAngle: elbowAngle,
    maxFlexionAngle,
    hasReachedPeak,
    repIncremented,
  };
};
