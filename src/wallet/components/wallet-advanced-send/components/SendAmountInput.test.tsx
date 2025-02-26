import { AmountInput } from '@/internal/components/amount-input/AmountInput';
import { render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { SendAmountInput } from './SendAmountInput';
import { SendAmountInputTypeSwitch } from './SendAmountInputTypeSwitch';
import { useSendContext } from './SendProvider';

vi.mock('@/internal/components/amount-input/AmountInput');
vi.mock('./SendAmountInputTypeSwitch');
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
  handleCryptoAmountChange: vi.fn(),
  fiatAmount: '2000',
  handleFiatAmountChange: vi.fn(),
  selectedInputType: 'crypto' as const,
  setSelectedInputType: vi.fn(),
  exchangeRate: 2000,
  exchangeRateLoading: false,
  className: 'test-class',
  textClassName: 'test-text-class',
};

describe('SendAmountInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useSendContext as Mock).mockReturnValue(defaultContext);
  });

  it('passes correct props to AmountInput', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
    });

    render(<SendAmountInput />);
    expect(AmountInput).toHaveBeenCalledWith(
      {
        fiatAmount: defaultContext.fiatAmount,
        cryptoAmount: defaultContext.cryptoAmount,
        asset: defaultContext.selectedToken.symbol,
        currency: 'USD',
        selectedInputType: defaultContext.selectedInputType,
        setFiatAmount: defaultContext.handleFiatAmountChange,
        setCryptoAmount: defaultContext.handleCryptoAmountChange,
        exchangeRate: '2000',
        className: 'test-class',
        textClassName: 'test-text-class',
      },
      {},
    );
  });

  it('passes correct props to SendAmountInputTypeSwitch', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
    });

    render(<SendAmountInput />);
    expect(SendAmountInputTypeSwitch).toHaveBeenCalledWith(
      {
        selectedToken: defaultContext.selectedToken,
        fiatAmount: defaultContext.fiatAmount,
        cryptoAmount: defaultContext.cryptoAmount,
        selectedInputType: defaultContext.selectedInputType,
        setSelectedInputType: defaultContext.setSelectedInputType,
        exchangeRate: defaultContext.exchangeRate,
        exchangeRateLoading: defaultContext.exchangeRateLoading,
      },
      {},
    );
  });

  it('handles null/undefined values correctly', () => {
    (useSendContext as Mock).mockReturnValue({
      ...defaultContext,
      selectedToken: null,
      fiatAmount: null,
      cryptoAmount: null,
    });

    render(<SendAmountInput />);
    expect(AmountInput).toHaveBeenCalledWith(
      {
        fiatAmount: '',
        cryptoAmount: '',
        asset: '',
        currency: 'USD',
        selectedInputType: 'crypto',
        setFiatAmount: defaultContext.handleFiatAmountChange,
        setCryptoAmount: defaultContext.handleCryptoAmountChange,
        exchangeRate: '2000',
        className: 'test-class',
        textClassName: 'test-text-class',
      },
      {},
    );

    expect(SendAmountInputTypeSwitch).toHaveBeenCalledWith(
      {
        selectedToken: null,
        fiatAmount: '',
        cryptoAmount: '',
        selectedInputType: defaultContext.selectedInputType,
        setSelectedInputType: defaultContext.setSelectedInputType,
        exchangeRate: defaultContext.exchangeRate,
        exchangeRateLoading: defaultContext.exchangeRateLoading,
      },
      {},
    );
  });
});
