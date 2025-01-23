import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import type { Token } from '../types';
import { TokenSelectModal } from './TokenSelectModal';

const tokens: Token[] = [
  {
    name: 'Ethereum',
    address: '0x123' as Address,
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
];

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('TokenSelectModal', () => {
  const options = tokens;
  const setToken = vi.fn();
  const token = tokens[0];

  it('renders the TokenSelectButton and does not render TokenSelectModalInner initially', () => {
    render(
      <TokenSelectModal options={options} setToken={setToken} token={token} />,
    );

    expect(
      screen.getByTestId('ockTokenSelectButton_Button'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('ockTokenSelectModal_Inner')).toBeNull();
  });

  it('closes the modal when the close button inside the modal is clicked', () => {
    render(
      <TokenSelectModal options={options} setToken={setToken} token={token} />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    const closeButton = screen.getByTestId('TokenSelectModal_CloseButton');
    fireEvent.click(closeButton);

    expect(
      screen.queryByTestId('ockTokenSelectModal_Inner'),
    ).not.toBeInTheDocument();
  });

  it('should display no result when search returns an empty result', () => {
    render(
      <TokenSelectModal options={options} setToken={setToken} token={token} />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    const textInput = screen.getByTestId('ockTextInput_Input');

    fireEvent.change(textInput, { target: { value: 'test' } });

    expect(
      screen.getByTestId('ockTokenSelectModal_NoTokens'),
    ).toBeInTheDocument();
  });

  it('should display selected token when token chip is selected', () => {
    render(
      <TokenSelectModal options={options} setToken={setToken} token={token} />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    const textInput = screen.getByTestId('ockTextInput_Input');

    fireEvent.change(textInput, { target: { value: 'eth' } });

    const tokenChip = screen.getByTestId('ockTokenChip_Button');
    fireEvent.click(tokenChip);

    expect(button).toHaveTextContent('ETH');
  });

  it('should display selected token when token row is selected', () => {
    render(
      <TokenSelectModal options={options} setToken={setToken} token={token} />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    const textInput = screen.getByTestId('ockTextInput_Input');

    fireEvent.change(textInput, { target: { value: 'eth' } });

    const tokenChip = screen.getByTestId('ockTokenRow_Container');
    fireEvent.click(tokenChip);

    expect(button).toHaveTextContent('ETH');
  });
});
