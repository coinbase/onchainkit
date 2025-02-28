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
  optimizedCopy,
} from './utils.js';
import open from 'open';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
  '_env.local': '.env.local',
};

const excludeDirs = ['node_modules', '.next'];
const excludeFiles = ['.DS_Store', 'Thumbs.db'];

async function copyDir(src: string, dest: string) {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, renameFiles[entry.name] || entry.name);

    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) {
        await copyDir(srcPath, destPath);
      }
    } else {
      if (!excludeFiles.includes(entry.name)) {
        await optimizedCopy(srcPath, destPath);
      }
    }
  }
}

type WebpageData = { header: string, payload: string, signature: string, domain: string };

async function getWebpageData(browser: 'safari' | 'google chrome' | 'none'): Promise<WebpageData> {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.use(express.static(path.resolve(
    fileURLToPath(import.meta.url),
    '../../../src/manifest'
  )));

  return new Promise((resolve, reject) => {
    wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (data: Buffer) => {
        const parsedData = JSON.parse(data.toString());
        server.close();
        resolve(parsedData);
      });
      ws.on('close', () => {
        server.close();
        reject(new Error('WebSocket connection closed'));
      });
    });

    server.listen(3333, () => {
      open('http://localhost:3333', browser === 'none' ? undefined : {
        app: {
          name: browser
        }
      });
    });
  });
}

async function createMiniKitAccountAssociation(envPath?: string) {
  if (!envPath) {
    envPath = path.join(process.cwd(), '.env');
  }

  const existingEnv = await fs.promises.readFile(envPath, 'utf-8').catch(() => null);
  if (!existingEnv) {
    console.log(pc.red('\n* Failed to read .env file. Please ensure you are in your project directory.'));
    return false;
  }

  let browserResult: prompts.Answers<'browser'>;
  try {
    browserResult = await prompts(
      [
        {
          type: 'select',
          name: 'browser',
          message: pc.reset('If you want to sign your account manifest with your TBA account, please select the OS of your device:'),
          choices: [
            { title: 'iOS', value: 'safari' },
            { title: 'Android', value: 'google chrome' },
            { title: 'Not using a passkey account', value: 'none' },
          ],
        }
      ],
      {
        onCancel: () => {
          throw new Error('Browser selection cancelled.');
        },
      }
    );
  } catch (cancelled: any) {
    console.log(pc.red(`\n${cancelled.message}`));
    return false;
  }

  const { browser } = browserResult;
  try {
    const webpageData = await getWebpageData(browser);
    const envContent = `FARCASTER_HEADER=${webpageData.header}\nFARCASTER_PAYLOAD=${webpageData.payload}\nFARCASTER_SIGNATURE=${webpageData.signature}\nNEXT_PUBLIC_URL=${webpageData.domain}`;
    const updatedEnv = existingEnv
      .split('\n')
      .filter(line => !line.startsWith('FARCASTER_') && !line.startsWith('NEXT_PUBLIC_URL'))
      .concat(envContent)
      .join('\n');
    await fs.promises.writeFile(envPath, updatedEnv);

    console.log(pc.blue('\n* Account association generated successfully and added to your .env file!'));
  } catch (error) {
    console.log(pc.red('\n* Failed to generate account association. Please try again.'));
    return false;
  }

  return true;
}

async function createMiniKitTemplate() {
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
    /////////////////////////////////////////////////////////////////////////////////////////////////`)}\n\n`
  );

  const defaultProjectName = 'my-minikit-app';

  let result: prompts.Answers<
    'projectName' | 'packageName' | 'clientKey'
  >;

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
              'https://portal.cdp.coinbase.com/products/onchainkit'
            )} (optional)`
          ),
        },
      ],
      {
        onCancel: () => {
          console.log('\nProject creation cancelled.');
          process.exit(0);
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    process.exit(1);
  }

  const { projectName, packageName, clientKey } = result;
  const root = path.join(process.cwd(), projectName);

  const spinner = ora(`Creating ${projectName}...`).start();

  const sourceDir = path.resolve(
    fileURLToPath(import.meta.url), 
    '../../../templates/minikit'
  );
  
  await copyDir(sourceDir, root);
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf-8'));
  pkg.name = packageName || toValidPackageName(projectName);
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // Create .env file
  const envPath = path.join(root, '.env');
  await fs.promises.writeFile(
    envPath,
    `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=${projectName}
