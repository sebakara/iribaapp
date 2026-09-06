const fs = require('fs');
const path = require('path');

const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq);
    if (process.env[key]) continue;
    process.env[key] = trimmed.slice(eq + 1).replace(/^["']|["']$/g, '');
  }
}

const connection = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'iribatech',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  ...(process.env.DB_SOCKET ? { socketPath: process.env.DB_SOCKET } : {}),
};

module.exports = {
  client: 'mysql2',
  connection,
  migrations: {
    directory: path.join(__dirname, 'dist/database/migrations'),
    extension: 'js',
    loadExtensions: ['.js'],
  },
};
