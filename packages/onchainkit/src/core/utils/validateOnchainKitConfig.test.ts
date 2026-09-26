import { describe, expect, it } from 'vitest';
import { base, mainnet } from 'viem/chains';
import {
  OnchainKitConfigError,
  validateOnchainKitConfig,
} from './validateOnchainKitConfig';

describe('validateOnchainKitConfig', () => {
  describe('chain validation', () => {
    it('should throw error when chain is missing', () => {
      expect(() =>
        validateOnchainKitConfig({} as { chain: typeof base }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({} as { chain: typeof base });
      } catch (error) {
        expect(error).toBeInstanceOf(OnchainKitConfigError);
        expect((error as OnchainKitConfigError).field).toBe('chain');
        expect((error as OnchainKitConfigError).message).toContain(
          'Missing required field: "chain"',
        );
      }
    });

    it('should throw error when chain is not an object', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: 'invalid' as unknown as typeof base,
        }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({
          chain: 'invalid' as unknown as typeof base,
        });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe('chain');
        expect((error as OnchainKitConfigError).message).toContain(
          'Invalid "chain" configuration',
        );
      }
    });

    it('should throw error when chain.id is not a number', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: { id: '1' } as unknown as typeof base,
        }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({
          chain: { id: '1' } as unknown as typeof base,
        });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe('chain.id');
      }
    });

    it('should pass with valid chain from viem/chains', () => {
      expect(() => validateOnchainKitConfig({ chain: base })).not.toThrow();
      expect(() => validateOnchainKitConfig({ chain: mainnet })).not.toThrow();
    });
  });

  describe('apiKey validation', () => {
    it('should pass when apiKey is undefined', () => {
      expect(() => validateOnchainKitConfig({ chain: base })).not.toThrow();
    });

    it('should pass with valid apiKey string', () => {
      expect(() =>
        validateOnchainKitConfig({ chain: base, apiKey: 'valid-key-123' }),
      ).not.toThrow();
    });

    it('should throw error when apiKey is not a string', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          apiKey: 123 as unknown as string,
        }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({
          chain: base,
          apiKey: 123 as unknown as string,
        });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe('apiKey');
        expect((error as OnchainKitConfigError).message).toContain(
          'Invalid "apiKey" - must be a string',
        );
      }
    });

    it('should throw error when apiKey is empty string', () => {
      expect(() =>
        validateOnchainKitConfig({ chain: base, apiKey: '' }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({ chain: base, apiKey: '' });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe('apiKey');
        expect((error as OnchainKitConfigError).message).toContain(
          'cannot be empty string',
        );
      }
    });

    it('should throw error when apiKey is whitespace only', () => {
      expect(() =>
        validateOnchainKitConfig({ chain: base, apiKey: '   ' }),
      ).toThrow(OnchainKitConfigError);
    });
  });

  describe('projectId validation', () => {
    it('should pass when projectId is undefined', () => {
      expect(() => validateOnchainKitConfig({ chain: base })).not.toThrow();
    });

    it('should pass with valid projectId string', () => {
      expect(() =>
        validateOnchainKitConfig({ chain: base, projectId: 'project-123' }),
      ).not.toThrow();
    });

    it('should throw error when projectId is not a string', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          projectId: 123 as unknown as string,
        }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({
          chain: base,
          projectId: 123 as unknown as string,
        });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe('projectId');
      }
    });

    it('should throw error when projectId is empty string', () => {
      expect(() =>
        validateOnchainKitConfig({ chain: base, projectId: '' }),
      ).toThrow(OnchainKitConfigError);
    });
  });

  describe('rpcUrl validation', () => {
    it('should pass when rpcUrl is undefined', () => {
      expect(() => validateOnchainKitConfig({ chain: base })).not.toThrow();
    });

    it('should pass with valid rpcUrl', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          rpcUrl: 'https://mainnet.base.org',
        }),
      ).not.toThrow();
    });

    it('should throw error when rpcUrl is not a string', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          rpcUrl: 123 as unknown as string,
        }),
      ).toThrow(OnchainKitConfigError);
    });

    it('should throw error when rpcUrl is empty string', () => {
      expect(() =>
        validateOnchainKitConfig({ chain: base, rpcUrl: '' }),
      ).toThrow(OnchainKitConfigError);
    });

    it('should throw error when rpcUrl is not a valid URL', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          rpcUrl: 'not-a-valid-url',
        }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({
          chain: base,
          rpcUrl: 'not-a-valid-url',
        });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe('rpcUrl');
        expect((error as OnchainKitConfigError).message).toContain(
          'not a valid URL',
        );
      }
    });

    it('should pass with valid Alchemy URL', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/demo-key',
        }),
      ).not.toThrow();
    });

    it('should pass with valid Infura URL', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          rpcUrl: 'https://mainnet.infura.io/v3/demo-key',
        }),
      ).not.toThrow();
    });
  });

  describe('config.appearance validation', () => {
    it('should pass when config is undefined', () => {
      expect(() => validateOnchainKitConfig({ chain: base })).not.toThrow();
    });

    it('should pass with valid mode', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          config: { appearance: { mode: 'dark' } },
        }),
      ).not.toThrow();
    });

    it('should throw error with invalid mode', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          config: { appearance: { mode: 'invalid-mode' as 'auto' } },
        }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({
          chain: base,
          config: { appearance: { mode: 'invalid-mode' as 'auto' } },
        });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe(
          'config.appearance.mode',
        );
        expect((error as OnchainKitConfigError).message).toContain(
          '"invalid-mode" is not a valid mode',
        );
      }
    });

    it('should pass with valid theme', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          config: { appearance: { theme: 'base' } },
        }),
      ).not.toThrow();
    });

    it('should throw error with invalid theme', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          config: { appearance: { theme: 'invalid-theme' as 'default' } },
        }),
      ).toThrow(OnchainKitConfigError);

      try {
        validateOnchainKitConfig({
          chain: base,
          config: { appearance: { theme: 'invalid-theme' as 'default' } },
        });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe(
          'config.appearance.theme',
        );
        expect((error as OnchainKitConfigError).message).toContain(
          '"invalid-theme" is not a valid theme',
        );
      }
    });

    it('should pass with all valid appearance options', () => {
      const validModes = ['auto', 'light', 'dark'] as const;
      const validThemes = ['default', 'base', 'cyberpunk', 'hacker'] as const;

      for (const mode of validModes) {
        for (const theme of validThemes) {
          expect(() =>
            validateOnchainKitConfig({
              chain: base,
              config: { appearance: { mode, theme } },
            }),
          ).not.toThrow();
        }
      }
    });
  });

  describe('config.paymaster validation', () => {
    it('should pass when paymaster is undefined', () => {
      expect(() => validateOnchainKitConfig({ chain: base })).not.toThrow();
    });

    it('should pass with valid paymaster URL', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          config: {
            paymaster:
              'https://api.developer.coinbase.com/rpc/v1/base/demo-key',
          },
        }),
      ).not.toThrow();
    });

    it('should throw error when paymaster is not a string', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          config: { paymaster: 123 as unknown as string },
        }),
      ).toThrow(OnchainKitConfigError);
    });

    it('should throw error when paymaster is empty string', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          config: { paymaster: '' },
        }),
      ).toThrow(OnchainKitConfigError);
    });

    it('should throw error when paymaster is not a valid URL', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          config: { paymaster: 'not-a-url' },
        }),
      ).toThrow(OnchainKitConfigError);
    });
  });

  describe('OnchainKitConfigError', () => {
    it('should have correct name property', () => {
      const error = new OnchainKitConfigError(
        'Test message',
        'testField',
        'Test suggestion',
      );
      expect(error.name).toBe('OnchainKitConfigError');
    });

    it('should include field and suggestion in message', () => {
      const error = new OnchainKitConfigError(
        'Test message',
        'testField',
        'Test suggestion',
      );
      expect(error.message).toContain('Test message');
      expect(error.message).toContain('Test suggestion');
      expect(error.field).toBe('testField');
      expect(error.suggestion).toBe('Test suggestion');
    });
  });

  describe('complex configurations', () => {
    it('should pass with all valid optional fields', () => {
      expect(() =>
        validateOnchainKitConfig({
          chain: base,
          apiKey: 'my-api-key',
          projectId: 'my-project-id',
          rpcUrl: 'https://mainnet.base.org',
          config: {
            appearance: {
              mode: 'dark',
              theme: 'base',
            },
            paymaster: 'https://api.developer.coinbase.com/rpc/v1/base/my-key',
          },
        }),
      ).not.toThrow();
    });

    it('should throw on first error encountered', () => {
      // Multiple errors - should throw on chain first
      expect(() =>
        validateOnchainKitConfig({
          chain: undefined as unknown as typeof base,
          apiKey: 123 as unknown as string,
        }),
      ).toThrow();

      // With valid chain, should throw on apiKey
      try {
        validateOnchainKitConfig({
          chain: base,
          apiKey: 123 as unknown as string,
          rpcUrl: 'invalid',
        });
      } catch (error) {
        expect((error as OnchainKitConfigError).field).toBe('apiKey');
      }
    });
  });
});
