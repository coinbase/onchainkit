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
import express from 'express';
import { WebSocketServer } from 'ws';
import { createMiniKitManifest, createMiniKitTemplate } from './minikit';

const { mockHttpServer } = vi.hoisted(() => ({
  mockHttpServer: {
    listen: vi.fn(),
    close: vi.fn(),
    on: vi.fn(),
  },
}));

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
    createServer: vi.fn(() => mockHttpServer),
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
        access: vi.fn().mockResolvedValue(undefined),
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
          return actual.resolve(__dirname, '..', 'templates', 'minikit-nextjs');
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

const getExpectedEnv = (
  projectName: string,
  clientKey: string,
) => `NEXT_PUBLIC_PROJECT_NAME="${projectName}"
NEXT_PUBLIC_ONCHAINKIT_API_KEY="${clientKey}"
NEXT_PUBLIC_URL=""
`;

const validAccountAssociation = {
  header: 'test-header',
  payload: 'test-payload',
  signature: 'test-signature',
  domain: 'https://example.com',
};

// `vi.resetAllMocks()` in afterEach strips the implementations declared in the
// `vi.mock` factories above, so the server mocks have to be re-armed each test.
function setupServerMocks() {
  (express as unknown as Mock).mockImplementation(() => ({
    use: vi.fn(),
    listen: vi.fn(),
  }));
  (express.static as unknown as Mock).mockReturnValue(vi.fn());

  mockHttpServer.listen.mockImplementation((...args: unknown[]) => {
    const callback = args.find((arg) => typeof arg === 'function');
    (callback as (() => void) | undefined)?.();
    return mockHttpServer;
  });
  mockHttpServer.close.mockReturnValue(mockHttpServer);
  mockHttpServer.on.mockReturnValue(mockHttpServer);
}

