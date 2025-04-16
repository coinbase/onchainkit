import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('version module', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exposes the version from the module', async () => {
    // Import the mocked version module
    const versionModule = await import('./version');
    expect(versionModule.version).toBeDefined();
    expect(typeof versionModule.version).toBe('string');
  });

  it('is imported correctly in other modules', async () => {
    // Verify that version is imported properly in a file that uses it
    const constants = await import('./core/network/constants');
    expect(constants.JSON_HEADERS).toHaveProperty('OnchainKit-Version');
  });
});
