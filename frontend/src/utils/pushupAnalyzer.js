import { calculateAngle } from './calculateAngle';

export const analyzePushup = (landmarks, state) => {
  let {
    stage = 'UP',
    reps = 0,
    correctReps = 0,
    incorrectReps = 0,
    postureScore = 100,
    minElbowAngleInRep = 180,
  } = state;

  const leftVis = (landmarks[11].visibility + landmarks[13].visibility + landmarks[15].visibility) / 3;
  const rightVis = (landmarks[12].visibility + landmarks[14].visibility + landmarks[16].visibility) / 3;

  const isLeft = leftVis >= rightVis;
  const shoulder = isLeft ? landmarks[11] : landmarks[12];
  const elbow = isLeft ? landmarks[13] : landmarks[14];
  const wrist = isLeft ? landmarks[15] : landmarks[16];
  const hip = isLeft ? landmarks[23] : landmarks[24];
  const ankle = isLeft ? landmarks[27] : landmarks[28];

  const avgVis = (shoulder.visibility + elbow.visibility + wrist.visibility) / 3;

  if (avgVis < 0.4) {
    return {
      stage,
      reps,
      correctReps,
      incorrectReps,
      postureScore,
      feedbackMessage: 'Position camera to see upper body plank',
      feedbackType: 'info',
      currentAngle: 0,
    };
  }

  const elbowAngle = calculateAngle(shoulder, elbow, wrist);
  const bodyLineAngle = calculateAngle(shoulder, hip, ankle);

  let feedbackMessage = 'Hold plank and push up';
  let feedbackType = 'info';
  let repIncremented = false;

  let updatedMinAngle = Math.min(minElbowAngleInRep, elbowAngle);

  // Check hips sagging or arching (body line angle should be near 160-180)
  if (bodyLineAngle < 145) {
    postureScore = Math.max(0, postureScore - 0.2);
    feedbackMessage = 'Keep your body straight (don\'t sag hips)';
    feedbackType = 'warning';
  } else if (elbowAngle < 90) {
    if (stage !== 'DOWN') {
      stage = 'DOWN';
    }
    feedbackMessage = 'Chest close to ground - push back up!';
    feedbackType = 'positive';
  } else if (elbowAngle > 150) {
    if (stage === 'DOWN') {
      reps += 1;
      repIncremented = true;
      stage = 'UP';

      if (updatedMinAngle <= 95) {
        correctReps += 1;
        feedbackMessage = 'Good push-up! Full chest dip';
        feedbackType = 'positive';
      } else {
        incorrectReps += 1;
        postureScore = Math.max(0, postureScore - 5);
        feedbackMessage = 'Lower your chest more';
        feedbackType = 'warning';
      }
      updatedMinAngle = 180;
    } else {
      feedbackMessage = 'Plank position ready';
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
    minElbowAngleInRep: updatedMinAngle,
    repIncremented,
  };
};
