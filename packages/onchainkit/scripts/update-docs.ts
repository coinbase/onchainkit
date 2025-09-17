import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface DocsNavigation {
  version: string;
  groups: unknown[];
}

interface VersionNavigation {
  version: string;
  navigation?: DocsNavigation;
}

interface TabNavigation {
  tab: string;
  versions?: VersionNavigation[];
  version?: string;
  navigation?: DocsNavigation;
}

interface DocsJson {
  navigation?: {
    tabs?: TabNavigation[];
  };
}

async function updateDocs() {
  try {
    console.log('🚀 Starting docs update process...');

    // 1. Clone the base/docs repository
    const currentDir = process.cwd();
    const tempDir = path.join(currentDir, '..', '..', 'tmp', 'base-docs');

    console.log('📥 Cloning base/docs repository...');
    if (fs.existsSync(tempDir)) {
      execFileSync('rm', ['-r', '-f', tempDir]);
    }

    // Ensure the tmp directory exists
    const tmpParentDir = path.dirname(tempDir);
    if (!fs.existsSync(tmpParentDir)) {
      fs.mkdirSync(tmpParentDir, { recursive: true });
    }

    execFileSync('git', ['clone', 'https://github.com/base/docs.git', tempDir]);

    // 2. Read the current docs.json from base/docs
    const baseDocsJsonPath = path.join(tempDir, 'docs', 'docs.json');
    console.log('📖 Reading base docs.json...');

    if (!fs.existsSync(baseDocsJsonPath)) {
      throw new Error(`docs.json not found at ${baseDocsJsonPath}`);
    }

    const baseDocsContent = fs.readFileSync(baseDocsJsonPath, 'utf8');
    const baseDocsJson: DocsJson = JSON.parse(baseDocsContent);

    // 3. Read our local docs.json
    const localDocsJsonPath = path.join(currentDir, 'docs', 'docs.json');
    console.log('📖 Reading local docs.json...');

    if (!fs.existsSync(localDocsJsonPath)) {
      throw new Error(`Local docs.json not found at ${localDocsJsonPath}`);
    }

    const localDocsContent = fs.readFileSync(localDocsJsonPath, 'utf8');
    const localDocsJson: DocsNavigation = JSON.parse(localDocsContent);

    // 4. Update the navigation structure
    console.log('🔄 Updating navigation structure...');

    if (!baseDocsJson.navigation?.tabs) {
      throw new Error('Base docs.json does not have navigation.tabs structure');
    }

    // Find the OnchainKit tab
    const onchainKitTab = baseDocsJson.navigation.tabs.find(
      (tab: TabNavigation) => tab.tab === 'OnchainKit',
    );

    if (!onchainKitTab) {
      throw new Error('OnchainKit tab not found in base docs.json');
    }

    // Find the latest version within the OnchainKit tab
    if (!onchainKitTab.versions) {
      throw new Error('OnchainKit tab does not have versions array');
    }

    const latestVersion = onchainKitTab.versions.find(
      (versionObj: VersionNavigation) => versionObj.version === 'latest',
    );

    if (!latestVersion) {
      throw new Error('Latest version not found in OnchainKit tab versions');
    }

    latestVersion.navigation = localDocsJson;
    console.log('✅ Updated latest version navigation in versions array');

    // 5. Write the updated docs.json back
    console.log('💾 Writing updated docs.json...');
    fs.writeFileSync(baseDocsJsonPath, JSON.stringify(baseDocsJson, null, 2));

    // 6. Clear and replace the content in /docs/onchainkit/latest
    const targetContentDir = path.join(tempDir, 'docs', 'onchainkit', 'latest');
    const sourceContentDir = path.join(currentDir, 'docs');

    console.log('🗑️  Clearing existing content...');
    if (fs.existsSync(targetContentDir)) {
      // Remove all contents of the directory using Node.js fs methods
      for (const file of fs.readdirSync(targetContentDir)) {
        const filePath = path.join(targetContentDir, file);
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    } else {
      fs.mkdirSync(targetContentDir, { recursive: true });
    }

    console.log('📁 Copying new content...');
    // Copy all files except docs.json
    for (const file of fs.readdirSync(sourceContentDir)) {
      if (file !== 'docs.json') {
        const sourcePath = path.join(sourceContentDir, file);
        const targetPath = path.join(targetContentDir, file);

        if (fs.statSync(sourcePath).isDirectory()) {
          execFileSync('cp', ['-r', sourcePath, targetPath]);
        } else {
          execFileSync('cp', [sourcePath, targetPath]);
        }
      }
    }

    // 7. Check if there are any changes to commit
    console.log('🔍 Checking for changes...');
    process.chdir(tempDir);

    // Check git status to see if there are any changes
    let hasChanges = false;
    try {
      const gitStatus = execFileSync('git', ['status', '--porcelain'], {
        encoding: 'utf8',
      });
      hasChanges = gitStatus.trim().length > 0;
    } catch {
      console.warn('⚠️  Could not check git status, proceeding with commit');
      hasChanges = true;
    }

    if (!hasChanges) {
      console.log(
        '✨ No changes detected between local and remote documentation',
      );
      console.log('🎉 Documentation is already up to date - no PR needed');

      // Return to original directory and exit
      process.chdir(currentDir);
      return;
    }

    // 8. Create a new branch and commit changes
    console.log('🌿 Creating new branch and committing changes...');

    const branchName = `update-onchainkit-docs-${Date.now()}`;
    execFileSync('git', ['checkout', '-b', branchName]);
    execFileSync('git', ['add', '.']);
    execFileSync('git', [
      'commit',
      '-m',
      'Update OnchainKit documentation to latest version',
    ]);

    console.log(`✅ Documentation update completed successfully!`);
    console.log(`📋 Branch created: ${branchName}`);
    console.log(`📂 Repository location: ${tempDir}`);

    // For GitHub Actions, stay in the temp directory
    // For local runs, return to original directory
    if (!process.env.GITHUB_ACTIONS) {
      console.log(`📋 Next steps:`);
      console.log(`   1. Push the branch: git push origin ${branchName}`);
      console.log(`   2. Create a PR from the branch`);
      process.chdir(currentDir);
    } else {
      console.log(
        `🤖 Running in GitHub Actions - leaving repository ready for PR creation`,
      );
    }
  } catch (error) {
    console.error('❌ Error updating docs:', error);
    throw error;
  }
}

// Export the function for testing
export { updateDocs };

// Main execution
async function main() {
  // Don't run in test environment
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  if ((globalThis as any).__IS_TEST_ENV === true) {
    return;
  }

  await updateDocs();
}

main().catch((error) => {
  console.error('Unhandled error:', error);
});
