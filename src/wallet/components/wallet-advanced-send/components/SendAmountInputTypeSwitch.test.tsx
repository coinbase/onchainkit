import { Skeleton } from '@/internal/components/Skeleton';
import { AmountInputTypeSwitch } from '@/internal/components/amount-input/AmountInputTypeSwitch';
import { render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendAmountInputTypeSwitch } from './SendAmountInputTypeSwitch';

vi.mock('@/internal/components/Skeleton');
vi.mock('@/internal/components/amount-input/AmountInputTypeSwitch');

const mockToken = {
  symbol: 'ETH',
  address: '' as const,
  chainId: 8453,
  decimals: 18,
  image: null,
  name: 'Base',
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

  it('shows error message when exchange rate is invalid', () => {
    const { container } = render(
      <SendAmountInputTypeSwitch {...defaultProps} exchangeRate={0} />,
    );
    expect(container).toHaveTextContent('Exchange rate unavailable');
    expect(AmountInputTypeSwitch).not.toHaveBeenCalled();
  });

  it('shows skeleton when exchange rate is loading', () => {
    render(
      <SendAmountInputTypeSwitch
        {...defaultProps}
        exchangeRateLoading={true}
      />,
    );
    expect(Skeleton).toHaveBeenCalled();
  });

  it('passes correct props to AmountInput', () => {
    render(<SendAmountInputTypeSwitch {...defaultProps} />);
    expect(AmountInputTypeSwitch).toHaveBeenCalledWith(
      {
        asset: defaultProps.selectedToken.symbol,
        fiatAmount: defaultProps.fiatAmount,
        cryptoAmount: defaultProps.cryptoAmount,
        exchangeRate: defaultProps.exchangeRate,
        exchangeRateLoading: false,
        currency: 'USD',
        selectedInputType: defaultProps.selectedInputType,
        setSelectedInputType: defaultProps.setSelectedInputType,
      },
      {},
    );
  });

  it('handles null/undefined values correctly', () => {
    render(
      <SendAmountInputTypeSwitch
        {...defaultProps}
        selectedToken={null}
        fiatAmount={null}
        cryptoAmount={null}
      />,
    );

    expect(AmountInputTypeSwitch).toHaveBeenCalledWith(
      {
        asset: '',
        fiatAmount: '',
        cryptoAmount: '',
        exchangeRate: defaultProps.exchangeRate,
        exchangeRateLoading: defaultProps.exchangeRateLoading,
        currency: 'USD',
        selectedInputType: defaultProps.selectedInputType,
        setSelectedInputType: defaultProps.setSelectedInputType,
      },
      {},
    );
  });
});
