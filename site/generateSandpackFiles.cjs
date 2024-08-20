const fs = require("fs");
const path = require("path");

const sandpackDir = path.join(__dirname, "docs", "components", "sandpack", "files");
const outputFile = path.join(__dirname, "generated", "sandpackFiles.ts");

function readDirectory(dir) {
  const results = {};
  const files = fs.readdirSync(dir, { withFileTypes: true });

  files.forEach(file => {
    const filePath = path.join(dir, file.name);
    if (file.isDirectory()) {
      results[file.name] = readDirectory(filePath);
    } else {
      let content = fs.readFileSync(filePath, "utf8");
      // Adjust import paths
      content = content.replace(/from ['"]\.\.\/(?!\.)/g, 'from \'./');
      results[file.name] = content;
    }
  });

  return results;
}

const sandpackExamples = readDirectory(sandpackDir);

// Generate TypeScript content
let tsContent = `// This file is auto-generated. Do not edit manually.\n\n`;

function generateExports(obj, prefix = '') {
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      const varName = `${prefix}${key.split('.')[0]}File`;
      tsContent += `export const ${varName} = ${JSON.stringify(value, null, 2)};\n\n`;
    } else if (typeof value === 'object') {
      generateExports(value, `${key}`);
    }
  });
}

generateExports(sandpackExamples);

// Ensure the output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(outputFile, tsContent);

console.log("Sandpack static files generated successfully!");