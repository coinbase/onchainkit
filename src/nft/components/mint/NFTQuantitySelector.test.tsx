import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { useMintAnalytics } from '@/nft/hooks/useMintAnalytics';
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
vi.mock('@/nft/hooks/useMintAnalytics');
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
  const handleQuantityChangeMock = vi.fn();
  const useNFTContextMock = useNFTContext as Mock;

  beforeEach(() => {
    useNFTContextMock.mockReturnValue({
      maxMintsPerWallet: 5,
      setQuantity: setQuantityMock,
    });
    (useMintAnalytics as Mock).mockReturnValue({
      handleQuantityChange: handleQuantityChangeMock,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render quantity selector', () => {
    const { getByRole } = render(<NFTQuantitySelector />);
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('should not render when maxMintsPerWallet is 1', () => {
    useNFTContextMock.mockReturnValueOnce({ maxMintsPerWallet: 1 });
    const { container } = render(<NFTQuantitySelector />);
    expect(container.firstChild).toBeNull();
  });

  it('should update quantity and trigger analytics on valid numeric input', () => {
    const { getByRole } = render(<NFTQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;

    act(() => {
      input.focus();
      fireEvent.change(input, { target: { value: '3' } });
      input.blur();
    });

    expect(setQuantityMock).toHaveBeenCalledWith('3');
    expect(handleQuantityChangeMock).toHaveBeenCalledWith(3);
  });

  it('should update quantity but not trigger analytics on invalid input', () => {
    const { getByRole } = render(<NFTQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;

    act(() => {
      input.focus();
      fireEvent.change(input, { target: { value: 'abc' } });
      input.blur();
    });

    expect(setQuantityMock).toHaveBeenCalledWith('abc');
    expect(handleQuantityChangeMock).not.toHaveBeenCalled();
  });

  it('should apply the provided className to container and input', () => {
    const className = 'custom-class';
    const { container } = render(<NFTQuantitySelector className={className} />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should set correct min and max quantity constraints', () => {
    const { getByRole } = render(<NFTQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).toHaveAttribute('data-minquantity', '1');
    expect(input).toHaveAttribute('data-maxquantity', '5');
  });

  it('should not set maxQuantity when maxMintsPerWallet is undefined', () => {
    useNFTContextMock.mockReturnValueOnce({ maxMintsPerWallet: undefined });
    const { getByRole } = render(<NFTQuantitySelector />);
    const input = getByRole('textbox') as HTMLInputElement;
    expect(input).not.toHaveAttribute('data-maxquantity');
  });
});
