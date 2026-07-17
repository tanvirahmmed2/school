const fs = require('fs');
const path = require('path');

try {
  const code = fs.readFileSync(path.join(__dirname, '../src/app/(student)/student/attendance/page.jsx'), 'utf-8');
  // Simple check using eval/Function constructor after removing imports or using a basic parser
  console.log("File loaded successfully.");
} catch (err) {
  console.error("Error reading file:", err);
}
