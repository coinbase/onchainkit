import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NftMint } from './NftMint';
import { NftMintProvider } from './NftMintProvider';
import { useIsMounted } from '../../useIsMounted';
import {
  type Mock,
  vi,
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
} from 'vitest';

vi.mock('../../useIsMounted');
vi.mock('./NftMintProvider', () => ({
  NftMintProvider: vi.fn(({ children }) => <div>{children}</div>),
}));
vi.mock('./NftViewProvider', () => ({
  NftViewProvider: vi.fn(({ children }) => <div>{children}</div>),
}));

describe('NftMint', () => {
  beforeEach(() => {
    (useIsMounted as Mock).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly when mounted', () => {
    const { getByTestId, getByText } = render(
      <NftMint contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NftMint>,
    );

    expect(getByTestId('ockNftMint_Container')).toBeInTheDocument();
    expect(getByText('Child Component')).toBeInTheDocument();
    expect(getByTestId('ockNftMint_Container')).toHaveClass('test-class');
  });

  it('should not render when not mounted', () => {
    (useIsMounted as Mock).mockReturnValue(false);

    const { queryByTestId } = render(
      <NftMint contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NftMint>,
    );

    expect(queryByTestId('ockNftMint_Container')).not.toBeInTheDocument();
  });

  it('should pass contractAddress and tokenId to NftMintProvider', () => {
    render(
      <NftMint contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NftMint>,
    );

    expect(NftMintProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: '0x123',
        tokenId: '1',
      }),
      {},
    );
  });
});
