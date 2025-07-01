import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const CURRENT_PATH = fileURLToPath(import.meta.url);
const WORKSPACE_ROOT = path.resolve(
  path.dirname(CURRENT_PATH),
  '..',
  '..',
  '..',
);
const OCK_PACKAGE_JSON_PATH = path.resolve(
  WORKSPACE_ROOT,
  'packages',
  'onchainkit',
  'package.json',
);

export function getOckVersion() {
  const packageJson = JSON.parse(
    fs.readFileSync(OCK_PACKAGE_JSON_PATH, 'utf-8'),
  );
  const fullVersion = packageJson.version;

  const versionMatch = fullVersion.match(
    /^(?<core>\d+\.\d+\.\d+)(?:-(?<prereleaseTag>[a-zA-Z]+)\.?(?<prereleaseVersion>\d+)?)?$/,
  );

  if (!versionMatch) {
    throw new Error(`Invalid version format: ${fullVersion}`);
  }

  const {
    core,
    prereleaseTag = '',
    prereleaseVersion = '',
  } = versionMatch.groups;

  return {
    full: fullVersion,
    core,
    prereleaseTag,
    prereleaseVersion,
  };
}
