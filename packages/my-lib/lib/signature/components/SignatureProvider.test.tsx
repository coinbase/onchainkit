import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { useSignMessage, useSignTypedData } from 'wagmi';
import { SignatureProvider, useSignatureContext } from './SignatureProvider';

vi.mock('wagmi', () => ({
  useSignMessage: vi.fn(),
  useSignTypedData: vi.fn(),
}));

const TestComponent = () => {
  const context = useSignatureContext();

  const handleSign = () => {
    context.handleSign();
  };

  return (
    <div>
      <button type="button" onClick={handleSign}>
        sign
      </button>
      <div data-testid="lifecycle-status">
        {context.lifecycleStatus.statusName}
      </div>
    </div>
  );
};

describe('SignatureProvider', () => {
  let mockOnError: Mock;
  let mockOnStatus: Mock;
  let mockOnSuccess: Mock;
  let mockSignMessage: Mock;
  let mockSignTypedData: Mock;

  beforeEach(() => {
    mockOnError = vi.fn();
    mockOnStatus = vi.fn();
    mockOnSuccess = vi.fn();
    mockSignMessage = vi.fn();
    mockSignTypedData = vi.fn();

    (useSignMessage as Mock).mockReturnValue({
      signMessageAsync: mockSignMessage,
      reset: vi.fn(),
    });
    (useSignTypedData as Mock).mockReturnValue({
      signTypedDataAsync: mockSignTypedData,
      reset: vi.fn(),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should throw error if useSignatureContext is used outside provider', () => {
    const consoleError = console.error;
    console.error = vi.fn();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useSignatureContext must be used within a SignatureProvider');

    console.error = consoleError;
  });

  it('should handle successful signature for typed data', async () => {
    mockSignTypedData.mockResolvedValue('0x123');

    render(
      <SignatureProvider
        domain={{ name: 'Test', version: '1' }}
        types={{ Test: [{ name: 'test', type: 'string' }] }}
        message={{ test: 'test' }}
        primaryType="Test"
        onSuccess={mockOnSuccess}
        onStatus={mockOnStatus}
      >
        <TestComponent />
      </SignatureProvider>,
    );

    fireEvent.click(screen.getByText('sign'));

    expect(mockSignTypedData).toHaveBeenCalled();
    expect(mockOnStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        statusName: 'pending',
      }),
    );

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('0x123');
      expect(mockOnStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          statusName: 'success',
        }),
      );
    });
  });

  it('should handle successful signature for message', async () => {
    mockSignMessage.mockResolvedValue('0x456');

    render(
      <SignatureProvider
        message="Test message"
        onSuccess={mockOnSuccess}
        onStatus={mockOnStatus}
      >
        <TestComponent />
      </SignatureProvider>,
    );

    fireEvent.click(screen.getByText('sign'));

    expect(mockSignMessage).toHaveBeenCalled();
    expect(mockOnStatus).toHaveBeenCalledWith(
      expect.objectContaining({
        statusName: 'pending',
      }),
    );

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('0x456');
      expect(mockOnStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          statusName: 'success',
        }),
      );
    });
  });

  it('should handle reset after', async () => {
    mockSignMessage.mockResolvedValue('0x456');

    render(
      <SignatureProvider
        message="Test message"
        onSuccess={mockOnSuccess}
        resetAfter={10}
      >
        <TestComponent />
      </SignatureProvider>,
    );

    fireEvent.click(screen.getByText('sign'));

    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalledWith('0x456');
    });

    await waitFor(() => {
      expect(useSignMessage().reset).toHaveBeenCalled();
      expect(useSignTypedData().reset).toHaveBeenCalled();
    });
  });

  it('should handle invalid message data', async () => {
    mockSignTypedData.mockRejectedValue('Invalid message data');

    render(
      /* @ts-expect-error - Missing required message prop for testing invalid state */
      <SignatureProvider
        domain={{ name: 'Test', version: '1' }}
        types={{ Test: [{ name: 'test', type: 'string' }] }}
        primaryType="Test"
        onError={mockOnError}
        onStatus={mockOnStatus}
      >
        <TestComponent />
      </SignatureProvider>,
    );

    fireEvent.click(screen.getByText('sign'));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
      expect(mockOnStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          statusName: 'error',
        }),
      );
    });
  });

  it('should handle user rejected request error', async () => {
    const error = { cause: { name: 'UserRejectedRequestError' } };
    mockSignTypedData.mockRejectedValue(error);

    render(
      <SignatureProvider
        domain={{ name: 'Test', version: '1' }}
        types={{ Test: [{ name: 'test', type: 'string' }] }}
        message={{ test: 'test' }}
        primaryType="Test"
        onError={mockOnError}
        onStatus={mockOnStatus}
      >
        <TestComponent />
      </SignatureProvider>,
    );

    fireEvent.click(screen.getByText('sign'));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
      expect(mockOnStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          statusName: 'error',
        }),
      );
    });
  });

  it('should handle signature error', async () => {
    const error = new Error('User rejected');
    mockSignTypedData.mockRejectedValue(error);

    render(
      <SignatureProvider
        domain={{ name: 'Test', version: '1' }}
        types={{ Test: [{ name: 'test', type: 'string' }] }}
        message={{ test: 'test' }}
        primaryType="Test"
        onError={mockOnError}
        onStatus={mockOnStatus}
      >
        <TestComponent />
      </SignatureProvider>,
    );

    fireEvent.click(screen.getByText('sign'));

    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalled();
      expect(mockOnStatus).toHaveBeenCalledWith(
        expect.objectContaining({
          statusName: 'error',
        }),
      );
    });
  });
});
