import { calculateAngle, calculateVerticalAngle } from './calculateAngle';

/**
 * MediaPipe Pose Landmark Indices:
 * 11: left_shoulder, 12: right_shoulder
 * 23: left_hip, 24: right_hip
 * 25: left_knee, 26: right_knee
 * 27: left_ankle, 28: right_ankle
 */

export const analyzeSquat = (landmarks, state) => {
  let {
    stage = 'UP',
    reps = 0,
    correctReps = 0,
    incorrectReps = 0,
    postureScore = 100,
    minKneeAngleInRep = 180,
    lastRepFeedback = null,
  } = state;

  // Choose side with higher average visibility (left or right)
  const leftVis = (landmarks[11].visibility + landmarks[23].visibility + landmarks[25].visibility + landmarks[27].visibility) / 4;
  const rightVis = (landmarks[12].visibility + landmarks[24].visibility + landmarks[26].visibility + landmarks[28].visibility) / 4;

  const isLeft = leftVis >= rightVis;
  const shoulder = isLeft ? landmarks[11] : landmarks[12];
  const hip = isLeft ? landmarks[23] : landmarks[24];
  const knee = isLeft ? landmarks[25] : landmarks[26];
  const ankle = isLeft ? landmarks[27] : landmarks[28];

  const avgVis = (shoulder.visibility + hip.visibility + knee.visibility + ankle.visibility) / 4;

  if (avgVis < 0.4) {
    return {
      stage,
      reps,
      correctReps,
      incorrectReps,
      postureScore,
      feedbackMessage: 'Make sure your full body is visible',
      feedbackType: 'info',
      currentAngle: 0,
      minKneeAngleInRep,
    };
  }

  // Calculate primary knee angle
  const kneeAngle = calculateAngle(hip, knee, ankle);
  // Calculate back posture (shoulder-to-hip vertical tilt)
  const backTilt = calculateVerticalAngle(shoulder, hip);

  let feedbackMessage = 'Keep going!';
  let feedbackType = 'info';
  let repIncremented = false;

  // Track minimum knee angle achieved during the current descent cycle
  let updatedMinAngle = Math.min(minKneeAngleInRep, kneeAngle);

  // Stage state machine
  if (kneeAngle < 100) {
    if (stage !== 'DOWN') {
      stage = 'DOWN';
    }
    feedbackMessage = 'Good depth! Now push up through your heels';
    feedbackType = 'positive';
  } else if (kneeAngle > 155) {
    if (stage === 'DOWN') {
      // Completed rep
      reps += 1;
      repIncremented = true;
      stage = 'UP';

      // Evaluate form quality of completed rep
      if (updatedMinAngle <= 105) {
        correctReps += 1;
        feedbackMessage = 'Great squat depth and form!';
        feedbackType = 'positive';
      } else {
        incorrectReps += 1;
        postureScore = Math.max(0, postureScore - 5);
        feedbackMessage = 'Bend your knees more for full range of motion';
        feedbackType = 'warning';
      }
      updatedMinAngle = 180; // Reset for next rep
    } else {
      feedbackMessage = 'Standing tall - ready for next squat';
      feedbackType = 'positive';
    }
  } else {
    // Intermediate movement state
    if (stage === 'UP' && kneeAngle < 140) {
      stage = 'DESCENDING';
    }

    if (backTilt > 32) {
      postureScore = Math.max(0, postureScore - 0.2); // minor continuous form penalty
      feedbackMessage = 'Keep your back straighter';
      feedbackType = 'warning';
    } else if (kneeAngle < 130) {
      feedbackMessage = 'Lower your hips deeper';
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
    currentAngle: kneeAngle,
    minKneeAngleInRep: updatedMinAngle,
    repIncremented,
  };
};
