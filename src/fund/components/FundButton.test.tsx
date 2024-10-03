import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { type Mock, afterEach, describe, expect, it, vi } from 'vitest';
import { openPopup } from '../../internal/utils/openPopup';
import { useGetFundingUrl } from '../hooks/useGetFundingUrl';
import { getFundingPopupSize } from '../utils/getFundingPopupSize';
import { FundButton } from './FundButton';

vi.mock('../hooks/useGetFundingUrl', () => ({
  useGetFundingUrl: vi.fn(),
}));

vi.mock('../utils/getFundingPopupSize', () => ({
  getFundingPopupSize: vi.fn(),
}));

vi.mock('../../internal/utils/openPopup', () => ({
  openPopup: vi.fn(),
}));

vi.mock('../../useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('WalletDropdownFundLink', () => {
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
});
