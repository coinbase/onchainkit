import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const DIST_TAGS_URL =
  'https://registry.npmjs.org/-/package/@coinbase//onchainkit/dist-tags';

/**
 * Manages the publishing of a prerelease version of OnchainKit.
 * Uses the current version from package.json as the base version.
 *
 * @example
 * ```bash
 * pnpm f:ock publish-prerelease --tag alpha
 * ```
 */
export async function publishPrerelease() {
  const { tag } = parseArgs();
  let nextVersion = '';

  try {
    const distTagsResponse = await fetch(DIST_TAGS_URL);
    const distTags = await distTagsResponse.json();
    const currentTagVersion = distTags[tag];

    // Read the current version from package.json
    const currentFilePath = fileURLToPath(import.meta.url);
    const currentDir = path.dirname(currentFilePath);
    const packageJsonPath = path.resolve(currentDir, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const packageJsonVersion = packageJson.version;

    console.log(
      `Found versions:\npackage.json: ${packageJsonVersion}\n${tag}: ${currentTagVersion}`,
    );

    nextVersion = getNextVersionNumber({
      currentTagVersion,
      packageJsonVersion,
      tag,
    });

    console.log(`Next ${tag} version: ${nextVersion}`);
  } catch (error) {
    console.error(`Error determining next ${tag} version:\n`, error.message);
    process.exit(1);
  }

  try {
    submitToRegistry(nextVersion, tag);
  } catch (error) {
    console.error(`Error publishing ${tag} release:\n`, error.message);
    process.exit(1);
  }

  console.log(`${tag} release published: ${nextVersion}`);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const tagIndex = args.indexOf('--tag');

  if (tagIndex === -1 || tagIndex === args.length - 1) {
    console.error('Error: --tag argument is required');
    process.exit(1);
  }

  const tag = args[tagIndex + 1];

  if (!tag || tag.startsWith('--')) {
    console.error('Error: Invalid tag value');
    process.exit(1);
  }

  return { tag };
}

/**
 * Get the next version number for the specified tag
 * @param {Object} params - The version parameters
 * @param {string} params.currentTagVersion - The current version for the specified tag
 * @param {string} params.packageJsonVersion - The current version from package.json
 * @param {string} params.tag - The tag name (e.g., 'canary', 'alpha')
 * @returns {string} The next version for the specified tag
 */
export function getNextVersionNumber({
  currentTagVersion,
  packageJsonVersion,
  tag,
}) {
  // Validate package.json version format
  const packageJsonSplit = packageJsonVersion.split('.').map(Number);
  if (packageJsonSplit.length !== 3) {
    throw new Error('Invalid version format');
  }

  // Always use package.json version as the base
  const baseVersion = packageJsonVersion;
  const nextVersionAtTagZero = `${baseVersion}-${tag}.0`;

  if (!currentTagVersion) {
    return nextVersionAtTagZero;
  }

  const [tagBase, tagCount] = currentTagVersion.split(new RegExp(`-${tag}\\.`));

  // If the base version is the same as the current tag version...
  if (baseVersion === tagBase) {
    // ...increment the current tag count
    const nextCount = tagCount ? Number(tagCount) + 1 : 0;
    return `${baseVersion}-${tag}.${nextCount}`;
  }

  return nextVersionAtTagZero;
}

/**
 * Publish the release with the specified tag
 * @param {string} nextVersion - The next version to publish
 * @param {string} tag - The tag to publish under
 */
export function submitToRegistry(nextVersion, tag) {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);

  const onchainkitRoot = path.resolve(currentDir, '..');
  process.chdir(onchainkitRoot);

  // Update package.json version
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = nextVersion;
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );

  execSync(`pnpm publish --tag ${tag} --no-git-checks`);
}

export async function main() {
  if (globalThis.__IS_TEST_ENV === true) {
    return;
  }

  await publishPrerelease();
}

main().catch((error) => {
  console.error('Unhandled error:', error);
});
