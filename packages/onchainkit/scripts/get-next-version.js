import { execSync } from 'child_process';
import process from 'process';
import fs from 'fs';
import path from 'path';

const packageName = '@coinbase/onchainkit';

try {
  process.chdir('../..');
  const output = execSync(
    'pnpm changeset status --verbose --since=origin/main',
    {
      encoding: 'utf-8',
    },
  );

  const lines = output.split('\n');
  const onchainkitVersionLine = lines.find((line) =>
    line.includes(packageName),
  );

  if (!onchainkitVersionLine) return;

  const nextVersion = onchainkitVersionLine.split(packageName)[1].trim();

  // Write version to dist/version.txt, adjusting for the directory change
  const versionPath = path.join('packages/onchainkit/dist/version.txt');
  fs.writeFileSync(versionPath, nextVersion);
} catch (error) {
  console.error('Error checking changeset status:', error.message);
  process.exit(1);
}
