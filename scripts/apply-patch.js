const { execSync } = require('child_process');

try {
    execSync('git apply patch.diff', { stdio: 'inherit' });
    execSync('git status');
} catch (e) {
    console.error('Patch apply failed');
    process.exit(1);
}
