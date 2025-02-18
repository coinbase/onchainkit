import '@testing-library/jest-dom';
import type { NFTError } from '@/api/types';
import { useAnalytics } from '@/core/analytics/hooks/useAnalytics';
import { MintEvent } from '@/core/analytics/types';
import { fireEvent, render } from '@testing-library/react';
import type { TransactionReceipt } from 'viem';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { type LifecycleStatus, LifecycleType, MediaType } from '../types';
import {
  NFTLifecycleProvider,
  useNFTLifecycleContext,
} from './NFTLifecycleProvider';

vi.mock('@/core/analytics/hooks/useAnalytics');

const mockTransactionReceipt: TransactionReceipt = {
  blockHash: '0xblockhash',
  blockNumber: 1n,
  contractAddress: null,
  cumulativeGasUsed: 21000n,
  effectiveGasPrice: 1000000000n,
  from: '0xabc',
  gasUsed: 21000n,
  logs: [],
  logsBloom: '0x',
  status: 'success',
  to: '0x123',
  transactionHash: '0xhash',
  transactionIndex: 0,
  type: 'legacy',
} as const;

const TestComponent = () => {
  const context = useNFTLifecycleContext();

  const handleStatusError = async () => {
    context.updateLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: 'error_code',
        error: 'error_message',
        message: 'detailed_error_message',
      },
    });
  };
  const handleStatusSuccessWithTransaction = async () => {
    context.updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipts: [mockTransactionReceipt],
      },
    });
  };
  const handleStatusSuccessWithoutTransaction = async () => {
    context.updateLifecycleStatus({
      statusName: 'success',
      statusData: {},
    });
  };
  const handleStatusMediaLoading = async () => {
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
  let mockSendAnalytics: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockSendAnalytics = vi.fn();
    (useAnalytics as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      sendAnalytics: mockSendAnalytics,
    });
  });

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
    expect(onSuccessMock).toHaveBeenCalledWith(mockTransactionReceipt);
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

  describe('Analytics', () => {
    it('should send MintSuccess analytics when transaction succeeds', () => {
      const { getByText } = renderWithProviders({
        Component: TestComponent,
      });

      getByText('setLifecycleStatus.successWithTransaction').click();

      expect(mockSendAnalytics).toHaveBeenCalledWith(MintEvent.MintSuccess, {
        address: mockTransactionReceipt.from,
        amountMinted: 1,
        contractAddress: mockTransactionReceipt.to,
        isSponsored: false,
        tokenId: undefined,
      });
    });

    it('should not send MintSuccess analytics when transaction succeeds without receipt', () => {
      const { getByText } = renderWithProviders({
        Component: TestComponent,
      });

      getByText('setLifecycleStatus.successWithoutTransaction').click();

      expect(mockSendAnalytics).not.toHaveBeenCalledWith(
        MintEvent.MintSuccess,
        expect.any(Object),
      );
    });

    it('should send MintFailure analytics when error occurs', () => {
      const { getByText } = renderWithProviders({
        Component: TestComponent,
      });

      getByText('setLifecycleStatus.error').click();

      expect(mockSendAnalytics).toHaveBeenCalledWith(MintEvent.MintFailure, {
        error: 'error_message',
        metadata: {
          code: 'error_code',
          message: 'detailed_error_message',
        },
      });
    });

    it('should not send analytics for non-mint/error status changes', () => {
      const { getByText } = renderWithProviders({
        Component: TestComponent,
      });

      getByText('setLifecycleStatus.mediaLoading').click();

      expect(mockSendAnalytics).not.toHaveBeenCalled();
    });
  });
});
