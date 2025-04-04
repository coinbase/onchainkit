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
      lifecycleStatus: { statusName: 'init', statusData: null },
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
      lifecycleStatus: {
        statusName: 'error',
        statusData: { message: 'Error occurred' },
      },
    };
    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue(mockMessage);
    render(<SwapMessage />);
    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveTextContent(mockMessage);
  });

  it('should render with loading message in transactionPending status', () => {
    const mockMessage = 'Loading...';
    const mockContext = {
      to: {},
      from: {},
      lifecycleStatus: { statusName: 'transactionPending', statusData: null },
    };
    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue(mockMessage);
    render(<SwapMessage />);
    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveTextContent(mockMessage);
  });

  it('should render with loading message in transactionApproved status', () => {
    const mockMessage = 'Loading...';
    const mockContext = {
      to: {},
      from: {},
      lifecycleStatus: { statusName: 'transactionApproved', statusData: null },
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
      lifecycleStatus: { statusName: 'init', statusData: null },
    };

    useSwapContextMock.mockReturnValue(mockContext);
    mockGetSwapMessage.mockReturnValue('');
    const customClass = 'custom-class';
    render(<SwapMessage className={customClass} />);
    const messageDiv = screen.getByTestId('ockSwapMessage_Message');
    expect(messageDiv).toHaveClass(customClass);
  });

  it('should set isMissingRequiredFields to true when reflected in statusData', () => {
    const mockLifecycleStatus = {
      statusName: 'init',
      statusData: { isMissingRequiredField: true },
    };
    const mockContext = {
      to: { amount: 1, token: 'ETH' },
      from: { amount: null, token: 'DAI' },
      address: '0x123',
      lifecycleStatus: mockLifecycleStatus,
    };
    useSwapContextMock.mockReturnValue(mockContext);
    render(<SwapMessage />);
    expect(mockGetSwapMessage).toHaveBeenCalledWith({
      address: '0x123',
      from: { amount: null, token: 'DAI' },
      lifecycleStatus: mockLifecycleStatus,
      to: { amount: 1, token: 'ETH' },
    });
  });
});
