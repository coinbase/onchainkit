import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const DIST_TAGS_URL =
  'https://registry.npmjs.org/-/package/@coinbase//onchainkit/dist-tags';
export const ALPHA_TAG = 'alpha';

export async function main() {
  let nextAlphaVersion = '';

  try {
    const distTagsResponse = await fetch(DIST_TAGS_URL);
    const distTags = await distTagsResponse.json();
    const { latest } = distTags;
    const alpha = distTags[ALPHA_TAG];

    console.log(`Found tags:\nlatest: ${latest}\nalpha: ${alpha}`);

    nextAlphaVersion = getNextAlphaVersionNumber({ alpha, latest });

    console.log(`Next alpha version: ${nextAlphaVersion}`);
  } catch (error) {
    console.error('Error determining next alpha version:\n', error.message);
    process.exit(1);
  }

  try {
    publishAlphaRelease(nextAlphaVersion);
  } catch (error) {
    console.error('Error publishing alpha release:\n', error.message);
    process.exit(1);
  }

  console.log(`Alpha release published: ${nextAlphaVersion}`);
}

/**
 * Get the next alpha version number
 * @param {Object} params - The version parameters
 * @param {string} params.alpha - The alpha version to get the next version of
 * @param {string} params.latest - The latest version
 * @returns {string} The next alpha version
 */
export function getNextAlphaVersionNumber({ alpha, latest }) {
  const latestSplit = latest.split('.').map(Number);

  if (latestSplit.length !== 3) {
    throw new Error('Invalid version format');
  }

  const nextPatchVersion = [
    latestSplit[0],
    latestSplit[1],
    latestSplit[2] + 1,
  ].join('.');

  const nextPatchAtAlphaZero = `${nextPatchVersion}-${ALPHA_TAG}.0`;

  if (!alpha) {
    return nextPatchAtAlphaZero;
  }

  const [alphaBase, alphaCount] = alpha.split(new RegExp(`-${ALPHA_TAG}\\.`));

  // If the next patch version is the same as the current alpha version...
  if (nextPatchVersion === alphaBase) {
    // ...increment the current alpha count
    const nextCount = alphaCount ? Number(alphaCount) + 1 : 0;
    return `${nextPatchVersion}-${ALPHA_TAG}.${nextCount}`;
  }

  return nextPatchAtAlphaZero;
}

/**
 * Publish the alpha release
 * @param {string} nextAlphaVersion - The next alpha version
 */
export function publishAlphaRelease(nextAlphaVersion) {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);

  const onchainkitRoot = path.resolve(currentDir, '..');
  process.chdir(onchainkitRoot);

  // Update package.json version
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = nextAlphaVersion;
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );

  execSync(`pnpm publish --tag ${ALPHA_TAG} --no-git-checks`);
}

main();
