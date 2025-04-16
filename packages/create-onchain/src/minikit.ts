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

export async function validateMiniKitManifest() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });

  app.get('/api/fetch-manifest', async (req, res) => {
    const { domain } = req.query;
    if (!domain) {
      res.statusMessage = 'Missing domain parameter';
      res.status(400).end();
      return;
    }

    try {
      const response = await fetch(`https://${domain}/.well-known/farcaster.json`);
      if (!response.ok) {
        throw new Error(`status: ${response.status}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.statusMessage = `Failed to fetch manifest: ${error}`;
      res.status(500).end();
    }
  });

  app.use(
    express.static(
      path.resolve(fileURLToPath(import.meta.url), '../../manifest'),
    ),
  );

  const indexFile = path.resolve(fileURLToPath(import.meta.url), '../../manifest/index.html')

  // add catch-all for client-side routing
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(indexFile);
  });

  return new Promise(() => {
    wss.on('connection', (ws: WebSocket) => {
      ws.on('close', () => {
        console.log('\nBrowser window closed, exiting...');
        server.close();
        process.exit(0);
      });
    });

    server.listen(3333, () => {
      open('http://localhost:3333/validate');
    });
  });
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

      ws.on('close', () => {
        console.log('\nBrowser window closed, exiting...');
        server.close();
        process.exit(0);
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
    const domain = existingEnv.match(/NEXT_PUBLIC_URL=(.*)/)?.[1] || '$NEXT_PUBLIC_URL';
    const envContent = `FARCASTER_HEADER=${webpageData.header}\nFARCASTER_PAYLOAD=${webpageData.payload}\nFARCASTER_SIGNATURE=${webpageData.signature}\nNEXT_PUBLIC_URL=${webpageData.domain}`;
    const updatedEnv = existingEnv
      .split('\n')
      .map((line) => line.replace(domain, webpageData.domain))
      .filter(
        (line) =>
          !line.startsWith('FARCASTER_') && !line.startsWith('NEXT_PUBLIC_URL'),
      )
      .concat(envContent)
      .join('\n');
    await fs.promises.writeFile(envPath, updatedEnv);

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

  let result: prompts.Answers<'projectName' | 'packageName' | 'clientKey'>;

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

  const { projectName, packageName, clientKey } = result;
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
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  // Create .env file
  const envPath = path.join(root, '.env');
  await fs.promises.writeFile(
    envPath,
    `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=${projectName}
NEXT_PUBLIC_ONCHAINKIT_API_KEY=${clientKey}
NEXT_PUBLIC_URL=
NEXT_PUBLIC_SPLASH_IMAGE_URL=$NEXT_PUBLIC_URL/logo.png
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=FFFFFF
NEXT_PUBLIC_IMAGE_URL=$NEXT_PUBLIC_URL/logo.png
NEXT_PUBLIC_ICON_URL=$NEXT_PUBLIC_URL/logo.png
NEXT_PUBLIC_VERSION=next
REDIS_URL=
REDIS_TOKEN=`,
  );

  spinner.succeed();

  console.log(`\n\n${pc.magenta(`Created new MiniKit project in ${root}`)}\n`);

  console.log(
    pc.blue(
      'Mini-Apps require an account manifest based on your domain host to authenticate and allow users to add your Mini-App.',
    ),
  );
  console.log(
    `\n${pc.reset('Do you want to set up your Mini-App Account Manifest now?')}`,
  );
  console.log(
    pc.blue(
      '* You can set this up later by running `npx create-onchain --manifest` in your project directory.',
    ),
  );
  console.log(
    pc.blue('* Note: this process will open in a new browser window.'),
  );

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
          console.log('\nSetup Mini-App cancelled.');
          return false;
        },
      },
    );
  } catch (cancelled: any) {
    console.log(cancelled.message);
    return false;
  }

  const { setUpFrame } = setUpFrameResult;
  if (setUpFrame) {
    await createMiniKitManifest(envPath);
  }

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

  console.log(
    `\nTo get started with ${pc.green(
      projectName,
    )}, run the following commands:\n`,
  );
  if (root !== process.cwd()) {
    console.log(` - cd ${path.relative(process.cwd(), root)}`);
  }
  console.log(' - npm install');
  console.log(' - npm run dev');

  console.log(
    pc.blue(
      "\n* Don't forget to update the environment variables for your project in the `.env` file. Add Upstash Redis credentials to enable background notifications and webhooks.",
    ),
  );
}
