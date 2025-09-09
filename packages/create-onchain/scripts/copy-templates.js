import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Copies templates from workspace root to package templates directory.
 * Excludes files based on .gitignore rules.
 * Skips .gitignore files themselves to avoid conflicts.
 */
export async function copyTemplates() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);
  const packageRoot = path.resolve(currentDir, '..');
  const workspaceRoot = path.resolve(packageRoot, '../..');
  const sourceTemplatesDir = path.resolve(workspaceRoot, 'templates');
  const targetTemplatesDir = path.resolve(packageRoot, 'templates');

  // Find all template directories in workspace
  const workspaceTemplates = fs
    .readdirSync(sourceTemplatesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  // Create 1:1 mapping: workspace template -> package template
  const templateMappings = Object.fromEntries(
    workspaceTemplates.map((template) => [template, template]),
  );

  console.log(`Found templates: ${workspaceTemplates.join(', ')}`);

  console.log('Copying templates from workspace to package...');

  // Clean existing templates directory
  if (fs.existsSync(targetTemplatesDir)) {
    fs.rmSync(targetTemplatesDir, { recursive: true, force: true });
  }

  for (const [sourceTemplate, targetTemplate] of Object.entries(
    templateMappings,
  )) {
    const sourcePath = path.join(sourceTemplatesDir, sourceTemplate);
    const targetPath = path.join(targetTemplatesDir, targetTemplate);

    if (!fs.existsSync(sourcePath)) {
      console.warn(
        `Warning: Source template ${sourceTemplate} not found at ${sourcePath}`,
      );
      continue;
    }

    console.log(`Copying ${sourceTemplate} -> ${targetTemplate}`);

    // Read .gitignore rules if they exist
    const gitignorePath = path.join(sourcePath, '.gitignore');
    const gitignoreRules = fs.existsSync(gitignorePath)
      ? parseGitignore(fs.readFileSync(gitignorePath, 'utf-8'))
      : [];
    

    // Copy template with selective logic
    await copyTemplateDirectory(sourcePath, targetPath, gitignoreRules);
  }

  console.log('Templates copied successfully!');
}

/**
 * Parse .gitignore file into array of rules
 * @param {string} gitignoreContent - The .gitignore file content
 * @returns {string[]} Array of gitignore rules
 */
function parseGitignore(gitignoreContent) {
  return gitignoreContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      // Convert gitignore patterns to simple matching
      // This is a simplified version - real gitignore parsing is complex
      return line.replace(/^\//, '').replace(/\/$/, '');
    });
}

/**
 * Check if a file should be ignored based on gitignore rules
 * @param {string} filePath - The file path to check
 * @param {string[]} gitignoreRules - Array of gitignore rules
 * @returns {boolean} True if file should be ignored
 */
function shouldIgnoreFile(filePath, gitignoreRules) {
  const fileName = path.basename(filePath);
  const relativePath = filePath;

  // Don't ignore .gitignore files - they need to be copied and renamed to _gitignore
  if (fileName === '.gitignore') {
    return false;
  }

  // Never ignore .template.env files (even though they match .env* pattern)
  if (fileName === '.template.env') {
    return false;
  }

  // Check against gitignore rules
  for (const rule of gitignoreRules) {
    if (rule.includes('*')) {
      // Handle simple wildcards - convert to proper regex
      let pattern = rule
        .replace(/\\/g, '\\\\') // Escape backslashes
        .replace(/\./g, '\\.')  // Escape dots
        .replace(/\?/g, '.')    // ? matches one character
        .replace(/\*/g, '[^/]*'); // * matches any characters except /
      
      // Add anchors for exact matching
      pattern = `^${pattern}$`;
      
      try {
        const regex = new RegExp(pattern);
        if (regex.test(fileName)) {
          return true;
        }
      } catch (e) {
        // If regex is invalid, fall back to simple string matching
        if (fileName === rule || fileName.startsWith(rule.replace('*', ''))) {
          return true;
        }
      }
    } else {
      // Exact match or directory match
      if (
        fileName === rule ||
        relativePath === rule ||
        relativePath.startsWith(rule + '/')
      ) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Recursively copy a directory with selective logic
 * @param {string} sourcePath - Source directory path
 * @param {string} targetPath - Target directory path
 * @param {string[]} gitignoreRules - Array of gitignore rules
 */
async function copyTemplateDirectory(sourcePath, targetPath, gitignoreRules) {
  // Create target directory
  fs.mkdirSync(targetPath, { recursive: true });

  const entries = fs.readdirSync(sourcePath, { withFileTypes: true });

  for (const entry of entries) {
    const sourceFilePath = path.join(sourcePath, entry.name);
    const targetFilePath = path.join(targetPath, entry.name);

    // Check if this file/directory should be ignored
    if (shouldIgnoreFile(entry.name, gitignoreRules)) {
      continue;
    }

    if (entry.isDirectory()) {
      // Recursively copy directories
      await copyTemplateDirectory(
        sourceFilePath,
        targetFilePath,
        gitignoreRules,
      );
    } else if (entry.name === 'package.json') {
      // Handle package.json files specially to replace workspace dependencies
      const packageContent = fs.readFileSync(sourceFilePath, 'utf-8');
      const packageJson = JSON.parse(packageContent);

      // Replace workspace:* dependency with latest
      if (
        packageJson.dependencies &&
        packageJson.dependencies['@coinbase/onchainkit'] === 'workspace:*'
      ) {
        packageJson.dependencies['@coinbase/onchainkit'] = 'latest';
      }

      // Write the modified package.json
      fs.writeFileSync(
        targetFilePath,
        JSON.stringify(packageJson, null, 2) + '\n',
      );
    } else if (entry.name === '.gitignore') {
      // Rename .gitignore to _gitignore for the template
      const renamedTargetPath = path.join(targetPath, '_gitignore');
      fs.copyFileSync(sourceFilePath, renamedTargetPath);
    } else {
      // Copy file
      fs.copyFileSync(sourceFilePath, targetFilePath);
    }
  }
}

export async function main() {
  if (globalThis.__IS_TEST_ENV === true) {
    return;
  }

  try {
    await copyTemplates();
  } catch (error) {
    console.error('Error copying templates:', error.message);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
});
