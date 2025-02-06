#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import {
  createClickableLink,
  detectPackageManager,
  isValidPackageName,
  toValidPackageName,
  optimizedCopy,
} from './utils.js';

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

type CreateTemplateParams = {
  root: string;
  projectName: string;
  packageName: string;
  clientKey: string;
  smartWallet: boolean;
}

async function createMiniKitTemplate({root, projectName, packageName, clientKey, smartWallet}: CreateTemplateParams) {
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
NEXT_PUBLIC_ONCHAINKIT_WALLET_CONFIG=${
  smartWallet ? 'smartWalletOnly' : 'all'
}
NEXT_PUBLIC_VERSION=next
NEXT_PUBLIC_REDIS_URL=
NEXT_PUBLIC_REDIS_TOKEN=`
  );
}

async function createOnchainKitTemplate({root, projectName, packageName, clientKey, smartWallet}: CreateTemplateParams) {
  const sourceDir = path.resolve(
    fileURLToPath(import.meta.url), 
    '../../../templates/next'
  );
  console.log('fileURLToPath(import.meta.url)', fileURLToPath(import.meta.url));
  console.log('sourceDir',sourceDir);
  
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
  return;
}

async function init() {
  const isMinikit = process.argv.includes('--mini');

  if (isMinikit) {
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
  } else {
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
  }

  const defaultProjectName = isMinikit ? 'my-minikit-app' : 'my-onchainkit-app';

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

  if (isMinikit) {
    await createMiniKitTemplate({root, projectName, packageName, clientKey, smartWallet});
  } else {
    await createOnchainKitTemplate({root, projectName, packageName, clientKey, smartWallet});
  }

  spinner.succeed();
  if (isMinikit) {
    console.log(`\n${pc.magenta(`Created new MiniKit project in ${root}`)}`);
  } else {
    console.log(`\n${pc.magenta(`Created new OnchainKit project in ${root}`)}`);
  }

  console.log(`\nIntegrations:`);
  if (smartWallet) {
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Smart Wallet`)}`);
  }
  if (isMinikit) {
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`MiniKit`)}`);
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
  if (isMinikit) {
    console.log(`${pc.cyan('- Upstash Redis')}`);
  }

  console.log(
    `\nTo get started with ${pc.green(
      projectName
    )}, run the following commands:\n`
  );
  if (root !== process.cwd()) {
    console.log(` - cd ${path.relative(process.cwd(), root)}`);
  }
  console.log(' - npm install');
  if (isMinikit) {
    console.log('\n To generate the farcaster account association, run the following command:');
    console.log(' - npm run generate-account-association\n');
    console.log('\n\n Minikit has been set up with @upstash/redis to send notifications, this requires a REDIS_URL and REDIS_TOKEN in the .env file\n');
  }
  console.log(' - npm run dev');
}

init().catch((e) => {
  console.error(e);
});
