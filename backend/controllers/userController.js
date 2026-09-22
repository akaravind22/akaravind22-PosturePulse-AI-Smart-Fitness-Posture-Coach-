const bcrypt = require('bcryptjs');
const { pool, getIsConnected } = require('../config/db');

exports.getProfile = async (req, res) => {
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
      return res.json({
        success: true,
        user: {
          user_id: userId,
          name: req.user.name || 'Demo User',
          email: req.user.email || 'user@posturepulse.ai',
          age: 24,
          height: 175.0,
          weight: 70.0,
          created_at: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, age, height, weight, password } = req.body;
    const isDbReady = getIsConnected();

    if (isDbReady) {
      let updateFields = [];
      let queryParams = [];

      if (name) {
        updateFields.push('name = ?');
        queryParams.push(name);
      }
      if (age !== undefined) {
        updateFields.push('age = ?');
        queryParams.push(age || null);
      }
      if (height !== undefined) {
        updateFields.push('height = ?');
        queryParams.push(height || null);
      }
      if (weight !== undefined) {
        updateFields.push('weight = ?');
        queryParams.push(weight || null);
      }
      if (password) {
        if (password.length < 6) {
          return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        updateFields.push('password = ?');
        queryParams.push(hashedPassword);
      }

      if (updateFields.length === 0) {
        return res.status(400).json({ success: false, message: 'No profile fields to update' });
      }

      queryParams.push(userId);
      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;

      await pool.query(sql, queryParams);

      const [updatedRows] = await pool.query(
        'SELECT user_id, name, email, age, height, weight, created_at FROM users WHERE user_id = ?',
        [userId]
      );

      return res.json({
        success: true,
        message: 'Profile updated successfully',
        user: updatedRows[0],
      });
    } else {
      return res.json({
        success: true,
        message: 'Profile updated successfully (In-Memory Fallback)',
        user: {
          user_id: userId,
          name: name || req.user.name,
          email: req.user.email,
          age: age || 24,
          height: height || 175,
          weight: weight || 70,
        },
      });
    }
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
};
