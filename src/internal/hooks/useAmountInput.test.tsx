import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAmountInput } from './useAmountInput';

describe('useAmountInput', () => {
  const defaultProps = {
    setFiatAmount: vi.fn(),
    setCryptoAmount: vi.fn(),
    selectedInputType: 'fiat' as const,
    exchangeRate: '2',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('handleFiatChange', () => {
    it('should handle fiat input and calculate crypto amount', () => {
      const { result } = renderHook(() => useAmountInput(defaultProps));

      act(() => {
        result.current.handleFiatChange('100.456');
      });

      expect(defaultProps.setFiatAmount).toHaveBeenCalledWith('100.45');
      expect(defaultProps.setCryptoAmount).toHaveBeenCalledWith('200.9');
    });

    it('should set empty crypto amount when fiat is zero', () => {
      const { result } = renderHook(() => useAmountInput(defaultProps));

      act(() => {
        result.current.handleFiatChange('0');
      });

      expect(defaultProps.setCryptoAmount).toHaveBeenCalledWith('');
    });
  });

  describe('handleCryptoChange', () => {
    it('should handle crypto input and calculate fiat amount', () => {
      const { result } = renderHook(() => useAmountInput(defaultProps));

      act(() => {
        result.current.handleCryptoChange('200.12345678');
      });

      expect(defaultProps.setCryptoAmount).toHaveBeenCalledWith('200.12345678');
      expect(defaultProps.setFiatAmount).toHaveBeenCalledWith('100.06');
    });

    it('should set empty fiat amount when crypto calculation is zero', () => {
      const { result } = renderHook(() => useAmountInput(defaultProps));

      act(() => {
        result.current.handleCryptoChange('0');
      });

      expect(defaultProps.setFiatAmount).toHaveBeenCalledWith('');
    });
  });

  describe('handleChange', () => {
    it('should call handleFiatChange when selectedInputType is fiat', () => {
      const { result } = renderHook(() => useAmountInput(defaultProps));
      const onChange = vi.fn();

      act(() => {
        result.current.handleChange('100', onChange);
      });

      expect(defaultProps.setFiatAmount).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith('100');
    });

    it('should call handleCryptoChange when selectedInputType is crypto', () => {
      const { result } = renderHook(() =>
        useAmountInput({
          ...defaultProps,
          selectedInputType: 'crypto',
        }),
      );
      const onChange = vi.fn();

      act(() => {
        result.current.handleChange('100', onChange);
      });

      expect(defaultProps.setCryptoAmount).toHaveBeenCalled();
      expect(onChange).toHaveBeenCalledWith('100');
    });

    it('should work without optional onChange callback', () => {
      const { result } = renderHook(() => useAmountInput(defaultProps));

      act(() => {
        result.current.handleChange('100');
      });

      expect(defaultProps.setFiatAmount).toHaveBeenCalled();
    });
  });
});
