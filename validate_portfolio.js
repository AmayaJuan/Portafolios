const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'portfolio.json');
try {
  const raw = fs.readFileSync(file, 'utf8');
  JSON.parse(raw);
  console.log('OK: portfolio.json is valid JSON');
} catch (e) {
  console.error('ERROR: portfolio.json invalid JSON');
  console.error(e.message);
  process.exitCode = 1;
}

