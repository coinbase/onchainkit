/**
 * @jest-environment jsdom
 */
import { renderHook, act } from '@testing-library/react';
import { Token } from '../../token';
import { useSelectSwapTokens } from './useSelectSwapTokens';
import { Address } from 'viem';

const userTokens: Token[] = [
  {
    name: 'Ethereum',
    address: '0xfffffffcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
    symbol: 'ETH',
    decimals: 18,
    image: null,
    chainId: 8453,
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
    symbol: 'USDC',
    decimals: 6,
    image: null,
    chainId: 8453,
  },
  {
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006' as Address,
    symbol: 'WETH',
    decimals: 18,
    image: null,
    chainId: 8453,
  },
];

const swappableTokens: Token[] = [
  {
    name: 'Dai',
    address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb' as Address,
    symbol: 'DAI',
    decimals: 18,
    image: null,
    chainId: 8453,
  },
  {
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006' as Address,
    symbol: 'WETH',
    decimals: 18,
    image: null,
    chainId: 8453,
  },
  {
    name: 'Ethereum',
    address: '0xfffffffcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
    symbol: 'ETH',
    decimals: 18,
    image: null,
    chainId: 8453,
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913' as Address,
    symbol: 'USDC',
    decimals: 6,
    image: null,
    chainId: 8453,
  },
];

describe('useSelectSwapTokens', () => {
  it('should initialize with correct values', () => {
    const { result } = renderHook(() => useSelectSwapTokens({ userTokens, swappableTokens }));

    expect(result.current.toToken).toEqual(userTokens[0]);
    expect(result.current.fromToken).toBeUndefined();
    expect(result.current.availableToTokens).toEqual(userTokens);
  });

  describe('handleSwitchTokens', () => {
    it('should handle switching token when no receive token is set', () => {
      // USERTOKEN_AS_TOTOKEN
      const { result } = renderHook(() => useSelectSwapTokens({ userTokens, swappableTokens }));

      act(() => {
        result.current.handleSwitchTokens();
      });

      // SWAPPABLETOKEN_AS_TOTOKEN
      expect(result.current.toToken).toEqual(undefined);
      expect(result.current.fromToken).toEqual(userTokens[0]);
      expect(result.current.availableToTokens).toEqual(swappableTokens);

      act(() => {
        result.current.handleSwitchTokens();
      });

      // USERTOKEN_AS_TOTOKEN
      expect(result.current.toToken).toEqual(userTokens[0]);
      expect(result.current.fromToken).toEqual(undefined);
      expect(result.current.availableToTokens).toEqual(userTokens);
    });

    it('should switch tokens after receive token is set and user DOES NOT HAVE the receive token', () => {
      // USERTOKEN_AS_TOTOKEN
      const { result } = renderHook(() => useSelectSwapTokens({ userTokens, swappableTokens }));

      act(() => {
        result.current.handleSwitchTokens();
      });

      // SWAPPABLETOKEN_AS_TOTOKEN
      act(() => {
        result.current.setFromToken(swappableTokens[0]);
      });

      act(() => {
        result.current.handleSwitchTokens();
      });

      // USERTOKEN_AS_TOTOKEN
      expect(result.current.toToken).toEqual(swappableTokens[0]);
      expect(result.current.fromToken).toEqual(undefined);
      expect(result.current.availableToTokens).toEqual(userTokens);
    });

    it('should switch tokens after receive token is set and user DOES HAVE the receive token', () => {
      // USERTOKEN_AS_TOTOKEN
      const { result } = renderHook(() => useSelectSwapTokens({ userTokens, swappableTokens }));

      act(() => {
        result.current.setFromToken(swappableTokens[0]);
      });

      act(() => {
        result.current.handleSwitchTokens();
      });

      // SWAPPABLETOKEN_AS_TOTOKEN
      expect(result.current.toToken).toEqual(swappableTokens[0]);
      expect(result.current.fromToken).toEqual(userTokens[0]);
      expect(result.current.availableToTokens).toEqual(swappableTokens);

      act(() => {
        result.current.setFromToken(swappableTokens[1]);
      });

      act(() => {
        result.current.handleSwitchTokens();
      });

      // USERTOKEN_AS_TOTOKEN
      expect(result.current.toToken).toEqual(swappableTokens[1]);
      expect(result.current.fromToken).toEqual(swappableTokens[0]);
      expect(result.current.availableToTokens).toEqual(userTokens);
    });
  });

  it('should update toToken correctly', () => {
    const { result } = renderHook(() => useSelectSwapTokens({ userTokens, swappableTokens }));

    act(() => {
      result.current.setToToken(result.current.availableToTokens[1]);
    });

    expect(result.current.toToken).toBe(userTokens[1]);
  });

  it('should update fromToken correctly', () => {
    const { result } = renderHook(() => useSelectSwapTokens({ userTokens, swappableTokens }));

    act(() => {
      result.current.setFromToken(swappableTokens[1]);
    });

    expect(result.current.fromToken).toBe(swappableTokens[1]);
  });
});
