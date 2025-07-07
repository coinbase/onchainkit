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

  // Find all template directories in workspace (only nextjs templates)
  const workspaceTemplates = fs
    .readdirSync(sourceTemplatesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .filter((name) => name.endsWith('-nextjs'));

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

  // Always ignore .gitignore files themselves
  if (fileName === '.gitignore') {
    return true;
  }

  // Never ignore .template.env files (even though they match .env* pattern)
  if (fileName === '.template.env') {
    return false;
  }

  // Check against gitignore rules
  for (const rule of gitignoreRules) {
    if (rule.includes('*')) {
      // Handle simple wildcards
      const pattern = rule.replace(/\*/g, '.*');
      const regex = new RegExp(pattern);
      if (regex.test(fileName) || regex.test(relativePath)) {
        return true;
      }
    } else {
      // Exact match or directory match
      if (fileName === rule || relativePath.includes(rule)) {
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
