import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Address } from 'viem';
import { describe, expect, it, vi } from 'vitest';
import { TokenSelectButton } from './TokenSelectButton';

describe('TokenSelectButton', () => {
  const token = {
    name: 'Ethereum',
    address: '0x123' as Address,
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    blockchain: 'eth',
    chainId: 8453,
  };

  it('renders correctly without a token', () => {
    render(
      <TokenSelectButton token={undefined} onClick={vi.fn()} isOpen={false} />,
    );

    expect(screen.getByText('Select token')).toBeInTheDocument();
    expect(screen.queryByTestId('ockTokenSelectButton_Symbol')).toBeNull();
    expect(screen.getByTestId('ock-caretDownSvg')).toBeInTheDocument();
  });

  it('renders correctly with a token when isOpen is true', () => {
    render(
      <TokenSelectButton token={token} onClick={vi.fn()} isOpen={false} />,
    );

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByTestId('ock-caretDownSvg')).toBeInTheDocument();
    expect(screen.queryByTestId('ock-caretUpSvg')).toBeNull();
    expect(screen.queryByText('Select token')).toBeNull();
  });

  it('renders correctly with a token when isOpen is false', () => {
    render(<TokenSelectButton token={token} onClick={vi.fn()} isOpen={true} />);

    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.getByTestId('ock-caretUpSvg')).toBeInTheDocument();
    expect(screen.queryByTestId('ock-caretDownSvg')).toBeNull();
    expect(screen.queryByText('Select token')).toBeNull();
  });

  it('handles click handler', () => {
    const onClick = vi.fn();
    render(
      <TokenSelectButton token={token} onClick={onClick} isOpen={false} />,
    );

    const button = screen.getByTestId('ockTokenSelectButton_Button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });
});
