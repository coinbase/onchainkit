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
    const mockWagmiConfig = { testWagmi: true } as unknown as Config;
    vi.mocked(useConfig).mockReturnValue(mockWagmiConfig);
    vi.mocked(useQueryClient).mockImplementation(() => {
      throw new Error('No QueryClient set, use QueryClientProvider to set one');
    });
    const { result } = renderHook(() => useProviderDependencies());
    expect(result.current).toEqual({
      providedWagmiConfig: mockWagmiConfig,
      providedQueryClient: null,
    });
  });

  it('should log non-WagmiProvider errors and return null config', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const error = new Error('Different error');
    vi.mocked(useConfig).mockImplementation(() => {
      throw error;
    });
    const mockQueryClient = { testQuery: true } as unknown as QueryClient;
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    const { result } = renderHook(() => useProviderDependencies());
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching WagmiProvider, using default:',
      error,
    );
    expect(result.current).toEqual({
      providedWagmiConfig: null,
      providedQueryClient: mockQueryClient,
    });
    consoleErrorSpy.mockRestore();
  });

  it('should log non-QueryClient provider errors and return null client', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const mockWagmiConfig = { testWagmi: true } as unknown as Config;
    vi.mocked(useConfig).mockReturnValue(mockWagmiConfig);
    const error = new Error('Different query error');
    vi.mocked(useQueryClient).mockImplementation(() => {
      throw error;
    });
    const { result } = renderHook(() => useProviderDependencies());
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching QueryClient, using default:',
      error,
    );
    expect(result.current).toEqual({
      providedWagmiConfig: mockWagmiConfig,
      providedQueryClient: null,
    });
    consoleErrorSpy.mockRestore();
  });
});
