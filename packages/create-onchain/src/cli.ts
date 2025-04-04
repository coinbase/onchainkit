#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pc from 'picocolors';
import { createOnchainKitTemplate } from './onchainkit.js';
import { createMiniKitTemplate, createMiniKitManifest } from './minikit.js';

export function getArgs() {
  const options = {
    isHelp: false,
    isVersion: false,
    isManifest: false,
    isMiniKit: false,
  };

  // find any argument with -- or -
  const arg = process.argv.find(
    (arg) => arg.startsWith('--') || arg.startsWith('-'),
  );
  switch (arg) {
    case '-h':
    case '--help':
      options.isHelp = true;
      break;
    case '-v':
    case '--version':
      options.isVersion = true;
      break;
    case '--manifest':
      options.isManifest = true;
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
  const { isHelp, isVersion, isManifest, isMiniKit } = getArgs();
  if (isHelp) {
    console.log(
      `${pc.greenBright(`
Usage:
npm create-onchain [options]

Creates an OnchainKit project based on nextJs.

Options:
--version: Show version
--mini: Create a MiniKit project
--manifest: Generate your Mini-App account association
--help: Show help
`)}`,
    );
    process.exit(0);
  }

  if (isVersion) {
    const pkgPath = path.resolve(
      fileURLToPath(import.meta.url),
      '../../../package.json',
    );
    const packageJsonContent = fs.readFileSync(pkgPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    console.log(`${pc.greenBright(`v${packageJson.version}`)}`);
    process.exit(0);
  }

  if (isManifest) {
    await createMiniKitManifest();
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
