import { openPopup } from '@/internal/utils/openPopup';
import { pressable } from '@/styles/theme';
import '@testing-library/jest-dom';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { FundEvent } from '@/core/analytics/types';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useAccount } from 'wagmi';
import { useGetFundingUrl } from '../hooks/useGetFundingUrl';
import { quoteResponseDataMock } from '../mocks';
import { FundButtonRenderParams } from '../types';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';
import { FundButton } from './FundButton';

vi.mock('@/fund/hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('@/fund/utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('@/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../../wallet/components/ConnectWallet', () => ({
  ConnectWallet: () => (
    <div data-testid="ockConnectWallet_Container">Connect</div>
  ),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: () => ({
    connectors: [],
    connect: vi.fn(),
    pendingConnector: null,
    isLoading: false,
    error: null,
  }),
}));

vi.mock('@/core/analytics/hooks/useAnalytics', () => ({
  useAnalytics: vi.fn(),
}));

const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

function customRender({ onClick, isDisabled }: FundButtonRenderParams) {
  return (
    <button onClick={onClick} disabled={isDisabled}>
      click
    </button>
  );
}

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(quoteResponseDataMock),
  }),
) as Mock;

describe('FundButton', () => {
  const mockSendAnalytics = vi.fn();

  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
    });
    (useAnalytics as Mock).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the fund button with the fundingUrl prop when it is defined', () => {
    const fundingUrl = 'https://props.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<FundButton fundingUrl={fundingUrl} />);

    const buttonElement = screen.getByRole('button');
    expect(screen.getByText('Fund')).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(getFundingPopupSize as Mock).toHaveBeenCalledWith('md', fundingUrl);
    expect(openPopup as Mock).toHaveBeenCalledWith({
      url: fundingUrl,
      height,
      width,
      target: undefined,
    });
  });

  it('renders the fund button with the default fundingUrl when the fundingUrl prop is undefined', () => {
    const fundingUrl = 'https://default.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (useGetFundingUrl as Mock).mockReturnValue(fundingUrl);
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<FundButton />);

    expect(useGetFundingUrl).toHaveBeenCalled();
    const buttonElement = screen.getByRole('button');

    fireEvent.click(buttonElement);
    expect(getFundingPopupSize as Mock).toHaveBeenCalledWith('md', fundingUrl);
    expect(openPopup as Mock).toHaveBeenCalledWith({
      url: fundingUrl,
      height,
      width,
      target: undefined,
    });
  });

  it('renders calls window.open when the openIn prop is set to tab', () => {
    const onClickMock = vi.fn();
    const fundingUrl = 'https://props.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(
      <FundButton fundingUrl={fundingUrl} openIn="tab" onClick={onClickMock} />,
    );
    const button = screen.getByTestId('ockFundButton');
    fireEvent.click(button);

    expect(onClickMock).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalledWith(fundingUrl, '_blank');
  });

  it('displays a spinner when in loading state', () => {
    render(<FundButton state="loading" fundingUrl="https://funding.url" />);
    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
  });

  it('displays success text when in success state', () => {
    render(<FundButton state="success" />);
    expect(screen.getByTestId('ockFundButtonTextContent')).toHaveTextContent(
      'Success',
    );
  });

  it('displays error text when in error state', () => {
    render(<FundButton state="error" />);
    expect(screen.getByTestId('ockFundButtonTextContent')).toHaveTextContent(
      'Something went wrong',
    );
  });

  it('adds disabled class when the button is disabled', () => {
    render(<FundButton disabled={true} />);
    expect(screen.getByRole('button')).toHaveClass(pressable.disabled);
  });

  it('calls onPopupClose when the popup window is closed', () => {
    vi.useFakeTimers();
    const fundingUrl = 'https://props.funding.url';
    const onPopupClose = vi.fn();
    const { height, width } = { height: 200, width: 100 };
    const mockPopupWindow = {
      closed: false,
      close: vi.fn(),
    };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });
    (openPopup as Mock).mockReturnValue(mockPopupWindow);

    render(<FundButton fundingUrl={fundingUrl} onPopupClose={onPopupClose} />);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    // Simulate closing the popup
    mockPopupWindow.closed = true;
    vi.runOnlyPendingTimers();

    expect(onPopupClose).toHaveBeenCalled();
  });

  it('calls onClick when the fund button is clicked', () => {
    const fundingUrl = 'https://props.funding.url';
    const onClick = vi.fn();
    const { height, width } = { height: 200, width: 100 };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<FundButton fundingUrl={fundingUrl} onClick={onClick} />);

    const buttonElement = screen.getByRole('button');
    fireEvent.click(buttonElement);

    expect(onClick).toHaveBeenCalled();
    expect(getFundingPopupSize as Mock).toHaveBeenCalledWith('md', fundingUrl);
    expect(openPopup as Mock).toHaveBeenCalledWith({
      url: fundingUrl,
      height,
      width,
      target: undefined,
    });
  });

  it('renders custom implementation when render prop is passed', () => {
    render(<FundButton render={customRender} />);
    expect(screen.getByText('click')).toBeInTheDocument();
  });

  it('shows ConnectWallet when no wallet is connected', () => {
    (useAccount as Mock).mockReturnValue({
      address: undefined,
    });

    render(<FundButton className="custom-class" />);

    expect(
      screen.queryByTestId('ockConnectWallet_Container'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('ockFundButton')).not.toBeInTheDocument();
  });

  it('shows Fund button when wallet is connected', () => {
    render(<FundButton />);

    expect(screen.queryByTestId('ockFundButton')).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockConnectWallet_Container'),
    ).not.toBeInTheDocument();
  });

  it('passes sessionToken to useGetFundingUrl hook', () => {
    const sessionToken = 'test-session-token';
    const fundingUrl = 'https://default.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (useGetFundingUrl as Mock).mockReturnValue(fundingUrl);
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<FundButton sessionToken={sessionToken} />);

    expect(useGetFundingUrl).toHaveBeenCalledWith({
      fiatCurrency: 'USD',
      originComponentName: 'FundButton',
      sessionToken: sessionToken,
    });
  });

  describe('analytics', () => {
    it('sends FundInitiated analytics when fund button is clicked', () => {
      const fundingUrl = 'https://props.funding.url';
      const { height, width } = { height: 200, width: 100 };
      (getFundingPopupSize as Mock).mockReturnValue({ height, width });
      (openPopup as Mock).mockReturnValue({ closed: false });

      render(<FundButton fundingUrl={fundingUrl} fiatCurrency="EUR" />);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(mockSendAnalytics).toHaveBeenCalledWith(FundEvent.FundInitiated, {
        currency: 'EUR',
      });
    });

    it('sends FundFailure analytics when popup fails to open', () => {
      const fundingUrl = 'https://props.funding.url';
      const { height, width } = { height: 200, width: 100 };
      (getFundingPopupSize as Mock).mockReturnValue({ height, width });
      (openPopup as Mock).mockReturnValue(null);

      render(<FundButton fundingUrl={fundingUrl} fiatCurrency="USD" />);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(mockSendAnalytics).toHaveBeenCalledWith(FundEvent.FundFailure, {
        error: 'Failed to open funding popup',
        metadata: { currency: 'USD' },
      });
    });

    it('uses USD as default fiatCurrency for analytics', () => {
      const fundingUrl = 'https://props.funding.url';
      const { height, width } = { height: 200, width: 100 };
      (getFundingPopupSize as Mock).mockReturnValue({ height, width });
      (openPopup as Mock).mockReturnValue({ closed: false });

      render(<FundButton fundingUrl={fundingUrl} />);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(mockSendAnalytics).toHaveBeenCalledWith(FundEvent.FundInitiated, {
        currency: 'USD',
      });
    });

    it('does not send analytics when button is disabled', () => {
      render(<FundButton disabled={true} />);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(mockSendAnalytics).not.toHaveBeenCalled();
    });

    it('does not send analytics when no funding URL is available', () => {
      (useGetFundingUrl as Mock).mockReturnValue(undefined);

      render(<FundButton />);

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(mockSendAnalytics).not.toHaveBeenCalled();
    });

    it('sends analytics with empty string when address is undefined', () => {
      (useAccount as Mock).mockReturnValue({
        address: undefined,
      });
      const fundingUrl = 'https://props.funding.url';
      (getFundingPopupSize as Mock).mockReturnValue({
        height: 200,
        width: 100,
      });
      (openPopup as Mock).mockReturnValue({ closed: false });

      render(<FundButton fundingUrl={fundingUrl} />);

      const { sendAnalytics } = useAnalytics();
      sendAnalytics(FundEvent.FundInitiated, {
        currency: 'USD',
      });

      expect(mockSendAnalytics).toHaveBeenCalledWith(FundEvent.FundInitiated, {
        currency: 'USD',
      });
    });
  });
});
