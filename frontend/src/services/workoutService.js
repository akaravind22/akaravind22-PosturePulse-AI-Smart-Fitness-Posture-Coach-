import api from './api';

export const workoutService = {
  async getExercises() {
    const response = await api.get('/exercises');
    return response.data;
  },

  async getExerciseById(id) {
    const response = await api.get(`/exercises/${id}`);
    return response.data;
  },

  async saveWorkout(workoutData) {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  },

  async getWorkouts() {
    const response = await api.get('/workouts');
    return response.data;
  },

  async getWorkoutById(id) {
    const response = await api.get(`/workouts/${id}`);
    return response.data;
  },

  async getStatsSummary() {
    const response = await api.get('/workouts/stats/summary');
    return response.data;
  },

  async getStatsProgress() {
    const response = await api.get('/workouts/stats/progress');
    return response.data;
  },
};
