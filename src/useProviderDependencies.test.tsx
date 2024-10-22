import { type QueryClient, useQueryClient } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { type Config, WagmiProviderNotFoundError, useConfig } from 'wagmi';
import { useProviderDependencies } from './useProviderDependencies';

// Mock the wagmi and react-query hooks
vi.mock('wagmi', async () => {
  const actual = await vi.importActual('wagmi');
  return {
    ...actual,
    useConfig: vi.fn(),
  };
});

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQueryClient: vi.fn(),
  };
});

describe('useProviderDependencies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return both configs when they exist', () => {
    // Mock successful responses
    const mockWagmiConfig = { testWagmi: true } as unknown as Config;
    const mockQueryClient = { testQuery: true } as unknown as QueryClient;

    vi.mocked(useConfig).mockReturnValue(mockWagmiConfig);
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);

    const { result } = renderHook(() => useProviderDependencies());

    expect(result.current).toEqual({
      providedWagmiConfig: mockWagmiConfig,
      providedQueryClient: mockQueryClient,
    });
  });

  it('should handle missing WagmiProvider gracefully', () => {
    // Mock WagmiProvider not found
    vi.mocked(useConfig).mockImplementation(() => {
      throw new WagmiProviderNotFoundError();
    });

    const mockQueryClient = { testQuery: true } as unknown as QueryClient;
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);

    const { result } = renderHook(() => useProviderDependencies());

    expect(result.current).toEqual({
      providedWagmiConfig: null,
      providedQueryClient: mockQueryClient,
    });
  });

  it('should handle missing QueryClient gracefully', () => {
    // Mock successful WagmiConfig
    const mockWagmiConfig = { testWagmi: true } as unknown as Config;
    vi.mocked(useConfig).mockReturnValue(mockWagmiConfig);

    // Mock QueryClient not found
    vi.mocked(useQueryClient).mockImplementation(() => {
      throw new Error('No QueryClient set, use QueryClientProvider to set one');
    });

    const { result } = renderHook(() => useProviderDependencies());

    expect(result.current).toEqual({
      providedWagmiConfig: mockWagmiConfig,
      providedQueryClient: null,
    });
  });

  it('should throw non-WagmiProvider errors', () => {
    // Mock different error for WagmiConfig
    vi.mocked(useConfig).mockImplementation(() => {
      throw new Error('Different error');
    });

    const mockQueryClient = { testQuery: true } as unknown as QueryClient;
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);

    expect(() => {
      renderHook(() => useProviderDependencies());
    }).toThrow('Different error');
  });

  it('should throw non-QueryClient provider errors', () => {
    // Mock successful WagmiConfig
    const mockWagmiConfig = { testWagmi: true } as unknown as Config;
    vi.mocked(useConfig).mockReturnValue(mockWagmiConfig);

    // Mock different error for QueryClient
    vi.mocked(useQueryClient).mockImplementation(() => {
      throw new Error('Different query error');
    });

    expect(() => {
      renderHook(() => useProviderDependencies());
    }).toThrow('Different query error');
  });
});
