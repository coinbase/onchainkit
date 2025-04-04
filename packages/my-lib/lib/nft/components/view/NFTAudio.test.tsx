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
import { NFTAudio } from './NFTAudio';

const mockAnimationUrl = 'https://example.com/audio.mp3';

vi.mock('@/nft/components/NFTProvider', () => ({
  useNFTContext: vi.fn(),
}));

describe('NFTAudio', () => {
  beforeEach(() => {
    (useNFTContext as Mock).mockReturnValue({
      animationUrl: mockAnimationUrl,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const { getByTestId } = render(<NFTAudio />);
    expect(getByTestId('ockNFTAudio')).toBeInTheDocument();
  });

  it('should call onLoading when audio starts loading', () => {
    const onLoading = vi.fn();
    const { getByTestId } = render(<NFTAudio onLoading={onLoading} />);
    fireEvent.loadStart(getByTestId('ockNFTAudio'));
    expect(onLoading).toHaveBeenCalledWith(mockAnimationUrl);
  });

  it('should call onLoaded when audio is loaded', () => {
    const onLoaded = vi.fn();
    const { getByTestId } = render(<NFTAudio onLoaded={onLoaded} />);
    fireEvent.loadedData(getByTestId('ockNFTAudio'));
    expect(onLoaded).toHaveBeenCalled();
  });

  it('should handle error when audio fails to load', () => {
    const onError = vi.fn();

    const { getByTestId } = render(<NFTAudio onError={onError} />);

    fireEvent.error(getByTestId('ockNFTAudio'));

    expect(onError).toHaveBeenCalledWith({
      error: 'error',
      code: 'NmNAc01',
      message: 'Error loading audio',
    });
  });

  it('should handle string error when audio fails to load', () => {
    const onError = vi.fn();

    const { getByTestId } = render(<NFTAudio onError={onError} />);

    getByTestId('ockNFTAudio').onerror?.('string error');

    expect(onError).toHaveBeenCalledWith({
      error: 'string error',
      code: 'NmNAc01',
      message: 'Error loading audio',
    });
  });

  it('should reset state when audio ends', () => {
    const { getByTestId } = render(<NFTAudio />);
    const audio = getByTestId('ockNFTAudio') as HTMLAudioElement;

    fireEvent.ended(audio);
    expect(audio.paused).toBe(true);
  });

  it('should play when button is clicked', () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() =>
      Promise.resolve(),
    );
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});

    const { getByRole, getByTestId } = render(<NFTAudio />);
    const button = getByRole('button');
    const audio = getByTestId('ockNFTAudio') as HTMLAudioElement;

    // play
    fireEvent.click(button);
    expect(audio.play).toHaveBeenCalled();

    // pause
    fireEvent.click(button);
    expect(audio.pause).toHaveBeenCalled();
  });

  it('should not render if animationUrl is not provided', () => {
    (useNFTContext as Mock).mockReturnValue({
      animationUrl: null,
    });
    const { container } = render(<NFTAudio />);
    expect(container).toBeEmptyDOMElement();
  });
});
