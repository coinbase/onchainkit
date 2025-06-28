#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import {
  createClickableLink,
  isValidPackageName,
  toValidPackageName,
  copyDir,
} from './utils.js';
import open from 'open';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { analyticsPrompt } from './analytics.js';

type WebpageData = {
  header: string;
  payload: string;
  signature: string;
  domain: string;
};

async function getWebpageData(): Promise<WebpageData> {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(
    express.static(
      path.resolve(fileURLToPath(import.meta.url), '../../manifest'),
    ),
  );

  return new Promise((resolve) => {
    wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (data: Buffer) => {
        const parsedData = JSON.parse(data.toString());
        server.close();
        resolve(parsedData);
      });
    });

    server.listen(3333, () => {
      open('http://localhost:3333');
    });
  });
}

export async function createMiniKitManifest(envPath?: string) {
  if (!envPath) {
    envPath = path.join(process.cwd(), '.env');
  }

  const existingEnv = await fs.promises
    .readFile(envPath, 'utf-8')
    .catch(() => null);
  if (!existingEnv) {
    console.log(
      pc.red(
        '\n* Failed to read .env file. Please ensure you are in your project directory.',
      ),
    );
    return false;
  }

  try {
    const webpageData = await getWebpageData();

    // get existing next public url to re-update on subsequent runs
    let domain =
      existingEnv.match(/NEXT_PUBLIC_URL=(.*)/)?.[1]?.trim() ||
      '$NEXT_PUBLIC_URL';

    const envKeys = {
      FARCASTER_HEADER: {
        value: webpageData.header,
        added: false,
      },
      FARCASTER_PAYLOAD: {
        value: webpageData.payload,
        added: false,
      },
      FARCASTER_SIGNATURE: {
        value: webpageData.signature,
        added: false,
      },
      NEXT_PUBLIC_URL: {
        value: webpageData.domain,
        added: false,
      },
    };

    const updatedEnv = existingEnv
      .replaceAll(domain, webpageData.domain)
      .split('\n')
      .map((line) => {
        const [key] = line.split('=');

        if (key in envKeys) {
          envKeys[key as keyof typeof envKeys].added = true;
          return `${key}=${envKeys[key as keyof typeof envKeys].value}`;
        }

        return line;
      });

    Object.entries(envKeys).forEach(([key, { added }]) => {
      if (!added) {
        updatedEnv.push(`${key}=${envKeys[key as keyof typeof envKeys].value}`);
      }
    });

    await fs.promises.writeFile(envPath, updatedEnv.join('\n'));

    console.log(
      pc.blue(
        '\n* Account association generated successfully and added to your .env file!',
      ),
    );
  } catch (error) {
    console.log(
      pc.red('\n* Failed to generate account association. Please try again.'),
    );
    return false;
  }

  return true;
}

const DEFAULT_LLM_DOCS_URLS = {
  base: 'https://raw.githubusercontent.com/base/docs/refs/heads/master/docs/llms-full.txt',
  farcaster: 'https://miniapps.farcaster.xyz/llms-full.txt',
  neynar: 'https://docs.neynar.com/llms-full.txt',
  privy: 'https://docs.privy.io/llms-full.txt',
};

interface DownloadConfig {
  url: string;
  name: string;
  filename: string;
}

function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isOnline(): Promise<boolean> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 3000);
    
    fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000)
    })
      .then(() => {
        clearTimeout(timeout);
        resolve(true);
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve(false);
      });
  });
}

async function downloadWithRetry(
  url: string,
  filepath: string,
  maxRetries = 3,
  spinner?: any
): Promise<{ success: boolean; error?: string; size?: number }> {
  if (!validateUrl(url)) {
    return { success: false, error: 'Invalid URL - only HTTPS URLs are allowed' };
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'create-onchain-cli'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('content-length');
      const totalSize = contentLength ? parseInt(contentLength) : 0;
      let downloadedSize = 0;

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to read response body');
      }

      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        chunks.push(value);
        downloadedSize += value.length;
        
        // Update progress only if spinner provided
        // Removed to reduce flicker during "Creating [app name]..." message
      }

      // Write file
      const buffer = new Uint8Array(downloadedSize);
      let offset = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
      }

      await fs.promises.writeFile(filepath, buffer);
      
      return { success: true, size: downloadedSize };
      
    } catch (error: any) {
      const isLastAttempt = attempt === maxRetries;
      
      if (error.name === 'AbortError') {
        if (isLastAttempt) {
          return { success: false, error: 'Download timed out after 30 seconds' };
        }
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        if (isLastAttempt) {
          return { success: false, error: 'Network connection failed - please check your internet connection' };
        }
      } else {
        if (isLastAttempt) {
          return { success: false, error: `Download failed: ${error.message}` };
        }
      }

      // Exponential backoff for retry
      if (!isLastAttempt) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return { success: false, error: 'Max retries exceeded' };
}

