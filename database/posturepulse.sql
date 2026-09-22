-- PosturePulse AI Database Schema
-- iQOO Hackathon 2026 - HealthTech Track

CREATE DATABASE IF NOT EXISTS posturepulse;
USE posturepulse;

-- Disable FK checks temporarily for safe table re-creation if re-run
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS posture_feedback;
DROP TABLE IF EXISTS workouts;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Table: users
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    age INT NULL,
    height DECIMAL(5,2) NULL,
    weight DECIMAL(5,2) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: exercises
CREATE TABLE exercises (
    exercise_id INT PRIMARY KEY AUTO_INCREMENT,
    exercise_name VARCHAR(100) NOT NULL,
    description TEXT,
    difficulty VARCHAR(30),
    muscle_group VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: workouts
CREATE TABLE workouts (
    workout_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    exercise_id INT NOT NULL,
    duration_seconds INT DEFAULT 0,
    total_reps INT DEFAULT 0,
    correct_reps INT DEFAULT 0,
    incorrect_reps INT DEFAULT 0,
    posture_score DECIMAL(5,2),
    workout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(exercise_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: posture_feedback
CREATE TABLE posture_feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    workout_id INT NOT NULL,
    feedback_message VARCHAR(255),
    feedback_type ENUM('positive','warning','info') DEFAULT 'info',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_id) REFERENCES workouts(workout_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Initial Core Exercises Data
INSERT INTO exercises (exercise_id, exercise_name, description, difficulty, muscle_group) VALUES
(1, 'Squat', 'Lower body exercise focusing on controlled knee and hip movement.', 'Beginner', 'Legs / Lower Body'),
(2, 'Bicep Curl', 'Upper body exercise focusing on elbow flexion and biceps isolation.', 'Beginner', 'Arms'),
(3, 'Lunge', 'Lower body movement focusing on leg strength, quad control, and balance.', 'Intermediate', 'Legs / Lower Body'),
(4, 'Push-Up', 'Bodyweight exercise focusing on chest, shoulder, core, and arm stability.', 'Intermediate', 'Chest / Arms')
ON DUPLICATE KEY UPDATE 
    exercise_name=VALUES(exercise_name),
    description=VALUES(description),
    difficulty=VALUES(difficulty),
    muscle_group=VALUES(muscle_group);
