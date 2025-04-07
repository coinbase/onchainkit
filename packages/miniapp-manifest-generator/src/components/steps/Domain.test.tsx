import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach, Mock, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Domain } from './Domain';
import { useAccount } from 'wagmi';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

describe('Domain', () => {
  const mockHandleSetDomain = vi.fn();

  beforeEach(() => {
    (useAccount as Mock).mockReturnValue({ address: '0x123' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    render(<Domain handleSetDomain={mockHandleSetDomain} />);

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(
      screen.getByText('Enter the domain of your app'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter the domain')).not.toBeDisabled();
  });

  it('should render disabled when wallet is not connected', () => {
    (useAccount as Mock).mockReturnValue({ address: null });

    render(<Domain handleSetDomain={mockHandleSetDomain} />);

    expect(screen.getByTestId('manifestStep')).toHaveClass('opacity-50');
  });

  it('should handle input change', () => {
    render(<Domain handleSetDomain={mockHandleSetDomain} />);

    const input = screen.getByPlaceholderText('Enter the domain');
    fireEvent.change(input, { target: { value: 'https://example.com' } });

    expect(input).toHaveValue('https://example.com');
  });

  it('should not show error for empty domain', () => {
    render(<Domain handleSetDomain={mockHandleSetDomain} />);

    const input = screen.getByPlaceholderText('Enter the domain');
    fireEvent.blur(input);

    expect(
      screen.queryByText(
        'Please enter a valid domain, e.g. https://example.com',
      ),
    ).not.toBeInTheDocument();
  });

  it('should show error for invalid domain', () => {
    render(<Domain handleSetDomain={mockHandleSetDomain} />);

    const input = screen.getByPlaceholderText('Enter the domain');
    fireEvent.change(input, { target: { value: 'invalid' } });
    fireEvent.blur(input);

    expect(
      screen.getByText('Please enter a valid domain, e.g. https://example.com'),
    ).toBeInTheDocument();
    expect(mockHandleSetDomain).not.toHaveBeenCalled();
  });

  it('should show warning for http domain', () => {
    render(<Domain handleSetDomain={mockHandleSetDomain} />);

    const input = screen.getByPlaceholderText('Enter the domain');
    fireEvent.change(input, { target: { value: 'http://example.com' } });
    fireEvent.blur(input);

    expect(
      screen.getByText(/http domains are not valid for production/),
    ).toBeInTheDocument();
  });

  it('should call handleSetDomain with valid domain', () => {
    render(<Domain handleSetDomain={mockHandleSetDomain} />);

    const input = screen.getByPlaceholderText('Enter the domain');
    fireEvent.change(input, { target: { value: 'https://example.com' } });
    fireEvent.blur(input);

    expect(mockHandleSetDomain).toHaveBeenCalledWith('https://example.com');
  });
});
