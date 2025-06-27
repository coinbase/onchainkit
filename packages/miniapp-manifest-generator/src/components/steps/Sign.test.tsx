import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sign } from './Sign';
import { useAccount } from 'wagmi';
import { useFid } from '../../hooks/useFid';
import { useSignManifest } from '../../hooks/useSignManifest';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

vi.mock('../../hooks/useFid', () => ({
  useFid: vi.fn(),
}));

vi.mock('../../hooks/useSignManifest', () => ({
  useSignManifest: vi.fn(),
}));

describe('Sign', () => {
  const mockHandleSigned = vi.fn();
  const mockGenerateAccountAssociation = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
    (useFid as Mock).mockReturnValue(123);
    (useSignManifest as Mock).mockReturnValue({
      isPending: false,
      error: null,
      generateAccountAssociation: mockGenerateAccountAssociation,
    });
  });

  it('should render', () => {
    render(
      <Sign domain="https://example.com" handleSigned={mockHandleSigned} />,
    );

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(
      screen.getByText('Sign to generate and save your Mini-App manifest'),
    ).toBeInTheDocument();
    expect(screen.getByText('Your FID is 123')).toBeInTheDocument();
    expect(screen.getByText('Sign')).toBeInTheDocument();
    expect(screen.getByText('Sign')).not.toBeDisabled();
  });

  it('should render disabled when wallet is not connected', () => {
    (useAccount as Mock).mockReturnValue({ address: null });

    render(
      <Sign domain="https://example.com" handleSigned={mockHandleSigned} />,
    );

    expect(screen.getByTestId('manifestStep')).toHaveClass('opacity-50');
    expect(screen.getByText('Sign')).toBeDisabled();
  });

  it('should render disabled when domain is not set', () => {
    render(<Sign domain="" handleSigned={mockHandleSigned} />);

    expect(screen.getByTestId('manifestStep')).toHaveClass('opacity-50');
    expect(screen.getByText('Sign')).toBeDisabled();
  });

  it('should render disabled when FID is 0', () => {
    (useFid as Mock).mockReturnValue(0);

    render(
      <Sign domain="https://example.com" handleSigned={mockHandleSigned} />,
    );

    expect(screen.getByTestId('manifestStep')).toHaveClass('opacity-50');
    expect(screen.getByText('Sign')).toBeDisabled();
    expect(
      screen.getByText(
        'There is no FID associated with this account, please connect with your Farcaster custody account.',
      ),
    ).toBeInTheDocument();
  });

  it('should show loading state when signing', () => {
    (useSignManifest as Mock).mockReturnValue({
      isPending: true,
      error: null,
      generateAccountAssociation: mockGenerateAccountAssociation,
    });

    render(
      <Sign domain="https://example.com" handleSigned={mockHandleSigned} />,
    );

    expect(screen.getByText('Signing...')).toBeInTheDocument();
  });

  it('should show error message when signing fails', () => {
    const error = new Error('Test error\nLine 2');
    (useSignManifest as Mock).mockReturnValue({
      isPending: false,
      error,
      generateAccountAssociation: mockGenerateAccountAssociation,
    });

    render(
      <Sign domain="https://example.com" handleSigned={mockHandleSigned} />,
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();
    expect(screen.getByText('Line 2')).toBeInTheDocument();
  });

  it('should call generateAccountAssociation when sign button is clicked', () => {
    render(
      <Sign domain="https://example.com" handleSigned={mockHandleSigned} />,
    );

    fireEvent.click(screen.getByText('Sign'));
    expect(mockGenerateAccountAssociation).toHaveBeenCalled();
  });
});
