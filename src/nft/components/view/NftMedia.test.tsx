import { render, fireEvent } from '@testing-library/react';
import { NftMedia } from './NftMedia';
import { useNftContext } from '../NftProvider';
import { useNftLifecycleContext } from '../NftLifecycleProvider';
import { LifecycleType } from '../../types';
import { type Mock, vi, beforeEach, describe, it, expect } from 'vitest';

// Mock the context hooks
vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));
vi.mock('../NftLifecycleProvider', () => ({
  useNftLifecycleContext: vi.fn(),
}));

vi.mock('./NftImage', () => ({
  NftImage: ({onLoading, onLoaded, onError}) => (
    <>
      <div>Image</div>
      <button type="button" onClick={() => onLoading('')}>ImageLoading</button>
      <button type="button" onClick={onLoaded}>ImageLoaded</button>
      <button type="button" onClick={onError}>ImageError</button>
    </>,
  ),
}));

vi.mock('./NftVideo', () => ({ 
  NftVideo: () => <div>Video</div>
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