async function setupAgentDocs(root: string, selectedDocs: string[], customUrls?: Record<string, string>) {
  const agentDocsDir = path.join(root, 'agent-docs');
  await fs.promises.mkdir(agentDocsDir, { recursive: true });

  // Check if we're online
  const online = await isOnline();
  
  if (!online) {
    console.log(pc.yellow('⚠️  No internet connection detected. Creating agent-docs folder with placeholder files.'));
    console.log(pc.gray('   Run "npm run update-llm-docs" later to download documentation.'));
    
    // Create placeholder files
    for (const docType of selectedDocs) {
      const filename = `${docType}-llms-full.txt`;
      const filepath = path.join(agentDocsDir, filename);
      const urls = customUrls || DEFAULT_LLM_DOCS_URLS;
      const url = urls[docType as keyof typeof urls] || 'Unknown';
      const placeholder = `# ${docType.charAt(0).toUpperCase() + docType.slice(1)} LLM Documentation\n\nThis file will be populated when you run: npm run update-llm-docs\n\nOriginal URL: ${url}`;
      await fs.promises.writeFile(filepath, placeholder);
    }
  } else {
    const spinner = ora().start();
    const results: Array<{ name: string; success: boolean; error?: string; size?: number }> = [];

    try {
      for (const docType of selectedDocs) {
        const urls = customUrls || DEFAULT_LLM_DOCS_URLS;
        const url = urls[docType as keyof typeof urls];
        
        if (url) {
          const filename = `${docType}-llms-full.txt`;
          const filepath = path.join(agentDocsDir, filename);
          
          const result = await downloadWithRetry(url, filepath, 3);
          
          results.push({
            name: docType,
            success: result.success,
            error: result.error,
            size: result.size
          });
        }
      }

      // Report results
      const successful = results.filter(r => r.success);
      const failed = results.filter(r => !r.success);
      
      if (successful.length > 0) {
        spinner.succeed(`Downloaded ${successful.length}/${results.length} documentation files`);
        
        for (const result of successful) {
          const sizeStr = result.size ? ` (${(result.size / 1024).toFixed(1)}KB)` : '';
          console.log(pc.green(`  ✓ ${result.name}${sizeStr}`));
        }
      }
      
      if (failed.length > 0) {
        console.log(pc.yellow(`\n⚠️  ${failed.length} downloads failed:`));
        for (const result of failed) {
          console.log(pc.red(`  ✗ ${result.name}: ${result.error}`));
        }
        console.log(pc.gray('   You can retry with: npm run update-llm-docs'));
      }
      
    } catch (error) {
      spinner.fail('Failed to setup LLM documentation');
      console.error(pc.red(`Error: ${error}`));
    }
  }

  // Create agent config file to store preferences
  const configPath = path.join(agentDocsDir, 'agent-config.json');
  const urls = customUrls || DEFAULT_LLM_DOCS_URLS;
  const config = {
    selectedDocs,
    lastUpdated: new Date().toISOString(),
    sources: selectedDocs.reduce((acc, doc) => {
      acc[doc] = urls[doc as keyof typeof urls];
      return acc;
    }, {} as Record<string, string>),
    offline: !online,
  };
  
  await fs.promises.writeFile(configPath, JSON.stringify(config, null, 2));

  // Create README for agent-docs
  const readmePath = path.join(agentDocsDir, 'README.md');
  const readmeContent = `# Agent Documentation

This folder contains LLM-optimized documentation for various APIs and services.

## Available Documentation

${selectedDocs.map(doc => `- **${doc}**: \`${doc}-llms-full.txt\``).join('\n')}

