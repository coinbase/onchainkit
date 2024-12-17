import '@testing-library/jest-dom';
import { openPopup } from '@/ui-react/internal/utils/openPopup';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { useGetFundingUrl } from '../hooks/useGetFundingUrl';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';
import { FundButton } from './FundButton';

vi.mock('../hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('../utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('@/ui-react/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../../core-react/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('FundButton', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the fund button with the fundingUrl prop when it is defined', () => {
    const fundingUrl = 'https://props.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<FundButton fundingUrl={fundingUrl} />);

    expect(useGetFundingUrl).not.toHaveBeenCalled();
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

  it('renders a disabled fund button when no funding URL is provided and the default cannot be fetched', () => {
    (useGetFundingUrl as Mock).mockReturnValue(undefined);

    render(<FundButton />);

    expect(useGetFundingUrl).toHaveBeenCalled();
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('pointer-events-none');

    fireEvent.click(buttonElement);
    expect(openPopup as Mock).not.toHaveBeenCalled();
  });

  it('renders the fund button as a link when the openIn prop is set to tab', () => {
    const fundingUrl = 'https://props.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<FundButton fundingUrl={fundingUrl} openIn="tab" />);

    expect(useGetFundingUrl).not.toHaveBeenCalled();
    const linkElement = screen.getByRole('link');
    expect(screen.getByText('Fund')).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', fundingUrl);
  });

  it('displays a spinner when in loading state', () => {
    render(<FundButton state="loading" />);
    expect(screen.getByTestId('ockSpinner')).toBeInTheDocument();
  });

  it('displays success text when in success state', () => {
    render(<FundButton state="success" />);
    expect(screen.getByTestId('fundButtonTextContent')).toHaveTextContent('Success');
  });

  it('displays error text when in error state', () => {
    render(<FundButton state="error" />);
    expect(screen.getByTestId('fundButtonTextContent')).toHaveTextContent('Something went wrong');
  });

  it('calls onPopupClose when the popup window is closed', () => {
    vi.useFakeTimers()
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
});