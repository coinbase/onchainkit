import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Token } from '../types';
import { TokenImage } from './TokenImage';

const tokenWithImage: Token = {
  name: 'Ethereum',
  address: '0x123',
  symbol: 'ETH',
  decimals: 18,
  image:
    'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
  chainId: 8453,
};

const tokenWithNoImage: Token = {
  name: 'Ethereum',
  address: '0x123',
  symbol: 'ETH',
  decimals: 18,
  image: null,
  chainId: 8453,
};

describe('TokenImage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render token with image', async () => {
    render(<TokenImage token={tokenWithImage} />);
    const imgElement = screen.getByTestId('ockTokenImage_Image');
    const noImgElement = screen.queryByTestId('ockTokenImage_NoImage');

    expect(imgElement).toBeInTheDocument();
    expect(noImgElement).toBeNull();
  });

  it('should render token with no image', async () => {
    render(<TokenImage token={tokenWithNoImage} />);
    const imgElement = screen.queryByTestId('ockTokenImage_Image');
    const noImgElement = screen.getByTestId('ockTokenImage_NoImage');

    expect(imgElement).toBeNull();
    expect(noImgElement).toBeInTheDocument();
  });

  it('should render with size prop', async () => {
    render(<TokenImage token={tokenWithNoImage} size={16} />);
    const imgElement = screen.queryByTestId('ockTokenImage_Image');
    const noImgElement = screen.getByTestId('ockTokenImage_NoImage');

    expect(imgElement).toBeNull();
    expect(noImgElement).toBeInTheDocument();
  });
});
