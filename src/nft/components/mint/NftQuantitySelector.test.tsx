import '@testing-library/jest-dom';
import { ChangeEvent, act } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { NftQuantitySelector } from './NftQuantitySelector';
import { useNftMintContext } from '../NftMintProvider';
import {
  type Mock,
  vi,
  describe,
  afterEach,
  beforeEach,
  it,
  expect,
} from 'vitest';

vi.mock('../NftMintProvider');

vi.mock('../../../internal/components/QuantitySelector', () => ({
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

describe('NftQuantitySelector', () => {
  const setQuantityMock = vi.fn();
  const useNftMintContextMock = useNftMintContext as Mock;

  beforeEach(() => {
    useNftMintContextMock.mockReturnValue({
      maxMintsPerWallet: 5,
      setQuantity: setQuantityMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const { getByRole } = render(<NftQuantitySelector />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('should not render when maxMintsPerWallet is 1', () => {
    useNftMintContextMock.mockReturnValueOnce({ maxMintsPerWallet: 1 });
    const { container } = render(<NftQuantitySelector />);
    expect(container.firstChild).toBeNull();
  });

  it('should call setQuantity on change', () => {
    const { getByRole } = render(<NftQuantitySelector />);
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
    const { container } = render(<NftQuantitySelector className={className} />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should set minQuantity to 1 and maxQuantity to maxMintsPerWallet', () => {
    const { getByRole } = render(<NftQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveAttribute('data-minquantity', '1');
    expect(input).toHaveAttribute('data-maxquantity', '5');
  });

  it('should set maxQuantity to undefined when maxMintsPerWallet is undefined', () => {
    useNftMintContextMock.mockReturnValueOnce({ maxMintsPerWallet: undefined });
    const { getByRole } = render(<NftQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).not.toHaveAttribute('data-maxquantity');
  });
});
