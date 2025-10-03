const fs = require("fs");
const path = require("path");

const targetRoots = ["src", "docs"];
const textExtensions = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".css",
  ".scss",
  ".mjs",
  ".cjs",
  ".txt",
]);

const vietnameseChars = "ĂÂÊÔƠƯăâêôơưÁÀẢÃẠẤẦẨẪẬẮẰẲẴẶÉÈẺẼẸẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴĐáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵđ";
const replacementPairs = Array.from(new Set(vietnameseChars.split("")))
  .map((char) => ({
    from: Buffer.from(char, "utf8").toString("latin1"),
    to: char,
  }))
  .sort((a, b) => b.from.length - a.from.length);

function walkDirectory(root, cb) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      walkDirectory(fullPath, cb);
    } else if (entry.isFile()) {
      cb(fullPath);
    }
  }
}

function shouldProcess(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return textExtensions.has(ext);
}

function fixFile(filePath) {
  if (!shouldProcess(filePath)) return;
  const originalBinary = fs.readFileSync(filePath, "binary");
  let text = Buffer.from(originalBinary, "latin1").toString("utf8");
  let fixed = text;
  for (const { from, to } of replacementPairs) {
    if (fixed.includes(from)) {
      fixed = fixed.split(from).join(to);
    }
  }
  if (fixed !== text) {
    fs.writeFileSync(filePath, fixed, "utf8");
    console.log("fixed", filePath);
  }
}

for (const root of targetRoots) {
  if (fs.existsSync(root)) {
    walkDirectory(root, fixFile);
  }
}

