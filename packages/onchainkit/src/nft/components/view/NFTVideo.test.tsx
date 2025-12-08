import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
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
import { NFTVideo } from './NFTVideo';

vi.mock('@/nft/components/NFTProvider', () => ({
  useNFTContext: vi.fn(),
}));

const mockAnimationUrl = 'http://example.com/video.mp4';
const mockImageUrl = 'http://example.com/image.jpg';

describe('NFTVideo', () => {
  beforeEach(() => {
    (useNFTContext as Mock).mockReturnValue({
      animationUrl: mockAnimationUrl,
      imageUrl: mockImageUrl,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render default SVG when no animationUrl is provided', () => {
    (useNFTContext as Mock).mockReturnValue({
      animationUrl: null,
      imageUrl: mockImageUrl,
    });

    const { getByRole } = render(<NFTVideo />);

    expect(getByRole('img')).toBeInTheDocument();
  });

  it('should render video element when animationUrl is provided', () => {
    const { getByTestId } = render(<NFTVideo />);

    expect(getByTestId('ockNFTVideo')).toBeInTheDocument();
  });

  it('should call onLoading when video starts loading', () => {
    const onLoading = vi.fn();

    const { getByTestId } = render(<NFTVideo onLoading={onLoading} />);

    fireEvent.loadStart(getByTestId('ockNFTVideo'));

    expect(onLoading).toHaveBeenCalledWith(mockAnimationUrl);
  });

  it('should call onLoaded when video has loaded', () => {
    const onLoaded = vi.fn();

    const { getByTestId } = render(<NFTVideo onLoaded={onLoaded} />);

    fireEvent.loadedData(getByTestId('ockNFTVideo'));

    expect(onLoaded).toHaveBeenCalled();
  });

  it('should handle error when video fails to load', () => {
    const onError = vi.fn();

    const { getByTestId } = render(<NFTVideo onError={onError} />);

    fireEvent.error(getByTestId('ockNFTVideo'));

    expect(onError).toHaveBeenCalledWith({
      error: 'error',
      code: 'NmNVc01',
      message: 'Error loading video',
    });
  });

  it('should handle string error when video fails to load', () => {
    const onError = vi.fn();

    const { getByTestId } = render(<NFTVideo onError={onError} />);

    getByTestId('ockNFTVideo').onerror?.('string error');

    expect(onError).toHaveBeenCalledWith({
      error: 'string error',
      code: 'NmNVc01',
      message: 'Error loading video',
    });
  });

  it('should not propagate click event on video', () => {
    const parentClick = vi.fn();
    const { getByTestId } = render(
      <button type="button" onClick={parentClick}>
        <NFTVideo />
      </button>,
    );

    fireEvent.click(getByTestId('ockNFTVideo'));

    expect(parentClick).not.toHaveBeenCalled();
  });
});
