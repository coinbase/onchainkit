import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const DIST_TAGS_URL =
  'https://registry.npmjs.org/-/package/@coinbase//onchainkit/dist-tags';
export const ALPHA_TAG = 'alpha-test';

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
export function getNextAlphaVersionNumber({ alpha: maybeAlpha, latest }) {
  const alpha = maybeAlpha ?? latest;

  const [alphaBase, alphaCount] = alpha.split(new RegExp(`-${ALPHA_TAG}\\.`));

  const alphaSplit = alphaBase.split('.').map(Number);
  const latestSplit = latest.split('.').map(Number);

  if (alphaSplit.length !== 3 || latestSplit.length !== 3) {
    throw new Error('Invalid version format');
  }

  if (alphaBase === latest) {
    const nextCount = alphaCount?.length ? Number(alphaCount) + 1 : 0;
    return `${latest}-${ALPHA_TAG}.${nextCount}`;
  }

  alphaSplit.forEach((alphaPart, index) => {
    if (alphaPart > latestSplit[index]) {
      throw new Error('Alpha version is greater than latest version');
    }
  });

  return `${latest}-${ALPHA_TAG}.0`;
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

  execSync(`pnpm publish --tag ${ALPHA_TAG} --no-git-checks --dry-run`);
}

main();
