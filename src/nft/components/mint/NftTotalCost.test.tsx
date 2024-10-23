import '@testing-library/jest-dom';
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
import { useNftContext } from '../NftProvider';
import { NftTotalCost } from './NftTotalCost';

vi.mock('../NftProvider');

describe('NftTotalCost', () => {
  const mockUseNftContext = useNftContext as Mock;

  beforeEach(() => {
    mockUseNftContext.mockReturnValue({
      price: {
        amount: 0.05,
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
    const { getByText } = render(<NftTotalCost />);

    expect(getByText('Total cost')).toBeInTheDocument();
    expect(getByText('$40.00')).toBeInTheDocument();
  });

  it('should render correctly with a whole number decimal', () => {
    mockUseNftContext.mockReturnValue({
      price: {
        amount: 1,
        currency: 'ETH',
        amountUSD: '2000',
      },
      quantity: 1,
    });

    const { getByText } = render(<NftTotalCost />);

    expect(getByText('Total cost')).toBeInTheDocument();
    expect(getByText('$2,000.00')).toBeInTheDocument();
  });

  it('should not render if price is 0', () => {
    mockUseNftContext.mockReturnValue({
      price: {
        amount: 0,
        currency: 'ETH',
        amountUSD: 0,
      },
      quantity: 1,
    });

    const { queryByText } = render(<NftTotalCost />);

    expect(queryByText('Total cost')).toBeNull();
  });

  it('should return null if price amount is not available', () => {
    mockUseNftContext.mockReturnValueOnce({
      price: null,
      quantity: 1,
    });

    const { container } = render(<NftTotalCost />);

    expect(container.firstChild).toBeNull();
  });

  it('should apply the provided className', () => {
    const { container } = render(<NftTotalCost className="custom-class" />);

    expect(container.firstChild?.firstChild).toHaveClass('custom-class');
  });

  it('should show overlay on mouse enter', () => {
    mockUseNftContext.mockReturnValue({
      price: {
        amount: 0.05,
        currency: 'ETH',
        amountUSD: '20',
      },
      quantity: 2,
      mintFee: {
        amount: 0.01,
        currency: 'ETH',
        amountUSD: '5',
      },
    });

    const { getByTestId, getByText, queryByText } = render(<NftTotalCost />);

    fireEvent.mouseEnter(getByTestId('ockNftTotalCostInfo'));

    expect(getByText('Total cost')).toBeInTheDocument();
    expect(getByText('Mint fee')).toBeInTheDocument();

    fireEvent.mouseLeave(getByTestId('ockNftTotalCostInfo'));

    expect(queryByText('Mint fee')).toBeNull();
  });

  it('should show overlay on click', () => {
    mockUseNftContext.mockReturnValue({
      price: {
        amount: 0.05,
        currency: 'ETH',
        amountUSD: '20',
      },
      quantity: 2,
      mintFee: {
        amount: 0.01,
        currency: 'ETH',
        amountUSD: '5',
      },
    });

    const { getByTestId, getByText, queryByText } = render(<NftTotalCost />);

    fireEvent.click(getByTestId('ockNftTotalCostInfo'));

    expect(getByText('Total cost')).toBeInTheDocument();
    expect(getByText('Mint fee')).toBeInTheDocument();

    fireEvent.click(getByTestId('ockNftTotalCostInfo'));

    expect(queryByText('Mint fee')).toBeNull();
  });
});
