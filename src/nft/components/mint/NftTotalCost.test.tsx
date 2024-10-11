import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { useNftMintContext } from '../NftMintProvider';
import { useEthPrice } from '../../../internal/hooks/useEthPrice';
import {
  type Mock,
  vi,
  afterEach,
  beforeEach,
  describe,
  it,
  expect,
} from 'vitest';
import { NftTotalCost } from './NftTotalCost';

vi.mock('../NftMintProvider');
vi.mock('../../../internal/hooks/useEthPrice');

describe('NftTotalCost', () => {
  const mockUseNftMintContext = useNftMintContext as Mock;
  const mockUseEthPrice = useEthPrice as Mock;

  beforeEach(() => {
    mockUseNftMintContext.mockReturnValue({
      price: {
        amount: 0.05,
        currency: 'ETH',
      },
      quantity: 2,
    });

    mockUseEthPrice.mockReturnValue({
      data: 2000,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with given price and quantity', () => {
    const { getByText } = render(<NftTotalCost />);

    expect(getByText('0.1 ETH')).toBeInTheDocument();
    expect(getByText('~')).toBeInTheDocument();
    expect(getByText('$200.00')).toBeInTheDocument();
  });

  it('should render correctly with a whole number decimal', () => {
    mockUseNftMintContext.mockReturnValue({
      price: {
        amount: 1,
        currency: 'ETH',
      },
      quantity: 1,
    });

    const { getByText } = render(<NftTotalCost />);

    expect(getByText('1 ETH')).toBeInTheDocument();
    expect(getByText('~')).toBeInTheDocument();
    expect(getByText('$2,000.00')).toBeInTheDocument();
  });

  it('should render free if price is 0', () => {
    mockUseNftMintContext.mockReturnValue({
      price: {
        amount: 0,
        currency: 'ETH',
      },
      quantity: 1,
    });

    const { getByText } = render(<NftTotalCost />);

    expect(getByText('Free')).toBeInTheDocument();
  });

  it('should return null if price amount is not available', () => {
    mockUseNftMintContext.mockReturnValueOnce({
      price: null,
      quantity: 1,
    });

    const { container } = render(<NftTotalCost />);

    expect(container.firstChild).toBeNull();
  });

  it('should return null if eth price data is not available', () => {
    mockUseEthPrice.mockReturnValueOnce({
      data: null,
    });

    const { container } = render(<NftTotalCost />);

    expect(container.firstChild).toBeNull();
  });

  it('should apply the provided className', () => {
    const { container } = render(<NftTotalCost className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
