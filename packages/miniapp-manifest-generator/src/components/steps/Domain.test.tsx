import '@testing-library/jest-dom';
import { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Domain } from './Domain';
import { useAccount } from 'wagmi';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

describe('Domain', () => {
  const mockHandleSetDomain = vi.fn();
  const defaultProps = {
    description: 'Test description',
    handleSetDomain: mockHandleSetDomain,
  };

  beforeEach(() => {
    (useAccount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      address: '0x123',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    render(<Domain {...defaultProps} />);

    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter the domain')).toBeInTheDocument();
  });

  it('should disable the step when no wallet is connected', () => {
    (useAccount as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      address: undefined,
    });

    render(<Domain {...defaultProps} />);

    expect(screen.getByTestId('manifestStep')).toHaveClass('opacity-50');
  });

  it('should not validate an empty domain', () => {
    render(<Domain {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter the domain');

    fireEvent.blur(input);

    expect(mockHandleSetDomain).not.toHaveBeenCalled();
  });

  it('should validate domain on input change after debounce', async () => {
    vi.useFakeTimers();
    render(<Domain {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter the domain');
    fireEvent.change(input, { target: { value: 'https://example.com' } });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(mockHandleSetDomain).toHaveBeenCalledWith('https://example.com');
    vi.useRealTimers();
  });

  it('should show error for invalid domain', async () => {
    vi.useFakeTimers();

    render(<Domain {...defaultProps} />);
    const input = screen.getByPlaceholderText('Enter the domain');

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(
      screen.getByText('Please enter a valid domain, e.g. https://example.com'),
    ).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('should show HTTP warning for http domains', async () => {
    render(<Domain {...defaultProps} />);

    const input = screen.getByPlaceholderText('Enter the domain');

    fireEvent.change(input, { target: { value: 'http://example.com' } });
    fireEvent.blur(input);

    expect(
      screen.getByText(/http domains are not valid for production/),
    ).toBeInTheDocument();
  });

  it('should not show HTTP warning when showHttpError is false', async () => {
    render(<Domain {...defaultProps} showHttpError={false} />);

    const input = screen.getByPlaceholderText('Enter the domain');

    fireEvent.change(input, { target: { value: 'http://example.com' } });
    fireEvent.blur(input);

    expect(
      screen.queryByText(/http domains are not valid for production/),
    ).not.toBeInTheDocument();
  });

  it('should display custom error message when provided', () => {
    render(<Domain {...defaultProps} error="Custom error message" />);
    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should not call handleSetDomain when requireValid is true and domain is invalid', async () => {
    render(<Domain {...defaultProps} requireValid={true} />);

    const input = screen.getByPlaceholderText('Enter the domain');

    fireEvent.change(input, { target: { value: 'invalid-url' } });
    fireEvent.blur(input);

    expect(mockHandleSetDomain).not.toHaveBeenCalled();
  });
});