## Updating Documentation

To update all documentation files, run:

\`\`\`bash
npm run update-llm-docs
\`\`\`

## Configuration

The \`agent-config.json\` file contains:
- Selected documentation sources
- Last update timestamp  
- Source URLs for each documentation type
- Offline status indicator

### Custom URLs

You can customize source URLs by editing the \`sources\` object in \`agent-config.json\`:

\`\`\`json
{
  "sources": {
    "farcaster": "https://your-custom-url.com/farcaster-docs.txt",
    "neynar": "https://your-custom-url.com/neynar-docs.txt"
  }
}
\`\`\`

## Usage

These files are optimized for LLM consumption and contain comprehensive API documentation that can be used by AI agents and development tools.

## Offline Mode

If created without internet connection, placeholder files are generated. Run \`npm run update-llm-docs\` when online to download actual documentation.
`;

  await fs.promises.writeFile(readmePath, readmeContent);

  // Create update script inside agent-docs folder
  const updateScriptPath = path.join(agentDocsDir, 'update-llm-docs.js');
  const updateScriptContent = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function validateUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function isOnline() {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(false), 3000);
    
    fetch('https://httpbin.org/status/200', {
      method: 'HEAD',
      signal: AbortSignal.timeout(3000)
    })
      .then(() => {
        clearTimeout(timeout);
        resolve(true);
      })
      .catch(() => {
        clearTimeout(timeout);
        resolve(false);
      });
  });
}

