import { renderHook } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { useChainId } from 'wagmi';
import { useShowCallsStatus } from 'wagmi/experimental';
import { getChainExplorer } from '../../core/network/getChainExplorer';
import { useTransactionContext } from '../components/TransactionProvider';
import { useGetTransactionToastAction } from './useGetTransactionToastAction';

vi.mock('../components/TransactionProvider', () => ({
  useTransactionContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
}));

vi.mock('wagmi/experimental', () => ({
  useShowCallsStatus: vi.fn(),
}));

vi.mock('../../core/network/getChainExplorer', () => ({
  getChainExplorer: vi.fn(),
}));

const mockGetChainExplorer = 'https://etherscan.io';

describe('useGetTransactionToastAction', () => {
  beforeEach(() => {
    (useChainId as Mock).mockReturnValue(123);
    (useShowCallsStatus as Mock).mockReturnValue({
      showCallsStatus: vi.fn(),
    });
    (getChainExplorer as Mock).mockReturnValue(mockGetChainExplorer);
  });

  it('should return actionElement when transaction hash exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      transactionHash: '0x123',
    });

    const { result } = renderHook(() => useGetTransactionToastAction());

    expect(result.current.actionElement).toMatchInlineSnapshot(`
        <a
          href="https://etherscan.io/tx/0x123"
          rel="noreferrer"
          target="_blank"
        >
          <span
            className="ock-font-family font-semibold text-sm ock-text-primary"
          >
            View transaction
          </span>
        </a>
      `);
  });

  it('should return actionElement when transaction id exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      transactionId: 'ab123',
      onSubmit: vi.fn(),
    });

    const showCallsStatus = vi.fn();
    (useShowCallsStatus as Mock).mockReturnValue({ showCallsStatus });

    const { result } = renderHook(() => useGetTransactionToastAction());

    const button = result.current.actionElement as JSX.Element;
    expect(button.props.onClick).toBeDefined();
    expect(button).not.toBeNull();
  });

  it('should return actionElement when receipt exists', () => {
    (useTransactionContext as Mock).mockReturnValue({
      receipt: 'receipt',
      transactionHash: '0x123',
    });

    const { result } = renderHook(() => useGetTransactionToastAction());

    expect(result.current.actionElement).toMatchInlineSnapshot(`
        <a
          href="https://etherscan.io/tx/0x123"
          rel="noreferrer"
          target="_blank"
        >
          <span
            className="ock-font-family font-semibold text-sm ock-text-primary"
          >
            View transaction
          </span>
        </a>
      `);
  });

  it('should return actionElement when error occurs', () => {
    const onSubmitMock = vi.fn();
    (useTransactionContext as Mock).mockReturnValue({
      errorMessage: 'error',
      onSubmit: onSubmitMock,
    });

    const { result } = renderHook(() => useGetTransactionToastAction());

    const button = result.current.actionElement as JSX.Element;
    expect(button.props.onClick).toBe(onSubmitMock);
  });

  it('should return actionElement when no status available', () => {
    (useTransactionContext as Mock).mockReturnValue({
      errorMessage: '',
    });

    const { result } = renderHook(() => useGetTransactionToastAction());

    expect(result.current.actionElement).toBeNull();
  });

  it('should prioritize transactionId over transactionHash when both are provided', () => {
    const showCallsStatus = vi.fn();
    (useTransactionContext as Mock).mockReturnValue({
      transactionHash: '0x123',
      transactionId: 'ab123',
    });
    (useShowCallsStatus as Mock).mockReturnValue({ showCallsStatus });

    const { result } = renderHook(() => useGetTransactionToastAction());

    const button = result.current.actionElement as JSX.Element;
    expect(button.props.onClick).toBeDefined();
    expect(button).not.toBeNull();
  });

  it('should use accountChainId from useChainId when chainId is not available in context', () => {
    (useTransactionContext as Mock).mockReturnValue({
      chainId: undefined,
      transactionHash: '0x123',
    });

    const { result } = renderHook(() => useGetTransactionToastAction());

    expect(result.current.actionElement).toMatchInlineSnapshot(`
      <a
        href="https://etherscan.io/tx/0x123"
        rel="noreferrer"
        target="_blank"
      >
        <span
          className="ock-font-family font-semibold text-sm ock-text-primary"
        >
          View transaction
        </span>
      </a>
    `);
  });

  it('should call showCallsStatus when button is clicked', () => {
    const showCallsStatus = vi.fn();
    (useShowCallsStatus as Mock).mockReturnValue({ showCallsStatus });
    (useTransactionContext as Mock).mockReturnValue({
      transactionId: 'ab123',
    });

    const { result } = renderHook(() => useGetTransactionToastAction());

    const button = result.current.actionElement as JSX.Element;
    button.props.onClick();

    expect(showCallsStatus).toHaveBeenCalledWith({ id: 'ab123' });
  });
});
