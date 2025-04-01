import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { fireEvent, render } from '@testing-library/react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { NFTTotalCost } from './NFTTotalCost';

vi.mock('@/nft/components/NFTProvider');

describe('NFTTotalCost', () => {
  const mockUseNFTContext = useNFTContext as Mock;

  beforeEach(() => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '0.05',
        currency: 'ETH',
        amountUSD: '20',
      },
      mintFee: {
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
    const { getByText } = render(<NFTTotalCost />);

    expect(getByText('Total cost')).toBeInTheDocument();
    expect(getByText('$40.00')).toBeInTheDocument();
  });

  it('should render correctly with a whole number decimal', () => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '1',
        currency: 'ETH',
        amountUSD: '2000',
      },
      mintFee: {
        amount: '0.05',
        currency: 'ETH',
        amountUSD: '20',
      },
      quantity: 1,
    });

    const { getByText } = render(<NFTTotalCost />);

    expect(getByText('Total cost')).toBeInTheDocument();
    expect(getByText('$2,000.00')).toBeInTheDocument();
  });

  it('should not render if price is 0', () => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '0',
        currency: 'ETH',
        amountUSD: 0,
      },
      mintFee: {
        amount: '0.05',
        currency: 'ETH',
        amountUSD: '20',
      },
      quantity: 1,
    });

    const { queryByText } = render(<NFTTotalCost />);

    expect(queryByText('Total cost')).toBeNull();
  });

  it('should not render if mintFee is 0', () => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '0.05',
        currency: 'ETH',
        amountUSD: '20',
      },
      mintFee: {
        amount: '0',
        currency: 'ETH',
        amountUSD: 0,
      },
      quantity: 1,
    });

    const { queryByText } = render(<NFTTotalCost />);

    expect(queryByText('Total cost')).toBeNull();
  });

  it('should return null if price amount is not available', () => {
    mockUseNFTContext.mockReturnValueOnce({
      price: null,
      quantity: 1,
    });

    const { container } = render(<NFTTotalCost />);

    expect(container.firstChild).toBeNull();
  });

  it('should apply the provided className', () => {
    const { container } = render(<NFTTotalCost className="custom-class" />);

    expect(container.firstChild?.firstChild).toHaveClass('custom-class');
  });

  it('should show overlay on mouse enter', () => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '0.05',
        currency: 'ETH',
        amountUSD: '20',
      },
      quantity: 2,
      mintFee: {
        amount: '0.01',
        currency: 'ETH',
        amountUSD: '5',
      },
    });

    const { getByTestId, getByText, queryByText } = render(<NFTTotalCost />);

    fireEvent.mouseEnter(getByTestId('ockNFTTotalCostInfo'));

    expect(getByText('Total cost')).toBeInTheDocument();
    expect(getByText('Mint fee')).toBeInTheDocument();

    fireEvent.mouseLeave(getByTestId('ockNFTTotalCostInfo'));

    expect(queryByText('Mint fee')).toBeNull();
  });

  it('should show overlay on click', () => {
    mockUseNFTContext.mockReturnValue({
      price: {
        amount: '0.05',
        currency: 'ETH',
        amountUSD: '20',
      },
      quantity: 2,
      mintFee: {
        amount: '0.01',
        currency: 'ETH',
        amountUSD: '5',
      },
    });

    const { getByTestId, getByText, queryByText } = render(<NFTTotalCost />);

    fireEvent.click(getByTestId('ockNFTTotalCostInfo'));

    expect(getByText('Total cost')).toBeInTheDocument();
    expect(getByText('Mint fee')).toBeInTheDocument();

    fireEvent.click(getByTestId('ockNFTTotalCostInfo'));

    expect(queryByText('Mint fee')).toBeNull();
  });
});
