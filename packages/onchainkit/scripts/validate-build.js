// @ts-check
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { spawnSync } from 'child_process';

const TARBALL_CONTENTS_START_REGEX = new RegExp(
  `npm notice[\\s=]+Tarball Contents[\\s=]*`,
);
const TARBALL_CONTENTS_END_REGEX = new RegExp(
  `npm notice[\\s=]+Tarball Details[\\s=]*`,
);

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
    const tarballContentsStart = lines.findIndex((line) =>
      TARBALL_CONTENTS_START_REGEX.test(line),
    );
    const tarballContentsEnd = lines.findIndex((line) =>
      TARBALL_CONTENTS_END_REGEX.test(line),
    );

    if (tarballContentsStart === -1 || tarballContentsEnd === -1) {
      throw new Error('Failed to find tarball contents start or end');
    }

    const tarballContentsArr = lines
      .slice(tarballContentsStart + 1, tarballContentsEnd)
      .map((line) => './' + /(?<path>\S+$)/.exec(line.trim())?.groups?.path);
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
      console.error(
        'Failed to find the following files:\n',
        missingFiles.join('\n'),
      );
      throw new Error('Missing files in the tarball.');
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
