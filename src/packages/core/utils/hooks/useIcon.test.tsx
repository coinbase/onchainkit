import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { coinbasePaySvg } from '../svg/coinbasePaySvg';
import { fundWalletSvg } from '../svg/fundWallet';
import { swapSettingsSvg } from '../svg/swapSettings';
import { walletSvg } from '../svg/walletSvg';
import { useIcon } from './useIcon';

describe('useIcon', () => {
  it('should return null when icon is undefined', () => {
    const { result } = renderHook(() => useIcon({ icon: undefined }));
    expect(result.current).toBeNull();
  });

  it('should return walletSvg when icon is "wallet"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'wallet' }));
    expect(result.current).toBe(walletSvg);
  });

  it('should return coinbasePaySvg when icon is "coinbasePay"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'coinbasePay' }));
    expect(result.current).toBe(coinbasePaySvg);
  });

  it('should return fundWalletSvg when icon is "fundWallet"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'fundWallet' }));
    expect(result.current).toBe(fundWalletSvg);
  });

  it('should memoize the result for undefined', () => {
    const { result, rerender } = renderHook(() => useIcon({}), {
      initialProps: {},
    });

    const initialResult = result.current;
    rerender({});
    expect(result.current).toBe(initialResult);
  });

  it('should memoize the result for wallet', () => {
    const { result, rerender } = renderHook(({ icon }) => useIcon({ icon }), {
      initialProps: { icon: 'wallet' },
    });

    const initialResult = result.current;
    rerender({ icon: 'wallet' });
    expect(result.current).toBe(initialResult);
  });

  it('should memoize the result for fundWallet', () => {
    const { result, rerender } = renderHook(({ icon }) => useIcon({ icon }), {
      initialProps: { icon: 'fundWallet' },
    });

    const initialResult = result.current;
    rerender({ icon: 'fundWallet' });
    expect(result.current).toBe(initialResult);
  });

  it('should memoize the result for custom icon', () => {
    const customIcon = <svg aria-label="custom-icon" />;
    const { result, rerender } = renderHook(({ icon }) => useIcon({ icon }), {
      initialProps: { icon: customIcon },
    });

    const initialResult = result.current;
    rerender({ icon: customIcon });
    expect(result.current).toBe(initialResult);
  });

  it('should return swapSettingsSvg when icon is "swapSettings"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'swapSettings' }));
    expect(result.current).toBe(swapSettingsSvg);
  });
});
