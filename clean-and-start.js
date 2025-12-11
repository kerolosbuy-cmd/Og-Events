const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Delete .next directory
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  console.log('Deleting .next directory...');
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('.next directory deleted.');
}

// Start the development server
console.log('Starting development server...');
try {
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start development server:', error);
  process.exit(1);
}
