import mysql from 'mysql2/promise';

const globalForDb = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
};

function createPool(): mysql.Pool {
  // Railway provides MYSQL_URL or DATABASE_URL as a connection string
  const connectionUrl = process.env.MYSQL_URL || process.env.DATABASE_URL;

  if (connectionUrl) {
    return mysql.createPool({
      uri: connectionUrl,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // Railway also provides individual MYSQL* variables, or fallback to local dev defaults
  return mysql.createPool({
    host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306),
    user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
    password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'energy_platform',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
}

const pool = globalForDb.mysqlPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalForDb.mysqlPool = pool;
}

export default pool;
