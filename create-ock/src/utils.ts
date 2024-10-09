import fs from 'fs/promises';
import path from 'path';

async function copyFile(src: string, dest: string) {
  await fs.copyFile(src, dest);
}

async function copyDir(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        await copyDir(srcPath, destPath);
      } else {
        await copyFile(srcPath, destPath);
      }
    })
  );
}

export async function optimizedCopy(src: string, dest: string) {
  const stat = await fs.stat(src);
  if (stat.isDirectory()) {
    await copyDir(src, dest);
  } else {
    await copyFile(src, dest);
  }
}
