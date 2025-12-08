import process from 'process';
import { cp, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const args = process.argv.slice(2);
  const outFlagIndex = args.indexOf('--out');

  if (outFlagIndex === -1 || !args[outFlagIndex + 1]) {
    console.error('Please specify an output directory with --out');
    process.exit(1);
  }

  const outputDir = args[outFlagIndex + 1];
  const sourceDir = join(__dirname, '..', 'dist');

  try {
    // create output directory if it doesn't exist
    await mkdir(outputDir, { recursive: true });

    // recursively copy all files from source to destination
    await cp(sourceDir, outputDir, { recursive: true });

    console.log(`Successfully copied files to ${outputDir}`);
  } catch (err) {
    console.error('Error copying files:', err);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
});