describe('MiniKit', () => {
  const originalGetArgs = process.argv;

  beforeEach(() => {
    process.argv = [...originalGetArgs];
    setupServerMocks();

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
    (fs.promises.access as Mock).mockResolvedValue(undefined);
    (fs.promises.readFile as Mock).mockImplementation((filePath: string) => {
      if (filePath.endsWith('package.json')) {
        return Promise.resolve(JSON.stringify({}));
      }
      if (filePath.endsWith('minikit.config.ts')) {
        return Promise.resolve(`export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    name: "APP_NAME",
  },
};`);
      }
      if (filePath.endsWith('.env')) {
        return Promise.resolve(
          'NEXT_PUBLIC_PROJECT_NAME="test"\nNEXT_PUBLIC_ONCHAINKIT_API_KEY=""\nNEXT_PUBLIC_URL=""',
        );
      }
      return Promise.resolve('');
    });

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
      expect.stringContaining(getExpectedEnv('test-project', 'test-key')),
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('name: "test-project"'),
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
      expect.stringContaining(getExpectedEnv('test-project', 'test-key')),
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('name: "test-project"'),
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
      clients: new Set(),
      close: vi.fn(),
      on: vi.fn((event, cb) => {
        if (event === 'connection') {
          setTimeout(() => {
            cb({
              on: vi.fn((event, msgCb) => {
                if (event === 'message') {
                  msgCb(Buffer.from(JSON.stringify(validAccountAssociation)));
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

    expect(open).toHaveBeenCalledWith(
      expect.stringMatching(/^http:\/\/127\.0\.0\.1:3333\/#token=[\w-]{43}$/),
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('NEXT_PUBLIC_URL="https://example.com"'),
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('header: "test-header"'),
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('payload: "test-payload"'),
    );
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      expect.any(String),
      expect.stringContaining('signature: "test-signature"'),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        '* Account association generated successfully and added to your minikit.config.ts file!',
      ),
    );
    expect(logSpy).toHaveBeenCalledWith(
      expect.stringContaining('Created new MiniKit project in'),
    );
  });

  describe('manifest WebSocket hardening', () => {
    type VerifyClientInfo = {
      origin?: string;
      req: { url?: string };
    };

    function startManifestFlow() {
      let connectionHandler: ((ws: unknown) => void) | undefined;
      let serverOptions:
        | {
            maxPayload: number;
            verifyClient: (info: VerifyClientInfo) => boolean;
          }
        | undefined;

      (WebSocketServer as unknown as Mock).mockImplementation(
        (options: typeof serverOptions) => {
          serverOptions = options;
          return {
            clients: new Set(),
            close: vi.fn(),
            on: vi.fn((event: string, cb: (ws: unknown) => void) => {
              if (event === 'connection') {
                connectionHandler = cb;
              }
            }),
          };
        },
      );

      const result = createMiniKitManifest();

      return {
        result,
        async ready() {
          await vi.waitFor(() => expect(connectionHandler).toBeDefined());
        },
        get options() {
          if (!serverOptions) {
            throw new Error('WebSocketServer was not constructed');
          }
          return serverOptions;
        },
        get token() {
          const url = (open as unknown as Mock).mock.calls[0][0] as string;
          return new URL(url).hash.replace('#token=', '');
        },
        send(raw: string) {
          let messageHandler: ((data: Buffer) => void) | undefined;
          connectionHandler?.({
            on: (event: string, cb: (data: Buffer) => void) => {
              if (event === 'message') {
                messageHandler = cb;
              }
            },
          });
          messageHandler?.(Buffer.from(raw));
        },
      };
    }

    it('binds the manifest server to loopback only', async () => {
      const flow = startManifestFlow();
      await flow.ready();

      expect(mockHttpServer.listen).toHaveBeenCalledWith(
        3333,
        '127.0.0.1',
        expect.any(Function),
      );

      flow.send(JSON.stringify(validAccountAssociation));
      await expect(flow.result).resolves.toBe(true);
    });

    it('accepts a handshake from the page it opened', async () => {
      const flow = startManifestFlow();
      await flow.ready();

      expect(
        flow.options.verifyClient({
          origin: 'http://127.0.0.1:3333',
          req: { url: `/?token=${flow.token}` },
        }),
      ).toBe(true);

      flow.send(JSON.stringify(validAccountAssociation));
      await flow.result;
    });

    it('rejects a handshake from a cross-origin page', async () => {
      const flow = startManifestFlow();
      await flow.ready();

      expect(
        flow.options.verifyClient({
          origin: 'https://attacker.example.com',
          req: { url: `/?token=${flow.token}` },
        }),
      ).toBe(false);

      flow.send(JSON.stringify(validAccountAssociation));
      await flow.result;
    });

    it('rejects a handshake with no Origin header', async () => {
      const flow = startManifestFlow();
      await flow.ready();

      expect(
        flow.options.verifyClient({
          req: { url: `/?token=${flow.token}` },
        }),
      ).toBe(false);

      flow.send(JSON.stringify(validAccountAssociation));
      await flow.result;
    });

    it('rejects a handshake with a missing or wrong session token', async () => {
      const flow = startManifestFlow();
      await flow.ready();

      expect(
        flow.options.verifyClient({
          origin: 'http://127.0.0.1:3333',
          req: { url: '/' },
        }),
      ).toBe(false);
      expect(
        flow.options.verifyClient({
          origin: 'http://127.0.0.1:3333',
          req: { url: '/?token=not-the-real-token' },
        }),
      ).toBe(false);
      expect(
        flow.options.verifyClient({
          origin: 'http://127.0.0.1:3333',
          req: { url: `/?token=${'a'.repeat(flow.token.length)}` },
        }),
      ).toBe(false);

      flow.send(JSON.stringify(validAccountAssociation));
      await flow.result;
    });

    it('issues a different session token on every run', async () => {
      const first = startManifestFlow();
      await first.ready();
      const firstToken = first.token;
      first.send(JSON.stringify(validAccountAssociation));
      await first.result;

      (open as unknown as Mock).mockClear();

      const second = startManifestFlow();
      await second.ready();
      const secondToken = second.token;
      second.send(JSON.stringify(validAccountAssociation));
      await second.result;

      expect(firstToken).toHaveLength(43);
      expect(secondToken).not.toBe(firstToken);
    });

    it('caps the accepted message size', async () => {
      const flow = startManifestFlow();
      await flow.ready();

      expect(flow.options.maxPayload).toBe(256 * 1024);

      flow.send(JSON.stringify(validAccountAssociation));
      await flow.result;
    });

    it.each([
      [
        'a header that escapes the string literal',
        {
          ...validAccountAssociation,
          header: `" + require('child_process').execSync('id') + "`,
        },
      ],
      [
        'a payload that escapes the string literal',
        { ...validAccountAssociation, payload: '","evil":"' },
      ],
      [
        'a signature that escapes the string literal',
        { ...validAccountAssociation, signature: '\\", process.exit(1), "' },
      ],
      [
        'a domain that escapes the .env value',
        {
          ...validAccountAssociation,
          domain: 'https://example.com"\nEVIL="1',
        },
      ],
      [
        'a domain with a non-http protocol',
        { ...validAccountAssociation, domain: 'javascript:alert(1)' },
      ],
      [
        'a non-string field',
        { ...validAccountAssociation, header: { toString: 'nope' } },
      ],
    ])('rejects %s', async (_label, association) => {
      const flow = startManifestFlow();
      await flow.ready();

      flow.send(JSON.stringify(association));

      await expect(flow.result).resolves.toBe(false);
      expect(fs.promises.writeFile).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        expect.stringContaining('Failed to generate account association'),
      );
    });

    it('rejects malformed JSON', async () => {
      const flow = startManifestFlow();
      await flow.ready();

      flow.send('not json');

      await expect(flow.result).resolves.toBe(false);
      expect(fs.promises.writeFile).not.toHaveBeenCalled();
    });

    it('writes account association values as escaped string literals', async () => {
      const flow = startManifestFlow();
      await flow.ready();

      flow.send(JSON.stringify(validAccountAssociation));
      await expect(flow.result).resolves.toBe(true);

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.env'),
        expect.stringContaining('NEXT_PUBLIC_URL="https://example.com"'),
      );
      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('minikit.config.ts'),
        expect.stringContaining('header: "test-header"'),
      );
    });
  });
});
