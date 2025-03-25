import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppchainBridgeContext } from './AppchainBridgeProvider';
import { AppchainBridgeResumeTransaction } from './AppchainBridgeResumeTransaction';

vi.mock('./AppchainBridgeProvider', () => ({
  useAppchainBridgeContext: vi.fn(),
}));

describe('AppchainBridgeResumeTransaction', () => {
  const mockHandleResumeTransaction = vi.fn();
  const mockSetIsResumeTransactionModalOpen = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();
    (useAppchainBridgeContext as Mock).mockReturnValue({
      handleResumeTransaction: mockHandleResumeTransaction,
      setIsResumeTransactionModalOpen: mockSetIsResumeTransactionModalOpen,
    });
  });

  it('renders the component with initial state', () => {
    render(<AppchainBridgeResumeTransaction />);

    expect(
      screen.getByRole('heading', { name: 'Resume Transaction' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Transaction hash')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0x...')).toBeInTheDocument();
  });

  it('handles back button click', () => {
    render(<AppchainBridgeResumeTransaction />);

    const backButton = screen.getByLabelText('Back button');
    fireEvent.click(backButton);

    expect(mockSetIsResumeTransactionModalOpen).toHaveBeenCalledWith(false);
  });

  it('updates transaction hash input value', () => {
    render(<AppchainBridgeResumeTransaction />);

    const input = screen.getByPlaceholderText('0x...');
    fireEvent.change(input, {
      target: {
        value:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    });

    expect(input).toHaveValue(
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    );
  });

  it('shows validation message when transaction hash is invalid', async () => {
    (useAppchainBridgeContext as Mock).mockReturnValue({
      handleResumeTransaction: mockHandleResumeTransaction,
      setIsResumeTransactionModalOpen: mockSetIsResumeTransactionModalOpen,
    });

    render(<AppchainBridgeResumeTransaction />);

    const input = screen.getByPlaceholderText('0x...');
    fireEvent.change(input, { target: { value: '0xinvalid' } });
    const resumeButton = screen.getByText('Resume Transaction', {
      selector: 'div',
    });
    fireEvent.click(resumeButton);

    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid transaction hash'),
      ).toBeInTheDocument();
    });
  });

  it('handles resume transaction with valid hash', () => {
    render(<AppchainBridgeResumeTransaction />);

    const input = screen.getByPlaceholderText('0x...');
    fireEvent.change(input, {
      target: {
        value:
          '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      },
    });

    const resumeButton = screen.getByText('Resume Transaction', {
      selector: 'div',
    });
    fireEvent.click(resumeButton);

    expect(mockHandleResumeTransaction).toHaveBeenCalledWith(
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    );
  });

  it('applies correct styles to input field', () => {
    render(<AppchainBridgeResumeTransaction />);

    const input = screen.getByPlaceholderText('0x...');
    expect(input).toHaveClass(
      'w-full',
      'border-none',
      'focus:border-none',
      'focus:outline-none',
      'focus:ring-0',
    );
  });
});
