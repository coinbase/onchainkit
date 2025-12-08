import '@testing-library/jest-dom';
import { useNFTContext } from '@/nft/components/NFTProvider';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { NFTImage } from './NFTImage';

const mockContext = {
  imageUrl: 'https://example.com/nft-image.png',
  description: 'Test NFT Image',
};

vi.mock('@/nft/components/NFTProvider', () => ({
  useNFTContext: vi.fn(),
}));

describe('NFTImage', () => {
  beforeEach(() => {
    (useNFTContext as Mock).mockReturnValue(mockContext);

    // mock Image constructor to call load/error events based on src
    Object.defineProperty(global.Image.prototype, 'src', {
      set(src) {
        if (src === 'error' && this.onerror) {
          this.onerror('mocked error');
        }
        if (src === 'uiEventError' && this.onerror) {
          this.onerror({ type: 'mocked error' });
        }
        if (src === 'loaded' && this.onload) {
          this.onload();
        }
      },
    });
  });

  it('should render default SVG while loading', () => {
    const { getByTestId } = render(<NFTImage />);
    expect(getByTestId('ock-defaultNFTSvg')).toBeInTheDocument();
  });

  it('should call onLoading with the image URL', () => {
    const onLoading = vi.fn();
    render(<NFTImage onLoading={onLoading} />);
    expect(onLoading).toHaveBeenCalledWith(mockContext.imageUrl);
  });

  it('should call onLoaded when the image loads successfully', async () => {
    (useNFTContext as Mock).mockReturnValue({
      imageUrl: 'loaded',
      description: 'Test NFT Image',
    });
    const onLoaded = vi.fn();
    render(<NFTImage onLoaded={onLoaded} />);
    await waitFor(() => expect(onLoaded).toHaveBeenCalled());
  });

  it('should call onError when the image fails to load', async () => {
    (useNFTContext as Mock).mockReturnValue({
      imageUrl: 'error',
      description: 'Test NFT Image',
    });
    const onError = vi.fn();
    render(<NFTImage onError={onError} />);
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith({
        error: 'mocked error',
        code: 'NmNIc01',
        message: 'Error loading image',
      }),
    );
  });

  it('should call onError when there is a uiEvent error', async () => {
    (useNFTContext as Mock).mockReturnValue({
      imageUrl: 'uiEventError',
      description: 'Test NFT Image',
    });
    const onError = vi.fn();
    render(<NFTImage onError={onError} />);
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith({
        error: 'mocked error',
        code: 'NmNIc01',
        message: 'Error loading image',
      }),
    );
  });

  it('should retry loading the image when retry button is clicked', async () => {
    (useNFTContext as Mock).mockReturnValue({
      imageUrl: 'error',
      description: 'Test NFT Image',
    });
    const onError = vi.fn();
    const { getByText } = render(<NFTImage onError={onError} />);
    await waitFor(() => expect(onError).toHaveBeenCalled());

    fireEvent.click(getByText('retry'));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(2));
  });

  it('should apply the provided className', () => {
    const { container } = render(<NFTImage className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
