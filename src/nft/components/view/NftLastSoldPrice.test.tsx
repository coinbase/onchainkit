import '@testing-library/jest-dom';
import {
  type Mock,
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
} from 'vitest';
import { render } from '@testing-library/react';
import { NftLastSoldPrice } from './NftLastSoldPrice';
import { useNftContext } from '../NftProvider';
import { useEthPrice } from '../../../internal/hooks/useEthPrice';
import { convertWeiToEther } from '../../utils/convertWeiToEther';

vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));
vi.mock('../../../internal/hooks/useEthPrice', () => ({
  useEthPrice: vi.fn(),
}));
vi.mock('../../utils/convertWeiToEther', () => ({
  convertWeiToEther: vi.fn(),
}));

describe('NftLastSoldPrice', () => {
  beforeEach(() => {
    (useNftContext as Mock).mockReturnValue({
      lastSoldPrice: {
        price: '1000000000000000000',
        currency: '0x0000000000000000000000000000000000000000',
      },
    });
    (useEthPrice as Mock).mockReturnValue({ data: 3000 });
    (convertWeiToEther as Mock).mockReturnValue(1);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with ETH currency', () => {
    const { getByText } = render(<NftLastSoldPrice />);
    expect(getByText('Mint price')).toBeInTheDocument();
    expect(getByText('1 ETH')).toBeInTheDocument();
    expect(getByText('$3,000.00')).toBeInTheDocument();
  });

  it('should not display currency if unrecognized', () => {
    (useNftContext as Mock).mockReturnValue({
      lastSoldPrice: {
        price: '1000000000000000000',
        currency: '0x000000000000000000000000000000000001',
      },
    });
    const { getByText } = render(<NftLastSoldPrice />);
    expect(getByText('Mint price')).toBeInTheDocument();
    expect(getByText('1')).toBeInTheDocument();
    expect(getByText('$3,000.00')).toBeInTheDocument();
  });

  it('should render null if price is not available', () => {
    (useNftContext as Mock).mockReturnValue({
      lastSoldPrice: {
        price: null,
        currency: '0x0000000000000000000000000000000000000000',
      },
    });
    const { container } = render(<NftLastSoldPrice />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if currency is not available', () => {
    (useNftContext as Mock).mockReturnValue({
      lastSoldPrice: { price: '1000000000000000000', currency: null },
    });
    const { container } = render(<NftLastSoldPrice />);
    expect(container.firstChild).toBeNull();
  });

  it('should render null if ethPrice data is not available', () => {
    (useEthPrice as Mock).mockReturnValue({ data: null });
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
