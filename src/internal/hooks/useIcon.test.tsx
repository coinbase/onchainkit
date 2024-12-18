import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { toggleSvg } from '../../internal/svg/toggleSvg';
import { applePaySvg } from '../svg/applePaySvg';
import { CoinbasePaySvg } from '../svg/coinbasePaySvg';
import { creditCardSvg } from '../svg/creditCardSvg';
import { fundWalletSvg } from '../svg/fundWallet';
import { swapSettingsSvg } from '../svg/swapSettings';
import { walletSvg } from '../svg/walletSvg';
import { useIcon } from './useIcon';

describe('useIcon', () => {
  it('returns CoinbasePaySvg when icon is "coinbasePay"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'coinbasePay' }));
    expect(result.current?.type).toBe(CoinbasePaySvg);
  });

  it('returns fundWalletSvg when icon is "fundWallet"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'fundWallet' }));
    expect(result.current).toBe(fundWalletSvg);
  });

  it('returns swapSettingsSvg when icon is "swapSettings"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'swapSettings' }));
    expect(result.current).toBe(swapSettingsSvg);
  });

  it('returns walletSvg when icon is "wallet"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'wallet' }));
    expect(result.current).toBe(walletSvg);
  });

  it('returns toggleSvg when icon is "toggle"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'toggle' }));
    expect(result.current).toBe(toggleSvg);
  });

  it('returns applePaySvg when icon is "applePay"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'applePay' }));
    expect(result.current).toBe(applePaySvg);
  });

  it('returns creditCardSvg when icon is "creditCard"', () => {
    const { result } = renderHook(() => useIcon({ icon: 'creditCard' }));
    expect(result.current).toBe(creditCardSvg);
  });

  it('returns null when icon is undefined', () => {
    const { result } = renderHook(() => useIcon({ icon: undefined }));
    expect(result.current).toBeNull();
  });

  it('returns the provided React element when icon is a valid element', () => {
    const customIcon = <div>Custom Icon</div>;
    const { result } = renderHook(() => useIcon({ icon: customIcon }));
    expect(result.current).toBe(customIcon);
  });
});
