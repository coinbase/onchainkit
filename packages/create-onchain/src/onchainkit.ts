import path from 'path';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import fs from 'fs';
import {
  isValidPackageName,
  toValidPackageName,
  createClickableLink,
  copyDir,
  addToGitignore,
} from './utils.js';
import { fileURLToPath } from 'url';
import { analyticsPrompt } from './analytics.js';

export async function createOnchainKitTemplate() {
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
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////`)}\n\n`,
  );

  const defaultProjectName = 'my-onchainkit-app';

  let result: prompts.Answers<'projectName' | 'packageName' | 'clientKey' | 'aiTool'>;

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
          type: 'select',
          name: 'aiTool',
          message: pc.reset('Install default rules for your AI-powered editor?'),
          choices: [
            {
              title: 'None',
              value: 'none',
            },
            {
              title: 'Cursor',
              value: 'cursor',
            },
            {
              title: 'Windsurf',
              value: 'windsurf',
            },
            {
              title: 'Copilot',
              value: 'copilot',
            },
          ],
          initial: 0,
        }
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

  const { projectName, packageName, clientKey, aiTool } = result;
  const root = path.join(process.cwd(), projectName);

  await analyticsPrompt('onchainkit');

  const spinner = ora(`Creating ${projectName}...`).start();

  const sourceDir = path.resolve(
    fileURLToPath(import.meta.url),
    '../../../templates/next',
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
    `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=${projectName}\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=${clientKey}`,
  );

  spinner.succeed();
  console.log(`\n${pc.magenta(`Created new OnchainKit project in ${root}`)}`);

  console.log(`\nIntegrations:`);
  console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Base`)}`);
  if (clientKey) {
    console.log(
      `${pc.greenBright('\u2713')} ${pc.blueBright(
        `Coinbase Developer Platform`,
      )}`,
    );
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`Paymaster`)}`);
  }

  if (aiTool !== 'none') {
    console.log(`${pc.greenBright('\u2713')} ${pc.blueBright(`${aiTool}`)}`);
    const onchainkitRulesTemplate = await fs.promises.readFile(
      path.resolve(
        fileURLToPath(import.meta.url),
        '../../../rules/onchainkit.txt',
      ),
      'utf-8',
    );

    if (aiTool === 'cursor') {
      const rulesDir = path.join(root, '.cursor/rules');

      const fileContent = `---
description: OnchainKit Cursor Rules
globs:
alwaysApply: false
---
${onchainkitRulesTemplate.trim()}`;
      await fs.promises.mkdir(rulesDir, { recursive: true });
      // Write the file
      await fs.promises.writeFile(path.join(rulesDir, 'onchainkit.mdc'), fileContent);
      await addToGitignore({
        gitignorePath: path.join(root, '.gitignore'),
        additionalPath: '.cursor/rules/onchainkit.mdc',
      });
    } else if (aiTool === 'windsurf') {
      await fs.promises.writeFile(
        path.join(root, '.windsurfrules'), 
        onchainkitRulesTemplate,
      );
      await addToGitignore({
        gitignorePath: path.join(root, '.gitignore'),
        additionalPath: '.windsurfrules',
      });
    } else if (aiTool === 'copilot') {
      await fs.promises.mkdir(path.join(root, '.github'), { recursive: true });

      await fs.promises.writeFile(
        path.join(root, '.github/copilot-instructions.md'),
        onchainkitRulesTemplate,
      );
      await addToGitignore({
        gitignorePath: path.join(root, '.gitignore'),
        additionalPath: '.github/copilot-instructions.md',
      });
    }
  }

  console.log(`\nFrameworks:`);
  console.log(`${pc.cyan('- Wagmi')}`);
  console.log(`${pc.cyan('- React')}`);
  console.log(`${pc.cyan('- Next.js')}`);
  console.log(`${pc.cyan('- Tailwind CSS')}`);
  console.log(`${pc.cyan('- ESLint')}`);

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
}
