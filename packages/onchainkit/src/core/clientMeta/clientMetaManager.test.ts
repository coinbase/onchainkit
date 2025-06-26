import '@testing-library/jest-dom';
import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from 'vitest';
import sdk from '@farcaster/frame-sdk';
import { clientMetaManager } from './clientMetaManager';

// Mock the farcaster sdk
vi.mock('@farcaster/frame-sdk', () => ({
  default: {
    context: Promise.resolve({ client: { clientFid: 123 } }),
  },
}));

const mockSdk = sdk as {
  context: Promise<{ client: { clientFid: number | null } } | null>;
};

type ConsoleSpy = MockInstance<
  (message?: unknown, ...optionalParams: unknown[]) => void
>;

describe('ClientMetaManager', () => {
  let consoleWarnSpy: ConsoleSpy;
  let consoleErrorSpy: ConsoleSpy;

  beforeEach(() => {
    // This is a workaround for testing singletons. A better approach would be to have a reset method.
    (
      clientMetaManager as unknown as {
        initPromise: null;
        clientMeta: null;
      }
    ).initPromise = null;
    (
      clientMetaManager as unknown as {
        initPromise: null;
        clientMeta: null;
      }
    ).clientMeta = null;

    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('initialization', () => {
    it('should not be initialized by default', () => {
      expect(clientMetaManager.isInitialized()).toBe(false);
    });

    it('should be initialized after calling init', async () => {
      clientMetaManager.init({ isMiniKit: false });
      expect(clientMetaManager.isInitialized()).toBe(true);
      await clientMetaManager.getClientMeta(); // wait for init to complete
    });

    it('should warn if init is called multiple times', async () => {
      clientMetaManager.init({ isMiniKit: false });
      clientMetaManager.init({ isMiniKit: true });
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'ClientMetaManager already initialized',
      );
      await clientMetaManager.getClientMeta(); // wait for init to complete
    });
  });

  describe('getClientMeta', () => {
    it('should throw an error if called before init', async () => {
      await expect(clientMetaManager.getClientMeta()).rejects.toThrow(
        'ClientMetaManager not initialized',
      );
    });

    it('should return correct meta for onchainkit mode', async () => {
      mockSdk.context = Promise.resolve({ client: { clientFid: 123 } });
      clientMetaManager.init({ isMiniKit: false });
      const meta = await clientMetaManager.getClientMeta();
      expect(meta).toEqual({
        mode: 'onchainkit',
        clientFid: 123,
      });
    });

    it('should return correct meta for minikit mode', async () => {
      mockSdk.context = Promise.resolve({ client: { clientFid: 456 } });
      clientMetaManager.init({ isMiniKit: true });
      const meta = await clientMetaManager.getClientMeta();
      expect(meta).toEqual({
        mode: 'minikit',
        clientFid: 456,
      });
    });

    it('should return null clientFid if not present in sdk context', async () => {
      mockSdk.context = Promise.resolve({ client: { clientFid: null } });
      clientMetaManager.init({ isMiniKit: false });
      const meta = await clientMetaManager.getClientMeta();
      expect(meta).toEqual({
        mode: 'onchainkit',
        clientFid: null,
      });
    });

    it('should return null clientFid if client is not present in sdk context', async () => {
      mockSdk.context = Promise.resolve(null);
      clientMetaManager.init({ isMiniKit: false });
      const meta = await clientMetaManager.getClientMeta();
      expect(meta).toEqual({
        mode: 'onchainkit',
        clientFid: null,
      });
    });

    it('should handle errors from farcaster sdk gracefully', async () => {
      const error = new Error('SDK Error');
      mockSdk.context = Promise.reject(error);
      clientMetaManager.init({ isMiniKit: false });
      const meta = await clientMetaManager.getClientMeta();
      expect(meta).toEqual({
        mode: 'onchainkit',
        clientFid: null,
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error getting client FID',
        error,
      );
    });

    it('should return cached clientMeta on subsequent calls', async () => {
      mockSdk.context = Promise.resolve({ client: { clientFid: 123 } });
      clientMetaManager.init({ isMiniKit: false });
      const meta1 = await clientMetaManager.getClientMeta();
      const meta2 = await clientMetaManager.getClientMeta();
      expect(meta1).toBe(meta2);
    });
  });
});
