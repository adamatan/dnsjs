const { execSync } = require('child_process');

try {
  const commitHash = execSync('git rev-parse HEAD').toString().trim();
  process.env.REACT_APP_COMMIT_HASH = commitHash;
  console.log(`Set REACT_APP_COMMIT_HASH to ${commitHash}`);
} catch (error) {
  console.error('Error setting commit hash:', error.message);
}
