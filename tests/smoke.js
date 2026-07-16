const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
let failed = false;

const required = ['index.html', 'style.css', 'app.js'];
const jsDir = path.join(root, 'js');

required.forEach((f) => {
  const full = path.join(root, f);
  if (!fs.existsSync(full)) {
    console.error(`Missing required file: ${f}`);
    failed = true;
  } else {
    console.log(`✓ ${f}`);
  }
});

if (!fs.existsSync(jsDir)) {
  console.error('Missing js/ helper directory');
  failed = true;
} else {
  const jsFiles = fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'));
  if (jsFiles.length === 0) {
    console.error('No JS helpers found in js/');
    failed = true;
  } else {
    jsFiles.forEach((f) => console.log(`✓ js/${f}`));
  }
}

if (failed) {
  console.error('smoke test failed');
  process.exit(1);
}
console.log('smoke test passed');
