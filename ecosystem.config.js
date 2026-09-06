module.exports = {
  apps: [
    {
      name: 'iriba-api',
      script: 'dist/main.js',
      cwd: '/var/www/iribaapp/apps/api',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production' },
    },
    {
      name: 'iriba-web',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/var/www/iribaapp/apps/web',
      instances: 1,
      exec_mode: 'fork',
      env: { NODE_ENV: 'production' },
    },
  ],
};
