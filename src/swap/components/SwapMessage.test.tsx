/**
 * @vi-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/vi-dom';
import { SwapMessage } from './SwapMessage';
import { useSwapContext } from './SwapProvider';
import { getSwapMessage } from '../core/getSwapMessage';

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

vi.mock('../core/getSwapMessage', () => ({
  getSwapMessage: vi.fn(),
}));

const useSwapContextMock = useSwapContext as vi.Mock;

describe('SwapMessage', () => {
  const mockGetSwapMessage = getSwapMessage as vi.Mock;

  beforeEach(() => {
    mockGetSwapMessage.mockClear();
  });

  test('renders message returned by getSwapMessage', () => {
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

  test('renders with error message', () => {
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

  test('renders with loading message', () => {
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

  test('applies additional className correctly', () => {
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
});
