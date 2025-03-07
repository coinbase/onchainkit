import {
  FundCard,
  FundCardAmountInput,
  FundCardAmountInputTypeSwitch,
  FundCardPaymentMethodDropdown,
  FundCardPresetAmountInputList,
  FundCardSubmitButton,
} from '@/fund';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SendFundWallet } from './SendFundWallet';

vi.mock('@/fund/components/FundCard');
vi.mock('@/fund/components/FundCardAmountInput');
vi.mock('@/fund/components/FundCardAmountInputTypeSwitch');
vi.mock('@/fund/components/FundCardPaymentMethodDropdown');
vi.mock('@/fund/components/FundCardPresetAmountInputList');
vi.mock('@/fund/components/FundCardSubmitButton');

describe('SendFundWallet', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    onError: vi.fn(),
    onStatus: vi.fn(),
    onSuccess: vi.fn(),
    classNames: {
      container: 'test-class',
      subtitle: 'test-subtitle-class',
      fundCard: 'test-fund-card-class',
    },
  };

  it('renders with correct base structure', () => {
    const { container } = render(<SendFundWallet {...defaultProps} />);
    expect(screen.getByTestId('ockSendFundWallet')).toBeInTheDocument();
    expect(container.firstChild).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'justify-between',
      defaultProps.classNames.container,
    );
  });

  it('passes correct props to FundCard', () => {
    render(<SendFundWallet {...defaultProps} />);
    expect(FundCard).toHaveBeenCalledWith(
      {
        assetSymbol: 'ETH',
        country: 'US',
        currency: 'USD',
        presetAmountInputs: ['2', '5', '10'],
        onError: defaultProps.onError,
        onStatus: defaultProps.onStatus,
        onSuccess: defaultProps.onSuccess,
        className: expect.stringContaining(defaultProps.classNames.fundCard),
        children: [
          expect.any(Object), // FundCardAmountInput
          expect.any(Object), // FundCardAmountInputTypeSwitch
          expect.any(Object), // FundCardPresetAmountInputList
          expect.any(Object), // FundCardPaymentMethodDropdown
          expect.any(Object), // FundCardSubmitButton
        ],
      },
      {},
    );
  });

  it('renders all child components in correct order', () => {
    render(<SendFundWallet {...defaultProps} />);
    const fundCardCall = vi.mocked(FundCard).mock.calls[0][0];
    const children = fundCardCall.children as React.ReactElement[];

    expect(children).toHaveLength(5);
    expect(children?.[0].type).toBe(FundCardAmountInput);
    expect(children?.[1].type).toBe(FundCardAmountInputTypeSwitch);
    expect(children?.[2].type).toBe(FundCardPresetAmountInputList);
    expect(children?.[3].type).toBe(FundCardPaymentMethodDropdown);
    expect(children?.[4].type).toBe(FundCardSubmitButton);
  });

  it('applies correct className to subtitle', () => {
    const { container } = render(<SendFundWallet {...defaultProps} />);
    const subtitle = container.querySelector(
      `.${defaultProps.classNames.subtitle}`,
    );
    expect(subtitle).toBeInTheDocument();
    expect(subtitle).toHaveTextContent(
      'Insufficient ETH balance to send transaction. Fund your wallet to continue.',
    );
  });
});