NEXT_PUBLIC_ONCHAINKIT_API_KEY=${clientKey}
NEXT_PUBLIC_URL=
NEXT_PUBLIC_SPLASH_IMAGE_URL=$NEXT_PUBLIC_URL/minikit.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=FFFFFF
NEXT_PUBLIC_IMAGE_URL=$NEXT_PUBLIC_URL/minikit.png
NEXT_PUBLIC_ICON_URL=https://onchainkit.xyz/favicon/48x48.png
NEXT_PUBLIC_VERSION=next
REDIS_URL=
REDIS_TOKEN=`
  );

  spinner.succeed();

  console.log(`\n\n${pc.magenta(`Created new MiniKit project in ${root}`)}\n`);

  console.log(`\n${pc.reset('Do you want to set up your Frames Account Manifest now?')}`);
  console.log(pc.blue('* You can set this up later by running `npm create-onchain --generate` in your project directory.'));
  console.log(pc.blue('* Note: this process will open in a new browser window.'));

  let setUpFrameResult: prompts.Answers<'setUpFrame'>;
  try {
    setUpFrameResult = await prompts(
      [
        {
          type: 'toggle',
          name: 'setUpFrame',
          message: pc.reset('Set up now?'),
          initial: true,
          active: 'yes',
          inactive: 'no',
        },
      ],
      {
        onCancel: () => {
          console.log('\nSetup frame cancelled.');
          return false;
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return false;
  }

  const { setUpFrame } = setUpFrameResult;
  if (setUpFrame) {
    await createMiniKitAccountAssociation(envPath);
  }

  logMiniKitSetupSummary(projectName, root, clientKey);
}

function logMiniKitSetupSummary(projectName: string, root: string, clientKey: string) {
  console.log(`\nIntegrations:`);

  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`MiniKit`)}`);
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`OnchainKit`)}`);
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Base`)}`);
  if (clientKey) {
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Coinbase Developer Platform`)}`);
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Paymaster`)}`);
  }

  console.log(`\nFrameworks:`);
  console.log(`${pc.cyan('- Wagmi')}`);
  console.log(`${pc.cyan('- React')}`);
  console.log(`${pc.cyan('- Next.js')}`);
  console.log(`${pc.cyan('- Tailwind CSS')}`);
  console.log(`${pc.cyan('- ESLint')}`);
  console.log(`${pc.cyan('- Upstash Redis')}`);

  console.log(`\nTo get started with ${pc.green(projectName)}, run the following commands:\n`);
  if (root !== process.cwd()) {
    console.log(` - cd ${path.relative(process.cwd(), root)}`);
  }
  console.log(' - npm install');
  console.log(' - npm run dev');

  console.log(pc.blue('\n* Don\'t forget to update the environment variables for your project in the `.env` file.'));
}

async function createOnchainKitTemplate() {
  console.log(
    `${pc.greenBright(`
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //                                                                                                                              //
    //         ::::::::  ::::    :::  ::::::::  :::    :::     :::     ::::::::::: ::::    ::: :::    ::: ::::::::::: :::::::::::   //
    //       :+:    :+: :+:+:   :+: :+:    :+: :+:    :+:   :+: :+:       :+:     :+:+:   :+: :+:   :+:      :+:         :+:        //
    //      +:+    +:+ :+:+:+  +:+ +:+        +:+    +:+  +:+   +:+      +:+     :+:+:+  +:+ +:+  +:+       +:+         +:+         //
    //     +#+    +:+ +#+ +:+ +#+ +#+        +#++:++#++ +#++:++#++:     +#+     +#+ +:+ +#+ +#++:++        +#+         +#+          //
    //    +#+    +#+ +#+  +#+#+# +#+        +#+    +#+ +#+     +#+     +#+     +#+  +#+#+# +#+  +#+       +#+         +#+           //
    //   #+#    #+# #+#   #+#+# #+#    #+# #+#    #+# #+#     #+#     #+#     #+#   #+#+# #+#   #+#      #+#         #+#            //
    //   ########  ###    ####  ########  ###    ### ###     ### ########### ###    #### ###    ### ###########     ###             //
    //                                                                                                                              //
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////`)}\n\n`
  );


  const defaultProjectName = 'my-onchainkit-app';

  let result: prompts.Answers<
    'projectName' | 'packageName' | 'clientKey' | 'smartWallet'
  >;

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
              'https://portal.cdp.coinbase.com/products/onchainkit'
            )} (optional)`
          ),
        },
        {
          type: 'toggle',
          name: 'smartWallet',
          message: pc.reset('Use Coinbase Smart Wallet? (recommended)'),
          initial: true,
          active: 'yes',
          inactive: 'no',
        }
      ],
      {
        onCancel: () => {
          console.log('\nProject creation cancelled.');
          process.exit(0);
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    process.exit(1);
  }

  const { projectName, packageName, clientKey, smartWallet } = result;
  const root = path.join(process.cwd(), projectName);

  const spinner = ora(`Creating ${projectName}...`).start();

  const sourceDir = path.resolve(
    fileURLToPath(import.meta.url), 
    '../../../templates/next'
  );
  
  await copyDir(sourceDir, root);
  const pkgPath = path.join(root, 'package.json');
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf-8'));
  pkg.name = packageName || toValidPackageName(projectName);
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // Create .env file
  const envPath = path.join(root, '.env');
  await fs.promises.writeFile(
    envPath,
    `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=${projectName}\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=${clientKey}\nNEXT_PUBLIC_ONCHAINKIT_WALLET_CONFIG=${
      smartWallet ? 'smartWalletOnly' : 'all'
    }`
  );
  
  spinner.succeed();
  console.log(`\n${pc.magenta(`Created new OnchainKit project in ${root}`)}`);

  console.log(`\nIntegrations:`);
  if (smartWallet) {
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Smart Wallet`)}`);
  }
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Base`)}`);
  if (clientKey) {
    console.log(
      `${pc.greenBright('\u2713')} ${pc.blueBright(
        `Coinbase Developer Platform`
      )}`
    );
    console.log(
      `${pc.greenBright('\u2713')} ${pc.blueBright(
        `Paymaster`
      )}`
    );
  }

  console.log(`\nFrameworks:`);
  console.log(`${pc.cyan('- Wagmi')}`);
  console.log(`${pc.cyan('- React')}`);
  console.log(`${pc.cyan('- Next.js')}`);
  console.log(`${pc.cyan('- Tailwind CSS')}`);
  console.log(`${pc.cyan('- ESLint')}`);

  console.log(
    `\nTo get started with ${pc.green(
      projectName
    )}, run the following commands:\n`
  );
  if (root !== process.cwd()) {
    console.log(` - cd ${path.relative(process.cwd(), root)}`);
  }
  console.log(' - npm install');
  console.log(' - npm run dev');
}

