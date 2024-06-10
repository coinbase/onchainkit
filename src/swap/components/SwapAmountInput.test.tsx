/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Address } from 'viem';
import { SwapAmountInput } from './SwapAmountInput';
import { Token } from '../../token';

const setAmountMock = jest.fn();
const selectTokenClickMock = jest.fn();
const onMaxButtonClickMock = jest.fn();

const token = {
  address: '0x123' as Address,
  chainId: 1,
  decimals: 2,
  image: 'imageURL',
  name: 'Ether',
  symbol: 'ETH',
};

const swappableTokens: Token[] = [
  {
    name: 'Ethereum',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image: 'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
  },
  {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
  },
  {
    name: 'Dai',
    address: '0x50c5725949a6f0c72e6c4a641f24049a917db0cb',
    symbol: 'DAI',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/d0/d7/d0d7784975771dbbac9a22c8c0c12928cc6f658cbcf2bbbf7c909f0fa2426dec-NmU4ZWViMDItOTQyYy00Yjk5LTkzODUtNGJlZmJiMTUxOTgy',
    chainId: 8453,
  },
];

describe('SwapAmountInput Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    render(
      <SwapAmountInput
        token={token}
        swappableTokens={swappableTokens}
        label="Sell"
        onAmountChange={setAmountMock}
        onTokenSelectorClick={selectTokenClickMock}
        amount="1"
        tokenBalance="100"
      />,
    );

    const amountInput = screen.getByTestId('ockSwapAmountInput_Container');
    expect(amountInput).toBeInTheDocument();

    const labelElement = within(amountInput).getByText('Sell');
    expect(labelElement).toBeInTheDocument();

    const balanceElement = within(amountInput).getByText('Balance: 100');
    expect(balanceElement).toBeInTheDocument();
  });

  it('should update the amount if a user enters a number', async () => {
    render(
      <SwapAmountInput
        token={token}
        swappableTokens={swappableTokens}
        label="Sell"
        onAmountChange={setAmountMock}
        onTokenSelectorClick={selectTokenClickMock}
      />,
    );

    const input = screen.getByTestId('ockSwapAmountInput_Input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2' } });
    expect(setAmountMock).toHaveBeenCalledWith('2');
    expect(input.value).toBe('2');
  });

  it('should not update the amount if a user enters a non-number', async () => {
    render(
      <SwapAmountInput
        token={token}
        swappableTokens={swappableTokens}
        label="Sell"
        onAmountChange={setAmountMock}
        onTokenSelectorClick={selectTokenClickMock}
        amount="1"
      />,
    );

    const input = screen.getByTestId('ockSwapAmountInput_Input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'a' } });
    expect(setAmountMock).not.toHaveBeenCalledWith('a');
    expect(input.value).toBe('1');
  });

  it('should call onMaxButtonClick when the max button is clicked', async () => {
    render(
      <SwapAmountInput
        token={token}
        swappableTokens={swappableTokens}
        label="Sell"
        amount="1"
        onAmountChange={setAmountMock}
        onTokenSelectorClick={selectTokenClickMock}
        onMaxButtonClick={onMaxButtonClickMock}
        tokenBalance="100"
      />,
    );

    const maxButton = screen.getByTestId('ockSwapAmountInput_MaxButton');
    fireEvent.click(maxButton);
    expect(onMaxButtonClickMock).toHaveBeenCalled();
  });

  it('should disable the input when disabled prop is true', async () => {
    render(
      <SwapAmountInput
        token={token}
        swappableTokens={swappableTokens}
        label="Sell"
        amount="1"
        onAmountChange={setAmountMock}
        onTokenSelectorClick={selectTokenClickMock}
        onMaxButtonClick={onMaxButtonClickMock}
        disabled={true}
      />,
    );

    const input = screen.getByTestId('ockSwapAmountInput_Input') as HTMLInputElement;
    expect(input).toBeDisabled();
  });
});
