import { vi, describe, it, expect, beforeAll } from 'vitest';

vi.unmock('./version');

describe('version module', () => {
  beforeAll(() => {
    vi.resetModules();
    vi.stubGlobal('__OCK_VERSION__', '0.0.1');
  });

  it('exposes the version from the module', async () => {
    const { version } = await import('./version');
    expect(version).toBeDefined();
    expect(typeof version).toBe('string');
  });

  it('is imported correctly in other modules', async () => {
    const constants = await import('./core/network/constants');
    expect(constants.JSON_HEADERS).toHaveProperty('OnchainKit-Version');
  });
});

describe('version module error case', () => {
  beforeAll(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('throws an error when __OCK_VERSION__ is undefined', async () => {
    await expect(async () => {
      await import('./version');
    }).rejects.toThrow('__OCK_VERSION__ is not defined');
  });
});
