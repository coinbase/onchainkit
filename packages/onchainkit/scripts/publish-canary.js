import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const DIST_TAGS_URL =
  'https://registry.npmjs.org/-/package/@coinbase//onchainkit/dist-tags';
export const CANARY_TAG = 'canary';

export async function main() {
  let nextCanaryVersion = '';

  try {
    const distTagsResponse = await fetch(DIST_TAGS_URL);
    const distTags = await distTagsResponse.json();
    const { latest } = distTags;
    const canary = distTags[CANARY_TAG];

    console.log(`Found tags:\nlatest: ${latest}\ncanary: ${canary}`);

    nextCanaryVersion = getNextCanaryVersionNumber({ canary, latest });

    console.log(`Next canary version: ${nextCanaryVersion}`);
  } catch (error) {
    console.error('Error determining next canary version:\n', error.message);
    process.exit(1);
  }

  try {
    publishCanaryRelease(nextCanaryVersion);
  } catch (error) {
    console.error('Error publishing canary release:\n', error.message);
    process.exit(1);
  }

  console.log(`Canary release published: ${nextCanaryVersion}`);
}

/**
 * Get the next canary version number
 * @param {Object} params - The version parameters
 * @param {string} params.canary - The canary version to get the next version of
 * @param {string} params.latest - The latest version
 * @returns {string} The next canary version
 */
export function getNextCanaryVersionNumber({ canary, latest }) {
  const latestSplit = latest.split('.').map(Number);

  if (latestSplit.length !== 3) {
    throw new Error('Invalid version format');
  }

  const nextPatchVersion = [
    latestSplit[0],
    latestSplit[1],
    latestSplit[2] + 1,
  ].join('.');

  const nextPatchAtCanaryZero = `${nextPatchVersion}-${CANARY_TAG}.0`;

  if (!canary) {
    return nextPatchAtCanaryZero;
  }

  const [canaryBase, canaryCount] = canary.split(
    new RegExp(`-${CANARY_TAG}\\.`),
  );

  // If the next patch version is the same as the current canary version...
  if (nextPatchVersion === canaryBase) {
    // ...increment the current canary count
    const nextCount = canaryCount ? Number(canaryCount) + 1 : 0;
    return `${nextPatchVersion}-${CANARY_TAG}.${nextCount}`;
  }

  return nextPatchAtCanaryZero;
}

/**
 * Publish the canary release
 * @param {string} nextCanaryVersion - The next canary version
 */
export function publishCanaryRelease(nextCanaryVersion) {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);

  const onchainkitRoot = path.resolve(currentDir, '..');
  process.chdir(onchainkitRoot);

  // Update package.json version
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = nextCanaryVersion;
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );

  execSync(`pnpm publish --tag ${CANARY_TAG} --no-git-checks`);
}

main();
