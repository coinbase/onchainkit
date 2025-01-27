import { openPopup } from '@/internal/utils/openPopup';
import { pressable } from '@/styles/theme';
import '@testing-library/jest-dom';
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

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/wallet/components/ConnectWallet', () => ({
  ConnectWallet: ({ className }: { className?: string }) => (
    <div data-testid="ockConnectWallet_Container" className={className}>
      Connect Wallet
    </div>
  ),
}));

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
  useConnect: vi.fn(),
}));

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(quoteResponseDataMock),
  }),
) as Mock;

describe('FundButton', () => {
  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({
      address: '0x123',
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

  it('renders the fund button as a link when the openIn prop is set to tab', () => {
    const fundingUrl = 'https://props.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<FundButton fundingUrl={fundingUrl} openIn="tab" />);

    const linkElement = screen.getByRole('link');
    expect(screen.getByText('Fund')).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', fundingUrl);
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

  it('icon is not shown when hideIcon is passed', () => {
    render(<FundButton hideIcon={true} />);
    expect(screen.queryByTestId('ockFundButtonIcon')).not.toBeInTheDocument();
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
    expect(screen.getByTestId('ockConnectWallet_Container')).toHaveClass(
      'custom-class',
    );
  });

  it('shows Fund button when wallet is connected', () => {
    render(<FundButton />);

    expect(screen.queryByTestId('ockFundButton')).toBeInTheDocument();
    expect(
      screen.queryByTestId('ockConnectWallet_Container'),
    ).not.toBeInTheDocument();
  });
});
