const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool, getIsConnected } = require('../config/db');

// In-memory fallback user store for graceful offline testing
const fallbackUsers = [];

const generateToken = (user) => {
  return jwt.sign(
    { userId: user.user_id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'posturepulse_hackathon_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, age, height, weight } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    const isDbReady = getIsConnected();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isDbReady) {
      // Check existing email
      const [existing] = await pool.query('SELECT user_id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      // Insert new user
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, age, height, weight) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, hashedPassword, age || null, height || null, weight || null]
      );

      const userId = result.insertId;
      const user = { user_id: userId, name, email, age: age || null, height: height || null, weight: weight || null };
      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user,
      });
    } else {
      // Fallback in-memory registration
      const existing = fallbackUsers.find((u) => u.email === email);
      if (existing) {
        return res.status(400).json({ success: false, message: 'User with this email already exists' });
      }

      const userId = fallbackUsers.length + 1;
      const newUser = {
        user_id: userId,
        name,
        email,
        password: hashedPassword,
        age: age || null,
        height: height || null,
        weight: weight || null,
        created_at: new Date(),
      };
      fallbackUsers.push(newUser);

      const userRes = { user_id: userId, name, email, age: age || null, height: height || null, weight: weight || null };
      const token = generateToken(userRes);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully (In-Memory Fallback)',
        token,
        user: userRes,
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const isDbReady = getIsConnected();

    if (isDbReady) {
      const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const user = rows[0];
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user);
      delete user.password;

      return res.json({
        success: true,
        message: 'Logged in successfully',
        token,
        user,
      });
    } else {
      // Fallback in-memory check
      const user = fallbackUsers.find((u) => u.email === email);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const userRes = { ...user };
      delete userRes.password;
      const token = generateToken(userRes);

      return res.json({
        success: true,
        message: 'Logged in successfully (In-Memory Fallback)',
        token,
        user: userRes,
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// Get current user details
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const isDbReady = getIsConnected();

    if (isDbReady) {
      const [rows] = await pool.query(
        'SELECT user_id, name, email, age, height, weight, created_at FROM users WHERE user_id = ?',
        [userId]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, user: rows[0] });
    } else {
      const user = fallbackUsers.find((u) => u.user_id === userId);
      if (!user) {
        return res.json({
          success: true,
          user: { user_id: userId, name: req.user.name, email: req.user.email, age: 24, height: 175, weight: 70 },
        });
      }
      const userRes = { ...user };
      delete userRes.password;
      return res.json({ success: true, user: userRes });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error fetching user profile' });
  }
};
