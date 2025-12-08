import '@testing-library/jest-dom';
import { useGetFundingUrl } from '@/fund/hooks/useGetFundingUrl';
import { getFundingPopupSize } from '@/fund/utils/getFundingPopupSize';
import { openPopup } from '@/internal/utils/openPopup';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { WalletDropdownFundLink } from './WalletDropdownFundLink';

vi.mock('@/fund/hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('@/fund/utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('@/internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

describe('WalletDropdownFundLink', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the fund link button with the fundingUrl prop when it is defined', () => {
    const fundingUrl = 'https://props.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<WalletDropdownFundLink fundingUrl={fundingUrl} />);

    expect(useGetFundingUrl).not.toHaveBeenCalled();
    const buttonElement = screen.getByRole('button');
    expect(screen.getByText('Fund wallet')).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(getFundingPopupSize as Mock).toHaveBeenCalledWith('md', fundingUrl);
    expect(openPopup as Mock).toHaveBeenCalledWith({
      url: fundingUrl,
      height,
      width,
      target: undefined,
    });
  });

  it('renders the fund link button with the default fundingUrl when the fundingUrl prop is undefined', () => {
    const fundingUrl = 'https://default.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (useGetFundingUrl as Mock).mockReturnValue(fundingUrl);
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<WalletDropdownFundLink />);

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

  it('renders a disabled fund link button when no funding URL is provided and the default cannot be fetched', () => {
    (useGetFundingUrl as Mock).mockReturnValue(undefined);

    render(<WalletDropdownFundLink />);

    expect(useGetFundingUrl).toHaveBeenCalled();
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveClass('pointer-events-none');

    fireEvent.click(buttonElement);
    expect(openPopup as Mock).not.toHaveBeenCalled();
  });

  it('renders the fund link as a link when the openIn prop is set to tab', () => {
    const fundingUrl = 'https://props.funding.url';
    const { height, width } = { height: 200, width: 100 };
    (getFundingPopupSize as Mock).mockReturnValue({ height, width });

    render(<WalletDropdownFundLink fundingUrl={fundingUrl} openIn="tab" />);

    expect(useGetFundingUrl).not.toHaveBeenCalled();
    const linkElement = screen.getByRole('link');
    expect(screen.getByText('Fund wallet')).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', fundingUrl);
  });
});
