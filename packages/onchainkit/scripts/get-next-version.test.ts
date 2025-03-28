import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock the modules
vi.mock('child_process');
vi.mock('fs');
vi.mock('path');
vi.mock('url');

describe('get-next-version script', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Mock fileURLToPath and path operations
    vi.mocked(fileURLToPath).mockReturnValue('/mocked/path/to/script.js');
    vi.mocked(path.resolve).mockReturnValue('/mocked/monorepo/root');

    // Mock process.chdir to prevent actual directory changes
    vi.spyOn(process, 'chdir').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should write the next version to version.txt when changeset contains onchainkit update', async () => {
    // Mock execSync to return a sample changeset output
    const mockChangesetOutput = `
🦋  warning no packages have been published
---
@coinbase/onchainkit  1.2.0
---
`;
    vi.mocked(execSync).mockReturnValue(mockChangesetOutput);

    // Mock path.join to return a predictable path
    vi.mocked(path.join).mockReturnValue(
      'packages/onchainkit/dist/version.txt',
    );

    // Import the script
    await import('./get-next-version.js');

    // Verify process.chdir was called with the mocked root
    expect(process.chdir).toHaveBeenCalledWith('/mocked/monorepo/root');

    // Verify execSync was called with correct arguments
    expect(execSync).toHaveBeenCalledWith('pnpm changeset status --verbose', {
      encoding: 'utf-8',
    });

    // Verify the version was written to the file
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'packages/onchainkit/dist/version.txt',
      '1.2.0',
    );
  });

  it('should fall back to package.json version when changeset check fails', async () => {
    // Mock execSync to throw an error
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('Command failed');
    });

    // Mock fs.readFileSync to return package.json content
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.1.0' }),
    );

    // Mock path.join for both package.json and version.txt paths
    vi.mocked(path.join)
      .mockReturnValueOnce('packages/onchainkit/package.json')
      .mockReturnValueOnce('packages/onchainkit/dist/version.txt');

    // Import the script
    await import('./get-next-version.js');

    // Verify the fallback version was written to the file
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'packages/onchainkit/dist/version.txt',
      '1.1.0',
    );
  });

  it('should exit with error code 1 when both changeset and package.json fallback fail', async () => {
    // Mock execSync to throw an error
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('Command failed');
    });

    // Mock fs.readFileSync to throw an error
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('File not found');
    });

    // Mock process.exit
    const mockExit = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);

    // Mock console.error
    const mockConsoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    // Import the script
    await import('./get-next-version.js');

    // Verify error handling
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error checking changeset status:\n',
      'Command failed',
    );
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error falling back to package.json:\n',
      'File not found',
    );
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should do nothing when changeset output does not contain onchainkit', async () => {
    // Mock execSync to return output without onchainkit
    const mockChangesetOutput = `
🦋  warning no packages have been published
---
some-other-package  1.0.0  patch  No changelog entry found
---
`;
    vi.mocked(execSync).mockReturnValue(mockChangesetOutput);

    // Mock fs.readFileSync to return package.json content for fallback
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.1.0' }),
    );

    // Mock path.join for both package.json and version.txt paths
    vi.mocked(path.join)
      .mockReturnValueOnce('packages/onchainkit/package.json')
      .mockReturnValueOnce('packages/onchainkit/dist/version.txt');

    // Import the script
    await import('./get-next-version.js');

    // Verify fs.writeFileSync was called with the fallback version
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'packages/onchainkit/dist/version.txt',
      '1.1.0',
    );
  });

  it('should handle case where onchainkit version line is not found in changeset', async () => {
    // Mock execSync to return output with no onchainkit line
    const mockChangesetOutput = `
🦋  warning no packages have been published
---
some-other-package  1.0.0  patch  No changelog entry found
---
`;
    vi.mocked(execSync).mockReturnValue(mockChangesetOutput);

    // Mock fs.readFileSync to return package.json content for fallback
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.1.0' }),
    );

    // Mock path.join for both package.json and version.txt paths
    vi.mocked(path.join)
      .mockReturnValueOnce('packages/onchainkit/package.json')
      .mockReturnValueOnce('packages/onchainkit/dist/version.txt');

    // Import the script
    await import('./get-next-version.js');

    // Verify the fallback version was written to the file
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'packages/onchainkit/dist/version.txt',
      '1.1.0',
    );
  });

  it('should handle case where onchainkit version is empty in changeset', async () => {
    // Mock execSync to return output with empty version
    const mockChangesetOutput = `
🦋  warning no packages have been published
---
@coinbase/onchainkit
---
`;
    vi.mocked(execSync).mockReturnValue(mockChangesetOutput);

    // Mock fs.readFileSync to return package.json content for fallback
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.1.0' }),
    );

    // Mock path.join for both package.json and version.txt paths
    vi.mocked(path.join)
      .mockReturnValueOnce('packages/onchainkit/package.json')
      .mockReturnValueOnce('packages/onchainkit/dist/version.txt');

    // Import the script
    await import('./get-next-version.js');

    // Verify the fallback version was written to the file
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'packages/onchainkit/dist/version.txt',
      '1.1.0',
    );
  });
});
