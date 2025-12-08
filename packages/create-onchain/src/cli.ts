#!/usr/bin/env node
import pc from 'picocolors';
import { createOnchainKitTemplate } from './onchainkit.js';
import { createMiniKitTemplate, createMiniKitManifest } from './minikit.js';
import { getVersion } from './utils.js';

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
    case '--template=minikit-basic':
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
--mini: Create the MiniKit template
--template=<template>: Create a specific template
--manifest: Generate your Mini-App manifest
--help: Show help

Available Templates:
- onchainkit-nextjs: Create a basic OnchainKit project
- minikit-nextjs: Create a MiniKit project
`)}`,
    );
    process.exit(0);
  }

  if (isVersion) {
    const version = await getVersion();
    console.log(`${pc.greenBright(`v${version}`)}`);
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
