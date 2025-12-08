import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import type { GetSwapQuoteResponse } from '../../api/types';
import type { SwapUnit } from '../../swap/types';
import { isSwapError } from '../../swap/utils/isSwapError';
import { validateQuote } from './validateQuote';

vi.mock('../../swap/utils/isSwapError', () => ({
  isSwapError: vi.fn(),
}));

describe('validateQuote', () => {
  const mockUpdateLifecycleStatus = vi.fn();
  const mockSetAmountUSD = vi.fn();
  const to = { setAmountUSD: mockSetAmountUSD } as unknown as SwapUnit;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should set toAmountUSD from responseETH if valid', () => {
    const responseETH = { toAmountUSD: 100 } as unknown as GetSwapQuoteResponse;
    const responseUSDC = undefined;
    const responseFrom = undefined;

    (isSwapError as unknown as Mock).mockReturnValue(false);

    const result = validateQuote({
      to,
      responseETH,
      responseUSDC,
      responseFrom,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    expect(mockSetAmountUSD).toHaveBeenCalledWith(100);
    expect(mockUpdateLifecycleStatus).not.toHaveBeenCalled();
    expect(result).toEqual({ isValid: true });
  });

  it('should set toAmountUSD from responseUSDC if responseETH is invalid', () => {
    const responseETH = {
      toAmountUSD: undefined,
    } as unknown as GetSwapQuoteResponse;
    const responseUSDC = {
      toAmountUSD: 200,
    } as unknown as GetSwapQuoteResponse;
    const responseFrom = undefined;

    (isSwapError as unknown as Mock).mockReturnValue(false);

    const result = validateQuote({
      to,
      responseETH,
      responseUSDC,
      responseFrom,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    expect(mockSetAmountUSD).toHaveBeenCalledWith(200);
    expect(mockUpdateLifecycleStatus).not.toHaveBeenCalled();
    expect(result).toEqual({ isValid: true });
  });

  it('should set toAmountUSD from responseFrom if responseETH and responseUSDC are invalid', () => {
    const responseETH = {
      toAmountUSD: undefined,
    } as unknown as GetSwapQuoteResponse;
    const responseUSDC = {
      toAmountUSD: undefined,
    } as unknown as GetSwapQuoteResponse;
    const responseFrom = {
      toAmountUSD: 300,
    } as unknown as GetSwapQuoteResponse;

    (isSwapError as unknown as Mock).mockReturnValue(false);

    const result = validateQuote({
      to,
      responseETH,
      responseUSDC,
      responseFrom,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    expect(mockSetAmountUSD).toHaveBeenCalledWith(300);
    expect(mockUpdateLifecycleStatus).not.toHaveBeenCalled();
    expect(result).toEqual({ isValid: true });
  });

  it('should call updateLifecycleStatus with error if all responses are invalid', () => {
    const responseETH = {
      toAmountUSD: undefined,
    } as unknown as GetSwapQuoteResponse;
    const responseUSDC = {
      toAmountUSD: undefined,
    } as unknown as GetSwapQuoteResponse;
    const responseFrom = {
      toAmountUSD: undefined,
    } as unknown as GetSwapQuoteResponse;

    (isSwapError as unknown as Mock).mockReturnValue(false);

    const result = validateQuote({
      to,
      responseETH,
      responseUSDC,
      responseFrom,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: {
        code: 'TmBPc01',
        error: 'No valid quote found',
        message: '',
      },
    });
    expect(mockSetAmountUSD).not.toHaveBeenCalled();
    expect(result).toEqual({ isValid: false });
  });

  it('should handle swap error cases correctly', () => {
    const responseETH = { toAmountUSD: 100 } as unknown as GetSwapQuoteResponse;
    const responseUSDC = {
      toAmountUSD: 200,
    } as unknown as GetSwapQuoteResponse;
    const responseFrom = {
      toAmountUSD: 300,
    } as unknown as GetSwapQuoteResponse;

    (isSwapError as unknown as Mock).mockReturnValue(true);

    const result = validateQuote({
      to,
      responseETH,
      responseUSDC,
      responseFrom,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    expect(mockSetAmountUSD).not.toHaveBeenCalled();
    expect(mockUpdateLifecycleStatus).toHaveBeenCalled();
    expect(result).toEqual({ isValid: false });
  });
});
