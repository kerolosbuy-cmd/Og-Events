const { spawn } = require('child_process');
const path = require('path');

// Set environment variables to disable source maps
process.env.GENERATE_SOURCEMAP = 'false';
process.env.NEXT_DISABLE_SOURCEMAPS = 'true';

// Start the Next.js development server
const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

// Handle termination
process.on('SIGINT', () => {
  devServer.kill('SIGINT');
});

process.on('SIGTERM', () => {
  devServer.kill('SIGTERM');
});

devServer.on('exit', (code) => {
  process.exit(code);
});
