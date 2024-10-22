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
import { useIsMounted } from '../../useIsMounted';
import { NFTProvider } from './NFTProvider';
import { NFTView } from './NFTView';

vi.mock('../../useTheme', () => ({
  useTheme: vi.fn(() => 'default-light'),
}));
vi.mock('../../useIsMounted');
vi.mock('./NFTProvider', () => ({
  NFTProvider: vi.fn(({ children }) => <div>{children}</div>),
}));

describe('NFTView', () => {
  beforeEach(() => {
    (useIsMounted as Mock).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly when mounted', () => {
    const { getByTestId, getByText } = render(
      <NFTView contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTView>,
    );

    expect(getByTestId('ockNFTView_Container')).toBeInTheDocument();
    expect(getByText('Child Component')).toBeInTheDocument();
    expect(getByTestId('ockNFTView_Container')).toHaveClass('test-class');
  });

  it('should not render when not mounted', () => {
    (useIsMounted as Mock).mockReturnValue(false);

    const { queryByTestId } = render(
      <NFTView contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTView>,
    );

    expect(queryByTestId('ockNFTView_Container')).not.toBeInTheDocument();
  });

  it('should pass contractAddress and tokenId to NFTProvider', () => {
    render(
      <NFTView contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NFTView>,
    );

    expect(NFTProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: '0x123',
        tokenId: '1',
      }),
      {},
    );
  });
});
