import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as core from '@actions/core';
import {
  getNextVersionNumber,
  submitToRegistry,
  main,
  publishPrerelease,
} from './publish-prerelease.js';

// Mock the modules
vi.mock('child_process');
vi.mock('fs');
vi.mock('path');
vi.mock('url');
vi.mock('@actions/core');

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

interface VersionParams {
  currentTagVersion: string;
  packageJsonVersion: string;
  tag: string;
}

describe('publish-prerelease script', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let originalArgv: string[];

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Store original argv and set up mock args
    originalArgv = process.argv;
    process.argv = ['node', 'publish-prerelease.js', '--tag', 'canary'];

    // Mock console methods
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock fileURLToPath and path operations
    vi.mocked(fileURLToPath).mockReturnValue('/mocked/path/to/script.js');
    vi.mocked(path.resolve).mockReturnValue('/mocked/monorepo/root');
    vi.mocked(path.dirname).mockReturnValue('/mocked/path/to');
    vi.mocked(path.join).mockReturnValue('/mocked/package.json');

    // Mock process.chdir to prevent actual directory changes
    vi.spyOn(process, 'chdir').mockImplementation(() => undefined);
  });

  afterEach(() => {
    // Restore original argv
    process.argv = originalArgv;
    vi.restoreAllMocks();
  });

  describe('getNextVersionNumber', () => {
    it('should increment tag count when base version matches next patch version', () => {
      const params: VersionParams = {
        currentTagVersion: '1.2.1-canary.0',
        packageJsonVersion: '1.2.1',
        tag: 'canary',
      };
      const result = getNextVersionNumber(params);
      expect(result).toBe('1.2.1-canary.1');
    });

    it('should start next patch version at tag.0 when no current tag version exists', () => {
      const params: VersionParams = {
        currentTagVersion: null as unknown as string,
        packageJsonVersion: '1.2.1',
        tag: 'canary',
      };
      const result = getNextVersionNumber(params);
      expect(result).toBe('1.2.1-canary.0');
    });

    it('should increment tag count for existing versions', () => {
      const params: VersionParams = {
        currentTagVersion: '1.2.1-alpha.2',
        packageJsonVersion: '1.2.1',
        tag: 'alpha',
      };
      const result = getNextVersionNumber(params);
      expect(result).toBe('1.2.1-alpha.3');
    });

    it('should throw error for invalid version format', () => {
      const params: VersionParams = {
        currentTagVersion: '1.2-canary.0',
        packageJsonVersion: '1.2.3.4',
        tag: 'canary',
      };
      expect(() => getNextVersionNumber(params)).toThrow(
        'Invalid version format',
      );
    });

    it('should use package.json version as base for new prerelease', () => {
      const params: VersionParams = {
        currentTagVersion: null as unknown as string,
        packageJsonVersion: '1.0.0',
        tag: 'alpha',
      };
      const result = getNextVersionNumber(params);
      expect(result).toBe('1.0.0-alpha.0');
    });

    it('should start new version series when package.json version changes', () => {
      const params: VersionParams = {
        currentTagVersion: '0.38.14-alpha.5',
        packageJsonVersion: '1.0.0',
        tag: 'alpha',
      };
      const result = getNextVersionNumber(params);
      expect(result).toBe('1.0.0-alpha.0');
    });

    it('should increment tag count when package.json version matches current tag base', () => {
      const params: VersionParams = {
        currentTagVersion: '1.0.0-alpha.0',
        packageJsonVersion: '1.0.0',
        tag: 'alpha',
      };
      const result = getNextVersionNumber(params);
      expect(result).toBe('1.0.0-alpha.1');
    });

    it('should handle tag count when tag count is undefined', () => {
      const params: VersionParams = {
        currentTagVersion: '1.0.0-alpha.',
        packageJsonVersion: '1.0.0',
        tag: 'alpha',
      };
      const result = getNextVersionNumber(params);
      expect(result).toBe('1.0.0-alpha.0');
    });
  });

  describe('submitToRegistry', () => {
    it('should update package.json and publish with specified tag', () => {
      const nextVersion = '1.2.1-canary.0';
      const tag = 'canary';
      const mockPackageJson = { version: '1.1.0' };

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );

      submitToRegistry(nextVersion, tag);

      // Verify package.json was updated
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mocked/package.json',
        JSON.stringify({ ...mockPackageJson, version: nextVersion }, null, 2) +
          '\n',
      );

      // Verify publish command was executed
      expect(execSync).toHaveBeenCalledWith(
        `pnpm publish --tag ${tag} --no-git-checks`,
      );
    });

    it('should work with different tag names', () => {
      const nextVersion = '1.2.1-alpha.0';
      const tag = 'alpha';
      const mockPackageJson = { version: '1.1.0' };

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );

      submitToRegistry(nextVersion, tag);

      // Verify publish command was executed with correct tag
      expect(execSync).toHaveBeenCalledWith(
        `pnpm publish --tag ${tag} --no-git-checks`,
      );
    });
  });

  describe('publishPrerelease function', () => {
    it('should successfully publish canary release', async () => {
      // Mock fetch response for dist tags
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            latest: '1.2.0',
            canary: '1.2.1-canary.0',
          }),
      });

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ version: '1.1.0' }),
      );

      // Run the publishPrerelease function
      await publishPrerelease();

      // Verify console logs
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Found versions:\npackage.json: 1.1.0\ncanary: 1.2.1-canary.0',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Next canary version: 1.1.0-canary.0',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'canary release published: 1.1.0-canary.0',
      );

      // Verify the next version was calculated and published
      expect(execSync).toHaveBeenCalledWith(
        'pnpm publish --tag canary --no-git-checks',
      );
    });

    it('should successfully publish alpha release', async () => {
      // Set up alpha tag arguments
      process.argv = ['node', 'publish-prerelease.js', '--tag', 'alpha'];

      // Mock fetch response for dist tags
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            latest: '1.2.0',
            alpha: '1.2.1-alpha.2',
          }),
      });

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ version: '1.1.0' }),
      );

      // Run the publishPrerelease function
      await publishPrerelease();

      // Verify console logs
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Found versions:\npackage.json: 1.1.0\nalpha: 1.2.1-alpha.2',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Next alpha version: 1.1.0-alpha.0',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'alpha release published: 1.1.0-alpha.0',
      );

      // Verify the next version was calculated and published
      expect(execSync).toHaveBeenCalledWith(
        'pnpm publish --tag alpha --no-git-checks',
      );
    });

    it('should handle missing --tag argument', async () => {
      // Set up missing tag arguments
      process.argv = ['node', 'publish-prerelease.js'];

      // Mock process.exit
      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      // Run the publishPrerelease function
      await publishPrerelease();

      // Verify error handling
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error: --tag argument is required',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle invalid tag argument', async () => {
      // Set up invalid tag arguments
      process.argv = ['node', 'publish-prerelease.js', '--tag'];

      // Mock process.exit
      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      // Run the publishPrerelease function
      await publishPrerelease();

      // Verify error handling
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error: --tag argument is required',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle fetch error gracefully', async () => {
      // Mock fetch to throw error
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ version: '1.1.0' }),
      );

      // Mock process.exit
      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      // Run the publishPrerelease function
      await publishPrerelease();

      // Verify error handling
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error determining next canary version:\n',
        'Network error',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle publish error gracefully', async () => {
      // Mock fetch response
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            latest: '1.2.0',
            canary: '1.2.1-canary.0',
          }),
      });

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ version: '1.1.0' }),
      );

      // Mock execSync to throw error
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('Publish failed');
      });

      // Mock process.exit
      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      // Run the publishPrerelease function
      await publishPrerelease();

      // Verify error handling
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error publishing canary release:\n',
        'Publish failed',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should set GitHub Actions output using @actions/core', async () => {
      // Mock fetch response for dist tags
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            latest: '1.2.0',
            canary: '1.2.1-canary.0',
          }),
      });

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ version: '1.1.0' }),
      );

      // Mock core.setOutput
      const mockSetOutput = vi.mocked(core.setOutput);

      // Run the publishPrerelease function
      await publishPrerelease();

      // Verify that core.setOutput was called with correct parameters
      expect(mockSetOutput).toHaveBeenCalledWith('version', '1.1.0-canary.0');
    });

    it('should handle core.setOutput errors gracefully', async () => {
      // Mock fetch response for dist tags
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            latest: '1.2.0',
            canary: '1.2.1-canary.0',
          }),
      });

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ version: '1.1.0' }),
      );

      // Mock core.setOutput to throw an error
      const mockSetOutput = vi.mocked(core.setOutput);
      mockSetOutput.mockImplementation(() => {
        throw new Error('Not in GitHub Actions environment');
      });

      // Run the publishPrerelease function
      await publishPrerelease();

      // Verify that core.setOutput was called
      expect(mockSetOutput).toHaveBeenCalledWith('version', '1.1.0-canary.0');

      // Verify that the fallback console.log was called
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Output would be set: version=1.1.0-canary.0',
      );
    });
  });

  describe('main function execution control', () => {
    it('should not run publishPrerelease when in test environment', async () => {
      // Set test environment flag
      globalThis.__IS_TEST_ENV = true;

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Call main function - should not execute publishPrerelease
      main();

      // Verify that publishPrerelease was not called (no console logs)
      expect(consoleSpy).not.toHaveBeenCalled();

      // Clean up
      delete globalThis.__IS_TEST_ENV;
      consoleSpy.mockRestore();
    });

    it('should run publishPrerelease when not in test environment', async () => {
      // Setup mocks for publishPrerelease execution
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            latest: '1.2.0',
            canary: '1.2.1-canary.0',
          }),
      });

      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ version: '1.1.0' }),
      );

      // Ensure test environment flag is not set
      delete globalThis.__IS_TEST_ENV;

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      // Call main function - should execute publishPrerelease
      await main();

      // Verify that publishPrerelease was called (should see console logs)
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Found versions:\npackage.json: 1.1.0\ncanary: 1.2.1-canary.0',
      );

      consoleSpy.mockRestore();
    });
  });
});
