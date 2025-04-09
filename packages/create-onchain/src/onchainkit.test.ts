import { describe, it, expect, beforeEach, afterEach, vi, type Mock } from 'vitest';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import ora from 'ora';
import { createOnchainKitTemplate } from './onchainkit';

vi.mock('./utils.js', () => ({
  copyDir: vi.fn().mockResolvedValue(undefined),
  optimizedCopy: vi.fn().mockResolvedValue(undefined),
  createClickableLink: vi.fn(),
  isValidPackageName: vi.fn().mockReturnValue(true),
  toValidPackageName: vi.fn().mockImplementation((name) => name),
}));
vi.mock('ora', () => ({
  default: vi.fn()
}));
vi.mock('http', () => ({
  default: {
    createServer: vi.fn(() => ({
      listen: vi.fn().mockImplementation((_, callback) => callback()),
      close: vi.fn()
    }))
  }
}));
vi.mock('open', () => ({ default: vi.fn() }));
vi.mock('prompts', () => ({
  default: vi.fn()
}));
vi.mock('fs', async () => {
  const actual = await vi.importActual<typeof import('fs')>('fs');
  return {
    default: {
      ...actual,
      readFileSync: vi.fn().mockReturnValue('{}'),
      existsSync: vi.fn(),
      readdirSync: vi.fn(),
      copyFile: vi.fn().mockResolvedValue(undefined),
      promises: {
        ...actual.promises,
        writeFile: vi.fn(),
        copyFile: vi.fn().mockResolvedValue(undefined),
        mkdir: vi.fn().mockResolvedValue(undefined),
        readdir: vi.fn().mockResolvedValue([]),
        readFile: vi.fn().mockResolvedValue('{}'),
      }
    }
  };
});
vi.mock('path', async () => {
  const actual = await vi.importActual<typeof import('path')>('path');
  return {
    default: {
      ...actual,
      resolve: vi.fn((...args) => {
        if (args.some(arg => typeof arg === 'string' && arg.includes('templates'))) {
          return actual.resolve(__dirname, '..', 'templates', 'minikit');
        }
        return actual.resolve(...args);
      })
    }
  };
});
vi.mock('url', () => ({
  default: {
    fileURLToPath: () => path.join(__dirname, '..', 'src', 'cli.ts')
  }
}));

vi.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`${code}`);
});

const logSpy = vi.spyOn(console, 'log');

describe('CLI', () => {
  const originalGetArgs = process.argv;

  beforeEach(() => {
    process.argv = [...originalGetArgs];

    (fs.promises.mkdir as Mock).mockResolvedValue(true);
    (fs.promises.readdir as Mock)
      .mockResolvedValueOnce(
        [{ name: 'test-file', isDirectory: vi.fn().mockReturnValue(true) }]
      ).mockResolvedValueOnce(
        [{ name: 'test-file-2', isDirectory: vi.fn().mockReturnValue(false) }]
      ).mockResolvedValue([]);
    (fs.promises.copyFile as Mock).mockResolvedValue(undefined);
    (fs.promises.readFile as Mock).mockResolvedValue(JSON.stringify({}));
    (fs.existsSync as Mock).mockResolvedValue(false);
    (fs.readdirSync as Mock).mockReturnValue([]);

    (ora as unknown as Mock).mockReturnValue({
      start: vi.fn().mockReturnValue({
        succeed: vi.fn(),
      }),
    });
  });

  afterEach(() => {
    process.argv = originalGetArgs;
    vi.resetAllMocks();
    vi.resetModules();
  })

  it('creates a new OnchainKit project with smart wallet enabled', async () => {
    (prompts as unknown as Mock).mockResolvedValue({
      projectName: 'test-project',
      clientKey: 'test-key',
      smartWallet: true,
    });

    await createOnchainKitTemplate();

    expect(fs.promises.writeFile).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=test-project\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=test-key\nNEXT_PUBLIC_ONCHAINKIT_WALLET_CONFIG=smartWalletOnly'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Created new OnchainKit project in'));
  });

  it('creates a new OnchainKit project with analytics', async () => {
    (prompts as unknown as Mock).mockResolvedValueOnce({
      projectName: 'test-project',
      clientKey: 'test-key',
      smartWallet: true,
    }).mockResolvedValueOnce({
      analytics: true,
    });

    await createOnchainKitTemplate();

    expect(fs.promises.writeFile).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=test-project\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=test-key\nNEXT_PUBLIC_ONCHAINKIT_WALLET_CONFIG=smartWalletOnly'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Created new OnchainKit project in'));
  });

  it('validates the directory', async () => {
    (fs.existsSync as Mock).mockReturnValue(true);
    (fs.readdirSync as Mock).mockReturnValue(['some-file']);

    (prompts as unknown as Mock).mockImplementation(async (questions) => {
      const validateFn = questions[0].validate;
      const result = validateFn('test-project');
      if (result !== true) {
        throw new Error(result);
      }

      return {
        projectName: 'test-project',
        clientKey: 'test-key',
        smartWallet: true,
      };
    });

    await expect(createOnchainKitTemplate()).rejects.toThrow('1');

    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Directory already exists and is not empty. Please choose a different name.')
    );
  });

  it('creates a new OnchainKit project with smart wallet not enabled', async () => {
    (prompts as unknown as Mock).mockResolvedValue({
      projectName: 'test-project',
      clientKey: 'test-key',
      smartWallet: false,
    });

    await createOnchainKitTemplate();

    expect(fs.promises.writeFile).toHaveBeenCalledWith(expect.any(String), expect.stringContaining('NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=test-project\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=test-key\nNEXT_PUBLIC_ONCHAINKIT_WALLET_CONFIG=all'));
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Created new OnchainKit project in'));
  });
});
