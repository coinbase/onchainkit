import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface DocsNavigation {
  version: string;
  groups: unknown[];
}

interface TabNavigation {
  tab: string;
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
    const tempDir = '/tmp/base-docs';
    const currentDir = process.cwd();

    console.log('📥 Cloning base/docs repository...');
    if (fs.existsSync(tempDir)) {
      execSync(`rm -rf ${tempDir}`);
    }

    execSync(`git clone https://github.com/base/docs.git ${tempDir}`);

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
    // If the tab has a version property directly, update it
    if (onchainKitTab.version === 'latest') {
      onchainKitTab.navigation = localDocsJson;
    } else {
      // If it's structured differently, we might need to handle nested versions
      console.warn('OnchainKit tab structure may need manual adjustment');
      onchainKitTab.navigation = localDocsJson;
    }

    // 5. Write the updated docs.json back
    console.log('💾 Writing updated docs.json...');
    fs.writeFileSync(baseDocsJsonPath, JSON.stringify(baseDocsJson, null, 2));

    // 6. Clear and replace the content in /docs/onchainkit/latest
    const targetContentDir = path.join(tempDir, 'docs', 'onchainkit', 'latest');
    const sourceContentDir = path.join(currentDir, 'docs');

    console.log('🗑️  Clearing existing content...');
    if (fs.existsSync(targetContentDir)) {
      execSync(`rm -rf ${targetContentDir}/*`);
    } else {
      fs.mkdirSync(targetContentDir, { recursive: true });
    }

    console.log('📁 Copying new content...');
    // Copy all files except docs.json
    const files = fs.readdirSync(sourceContentDir);
    for (const file of files) {
      if (file !== 'docs.json') {
        const sourcePath = path.join(sourceContentDir, file);
        const targetPath = path.join(targetContentDir, file);

        if (fs.statSync(sourcePath).isDirectory()) {
          execSync(`cp -r "${sourcePath}" "${targetPath}"`);
        } else {
          execSync(`cp "${sourcePath}" "${targetPath}"`);
        }
      }
    }

    // 7. Create a new branch and commit changes
    console.log('🌿 Creating new branch and committing changes...');
    process.chdir(tempDir);

    const branchName = `update-onchainkit-docs-${Date.now()}`;
    execSync(`git checkout -b ${branchName}`);
    execSync('git add .');
    execSync(
      'git commit -m "Update OnchainKit documentation to latest version"',
    );

    console.log(`✅ Documentation update completed successfully!`);
    console.log(`📋 Next steps:`);
    console.log(`   1. Push the branch: git push origin ${branchName}`);
    console.log(`   2. Create a PR from the branch`);
    console.log(`   3. Branch location: ${tempDir}`);

    // Return to original directory
    process.chdir(currentDir);
  } catch (error) {
    console.error('❌ Error updating docs:', error);
    throw error;
  }
}

updateDocs();
