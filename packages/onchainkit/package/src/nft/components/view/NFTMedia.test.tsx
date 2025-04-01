import '@testing-library/jest-dom';
import { useNFTLifecycleContext } from '@/nft/components/NFTLifecycleProvider';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { LifecycleType } from '@/nft/types';
import { fireEvent, render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { NFTMedia } from './NFTMedia';

vi.mock('@/nft/components/NFTProvider', () => ({
  useNFTContext: vi.fn(),
}));
vi.mock('@/nft/components/NFTLifecycleProvider', () => ({
  useNFTLifecycleContext: vi.fn(),
}));

vi.mock('./NFTImage', () => ({
  NFTImage: ({
    onLoading,
    onLoaded,
    onError,
  }: {
    onLoading: (mediaUrl: string) => void;
    onLoaded: () => void;
    onError: () => void;
  }) => {
    return (
      <>
        <div>Image</div>
        <button type="button" onClick={() => onLoading('')}>
          ImageLoading
        </button>
        <button type="button" onClick={onLoaded}>
          ImageLoaded
        </button>
        <button type="button" onClick={onError}>
          ImageError
        </button>
      </>
    );
  },
}));

vi.mock('./NFTVideo', () => ({
  NFTVideo: () => <div>Video</div>,
}));

vi.mock('./NFTAudio', () => ({
  NFTAudio: () => <div>Audio</div>,
}));

describe('NFTMedia', () => {
  let mockUpdateLifecycleStatus: Mock;
  beforeEach(() => {
    mockUpdateLifecycleStatus = vi.fn();
    (useNFTContext as Mock).mockReturnValue({ mimeType: 'image/png' });
    (useNFTLifecycleContext as Mock).mockReturnValue({
      type: LifecycleType.VIEW,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });
  });

  it('should render NFTImage when mimeType is an image', () => {
    const { getByText } = render(<NFTMedia />);
    expect(getByText('Image')).toBeInTheDocument();
  });

  it('should render NFTImage and NFTAudio when mimtType is an audio', () => {
    (useNFTContext as Mock).mockReturnValue({ mimeType: 'audio/mp3' });
    const { getByText } = render(<NFTMedia />);
    expect(getByText('Image')).toBeInTheDocument();
    expect(getByText('Audio')).toBeInTheDocument();
  });

  it('should render NFTVideo when mimeType is a video', () => {
    (useNFTContext as Mock).mockReturnValue({ mimeType: 'video/mp4' });
    const { getByText } = render(<NFTMedia />);
    expect(getByText('Video')).toBeInTheDocument();
  });

  it('should render NFTImage when mimeType is unknown', () => {
    (useNFTContext as Mock).mockReturnValue({ mimeType: 'something/else' });
    const { getByText } = render(<NFTMedia />);
    expect(getByText('Image')).toBeInTheDocument();
  });

  it('should call updateLifecycleStatus with mediaLoading when media starts loading', () => {
    const { getByText } = render(<NFTMedia />);
    fireEvent.click(getByText('ImageLoading'));
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'mediaLoading',
      statusData: {
        mediaType: 'image',
        mediaUrl: expect.any(String),
      },
    });
  });

  it('should call updateLifecycleStatus with success when media is loaded for type View', () => {
    const { getByText } = render(<NFTMedia />);
    fireEvent.click(getByText('ImageLoaded'));
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
    });
  });

  it('should call updateLifecycleStatus with mediaLoaded when media is loaded for type Mint', () => {
    (useNFTLifecycleContext as Mock).mockReturnValue({
      type: LifecycleType.MINT,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    const { getByText } = render(<NFTMedia />);
    fireEvent.click(getByText('ImageLoaded'));
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'mediaLoaded',
    });
  });

  it('should call updateLifecycleStatus with error when media fails to load', () => {
    const { getByText } = render(<NFTMedia />);
    fireEvent.click(getByText('ImageError'));

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: expect.any(Object),
    });
  });
});
