import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { coinbaseWalletSvg } from '../../svg/coinbaseWalletSvg';
import { QrCodeSvg } from './QrCodeSvg';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(() => 'default'),
}));

describe('QRCodeSVG', () => {
  it('renders nothing when no value is provided', () => {
    render(<QrCodeSvg value="" />);
    expect(screen.queryByTitle('QR Code')).toBeNull();
  });

  it('renders SVG with default props', () => {
    render(<QrCodeSvg value="test" />);

    const svg = screen.getByTitle('QR Code');

    expect(svg).toBeInTheDocument();
  });

  it('renders with logo', () => {
    render(<QrCodeSvg value="test" logo={coinbaseWalletSvg} />);

    expect(screen.getByTestId('qr-code-logo')).toBeInTheDocument();
  });

  it('renders with linear gradient', () => {
    render(<QrCodeSvg value="test" gradientType="linear" />);

    expect(screen.queryByTestId('linearGrad')).toBeInTheDocument();
    expect(screen.queryByTestId('radialGrad')).toBeNull();
  });

  it('renders with radial gradient', () => {
    render(<QrCodeSvg value="test" gradientType="radial" />);

    expect(screen.queryByTestId('radialGrad')).toBeInTheDocument();
    expect(screen.queryByTestId('linearGrad')).not.toBeInTheDocument();
  });
});
