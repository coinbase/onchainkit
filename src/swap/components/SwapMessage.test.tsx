import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getSwapMessage } from '../utils/getSwapMessage';
import { SwapMessage } from './SwapMessage';
import { useSwapContext } from './SwapProvider';

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

vi.mock('../utils/getSwapMessage', () => ({
  getSwapMessage: vi.fn(),
}));

const useSwapContextMock = useSwapContext as Mock;

describe('SwapMessage', () => {
  const mockGetSwapMessage = getSwapMessage as Mock;

  beforeEach(() => {
    mockGetSwapMessage.mockClear();
  });

  it('should render message returned by getSwapMessage', () => {
    const mockMessage = 'Swap message';
    const mockContext = {
      to: {},
      from: {},
      error: null,
      loading: false,
      lifeCycleStatus: { statusData: null },
    };
    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue(mockMessage);
    render(<SwapMessage className="test-class" />);
    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveTextContent(mockMessage);
    expect(messageDiv).toHaveClass('test-class');
  });

  it('should render with error message', () => {
    const mockMessage = 'Error occurred';
    const mockContext = {
      to: {},
      from: {},
      error: 'Error occurred',
      loading: false,
      lifeCycleStatus: { statusData: null },
    };
    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue(mockMessage);
    render(<SwapMessage />);
    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveTextContent(mockMessage);
  });

  it('should render with loading message', () => {
    const mockMessage = 'Loading...';
    const mockContext = {
      to: {},
      from: {},
      error: null,
      loading: true,
      lifeCycleStatus: { statusData: null },
    };
    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue(mockMessage);
    render(<SwapMessage />);
    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveTextContent(mockMessage);
  });

  it('should apply additional className correctly', () => {
    const mockContext = {
      to: {},
      from: {},
      error: null,
      loading: false,
      lifeCycleStatus: { statusData: null },
    };

    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue('');
    const customClass = 'custom-class';
    render(<SwapMessage className={customClass} />);
    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveClass(customClass);
  });

  it('should set isMissingRequiredFields to true when reflected in statusData', () => {
    const mockContext = {
      to: { amount: 1, token: 'ETH' },
      from: { amount: null, token: 'DAI' },
      error: null,
      loading: false,
      isTransactionPending: false,
      address: '0x123',
      lifeCycleStatus: { statusData: { isMissingRequiredField: true } },
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
});
