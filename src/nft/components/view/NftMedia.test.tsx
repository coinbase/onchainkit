import '@testing-library/jest-dom';
import { fireEvent, render } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { LifecycleType } from '../../types';
import { useNftLifecycleContext } from '../NftLifecycleProvider';
import { useNftContext } from '../NftProvider';
import { NftMedia } from './NftMedia';

vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));
vi.mock('../NftLifecycleProvider', () => ({
  useNftLifecycleContext: vi.fn(),
}));

vi.mock('./NftImage', () => ({
  NftImage: ({ onLoading, onLoaded, onError }) => {
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

vi.mock('./NftVideo', () => ({
  NftVideo: () => <div>Video</div>,
}));

vi.mock('./NftAudio', () => ({
  NftAudio: () => <div>Audio</div>,
}));

describe('NftMedia', () => {
  let mockUpdateLifecycleStatus: Mock;
  beforeEach(() => {
    mockUpdateLifecycleStatus = vi.fn();
    (useNftContext as Mock).mockReturnValue({ mimeType: 'image/png' });
    (useNftLifecycleContext as Mock).mockReturnValue({
      type: LifecycleType.VIEW,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });
  });

  it('should render NftImage when mimeType is an image', () => {
    const { getByText } = render(<NftMedia />);
    expect(getByText('Image')).toBeInTheDocument();
  });

  it('should render NftImage and NftAudio when mimtType is an audio', () => {
    (useNftContext as Mock).mockReturnValue({ mimeType: 'audio/mp3' });
    const { getByText } = render(<NftMedia />);
    expect(getByText('Image')).toBeInTheDocument();
    expect(getByText('Audio')).toBeInTheDocument();
  });

  it('should render NftVideo when mimeType is a video', () => {
    (useNftContext as Mock).mockReturnValue({ mimeType: 'video/mp4' });
    const { getByText } = render(<NftMedia />);
    expect(getByText('Video')).toBeInTheDocument();
  });

  it('should call updateLifecycleStatus with mediaLoading when media starts loading', () => {
    const { getByText } = render(<NftMedia />);
    fireEvent.click(getByText('ImageLoading'));
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'mediaLoading',
      statusData: {
        mimeType: 'image/png',
        mediaUrl: expect.any(String),
      },
    });
  });

  it('should call updateLifecycleStatus with success when media is loaded for type View', () => {
    const { getByText } = render(<NftMedia />);
    fireEvent.click(getByText('ImageLoaded'));
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'success',
    });
  });

  it('should call updateLifecycleStatus with mediaLoaded when media is loaded for type Mint', () => {
    (useNftLifecycleContext as Mock).mockReturnValue({
      type: LifecycleType.MINT,
      updateLifecycleStatus: mockUpdateLifecycleStatus,
    });

    const { getByText } = render(<NftMedia />);
    fireEvent.click(getByText('ImageLoaded'));
    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'mediaLoaded',
    });
  });

  it('should call updateLifecycleStatus with error when media fails to load', () => {
    const { getByText } = render(<NftMedia />);
    fireEvent.click(getByText('ImageError'));

    expect(mockUpdateLifecycleStatus).toHaveBeenCalledWith({
      statusName: 'error',
      statusData: expect.any(Object),
    });
  });
});
