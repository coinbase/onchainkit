import { getName } from '@/identity';
import { getSlicedAddress } from '@/identity/utils/getSlicedAddress';
import { renderHook, act, waitFor } from '@testing-library/react';
import { base } from 'viem/chains';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { validateAddressInput } from '../utils/validateAddressInput';
import { useRecipientState } from './useRecipientState';

vi.mock('@/identity', () => ({
  getName: vi.fn(),
}));

vi.mock('@/identity/utils/getSlicedAddress', () => ({
  getSlicedAddress: vi.fn(),
}));

vi.mock('../utils/validateAddressInput', () => ({
  validateAddressInput: vi.fn(),
}));

const mockAddress = '0x1234567890123456789012345678901234567890';
const mockSlicedAddress = '0x1234...7890';
const mockEnsName = 'test.eth';

describe('useRecipientState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useRecipientState());

    expect(result.current.recipientState).toEqual({
      phase: 'input',
      input: '',
      address: null,
      displayValue: null,
    });
    expect(result.current.deselectRecipient).toBeDefined();
    expect(result.current.updateRecipientInput).toBeDefined();
    expect(result.current.validateRecipientInput).toBeDefined();
    expect(result.current.selectRecipient).toBeDefined();
  });

  it('should update recipient input', () => {
    const { result } = renderHook(() => useRecipientState());

    act(() => {
      result.current.updateRecipientInput('test input');
    });

    expect(result.current.recipientState.input).toBe('test input');
  });

  it('should validate valid address input', async () => {
    vi.mocked(validateAddressInput).mockResolvedValue(
      mockAddress as `0x${string}`,
    );

    const { result } = renderHook(() => useRecipientState());

    act(() => {
      result.current.validateRecipientInput(mockAddress);
    });

    await waitFor(() => {
      expect(result.current.recipientState).toEqual({
        phase: 'validated',
        input: mockAddress,
        address: mockAddress,
        displayValue: null,
      });
    });
  });

  it('should handle invalid address input', async () => {
    vi.mocked(validateAddressInput).mockResolvedValue(null);

    const { result } = renderHook(() => useRecipientState());

    act(() => {
      result.current.validateRecipientInput('invalid');
    });

    await waitFor(() => {
      expect(result.current.recipientState).toEqual({
        phase: 'input',
        input: 'invalid',
        address: null,
        displayValue: null,
      });
    });
  });

  it('should select recipient and resolve ENS name', async () => {
    vi.mocked(getName).mockResolvedValue(mockEnsName);

    const { result } = renderHook(() => useRecipientState());

    await act(async () => {
      await result.current.selectRecipient({
        phase: 'selected',
        input: mockAddress,
        address: mockAddress,
        displayValue: null,
      });
    });

    await waitFor(() => {
      expect(getName).toHaveBeenCalledWith({
        address: mockAddress,
        chain: base,
      });
      expect(result.current.recipientState.displayValue).toBe(mockEnsName);
    });
  });

  it('should select recipient and fallback to sliced address when ENS fails', async () => {
    vi.mocked(getName).mockRejectedValue(new Error('ENS error'));
    vi.mocked(getSlicedAddress).mockReturnValue(mockSlicedAddress);

    const { result } = renderHook(() => useRecipientState());

    act(() => {
      result.current.selectRecipient({
        phase: 'selected',
        input: mockAddress,
        address: mockAddress,
        displayValue: null,
      });
    });

    await waitFor(() => {
      expect(getName).toHaveBeenCalledWith({
        address: mockAddress,
        chain: base,
      });
    });

    expect(result.current.recipientState).toEqual({
      phase: 'selected',
      input: mockAddress,
      address: mockAddress,
      displayValue: mockSlicedAddress,
    });
  });

  it('should select recipient and use sliced address when ENS returns null', async () => {
    vi.mocked(getName).mockResolvedValue(null);
    vi.mocked(getSlicedAddress).mockReturnValue(mockSlicedAddress);

    const { result } = renderHook(() => useRecipientState());

    act(() => {
      result.current.selectRecipient({
        phase: 'selected',
        input: mockAddress,
        address: mockAddress,
        displayValue: null,
      });
    });

    await waitFor(() => {
      expect(getName).toHaveBeenCalledWith({
        address: mockAddress,
        chain: base,
      });
    });

    expect(result.current.recipientState).toEqual({
      phase: 'selected',
      input: mockAddress,
      address: mockAddress,
      displayValue: mockSlicedAddress,
    });
  });

  it('should deselect recipient from selected phase', () => {
    const { result } = renderHook(() => useRecipientState());

    act(() => {
      result.current.selectRecipient({
        phase: 'selected',
        input: mockAddress,
        address: mockAddress,
        displayValue: mockEnsName,
      });
    });

    act(() => {
      result.current.deselectRecipient();
    });

    expect(result.current.recipientState).toEqual({
      phase: 'validated',
      input: mockAddress,
      address: mockAddress,
      displayValue: null,
    });
  });

  it('should deselect recipient from non-selected phase', () => {
    const { result } = renderHook(() => useRecipientState());

    act(() => {
      result.current.validateRecipientInput(mockAddress);
    });

    act(() => {
      result.current.deselectRecipient();
    });

    expect(result.current.recipientState.displayValue).toBeNull();
  });
});
