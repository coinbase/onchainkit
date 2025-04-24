import { describe, expect, it, vi, beforeEach } from 'vitest';
import fs from 'node:fs/promises';
import {
  optimizedCopy,
  createClickableLink,
  isValidPackageName,
  toValidPackageName,
  detectPackageManager,
  getVersion,
} from './utils';
import { Stats } from 'node:fs';

vi.mock('fs/promises');
vi.mock('path');

describe('utils', () => {
  describe('getVersion', () => {
    it('should return the version', async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify({ version: '0.0.1' }));

      const version = await getVersion();

      expect(version).toBe('0.0.1');
    });
  });

  describe('optimizedCopy', () => {
    beforeEach(() => {
      vi.resetAllMocks();
    });

    it('should copy file when source is a file', async () => {
      vi.mocked(fs.stat).mockResolvedValue({ isDirectory: () => false } as unknown as Stats);
      vi.mocked(fs.copyFile).mockResolvedValue();

      await optimizedCopy('src.txt', 'dest.txt');
      expect(fs.copyFile).toHaveBeenCalledWith('src.txt', 'dest.txt');
    });
  });

  describe('createClickableLink', () => {
    it('should create OSC 8 formatted link', () => {
      const result = createClickableLink('text', 'http://example.com');
      expect(result).toBe('\u001B]8;;http://example.com\u0007text\u001B]8;;\u0007');
    });
  });

  describe('isValidPackageName', () => {
    it('should validate simple package names', () => {
      expect(isValidPackageName('my-package')).toBe(true);
      expect(isValidPackageName('123invalid')).toBe(true);
      expect(isValidPackageName('.invalid')).toBe(false);
    });

    it('should validate scoped package names', () => {
      expect(isValidPackageName('@scope/package')).toBe(true);
      expect(isValidPackageName('@invalid/123')).toBe(true);
      expect(isValidPackageName('@/invalid')).toBe(false);
    });
  });

  describe('toValidPackageName', () => {
    it('should convert invalid names to valid package names', () => {
      expect(toValidPackageName('My Package')).toBe('my-package');
      expect(toValidPackageName('  spaced  ')).toBe('spaced');
      expect(toValidPackageName('.leading-dot')).toBe('leading-dot');
      expect(toValidPackageName('UPPER_CASE')).toBe('upper-case');
      expect(toValidPackageName('special@chars#here')).toBe('special-chars-here');
    });
  });

  describe('detectPackageManager', () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    it('should detect yarn', () => {
      process.env.npm_config_user_agent = 'yarn/4.0.2 npm/? node/v18.17.0 darwin arm64';
      expect(detectPackageManager()).toBe('yarn');
    });

    it('should detect pnpm', () => {
      process.env.npm_config_user_agent = 'pnpm/8.6.12 npm/? node/v18.17.0 darwin arm64';
      expect(detectPackageManager()).toBe('pnpm');
    });

    it('should detect npm', () => {
      process.env.npm_config_user_agent = 'npm/9.8.1 node/v18.17.0 darwin arm64';
      expect(detectPackageManager()).toBe('npm');
    });

    it('should detect bun', () => {
      process.env.npm_config_user_agent = 'bun/1.0.2 npm/? node/v18.17.0 darwin arm64';
      expect(detectPackageManager()).toBe('bun');
    });

    it('should default to npm when user agent is undefined', () => {
      process.env.npm_config_user_agent = undefined;
      expect(detectPackageManager()).toBe('npm');
    });

    it('should default to npm for unknown package managers', () => {
      process.env.npm_config_user_agent = 'unknown/1.0.0';
      expect(detectPackageManager()).toBe('npm');
    });
  });
});
