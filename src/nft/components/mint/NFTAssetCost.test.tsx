import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { render } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { NFTAssetCost } from './NFTAssetCost';

vi.mock('@/nft/components/NFTProvider');

describe('NFTAssetCost', () => {
  const mockUseNFTContext = useNFTContext as Mock;

  beforeEach(() => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '0.05',
        currency: 'ETH',
        amountUSD: '20',
      },
      quantity: 2,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with given price and quantity', () => {
    const { getByText } = render(<NFTAssetCost />);

    expect(getByText('0.1 ETH')).toBeInTheDocument();
    expect(getByText('~')).toBeInTheDocument();
    expect(getByText('$40.00')).toBeInTheDocument();
  });

  it('should render correctly with a whole number decimal', () => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '1',
        currency: 'ETH',
        amountUSD: '2000',
      },
      quantity: 1,
    });

    const { getByText } = render(<NFTAssetCost />);

    expect(getByText('1 ETH')).toBeInTheDocument();
    expect(getByText('~')).toBeInTheDocument();
    expect(getByText('$2,000.00')).toBeInTheDocument();
  });

  it('should render free if price is 0', () => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '0',
        currency: 'ETH',
        amountUSD: '0',
      },
      quantity: 1,
    });

    const { getByText } = render(<NFTAssetCost />);

    expect(getByText('Free')).toBeInTheDocument();
  });

  it('should return null if price amount is not available', () => {
    mockUseNFTContext.mockReturnValueOnce({
      price: null,
      quantity: 1,
    });

    const { container } = render(<NFTAssetCost />);

    expect(container.firstChild).toBeNull();
  });

  it('should apply the provided className', () => {
    const { container } = render(<NFTAssetCost className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