export function getArgs() {
  const options = { isHelp: false, isVersion: false, isGenerate: false, isMiniKit: false };

  // find any argument with -- or -
  const arg = process.argv.find(arg => arg.startsWith('--') || arg.startsWith('-'));
  switch(arg) {
    case '-h':
    case '--help':
      options.isHelp = true;
      break;
    case '-v':
    case '--version':
      options.isVersion = true;
      break;
    case '-g':
    case '--generate':
      options.isGenerate = true;
      break;
    case '-m':
    case '--mini':
      options.isMiniKit = true;
      break;
    default:
      break;
  }

  return options;
}

async function init() {
  const { isHelp, isVersion, isGenerate, isMiniKit } = getArgs();
  if (isHelp) {
    console.log(
`${pc.greenBright(`
Usage:
npm create-onchain [options]

Creates an OnchainKit project based on nextJs.

Options:
--version, -v: Show version
--mini, -m: Create a MiniKit project
--generate, -g: Generate your Frames account association
--help, -h: Show help
`)}`
    );
    process.exit(0);
  }

  if (isVersion) {
    const pkgPath = path.resolve(
      fileURLToPath(import.meta.url),
      '../../../package.json'
    );
    const packageJsonContent = fs.readFileSync(pkgPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    console.log(`${pc.greenBright(`v${packageJson.version}`)}`);
    process.exit(0);
  }
  
  if (isGenerate) {
    await createMiniKitAccountAssociation();
    process.exit(0);
  }

  if (isMiniKit) {
    await createMiniKitTemplate();
  } else {
    await createOnchainKitTemplate();
  }
}

init().catch((e) => {
  console.error(e);
});
