import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

/**
 * Manages the publishing of a prerelease version of create-onchain.
 * Requires an explicit version to ensure synchronization with OnchainKit.
 *
 * @example
 * ```bash
 * pnpm f:create publish-prerelease --tag alpha --version 1.0.0-alpha.1
 * ```
 */
export async function publishPrerelease() {
  const { tag, version } = parseArgs();

  try {
    updatePackageVersion(version);
    updateTemplatePackages(version);
    submitToRegistry(tag);
  } catch (error) {
    console.error(`Error publishing ${tag} release:\n`, error.message);
    process.exit(1);
  }

  console.log(`${tag} release published: create-onchain@${version}`);
}

/**
 * Parse command line arguments
 * @returns {{ tag: string, version: string }} The parsed arguments
 */
function parseArgs() {
  const args = process.argv.slice(2);
  const tagIndex = args.indexOf('--tag');
  const versionIndex = args.indexOf('--version');

  if (tagIndex === -1 || tagIndex === args.length - 1) {
    console.error('Error: --tag argument is required');
    process.exit(1);
  }

  if (versionIndex === -1 || versionIndex === args.length - 1) {
    console.error('Error: --version argument is required');
    process.exit(1);
  }

  const tag = args[tagIndex + 1];
  const version = args[versionIndex + 1];

  if (!tag || tag.startsWith('--')) {
    console.error('Error: Invalid tag value');
    process.exit(1);
  }

  if (!version || version.startsWith('--')) {
    console.error('Error: Invalid version value');
    process.exit(1);
  }

  return { tag, version };
}

/**
 * Update create-onchain package.json version
 * @param {string} version - The target version
 */
function updatePackageVersion(version) {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);
  const packageJsonPath = path.resolve(currentDir, '../package.json');

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const oldVersion = packageJson.version;
  packageJson.version = version;

  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
  );
  console.log(`Updated create-onchain version: ${oldVersion} → ${version}`);
}

/**
 * Update all template package.json files to use exact OnchainKit version
 * @param {string} version - The OnchainKit version to use
 */
function updateTemplatePackages(version) {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);
  const templatesDir = path.resolve(currentDir, '../templates');

  if (!fs.existsSync(templatesDir)) {
    throw new Error(`Templates directory not found at ${templatesDir}`);
  }

  const templateDirs = fs
    .readdirSync(templatesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  console.log(`Updating templates: ${templateDirs.join(', ')}`);

  for (const templateDir of templateDirs) {
    const packageJsonPath = path.join(
      templatesDir,
      templateDir,
      'package.json',
    );

    if (!fs.existsSync(packageJsonPath)) {
      console.warn(
        `Warning: No package.json found for template ${templateDir}`,
      );
      continue;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    let updated = false;

    // Update dependencies
    if (packageJson.dependencies?.['@coinbase/onchainkit']) {
      packageJson.dependencies['@coinbase/onchainkit'] = version;
      updated = true;
    }

    // Update devDependencies
    if (packageJson.devDependencies?.['@coinbase/onchainkit']) {
      packageJson.devDependencies['@coinbase/onchainkit'] = version;
      updated = true;
    }

    if (updated) {
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2) + '\n',
      );
      console.log(`${templateDir}: Updated @coinbase/onchainkit to ${version}`);
    }
  }
}

/**
 * Publish the release with the specified tag
 * @param {string} tag - The tag to publish under
 */
function submitToRegistry(tag) {
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDir = path.dirname(currentFilePath);
  const createOnchainRoot = path.resolve(currentDir, '..');

  process.chdir(createOnchainRoot);
  console.log(`Publishing from: ${process.cwd()}`);

  execSync(`pnpm publish --tag ${tag} --no-git-checks`, { stdio: 'inherit' });
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
