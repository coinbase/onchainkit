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
    expect(result.current.setIsOpen).toBeInstanceOf(Function);
    expect(result.current.openConnectModal).toBeInstanceOf(Function);
    expect(result.current.closeConnectModal).toBeInstanceOf(Function);
    expect(result.current.toggleConnectModal).toBeInstanceOf(Function);
  });

  it('should set isOpen state to true when openConnectModal is called', () => {
    const { result } = renderHook(() => useConnectModal());
    expect(result.current.isOpen).toBe(false);
    act(() => {
      result.current.openConnectModal();
    });
    expect(result.current.isOpen).toBe(true);
  });

  it('should set isOpen state to false when closeConnectModal is called', () => {
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

  it('should toggle isOpen state when toggleConnectModal is called', () => {
    const { result } = renderHook(() => useConnectModal());
    expect(result.current.isOpen).toBe(false);
    act(() => {
      result.current.toggleConnectModal();
    });
    expect(result.current.isOpen).toBe(true);
    act(() => {
      result.current.toggleConnectModal();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should set isOpen state to false when setIsOpen is called with false', () => {
    const { result } = renderHook(() => useConnectModal());
    expect(result.current.isOpen).toBe(false);
    act(() => {
      result.current.setIsOpen(false);
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('should set isOpen state to true when setIsOpen is called with true', () => {
    const { result } = renderHook(() => useConnectModal());
    expect(result.current.isOpen).toBe(false);
    act(() => {
      result.current.setIsOpen(true);
    });
  });
});
