const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDatabase() {
  const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

  let connection;

  if (connectionUrl) {
    // Railway: connect using URL (database already exists)
    connection = await mysql.createConnection(connectionUrl);
    console.log('Connected to Railway MySQL via URL');
  } else {
    // Local dev: connect without database first, create it
    connection = await mysql.createConnection({
      host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME || 'energy_platform';

    console.log(`Creating database "${dbName}" if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await connection.query(`USE \`${dbName}\``);
  };

  console.log('Creating tables...');

  // Users table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(50) DEFAULT NULL,
      password VARCHAR(255) NOT NULL,
      sponsor_id INT DEFAULT NULL,
      referral_code VARCHAR(50) UNIQUE,
      approved TINYINT(1) DEFAULT 0,
      active TINYINT(1) DEFAULT 1,
      role ENUM('user', 'admin') DEFAULT 'user',
      package_type ENUM('starter', 'popular', 'business', 'premium') DEFAULT 'starter',
      points INT DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (sponsor_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_email (email),
      INDEX idx_referral_code (referral_code),
      INDEX idx_sponsor_id (sponsor_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Add phone column if it doesn't exist (for existing databases)
  try {
    await connection.query(`ALTER TABLE users ADD COLUMN phone VARCHAR(50) DEFAULT NULL AFTER email`);
    console.log('Added phone column to users table');
  } catch (err) {
    if (err.code !== 'ER_DUP_FIELDNAME') throw err;
  }

  // Projects table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT DEFAULT NULL,
      service_type ENUM('PV', 'WP') NOT NULL,
      client_name VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      email VARCHAR(255) DEFAULT NULL,
      address VARCHAR(500) NOT NULL,
      answers JSON,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      source VARCHAR(50) DEFAULT 'partner',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Point transactions table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS point_transactions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      project_id INT NOT NULL,
      points INT NOT NULL,
      level TINYINT NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_project_id (project_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Package orders table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS package_orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id VARCHAR(20) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      package_type ENUM('popular', 'business', 'premium') NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending', 'paid', 'cancelled') DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_order_id (order_id),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Payouts table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS payouts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      recipient VARCHAR(255) NOT NULL,
      iban VARCHAR(50) NOT NULL,
      points INT NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      INDEX idx_user_id (user_id),
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Site settings table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS site_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Default settings
  const defaultSettings = [
    ['company_name', 'EP Energy Platform GmbH'],
    ['company_address', 'Musterstraße 123'],
    ['company_zip', '12345'],
    ['company_city', 'Musterstadt'],
    ['company_country', 'Deutschland'],
    ['company_ceo', 'Max Mustermann'],
    ['company_register', 'AG Musterstadt, HRB 123456'],
    ['company_vat', 'DE123456789'],
    ['contact_email', 'info@energy-platform.de'],
    ['contact_phone', '+49 123 456 789'],
    ['contact_website', 'www.energy-platform.de'],
    ['support_hours', 'Mo – Fr, 9:00 – 17:00 Uhr'],
    ['bank_recipient', 'EP Energy Platform GmbH'],
    ['bank_iban', 'DE89 3704 0044 0532 0130 00'],
    ['bank_bic', 'COBADEFFXXX'],
    ['bank_name', 'Commerzbank'],
  ];

  for (const [key, value] of defaultSettings) {
    await connection.query(
      'INSERT IGNORE INTO site_settings (setting_key, setting_value) VALUES (?, ?)',
      [key, value]
    );
  }

  // Support messages table
  await connection.query(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(500) NOT NULL,
      message TEXT NOT NULL,
      status ENUM('new', 'read', 'answered') DEFAULT 'new',
      admin_reply TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_status (status)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  // Create default admin account
  const bcrypt = require('bcryptjs');
  const adminPassword = await bcrypt.hash('admin123', 10);

  try {
    await connection.query(`
      INSERT INTO users (name, email, phone, password, approved, role, package_type, referral_code, points)
      VALUES ('Administrator', 'admin@ep.de', '', ?, 1, 'admin', 'premium', 'EP-ADMIN', 0)
    `, [adminPassword]);
    console.log('Admin account created: admin@ep.de / admin123');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      console.log('Admin account already exists.');
    } else {
      throw err;
    }
  }

  console.log('Database initialized successfully!');
  await connection.end();
}

initDatabase().catch((err) => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