async function downloadWithRetry(url, filepath, maxRetries = 3) {
  if (!validateUrl(url)) {
    return { success: false, error: 'Invalid URL - only HTTPS URLs are allowed' };
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'User-Agent': 'create-onchain-cli' }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }

      const contentLength = response.headers.get('content-length');
      const totalSize = contentLength ? parseInt(contentLength) : 0;
      let downloadedSize = 0;

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to read response body');
      }

      const chunks = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        downloadedSize += value.length;
        
        if (totalSize > 0) {
          const percent = Math.round((downloadedSize / totalSize) * 100);
          process.stdout.write(\`\\r📥 Downloading \${path.basename(filepath)} (\${percent}%)...\`);
        }
      }

      const buffer = new Uint8Array(downloadedSize);
      let offset = 0;
      for (const chunk of chunks) {
        buffer.set(chunk, offset);
        offset += chunk.length;
      }

      fs.writeFileSync(filepath, buffer);
      process.stdout.write(\`\\r✅ Downloaded \${path.basename(filepath)} (\${(downloadedSize / 1024).toFixed(1)}KB)\\n\`);
      
      return { success: true, size: downloadedSize };
      
    } catch (error) {
      const isLastAttempt = attempt === maxRetries;
      
      if (error.name === 'AbortError') {
        if (isLastAttempt) {
          return { success: false, error: 'Download timed out after 30 seconds' };
        }
      } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        if (isLastAttempt) {
          return { success: false, error: 'Network connection failed - please check your internet connection' };
        }
      } else {
        if (isLastAttempt) {
          return { success: false, error: \`Download failed: \${error.message}\` };
        }
      }

      if (!isLastAttempt) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  return { success: false, error: 'Max retries exceeded' };
}

async function updateLLMDocs() {
  try {
    const configPath = path.join(__dirname, 'agent-config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ agent-config.json not found. Run npm create-onchain --mini to set up agent docs.');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const agentDocsDir = __dirname;

    // Check if online
    console.log('🔄 Checking internet connection...');
    const online = await isOnline();
    
    if (!online) {
      console.error('❌ No internet connection detected. Please check your network and try again.');
      process.exit(1);
    }

    console.log('📥 Updating LLM documentation files...');
    const results = [];

    for (const docType of config.selectedDocs) {
      const url = config.sources[docType];
      if (url) {
        const filename = \`\${docType}-llms-full.txt\`;
        const filepath = path.join(agentDocsDir, filename);
        
        const result = await downloadWithRetry(url, filepath, 3);
        results.push({
          name: docType,
          success: result.success,
          error: result.error,
          size: result.size
        });
      }
    }

    // Report results
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    if (successful.length > 0) {
      console.log(\`\\n🎉 Successfully updated \${successful.length}/\${results.length} documentation files\`);
    }
    
    if (failed.length > 0) {
      console.log(\`\\n⚠️  \${failed.length} downloads failed:\`);
      for (const result of failed) {
        console.log(\`  ❌ \${result.name}: \${result.error}\`);
      }
    }

    // Update config
    config.lastUpdated = new Date().toISOString();
    config.offline = false;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    if (failed.length === 0) {
      console.log('\\n✨ All documentation files are up to date!');
    }
    
  } catch (error) {
    console.error('❌ Failed to update LLM documentation:', error.message);
    process.exit(1);
  }
}

updateLLMDocs();`;

  await fs.promises.writeFile(updateScriptPath, updateScriptContent);
  await fs.promises.chmod(updateScriptPath, 0o755); // Make executable
}

export async function createMiniKitTemplate(
  template: 'minikit-snake' | 'minikit-basic' = 'minikit-basic',
) {
  console.log(
    `${pc.greenBright(`
    /////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                             //
    //         :::   :::   ::::::::::: ::::    ::: ::::::::::: :::    ::: ::::::::::: :::::::::::  //
    //        :+:+: :+:+:      :+:     :+:+:   :+:     :+:     :+:   :+:      :+:         :+:      //
    //       +:+ +:+:+ +:+    +:+     :+:+:+  +:+     +:+     +:+  +:+       +:+         +:+       //
    //      +#+  +:+  +#+    +#+     +#+ +:+ +#+     +#+     +#++:++        +#+         +#+        //
    //     +#+       +#+    +#+     +#+  +#+#+#     +#+     +#+  +#+       +#+         +#+         //
    //    #+#       #+#    #+#     #+#   #+#+#     #+#     #+#   #+#      #+#         #+#          //
    //   ###       ###  ########  ###    ####   ########  ###    ###   ########      ###           //
    //                                                                                             //
    //                                                                     Powered by OnchainKit   //
    /////////////////////////////////////////////////////////////////////////////////////////////////`)}\n\n`,
  );

  const defaultProjectName = 'my-minikit-app';

  let result: prompts.Answers<'projectName' | 'packageName' | 'clientKey' | 'llmDocs'>;

  try {
    result = await prompts(
      [
        {
          type: 'text',
          name: 'projectName',
          message: pc.reset('Project name:'),
          initial: defaultProjectName,
          onState: (state) => {
            state.value = state.value.trim();
          },
          validate: (value) => {
            const targetDir = path.join(process.cwd(), value);
            if (
              fs.existsSync(targetDir) &&
              fs.readdirSync(targetDir).length > 0
            ) {
              return 'Directory already exists and is not empty. Please choose a different name.';
            }
            return true;
          },
        },
        {
          type: (_, { projectName }: { projectName: string }) =>
            isValidPackageName(projectName) ? null : 'text',
          name: 'packageName',
          message: pc.reset('Package name:'),
          initial: (_, { projectName }: { projectName: string }) =>
            toValidPackageName(projectName),
          validate: (dir) =>
            isValidPackageName(dir) || 'Invalid package.json name',
        },
        {
          type: 'password',
          name: 'clientKey',
          message: pc.reset(
            `Enter your ${createClickableLink(
              'Coinbase Developer Platform Client API Key:',
              'https://portal.cdp.coinbase.com/products/onchainkit',
            )} (optional)`,
          ),
        },
        {
          type: 'multiselect',
          name: 'llmDocs',
          message: pc.reset('Download AI agent documentation for these tools:'),
          choices: [
            { title: 'Base (L2 blockchain)', value: 'base', selected: true },
            { title: 'Farcaster (Mini App APIs)', value: 'farcaster', selected: true },
            { title: 'Neynar (Farcaster API service)', value: 'neynar', selected: false },
            { title: 'Privy (Auth & wallets)', value: 'privy', selected: false },
          ],
          hint: '↑↓ navigate, space to select, enter to confirm',
          instructions: false,
        },
      ],
      {
        onCancel: () => {
          console.log('\nProject creation cancelled.');
          process.exit(0);
        },
      },
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    process.exit(1);
  }

  const { projectName, packageName, clientKey, llmDocs } = result;
  const root = path.join(process.cwd(), projectName);

  await analyticsPrompt(template);

  const spinner = ora(`Creating ${projectName}...`).start();

  const sourceDir = path.resolve(
    fileURLToPath(import.meta.url),
    `../../../templates/${template}`,
  );

  await copyDir(sourceDir, root);
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf-8'));
  pkg.name = packageName || toValidPackageName(projectName);
  
  // Add update script for LLM docs if any were selected
  if (llmDocs && llmDocs.length > 0) {
    if (!pkg.scripts) {
      pkg.scripts = {};
    }
    pkg.scripts['update-llm-docs'] = 'node agent-docs/update-llm-docs.js';
  }
  
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // Create agent-docs folder and download LLM text files
  if (llmDocs && llmDocs.length > 0) {
    await setupAgentDocs(root, llmDocs);
  }

  // Create .env file
  const envPath = path.join(root, '.env');
  await fs.promises.writeFile(
    envPath,
    `# Shared/OnchainKit variables

NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=${projectName}
NEXT_PUBLIC_URL=
NEXT_PUBLIC_ICON_URL=$NEXT_PUBLIC_URL/logo.png
NEXT_PUBLIC_ONCHAINKIT_API_KEY=${clientKey}

# Frame metadata

FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=
NEXT_PUBLIC_APP_ICON=$NEXT_PUBLIC_URL/icon.png
# Optional Frame metadata items below
NEXT_PUBLIC_APP_SUBTITLE=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_APP_SPLASH_IMAGE=$NEXT_PUBLIC_URL/splash.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR="#000000"
NEXT_PUBLIC_APP_PRIMARY_CATEGORY=
NEXT_PUBLIC_APP_HERO_IMAGE=$NEXT_PUBLIC_URL/hero.png
NEXT_PUBLIC_APP_TAGLINE=
NEXT_PUBLIC_APP_OG_TITLE=${projectName}
NEXT_PUBLIC_APP_OG_DESCRIPTION=
NEXT_PUBLIC_APP_OG_IMAGE=$NEXT_PUBLIC_URL/hero.png

# Redis config

REDIS_URL=
REDIS_TOKEN=
`,
  );

  spinner.succeed();

  console.log(`\n\n${pc.magenta(`Created new MiniKit project in ${root}`)}\n`);

  logMiniKitSetupSummary(projectName, root, clientKey);
}

function logMiniKitSetupSummary(
  projectName: string,
  root: string,
  clientKey: string,
) {
  console.log(`\nIntegrations:`);

  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`MiniKit`)}`);
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`OnchainKit`)}`);
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Base`)}`);
  if (clientKey) {
    console.log(
      `${pc.greenBright('\u2713')} ${pc.blueBright(
        `Coinbase Developer Platform`,
      )}`,
    );
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Paymaster`)}`);
  }

  console.log(`\nFrameworks:`);
  console.log(`${pc.cyan('- Wagmi')}`);
  console.log(`${pc.cyan('- React')}`);
  console.log(`${pc.cyan('- Next.js')}`);
  console.log(`${pc.cyan('- Tailwind CSS')}`);
  console.log(`${pc.cyan('- ESLint')}`);
  console.log(`${pc.cyan('- Upstash Redis')}`);

  const codeColor = (str: string) => pc.bgBlack(pc.green(str));

  [
    `\nTo get started with ${pc.green(projectName)}, run the following commands:\n`,
    root !== process.cwd()
      ? `- ${codeColor(`cd ${path.relative(process.cwd(), root)}`)}`
      : '',
    `- ${codeColor('npm install')}`,
    `- ${codeColor('npm run dev')}`,
    '\nBefore launching your app:',
    '\n- Set up account manifest',
    '  - Required for app discovery, notifications, and client integration',
    `  - Run ${codeColor('npx create-onchain --manifest')} from project root`,
    '- Support webhooks and background notifications (optional)',
    `  - Set ${codeColor('REDIS_URL')} and ${codeColor('REDIS_TOKEN')} environment variables`,
  ]
    .filter(Boolean)
    .forEach((line) => {
      console.log(line);
    });
}
