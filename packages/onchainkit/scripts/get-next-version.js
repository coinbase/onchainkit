import { execSync } from 'child_process';
import process from 'process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const packageName = '@coinbase/onchainkit';
const onchainkitPath = 'packages/onchainkit';

function getNextVersion() {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);

  // Move to monorepo root
  const monorepoRoot = path.resolve(currentDir, '../../..');
  process.chdir(monorepoRoot);

  let nextVersion = '';

  try {
    // This throws an error if there are no changes in any packages
    const output = execSync('pnpm changeset status --verbose', {
      encoding: 'utf-8',
    });

    const lines = output.split('\n');
    const onchainkitVersionLine = lines.find((line) =>
      line.includes(packageName),
    );

    if (!onchainkitVersionLine)
      throw new Error('No onchainkit version line found');

    nextVersion = onchainkitVersionLine.split(packageName)[1].trim();

    if (!nextVersion) throw new Error('No onchainkit version found');
  } catch (error) {
    console.error('Error checking changeset status:\n', error.message);
  }

  if (!nextVersion) {
    try {
      // If changeset check fails, fall back to current version from package.json
      const packageJsonPath = path.join(onchainkitPath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      nextVersion = packageJson.version;
    } catch (error) {
      console.error('Error falling back to package.json:\n', error.message);

      process.exit(1);
    }
  }

  // Write version to dist/version.txt, adjusting for the directory change
  const versionPath = path.join(onchainkitPath, 'dist/version.txt');
  fs.writeFileSync(versionPath, nextVersion);
}

getNextVersion();
