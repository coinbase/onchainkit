import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { applePaySvg } from '../../../internal/svg/applePaySvg';
import { CoinbasePaySvg } from '../../../internal/svg/coinbasePaySvg';
import { creditCardSvg } from '../../../internal/svg/creditCardSvg';
import { fundWalletSvg } from '../../../internal/svg/fundWallet';
import { swapSettingsSvg } from '../../../internal/svg/swapSettings';
import { toggleSvg } from '../../../internal/svg/toggleSvg';
import { walletSvg } from '../../../internal/svg/walletSvg';
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

  it('should return toggleSvg when icon is "toggle"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'toggle' }));
    expect(result.current).toBe(toggleSvg);
  });

  it('should return applePaySvg when icon is "applePay"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'applePay' }));
    expect(result.current).toBe(applePaySvg);
  });

  it('should return creditCardSvg when icon is "creditCard"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'creditCard' }));
    expect(result.current).toBe(creditCardSvg);
  });

  it('should return CoinbasePaySvg when icon is "coinbasePay"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'coinbasePay' }));
    expect(result.current?.type).toBe(CoinbasePaySvg);
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
