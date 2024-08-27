import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getSwapMessage } from '../utils/getSwapMessage';
import { SwapMessage } from './SwapMessage';
import { useSwapContext } from './SwapProvider';
import { beforeEach, describe, expect, it } from 'vitest';

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

vi.mock('../utils/getSwapMessage', () => ({
  getSwapMessage: vi.fn(),
}));

const useSwapContextMock = useSwapContext as vi.Mock;

describe('SwapMessage', () => {
  const mockGetSwapMessage = getSwapMessage as vi.Mock;

  beforeEach(() => {
    mockGetSwapMessage.mockClear();
  });

  it('renders message returned by getSwapMessage', () => {
    const mockMessage = 'Swap message';
    const mockContext = {
      to: {},
      from: {},
      error: null,
      loading: false,
    };

    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue(mockMessage);

    render(<SwapMessage className="test-class" />);

    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveTextContent(mockMessage);
    expect(messageDiv).toHaveClass('test-class');
  });

  it('renders with error message', () => {
    const mockMessage = 'Error occurred';
    const mockContext = {
      to: {},
      from: {},
      error: 'Error occurred',
      loading: false,
    };

    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue(mockMessage);

    render(<SwapMessage />);

    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveTextContent(mockMessage);
  });

  it('renders with loading message', () => {
    const mockMessage = 'Loading...';
    const mockContext = {
      to: {},
      from: {},
      error: null,
      loading: true,
    };

    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue(mockMessage);

    render(<SwapMessage />);

    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveTextContent(mockMessage);
  });

  it('applies additional className correctly', () => {
    const mockContext = {
      to: {},
      from: {},
      error: null,
      loading: false,
    };

    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue('');

    const customClass = 'custom-class';
    render(<SwapMessage className={customClass} />);

    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveClass(customClass);
  });

  it('sets isMissingRequiredFields to true when from.amount is missing', () => {
    const mockContext = {
      to: { amount: 1, token: 'ETH' },
      from: { amount: null, token: 'DAI' }, // from.amount is missing
      error: null,
      loading: false,
      isTransactionPending: false,
      address: '0x123',
    };

    useSwapContextMock.mockReturnValue(mockContext);

    render(<SwapMessage />);

    expect(mockGetSwapMessage).toHaveBeenCalledWith({
      address: '0x123',
      error: null,
      from: { amount: null, token: 'DAI' },
      loading: false,
      isMissingRequiredFields: true,
      isTransactionPending: false,
      to: { amount: 1, token: 'ETH' },
    });
  });

  it('sets isMissingRequiredFields to true when from.token is missing', () => {
    const mockContext = {
      to: { amount: 1, token: 'ETH' },
      from: { amount: 1, token: null },
      error: null,
      loading: false,
      isTransactionPending: false,
      address: '0x123',
    };

    useSwapContextMock.mockReturnValue(mockContext);

    render(<SwapMessage />);

    expect(mockGetSwapMessage).toHaveBeenCalledWith({
      address: '0x123',
      error: null,
      from: { amount: 1, token: null },
      loading: false,
      isMissingRequiredFields: true,
      isTransactionPending: false,
      to: { amount: 1, token: 'ETH' },
    });
  });

  it('sets isMissingRequiredFields to true when to.amount is missing', () => {
    const mockContext = {
      to: { amount: null, token: 'ETH' },
      from: { amount: 1, token: 'DAI' },
      error: null,
      loading: false,
      isTransactionPending: false,
      address: '0x123',
    };

    useSwapContextMock.mockReturnValue(mockContext);

    render(<SwapMessage />);

    expect(mockGetSwapMessage).toHaveBeenCalledWith({
      address: '0x123',
      error: null,
      from: { amount: 1, token: 'DAI' },
      loading: false,
      isMissingRequiredFields: true,
      isTransactionPending: false,
      to: { amount: null, token: 'ETH' },
    });
  });

  it('sets isMissingRequiredFields to true when to.token is missing', () => {
    const mockContext = {
      to: { amount: 1, token: null },
      from: { amount: 1, token: 'DAI' },
      error: null,
      loading: false,
      isTransactionPending: false,
      address: '0x123',
    };

    useSwapContextMock.mockReturnValue(mockContext);

    render(<SwapMessage />);

    expect(mockGetSwapMessage).toHaveBeenCalledWith({
      address: '0x123',
      error: null,
      from: { amount: 1, token: 'DAI' },
      loading: false,
      isMissingRequiredFields: true,
      isTransactionPending: false,
      to: { amount: 1, token: null },
    });
  });
});
