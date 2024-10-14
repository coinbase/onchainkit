import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { NftProvider } from './NftProvider';
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
import { NftView } from './NftView';

vi.mock('../../useTheme', () => ({
  useTheme: vi.fn(() => 'default-light'),
}));
vi.mock('../../useIsMounted');
vi.mock('./NftProvider', () => ({
  NftProvider: vi.fn(({ children }) => <div>{children}</div>),
}));

describe('NftView', () => {
  beforeEach(() => {
    (useIsMounted as Mock).mockReturnValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly when mounted', () => {
    const { getByTestId, getByText } = render(
      <NftView contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NftView>,
    );

    expect(getByTestId('ockNftView_Container')).toBeInTheDocument();
    expect(getByText('Child Component')).toBeInTheDocument();
    expect(getByTestId('ockNftView_Container')).toHaveClass('test-class');
  });

  it('should not render when not mounted', () => {
    (useIsMounted as Mock).mockReturnValue(false);

    const { queryByTestId } = render(
      <NftView contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NftView>,
    );

    expect(queryByTestId('ockNftMint_Container')).not.toBeInTheDocument();
  });

  it('should pass contractAddress and tokenId to NftProvider', () => {
    render(
      <NftView contractAddress="0x123" tokenId="1" className="test-class">
        <div>Child Component</div>
      </NftView>,
    );

    expect(NftProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        contractAddress: '0x123',
        tokenId: '1',
      }),
      {},
    );
  });
});
