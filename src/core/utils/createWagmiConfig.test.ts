import { describe, expect, it, vi } from 'vitest';
import { createConfig } from 'wagmi';
import { http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';
import { createWagmiConfig } from './createWagmiConfig';

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

describe('createWagmiConfig', () => {
  it('should create config with default values when no parameters are provided', () => {
    createWagmiConfig({});
    expect(createConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        chains: [base, baseSepolia],
        ssr: true,
        transports: {
          [base.id]: expect.any(Function),
          [baseSepolia.id]: expect.any(Function),
        },
      }),
    );
    expect(coinbaseWallet).toHaveBeenCalledWith({
      appName: undefined,
      appLogoUrl: undefined,
      preference: 'all',
    });
  });

  it('should create config with custom values when parameters are provided', () => {
    const customConfig = {
      appearance: {
        name: 'Custom App',
        logo: 'https://example.com/logo.png',
      },
    };
    createWagmiConfig({
      apiKey: 'test-api-key',
      appName: customConfig.appearance.name,
      appLogoUrl: customConfig.appearance.logo,
    });
    expect(createConfig).toHaveBeenCalledWith(
      expect.objectContaining({
        chains: [base, baseSepolia],
        ssr: true,
        transports: {
          [base.id]: expect.any(Function),
          [baseSepolia.id]: expect.any(Function),
        },
      }),
    );
    expect(coinbaseWallet).toHaveBeenCalledWith({
      appName: 'Custom App',
      appLogoUrl: 'https://example.com/logo.png',
      preference: 'all',
    });
  });

  it('should use API key in transports when provided', () => {
    const testApiKey = 'test-api-key';
    const result = createWagmiConfig({ apiKey: testApiKey });
    expect(result).toContain(
      http(`https://api.developer.coinbase.com/rpc/v1/base/${testApiKey}`),
    );
    expect(result).toContain(
      http(
        `https://api.developer.coinbase.com/rpc/v1/base-sepolia/${testApiKey}`,
      ),
    );
  });
});
