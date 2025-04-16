import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockInstance,
} from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

// Mock the modules
vi.mock('fs');
vi.mock('path');
vi.mock('url');
vi.mock('process');

describe('gen-version script', () => {
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

    // Mock path operations
    vi.mocked(fileURLToPath).mockReturnValue('/mocked/path/to/script.js');
    vi.mocked(path.dirname).mockReturnValue('/mocked/path/to');
    vi.mocked(path.resolve).mockReturnValue('/mocked/package/root');
    vi.mocked(path.join)
      .mockReturnValueOnce('/mocked/package/root/package.json')
      .mockReturnValueOnce('/mocked/package/root/src/version.ts');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should generate version.ts with correct content', async () => {
    // Mock fs.readFileSync to return package.json content with version
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.2.3' }),
    );

    // Import the script
    await import('./gen-version.js');

    // Verify fileURLToPath was called with import.meta.url
    expect(fileURLToPath).toHaveBeenCalled();

    // Verify path operations
    expect(path.dirname).toHaveBeenCalledWith('/mocked/path/to/script.js');
    expect(path.resolve).toHaveBeenCalledWith('/mocked/path/to', '..');
    expect(path.join).toHaveBeenCalledWith(
      '/mocked/package/root',
      'package.json',
    );
    expect(path.join).toHaveBeenCalledWith(
      '/mocked/package/root',
      'src',
      'version.ts',
    );

    // Verify fs.readFileSync was called with correct path
    expect(fs.readFileSync).toHaveBeenCalledWith(
      '/mocked/package/root/package.json',
      'utf-8',
    );

    // Verify fs.writeFileSync was called with correct path and content
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      '/mocked/package/root/src/version.ts',
      `export const version = '1.2.3';\n`,
    );

    // Verify console output
    expect(mockConsoleLog).toHaveBeenCalledWith(
      'Version 1.2.3 written to /mocked/package/root/src/version.ts',
    );
  });

  it('should exit with error when no version is found in package.json', async () => {
    // Mock fs.readFileSync to return package.json without version
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ name: 'onchainkit' }),
    );

    // Import the script
    await import('./gen-version.js');

    // Verify error handling
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error generating version:\n',
      'No version found in package.json',
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should exit with error when package.json cannot be read', async () => {
    // Mock fs.readFileSync to throw an error
    vi.mocked(fs.readFileSync).mockImplementation(() => {
      throw new Error('File not found');
    });

    // Import the script
    await import('./gen-version.js');

    // Verify error handling
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error generating version:\n',
      'File not found',
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should exit with error when version.ts cannot be written', async () => {
    // Mock fs.readFileSync to return package.json with version
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ version: '1.2.3' }),
    );

    // Mock fs.writeFileSync to throw an error
    vi.mocked(fs.writeFileSync).mockImplementation(() => {
      throw new Error('Permission denied');
    });

    // Import the script
    await import('./gen-version.js');

    // Verify error handling
    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error generating version:\n',
      'Permission denied',
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should handle parsing errors in package.json', async () => {
    // Mock fs.readFileSync to return invalid JSON
    vi.mocked(fs.readFileSync).mockReturnValue('not valid json');

    // Import the script
    await import('./gen-version.js');

    // Verify error handling indicates a parsing error occurred
    expect(mockConsoleError).toHaveBeenCalled();
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });
});
