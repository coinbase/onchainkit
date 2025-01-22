import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EarnProvider, useEarnContext } from './EarnProvider';

describe('EarnProvider', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <EarnProvider vaultAddress="0x123">{children}</EarnProvider>
  );

  it('provides vault address through context', () => {
    const { result } = renderHook(() => useEarnContext(), { wrapper });

    expect(result.current.vaultAddress).toBe('0x123');
  });

  it('throws error when useEarnContext is used outside of provider', () => {
    expect(() => renderHook(() => useEarnContext())).toThrow(
      'useEarnContext must be used within an EarnProvider',
    );
  });
});
