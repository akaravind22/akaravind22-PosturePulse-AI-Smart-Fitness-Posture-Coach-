/**
 * Generates rule-based AI Coach personalized fitness guidance based on user performance stats.
 * NON-MEDICAL guidance only.
 */

export const generateCoachRecommendations = (stats) => {
  const { averageFormScore = 85, totalWorkouts = 0, totalReps = 0, recentWorkouts = [] } = stats;

  const insights = [];

  // Form score rules
  if (averageFormScore < 70) {
    insights.push({
      type: 'warning',
      title: 'Prioritize Form & Control',
      message: 'Focus on slower movements and correct joint alignment before increasing repetition speed or volume.',
    });
  } else if (averageFormScore >= 70 && averageFormScore < 85) {
    insights.push({
      type: 'info',
      title: 'Solid Progress',
      message: 'Your form is steadily improving. Maintain controlled movements throughout full range of motion.',
    });
  } else {
    insights.push({
      type: 'positive',
      title: 'Excellent Consistency',
      message: 'Great biomechanical form! Continue maintaining clean technique as you build volume.',
    });
  }

  // Workouts volume rule
  if (totalWorkouts === 0) {
    insights.push({
      type: 'info',
      title: 'Ready for First Session',
      message: 'Select Squat or Bicep Curl to start your camera-guided AI workout.',
    });
  } else if (totalWorkouts >= 5) {
    insights.push({
      type: 'positive',
      title: 'Active Streak',
      message: `You've completed ${totalWorkouts} workouts with ${totalReps} total reps logged.`,
    });
  }

  // Check recent incorrect reps ratio
  if (recentWorkouts.length > 0) {
    const latest = recentWorkouts[0];
    if (latest.incorrect_reps > latest.correct_reps) {
      insights.push({
        type: 'warning',
        title: 'Quality Over Quantity',
        message: 'Prioritize exercise movement quality rather than rushing repetition count.',
      });
    }
  }

  return {
    insights,
    disclaimer: 'Fitness & wellness posture coaching only. Not intended for medical diagnosis, injury treatment, or physiotherapy.',
  };
};
