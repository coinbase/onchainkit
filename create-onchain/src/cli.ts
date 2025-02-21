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
import { spawn } from 'child_process';

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

  console.log(`\n${pc.magenta(`Created new MiniKit project in ${root}`)}`);

  console.log('\nWould you like to set up your Frames Account Association now?');
  console.log(pc.blue('* You can set this up later by running `npm run generate-account-association` or updating your `.env` file manually.\n'));

  let setUpFrameResult: prompts.Answers<'setUpFrame'>;
  try {
    setUpFrameResult = await prompts(
      [
        {
          type: 'toggle',
          name: 'setUpFrame',
          message: pc.reset('Set up Frame integration now?'),
          initial: true,
          active: 'yes',
          inactive: 'no',
        }
      ],
      {
        onCancel: () => {
          console.log('\nSetup frame cancelled.');
          process.exit(1);
        },
      }
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    process.exit(1);
  }

  const { setUpFrame } = setUpFrameResult;
  if (setUpFrame) {
    const scriptPath = path.resolve(
      fileURLToPath(import.meta.url),
      '../../../templates/minikit/scripts/generateAccountAssociation.mjs'
    );

    // spawn the generate-account-association command
    const generateAccountAssociation = spawn('node', [scriptPath, root], {
      stdio: 'inherit',
      cwd: process.cwd(),
      shell: true
    });

    generateAccountAssociation.on('close', (code: number) => {
      if (code === 0) {
        logMiniKitSetupSummary(projectName, root, clientKey);
      } else {
        console.error('Failed to generate account association');
        logMiniKitSetupSummary(projectName, root, clientKey);
      }
    });
  } else {
    logMiniKitSetupSummary(projectName, root, clientKey);
  }
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

async function init() {
  const isMinikit = process.argv.includes('--mini');

  if (isMinikit) {
    await createMiniKitTemplate();
  } else {
    await createOnchainKitTemplate();
  }
}

init().catch((e) => {
  console.error(e);
});
