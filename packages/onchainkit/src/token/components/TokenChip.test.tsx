import '@testing-library/jest-dom';
import { fireEvent, render, screen, within } from '@testing-library/react';
import type { Address } from 'viem';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TokenChip } from './TokenChip';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('TokenChip Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', async () => {
    const token = {
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      image: 'imageURL',
      name: 'Ether',
      symbol: 'ETH',
    };
    render(<TokenChip token={token} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();

    const imgElement = within(buttonElement).getByRole('img');
    const spanElement = within(buttonElement).getByText(token.symbol);

    expect(imgElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
  });

  it('should render a placeholder if no image', async () => {
    const token = {
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      image: null,
      name: 'Ether',
      symbol: 'ETH',
    };
    render(<TokenChip token={token} />);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();

    const imgElement = screen.getByTestId('ockTokenImage_NoImage');
    const spanElement = within(buttonElement).getByText(token.symbol);

    expect(imgElement).toBeInTheDocument();
    expect(spanElement).toBeInTheDocument();
  });

  it('should register a click on press', async () => {
    const token = {
      address: '0x123' as Address,
      chainId: 1,
      decimals: 2,
      image: 'imageURL',
      name: 'Ether',
      symbol: 'ETH',
    };
    const handleClick = vi.fn();
    render(<TokenChip token={token} onClick={handleClick} />);

    const button = screen.getByTestId('ockTokenChip_Button');

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
