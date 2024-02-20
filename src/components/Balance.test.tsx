/**
 * @jest-environment jsdom
 */
import React from 'react';
import { publicClient } from '../network/client';
import { render, screen } from '@testing-library/react';
import { Balance } from './Balance';
import { useOnchainActionWithCache } from '../hooks/useOnchainActionWithCache';

import '@testing-library/jest-dom';

jest.mock('../network/client');
jest.mock('../hooks/useOnchainActionWithCache');

describe('Balance', () => {
  const testAddress = '0x1234567890abcdef1234567890abcdef12345678';

  const mockGetBalance = publicClient.getBalance as jest.Mock;
  const mockUseOnchainActionWithCache = useOnchainActionWithCache as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('displays ETH balance', async () => {
    const testBalance = 49094208464446850n;
    mockGetBalance.mockReturnValue(testBalance);
    mockUseOnchainActionWithCache.mockImplementation(() => {
      return {
        data: testBalance,
        isLoading: false,
      };
    });

    render(
      <span data-testid="test-id-balance">
        <Balance address={testAddress} />
      </span>,
    );

    expect(await screen.findByTestId('test-id-balance')).toHaveTextContent('0.049 ETH');
  });

  it('displays ETH balance with rounding', async () => {
    const testBalance = 49994208464446850n;
    mockGetBalance.mockReturnValue(testBalance);
    mockUseOnchainActionWithCache.mockImplementation(() => {
      return {
        data: testBalance,
        isLoading: false,
      };
    });

    render(
      <span data-testid="test-id-balance">
        <Balance address={testAddress} />
      </span>,
    );

    expect(await screen.findByTestId('test-id-balance')).toHaveTextContent('0.050 ETH');
  });
});
