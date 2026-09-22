# POSTUREPULSE AI
> **Your AI-Powered Fitness & Posture Coach**  
> *"Move Better. Train Smarter. Powered by AI."*

---

## 🏆 Project Context

Developed for the **iQOO Hackathon 2026** under the **HealthTech Track** (*"Build AI-powered healthcare, wellness, fitness, or mental health solutions."*).

> [!IMPORTANT]
> **HealthTech Disclaimer**: PosturePulse AI is strictly a general **fitness and wellness application** designed for exercise posture coaching, joint angle tracking, and rep counting. It is **NOT** a medical diagnosis system, doctor replacement, or physiotherapy treatment tool.

---

## 📌 Problem Statement

Many people exercise at home without access to professional fitness trainers. Beginners often:
- Perform exercises with incorrect biomechanical form and spinal posture.
- Cannot accurately count repetitions during intensive sets.
- Lack immediate feedback on squat depth or joint extension.
- Risk repeating form errors without real-time corrective cues.

---

## 💡 Solution

**PosturePulse AI** provides an intelligent, affordable solution directly in your browser. Using **MediaPipe Pose** computer vision landmark detection and WebRTC camera feeds, it:
1. Detects 13+ key body landmarks in real-time.
2. Calculates joint angles using trigonometric `atan2` functions.
3. Evaluates exercise stage transitions (`UP` ↔ `DOWN`) for zero-touch repetition counting.
4. Calculates a real-time **Posture Form Score (0–100%)**.
5. Emits live corrective feedback (depth warnings, back alignment cues, peak squeeze positive badges).
6. Logs completed workout sessions to a **Node.js / Express.js REST API** with a **MySQL database**.
7. Visualizes long-term progress with **Recharts** charts and rule-based AI Coach insights.

---

## 🚀 Key Features

- **MediaPipe Pose Tracking**: Real-time browser-based computer vision pose landmarking.
- **Core Exercise Analyzers**:
  - 🏋️ **Squat**: Hip, knee, ankle angle tracking, depth detection (<100°), and back tilt correction.
  - 💪 **Bicep Curl**: Elbow flexion angle (<50° to >150°) and elbow sway stability tracking.
  - 🦵 **Lunge**: Front knee angle alignment and drop depth evaluation.
  - 🧘 **Push-Up**: Chest dip angle and plank spine alignment.
- **Real-Time HUD Overlay**: Live rep count, form score %, movement stage (UP/DOWN), joint angle (°), and workout duration timer.
- **Workout Summaries & MySQL Log**: Saves duration, correct vs. incorrect reps, form score, and corrective feedback history.
- **Recharts Progress Dashboard**: Form score evolution over time and volume breakdown per exercise.
- **Rule-Based AI Coach**: Intelligent personalized fitness recommendations based on average form performance.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, JavaScript, React Router v6, Axios, Tailwind CSS, Recharts, Lucide Icons.
- **Computer Vision**: MediaPipe Pose / PoseLandmarker via WebRTC camera stream.
- **Backend**: Node.js, Express.js, REST API, JWT authentication, `bcryptjs` password hashing.
- **Database**: MySQL 8.0 (using `mysql2/promise` connection pool).
- **Environment**: `dotenv`, `cors`.

---

## 🏗️ System Architecture

```
User Camera (WebRTC)
      │
      ▼
React Web App (Vite + MediaPipe Pose)
      │
      ├── 13 Key Joint Landmarks
      ├── atan2 Angle Calculation
      ├── Exercise Analyzers (Squat, Bicep Curl, Lunge, Push-Up)
      └── Real-Time HUD (Rep Counter, Score %, Live Alerts)
      │
      ▼
Express.js REST API (Node.js + JWT)
      │
      ▼
MySQL Database (posturepulse)
```

---

## 🗄️ Database Schema (`database/posturepulse.sql`)

The application uses MySQL with four normalized tables:
- `users`: `user_id`, `name`, `email`, `password`, `age`, `height`, `weight`, `created_at`
- `exercises`: `exercise_id`, `exercise_name`, `description`, `difficulty`, `muscle_group`
- `workouts`: `workout_id`, `user_id`, `exercise_id`, `duration_seconds`, `total_reps`, `correct_reps`, `incorrect_reps`, `posture_score`, `workout_date`
- `posture_feedback`: `feedback_id`, `workout_id`, `feedback_message`, `feedback_type`, `created_at`

---

## ⚡ Quick Start & Local Installation

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server (v8.0+ or XAMPP MySQL)

### Step 1: Database Setup
1. Open MySQL terminal or phpMyAdmin.
2. Import and execute `database/posturepulse.sql`:
   ```bash
   mysql -u root -p < database/posturepulse.sql
   ```

### Step 2: Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend runs on `http://localhost:5000`*

### Step 3: Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔒 Privacy & Security

- **Webcam Privacy**: Video frames are processed entirely on-device within the user's browser. Raw webcam video is never uploaded or saved to any external cloud server.
- **Data Protection**: User passwords are encrypted with `bcrypt` salt hashing before storage in MySQL. Protected API routes verify JWT Bearer tokens.

---

## 📄 License & Disclaimer

Built for iQOO Hackathon 2026. For general fitness and posture coaching purposes only.
