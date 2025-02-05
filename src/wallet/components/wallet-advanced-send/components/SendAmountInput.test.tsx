import { AmountInput } from '@/internal/components/amount-input/AmountInput';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendAmountInput } from './SendAmountInput';
import { SendAmountInputTypeSwitch } from './SendAmountInputTypeSwitch';

vi.mock('@/internal/components/amount-input/AmountInput');
vi.mock('./SendAmountInputTypeSwitch');

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

describe('SendAmountInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
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

  it('passes correct props to AmountInput', () => {
    render(<SendAmountInput {...defaultProps} />);
    expect(AmountInput).toHaveBeenCalledWith(
      {
        fiatAmount: defaultProps.fiatAmount,
        cryptoAmount: defaultProps.cryptoAmount,
        asset: defaultProps.selectedToken.symbol,
        currency: 'USD',
        selectedInputType: defaultProps.selectedInputType,
        setFiatAmount: defaultProps.handleFiatAmountChange,
        setCryptoAmount: defaultProps.handleCryptoAmountChange,
        exchangeRate: '2000',
        className: 'test-class',
        textClassName: 'test-text-class',
      },
      {},
    );
  });

  it('passes correct props to SendAmountInputTypeSwitch', () => {
    render(<SendAmountInput {...defaultProps} />);
    expect(SendAmountInputTypeSwitch).toHaveBeenCalledWith(
      {
        selectedToken: defaultProps.selectedToken,
        fiatAmount: defaultProps.fiatAmount,
        cryptoAmount: defaultProps.cryptoAmount,
        selectedInputType: defaultProps.selectedInputType,
        setSelectedInputType: defaultProps.setSelectedInputType,
        exchangeRate: defaultProps.exchangeRate,
        exchangeRateLoading: defaultProps.exchangeRateLoading,
      },
      {},
    );
  });

  it('handles null/undefined values correctly', () => {
    render(
      <SendAmountInput
        {...defaultProps}
        selectedToken={null}
        fiatAmount={null}
        cryptoAmount={null}
      />,
    );

    expect(AmountInput).toHaveBeenCalledWith(
      {
        fiatAmount: '',
        cryptoAmount: '',
        asset: '',
        currency: 'USD',
        selectedInputType: 'crypto',
        setFiatAmount: defaultProps.handleFiatAmountChange,
        setCryptoAmount: defaultProps.handleCryptoAmountChange,
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
        selectedInputType: defaultProps.selectedInputType,
        setSelectedInputType: defaultProps.setSelectedInputType,
        exchangeRate: defaultProps.exchangeRate,
        exchangeRateLoading: defaultProps.exchangeRateLoading,
      },
      {},
    );
  });
});
