import { describe, it, expect, vi } from 'vitest';
import { getDefaultConfig } from './getDefaultConfig';
import { createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

// Mock the imported modules
vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    createConfig: vi.fn(),
    createStorage: vi.fn(),
  };
});

vi.mock('wagmi/chains', async () => {
  const actual = await vi.importActual('wagmi/chains');
  return {
    ...actual,
    base: { id: 8453 },
    baseSepolia: { id: 84532 },
  };
});

vi.mock('wagmi/connectors', async () => {
  const actual = await vi.importActual('wagmi/connectors');
  return {
    ...actual,
    coinbaseWallet: vi.fn(),
  };
});

describe('getDefaultConfig', () => {
  it('should create config with default values when no parameters are provided', () => {
    getDefaultConfig({});

    expect(createConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        chains: [base, baseSepolia],
        ssr: true,
        transports: {
          [base.id]: expect.any(Function),
          [baseSepolia.id]: expect.any(Function),
        },
      })
    );

    expect(coinbaseWallet).toHaveBeenCalledWith({
      appName: 'My OnchainKit App',
      appLogoUrl: 'https://onchainkit.xyz/favicon/48x48.png?v4-19-24',
      preference: 'smartWalletOnly',
    });
  });

  it('should create config with custom values when parameters are provided', () => {
    const customConfig = {
      appearance: {
        name: 'Custom App',
        logo: 'https://example.com/logo.png',
      },
    };

    getDefaultConfig({ apiKey: 'test-api-key', config: customConfig });

    expect(createConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        chains: [base, baseSepolia],
        ssr: true,
        transports: {
          [base.id]: expect.any(Function),
          [baseSepolia.id]: expect.any(Function),
        },
      })
    );

    expect(coinbaseWallet).toHaveBeenCalledWith({
      appName: 'Custom App',
      appLogoUrl: 'https://example.com/logo.png',
      preference: 'smartWalletOnly',
    });
  });

  it('should use API key in transports when provided', () => {
    const result = getDefaultConfig({ apiKey: 'test-api-key' });

    expect(createConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        transports: {
          [base.id]: expect.any(Function),
          [baseSepolia.id]: expect.any(Function),
        },
      })
    );
  });
});
