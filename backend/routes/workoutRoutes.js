const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', workoutController.saveWorkout);
router.get('/', workoutController.getWorkouts);
router.get('/stats/summary', workoutController.getStatsSummary);
router.get('/stats/progress', workoutController.getStatsProgress);
router.get('/:id', workoutController.getWorkoutById);

module.exports = router;
