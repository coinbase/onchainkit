/**
 * End-to-end coverage for SECBUGS-22415.
 *
 * `minikit.test.ts` mocks `http` and `ws`, so it can only assert that the
 * hardening options are passed. These tests run the real server and drive real
 * WebSocket clients against it, which is the only way to prove that a hostile
 * client never reaches the code that writes `minikit.config.ts`.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { WebSocket } from 'ws';
import { createMiniKitManifest } from './minikit';

vi.mock('open', () => ({ default: vi.fn() }));
// `analyticsPrompt` is unused by the manifest flow but pulls in prompts on import.
vi.mock('./analytics.js', () => ({ analyticsPrompt: vi.fn() }));

const open = (await import('open')).default as unknown as ReturnType<
  typeof vi.fn
>;

const CONFIG_TEMPLATE = `export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
};
`;

const validAssociation = {
  header: 'eyJmaWQiOjEyMywidHlwZSI6ImN1c3RvZHkifQ',
  payload: 'eyJkb21haW4iOiJleGFtcGxlLmNvbSJ9',
  signature: 'MHgxMjM0NTY3ODkwYWJjZGVm',
  domain: 'https://example.com',
};

const EXPECTED_ORIGIN = 'http://127.0.0.1:3333';

let projectDir: string;
let previousCwd: string;

function readOpenedUrl() {
  const url = open.mock.calls[0]?.[0] as string | undefined;
  if (!url) {
    throw new Error('the manifest flow never opened a browser');
  }
  return url;
}

function tokenFromOpenedUrl() {
  return new URL(readOpenedUrl()).hash.replace('#token=', '');
}

/**
 * Resolves `'connected'` once the handshake succeeds, or `'rejected'` if the
 * server refuses the upgrade.
 */
function handshake({
  origin,
  token,
  host = '127.0.0.1',
  message,
}: {
  origin?: string;
  token?: string;
  host?: string;
  message?: string;
}): Promise<'connected' | 'rejected'> {
  return new Promise((resolve) => {
    const query = token === undefined ? '' : `/?token=${token}`;
    const client = new WebSocket(`ws://${host}:3333${query}`, {
      headers: origin ? { Origin: origin } : {},
    });

    client.on('open', () => {
      if (message !== undefined) {
        client.send(message);
      }
      setTimeout(() => {
        client.close();
        resolve('connected');
      }, 50);
    });
    client.on('error', () => resolve('rejected'));
  });
}

async function waitForServer() {
  await vi.waitFor(() => expect(open).toHaveBeenCalled());
}

/**
 * `server.close()` frees the port asynchronously, so without this the next test
 * hits EADDRINUSE.
 */
function waitForPortRelease() {
  return vi.waitFor(
    () =>
      new Promise<void>((resolve, reject) => {
        const probe = net.createServer();
        probe.once('error', reject);
        probe.listen(3333, '127.0.0.1', () => probe.close(() => resolve()));
      }),
    { timeout: 5000, interval: 25 },
  );
}

/** Resolves true when a TCP connection to `host:3333` is established. */
function canConnect(host: string, timeout = 1500) {
  return new Promise<boolean>((resolve) => {
    const socket = net.connect({ host, port: 3333, timeout });
    const finish = (result: boolean) => {
      socket.destroy();
      resolve(result);
    };
    socket.once('connect', () => finish(true));
    socket.once('timeout', () => finish(false));
    socket.once('error', () => finish(false));
  });
}

beforeEach(() => {
  previousCwd = process.cwd();
  projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'minikit-manifest-'));
  fs.writeFileSync(path.join(projectDir, '.env'), 'NEXT_PUBLIC_URL=""\n');
  fs.writeFileSync(path.join(projectDir, 'minikit.config.ts'), CONFIG_TEMPLATE);
  process.chdir(projectDir);
  open.mockReset();
});

afterEach(async () => {
  await waitForPortRelease();
  process.chdir(previousCwd);
  fs.rmSync(projectDir, { recursive: true, force: true });
});

function readConfig() {
  return fs.readFileSync(path.join(projectDir, 'minikit.config.ts'), 'utf-8');
}

function readEnv() {
  return fs.readFileSync(path.join(projectDir, '.env'), 'utf-8');
}

