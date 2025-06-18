import { render, screen, fireEvent } from '@testing-library/react';
import { useTransactionContext } from '@/transaction';
import { TransactionContextType } from '@/transaction/types';
import { TransactionReceipt } from 'viem';
import { base } from 'viem/chains';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { WalletContextType } from '../../../types';
import { useWalletContext } from '../../WalletProvider';
import { defaultSendTxSuccessHandler } from '../utils/defaultSendTxSuccessHandler';
import {
  RenderSendButton,
  type RenderSendButtonProps,
} from './RenderSendButton';

vi.mock('@/internal/components/Spinner', () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

vi.mock('@/transaction', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('../../WalletProvider', () => ({
  useWalletContext: vi.fn(),
}));

vi.mock('../utils/defaultSendTxSuccessHandler', () => ({
  defaultSendTxSuccessHandler: vi.fn().mockReturnValue(vi.fn()),
}));

const mockSetActiveFeature = vi.fn();

const baseWalletContext = {
  address: '0x123',
  chain: base,
  setActiveFeature: mockSetActiveFeature,
} as unknown as WalletContextType;

const baseTransactionContext = {
  receipt: null,
  errorMessage: null,
  isLoading: false,
} as unknown as TransactionContextType;

describe('RenderSendButton', () => {
  const defaultProps = {
    context: {
      receipt: null,
      errorMessage: null,
      isLoading: false,
    },
    onSubmit: vi.fn(),
    onSuccess: vi.fn(),
    isDisabled: false,
    depositAmountError: null,
    depositedAmount: '100',
    vaultToken: { symbol: 'ETH' },
  } as unknown as RenderSendButtonProps;

  afterEach(() => {
    vi.clearAllMocks();
  });

  beforeEach(() => {
    vi.mocked(useWalletContext).mockReturnValue(baseWalletContext);
    vi.mocked(useTransactionContext).mockReturnValue(baseTransactionContext);
  });

  it('renders send button in default state', () => {
    render(<RenderSendButton {...defaultProps} label="Send" />);

    const buttonElement = screen.getByRole('button', { name: 'Send' });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).not.toBeDisabled();

    fireEvent.click(buttonElement);
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders disabled deposit button', () => {
    const props = {
      ...defaultProps,
      isDisabled: true,
    };
    render(<RenderSendButton {...props} label="Send" />);

    const buttonElement = screen.getByRole('button', { name: 'Send' });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toBeDisabled();
  });

  it('renders loading state with spinner', () => {
    vi.mocked(useTransactionContext).mockReturnValue({
      ...baseTransactionContext,
      isLoading: true,
    });
    render(<RenderSendButton {...defaultProps} label="Send" />);

    const buttonElement = screen.getByRole('button');
    const spinner = screen.getByTestId('spinner');

    expect(buttonElement).toBeInTheDocument();
    expect(spinner).toBeInTheDocument();
  });

  it('renders error state with error message', () => {
    const errorMessage = 'Insufficient funds';
    vi.mocked(useTransactionContext).mockReturnValue({
      ...baseTransactionContext,
      isLoading: true,
      errorMessage,
    });
    render(<RenderSendButton {...defaultProps} label="Send" />);

    const buttonElement = screen.getByRole('button', { name: 'Try again' });
    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);
    expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders success state', () => {
    vi.mocked(useTransactionContext).mockReturnValue({
      ...baseTransactionContext,
      isLoading: true,
      receipt: { hash: '0x123' } as unknown as TransactionReceipt,
    });
    render(<RenderSendButton {...defaultProps} label="Send" />);

    const buttonElement = screen.getByRole('button', {
      name: 'View transaction',
    });
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls defaultSendTxSuccessHandler with correct params when clicking View transaction button', () => {
    const mockReceipt = { hash: '0x123' } as unknown as TransactionReceipt;
    const mockTransactionId = 'tx123';
    const mockTransactionHash = '0xabc';

    vi.mocked(useTransactionContext).mockReturnValue({
      ...baseTransactionContext,
      receipt: mockReceipt,
      transactionId: mockTransactionId,
      transactionHash: mockTransactionHash,
    });

    render(<RenderSendButton {...defaultProps} label="Send" />);

    const buttonElement = screen.getByRole('button', {
      name: 'View transaction',
    });
    expect(buttonElement).toBeInTheDocument();

    fireEvent.click(buttonElement);

    expect(defaultSendTxSuccessHandler).toHaveBeenCalledWith({
      transactionId: mockTransactionId,
      transactionHash: mockTransactionHash,
      senderChain: baseWalletContext.chain,
      address: baseWalletContext.address,
      onComplete: expect.any(Function),
    });

    const onCompleteCallback = vi.mocked(defaultSendTxSuccessHandler).mock
      .calls[0][0].onComplete;

    onCompleteCallback?.();
    expect(mockSetActiveFeature).toHaveBeenCalledWith(null);

    const returnedHandler = vi.mocked(defaultSendTxSuccessHandler).mock
      .results[0].value;
    expect(returnedHandler).toHaveBeenCalledWith(mockReceipt);
  });

  it('calls defaultSendTxSuccessHandler with undefined values when address and chain are null', () => {
    const mockReceipt = { hash: '0x123' } as unknown as TransactionReceipt;
    const mockTransactionId = 'tx123';
    const mockTransactionHash = '0xabc';

    vi.mocked(useTransactionContext).mockReturnValue({
      ...baseTransactionContext,
      receipt: mockReceipt,
      transactionId: mockTransactionId,
      transactionHash: mockTransactionHash,
    });

    vi.mocked(useWalletContext).mockReturnValue({
      ...baseWalletContext,
      address: null,
      chain: null,
      setActiveFeature: mockSetActiveFeature,
    } as unknown as WalletContextType);

    render(<RenderSendButton {...defaultProps} label="Send" />);

    fireEvent.click(screen.getByRole('button', { name: 'View transaction' }));

    expect(defaultSendTxSuccessHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        senderChain: undefined,
        address: undefined,
      }),
    );
  });
});
