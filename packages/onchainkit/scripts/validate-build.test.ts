import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockInstance,
} from 'vitest';
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

// Mock the modules
vi.mock('child_process');
vi.mock('fs');
vi.mock('path');
vi.mock('url');
vi.mock('process');

describe('validate-build script', () => {
  let mockConsoleLog: MockInstance;
  let mockConsoleError: MockInstance;
  let mockProcessExit: MockInstance;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Mock console methods
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock process.exit
    mockProcessExit = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);

    // Mock process.chdir
    vi.spyOn(process, 'chdir').mockImplementation(() => undefined);

    // Mock fileURLToPath and path operations
    vi.mocked(fileURLToPath).mockReturnValue('/mocked/path/to/script.js');
    vi.mocked(path.dirname).mockReturnValue('/mocked/path/to');
    vi.mocked(path.resolve).mockReturnValue('/mocked/package/root');
    vi.mocked(path.join).mockReturnValue('/mocked/package/root/package.json');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw error when tarball start/end markers not found', async () => {
    // Mock spawnSync to return output without the expected tarball markers
    vi.mocked(spawnSync).mockReturnValue({
      stdout: `
npm notice 
npm notice 📦  @coinbase/onchainkit@1.2.0
npm notice some other content
npm notice more content
      `,
      stderr: '',
      status: 0,
      signal: null,
      error: undefined,
    } as unknown as ReturnType<typeof spawnSync>);

    // Import the script
    await import('./validate-build.js');

    // Verify error handling
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Something went wrong during build validation:',
    );
    // Check for the specific error message about tarball contents
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Failed to find tarball contents start or end',
      }),
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should validate build successfully when all files are present', async () => {
    // Mock spawnSync to return tarball contents
    vi.mocked(spawnSync).mockReturnValue({
      stdout: `
npm notice 
npm notice 📦  @coinbase/onchainkit@1.2.0
npm notice === Tarball Contents === 
npm notice 1.2kB dist/index.js
npm notice 2.3kB dist/index.d.ts
npm notice 3.4kB dist/esm/index.js
npm notice 1.1kB package.json
npm notice === Tarball Details ===
npm notice name:          @coinbase/onchainkit
npm notice version:       1.2.0
npm notice filename:      coinbase-onchainkit-1.2.0.tgz
npm notice package size:  5.0 kB
npm notice unpacked size: 8.0 kB
npm notice shasum:        1234567890abcdef1234567890abcdef12345678
npm notice integrity:     sha512-[...]
npm notice total files:   4
npm notice
      `,
      stderr: '',
      status: 0,
      signal: null,
      error: undefined,
    } as unknown as ReturnType<typeof spawnSync>);

    // Mock fs.readFileSync to return package.json content
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({
        name: '@coinbase/onchainkit',
        version: '1.2.0',
        main: './dist/index.js',
        types: './dist/index.d.ts',
        module: './dist/esm/index.js',
        exports: {
          '.': {
            import: './dist/esm/index.js',
            require: './dist/index.js',
            types: './dist/index.d.ts',
          },
        },
      }),
    );

    // Import the script
    await import('./validate-build.js');

    // Verify process.chdir was called with the mocked root
    expect(process.chdir).toHaveBeenCalledWith('/mocked/package/root');

    // Verify spawnSync was called with correct arguments
    expect(spawnSync).toHaveBeenCalledWith(
      'pnpm',
      ['publish', '--dry-run', '--force', '--no-git-checks'],
      {
        cwd: '/mocked/package/root',
        shell: true,
        encoding: 'utf-8',
        stdio: ['inherit', 'pipe', 'pipe'],
      },
    );

    // Verify successful completion
    expect(mockConsoleLog).toHaveBeenCalledWith('Build validation successful');
    expect(mockProcessExit).toHaveBeenCalledWith(0);
  });

  it('should detect missing files in tarball and exit with error', async () => {
    // Mock spawnSync to return tarball contents missing one file
    vi.mocked(spawnSync).mockReturnValue({
      stdout: `
npm notice 
npm notice 📦  @coinbase/onchainkit@1.2.0
npm notice === Tarball Contents === 
npm notice 1.2kB dist/index.js
npm notice 3.4kB dist/esm/index.js
npm notice 1.1kB package.json
npm notice === Tarball Details ===
npm notice name:          @coinbase/onchainkit
npm notice version:       1.2.0
npm notice filename:      coinbase-onchainkit-1.2.0.tgz
npm notice package size:  4.0 kB
npm notice unpacked size: 6.0 kB
npm notice shasum:        1234567890abcdef1234567890abcdef12345678
npm notice integrity:     sha512-[...]
npm notice total files:   3
npm notice
      `,
      stderr: '',
      status: 0,
      signal: null,
      error: undefined,
    } as unknown as ReturnType<typeof spawnSync>);

    // Mock fs.readFileSync to return package.json content
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({
        name: '@coinbase/onchainkit',
        version: '1.2.0',
        main: './dist/index.js',
        types: './dist/index.d.ts', // This file will be missing
        module: './dist/esm/index.js',
        exports: {
          '.': {
            import: './dist/esm/index.js',
            require: './dist/index.js',
            types: './dist/index.d.ts', // This file will be missing
          },
        },
      }),
    );

    // Import the script
    await import('./validate-build.js');

    // Verify error handling
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Something went wrong during build validation:',
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should handle nested exports structure correctly', async () => {
    // Mock spawnSync to return tarball contents
    vi.mocked(spawnSync).mockReturnValue({
      stdout: `
npm notice 
npm notice 📦  @coinbase/onchainkit@1.2.0
npm notice === Tarball Contents === 
npm notice 1.2kB dist/index.js
npm notice 2.3kB dist/index.d.ts
npm notice 3.4kB dist/esm/index.js
npm notice 4.5kB dist/components/Button.js
npm notice 5.6kB dist/components/Button.d.ts
npm notice 1.1kB package.json
npm notice === Tarball Details ===
npm notice name:          @coinbase/onchainkit
npm notice version:       1.2.0
npm notice filename:      coinbase-onchainkit-1.2.0.tgz
npm notice package size:  10.0 kB
npm notice unpacked size: 18.0 kB
npm notice shasum:        1234567890abcdef1234567890abcdef12345678
npm notice integrity:     sha512-[...]
npm notice total files:   6
npm notice
      `,
      stderr: '',
      status: 0,
      signal: null,
      error: undefined,
    } as unknown as ReturnType<typeof spawnSync>);

    // Mock fs.readFileSync to return package.json with nested exports
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({
        name: '@coinbase/onchainkit',
        version: '1.2.0',
        main: './dist/index.js',
        types: './dist/index.d.ts',
        module: './dist/esm/index.js',
        exports: {
          '.': {
            import: './dist/esm/index.js',
            require: './dist/index.js',
            types: './dist/index.d.ts',
          },
          './components': {
            import: './dist/components/Button.js',
            types: './dist/components/Button.d.ts',
          },
        },
      }),
    );

    // Import the script
    await import('./validate-build.js');

    // Verify successful completion
    expect(mockConsoleLog).toHaveBeenCalledWith('Build validation successful');
    expect(mockProcessExit).toHaveBeenCalledWith(0);
  });

  it('should handle spawnSync error', async () => {
    // Mock spawnSync to throw an error
    vi.mocked(spawnSync).mockImplementation(() => {
      throw new Error('Command failed');
    });

    // Import the script
    await import('./validate-build.js');

    // Verify error handling
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Something went wrong during build validation:',
    );
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Command failed',
      }),
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should handle fs.readFileSync error', async () => {
    // Mock spawnSync to return valid tarball contents
    vi.mocked(spawnSync).mockReturnValue({
      stdout: `
npm notice 
npm notice 📦  @coinbase/onchainkit@1.2.0
npm notice === Tarball Contents === 
npm notice 1.2kB dist/index.js
npm notice === Tarball Details ===
npm notice
      `,
      stderr: '',
      status: 0,
      signal: null,
      error: undefined,
    } as unknown as ReturnType<typeof spawnSync>);

    // Mock fs.readFileSync to throw an error
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('File not found');
    });

    // Import the script
    await import('./validate-build.js');

    // Verify error handling
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Something went wrong during build validation:',
    );
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'File not found',
      }),
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should handle missing tarball markers in spawn output', async () => {
    // Mock spawnSync to return output without tarball contents markers
    vi.mocked(spawnSync).mockReturnValue({
      stdout: `
npm notice 
npm notice 📦  @coinbase/onchainkit@1.2.0
npm notice Some other content
      `,
      stderr: '',
      status: 0,
      signal: null,
      error: undefined,
    } as unknown as ReturnType<typeof spawnSync>);

    // Mock fs.readFileSync to return package.json content
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({
        name: '@coinbase/onchainkit',
        version: '1.2.0',
        main: './dist/index.js',
      }),
    );

    // Import the script
    await import('./validate-build.js');

    // Because indexOf returns -1 for missing content, we should get an error
    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should handle non-string values in package.json fields correctly', async () => {
    // Mock spawnSync to return tarball contents
    vi.mocked(spawnSync).mockReturnValue({
      stdout: `
npm notice 
npm notice 📦  @coinbase/onchainkit@1.2.0
npm notice === Tarball Contents === 
npm notice 1.2kB dist/index.js
npm notice === Tarball Details ===
npm notice
      `,
      stderr: '',
      status: 0,
      signal: null,
      error: undefined,
    } as unknown as ReturnType<typeof spawnSync>);

    // Mock fs.readFileSync to return package.json with a mixture of string and object values
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({
        name: '@coinbase/onchainkit',
        version: '1.2.0',
        main: './dist/index.js',
        otherField: true, // boolean value should be ignored
        exports: {
          numberedField: 123, // number value should be ignored
          '.': './dist/index.js',
        },
      }),
    );

    // Import the script
    await import('./validate-build.js');

    // Only string values are checked, so this should still pass
    expect(mockConsoleLog).toHaveBeenCalledWith('Build validation successful');
    expect(mockProcessExit).toHaveBeenCalledWith(0);
  });

  it('should correctly extract file paths from tarball lines', async () => {
    // Mock spawnSync to return tarball contents with various file path formats
    vi.mocked(spawnSync).mockReturnValue({
      stdout: `
npm notice 
npm notice 📦  @coinbase/onchainkit@1.2.0
npm notice === Tarball Contents === 
npm notice 1.2kB  package.json
npm notice 543B   README.md
npm notice 2.3kB  dist/index.js          
npm notice 4.5kB  dist/nested/dir/file.js 
npm notice 1.5kB  dist/file with spaces.js
npm notice === Tarball Details ===
npm notice name:          @coinbase/onchainkit
npm notice version:       1.2.0
npm notice
      `,
      stderr: '',
      status: 0,
      signal: null,
      error: undefined,
    } as unknown as ReturnType<typeof spawnSync>);

    // Create a simple package.json that references only package.json itself
    // so the validation passes but we can focus on testing path extraction
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({
        name: '@coinbase/onchainkit',
        version: '1.2.0',
        main: './package.json',
      }),
    );

    // Import the script
    await import('./validate-build.js');

    // Paths should be correctly extracted from tarball content
    expect(mockConsoleLog).toHaveBeenCalledWith('Build validation successful');
    expect(mockProcessExit).toHaveBeenCalledWith(0);
  });
});
