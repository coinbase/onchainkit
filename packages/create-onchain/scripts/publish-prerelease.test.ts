import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { publishPrerelease, main } from './publish-prerelease.js';

// Mock the modules
vi.mock('child_process');
vi.mock('fs');
vi.mock('path');
vi.mock('url');

describe('create-onchain publish-prerelease script', () => {
  let mockConsoleLog: ReturnType<typeof vi.spyOn>;
  let mockConsoleError: ReturnType<typeof vi.spyOn>;
  let mockConsoleWarn: ReturnType<typeof vi.spyOn>;
  let originalArgv: string[];

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    // Store original argv and set up mock args
    originalArgv = process.argv;
    process.argv = [
      'node',
      'publish-prerelease.js',
      '--tag',
      'alpha',
      '--version',
      '1.0.0-alpha.1',
    ];

    // Mock console methods
    mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    // Mock fileURLToPath and path operations
    vi.mocked(fileURLToPath).mockReturnValue('/mocked/path/to/script.js');
    vi.mocked(path.dirname).mockReturnValue('/mocked/path/to');
    vi.mocked(path.resolve).mockImplementation((dir, ...paths) => {
      const pathStr = paths.join('/');
      if (pathStr === '../package.json') {
        return '/mocked/create-onchain/package.json';
      }
      if (pathStr === '../templates') {
        return '/mocked/create-onchain/templates';
      }
      if (pathStr === '..') {
        return '/mocked/create-onchain';
      }
      return '/mocked/create-onchain';
    });
    vi.mocked(path.join).mockImplementation((...paths) => {
      const joined = paths.join('/');
      // Handle template package.json paths
      if (
        joined.includes('/mocked/create-onchain/templates/') &&
        joined.includes('package.json')
      ) {
        // Extract template name from path like '/mocked/create-onchain/templates/next/package.json'
        const templateName = joined
          .replace('/mocked/create-onchain/templates/', '')
          .replace('/package.json', '');
        return `templates/${templateName}/package.json`;
      }
      return joined;
    });

    // Mock process.chdir to prevent actual directory changes
    vi.spyOn(process, 'chdir').mockImplementation(() => undefined);
    vi.spyOn(process, 'cwd').mockReturnValue('/mocked/create-onchain');
  });

  afterEach(() => {
    // Restore original argv
    process.argv = originalArgv;
    vi.restoreAllMocks();
  });

  describe('argument parsing', () => {
    it('should parse valid tag and version arguments', async () => {
      process.argv = [
        'node',
        'script.js',
        '--tag',
        'alpha',
        '--version',
        '1.0.0-alpha.1',
      ];

      // Mock file operations
      const mockPackageJson = { name: 'create-onchain', version: '0.0.22' };
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});

      await publishPrerelease();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Updated create-onchain version: 0.0.22 → 1.0.0-alpha.1',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'alpha release published: create-onchain@1.0.0-alpha.1',
      );
    });

    it('should handle different tag types', async () => {
      process.argv = [
        'node',
        'script.js',
        '--tag',
        'canary',
        '--version',
        '1.0.0-canary.5',
      ];

      // Mock file operations
      const mockPackageJson = { name: 'create-onchain', version: '0.0.22' };
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});

      await publishPrerelease();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        'canary release published: create-onchain@1.0.0-canary.5',
      );
    });

    it('should require --tag argument', async () => {
      process.argv = ['node', 'script.js', '--version', '1.0.0-alpha.1'];

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error: --tag argument is required',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should require --version argument', async () => {
      process.argv = ['node', 'script.js', '--tag', 'alpha'];

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error: --version argument is required',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should reject invalid tag value', async () => {
      process.argv = [
        'node',
        'script.js',
        '--tag',
        '--version',
        '1.0.0-alpha.1',
      ];

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith('Error: Invalid tag value');
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should reject invalid version value', async () => {
      process.argv = [
        'node',
        'script.js',
        '--tag',
        'alpha',
        '--version',
        '--other-flag',
      ];

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error: Invalid version value',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle missing tag value', async () => {
      process.argv = ['node', 'script.js', '--tag'];

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error: --tag argument is required',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle missing version value', async () => {
      process.argv = ['node', 'script.js', '--tag', 'alpha', '--version'];

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error: --version argument is required',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('package version updating', () => {
    beforeEach(() => {
      // Mock file operations for successful scenarios
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
    });

    it('should update create-onchain package.json version', async () => {
      const mockPackageJson = {
        name: 'create-onchain',
        version: '0.0.22',
        scripts: { build: 'tsc' },
      };
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );

      await publishPrerelease();

      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mocked/create-onchain/package.json',
        JSON.stringify(
          { ...mockPackageJson, version: '1.0.0-alpha.1' },
          null,
          2,
        ) + '\n',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Updated create-onchain version: 0.0.22 → 1.0.0-alpha.1',
      );
    });

    it('should preserve other package.json fields when updating version', async () => {
      const mockPackageJson = {
        name: 'create-onchain',
        version: '0.0.20',
        description: 'CLI tool',
        dependencies: { 'some-dep': '^1.0.0' },
        scripts: { test: 'vitest' },
      };
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );

      await publishPrerelease();

      const expectedPackageJson = {
        ...mockPackageJson,
        version: '1.0.0-alpha.1',
      };
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        '/mocked/create-onchain/package.json',
        JSON.stringify(expectedPackageJson, null, 2) + '\n',
      );
    });
  });

  describe('template package updating', () => {
    beforeEach(() => {
      // Only mock writeFileSync in beforeEach, let individual tests handle readFileSync
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
    });

    it('should update OnchainKit dependencies in templates', async () => {
      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(true) // templates directory exists
        .mockReturnValue(true); // template package.json exists

      vi.mocked(fs.readdirSync).mockReturnValue([
        { name: 'next', isDirectory: () => true },
      ] as any);

      const templatePackageJson = {
        name: 'template-next',
        dependencies: {
          '@coinbase/onchainkit': '^0.38.0',
          react: '^18.0.0',
        },
      };

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(
          JSON.stringify({ name: 'create-onchain', version: '0.0.22' }),
        )
        .mockReturnValue(JSON.stringify(templatePackageJson));

      await publishPrerelease();

      expect(mockConsoleLog).toHaveBeenCalledWith('Updating templates: next');
      // Check that the template file was written (it should be the second writeFileSync call)
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2, // Second call should be for the template
        'templates/next/package.json',
        JSON.stringify(
          {
            ...templatePackageJson,
            dependencies: {
              ...templatePackageJson.dependencies,
              '@coinbase/onchainkit': '1.0.0-alpha.1',
            },
          },
          null,
          2,
        ) + '\n',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'next: Updated @coinbase/onchainkit to 1.0.0-alpha.1',
      );
    });

    it('should update OnchainKit devDependencies in templates', async () => {
      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(true) // templates directory exists
        .mockReturnValue(true); // template package.json exists

      vi.mocked(fs.readdirSync).mockReturnValue([
        { name: 'minikit-snake', isDirectory: () => true },
      ] as any);

      const templatePackageJson = {
        name: 'template-minikit-snake',
        devDependencies: {
          '@coinbase/onchainkit': '^0.38.0',
          typescript: '^5.0.0',
        },
      };

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(
          JSON.stringify({ name: 'create-onchain', version: '0.0.22' }),
        )
        .mockReturnValue(JSON.stringify(templatePackageJson));

      await publishPrerelease();

      // Check that the template file was written (it should be the second writeFileSync call)
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2, // Second call should be for the template
        'templates/minikit-snake/package.json',
        JSON.stringify(
          {
            ...templatePackageJson,
            devDependencies: {
              ...templatePackageJson.devDependencies,
              '@coinbase/onchainkit': '1.0.0-alpha.1',
            },
          },
          null,
          2,
        ) + '\n',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'minikit-snake: Updated @coinbase/onchainkit to 1.0.0-alpha.1',
      );
    });

    it('should update both dependencies and devDependencies if present', async () => {
      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(true) // templates directory exists
        .mockReturnValue(true); // template package.json exists

      vi.mocked(fs.readdirSync).mockReturnValue([
        { name: 'complex-template', isDirectory: () => true },
      ] as any);

      const templatePackageJson = {
        name: 'complex-template',
        dependencies: {
          '@coinbase/onchainkit': '^0.38.0',
          react: '^18.0.0',
        },
        devDependencies: {
          '@coinbase/onchainkit': '^0.38.0',
          typescript: '^5.0.0',
        },
      };

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(
          JSON.stringify({ name: 'create-onchain', version: '0.0.22' }),
        )
        .mockReturnValue(JSON.stringify(templatePackageJson));

      await publishPrerelease();

      // Check that the template file was written (it should be the second writeFileSync call)
      expect(fs.writeFileSync).toHaveBeenNthCalledWith(
        2, // Second call should be for the template
        'templates/complex-template/package.json',
        JSON.stringify(
          {
            ...templatePackageJson,
            dependencies: {
              ...templatePackageJson.dependencies,
              '@coinbase/onchainkit': '1.0.0-alpha.1',
            },
            devDependencies: {
              ...templatePackageJson.devDependencies,
              '@coinbase/onchainkit': '1.0.0-alpha.1',
            },
          },
          null,
          2,
        ) + '\n',
      );
    });

    it('should skip templates without OnchainKit dependencies', async () => {
      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(true) // templates directory exists
        .mockReturnValue(true); // template package.json exists

      vi.mocked(fs.readdirSync).mockReturnValue([
        { name: 'vanilla-template', isDirectory: () => true },
      ] as any);

      const templatePackageJson = {
        name: 'vanilla-template',
        dependencies: {
          react: '^18.0.0',
          next: '^14.0.0',
        },
      };

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(
          JSON.stringify({ name: 'create-onchain', version: '0.0.22' }),
        )
        .mockReturnValue(JSON.stringify(templatePackageJson));

      await publishPrerelease();

      // Should not call writeFileSync for this template since no OnchainKit dependencies
      expect(fs.writeFileSync).toHaveBeenCalledTimes(1); // Only for create-onchain package.json
    });

    it('should warn about missing template package.json files', async () => {
      // Mock create-onchain package.json first
      vi.mocked(fs.readFileSync).mockReturnValueOnce(
        JSON.stringify({ name: 'create-onchain', version: '0.0.22' }),
      );

      vi.mocked(fs.existsSync)
        .mockReturnValueOnce(true) // templates directory exists
        .mockReturnValueOnce(false); // template package.json doesn't exist

      vi.mocked(fs.readdirSync).mockReturnValue([
        { name: 'broken-template', isDirectory: () => true },
      ] as any);

      await publishPrerelease();

      expect(mockConsoleWarn).toHaveBeenCalledWith(
        'Warning: No package.json found for template broken-template',
      );
    });

    it('should throw error if templates directory does not exist', async () => {
      // Mock create-onchain package.json first
      vi.mocked(fs.readFileSync).mockReturnValueOnce(
        JSON.stringify({ name: 'create-onchain', version: '0.0.22' }),
      );

      vi.mocked(fs.existsSync).mockReturnValueOnce(false); // templates directory doesn't exist

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error publishing alpha release:\n',
        'Templates directory not found at /mocked/create-onchain/templates',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should filter out non-directory items', async () => {
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        { name: 'template1', isDirectory: () => true },
        { name: 'README.md', isDirectory: () => false },
        { name: 'template2', isDirectory: () => true },
        { name: '.gitignore', isDirectory: () => false },
      ] as any);

      const templatePackageJson = {
        dependencies: { '@coinbase/onchainkit': '^0.38.0' },
      };

      // Mock create-onchain package.json read, then template package.json reads for each template
      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(
          JSON.stringify({ name: 'create-onchain', version: '0.0.22' }),
        )
        .mockReturnValueOnce(JSON.stringify(templatePackageJson)) // template1
        .mockReturnValueOnce(JSON.stringify(templatePackageJson)); // template2

      await publishPrerelease();

      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Updating templates: template1, template2',
      );
      expect(fs.writeFileSync).toHaveBeenCalledTimes(3); // create-onchain + 2 templates
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'template1: Updated @coinbase/onchainkit to 1.0.0-alpha.1',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'template2: Updated @coinbase/onchainkit to 1.0.0-alpha.1',
      );
    });
  });

  describe('registry submission', () => {
    beforeEach(() => {
      // Mock file operations for successful scenarios
      const mockPackageJson = { name: 'create-onchain', version: '0.0.22' };
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});
    });

    it('should publish with correct tag and options', async () => {
      await publishPrerelease();

      expect(process.chdir).toHaveBeenCalledWith('/mocked/create-onchain');
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Publishing from: /mocked/create-onchain',
      );
      expect(execSync).toHaveBeenCalledWith(
        'pnpm publish --tag alpha --no-git-checks',
        { stdio: 'inherit' },
      );
    });

    it('should publish with different tag', async () => {
      process.argv = [
        'node',
        'script.js',
        '--tag',
        'canary',
        '--version',
        '1.0.0-canary.3',
      ];

      await publishPrerelease();

      expect(execSync).toHaveBeenCalledWith(
        'pnpm publish --tag canary --no-git-checks',
        { stdio: 'inherit' },
      );
    });

    it('should handle publish command failure', async () => {
      vi.mocked(execSync).mockImplementation(() => {
        throw new Error('npm publish failed');
      });

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error publishing alpha release:\n',
        'npm publish failed',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('complete workflow integration', () => {
    it('should execute full workflow successfully', async () => {
      // Mock all file operations
      const createOnchainPackageJson = {
        name: 'create-onchain',
        version: '0.0.22',
      };
      const templatePackageJson = {
        name: 'template-next',
        dependencies: { '@coinbase/onchainkit': '^0.38.0', react: '^18.0.0' },
      };

      vi.mocked(fs.readFileSync)
        .mockReturnValueOnce(JSON.stringify(createOnchainPackageJson))
        .mockReturnValue(JSON.stringify(templatePackageJson));

      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([
        { name: 'next', isDirectory: () => true },
      ] as any);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});

      await publishPrerelease();

      // Verify the complete workflow
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Updated create-onchain version: 0.0.22 → 1.0.0-alpha.1',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith('Updating templates: next');
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'next: Updated @coinbase/onchainkit to 1.0.0-alpha.1',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'Publishing from: /mocked/create-onchain',
      );
      expect(mockConsoleLog).toHaveBeenCalledWith(
        'alpha release published: create-onchain@1.0.0-alpha.1',
      );

      expect(execSync).toHaveBeenCalledWith(
        'pnpm publish --tag alpha --no-git-checks',
        { stdio: 'inherit' },
      );
    });

    it('should handle file read errors gracefully', async () => {
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('File not found');
      });

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error publishing alpha release:\n',
        'File not found',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });

    it('should handle file write errors gracefully', async () => {
      const mockPackageJson = { name: 'create-onchain', version: '0.0.22' };
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);

      vi.mocked(fs.writeFileSync).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      await publishPrerelease();

      expect(mockConsoleError).toHaveBeenCalledWith(
        'Error publishing alpha release:\n',
        'Permission denied',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });

  describe('main function execution control', () => {
    it('should not run publishPrerelease when in test environment', async () => {
      globalThis.__IS_TEST_ENV = true;

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await main();

      // Verify that publishPrerelease was not called (no console logs)
      expect(consoleSpy).not.toHaveBeenCalled();

      // Clean up
      delete globalThis.__IS_TEST_ENV;
      consoleSpy.mockRestore();
    });

    it('should run publishPrerelease when not in test environment', async () => {
      // Ensure test environment flag is not set
      delete globalThis.__IS_TEST_ENV;

      // Mock all required operations for successful execution
      const mockPackageJson = { name: 'create-onchain', version: '0.0.22' };
      vi.mocked(fs.readFileSync).mockReturnValue(
        JSON.stringify(mockPackageJson),
      );
      vi.mocked(fs.existsSync).mockReturnValue(true);
      vi.mocked(fs.readdirSync).mockReturnValue([]);
      vi.mocked(fs.writeFileSync).mockImplementation(() => {});

      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      await main();

      // Verify that publishPrerelease was called (should see console logs)
      expect(consoleSpy).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Updated create-onchain version: 0.0.22 → 1.0.0-alpha.1',
      );

      consoleSpy.mockRestore();
    });

    it('should handle errors in main function', async () => {
      delete globalThis.__IS_TEST_ENV;

      // Mock an error in the file reading
      vi.mocked(fs.readFileSync).mockImplementation(() => {
        throw new Error('Critical error');
      });

      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const mockExit = vi
        .spyOn(process, 'exit')
        .mockImplementation(() => undefined as never);

      // Call main and catch the unhandled rejection
      try {
        await main();
      } catch (error) {
        // Expected since process.exit will be called on error
      }

      // Verify error was logged and process.exit was called
      expect(mockExit).toHaveBeenCalledWith(1);

      consoleErrorSpy.mockRestore();
    });
  });
});
