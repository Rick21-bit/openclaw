const fs = require('fs');
const path = require('path');
const files = ['index.html', 'style.css', 'app.js', 'README.md'];
let failed = false;
files.forEach(f => {
  if (!fs.existsSync(path.join(__dirname, '..', f))) {
    console.error('Missing', f);
    failed = true;
  }
});
if (failed) { process.exit(1); }
console.log('smoke test passed');