describe('create-onchain --manifest server', () => {
  it('accepts the page it opened and writes the account association', async () => {
    const run = createMiniKitManifest();
    await waitForServer();

    expect(readOpenedUrl()).toMatch(
      /^http:\/\/127\.0\.0\.1:3333\/#token=[\w-]{43}$/,
    );

    await expect(
      handshake({
        origin: EXPECTED_ORIGIN,
        token: tokenFromOpenedUrl(),
        message: JSON.stringify(validAssociation),
      }),
    ).resolves.toBe('connected');

    await expect(run).resolves.toBe(true);
    expect(readConfig()).toContain(`header: "${validAssociation.header}"`);
    expect(readConfig()).toContain(`payload: "${validAssociation.payload}"`);
    expect(readConfig()).toContain(
      `signature: "${validAssociation.signature}"`,
    );
    expect(readEnv()).toContain('NEXT_PUBLIC_URL="https://example.com"');
  });

  it.each([
    [
      'a cross-origin page that stole the token',
      (token: string) => ({ origin: 'https://attacker.example.com', token }),
    ],
    [
      'a cross-origin page with no token',
      () => ({ origin: 'https://attacker.example.com' }),
    ],
    ['a client that sends no Origin header', (token: string) => ({ token })],
    ['the right origin with no token', () => ({ origin: EXPECTED_ORIGIN })],
    [
      'the right origin with a wrong token',
      () => ({ origin: EXPECTED_ORIGIN, token: 'not-the-session-token' }),
    ],
    [
      'the right origin with a same-length wrong token',
      (token: string) => ({
        origin: EXPECTED_ORIGIN,
        token: 'a'.repeat(token.length),
      }),
    ],
  ])('refuses the handshake from %s', async (_label, buildAttempt) => {
    const run = createMiniKitManifest();
    await waitForServer();
    const token = tokenFromOpenedUrl();

    const evil = JSON.stringify({
      ...validAssociation,
      header: `" + require('child_process').execSync('id') + "`,
    });

    await expect(
      handshake({ ...buildAttempt(token), message: evil }),
    ).resolves.toBe('rejected');

    expect(readConfig()).toBe(CONFIG_TEMPLATE);

    // Let the legitimate client finish so the server shuts down.
    await handshake({
      origin: EXPECTED_ORIGIN,
      token,
      message: JSON.stringify(validAssociation),
    });
    await run;
  });

  it('listens on loopback but not on a non-loopback interface', async () => {
    const lanAddress = Object.values(os.networkInterfaces())
      .flat()
      .find(
        (iface) => iface && iface.family === 'IPv4' && !iface.internal,
      )?.address;

    const run = createMiniKitManifest();
    await waitForServer();
    const token = tokenFromOpenedUrl();

    expect(await canConnect('127.0.0.1')).toBe(true);
    if (lanAddress) {
      expect(await canConnect(lanAddress)).toBe(false);
    }

    await handshake({
      origin: EXPECTED_ORIGIN,
      token,
      message: JSON.stringify(validAssociation),
    });
    await run;
  });

  it.each([
    [
      'a header that escapes the string literal',
      { header: `" + require('child_process').execSync('id') + "` },
    ],
    [
      'a domain that opens a second .env assignment',
      { domain: 'https://example.com"\nEVIL="1' },
    ],
    ['a domain with credentials', { domain: 'https://user:pw@example.com' }],
    ['a non-http domain', { domain: 'javascript:alert(1)' }],
  ])(
    'rejects %s sent over the authorised connection',
    async (_label, override) => {
      const run = createMiniKitManifest();
      await waitForServer();

      await handshake({
        origin: EXPECTED_ORIGIN,
        token: tokenFromOpenedUrl(),
        message: JSON.stringify({ ...validAssociation, ...override }),
      });

      await expect(run).resolves.toBe(false);
      expect(readConfig()).toBe(CONFIG_TEMPLATE);
      expect(readEnv()).toBe('NEXT_PUBLIC_URL=""\n');
    },
  );

  it('does not crash on a frame larger than maxPayload', async () => {
    const run = createMiniKitManifest();
    await waitForServer();

    await handshake({
      origin: EXPECTED_ORIGIN,
      token: tokenFromOpenedUrl(),
      message: 'x'.repeat(256 * 1024 + 1),
    });

    await expect(run).resolves.toBe(false);
    expect(readConfig()).toBe(CONFIG_TEMPLATE);
  });
});
