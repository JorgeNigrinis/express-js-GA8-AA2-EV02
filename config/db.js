require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  // Si existe la variable de entorno la usa, de lo contrario cae en los valores por defecto locales
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'login', 
  port: process.env.DB_PORT || 3306, // Por defecto MySQL usa el 3306
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;