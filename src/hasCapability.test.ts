import { describe, expect, it } from 'vitest';
import { hasCapability } from './hasCapability';

describe('hasCapability', () => {
  const walletCapabilities = {
    atomicBatch: {
      supported: true,
    },
    paymasterService: {
      supported: true,
    },
    auxiliaryFunds: {
      supported: false,
    },
    nonExistentCapability: undefined,
  };

  it('should return true for supported capabilities', () => {
    expect(
      hasCapability({ capability: 'atomicBatch', walletCapabilities }),
    ).toBe(true);
    expect(
      hasCapability({ capability: 'paymasterService', walletCapabilities }),
    ).toBe(true);
  });

  it('should return false for unsupported capabilities', () => {
    expect(
      hasCapability({ capability: 'auxiliaryFunds', walletCapabilities }),
    ).toBe(false);
  });

  it('should return false for non-existent capabilities', () => {
    expect(
      hasCapability({
        capability: 'nonExistentCapability',
        walletCapabilities,
      }),
    ).toBe(false);
  });

  it('should return false for capabilities not in the walletCapabilities object', () => {
    expect(
      hasCapability({ capability: 'unknownCapability', walletCapabilities }),
    ).toBe(false);
  });
});
