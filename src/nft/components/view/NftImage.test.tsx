import '@testing-library/jest-dom';
import { act } from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { type Mock, vi, beforeEach, describe, it, expect } from 'vitest';
import { useNftContext } from '../NftProvider';
import { NftImage } from './NftImage';

const mockContext = {
  imageUrl: 'https://example.com/nft-image.png',
  description: 'Test NFT Image',
};

vi.mock('../NftProvider', () => ({
  useNftContext: vi.fn(),
}));

describe('NftImage', () => {
  beforeEach(() => {
    (useNftContext as Mock).mockReturnValue(mockContext);

    // mock Image constructor to call load/error events based on src
    Object.defineProperty(global.Image.prototype, 'src', {
      // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: test
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
    const { getByTestId } = render(<NftImage />);
    expect(getByTestId('ock-defaultNftSvg')).toBeInTheDocument();
  });

  it('should call onLoading with the image URL', () => {
    const onLoading = vi.fn();
    render(<NftImage onLoading={onLoading} />);
    expect(onLoading).toHaveBeenCalledWith(mockContext.imageUrl);
  });

  it('should call onLoaded when the image loads successfully', async () => {
    (useNftContext as Mock).mockReturnValue({
      imageUrl: 'loaded',
      description: 'Test NFT Image',
    });
    const onLoaded = vi.fn();
    render(<NftImage onLoaded={onLoaded} />);
    await waitFor(() => expect(onLoaded).toHaveBeenCalled());
  });

  it('should call onError when the image fails to load', async () => {
    (useNftContext as Mock).mockReturnValue({
      imageUrl: 'error',
      description: 'Test NFT Image',
    });
    const onError = vi.fn();
    render(<NftImage onError={onError} />);
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith({
        error: 'mocked error',
        code: 'NmNIc01',
        message: 'Error loading image',
      }),
    );
  });

  it('should call onError when there is a uiEvent error', async () => {
    (useNftContext as Mock).mockReturnValue({
      imageUrl: 'uiEventError',
      description: 'Test NFT Image',
    });
    const onError = vi.fn();
    render(<NftImage onError={onError} />);
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith({
        error: 'mocked error',
        code: 'NmNIc01',
        message: 'Error loading image',
      }),
    );
  });

  it('should hide the svg on transition end', async () => {
    (useNftContext as Mock).mockReturnValue({
      imageUrl: 'transitionend',
      description: 'Test NFT Image',
    });
    const { getByTestId, queryByTestId } = render(<NftImage />);
    await act(async () => {
      fireEvent.transitionEnd(getByTestId('ockNftImage'));
    });
    expect(queryByTestId('ock-defaultNftSvg')).toBeNull();
  });

  it('should retry loading the image when retry button is clicked', async () => {
    (useNftContext as Mock).mockReturnValue({
      imageUrl: 'error',
      description: 'Test NFT Image',
    });
    const onError = vi.fn();
    const { getByText } = render(<NftImage onError={onError} />);
    await waitFor(() => expect(onError).toHaveBeenCalled());

    fireEvent.click(getByText('retry'));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(2));
  });

  it('should apply the provided className', () => {
    const { container } = render(<NftImage className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('should handle errors in the try-catch block', async () => {
    const onError = vi.fn();
    const errorMessage = 'Error decoding image';
    global.Image.prototype.decode = vi
      .fn()
      .mockRejectedValue(new Error(errorMessage));
    render(<NftImage onError={onError} />);
    await waitFor(() =>
      expect(onError).toHaveBeenCalledWith({
        error: errorMessage,
        code: 'NmNIc02',
        message: 'Error decoding image',
      }),
    );
  });
});
