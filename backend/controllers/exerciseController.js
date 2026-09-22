const { pool, getIsConnected } = require('../config/db');

// Default initial exercises fallback
const defaultExercises = [
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
];

exports.getAllExercises = async (req, res) => {
  try {
    const isDbReady = getIsConnected();
    if (isDbReady) {
      const [rows] = await pool.query('SELECT * FROM exercises ORDER BY exercise_id ASC');
      return res.json({ success: true, exercises: rows.length > 0 ? rows : defaultExercises });
    }
    return res.json({ success: true, exercises: defaultExercises });
  } catch (error) {
    console.error('Fetch exercises error:', error);
    res.json({ success: true, exercises: defaultExercises });
  }
};

exports.getExerciseById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const isDbReady = getIsConnected();
    if (isDbReady) {
      const [rows] = await pool.query('SELECT * FROM exercises WHERE exercise_id = ?', [id]);
      if (rows.length > 0) {
        return res.json({ success: true, exercise: rows[0] });
      }
    }
    const found = defaultExercises.find((ex) => ex.exercise_id === id);
    if (!found) {
      return res.status(404).json({ success: false, message: 'Exercise not found' });
    }
    return res.json({ success: true, exercise: found });
  } catch (error) {
    console.error('Fetch exercise by id error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
