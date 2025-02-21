import '@testing-library/jest-dom';
import type { NFTError } from '@/api/types';
import { fireEvent, render } from '@testing-library/react';
import type { TransactionReceipt } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import { describe, expect, it, vi } from 'vitest';
import { type LifecycleStatus, LifecycleType, MediaType } from '../types';
import {
  NFTLifecycleProvider,
  useNFTLifecycleContext,
} from './NFTLifecycleProvider';

const TestComponent = () => {
  const context = useNFTLifecycleContext();

  const handleStatusError = () => {
    context.updateLifecycleStatus({
      statusName: 'error',
      statusData: {
        error: 'error_message',
        code: 'error_code',
        message: 'detailed_error_message',
      },
    });
  };

  const handleStatusSuccessWithTransaction = () => {
    context.updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipts: ['0x123'] as unknown as TransactionReceipt[],
      },
    });
  };

  const handleStatusSuccessWithoutTransaction = () => {
    context.updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipts: [],
      },
    });
  };

  const handleStatusMediaLoading = () => {
    context.updateLifecycleStatus({
      statusName: 'mediaLoading',
      statusData: {
        mediaType: MediaType.Image,
        mediaUrl: 'https://example.com/image.png',
      },
    });
  };

  return (
    <div data-testid="test-component">
      <span data-testid="context-value-lifecycleStatus-statusName">
        {context.lifecycleStatus.statusName}
      </span>
      {context.lifecycleStatus.statusName === 'error' && (
        <span data-testid="context-value-lifecycleStatus-statusData-code">
          {context.lifecycleStatus.statusData.code}
        </span>
      )}
      <button type="button" onClick={handleStatusError}>
        setLifecycleStatus.error
      </button>
      <button type="button" onClick={handleStatusSuccessWithTransaction}>
        setLifecycleStatus.successWithTransaction
      </button>
      <button type="button" onClick={handleStatusSuccessWithoutTransaction}>
        setLifecycleStatus.successWithoutTransaction
      </button>
      <button type="button" onClick={handleStatusMediaLoading}>
        setLifecycleStatus.mediaLoading
      </button>
    </div>
  );
};

const mockTransactionReceipt: TransactionReceipt = {
  blockHash: '0xblockhash',
  blockNumber: 1n,
  contractAddress: null,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 1000000000n,
  from: '0x456',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x',
  status: 'success',
  to: '0x123',
  transactionHash: '0xhash',
  transactionIndex: 0,
  type: 'legacy',
} as const;

const renderWithProviders = ({
  Component,
  onError = vi.fn(),
  onStatus = vi.fn(),
  onSuccess = vi.fn(),
}: {
  Component: () => React.ReactNode;
  onError?: (error: NFTError) => void;
  onStatus?: (lifecycleStatus: LifecycleStatus) => void;
  onSuccess?: (transactionReceipt?: TransactionReceipt) => void;
}) => {
  return render(
    <NFTLifecycleProvider
      type={LifecycleType.MINT}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    >
      <Component />
    </NFTLifecycleProvider>,
  );
};

describe('NFTLifecycleProvider', () => {
  it('should throw an error if useNFTLifecycleContext is used outside of NFTLifecycleProvider', () => {
    const TestComponent = () => {
      useNFTLifecycleContext();
      return null;
    };
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = vi.fn();
    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      'useNFTLifecycleContext must be used within an NFTView or NFTMint component',
    );
    // Restore console.error
    console.error = originalError;
  });

  it('should call onSuccess callback on status success with transaction', async () => {
    const onSuccessMock = vi.fn();
    const { getByText } = renderWithProviders({
      Component: TestComponent,
      onSuccess: onSuccessMock,
    });
    const button = getByText('setLifecycleStatus.successWithTransaction');
    fireEvent.click(button);
    expect(onSuccessMock).toHaveBeenCalledWith('0x123');
  });

  it('should call onSuccess callback on status success without transaction', async () => {
    const onSuccessMock = vi.fn();
    const { getByText } = renderWithProviders({
      Component: TestComponent,
      onSuccess: onSuccessMock,
    });
    const button = getByText('setLifecycleStatus.successWithoutTransaction');
    fireEvent.click(button);
    expect(onSuccessMock).toHaveBeenCalledWith(undefined);
  });

  it('should call onError callback on status error', async () => {
    const onErrorMock = vi.fn();
    const { getByText } = renderWithProviders({
      Component: TestComponent,
      onError: onErrorMock,
    });
    const button = getByText('setLifecycleStatus.error');
    fireEvent.click(button);
    expect(onErrorMock).toHaveBeenCalled();
  });

  it('should call onStatus callback on any status change', async () => {
    const onStatusMock = vi.fn();
    const { getByText } = renderWithProviders({
      Component: TestComponent,
      onStatus: onStatusMock,
    });
    const button = getByText('setLifecycleStatus.mediaLoading');
    fireEvent.click(button);
    expect(onStatusMock).toHaveBeenCalled();
  });

  it('should update lifecycle status correctly', () => {
    const { getByText, getByTestId } = renderWithProviders({
      Component: TestComponent,
    });

    fireEvent.click(getByText('setLifecycleStatus.successWithTransaction'));

    expect(
      getByTestId('context-value-lifecycleStatus-statusName').textContent,
    ).toBe('success');
  });
});
