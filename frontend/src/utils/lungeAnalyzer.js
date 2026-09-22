import { calculateAngle } from './calculateAngle';

export const analyzeLunge = (landmarks, state) => {
  let {
    stage = 'UP',
    reps = 0,
    correctReps = 0,
    incorrectReps = 0,
    postureScore = 100,
    minKneeAngleInRep = 180,
  } = state;

  const leftVis = (landmarks[23].visibility + landmarks[25].visibility + landmarks[27].visibility) / 3;
  const rightVis = (landmarks[24].visibility + landmarks[26].visibility + landmarks[28].visibility) / 3;

  const isLeft = leftVis >= rightVis;
  const hip = isLeft ? landmarks[23] : landmarks[24];
  const knee = isLeft ? landmarks[25] : landmarks[26];
  const ankle = isLeft ? landmarks[27] : landmarks[28];

  const avgVis = (hip.visibility + knee.visibility + ankle.visibility) / 3;

  if (avgVis < 0.4) {
    return {
      stage,
      reps,
      correctReps,
      incorrectReps,
      postureScore,
      feedbackMessage: 'Step back to fit your full leg view',
      feedbackType: 'info',
      currentAngle: 0,
    };
  }

  const kneeAngle = calculateAngle(hip, knee, ankle);

  let feedbackMessage = 'Step into lunge position';
  let feedbackType = 'info';
  let repIncremented = false;

  let updatedMinAngle = Math.min(minKneeAngleInRep, kneeAngle);

  if (kneeAngle < 100) {
    if (stage !== 'DOWN') {
      stage = 'DOWN';
    }
    feedbackMessage = 'Good lunge depth! Press back up';
    feedbackType = 'positive';
  } else if (kneeAngle > 155) {
    if (stage === 'DOWN') {
      reps += 1;
      repIncremented = true;
      stage = 'UP';

      if (updatedMinAngle <= 105) {
        correctReps += 1;
        feedbackMessage = 'Good lunge! Strong leg drive';
        feedbackType = 'positive';
      } else {
        incorrectReps += 1;
        postureScore = Math.max(0, postureScore - 5);
        feedbackMessage = 'Lower your body slightly more';
        feedbackType = 'warning';
      }
      updatedMinAngle = 180;
    } else {
      feedbackMessage = 'Standing ready for next step';
      feedbackType = 'info';
    }
  } else {
    if (stage === 'UP' && kneeAngle < 140) {
      stage = 'DESCENDING';
    }
    feedbackMessage = 'Keep front knee aligned over ankle';
    feedbackType = 'info';
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
