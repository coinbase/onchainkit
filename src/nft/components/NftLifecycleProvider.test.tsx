import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import type { TransactionReceipt } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import { LifecycleType } from '../types';
import {
  NftLifecycleProvider,
  useNftLifecycleContext,
} from './NftLifecycleProvider';

const TestComponent = () => {
  const context = useNftLifecycleContext();

  const handleStatusError = async () => {
    context.updateLifecycleStatus({
      statusName: 'error',
      statusData: {
        code: 'code',
        error: 'error_long_messages',
        message: '',
      },
    });
  };
  const handleStatusSuccessWithTransaction = async () => {
    context.updateLifecycleStatus({
      statusName: 'success',
      statusData: {
        transactionReceipts: ['0x123'] as unknown as TransactionReceipt[],
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
        mimeType: 'image/png',
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
}) => {
  return render(
    <NftLifecycleProvider
      type={LifecycleType.MINT}
      onError={onError}
      onStatus={onStatus}
      onSuccess={onSuccess}
    >
      <Component />
    </NftLifecycleProvider>,
  );
};

describe('NftLifecycleProvider', () => {
  it('should throw an error if useNftLifecycleContext is used outside of NftLifecycleProvider', () => {
    const TestComponent = () => {
      useNftLifecycleContext();
      return null;
    };
    // Suppress console.error for this test to avoid noisy output
    const originalError = console.error;
    console.error = vi.fn();
    expect(() => {
      render(<TestComponent />);
    }).toThrow(
      'useNftLifecycleContext must be used within an NftView or NftMint component',
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
});
