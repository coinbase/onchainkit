/**
 * @vitest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SwapAmountInput } from './SwapAmountInput';
import { useSwapContext } from './SwapProvider';
import type { Token } from '../../token';
import type { SwapContextType } from '../types';
import { beforeEach, describe, expect, it, vi, Mock } from 'vitest';

vi.mock('../../token', () => ({
  TokenChip: vi.fn(() => <div>TokenChip</div>),
  TokenSelectDropdown: vi.fn(() => <div>TokenSelectDropdown</div>),
}));

vi.mock('./SwapProvider', () => ({
  useSwapContext: vi.fn(),
}));

vi.mock('wagmi', () => ({
  useBalance: vi.fn(),
}));

const useSwapContextMock = useSwapContext as Mock;

const mockETHToken: Token = {
  name: 'ETH',
  address: '0x123456789',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

const mockToken: Token = {
  name: 'USDC',
  address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  symbol: 'USDC',
  decimals: 6,
  image:
    'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
  chainId: 8453,
};

const mockContextValue = {
  from: {
    amount: '10',
    balance: '0.0002851826238227',
    setAmount: vi.fn(),
    setLoading: vi.fn(),
    setToken: vi.fn(),
    loading: false,
    token: undefined,
  },
  to: {
    amount: '20',
    setAmount: vi.fn(),
    setLoading: vi.fn(),
    setToken: vi.fn(),
    loading: false,
    token: undefined,
  },
  loading: false,
  handleToggle: vi.fn(),
  handleSubmit: vi.fn(),
  handleAmountChange: vi.fn(),
} as SwapContextType;

const mockContextValueWithoutConvertedBalance = {
  ...mockContextValue,
  convertedFromTokenBalance: undefined,
};

const mockSwappableTokens: Token[] = [
  {
    name: 'Ethereum',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
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

const SwapProvider = describe('SwapAmountInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with the correct label and token', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="from" />);

    expect(screen.getByText('From')).toBeInTheDocument();
  });

  it('renders from token input with max button and balance', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="from" />);
    expect(screen.getByText('Balance: 0.00028518')).toBeInTheDocument();
    expect(
      screen.getByTestId('ockSwapAmountInput_MaxButton'),
    ).toBeInTheDocument();
  });

  it('does not render max button for to token input', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="to" />);
    expect(
      screen.queryByTestId('ockSwapAmountInput_MaxButton'),
    ).not.toBeInTheDocument();
  });

  it('updates input value with balance amount on max button click', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="from" />);

    const maxButton = screen.getByTestId('ockSwapAmountInput_MaxButton');
    fireEvent.click(maxButton);

    expect(mockContextValue.from.setAmount).toHaveBeenCalledWith(
      '0.0002851826238227',
    );
  });

  // it('does not update input value with balance amount on max button click when convertedBalance is undefined', () => {
  //   render(
  //     <SwapProvider value={mockContextValueWithoutConvertedBalance}>
  //       <SwapAmountInput label="From" token={mockETHToken} type="from" />
  //     </SwapProvider>,
  //   );
  //
  //   const maxButton = screen.getByTestId('ockSwapAmountInput_MaxButton');
  //   fireEvent.click(maxButton);
  //
  //   expect(mockContextValue.setFromAmount).not.toHaveBeenCalled();
  // });

  it('displays the correct amount when this type is "from"', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="from" />);

    const input = screen.getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('10');
  });

  it('displays the correct amount when this type is "to"', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="To" token={mockETHToken} type="to" />);

    const input = screen.getByTestId('ockTextInput_Input');
    expect(input).toHaveValue('20');
  });

  it('calls setFromAmount when type is "from" and valid input is entered', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="from" />);

    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '15' } });

    expect(mockContextValue.from.setAmount).toHaveBeenCalledWith('15');
  });

  it('calls setToAmount when type is "to" and valid input is entered', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="to" />);

    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: '15' } });

    expect(mockContextValue.to.setAmount).toHaveBeenCalledWith('15');
  });

  it('does not call setAmount when invalid input is entered', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="from" />);

    const input = screen.getByTestId('ockTextInput_Input');
    fireEvent.change(input, { target: { value: 'invalid' } });

    expect(mockContextValue.from.setAmount).not.toHaveBeenCalled();
  });

  it('calls setFromToken when type is "from" and token prop is provided', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="From" token={mockETHToken} type="from" />);

    expect(mockContextValue.from.setToken).toHaveBeenCalledWith(mockETHToken);
  });

  it('calls setToToken when type is "to" and token prop is provided', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(<SwapAmountInput label="To" token={mockETHToken} type="to" />);

    expect(mockContextValue.to.setToken).toHaveBeenCalledWith(mockETHToken);
  });

  // it('renders the correct balance', () => {
  //   useSwapContextMock.mockReturnValue(mockContextValue);
  //   render(<SwapAmountInput label="To" token={mockToken} type="to" />);
  //
  //   expect(screen.getByText('Balance: 3304007.277394')).toBeInTheDocument();
  // });

  it('renders a TokenSelectDropdown component if swappableTokens are passed as prop', () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(
      <SwapAmountInput
        label="To"
        swappableTokens={mockSwappableTokens}
        token={mockToken}
        type="to"
      />,
    );

    const dropdown = screen.getByText('TokenSelectDropdown');
    expect(dropdown).toBeInTheDocument();
  });

  // it('renders a TokenChip component if swappableTokens are not passed as prop', () => {
  //   useSwapContextMock.mockReturnValue(mockContextValue);
  //   render(<SwapAmountInput label="To" token={mockToken} type="to" />);
  //
  //   const dropdown = screen.getByText('TokenChip');
  //   expect(dropdown).toBeInTheDocument();
  // });

  it('applies the given className to the button', async () => {
    useSwapContextMock.mockReturnValue(mockContextValue);
    render(
      <SwapAmountInput
        label="From"
        token={mockETHToken}
        type="from"
        className="custom-class"
      />,
    );

    expect(screen.getByTestId('ockSwapAmountInput_Container')).toHaveClass(
      'custom-class',
    );
  });
});
