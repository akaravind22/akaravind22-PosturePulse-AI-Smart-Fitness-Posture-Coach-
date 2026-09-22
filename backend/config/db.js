const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'posturepulse',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

let isConnected = false;

// Test initial connection & auto-initialize tables if needed
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL database:', process.env.DB_NAME || 'posturepulse');
    isConnected = true;
    connection.release();
  } catch (err) {
    console.warn('⚠️ Warning: MySQL connection failed! Running in fallback mode or check MySQL service.');
    console.warn('Error details:', err.message);
    isConnected = false;
  }
};

testConnection();

module.exports = {
  pool,
  getIsConnected: () => isConnected,
};
