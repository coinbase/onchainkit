import { Skeleton } from '@/internal/components/Skeleton';
import { AmountInputTypeSwitch } from '@/internal/components/amount-input/AmountInputTypeSwitch';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { SendAmountInputTypeSwitch } from './SendAmountInputTypeSwitch';
import { useSendContext } from './SendProvider';

vi.mock('@/internal/components/Skeleton');
vi.mock('@/internal/components/amount-input/AmountInputTypeSwitch');
vi.mock('./SendProvider', () => ({
  useSendContext: vi.fn(),
}));

const mockToken = {
  symbol: 'ETH',
  address: '' as const,
  chainId: 8453,
  decimals: 18,
  image: null,
  name: 'Ethereum',
  cryptoBalance: 1,
  fiatBalance: 3300,
};

const defaultContext = {
  selectedToken: mockToken,
  cryptoAmount: '1.0',
  fiatAmount: '2000',
  selectedInputType: 'crypto' as const,
  setSelectedInputType: vi.fn(),
  exchangeRate: 2000,
  exchangeRateLoading: false,
};

describe('SendAmountInputTypeSwitch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSendContext as Mock).mockReturnValue(defaultContext);
  });

  it('passes an error state when exchange rate is invalid', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
      exchangeRate: 0,
    });

    render(<SendAmountInputTypeSwitch />);
    expect(AmountInputTypeSwitch).toHaveBeenCalledWith(
      expect.objectContaining({
        loadingDisplay: <div>test-loading-display</div>,
        exchangeRate: 0,
      }),
      {},
    );
  });

  it('shows skeleton when exchange rate is loading', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
      exchangeRateLoading: true,
    });

    render(<SendAmountInputTypeSwitch />);
    expect(Skeleton).toHaveBeenCalled();
  });

  it('passes correct props to AmountInput', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
      className: 'test-class',
      loadingDisplay: <div>test-loading-display</div>,
    });

    render(<SendAmountInputTypeSwitch />);
    expect(AmountInputTypeSwitch).toHaveBeenCalledWith(
      {
        asset: defaultContext.selectedToken.symbol,
        fiatAmount: defaultContext.fiatAmount,
        cryptoAmount: defaultContext.cryptoAmount,
        exchangeRate: defaultContext.exchangeRate,
        exchangeRateLoading: defaultContext.exchangeRateLoading,
        currency: 'USD',
        selectedInputType: defaultContext.selectedInputType,
        setSelectedInputType: defaultContext.setSelectedInputType,
        className: 'test-class',
        loadingDisplay: <div>test-loading-display</div>,
      },
      {},
    );
  });

  it('handles null/undefined values correctly', () => {
    (useSendContext as Mock).mockReturnValue({
      selectedToken: null,
      fiatAmount: null,
      cryptoAmount: null,
      exchangeRate: 3300,
      exchangeRateLoading: false,
      selectedInputType: 'fiat',
      setSelectedInputType: vi.fn(),
    });

    render(<SendAmountInputTypeSwitch />);

    expect(AmountInputTypeSwitch).toHaveBeenCalledWith(
      {
        asset: '',
        fiatAmount: '',
        cryptoAmount: '',
        exchangeRate: 3300,
        exchangeRateLoading: false,
        currency: 'USD',
        selectedInputType: 'fiat',
        setSelectedInputType: vi.fn(),
        className: '',
      },
      {},
    );
  });
});
