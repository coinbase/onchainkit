// https://github.com/testing-library/jest-dom#with-vitest
import '@testing-library/jest-dom/vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const versionFilePath = path.resolve(__dirname, './src/version.ts');
if (!fs.existsSync(versionFilePath)) {
  execSync('pnpm gen-version');
}
