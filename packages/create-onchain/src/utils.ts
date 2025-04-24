import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

export const getVersion = async () => {
  const pkgPath = path.resolve(
    fileURLToPath(import.meta.url),
    '../../../package.json',
  );
  const packageJsonContent = await fs.readFile(pkgPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  return packageJson.version;
}

const renameFiles: Record<string, string | undefined> = {
  _gitignore: '.gitignore',
  '_env.local': '.env.local',
};

const excludeDirs = ['node_modules', '.next'];
const excludeFiles = ['.DS_Store', 'Thumbs.db'];

export async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

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


async function optimizedCopyFile(src: string, dest: string) {
  await fs.copyFile(src, dest);
}

async function optimizedCopyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await optimizedCopyDir(srcPath, destPath);
      } else {
        await optimizedCopyFile(srcPath, destPath);
      }
    })
  );
}

export async function optimizedCopy(src: string, dest: string) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await optimizedCopyDir(src, dest);
  } else {
    await optimizedCopyFile(src, dest);
  }
}

export function createClickableLink(text: string, url: string): string {
  // OSC 8 ;; URL \a TEXT \a
  return `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`;
}

export function isValidPackageName(projectName: string) {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(
    projectName
  );
}

export function toValidPackageName(projectName: string) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-');
}

export function detectPackageManager(): string {
  if (process.env.npm_config_user_agent) {
    if (process.env.npm_config_user_agent.startsWith('yarn')) {
      return 'yarn';
    }
    if (process.env.npm_config_user_agent.startsWith('pnpm')) {
      return 'pnpm';
    }
    if (process.env.npm_config_user_agent.startsWith('npm')) {
      return 'npm';
    }
    if (process.env.npm_config_user_agent.startsWith('bun')) {
      return 'bun';
    }
  }
  return 'npm'; // default to npm if unable to detect
}
