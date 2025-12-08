import { setOnchainKitConfig } from '@/core/OnchainKitConfig';
import { openPopup } from '@/internal/utils/openPopup';
import '@testing-library/jest-dom';
import { act } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAccount } from 'wagmi';
import { useFundCardFundingUrl } from '../hooks/useFundCardFundingUrl';
import { optionsResponseDataMock, quoteResponseDataMock } from '../mocks';
import type { PresetAmountInputs } from '../types';
import { fetchOnrampOptions } from '../utils/fetchOnrampOptions';
import { fetchOnrampQuote } from '../utils/fetchOnrampQuote';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';
import { FundCard } from './FundCard';
import { useFundContext } from './FundCardProvider';

const mockUpdateInputWidth = vi.fn();
vi.mock('../../internal/hooks/useInputResize', () => ({
  useInputResize: () => mockUpdateInputWidth,
}));

vi.mock('../hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('../hooks/useFundCardFundingUrl', () => ({
  useFundCardFundingUrl: vi.fn(),
}));

vi.mock('@/core/hooks/useOnchainKit', () => ({
  useOnchainKit: () => ({
    apiKey: 'mock-api-key',
    sessionId: 'mock-session-id',
    config: {},
  }),
}));

vi.mock('@/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('../hooks/useFundCardSetupOnrampEventListeners');

vi.mock('../utils/fetchOnrampQuote');
vi.mock('../utils/fetchOnrampOptions');

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
}));

vi.mock('../../wallet/components/ConnectWallet', () => ({
  ConnectWallet: ({ className }: { className?: string }) => (
    <div data-testid="ockConnectWallet_Container" className={className}>
      Connect Wallet
    </div>
  ),
}));

// Probe component to read context provided by FundCard's internal provider
const ContextProbe = () => {
  const context = useFundContext();
  return (
    <div>
      <span data-testid="session-token-probe">{context.sessionToken}</span>
    </div>
  );
};

describe('FundCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setOnchainKitConfig({ apiKey: 'mock-api-key' });
    mockUpdateInputWidth.mockClear();
    (getFundingPopupSize as Mock).mockImplementation(() => ({
      height: 200,
      width: 100,
    }));
    (useFundCardFundingUrl as Mock).mockReturnValue('mock-funding-url');
    (fetchOnrampQuote as Mock).mockResolvedValue(quoteResponseDataMock);
    (fetchOnrampOptions as Mock).mockResolvedValue(optionsResponseDataMock);
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
  });

  it('throws when sessionToken is missing or empty', () => {
    expect(() =>
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken={undefined as unknown as string}
        />,
      ),
    ).toThrow('FundCard requires a sessionToken');
    expect(() =>
      render(<FundCard assetSymbol="BTC" country="US" sessionToken="" />),
    ).toThrow('FundCard requires a sessionToken');
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });
    expect(screen.getByTestId('ockFundCardHeader')).toBeInTheDocument();
    expect(screen.getByTestId('ockFundButtonTextContent')).toBeInTheDocument();
  });

  it('displays the correct header text', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });
    expect(screen.getByTestId('ockFundCardHeader')).toHaveTextContent(
      'Buy BTC',
    );
  });

  it('displays the correct button text', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });
    expect(screen.getByTestId('ockFundButtonTextContent')).toHaveTextContent(
      'Buy',
    );
  });

  it('handles input changes for fiat amount', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });

    const input = screen.getByTestId('ockTextInput_Input') as HTMLInputElement;

    await act(async () => {
      fireEvent.change(input, { target: { value: '100' } });
    });

    expect(input.value).toBe('100');
  });

  it('switches input type from fiat to crypto', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });

    const switchButton = screen.getByTestId('ockAmountTypeSwitch');
    fireEvent.click(switchButton);

    expect(screen.getByTestId('ockCurrencySpan')).toHaveTextContent('BTC');
  });

  it('disables the submit button by default (zero amount, fiat)', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });
    const button = screen.getByTestId('ockFundButton');
    expect(button).toBeDisabled();
  });

  it('disables the submit button when fund amount is zero and input type is crypto', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });
    const switchButton = screen.getByTestId('ockAmountTypeSwitch');
    fireEvent.click(switchButton);

    const button = screen.getByTestId('ockFundButton');
    expect(button).toBeDisabled();
  });

  it('enables the submit button when fund amount is greater than zero and type is fiat', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });
    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '1000' } });
    const button = screen.getByTestId('ockFundButton');
    expect(button).not.toBeDisabled();
  });

  it('enables the submit button when fund amount is greater than zero and type is crypto', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });
    const switchButton = screen.getByTestId('ockAmountTypeSwitch');
    fireEvent.click(switchButton);
    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '1000' } });
    const button = screen.getByTestId('ockFundButton');
    expect(button).not.toBeDisabled();
  });

  it('shows loading state when submitting', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });
    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '1000' } });
    const button = screen.getByTestId('ockFundButton');
    expect(screen.queryByTestId('ockSpinner')).not.toBeInTheDocument();
    act(() => {
      fireEvent.click(button);
    });
    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
  });

  it('sets submit button state to default on popup close', async () => {
    (openPopup as Mock).mockImplementation(() => ({ closed: true }));

    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
        />,
      );
    });

    const button = screen.getByTestId('ockFundButton');

    const input = screen.getByTestId('ockTextInput_Input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.click(button);
    // After popup close, state should reset, button should be enabled again
    expect(screen.getByTestId('ockFundButton')).not.toBeDisabled();
  });

  it('renders custom children instead of default children', async () => {
    await act(async () => {
      render(
        <FundCard
          assetSymbol="ETH"
          country="US"
          sessionToken="test-session-token"
        >
          <div data-testid="custom-child">Custom Content</div>
        </FundCard>,
      );
    });

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    expect(screen.queryByTestId('ockFundCardHeader')).not.toBeInTheDocument();
  });

  it('handles preset amount input click correctly', async () => {
    const presetAmountInputs: PresetAmountInputs = ['12345', '20', '30'];

    await act(async () => {
      render(
        <FundCard
          assetSymbol="BTC"
          country="US"
          sessionToken="test-session-token"
          presetAmountInputs={presetAmountInputs}
        />,
      );
    });

    // Click the preset amount input
    const presetAmountInput = screen.getByText('$12,345');
    expect(presetAmountInput).toBeInTheDocument();
    fireEvent.click(presetAmountInput);
    const input = screen.getByTestId('ockTextInput_Input') as HTMLInputElement;
    expect(input.value.replace(/,/g, '')).toBe('12345');
  });

  it('exposes sessionToken via context to children', async () => {
    const sessionToken = 'test-session-token';
    await act(async () => {
      render(
        <FundCard assetSymbol="ETH" country="US" sessionToken={sessionToken}>
          <ContextProbe />
        </FundCard>,
      );
    });

    expect(screen.getByTestId('session-token-probe').textContent).toBe(
      sessionToken,
    );
  });
});
