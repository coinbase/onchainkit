import '@testing-library/jest-dom';
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
import { useNftContext } from '../NftProvider';
import { NftLastSoldPrice } from './NftLastSoldPrice';

vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));

describe('NftLastSoldPrice', () => {
  beforeEach(() => {
    (useNftContext as Mock).mockReturnValue({
      lastSoldPrice: {
        amount: '1',
        currency: 'ETH',
        amountUSD: '3000',
      },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const { getByText } = render(<NftLastSoldPrice />);
    expect(getByText('Mint price')).toBeInTheDocument();
    expect(getByText('1 ETH')).toBeInTheDocument();
    expect(getByText('$3,000.00')).toBeInTheDocument();
  });

  it('should render null if price is not available', () => {
    (useNftContext as Mock).mockReturnValue({
      lastSoldPrice: {
        amount: null,
        currency: 'ETH',
      },
    });
    const { container } = render(<NftLastSoldPrice />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if currency is not available', () => {
    (useNftContext as Mock).mockReturnValue({
      lastSoldPrice: { amount: '100', currency: null, amountUSD: '3000' },
    });
    const { container } = render(<NftLastSoldPrice />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply custom className', () => {
    const { getByText } = render(<NftLastSoldPrice className="custom-class" />);
    expect(getByText('Mint price').parentElement).toHaveClass('custom-class');
  });

  it('should display custom label', () => {
    const { getByText } = render(<NftLastSoldPrice label="Last Sold Price" />);
    expect(getByText('Last Sold Price')).toBeInTheDocument();
  });
});
