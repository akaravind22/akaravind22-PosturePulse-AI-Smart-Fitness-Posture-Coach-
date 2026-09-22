const { pool, getIsConnected } = require('../config/db');

// Fallback in-memory workouts list
const fallbackWorkouts = [
  {
    workout_id: 1,
    user_id: 1,
    exercise_id: 1,
    exercise_name: 'Squat',
    duration_seconds: 145,
    total_reps: 20,
    correct_reps: 18,
    incorrect_reps: 2,
    posture_score: 91.0,
    workout_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    feedback: [
      { feedback_message: 'Great squat depth', feedback_type: 'positive' },
      { feedback_message: 'Keep your back straighter', feedback_type: 'warning' },
    ],
  },
  {
    workout_id: 2,
    user_id: 1,
    exercise_id: 2,
    exercise_name: 'Bicep Curl',
    duration_seconds: 110,
    total_reps: 18,
    correct_reps: 16,
    incorrect_reps: 2,
    posture_score: 88.0,
    workout_date: new Date(Date.now() - 86400000).toISOString(),
    feedback: [
      { feedback_message: 'Good curl form', feedback_type: 'positive' },
      { feedback_message: 'Keep your elbow stable', feedback_type: 'warning' },
    ],
  },
];

// Save completed workout
exports.saveWorkout = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      exerciseId,
      durationSeconds = 0,
      totalReps = 0,
      correctReps = 0,
      incorrectReps = 0,
      postureScore = 100,
      feedback = [],
    } = req.body;

    if (!exerciseId) {
      return res.status(400).json({ success: false, message: 'Exercise ID is required' });
    }

    const isDbReady = getIsConnected();

    if (isDbReady) {
      const [result] = await pool.query(
        `INSERT INTO workouts (user_id, exercise_id, duration_seconds, total_reps, correct_reps, incorrect_reps, posture_score)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [userId, exerciseId, durationSeconds, totalReps, correctReps, incorrectReps, postureScore]
      );

      const workoutId = result.insertId;

      if (Array.isArray(feedback) && feedback.length > 0) {
        const feedbackValues = feedback.map((fb) => [
          workoutId,
          fb.message || fb.feedback_message,
          fb.type || fb.feedback_type || 'info',
        ]);
        await pool.query(
          `INSERT INTO posture_feedback (workout_id, feedback_message, feedback_type) VALUES ?`,
          [feedbackValues]
        );
      }

      return res.status(201).json({
        success: true,
        message: 'Workout saved successfully',
        workoutId,
      });
    } else {
      // In-memory fallback
      const workoutId = fallbackWorkouts.length + 1;
      const exNames = { 1: 'Squat', 2: 'Bicep Curl', 3: 'Lunge', 4: 'Push-Up' };
      const newWk = {
        workout_id: workoutId,
        user_id: userId,
        exercise_id: parseInt(exerciseId),
        exercise_name: exNames[exerciseId] || 'Exercise',
        duration_seconds: parseInt(durationSeconds),
        total_reps: parseInt(totalReps),
        correct_reps: parseInt(correctReps),
        incorrect_reps: parseInt(incorrectReps),
        posture_score: parseFloat(postureScore),
        workout_date: new Date().toISOString(),
        feedback: feedback.map((fb) => ({
          feedback_message: fb.message || fb.feedback_message,
          feedback_type: fb.type || fb.feedback_type || 'info',
        })),
      };
      fallbackWorkouts.unshift(newWk);

      return res.status(201).json({
        success: true,
        message: 'Workout saved (In-Memory Fallback)',
        workoutId,
      });
    }
  } catch (error) {
    console.error('Save workout error:', error);
    res.status(500).json({ success: false, message: 'Server error saving workout' });
  }
};

// Get user workout history
exports.getWorkouts = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isDbReady = getIsConnected();

    if (isDbReady) {
      const [rows] = await pool.query(
        `SELECT w.*, e.exercise_name, e.muscle_group 
         FROM workouts w
         JOIN exercises e ON w.exercise_id = e.exercise_id
         WHERE w.user_id = ?
         ORDER BY w.workout_date DESC`,
        [userId]
      );
      return res.json({ success: true, workouts: rows });
    } else {
      const userWorkouts = fallbackWorkouts.filter((w) => w.user_id === userId || w.user_id === 1);
      return res.json({ success: true, workouts: userWorkouts });
    }
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching workouts' });
  }
};

// Get single workout details
exports.getWorkoutById = async (req, res) => {
  try {
    const workoutId = parseInt(req.params.id);
    const userId = req.user.userId;
    const isDbReady = getIsConnected();

    if (isDbReady) {
      const [rows] = await pool.query(
        `SELECT w.*, e.exercise_name, e.description, e.muscle_group 
         FROM workouts w
         JOIN exercises e ON w.exercise_id = e.exercise_id
         WHERE w.workout_id = ? AND w.user_id = ?`,
        [workoutId, userId]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Workout not found' });
      }

      const workout = rows[0];
      const [feedbackRows] = await pool.query(
        `SELECT feedback_id, feedback_message, feedback_type, created_at FROM posture_feedback WHERE workout_id = ?`,
        [workoutId]
      );
      workout.feedback = feedbackRows;

      return res.json({ success: true, workout });
    } else {
      const workout = fallbackWorkouts.find((w) => w.workout_id === workoutId);
      if (!workout) {
        return res.status(404).json({ success: false, message: 'Workout not found' });
      }
      return res.json({ success: true, workout });
    }
  } catch (error) {
    console.error('Get workout by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Aggregate dashboard stats
exports.getStatsSummary = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isDbReady = getIsConnected();

    if (isDbReady) {
      const [totals] = await pool.query(
        `SELECT 
           COUNT(*) as total_workouts,
           COALESCE(SUM(total_reps), 0) as total_reps,
           COALESCE(AVG(posture_score), 0) as avg_form_score,
           COALESCE(SUM(duration_seconds), 0) as total_duration_seconds
         FROM workouts 
         WHERE user_id = ?`,
        [userId]
      );

      const [recent] = await pool.query(
        `SELECT w.workout_id, w.total_reps, w.posture_score, w.workout_date, e.exercise_name
         FROM workouts w
         JOIN exercises e ON w.exercise_id = e.exercise_id
         WHERE w.user_id = ?
         ORDER BY w.workout_date DESC
         LIMIT 5`,
        [userId]
      );

      return res.json({
        success: true,
        stats: {
          totalWorkouts: totals[0].total_workouts,
          totalReps: totals[0].total_reps,
          averageFormScore: Math.round(totals[0].avg_form_score),
          totalDurationSeconds: totals[0].total_duration_seconds,
          recentWorkouts: recent,
        },
      });
    } else {
      const userWorkouts = fallbackWorkouts.filter((w) => w.user_id === userId || w.user_id === 1);
      const totalWorkouts = userWorkouts.length;
      const totalReps = userWorkouts.reduce((acc, w) => acc + w.total_reps, 0);
      const avgScore = totalWorkouts
        ? Math.round(userWorkouts.reduce((acc, w) => acc + w.posture_score, 0) / totalWorkouts)
        : 85;
      const totalTime = userWorkouts.reduce((acc, w) => acc + w.duration_seconds, 0);

      return res.json({
        success: true,
        stats: {
          totalWorkouts,
          totalReps,
          averageFormScore: avgScore,
          totalDurationSeconds: totalTime,
          recentWorkouts: userWorkouts.slice(0, 5),
        },
      });
    }
  } catch (error) {
    console.error('Stats summary error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching statistics' });
  }
};

// Progress charts stats
exports.getStatsProgress = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isDbReady = getIsConnected();

    if (isDbReady) {
      const [historyRows] = await pool.query(
        `SELECT DATE(workout_date) as date, 
                ROUND(AVG(posture_score), 1) as avg_score, 
                SUM(total_reps) as total_reps,
                SUM(correct_reps) as correct_reps,
                SUM(incorrect_reps) as incorrect_reps
         FROM workouts
         WHERE user_id = ?
         GROUP BY DATE(workout_date)
         ORDER BY date ASC
         LIMIT 14`,
        [userId]
      );

      const [breakdownRows] = await pool.query(
        `SELECT e.exercise_name, 
                SUM(w.total_reps) as total_reps, 
                COUNT(w.workout_id) as workout_count,
                ROUND(AVG(w.posture_score), 1) as avg_score
         FROM workouts w
         JOIN exercises e ON w.exercise_id = e.exercise_id
         WHERE w.user_id = ?
         GROUP BY e.exercise_name`,
        [userId]
      );

      return res.json({
        success: true,
        history: historyRows,
        breakdown: breakdownRows,
      });
    } else {
      const sampleHistory = [
        { date: '2026-09-16', avg_score: 82, total_reps: 25, correct_reps: 21, incorrect_reps: 4 },
        { date: '2026-09-17', avg_score: 85, total_reps: 30, correct_reps: 27, incorrect_reps: 3 },
        { date: '2026-09-18', avg_score: 88, total_reps: 40, correct_reps: 36, incorrect_reps: 4 },
        { date: '2026-09-19', avg_score: 84, total_reps: 35, correct_reps: 30, incorrect_reps: 5 },
        { date: '2026-09-20', avg_score: 90, total_reps: 45, correct_reps: 42, incorrect_reps: 3 },
        { date: '2026-09-21', avg_score: 92, total_reps: 50, correct_reps: 47, incorrect_reps: 3 },
        { date: '2026-09-22', avg_score: 94, total_reps: 60, correct_reps: 57, incorrect_reps: 3 },
      ];

      const sampleBreakdown = [
        { exercise_name: 'Squat', total_reps: 150, workout_count: 6, avg_score: 89 },
        { exercise_name: 'Bicep Curl', total_reps: 90, workout_count: 4, avg_score: 92 },
        { exercise_name: 'Lunge', total_reps: 45, workout_count: 2, avg_score: 84 },
        { exercise_name: 'Push-Up', total_reps: 30, workout_count: 2, avg_score: 81 },
      ];

      return res.json({
        success: true,
        history: sampleHistory,
        breakdown: sampleBreakdown,
      });
    }
  } catch (error) {
    console.error('Progress stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
