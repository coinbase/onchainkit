import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { version } from '../../version';
import type { WindowSizes } from '../types';
import { WalletDropdownFundLink } from './WalletDropdownFundLink';

const FUNDING_URL = `http://keys.coinbase.com/fund?dappName=&dappUrl=http://localhost:3000/&onchainkit=${version}`;

describe('WalletDropdownFundLink', () => {
  it('renders correctly with default props', () => {
    render(<WalletDropdownFundLink />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', FUNDING_URL);
    expect(screen.getByText('Fund wallet')).toBeInTheDocument();
  });

  it('renders correctly with custom icon element', () => {
    const customIcon = <svg aria-label="custom-icon" />;
    render(<WalletDropdownFundLink icon={customIcon} />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', FUNDING_URL);
    expect(screen.getByText('Fund wallet')).toBeInTheDocument();
    expect(screen.getByLabelText('custom-icon')).toBeInTheDocument();
  });

  it('renders correctly with custom text', () => {
    render(<WalletDropdownFundLink text="test" />);

    const linkElement = screen.getByRole('link');
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', FUNDING_URL);
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('opens a new window when clicked with type="window" (default size medium)', () => {
    // Mock window.open
    const mockOpen = vi.fn();
    vi.stubGlobal('open', mockOpen);

    // Mock window.screen
    vi.stubGlobal('screen', { width: 1024, height: 768 });

    render(<WalletDropdownFundLink openIn="popup" />);

    const linkElement = screen.getByText('Fund wallet');
    fireEvent.click(linkElement);

    // Check if window.open was called with the correct arguments
    expect(mockOpen).toHaveBeenCalledWith(
      expect.stringContaining('http://keys.coinbase.com/fund'),
      'Coinbase Fund Wallet',
      expect.stringContaining(
        'width=297,height=371,resizable,scrollbars=yes,status=1,left=364,top=199',
      ),
    );

    // Clean up
    vi.unstubAllGlobals();
  });

  const testCases: WindowSizes = {
    sm: { width: '23vw', height: '28.75vw' },
    md: { width: '29vw', height: '36.25vw' },
    lg: { width: '35vw', height: '43.75vw' },
  };

  const minWidth = 280;
  const minHeight = 350;

  for (const [size, { width, height }] of Object.entries(testCases)) {
    it(`opens a new window when clicked with type="window" and popupSize="${size}"`, () => {
      const mockOpen = vi.fn();
      const screenWidth = 1024;
      const screenHeight = 768;
      const innerWidth = 1024;
      const innerHeight = 768;

      vi.stubGlobal('open', mockOpen);
      vi.stubGlobal('screen', { width: screenWidth, height: screenHeight });

      render(
        <WalletDropdownFundLink
          openIn="popup"
          popupSize={size as keyof typeof testCases}
        />,
      );

      const linkElement = screen.getByText('Fund wallet');
      fireEvent.click(linkElement);

      const vwToPx = (vw: string) =>
        Math.round((Number.parseFloat(vw) / 100) * innerWidth);

      const expectedWidth = Math.max(minWidth, vwToPx(width));
      const expectedHeight = Math.max(minHeight, vwToPx(height));
      const adjustedHeight = Math.min(
        expectedHeight,
        Math.round(innerHeight * 0.9),
      );
      const expectedLeft = Math.round((screenWidth - expectedWidth) / 2);
      const expectedTop = Math.round((screenHeight - adjustedHeight) / 2);
      expect(mockOpen).toHaveBeenCalledWith(
        expect.stringContaining('http://keys.coinbase.com/fund'),
        'Coinbase Fund Wallet',
        expect.stringContaining(
          `width=${expectedWidth},height=${adjustedHeight},resizable,scrollbars=yes,status=1,left=${expectedLeft},top=${expectedTop}`,
        ),
      );

      vi.unstubAllGlobals();
      vi.clearAllMocks();
    });
  }
});
