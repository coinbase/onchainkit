import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { fireEvent, render } from '@testing-library/react';
import { act } from 'react';
import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';
import { NFTQuantitySelector } from './NFTQuantitySelector';

vi.mock('@/nft/components/NFTProvider');

vi.mock('@/internal/components/QuantitySelector', () => ({
  QuantitySelector: ({
    onChange,
    minQuantity,
    maxQuantity,
  }: {
    onChange: (s: string) => void;
    minQuantity: string;
    maxQuantity: string;
  }) => (
    <input
      type="text"
      onChange={(e) => onChange(e.target.value)}
      data-minquantity={minQuantity}
      data-maxquantity={maxQuantity}
    />
  ),
}));

describe('NFTQuantitySelector', () => {
  const setQuantityMock = vi.fn();
  const useNFTContextMock = useNFTContext as Mock;

  beforeEach(() => {
    useNFTContextMock.mockReturnValue({
      maxMintsPerWallet: 5,
      setQuantity: setQuantityMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const { getByRole } = render(<NFTQuantitySelector />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('should not render when maxMintsPerWallet is 1', () => {
    useNFTContextMock.mockReturnValueOnce({ maxMintsPerWallet: 1 });
    const { container } = render(<NFTQuantitySelector />);
    expect(container.firstChild).toBeNull();
  });

  it('should call setQuantity on change', () => {
    const { getByRole } = render(<NFTQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;
    act(() => {
      input.focus();
      fireEvent.change(input, { target: { value: '3' } });
      input.blur();
    });
    expect(setQuantityMock).toHaveBeenCalledWith('3');
  });

  it('should apply the provided className', () => {
    const className = 'custom-class';
    const { container } = render(<NFTQuantitySelector className={className} />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should set minQuantity to 1 and maxQuantity to maxMintsPerWallet', () => {
    const { getByRole } = render(<NFTQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveAttribute('data-minquantity', '1');
    expect(input).toHaveAttribute('data-maxquantity', '5');
  });

  it('should set maxQuantity to undefined when maxMintsPerWallet is undefined', () => {
    useNFTContextMock.mockReturnValueOnce({ maxMintsPerWallet: undefined });
    const { getByRole } = render(<NFTQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).not.toHaveAttribute('data-maxquantity');
  });
});
