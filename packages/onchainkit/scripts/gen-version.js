import process from 'process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

/**
 * Generates a version.ts file in /src that exports the current package.json version of the library.
 */
function genVersion() {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const packageRoot = path.resolve(currentDir, '..');
  const packageJsonPath = path.join(packageRoot, 'package.json');

  try {
    const version = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf-8'),
    ).version;

    if (!version) {
      throw new Error('No version found in package.json');
    }

    const destination = path.join(packageRoot, 'src', 'version.ts');
    fs.writeFileSync(destination, `export const version = '${version}';\n`);

    console.log(`Version ${version} written to ${destination}`);
  } catch (err) {
    console.error('Error generating version:\n', err.message);
    process.exit(1);
  }
}

genVersion();
