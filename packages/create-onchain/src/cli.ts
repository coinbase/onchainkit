#!/usr/bin/env node
import pc from 'picocolors';
import { createOnchainKitTemplate } from './onchainkit.js';
import { createMiniKitTemplate, createMiniKitManifest, validateMiniKitManifest } from './minikit.js';
import { getVersion } from './utils.js';

export function getArgs() {
  const options = {
    isHelp: false,
    isVersion: false,
    isManifest: false,
    isManifestValidate: false,
    isMiniKitSnake: false,
    isMiniKitBasic: false,
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
    case '--manifest:validate':
      options.isManifestValidate = true;
      break;
    case '-m':
    case '--mini':
    case '--template=minikit-basic':
      options.isMiniKitBasic = true;
      break;
    case '--template=minikit-snake':
      options.isMiniKitSnake = true;
      break;
    default:
      break;
  }

  return options;
}

async function init() {
  const { isHelp, isVersion, isManifest, isManifestValidate, isMiniKitSnake, isMiniKitBasic } =
    getArgs();
  if (isHelp) {
    console.log(
      `${pc.greenBright(`
Usage:
npm create-onchain [options]

Creates an OnchainKit project based on nextJs.

Options:
--version: Show version
--mini: Create the basic MiniKit template
--template=<template>: Create a specific template
--manifest: Generate your Mini-App manifest
--manifest:validate: Validate your deployed Mini-App manifest
--help: Show help

Available Templates:
- onchainkit: Create an OnchainKit project
- minikit-basic: Create a Demo Mini-App
- minikit-snake: Create a Snake Game Mini-App
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

  if (isManifestValidate) {
    await validateMiniKitManifest();
    process.exit(0);
  }

  if (isMiniKitSnake) {
    await createMiniKitTemplate('minikit-snake');
  } else if (isMiniKitBasic) {
    await createMiniKitTemplate('minikit-basic');
  } else {
    await createOnchainKitTemplate();
  }
}

init().catch((e) => {
  console.error(e);
});
