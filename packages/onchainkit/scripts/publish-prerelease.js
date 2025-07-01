import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';
import { getOckVersion } from '@utils/get-ock-version';

const DIST_TAGS_URL =
  'https://registry.npmjs.org/-/package/@coinbase//onchainkit/dist-tags';

/**
 * Manages the publishing of a prerelease version of OnchainKit.
 * Uses the current version from package.json as the base version.
 *
 * @example
 * ```bash
 * # Publish an alpha version at the current core and auto-increment the prerelease version
 * pnpm f:ock publish-prerelease --tag alpha
 *
 * # Publish the exact version from package.json (requires a matching prerelease tag in package.json)
 * pnpm f:ock publish-prerelease --tag alpha --use-exact-version
 * ```
 * @returns {Promise<void>}
 */
export async function publishPrerelease() {
  const { tag } = parseArgs();
  let nextVersion = '';

  try {
    nextVersion = await getNextVersion();
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

/**
 * Parse command line arguments
 * @returns {{ tag: string, useExactVersion: boolean }} The parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const tagIndex = args.indexOf('--tag');
  const useExactVersionIndex = args.indexOf('--use-exact-version');

  if (tagIndex === -1 || tagIndex === args.length - 1) {
    console.error('Error: --tag argument is required');
    process.exit(1);
  }

  const tag = args[tagIndex + 1];

  if (!tag || tag.startsWith('--')) {
    console.error('Error: Invalid tag value');
    process.exit(1);
  }

  const useExactVersion = useExactVersionIndex !== -1;

  return { tag, useExactVersion };
}

/**
 * Get the next version to publish
 * @returns {Promise<string>} The next version to publish
 */
async function getNextVersion() {
  const { tag, useExactVersion } = parseArgs();
  const packageVersionInfo = getOckVersion();

  if (!useExactVersion) {
    const distTagsResponse = await fetch(DIST_TAGS_URL);
    const distTags = await distTagsResponse.json();
    const currentTagVersion = distTags[tag];

    console.log(
      `Found versions:\npackage.json: ${packageVersionInfo.full}\n${tag}: ${currentTagVersion}`,
    );

    const nextVersion = getAutoIncrementedVersion({
      currentTagVersion,
      packageJsonVersion: packageVersionInfo.full,
      tag,
    });

    console.log(`Next ${tag} version: ${nextVersion}`);
    return nextVersion;
  }

  if (!packageVersionInfo.prereleaseTag) {
    throw new Error(
      `package.json version "${packageVersionInfo.full}" does not contain a prerelease tag, but --use-exact-version requires one.`,
    );
  }

  if (packageVersionInfo.prereleaseTag !== tag) {
    throw new Error(
      `--tag "${tag}" does not match the prerelease tag "${packageVersionInfo.prereleaseTag}" in package.json version "${packageVersionInfo.full}".\n\nEither change the --tag argument to "${packageVersionInfo.prereleaseTag}" or update the version in package.json.`,
    );
  }

  const nextVersion = packageVersionInfo.full;
  console.log(`Using exact version from package.json: ${nextVersion}`);
  return nextVersion;
}

/**
 * Get the next auto-incremented version for the specified tag
 * @param {{ currentTagVersion: string | undefined, packageJsonVersion: string, tag: string }} params - The version parameters
 * @param {string | undefined} params.currentTagVersion - The current version for the specified tag
 * @param {string} params.packageJsonVersion - The current version from package.json
 * @param {string} params.tag - The tag name (e.g., 'canary', 'alpha')
 * @returns {string} The next version for the specified tag
 */
export function getAutoIncrementedVersion({
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
 * @returns {void}
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

/**
 * Main entry point
 * @returns {Promise<void>}
 */
export async function main() {
  if (globalThis.__IS_TEST_ENV === true) {
    return;
  }

  await publishPrerelease();
}

main().catch((error) => {
  console.error('Unhandled error:', error);
});
