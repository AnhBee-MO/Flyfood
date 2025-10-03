/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const text = fs.readFileSync('src/app/(modules)/branding/page.tsx', 'utf8');
const pattern = /[^A-Za-z0-9_{}$`~!@#%^&*()\[\]\-+<>?,.;:'"\\/\s]+/g;
const matches = new Set();
let match;
while ((match = pattern.exec(text))) {
  matches.add(match[0]);
}
console.log([...matches]);

