/**
 * @jest-environment jsdom
 */
import React from 'react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { Address } from 'viem';
import { AmountInput } from './AmountInput';

const handleClick = jest.fn();
const setAmountMock = jest.fn();
const selectTokenClickMock = jest.fn();

const token = {
  address: '0x123' as Address,
  chainId: 1,
  decimals: 2,
  image: 'imageURL',
  name: 'Ether',
  symbol: 'ETH',
};

describe('AmountInput Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', async () => {
    render(
      <AmountInput
        selectedToken={token}
        label="You pay"
        setAmount={setAmountMock}
        selectTokenClick={selectTokenClickMock}
        amount="1"
      />,
    );

    const amountInputComponent = screen.getByTestId('AmountInput');
    expect(amountInputComponent).toBeInTheDocument();

    const labelElement = within(amountInputComponent).getByText('You pay');
    expect(labelElement).toBeInTheDocument();
  });

  it('should update the amount if a user enters a number', async () => {
    render(
      <AmountInput
        selectedToken={token}
        label="You pay"
        setAmount={setAmountMock}
        selectTokenClick={selectTokenClickMock}
      />,
    );

    const input = screen.getByTestId('AmountInput_input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '2' } });
    expect(setAmountMock).toHaveBeenCalledWith('2');
    expect(input.value).toBe('2');
  });

  it('should not update the amount if a user enters a non-number', async () => {
    render(
      <AmountInput
        selectedToken={token}
        label="You pay"
        setAmount={setAmountMock}
        selectTokenClick={selectTokenClickMock}
        amount="1"
      />,
    );

    const input = screen.getByTestId('AmountInput_input') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'a' } });
    expect(setAmountMock).not.toHaveBeenCalledWith('a');
    expect(input.value).toBe('1');
  });
});
