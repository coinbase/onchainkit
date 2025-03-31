import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useConnectModal } from './useConnectModal';

describe('useConnectModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return the correct values on initial render', () => {
    const { result } = renderHook(() => useConnectModal());
    expect(result.current.isOpen).toBe(false);
    expect(result.current.openConnectModal).toBeInstanceOf(Function);
    expect(result.current.closeConnectModal).toBeInstanceOf(Function);
  });

  it('should update isOpen state when openConnectModal is called', () => {
    const { result } = renderHook(() => useConnectModal());
    expect(result.current.isOpen).toBe(false);
    act(() => {
      result.current.openConnectModal();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('should update isOpen state when closeConnectModal is called', () => {
    const { result } = renderHook(() => useConnectModal());
    act(() => {
      result.current.openConnectModal();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.closeConnectModal();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
