const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../schema.psql'), 'utf-8');
const lines = content.split('\n');

lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('create table')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
