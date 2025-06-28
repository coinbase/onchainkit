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
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

const LLM_DOCS_URLS = {
  farcaster: 'https://miniapps.farcaster.xyz/llms-full.txt',
  neynar: 'https://docs.neynar.com/llms-full.txt',
  privy: 'https://docs.privy.io/llms-full.txt',
};

async function setupAgentDocs(root: string, selectedDocs: string[]) {
  const agentDocsDir = path.join(root, 'agent-docs');
  await fs.promises.mkdir(agentDocsDir, { recursive: true });

  const spinner = ora('Downloading LLM documentation...').start();

  try {
    for (const docType of selectedDocs) {
      const url = LLM_DOCS_URLS[docType as keyof typeof LLM_DOCS_URLS];
      if (url) {
        const filename = `${docType}-llms-full.txt`;
        const filepath = path.join(agentDocsDir, filename);
        
        try {
          await execAsync(`curl -s "${url}" -o "${filepath}"`);
          spinner.text = `Downloaded ${docType} documentation`;
        } catch (error) {
          console.warn(`Failed to download ${docType} documentation: ${error}`);
        }
      }
    }

    // Create agent config file to store preferences
    const configPath = path.join(agentDocsDir, 'agent-config.json');
    const config = {
      selectedDocs,
      lastUpdated: new Date().toISOString(),
      sources: selectedDocs.reduce((acc, doc) => {
        acc[doc] = LLM_DOCS_URLS[doc as keyof typeof LLM_DOCS_URLS];
        return acc;
      }, {} as Record<string, string>),
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

## Usage

These files are optimized for LLM consumption and contain comprehensive API documentation that can be used by AI agents and development tools.
`;

    await fs.promises.writeFile(readmePath, readmeContent);

    // Create update script inside agent-docs folder
    const updateScriptPath = path.join(agentDocsDir, 'update-llm-docs.js');
    const updateScriptContent = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

const LLM_DOCS_URLS = {
  farcaster: 'https://miniapps.farcaster.xyz/llms-full.txt',
  neynar: 'https://docs.neynar.com/llms-full.txt',
  privy: 'https://docs.privy.io/llms-full.txt',
};

async function updateLLMDocs() {
  try {
    const configPath = path.join(__dirname, 'agent-config.json');
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ agent-config.json not found. Run npm create-onchain --mini to set up agent docs.');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const agentDocsDir = __dirname;

    console.log('🔄 Updating LLM documentation files...');

    for (const docType of config.selectedDocs) {
      const url = LLM_DOCS_URLS[docType];
      if (url) {
        const filename = \`\${docType}-llms-full.txt\`;
        const filepath = path.join(agentDocsDir, filename);
        
        try {
          console.log(\`📥 Downloading \${docType} documentation...\`);
          await execAsync(\`curl -s "\${url}" -o "\${filepath}"\`);
          console.log(\`✅ Updated \${docType} documentation\`);
        } catch (error) {
          console.error(\`❌ Failed to download \${docType} documentation:\`, error.message);
        }
      }
    }

    // Update config with new timestamp
    config.lastUpdated = new Date().toISOString();
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

    console.log('🎉 All LLM documentation files updated successfully!');
  } catch (error) {
    console.error('❌ Failed to update LLM documentation:', error.message);
    process.exit(1);
  }
}

updateLLMDocs();
`;

    await fs.promises.writeFile(updateScriptPath, updateScriptContent);
    await fs.promises.chmod(updateScriptPath, 0o755); // Make executable

    spinner.succeed('LLM documentation downloaded successfully');
  } catch (error) {
    spinner.fail(`Failed to setup agent documentation: ${error}`);
  }
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
          message: pc.reset('Select LLM docs:'),
          choices: [
            { title: 'Farcaster', value: 'farcaster', selected: true },
            { title: 'Neynar', value: 'neynar', selected: false },
            { title: 'Privy', value: 'privy', selected: false },
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
