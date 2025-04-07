// @ts-check
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { spawnSync } from 'child_process';

function validateBuild() {
  try {
    const currentDir = path.dirname(fileURLToPath(import.meta.url));
    const packageRoot = path.resolve(currentDir, '..');
    process.chdir(packageRoot);

    const { stdout, stderr } = spawnSync(
      'pnpm',
      ['publish', '--dry-run', '--force', '--no-git-checks'],
      {
        cwd: packageRoot,
        shell: true,
        encoding: 'utf-8',
        stdio: ['inherit', 'pipe', 'pipe'],
      },
    );

    const lines = (stdout + stderr).split('\n');
    const tarballContentsStart =
      lines.indexOf('npm notice Tarball Contents') + 1;
    const tarballContentsEnd = lines.indexOf('npm notice Tarball Details');
    const tarballContentsArr = lines
      .slice(tarballContentsStart, tarballContentsEnd)
      .map((line) => './' + /(?<path>\S+$)/.exec(line)?.groups?.path);
    const tarballContents = new Set(tarballContentsArr);

    const packageJson = JSON.parse(
      fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'),
    );

    const missingFiles = getMissingFiles(
      {
        main: packageJson.main,
        types: packageJson.types,
        module: packageJson.module,
        exports: packageJson.exports,
      },
      tarballContents,
    );

    if (missingFiles.length > 0) {
      throw new Error('Missing files in the tarball:', missingFiles.join('\n'));
    }
  } catch (err) {
    console.error('Something went wrong during build validation:');
    console.error(err);
    process.exit(1);
  }

  console.log('Build validation successful');
  process.exit(0);
}

/**
 * Validates package.json fields against the tarball content
 * @param {Object.<string, string|Object.<string, string|Object>>} fields - Package.json fields to validate
 * @param {Set<string>} tarballContents - Set of files in the tarball
 */
function getMissingFiles(fields, tarballContents) {
  const missingFiles = [];

  for (const value of Object.values(fields)) {
    if (typeof value === 'string') {
      if (!tarballContents.has(value)) {
        missingFiles.push(value);
      }
    } else {
      missingFiles.push(...getMissingFiles(value, tarballContents));
    }
  }

  return missingFiles;
}

validateBuild();
