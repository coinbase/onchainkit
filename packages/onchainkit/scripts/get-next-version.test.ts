import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Mock the modules
vi.mock('child_process');
vi.mock('fs');
vi.mock('path');

describe('get-next-version script', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
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

    // Import the script (this needs to happen after mocks are set up)
    await import('./get-next-version.js');

    // Verify execSync was called with correct arguments
    expect(execSync).toHaveBeenCalledWith(
      'pnpm changeset status --verbose --since=origin/main',
      { encoding: 'utf-8' },
    );

    // Verify the version was written to the file
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'packages/onchainkit/dist/version.txt',
      '1.2.0',
    );
  });

  it('should exit with error code 1 when execSync throws', async () => {
    // Mock execSync to throw an error
    vi.mocked(execSync).mockImplementation(() => {
      throw new Error('Command failed');
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
      'Error checking changeset status:',
      'Command failed',
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

    // Import the script
    await import('./get-next-version.js');

    // Verify fs.writeFileSync was not called
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
