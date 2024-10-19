import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { NftAudio } from './NftAudio';
import {
  type Mock,
  vi,
  beforeEach,
  afterEach,
  describe,
  it,
  expect,
} from 'vitest';
import { useNftContext } from '../NftProvider';

const mockAnimationUrl = 'https://example.com/audio.mp3';

vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));

describe('NftAudio', () => {
  beforeEach(() => {
    (useNftContext as Mock).mockReturnValue({
      animationUrl: mockAnimationUrl,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const { getByTestId, unmount } = render(<NftAudio />);
    expect(getByTestId('ockNftAudio')).toBeInTheDocument();
    unmount();
  });

  it('should call onLoading when audio starts loading', () => {
    const onLoading = vi.fn();
    const { getByTestId } = render(<NftAudio onLoading={onLoading} />);
    fireEvent.loadStart(getByTestId('ockNftAudio'));
    expect(onLoading).toHaveBeenCalledWith(mockAnimationUrl);
  });

  it('should call onLoaded when audio is loaded', () => {
    const onLoaded = vi.fn();
    const { getByTestId } = render(<NftAudio onLoaded={onLoaded} />);
    fireEvent.loadedData(getByTestId('ockNftAudio'));
    expect(onLoaded).toHaveBeenCalled();
  });

  it('should handle error when audio fails to load', () => {
    const onError = vi.fn();

    const { getByTestId } = render(<NftAudio onError={onError} />);

    fireEvent.error(getByTestId('ockNftAudio'));

    expect(onError).toHaveBeenCalledWith({
      error: 'error',
      code: 'NmNAc01',
      message: 'Error loading audio',
    });
  });

  it('should handle string error when audio fails to load', () => {
    const onError = vi.fn();

    const { getByTestId } = render(<NftAudio onError={onError} />);

    getByTestId('ockNftAudio').onerror?.('string error');

    expect(onError).toHaveBeenCalledWith({
      error: 'string error',
      code: 'NmNAc01',
      message: 'Error loading audio',
    });
  });

  it('should reset state when audio ends', () => {
    const { getByTestId } = render(<NftAudio />);
    const audio = getByTestId('ockNftAudio') as HTMLAudioElement;

    fireEvent.ended(audio);
    expect(audio.paused).toBe(true);
  });

  it('should play when button is clicked', () => {
    vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() =>
      Promise.resolve(),
    );
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});

    const { getByRole, getByTestId } = render(<NftAudio />);
    const button = getByRole('button');
    const audio = getByTestId('ockNftAudio') as HTMLAudioElement;

    // play
    fireEvent.click(button);
    expect(audio.play).toHaveBeenCalled();

    // pause
    fireEvent.click(button);
    expect(audio.pause).toHaveBeenCalled();
  });

  it('should not render if animationUrl is not provided', () => {
    (useNftContext as Mock).mockReturnValue({
      animationUrl: null,
    });
    const { container } = render(<NftAudio />);
    expect(container).toBeEmptyDOMElement();
  });
});
