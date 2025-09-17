/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execFileSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// Mock the modules
vi.mock('child_process');
vi.mock('fs');
vi.mock('path');

// Mock process methods
const mockChdir = vi.fn();
const mockCwd = vi.fn();
const mockExit = vi.fn();
Object.defineProperty(process, 'chdir', { value: mockChdir });
Object.defineProperty(process, 'cwd', { value: mockCwd });
Object.defineProperty(process, 'exit', { value: mockExit });

// Import the updateDocs function for testing
import type { updateDocs } from './update-docs.js';
type UpdateDocsFunction = typeof updateDocs;

describe('update-docs script', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockConsoleWarn: ReturnType<typeof vi.spyOn>;
  let updateDocs: UpdateDocsFunction;

  beforeEach(async () => {
    vi.resetModules();
    vi.clearAllMocks();

    // Set test environment flag
    (globalThis as any).__IS_TEST_ENV = true;

    // Import the function for testing
    const module = await import('./update-docs.js?' + Date.now());
    updateDocs = module.updateDocs;

    // Mock console methods
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Setup default mocks
    mockCwd.mockReturnValue('/current/dir');

    // Mock path methods
    vi.mocked(path.join).mockImplementation((...args) => args.join('/'));
    vi.mocked(path.dirname).mockImplementation((p) =>
      p.split('/').slice(0, -1).join('/'),
    );

    // Mock fs methods with default behaviors
    vi.mocked(fs.existsSync).mockReturnValue(false);
    vi.mocked(fs.mkdirSync).mockImplementation(() => '');
    vi.mocked(fs.readFileSync).mockReturnValue('{}');
    vi.mocked(fs.writeFileSync).mockImplementation(() => {});
    vi.mocked(fs.readdirSync).mockReturnValue([]);
    vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => false } as any);
    vi.mocked(fs.rmSync).mockImplementation(() => {});

    // Mock execFileSync with default success
    vi.mocked(execFileSync).mockImplementation(() => '');

    // Clear environment variables
    delete process.env.GITHUB_ACTIONS;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up test environment flag
    delete (globalThis as any).__IS_TEST_ENV;
  });

  describe('successful execution path', () => {
    beforeEach(() => {
      setupSuccessfulMocks();
    });

    it('should complete docs update successfully with versions array structure', async () => {
      const baseDocsJson = {
        navigation: {
          tabs: [
            {
              tab: 'OnchainKit',
              versions: [
                {
                  version: 'latest',
                  navigation: { version: '1.0.0', groups: [] },
                },
              ],
            },
          ],
        },
      };

      const localDocsJson = { version: '1.1.0', groups: ['new-group'] };

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(baseDocsJson))
        .mockReturnValueOnce(JSON.stringify(localDocsJson));

      vi.mocked(execFileSync).mockImplementation((command, args) => {
        if (command === 'git' && args?.[0] === 'status') {
          return 'modified files';
        }
        return '';
      });

      await updateDocs();

      // Verify the process
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '🚀 Starting docs update process...',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '📥 Cloning base/docs repository...',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '📖 Reading base docs.json...',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '📖 Reading local docs.json...',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '🔄 Updating navigation structure...',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Updated latest version navigation in versions array',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '💾 Writing updated docs.json...',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '🗑️  Clearing existing content...',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith('📁 Copying new content...');
      expect(mockConsoleLog).toHaveBeenCalledWith('🔍 Checking for changes...');
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '🌿 Creating new branch and committing changes...',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Documentation update completed successfully!',
      );

      // Verify git commands were called
      expect(execFileSync).toHaveBeenCalledWith('git', [
        'clone',
        'https://github.com/base/docs.git',
        '/current/dir/../../tmp/base-docs',
      ]);
      expect(execFileSync).toHaveBeenCalledWith(
        'git',
        ['status', '--porcelain'],
        { encoding: 'utf8' },
      );
      expect(execFileSync).toHaveBeenCalledWith('git', ['add', '.']);
      expect(execFileSync).toHaveBeenCalledWith('git', [
        'commit',
        '-m',
        'Update OnchainKit documentation to latest version',
      ]);
    });

    it('should handle no changes scenario', async () => {
      setupSuccessfulMocks();

      // Mock git status to return empty (no changes)
      vi.mocked(execFileSync).mockImplementation((command, args) => {
        if (command === 'git' && args?.[0] === 'status') {
          return '';
        }
        return '';
      });

      await updateDocs();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✨ No changes detected between local and remote documentation',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '🎉 Documentation is already up to date - no PR needed',
      );
      expect(mockChdir).toHaveBeenCalledWith('/current/dir');
    });

    it('should handle GitHub Actions environment', async () => {
      process.env.GITHUB_ACTIONS = 'true';
      setupSuccessfulMocks();

      await updateDocs();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '🤖 Running in GitHub Actions - leaving repository ready for PR creation',
      );
      expect(mockConsoleLog).not.toHaveBeenCalledWith(
        expect.stringContaining('📋 Next steps:'),
      );
    });

    it('should handle local environment with next steps', async () => {
      setupSuccessfulMocks();

      await updateDocs();

      expect(mockConsoleLog).toHaveBeenCalledWith('📋 Next steps:');
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('1. Push the branch:'),
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        expect.stringContaining('2. Create a PR from the branch'),
      );
      expect(mockChdir).toHaveBeenCalledWith('/current/dir');
    });
  });

  describe('file operations', () => {
    it('should remove existing temp directory', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        const pathStr = path.toString();
        if (pathStr === '/current/dir/../../tmp/base-docs') return true;
        return (
          pathStr.includes('base-docs/docs/docs.json') ||
          pathStr.includes('/current/dir/docs/docs.json')
        );
      });

      await updateDocs();

      expect(execFileSync).toHaveBeenCalledWith('rm', [
        '-r',
        '-f',
        '/current/dir/../../tmp/base-docs',
      ]);
    });

    it('should create tmp parent directory if it does not exist', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return path !== '/current/dir/../../tmp';
      });

      await updateDocs();

      expect(fs.mkdirSync).toHaveBeenCalledWith('/current/dir/../../tmp', {
        recursive: true,
      });
    });

    it('should clear existing target content directory', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        const pathStr = path.toString();
        if (
          pathStr === '/current/dir/../../tmp/base-docs/docs/onchainkit/latest'
        )
          return true;
        return (
          pathStr.includes('base-docs/docs/docs.json') ||
          pathStr.includes('/current/dir/docs/docs.json')
        );
      });

      // Mock readdirSync to return files only when called on the target directory
      vi.mocked(fs.readdirSync).mockImplementation((path) => {
        if (path.toString().includes('onchainkit/latest')) {
          return ['file1.txt', 'subdir'] as any;
        }
        return ['file.txt'] as any;
      });

      await updateDocs();

      expect(fs.rmSync).toHaveBeenCalledWith(
        '/current/dir/../../tmp/base-docs/docs/onchainkit/latest/file1.txt',
        { recursive: true, force: true },
      );
      expect(fs.rmSync).toHaveBeenCalledWith(
        '/current/dir/../../tmp/base-docs/docs/onchainkit/latest/subdir',
        { recursive: true, force: true },
      );
    });

    it('should create target content directory if it does not exist', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return (
          path !== '/current/dir/../../tmp/base-docs/docs/onchainkit/latest'
        );
      });

      await updateDocs();

      expect(fs.mkdirSync).toHaveBeenCalledWith(
        '/current/dir/../../tmp/base-docs/docs/onchainkit/latest',
        { recursive: true },
      );
    });

    it('should copy files and directories correctly', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.readdirSync).mockReturnValue([
        'file.txt' as any,
        'directory' as any,
        'docs.json' as any,
      ]);
      vi.mocked(fs.statSync).mockImplementation(
        (path) =>
          ({
            isDirectory: () => path.toString().includes('directory'),
          }) as any,
      );

      await updateDocs();

      expect(execFileSync).toHaveBeenCalledWith('cp', [
        '/current/dir/docs/file.txt',
        '/current/dir/../../tmp/base-docs/docs/onchainkit/latest/file.txt',
      ]);
      expect(execFileSync).toHaveBeenCalledWith('cp', [
        '-r',
        '/current/dir/docs/directory',
        '/current/dir/../../tmp/base-docs/docs/onchainkit/latest/directory',
      ]);
      // docs.json should be skipped
      expect(execFileSync).not.toHaveBeenCalledWith(
        'cp',
        expect.arrayContaining([expect.stringContaining('docs.json')]),
      );
    });
  });

  describe('error handling', () => {
    it('should handle git clone failure', async () => {
      vi.mocked(execFileSync).mockImplementation((command, args) => {
        if (command === 'git' && args?.[0] === 'clone') {
          throw new Error('Git clone failed');
        }
        return '';
      });

      await expect(updateDocs()).rejects.toThrow('Git clone failed');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle missing base docs.json', async () => {
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return !path.toString().includes('base-docs/docs/docs.json');
      });

      await expect(updateDocs()).rejects.toThrow('docs.json not found at');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle missing local docs.json', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        return !path.toString().includes('/current/dir/docs/docs.json');
      });

      await expect(updateDocs()).rejects.toThrow(
        'Local docs.json not found at',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle malformed base docs.json', async () => {
      // Set up mocks to get to the JSON parsing stage
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        const pathStr = path.toString();
        return (
          pathStr.includes('base-docs/docs/docs.json') ||
          pathStr.includes('/current/dir/docs/docs.json')
        );
      });
      vi.mocked(fs.readFileSync).mockReturnValueOnce('invalid json');

      await expect(updateDocs()).rejects.toThrow();
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle missing navigation.tabs structure', async () => {
      // Set up mocks to get to the JSON parsing stage
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        const pathStr = path.toString();
        return (
          pathStr.includes('base-docs/docs/docs.json') ||
          pathStr.includes('/current/dir/docs/docs.json')
        );
      });
      const baseDocsJson = { navigation: {} };
      vi.mocked(fs.readFileSync).mockReturnValueOnce(
        JSON.stringify(baseDocsJson),
      );

      await expect(updateDocs()).rejects.toThrow(
        'Base docs.json does not have navigation.tabs structure',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle missing OnchainKit tab', async () => {
      // Set up mocks to get to the JSON parsing stage
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        const pathStr = path.toString();
        return (
          pathStr.includes('base-docs/docs/docs.json') ||
          pathStr.includes('/current/dir/docs/docs.json')
        );
      });
      const baseDocsJson = {
        navigation: {
          tabs: [{ tab: 'SomeOtherTab' }],
        },
      };
      vi.mocked(fs.readFileSync).mockReturnValueOnce(
        JSON.stringify(baseDocsJson),
      );

      await expect(updateDocs()).rejects.toThrow(
        'OnchainKit tab not found in base docs.json',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle missing versions array in OnchainKit tab', async () => {
      // Set up mocks to get to the JSON parsing stage
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        const pathStr = path.toString();
        return (
          pathStr.includes('base-docs/docs/docs.json') ||
          pathStr.includes('/current/dir/docs/docs.json')
        );
      });
      const baseDocsJson = {
        navigation: {
          tabs: [
            {
              tab: 'OnchainKit',
              // No versions property at all
            },
          ],
        },
      };
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(baseDocsJson))
        .mockReturnValueOnce(
          JSON.stringify({ version: '1.1.0', groups: ['test'] }),
        );

      await expect(updateDocs()).rejects.toThrow(
        'OnchainKit tab does not have versions array',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle missing latest version in versions array', async () => {
      // Set up mocks to get to the JSON parsing stage
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        const pathStr = path.toString();
        return (
          pathStr.includes('base-docs/docs/docs.json') ||
          pathStr.includes('/current/dir/docs/docs.json')
        );
      });
      const baseDocsJson = {
        navigation: {
          tabs: [
            {
              tab: 'OnchainKit',
              versions: [{ version: 'v1.0.0' }],
            },
          ],
        },
      };
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(baseDocsJson))
        .mockReturnValueOnce(
          JSON.stringify({ version: '1.1.0', groups: ['test'] }),
        );

      await expect(updateDocs()).rejects.toThrow(
        'Latest version not found in OnchainKit tab versions',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle git status check failure with warning', async () => {
      setupSuccessfulMocks();
      vi.mocked(execFileSync).mockImplementation((command, args) => {
        if (command === 'git' && args?.[0] === 'status') {
          throw new Error('Git status failed');
        }
        return '';
      });

      await updateDocs();

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        '⚠️  Could not check git status, proceeding with commit',
      );
    });

    it('should handle file system errors during directory clearing', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.readdirSync).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      await expect(updateDocs()).rejects.toThrow('Permission denied');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle file copy errors', async () => {
      setupSuccessfulMocks();
      vi.mocked(execFileSync).mockImplementation((command) => {
        if (command === 'cp') {
          throw new Error('Copy failed');
        }
        return '';
      });

      await expect(updateDocs()).rejects.toThrow('Copy failed');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });
  });

  describe('branch and commit operations', () => {
    it('should generate unique branch names', async () => {
      setupSuccessfulMocks();
      const mockDate = 1234567890123;
      vi.spyOn(Date, 'now').mockReturnValue(mockDate);

      await updateDocs();

      expect(execFileSync).toHaveBeenCalledWith('git', [
        'checkout',
        '-b',
        `update-onchainkit-docs-${mockDate}`,
      ]);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        `📋 Branch created: update-onchainkit-docs-${mockDate}`,
      );
    });

    it('should handle git commit failure', async () => {
      setupSuccessfulMocks();
      vi.mocked(execFileSync).mockImplementation((command, args) => {
        if (command === 'git' && args?.[0] === 'commit') {
          throw new Error('Commit failed');
        }
        return 'modified files';
      });

      await expect(updateDocs()).rejects.toThrow('Commit failed');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle git checkout failure', async () => {
      setupSuccessfulMocks();
      vi.mocked(execFileSync).mockImplementation((command, args) => {
        if (command === 'git' && args?.[0] === 'checkout') {
          throw new Error('Checkout failed');
        }
        return 'modified files';
      });

      await expect(updateDocs()).rejects.toThrow('Checkout failed');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle git add failure', async () => {
      setupSuccessfulMocks();
      vi.mocked(execFileSync).mockImplementation((command, args) => {
        if (command === 'git' && args?.[0] === 'add') {
          throw new Error('Add failed');
        }
        return 'modified files';
      });

      await expect(updateDocs()).rejects.toThrow('Add failed');
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });
  });

  describe('edge cases and data validation', () => {
    it('should handle empty local docs.json', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(createValidBaseDocsJson()))
        .mockReturnValueOnce('{}');

      await updateDocs();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '✅ Updated latest version navigation in versions array',
      );
    });

    it('should handle empty versions array', async () => {
      // Set up mocks to get to the JSON parsing stage
      vi.mocked(fs.existsSync).mockImplementation((path) => {
        const pathStr = path.toString();
        return (
          pathStr.includes('base-docs/docs/docs.json') ||
          pathStr.includes('/current/dir/docs/docs.json')
        );
      });
      const baseDocsJson = {
        navigation: {
          tabs: [
            {
              tab: 'OnchainKit',
              versions: [],
            },
          ],
        },
      };
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(baseDocsJson))
        .mockReturnValueOnce(
          JSON.stringify({ version: '1.1.0', groups: ['test'] }),
        );

      await expect(updateDocs()).rejects.toThrow(
        'Latest version not found in OnchainKit tab versions',
      );
      expect(mockConsoleError).toHaveBeenCalledWith(
        '❌ Error updating docs:',
        expect.any(Error),
      );
    });

    it('should handle complex nested directory structures', async () => {
      setupSuccessfulMocks();
      vi.mocked(fs.readdirSync).mockReturnValue([
        'components' as any,
        'utils' as any,
        'README.md' as any,
      ]);
      vi.mocked(fs.statSync).mockImplementation(
        (path) =>
          ({
            isDirectory: () => !path.toString().includes('.md'),
          }) as any,
      );

      await updateDocs();

      expect(execFileSync).toHaveBeenCalledWith('cp', [
        '-r',
        '/current/dir/docs/components',
        '/current/dir/../../tmp/base-docs/docs/onchainkit/latest/components',
      ]);
      expect(execFileSync).toHaveBeenCalledWith('cp', [
        '-r',
        '/current/dir/docs/utils',
        '/current/dir/../../tmp/base-docs/docs/onchainkit/latest/utils',
      ]);
      expect(execFileSync).toHaveBeenCalledWith('cp', [
        '/current/dir/docs/README.md',
        '/current/dir/../../tmp/base-docs/docs/onchainkit/latest/README.md',
      ]);
    });

    it('should handle very long git status output', async () => {
      setupSuccessfulMocks();
      const longGitStatus = 'M '.repeat(1000) + 'file.txt\\n';
      vi.mocked(execFileSync).mockImplementation((command, args) => {
        if (command === 'git' && args?.[0] === 'status') {
          return longGitStatus;
        }
        return '';
      });

      await updateDocs();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        '🌿 Creating new branch and committing changes...',
      );
    });
  });

  // Helper function to set up successful execution mocks
  function setupSuccessfulMocks() {
    vi.mocked(fs.existsSync).mockImplementation((path) => {
      const pathStr = path.toString();
      return (
        pathStr.includes('base-docs/docs/docs.json') ||
        pathStr.includes('/current/dir/docs/docs.json')
      );
    });

    vi.mocked(fs.readFileSync)
      .mockReturnValueOnce(JSON.stringify(createValidBaseDocsJson()))
      .mockReturnValueOnce(
        JSON.stringify({ version: '1.1.0', groups: ['test'] }),
      );

    vi.mocked(execFileSync).mockImplementation((command, args) => {
      if (command === 'git' && args?.[0] === 'status') {
        return 'M docs.json\n';
      }
      return '';
    });

    vi.mocked(fs.readdirSync).mockReturnValue(['file.txt' as any]);
    vi.mocked(fs.statSync).mockReturnValue({ isDirectory: () => false } as any);
  }

  function createValidBaseDocsJson() {
    return {
      navigation: {
        tabs: [
          {
            tab: 'OnchainKit',
            versions: [
              {
                version: 'latest',
                navigation: { version: '1.0.0', groups: [] },
              },
            ],
          },
        ],
      },
    };
  }

  describe('main function execution', () => {
    it('should execute updateDocs when not in test environment', async () => {
      // Remove test environment flag to allow main function to run
      delete (globalThis as any).__IS_TEST_ENV;

      setupSuccessfulMocks();

      // Import and execute the main function by importing the script
      await import('./update-docs.js?' + Date.now());

      // Verify that the update process was executed
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '🚀 Starting docs update process...',
      );
    });

    it('should handle errors in main function', async () => {
      // Remove test environment flag to allow main function to run
      delete (globalThis as any).__IS_TEST_ENV;

      // Set up mocks to cause an error
      vi.mocked(fs.existsSync).mockReturnValue(false);

      // Mock console.error for the main function's catch block
      const mockMainConsoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      // Import the script which will trigger main function
      await import('./update-docs.js?' + Date.now());

      // Verify the main function's error handling was called
      expect(mockMainConsoleError).toHaveBeenCalledWith(
        'Unhandled error:',
        expect.any(Error),
      );

      mockMainConsoleError.mockRestore();
    });
  });
});
