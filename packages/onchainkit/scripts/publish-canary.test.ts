import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getNextCanaryVersionNumber,
  publishCanaryRelease,
  main,
  CANARY_TAG,
} from './publish-canary.js';

// Mock the modules
vi.mock('child_process');
vi.mock('fs');
vi.mock('path');
vi.mock('url');

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

interface VersionParams {
  canary: string;
  latest: string;
}

describe('publish-canary-release script', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

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
    vi.restoreAllMocks();
  });

  describe('getNextCanaryVersionNumber', () => {
    it('should increment canary count when base version matches next patch version', () => {
      const params: VersionParams = {
        canary: `1.2.1-${CANARY_TAG}.0`,
        latest: '1.2.0',
      };
      const result = getNextCanaryVersionNumber(params);
      expect(result).toBe(`1.2.1-${CANARY_TAG}.1`);
    });

    it('should start next patch version at canary.0 when no canary version exists', () => {
      const params: VersionParams = {
        canary: null as unknown as string,
        latest: '1.2.0',
      };
      const result = getNextCanaryVersionNumber(params);
      expect(result).toBe(`1.2.1-${CANARY_TAG}.0`);
    });

    it('should reset to next patch version canary.0 when canary base version is different from next patch version', () => {
      const params: VersionParams = {
        canary: `1.2.0-${CANARY_TAG}.5`,
        latest: '1.2.0',
      };
      const result = getNextCanaryVersionNumber(params);
      expect(result).toBe(`1.2.1-${CANARY_TAG}.0`);
    });

    it('should handle canary version without a count', () => {
      const params: VersionParams = {
        canary: `1.2.1`,
        latest: '1.2.0',
      };
      const result = getNextCanaryVersionNumber(params);
      expect(result).toBe(`1.2.1-${CANARY_TAG}.0`);
    });

    it('should throw error for invalid version format', () => {
      const params: VersionParams = {
        canary: `1.2-${CANARY_TAG}.0`,
        latest: '1.2.3.4',
      };
      expect(() => getNextCanaryVersionNumber(params)).toThrow(
        'Invalid version format',
      );
    });
  });

  describe('publishCanaryRelease', () => {
    it('should update package.json and publish with canary tag', () => {
      const nextCanaryVersion = `1.2.1-${CANARY_TAG}.0`;
      const mockPackageJson = { version: '1.1.0' };

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );

      publishCanaryRelease(nextCanaryVersion);

      // Verify package.json was updated
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mocked/package.json',
        JSON.stringify(
          { ...mockPackageJson, version: nextCanaryVersion },
          null,
          2,
        ) + '\n',
      );

      // Verify publish command was executed
      expect(execSync).toHaveBeenCalledWith(
        `pnpm publish --tag ${CANARY_TAG} --no-git-checks`,
      );
    });
  });

  describe('main function', () => {
    it('should successfully publish canary release', async () => {
      // Mock fetch response for dist tags
      mockFetch.mockResolvedValueOnce({
        json: () =>
          Promise.resolve({
            latest: '1.2.0',
            canary: `1.2.1-${CANARY_TAG}.0`,
          }),
      });

      // Mock fs.readFileSync for package.json
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify({ version: '1.1.0' }),
      );

      // Run the main function
      await main();

      // Verify console logs
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `Found tags:\nlatest: 1.2.0\ncanary: 1.2.1-${CANARY_TAG}.0`,
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `Next canary version: 1.2.1-${CANARY_TAG}.1`,
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `Canary release published: 1.2.1-${CANARY_TAG}.1`,
      );

      // Verify the next canary version was calculated and published
      expect(execSync).toHaveBeenCalledWith(
        `pnpm publish --tag ${CANARY_TAG} --no-git-checks`,
      );
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

      // Run the main function
      await main();

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
            canary: `1.2.1-${CANARY_TAG}.0`,
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

      // Run the main function
      await main();

      // Verify error handling
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error publishing canary release:\n',
        'Publish failed',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
});
