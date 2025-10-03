/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const text = fs.readFileSync('src/app/(modules)/branding/page.tsx', 'utf8');
const from = "\"Ho\uFFFDt \uFFFD\u0018\uFFFD\"ng\"";
console.log('index', text.indexOf(from));

