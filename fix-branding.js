/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = "src/app/(modules)/branding/page.tsx";
let text = fs.readFileSync(path, "utf8");
const rawPairs = [
  ['\\"Ho\\uFFFDt \\uFFFD\\u0018\\uFFFD\\"ng\\"', '"Ho?t d?ng"'],
  ['\\"T\\u00F4m ng\\u00F4ng\\"', '"T?m ngung"'],
  ['Danh s\\u0002\\uFFFDch th\\uFFFD\\uFFFDng hi\\uFFFD!u', 'Danh sách thuong hi?u'],
  ['T\\u00F4\\"ng {totalBrands} th\\uFFFD\\uFFFDng hi\\uFFFD!u \\uFFFD\\u0018ang theo d\\u0002\\uFFFDi. \\u0010ang hi\\u00EAn th\\u00F49 {visibleCount} k\\u00EAt qu\\u00E1 theo b\\u00F4\\" l\\u00F4c hi\\uFFFD!n t\\u00E1i.', 'T?ng {totalBrands} thuong hi?u dang theo dõi. Ðang hi?n th? {visibleCount} k?t qu? theo b? l?c hi?n t?i.'],
  ['T\\u00E3o th\\uFFFD\\uFFFDng hi\\uFFFD!u', 'T?o thuong hi?u'],
  ['T\\u0002\\uFFFDm theo t\\u0002\\u00EAn, danh m\\u00FCc, ng\\uFFFD\\u00B5i ph\\u0002\\u00A3ch', 'Tìm theo tên, danh m?c, ngu?i ph? trách'],
  ['Tr\\u00F4ng th\\u0002\\u00FAi: T\\u00E1t c\\u00E1', 'Tr?ng thái: T?t c?'],
  ['X\\u0002\\u00E1 b\\u00F4\\" l\\u00F4c', 'Xóa b? l?c'],
  ['Th\\uFFFD\\uFFFDng hi\\uFFFD!u', 'Thuong hi?u'],
  ['Tr\\u00F4ng th\\u0002\\u00FAi', 'Tr?ng thái'],
  ['C\\u00E1p nh\\u00E1t', 'C?p nh?t'],
  ['Thao t\\u0002\\u00E1c', 'Thao tác'],
  ['Ch\\u00F40nh s\\u00E1a', 'Ch?nh s?a'],
  ['Xem chi ti\\u00EAt', 'Xem chi ti?t'],
  ['X\\u0002\\u00E1', 'Xóa'],
  ['Xu\\u00E1t', 'Xu?t'],
  ['Kh\\u0002\\u00F4ng c\\u0002\\u00F3 th\\uFFFD\\uFFFDng hi\\uFFFD!u ph\\u0002\\u00F9 h\\u00F4p v\\u00FBi b\\u00F4\\" l\\u00F4c. Th\\u00E1 thay \\uFFFD\\u0018\\"i t\\u00F4 kh\\u0002\\u00E1a ho\\u00E1c b\\u00F4\\" l\\u00F4c kh\\u0002\\u00E1c.', 'Không có thuong hi?u phù h?p v?i b? l?c. Th? thay d?i t? khóa ho?c b? l?c khác.'],
  ['\\u0010i\\u00EAn \\uFFFD\\u0018\\u00FD \\uFFFD\\u0018\\u00FD th\\u0002\\u00F4ng tin \\uFFFD\\u0018\\u00FD kh\\u00E2xi t\\u00E3o th\\uFFFD\\uFFFDng hi\\uFFFD!u m\\u00F3i trong h\\u00F4! th\\uFFFD\\u0018ng.', 'Ði?n d?y d? thông tin d? kh?i t?o thuong hi?u m?i trong h? th?ng.'],
  ['\\u0010\\u0002\\u00E1ng popup', 'Ðóng popup'],
  ['H\\u0002\\u00ECnh \\u00F1nh / Logo', 'Hình ?nh / Logo'],
  ['T\\u00E1i logo th\\uFFFD\\uFFFDng hi\\uFFFD!u', 'T?i logo thuong hi?u'],
  ['PNG, JPG t\\u00F4\\u0018i \\uFFFD\\u0018a 5MB', 'PNG, JPG t?i da 5MB'],
  ['T\\u0002\\u00EAn th\\uFFFD\\uFFFDng hi\\uFFFD!u', 'Tên thuong hi?u'],
  ['M\\u0002\\u00E3 th\\uFFFD\\uFFFDng hi\\uFFFD!u', 'Mã thuong hi?u'],
  ['Ph\\u0002\\u00E2n kh\\u0002\\u00E1c kh\\u0002\\u00E1ch h\\u0002\\u00E0ng', 'Phân khúc khách hàng'],
  ['Ch\\u00FAn ph\\u0002\\u00E2n kh\\u0002\\u00E1c', 'Ch?n phân khúc'],
  ['\\u0010\\u0002\\u00F4m c\\u00F4\u00B8:i & s\\u00F4 ki\\uFFFD!n', 'Ðám cu?i & s? ki?n'],
  ['Kh\\u0002\\u00E1ch h\\u0002\\u00E0ng doanh nghi\\uFFFD!p', 'Khách hàng doanh nghi?p'],
  ['B\\u0002\\u00E1n l\\u00E7 & th\\uFFFD\\uFFFDng m\\u00E1i \\uFFFD\\u0018i\\uFFFD!n t\\u00E4', 'Bán l? & thuong m?i di?n t?'],
  ['K\\u0002\\u00EAnh n\\u00F4\"i b\\u00F4"', 'Kênh n?i b?'],
  ['S\\u00EDA \u0018\\u0018i\\uFFFD!n tho\\u00E1i', 'S? di?n tho?i'],
  ['Email li\\u0002\\u00EAn h\\uFFFD!', 'Email liên h?'],
  ['\\u0010\uFFFD9a ch\u00F40', 'Ð?a ch?'],
  ['S\u0018 nh\u0002\u00E0, \u0018\u00EF\u009Dng, qu\u0002n/huy\uFFFD!n, th\u0002\u00E0nh ph\u00F4\u0018', 'S? nhà, du?ng, qu?n/huy?n, thành ph?'],
  ['H\u00F4y', 'Hu?'],
  ['L\u00E2u & t\u00E1o th\uFFFD\uFFFDng hi\uFFFD!u', 'Luu & t?o thuong hi?u']
];

for (const [fromJson, to] of rawPairs) {
  const from = JSON.parse(`"${fromJson}"`);
  const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  text = text.replace(new RegExp(escaped, "g"), to);
}

fs.writeFileSync(path, text, "utf8");

