import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Token } from '../types';
import { TokenRow } from './TokenRow';

vi.mock('@/internal/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

const EXAMPLE_TOKEN: Token = {
  address: '0x1234',
  chainId: 1,
  decimals: 18,
  image:
    'https://dynamic-assets.coinbase.com/dbb4b4983bde81309ddab83eb598358eb44375b930b94687ebe38bc22e52c3b2125258ffb8477a5ef22e33d6bd72e32a506c391caa13af64c00e46613c3e5806/asset_icons/4113b082d21cc5fab17fc8f2d19fb996165bcce635e6900f7fc2d57c4ef33ae9.png',
  name: 'Ether',
  symbol: 'ETH',
};

describe('TokenRow component', () => {
  it('should render a circle if token.image is null', async () => {
    const token = {
      ...EXAMPLE_TOKEN,
      image: null,
    };

    render(<TokenRow token={token} />);

    await waitFor(() => {
      const circle = screen.getByTestId('ockTokenImage_NoImage');
      expect(circle).toBeInTheDocument();
    });
  });

  it('should render the image if token.image is provided', async () => {
    render(<TokenRow token={EXAMPLE_TOKEN} />);

    await waitFor(() => {
      const tokenImage = screen.getByTestId('ockTokenImage_Image');
      expect(tokenImage).toBeInTheDocument();
    });
  });

  it('should not render amount if amount is undefined', async () => {
    render(<TokenRow token={EXAMPLE_TOKEN} amount={undefined} />);

    await waitFor(() => {
      const tokenAmount = screen.getByTestId('ockTokenRow_Amount');
      expect(tokenAmount.textContent).toEqual('');
    });
  });

  it('should render amount with 5 maximum decimal if less than 1', async () => {
    render(<TokenRow token={EXAMPLE_TOKEN} amount="0.00234567" />);

    await waitFor(() => {
      const tokenAmount = screen.getByTestId('ockTokenRow_Amount');
      expect(tokenAmount.textContent).toEqual('0.00235');
    });
  });

  it('should render amount with 2 maximum fraction digit if greater than 1', async () => {
    render(<TokenRow token={EXAMPLE_TOKEN} amount="100.1234" />);

    await waitFor(() => {
      const tokenAmount = screen.getByTestId('ockTokenRow_Amount');
      expect(tokenAmount.textContent).toEqual('100.12');
    });
  });

  it('should render amount with 2 maximum fraction digit if equal to 1', async () => {
    render(<TokenRow key="" token={EXAMPLE_TOKEN} amount="1" />);

    await waitFor(() => {
      const tokenAmount = screen.getByTestId('ockTokenRow_Amount');
      expect(tokenAmount.textContent).toEqual('1.00');
    });
  });

  it('should register a click on press', async () => {
    const handleClick = vi.fn();
    render(<TokenRow key="" token={EXAMPLE_TOKEN} onClick={handleClick} />);

    const tokenRow = screen.getByTestId('ockTokenRow_Container');

    fireEvent.click(tokenRow);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
