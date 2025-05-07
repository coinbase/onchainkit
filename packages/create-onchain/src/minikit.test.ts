import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type Mock,
} from 'vitest';
import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import open from 'open';
import ora from 'ora';
import { WebSocketServer } from 'ws';
import { createMiniKitManifest, createMiniKitTemplate } from './minikit';

vi.mock('./utils.js', () => ({
  copyDir: vi.fn().mockResolvedValue(undefined),
  optimizedCopy: vi.fn().mockResolvedValue(undefined),
  createClickableLink: vi.fn(),
  isValidPackageName: vi.fn().mockReturnValue(true),
  toValidPackageName: vi.fn().mockImplementation((name) => name),
}));
vi.mock('ora', () => ({
  default: vi.fn(),
}));
vi.mock('express', () => {
  const mockExpress = vi.fn(() => ({
    use: vi.fn(),
    listen: vi.fn(),
  })) as any;
  mockExpress.static = vi.fn();
  return { default: mockExpress };
});
vi.mock('ws', () => ({
  WebSocketServer: vi.fn(),
}));
vi.mock('http', () => ({
  default: {
    createServer: vi.fn(() => ({
      listen: vi.fn().mockImplementation((_, callback) => callback()),
      close: vi.fn(),
    })),
  },
}));
vi.mock('open', () => ({ default: vi.fn() }));
vi.mock('prompts', () => ({
  default: vi.fn(),
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
      },
    },
  };
});
vi.mock('path', async () => {
  const actual = await vi.importActual<typeof import('path')>('path');
  return {
    default: {
      ...actual,
      resolve: vi.fn((...args) => {
        if (
          args.some(
            (arg) => typeof arg === 'string' && arg.includes('templates'),
          )
        ) {
          return actual.resolve(__dirname, '..', 'templates', 'minikit-basic');
        }
        return actual.resolve(...args);
      }),
    },
  };
});
vi.mock('url', () => ({
  default: {
    fileURLToPath: () => path.join(__dirname, '..', 'src', 'cli.ts'),
  },
}));

vi.spyOn(process, 'exit').mockImplementation((code) => {
  throw new Error(`${code}`);
});

const logSpy = vi.spyOn(console, 'log');

describe('MiniKit', () => {
  const originalGetArgs = process.argv;

  beforeEach(() => {
    process.argv = [...originalGetArgs];

    (fs.promises.mkdir as Mock).mockResolvedValue(true);
    (fs.promises.readdir as Mock)
      .mockResolvedValueOnce([
        { name: 'test-file', isDirectory: vi.fn().mockReturnValue(true) },
      ])
      .mockResolvedValueOnce([
        { name: 'test-file-2', isDirectory: vi.fn().mockReturnValue(false) },
      ])
      .mockResolvedValue([]);
    (fs.promises.copyFile as Mock).mockResolvedValue(undefined);
    (fs.promises.readFile as Mock).mockResolvedValue(JSON.stringify({}));

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
  });

  it('creates a new MiniKit project', async () => {
    (prompts as unknown as Mock)
      .mockResolvedValueOnce({
        projectName: 'test-project',
        clientKey: 'test-key',
      })
      .mockResolvedValueOnce({
        analytics: false,
      })
      .mockResolvedValueOnce({
        setUpFrame: false,
      });

    await createMiniKitTemplate();

    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(
        'NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=test-project\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=test-key\nNEXT_PUBLIC_URL=\nNEXT_PUBLIC_SPLASH_IMAGE_URL=$NEXT_PUBLIC_URL/logo.png\nNEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=FFFFFF\nNEXT_PUBLIC_IMAGE_URL=$NEXT_PUBLIC_URL/logo.png\nNEXT_PUBLIC_ICON_URL=$NEXT_PUBLIC_URL/logo.png\nNEXT_PUBLIC_VERSION=next\nREDIS_URL=\nREDIS_TOKEN=',
      ),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Created new MiniKit project in'),
    );
  });

  it('creates a new MiniKit project with analytics', async () => {
    (prompts as unknown as Mock)
      .mockResolvedValueOnce({
        projectName: 'test-project',
        clientKey: 'test-key',
      })
      .mockResolvedValueOnce({
        analytics: true,
      })
      .mockResolvedValueOnce({
        setUpFrame: false,
      });

    await createMiniKitTemplate();

    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(
        'NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=test-project\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=test-key\nNEXT_PUBLIC_URL=\nNEXT_PUBLIC_SPLASH_IMAGE_URL=$NEXT_PUBLIC_URL/logo.png\nNEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=FFFFFF\nNEXT_PUBLIC_IMAGE_URL=$NEXT_PUBLIC_URL/logo.png\nNEXT_PUBLIC_ICON_URL=$NEXT_PUBLIC_URL/logo.png\nNEXT_PUBLIC_VERSION=next\nREDIS_URL=\nREDIS_TOKEN=',
      ),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Created new MiniKit project in'),
    );
  });

  it('sets up Frame manifest', async () => {
    let resolveWebSocket: (value: any) => void;
    const webSocketPromise = new Promise((resolve) => {
      resolveWebSocket = resolve;
    });

    (WebSocketServer as unknown as Mock).mockImplementation(() => ({
      on: vi.fn((event, cb) => {
        if (event === 'connection') {
          setTimeout(() => {
            cb({
              on: vi.fn((event, msgCb) => {
                if (event === 'message') {
                  msgCb(
                    Buffer.from(
                      JSON.stringify({
                        header: 'test-header',
                        payload: 'test-payload',
                        signature: 'test-signature',
                        domain: 'test-domain',
                      }),
                    ),
                  );
                  resolveWebSocket(true);
                }
              }),
            });
          }, 0);
        }
      }),
    }));

    (prompts as unknown as Mock)
      .mockResolvedValueOnce({
        projectName: 'test-project',
        clientKey: 'test-key',
      })
      .mockResolvedValueOnce({
        analytics: false,
      })
      .mockResolvedValueOnce({
        setUpFrame: true,
      });

    const templatePromise = createMiniKitTemplate();

    const createManifestPromise = createMiniKitManifest();

    await Promise.all([
      webSocketPromise,
      templatePromise,
      createManifestPromise,
    ]);

    expect(open).toHaveBeenCalledWith('http://localhost:3333');
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining(
        'FARCASTER_HEADER=test-header\nFARCASTER_PAYLOAD=test-payload\nFARCASTER_SIGNATURE=test-signature\nNEXT_PUBLIC_URL=test-domain',
      ),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '* Account association generated successfully and added to your .env file!',
      ),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Created new MiniKit project in'),
    );
  });
});
